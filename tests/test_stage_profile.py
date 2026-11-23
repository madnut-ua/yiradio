#!/usr/bin/env python3
"""Verify build profiles against the staged files, gzip, and web tar."""

import gzip
import re
import shutil
import subprocess
import sys
import tarfile
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_WWW = ROOT / "data" / "www"
FEATURE = re.compile(
    r"yandex|ya[._]music|яндекс|ямузык|rotor|(?:dis)?like-track|next-track|"
    r"player\.(?:like|dislike)\b|list[.-](?:item-note|note_artist)|"
    r"fl\.(?:firmware_feature|included|not_included)\b", re.IGNORECASE
)
SETTINGS_SHARED = b"# keep this comment\r\nlast_source,dlna\r\nautoplay,1\n"
SETTINGS_ON = SETTINGS_SHARED + b"yandex_music,1\nlast_source,yandex\r\nlast_yandex,example"
REMOTE_SHARED = b"# bindings\npower,nec:00112233\r\nsource_dlna,none"
REMOTE_ON = b"like,none\nsource_yandex,none\ndislike,none\n" + REMOTE_SHARED


def run_tool(name, *args, **kwargs):
    return subprocess.run(
        [sys.executable, ROOT / "tools" / f"{name}.py", *args], cwd=ROOT, **kwargs
    )


def snapshot(path):
    return {entry.relative_to(path): entry.read_bytes()
            for entry in path.rglob("*") if entry.is_file()}


class StageProfileTest(unittest.TestCase):
    def setUp(self):
        scratch = tempfile.TemporaryDirectory(prefix=".test-stage-profile-", dir=ROOT)
        self.addCleanup(scratch.cleanup)
        self.root = Path(scratch.name)
        self.source = self.root / "source"
        shutil.copytree(SOURCE_WWW, self.source / "www")
        config = self.source / "config"
        config.mkdir()
        (config / "settings.csv").write_bytes(SETTINGS_ON)
        (config / "remote.csv").write_bytes(REMOTE_ON)
        (config / "yandex.json").write_bytes(b'{"token":"test-placeholder"}')
        (config / "stations.csv").write_bytes(b"name,url\n")
        (config / "version.json").write_bytes(b'{"version":"test"}')
        self.stage = self.root / "littlefs_data"
        shutil.copytree(self.source, self.stage)

    def test_on_keeps_assets_and_profile_data(self):
        run_tool("stage_profile", self.stage, "1", check=True)
        self.assertEqual(snapshot(self.stage), snapshot(self.source))
        translations = (SOURCE_WWW / "i18n.js").read_bytes()
        for key in (b"hw.f.yandex_music", b"fl.firmware_feature", b"fl.included", b"fl.not_included"):
            self.assertIn(b"'" + key + b"'", translations)

    def test_off_filters_only_the_copy_and_packages_scrubbed_assets(self):
        before = snapshot(self.source)
        run_tool("stage_profile", self.stage, "0", check=True)
        self.assertEqual(snapshot(self.source), before)
        self.assertTrue((self.source / "config/yandex.json").is_file())
        self.assertFalse((self.stage / "config/yandex.json").exists())
        self.assertEqual((self.stage / "config/settings.csv").read_bytes(), SETTINGS_SHARED)
        self.assertEqual((self.stage / "config/remote.csv").read_bytes(), REMOTE_SHARED)
        self.assertEqual((self.stage / "config/stations.csv").read_bytes(), b"name,url\n")

        www = self.stage / "www"
        self.assertIn(b"'update.err_profile'", (www / "i18n.js").read_bytes())
        run_tool("gzip_www_assets", www, check=True)
        archive = self.root / "www.tar"
        run_tool("pack_www", "--stage", self.stage, "--out", archive, check=True)
        with tarfile.open(archive, "r:") as packed:
            for asset in sorted(www.iterdir()):
                name = f"www/{asset.name}"
                raw = asset.read_bytes()
                self.assertEqual(packed.extractfile(name).read(), raw, name)
                if asset.suffix == ".gz":
                    raw = gzip.decompress(raw)
                    self.assertEqual(raw, asset.with_suffix("").read_bytes(), name)
                match = FEATURE.search(raw.decode("utf8"))
                self.assertIsNone(match, f"{name}: {match}")
                if asset.suffix == ".js":
                    subprocess.run(["node", "--check", asset], cwd=ROOT, check=True)
        subprocess.run(["node", "tests/test_web_settings.js", www], cwd=ROOT, check=True)

    def test_refuses_source_directory_and_linked_assets(self):
        reply = run_tool("stage_profile", ROOT / "data", "0", capture_output=True)
        self.assertNotEqual(reply.returncode, 0)
        self.assertIn(b"staging copy", reply.stderr)
        marked = self.stage / "www/settings.js"
        marked.unlink()
        marked.symlink_to(self.source / "www/settings.js")
        before = snapshot(self.source)
        reply = run_tool("stage_profile", self.stage, "0", capture_output=True)
        self.assertNotEqual(reply.returncode, 0)
        self.assertEqual(snapshot(self.source), before)
        self.assertTrue((self.stage / "config/yandex.json").is_file())


if __name__ == "__main__":
    unittest.main()
