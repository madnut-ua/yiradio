#!/usr/bin/env python3
"""Apply the Ya.Music build profile to a fresh copy of data/, before gzip.

The ON profile leaves the fresh copy intact. The OFF profile removes sections
delimited by standalone YA_MUSIC_BEGIN/END comments using each asset's syntax.
"""

import argparse
from pathlib import Path


MARKERS = {
    ".html": (b"<!-- YA_MUSIC_BEGIN -->", b"<!-- YA_MUSIC_END -->"),
    ".js": (b"/* YA_MUSIC_BEGIN */", b"/* YA_MUSIC_END */"),
    ".css": (b"/* YA_MUSIC_BEGIN */", b"/* YA_MUSIC_END */"),
}
SETTINGS_KEYS = {b"yandex_music", b"last_yandex"}
REMOTE_KEYS = {b"like", b"dislike", b"source_yandex"}


def strip_blocks(path: Path, raw: bytes) -> bytes:
    begin, end = MARKERS[path.suffix]
    keep = []
    start = None
    for number, line in enumerate(raw.splitlines(keepends=True), 1):
        marker = line.strip()
        if marker == begin:
            if start is not None:
                raise ValueError(f"{path}:{number}: nested YA_MUSIC_BEGIN")
            start = number
        elif marker == end:
            if start is None:
                raise ValueError(f"{path}:{number}: unmatched YA_MUSIC_END")
            start = None
        elif start is None:
            keep.append(line)
    if start is not None:
        raise ValueError(f"{path}:{start}: unclosed YA_MUSIC_BEGIN")
    return b"".join(keep)


def filter_rows(raw: bytes, keys: set[bytes], last_source: bool) -> bytes:
    # These are firmware key,value files, not quoted CSV. Retain all other
    # bytes (including comments, ordering, and line endings).
    keep = []
    for line in raw.splitlines(keepends=True):
        key, comma, value = line.partition(b",")
        if comma and (key in keys or (
            last_source and key == b"last_source" and value.rstrip(b"\r\n") == b"yandex"
        )):
            continue
        keep.append(line)
    return b"".join(keep)


def read_stage_file(path: Path) -> bytes:
    if path.is_symlink() or not path.is_file() or path.stat().st_nlink != 1:
        raise ValueError(f"expected a copied staging file: {path}")
    return path.read_bytes()


def stage_profile(stage: Path, enabled: bool) -> None:
    stage = stage.resolve()
    source = Path(__file__).resolve().parents[1] / "data"
    if stage.is_relative_to(source.resolve()):
        raise ValueError("use a staging copy, not the source data directory")
    www = stage / "www"
    config = stage / "config"
    for directory in (www, config):
        if directory.is_symlink() or not directory.is_dir():
            raise ValueError(f"expected a copied staging directory: {directory}")
    if enabled:
        return

    changes = {}
    for path in sorted(www.iterdir()):
        if path.suffix not in MARKERS:
            continue
        raw = read_stage_file(path)
        filtered = strip_blocks(path, raw)
        if filtered != raw:
            changes[path] = filtered

    for name, keys in (("settings.csv", SETTINGS_KEYS), ("remote.csv", REMOTE_KEYS)):
        path = config / name
        if path.exists() or path.is_symlink():
            raw = read_stage_file(path)
            filtered = filter_rows(raw, keys, last_source=name == "settings.csv")
            if filtered != raw:
                changes[path] = filtered

    (config / "yandex.json").unlink(missing_ok=True)
    for path, filtered in changes.items():
        path.write_bytes(filtered)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("stage_root", type=Path)
    parser.add_argument("profile", choices=("0", "1"))
    args = parser.parse_args()
    try:
        stage_profile(args.stage_root, enabled=args.profile == "1")
    except (OSError, ValueError) as error:
        parser.exit(1, f"stage_profile: {error}\n")


if __name__ == "__main__":
    main()
