#!/usr/bin/env python3
"""Validate flasher JSON packs and generate the GitHub Pages language index."""

import argparse
import json
import sys
from pathlib import Path

from pack_locales import CODE, KEY, no_duplicates, usable_value


def stage(source, target):
    if not source.is_dir():
        raise ValueError(f"missing locale directory: {source}")
    locales = []
    packs = {}
    seen = {"en"}
    for path in sorted(source.glob("*.json")):
        try:
            pack = json.loads(path.read_text(encoding="utf-8"), object_pairs_hook=no_duplicates)
            if not isinstance(pack, dict) or type(pack.get("schema")) is not int or pack["schema"] != 1:
                raise ValueError("expected schema 1")
            code, name, strings = (pack.get(key) for key in ("code", "name", "strings"))
            if (not isinstance(code, str) or code != path.stem or len(code) > 15
                    or not CODE.fullmatch(code) or code.lower() in seen):
                raise ValueError("invalid or duplicate locale code")
            if not usable_value(name, 47) or not isinstance(strings, dict):
                raise ValueError("expected a language name and strings object")
            for key, value in strings.items():
                if not KEY.fullmatch(key) or not usable_value(value, 4096, "\t\r\n"):
                    raise ValueError(f"invalid translation: {key}")
        except ValueError as error:
            raise ValueError(f"{path}: {error}") from error
        seen.add(code.lower())
        locales.append({"code": code, "name": name})
        packs[path.name] = pack

    target.mkdir(parents=True, exist_ok=True)
    packs["index.json"] = {"schema": 1, "locales": locales}
    for filename, payload in packs.items():
        (target / filename).write_text(json.dumps(payload, ensure_ascii=False) + "\n", encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    try:
        stage(args.source, args.out)
    except (OSError, ValueError) as error:
        print(f"pack_flasher_locales: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
