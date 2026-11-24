import json
import subprocess
import sys
import tarfile
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def main():
    with tempfile.TemporaryDirectory() as temp:
        root = Path(temp)
        source = root / "locales"
        stage = root / "staged"
        www = stage / "www"
        source.mkdir()
        www.mkdir(parents=True)
        (stage / "config").mkdir()
        (stage / "config" / "version.json").write_text('{"version":"test"}')
        (stage / "config" / "settings.csv").write_text("language,ru\n")
        # A partial pack for a locale not known to either compiled UI.
        (source / "pt-BR.json").write_text(
            json.dumps({
                "schema": 1, "code": "pt-BR", "name": "Português",
                "device": {"settings": "Configurações"},
                "web": {},
            })
        )
        command = [sys.executable, ROOT / "tools/pack_locales.py", "--source", source, "--www", www]
        subprocess.run(command, check=True)
        assert json.loads((www / "locales.json").read_text())["locales"] == [
            {"code": "en", "name": "English"},
            {"code": "pt-BR", "name": "Português"},
        ]
        archive = root / "www.tar"
        subprocess.run(
            [sys.executable, ROOT / "tools/pack_www.py", "--stage", stage, "--out", archive],
            check=True,
        )
        with tarfile.open(archive) as tar:
            assert tar.getnames() == [
                "version.json", "www/locale-pt-BR-device.json",
                "www/locale-pt-BR-web.json", "www/locales.json",
            ]
            assert json.load(tar.extractfile("www/locale-pt-BR-device.json"))["strings"] == {
                "settings": "Configurações",
            }

        # Repacking after removal may not leave a stale asset in the archive.
        (source / "pt-BR.json").unlink()
        subprocess.run(command, check=True)
        assert not list(www.glob("locale-*"))


if __name__ == "__main__":
    main()
