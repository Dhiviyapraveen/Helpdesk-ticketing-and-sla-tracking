import os
import subprocess
import sys
import time
from pathlib import Path
from urllib.error import URLError
from urllib.request import urlopen


ROOT = Path(__file__).resolve().parents[1]
DIST_DIR = ROOT / "dist"
BASE_URL = os.getenv("SELENIUM_BASE_URL", "http://127.0.0.1:8080")


def wait_for_server(timeout_seconds: int = 60) -> None:
    deadline = time.time() + timeout_seconds
    while time.time() < deadline:
        try:
            with urlopen(BASE_URL, timeout=2):
                return
        except URLError:
            time.sleep(1)
    raise TimeoutError(f"Frontend did not start within {timeout_seconds}s at {BASE_URL}")


def main() -> int:
    index_file = DIST_DIR / "index.html"
    created_index = False
    if not index_file.exists():
        js_files = sorted((DIST_DIR / "assets").glob("index-*.js"))
        css_files = sorted((DIST_DIR / "assets").glob("index-*.css"))
        if not js_files or not css_files:
            print(
                f"Missing {index_file} and could not find built assets in {DIST_DIR / 'assets'}.",
                file=sys.stderr,
            )
            return 1

        index_file.write_text(
            "\n".join(
                [
                    "<!doctype html>",
                    '<html lang="en">',
                    "  <head>",
                    '    <meta charset="UTF-8" />',
                    '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
                    "    <title>Helpdesk Ticketing</title>",
                    f'    <link rel="stylesheet" crossorigin href="/assets/{css_files[-1].name}" />',
                    f'    <script type="module" crossorigin src="/assets/{js_files[-1].name}"></script>',
                    "  </head>",
                    "  <body>",
                    '    <div id="root"></div>',
                    "  </body>",
                    "</html>",
                ]
            ),
            encoding="utf-8",
        )
        created_index = True

    dev_cmd = [sys.executable, "-m", "http.server", "8080", "--bind", "127.0.0.1"]
    server = subprocess.Popen(
        dev_cmd,
        cwd=DIST_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )

    try:
        wait_for_server()

        test_cmd = [sys.executable, "-m", "unittest", "selenium_tests.test_auth", "-v"]
        env = os.environ.copy()
        env["SELENIUM_BASE_URL"] = BASE_URL

        result = subprocess.run(test_cmd, cwd=ROOT, env=env)
        return result.returncode
    finally:
        server.terminate()
        try:
            server.wait(timeout=10)
        except subprocess.TimeoutExpired:
            server.kill()
        if created_index and index_file.exists():
            index_file.unlink()


if __name__ == "__main__":
    raise SystemExit(main())
