import shutil
from pathlib import Path


def on_post_build(config, **kwargs):
    docs_dir = Path(config["docs_dir"])
    site_dir = Path(config["site_dir"])

    src = docs_dir / "assets" / "figure_reproduce" / "AGENTS.md"
    dst = site_dir / "assets" / "figure_reproduce" / "AGENTS.md"

    if not src.exists():
        return

    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)

    rendered = dst.parent / "AGENTS"
    if rendered.is_dir():
        shutil.rmtree(rendered)
