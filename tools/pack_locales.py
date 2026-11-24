#!/usr/bin/env python3
"""Split translator-facing JSON packs into flat assets for LittleFS and OTA."""

import argparse
import json
import re
import sys
from pathlib import Path

SCHEMA = 1
# Keep the code, device payload and registry limits in sync with device_locale.c.
CODE = re.compile(r"[a-z]{2,3}(?:-[a-zA-Z0-9]{2,8})*")
KEY = re.compile(r"[a-zA-Z0-9_.-]+")
PACK_FILE = re.compile(r"locale-[a-zA-Z0-9-]+-(?:device|web)\.json(?:\.gz)?")
DEVICE_FILE_MAX = 16 * 1024
WEB_FILE_MAX = 192 * 1024
PACK_COUNT_MAX = 15
BUILTIN = {"code": "en", "name": "English"}


def no_duplicates(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f"duplicate key: {key}")
        result[key] = value
    return result


def usable_value(value, max_bytes, allowed_controls=""):
    return (
        isinstance(value, str)
        and value.strip()
        and len(value.encode("utf-8")) <= max_bytes
        and all(
            not (ord(ch) < 32 or 127 <= ord(ch) < 160) or ch in allowed_controls
            for ch in value
        )
    )


def encode(value):
    return (json.dumps(value, ensure_ascii=False, separators=(",", ":"), sort_keys=True) + "\n").encode(
        "utf-8"
    )


def package(path):
    try:
        pack = json.loads(path.read_text(encoding="utf-8"), object_pairs_hook=no_duplicates)
        if not isinstance(pack, dict) or type(pack.get("schema")) is not int or pack["schema"] != SCHEMA:
            raise ValueError(f"expected a catalog with schema {SCHEMA}")
        code = pack.get("code")
        if not isinstance(code, str) or not CODE.fullmatch(code) or not 2 <= len(code) < 16:
            raise ValueError("invalid locale code")
        if code != path.stem or code == BUILTIN["code"]:
            raise ValueError("locale code must match the filename and differ from 'en'")
        name = pack.get("name")
        if not usable_value(name, 47):
            raise ValueError("name must be a non-empty autonym of at most 47 UTF-8 bytes")

        payloads = {}
        for surface, max_text, max_file, allowed_controls in (
            ("device", 240, DEVICE_FILE_MAX, ""),
            ("web", 4096, WEB_FILE_MAX, "\n\t\r"),
        ):
            strings = pack.get(surface)
            if not isinstance(strings, dict):
                raise ValueError(f"{surface} must be a JSON object")
            for key, value in strings.items():
                if not KEY.fullmatch(key) or not usable_value(value, max_text, allowed_controls):
                    raise ValueError(f"invalid {surface} entry: {key}")
            data = encode({"schema": SCHEMA, "code": code, "strings": strings})
            if len(data) > max_file:
                raise ValueError(f"{surface} dictionary exceeds {max_file} bytes")
            payloads[f"locale-{code}-{surface}.json"] = data
        return {"code": code, "name": name}, payloads
    except (ValueError, UnicodeError) as error:
        raise ValueError(f"{path}: {error}") from error


def stage(source, www):
    if not source.is_dir() or not www.is_dir():
        raise ValueError("the locale source directory and staged www directory must exist")
    locales = [BUILTIN]
    codes = {BUILTIN["code"]}
    payloads = {}
    for path in sorted(source.glob("*.json")):
        locale, files = package(path)
        code = locale["code"].lower()
        if code in codes:
            raise ValueError(f"{path}: duplicate locale code")
        codes.add(code)
        locales.append(locale)
        payloads.update(files)
    if len(locales) > PACK_COUNT_MAX + 1:
        raise ValueError(f"at most {PACK_COUNT_MAX} additional languages fit the registry")
    payloads["locales.json"] = encode({"schema": SCHEMA, "locales": locales})

    for path in www.iterdir():
        if path.is_file() and (path.name == "locales.json.gz" or PACK_FILE.fullmatch(path.name)):
            path.unlink()
    for name, data in payloads.items():
        (www / name).write_bytes(data)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True, help="directory with author JSON packs")
    parser.add_argument("--www", type=Path, required=True, help="staged flat www directory")
    args = parser.parse_args()
    try:
        stage(args.source, args.www)
    except (ValueError, OSError) as error:
        print(f"pack_locales: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
