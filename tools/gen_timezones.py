#!/usr/bin/env python3
"""Generate offline timezone rules and the matching web catalog from IANA tzdata."""

import argparse
import hashlib
import json
import re
import struct
import subprocess
import tarfile
import tempfile
from pathlib import Path

VERSION = "2026f"
SHA256 = "01b4a91cec5167ed48c11e8ab78f2048cead78ce94b0cafcad0ae8c5a3044d3d"
SINCE = 1577836800  # 2020-01-01 UTC; matches the device's usable clock era.
FILES = ("africa", "antarctica", "asia", "australasia", "europe", "northamerica",
         "southamerica", "etcetera", "factory", "backward")
LEGACY = {
    "Europe/Kaliningrad": "EET-2",
    "Europe/Moscow": "MSK-3",
    "Europe/Samara": "SAMT-4",
    "Asia/Yekaterinburg": "YEKT-5",
    "Asia/Omsk": "OMST-6",
    "Asia/Krasnoyarsk": "KRAT-7",
    "Asia/Irkutsk": "IRKT-8",
    "Asia/Yakutsk": "YAKT-9",
    "Asia/Vladivostok": "VLAT-10",
    "Asia/Magadan": "MAGT-11",
    "Asia/Kamchatka": "PETT-12",
    "Europe/London": "GMT0BST,M3.5.0/1,M10.5.0",
    "Europe/Berlin": "CET-1CEST,M3.5.0,M10.5.0/3",
    "America/New_York": "EST5EDT,M3.2.0,M11.1.0",
    "Etc/UTC": "UTC0",
}

NAME = r"(?:[a-zA-Z]{3,}|<[+\-a-zA-Z0-9]+>)"
HMS = r"[+-]?\d+(?::\d+(?::\d+)?)?"


def seconds(text):
    sign = -1 if text.startswith("-") else 1
    fields = [int(field) for field in text.lstrip("+-").split(":")]
    return sign * sum(value * unit for value, unit in zip(fields, (3600, 60, 1)))


def date_rule(rule):
    date, _, time = rule.partition("/")
    at = seconds(time) if time else 7200
    if date.startswith("M"):
        month, week, weekday = map(int, date[1:].split("."))
        return (3, month, week, weekday, at)
    if date.startswith("J"):
        return (2, int(date[1:]), 0, 0, at)
    return (1, int(date), 0, 0, at)


def parse_footer(text):
    if not text:
        return None
    match = re.fullmatch(rf"{NAME}({HMS})(?:{NAME}({HMS})?,([^,]+),([^,]+))?", text)
    if not match:
        raise ValueError(f"unsupported TZif footer: {text}")
    standard, dst, start, end = match.groups()
    standard = -seconds(standard)
    if not start:
        return (standard, standard, (0,) * 5, (0,) * 5)
    return (standard, -seconds(dst) if dst else standard + 3600,
            date_rule(start), date_rule(end))


def tzif(path):
    data = path.read_bytes()
    assert data[:5] in (b"TZif2", b"TZif3", b"TZif4")
    utc, std, leap, times, types, chars = struct.unpack_from(">6I", data, 20)
    header = 44 + 5 * times + 6 * types + chars + 8 * leap + std + utc
    utc, std, leap, times, types, chars = struct.unpack_from(">6I", data, header + 20)
    start = header + 44
    dates = struct.unpack_from(f">{times}q", data, start)
    indices = data[start + 8 * times:start + 9 * times]
    start += 9 * times
    offsets = [struct.unpack_from(">iB", data, start + 6 * i) for i in range(types)]
    start += 6 * types + chars + 12 * leap + std + utc
    footer = parse_footer(data[start:].decode("ascii").strip("\n"))
    transitions = tuple((date, *offsets[index]) for date, index in zip(dates, indices))
    # zic -r can emit a sentinel at the lower end; only supported times are retained.
    initial = next((entry[1:] for entry in reversed(transitions) if entry[0] <= SINCE),
                   offsets[0])
    return initial, tuple(entry for entry in transitions if entry[0] > SINCE), footer


def c_rows(name, c_type, rows):
    return [f"static const {c_type} {name}[] = {{", *[f"    {row}," for row in rows], "};", ""]


def c_tuple(values):
    return "{" + ", ".join(c_tuple(v) if isinstance(v, tuple) else str(v) for v in values) + "}"


def generate(src, zic):
    files = [src / name for name in FILES]
    zones, aliases = set(), {}
    for path in files:
        for line in path.read_text().splitlines():
            fields = line.partition("#")[0].split()
            if fields and fields[0] == "Zone":
                zones.add(fields[1])
            if fields and fields[0] == "Link":
                aliases[fields[2]] = fields[1]
    ids = sorted(zones)
    ids_to_index = {name: index for index, name in enumerate(ids)}
    for name in aliases:
        target = aliases[name]
        while target not in zones:
            target = aliases[target]
        aliases[name] = target
    output = src / "compiled"
    subprocess.run([zic, "-b", "slim", "-r", f"@{SINCE}", "-d", str(output),
                    *map(str, files)], check=True)

    footers, transitions, rules = {}, {}, {}
    all_times = []

    def rule_index(initial, changes, footer):
        footer_index = -1 if footer is None else footers.setdefault(footer, len(footers))
        if changes not in transitions:
            transitions[changes] = len(all_times)
            all_times.extend(changes)
        rule = (transitions[changes], len(changes), *initial, footer_index)
        return rules.setdefault(rule, len(rules))

    zone_rows = [(name, rule_index(*tzif(output / name))) for name in ids]
    for name, posix in LEGACY.items():
        footer = parse_footer(posix)
        rule = rule_index((footer[0], 0), (), footer)
        zone_rows.append(("utc" if name == "Etc/UTC" else name.lower(), rule))

    assert max(map(len, [*ids, *aliases])) < 64
    assert max(len(zone_rows), len(rules), len(all_times)) < 65535
    assert all(0 < date - SINCE <= 0xffffffff for date, _, _ in all_times)
    lines = [f"/* Generated from public-domain IANA tzdb {VERSION} by tools/gen_timezones.py. */",
             f'#define TZDB_VERSION "{VERSION}"', f"#define TZDB_SINCE {SINCE}",
             f"#define TZDB_CANONICAL_COUNT {len(ids)}", ""]
    lines += c_rows("k_tz_footers", "tz_footer_t", map(c_tuple, footers))
    lines += c_rows("k_tz_dates", "uint32_t", (str(date - SINCE) for date, _, _ in all_times))
    lines += c_rows("k_tz_offsets", "int32_t",
                    (str(2 * offset + is_dst) for _, offset, is_dst in all_times))
    lines += c_rows("k_tz_rules", "tz_rule_t", map(c_tuple, rules))
    lines += c_rows("k_zones", "device_timezone_t",
                    (c_tuple((json.dumps(name), rule)) for name, rule in zone_rows))
    lines += c_rows("k_tz_aliases", "tz_alias_t",
                    (c_tuple((json.dumps(name), ids_to_index[target]))
                     for name, target in sorted(aliases.items())))
    lines += c_rows("k_tz_legacy_targets", "uint16_t", (str(ids_to_index[name]) for name in LEGACY))
    catalog = json.dumps({"version": VERSION, "zones": ids}, separators=(",", ":")) + "\n"
    return "\n".join(lines), catalog


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path, help=f"official tzdata{VERSION}.tar.gz")
    parser.add_argument("--zic", default="zic")
    args = parser.parse_args()
    if hashlib.sha256(args.archive.read_bytes()).hexdigest() != SHA256:
        parser.error(f"not the expected IANA tzdata{VERSION} archive")
    compiler = subprocess.check_output([args.zic, "--version"], text=True).strip()
    if not compiler.endswith(f" {VERSION}"):
        parser.error(f"expected matching IANA zic {VERSION}, got {compiler!r}")
    with tempfile.TemporaryDirectory() as work, tarfile.open(args.archive) as archive:
        src = Path(work)
        for name in FILES:
            with archive.extractfile(name) as source:
                (src / name).write_bytes(source.read())
        firmware, web = generate(src, args.zic)
    root = Path(__file__).resolve().parents[1]
    (root / "components/settings/device_timezone_data.inc").write_text(firmware, encoding="ascii")
    (root / "data/www/timezones.json").write_text(web, encoding="ascii")


if __name__ == "__main__":
    main()
