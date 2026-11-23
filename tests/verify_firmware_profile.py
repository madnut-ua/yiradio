#!/usr/bin/env python3
"""Verify that the configured feature profile agrees across build artifacts."""

import gzip
import json
import sys
import tarfile
from pathlib import Path

from test_stage_profile import FEATURE


def verify(build, profile):
    image = (build / "jradio.bin").read_bytes()
    assert image[288:292] == b"JRD1"
    assert int.from_bytes(image[294:296], "little") == profile
    with (build / "compile_commands.json").open() as handle:
        sources = [Path(command["file"]) for command in json.load(handle)]
    source_files = [path for path in sources if "yandex_music" in path.parts or
                    path.name == "ui_yandex_screen.c"]
    symbols = (build / "jradio.map").read_text()
    assert bool(source_files) == (profile == 2), source_files
    assert ("yandex_auth_init" in symbols) == (profile == 2)
    if profile == 1:
        assert "libyandex_music.a" not in symbols
        for text in ("/api/yandex", "Ya.Music", "Yandex Music", "Яндекс Музыка", "ЯМузыка",
                     "api.music.yandex", "oauth.yandex"):
            assert text.encode() not in image, text

    with tarfile.open(build / "www.tar", "r:") as archive:
        stamp = json.load(archive.extractfile("version.json"))
        assert stamp["profile"] == str(profile)
        templates = []
        for asset in archive.getmembers():
            if not asset.isfile() or not asset.name.startswith("www/"):
                continue
            raw = archive.extractfile(asset).read()
            assert raw == (build / "littlefs_data" / asset.name).read_bytes(), asset.name
            if asset.name.endswith(".gz"):
                raw = gzip.decompress(raw)
            if profile == 1:
                assert FEATURE.search(raw.decode()) is None, asset.name
            if asset.name == "www/settings.html":
                templates.append(b'data-section="yandex"' in raw)
        assert templates == [profile == 2]
    if profile == 1:
        assert not (build / "littlefs_data/config/yandex.json").exists()


if __name__ == "__main__":
    build_dir = Path(sys.argv[1])
    expected = int(sys.argv[2]) if len(sys.argv) > 2 else int(
        json.loads((build_dir / "littlefs_data/config/version.json").read_text())["profile"]
    )
    assert expected in (1, 2)
    verify(build_dir, expected)
    print(f"Firmware and dashboard artifacts match profile {expected}")
