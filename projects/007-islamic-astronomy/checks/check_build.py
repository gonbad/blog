#!/usr/bin/env python3
"""Verify the web-only Project 007 build and its output ownership receipt."""
import hashlib
import json
from pathlib import Path
import sys


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        while chunk := source.read(65536):
            digest.update(chunk)
    return digest.hexdigest()


def verify_build() -> bool:
    project_dir = Path(__file__).resolve().parent.parent
    dist_dir = project_dir / "dist"
    receipt_file = dist_dir / ".journal-output.json"
    index_file = dist_dir / "index.html"
    archive_file = dist_dir / "downloads" / "007-islamic-astronomy-v0.1.zip"
    errors = []

    if not dist_dir.is_dir():
        errors.append("Missing dist/ directory")
    if not index_file.is_file():
        errors.append("Missing dist/index.html")
    if not receipt_file.is_file():
        errors.append("Missing .journal-output.json receipt")
    if archive_file.exists():
        errors.append("Unexpected standalone article ZIP; this Project publishes web output only")

    if errors:
        for error in errors:
            print(f"FAIL: {error}", file=sys.stderr)
        return False

    receipt = json.loads(receipt_file.read_text(encoding="utf-8"))
    if receipt.get("output_type") != "journal-project":
        errors.append("Unexpected project output receipt type")
    if receipt.get("project") != "007-islamic-astronomy":
        errors.append("Output receipt names the wrong Project")
    if receipt.get("version") != "0.1":
        errors.append("Output receipt names the wrong Project version")

    expected_files = receipt.get("sha256", {})
    if "index.html" not in expected_files:
        errors.append("Output receipt does not include index.html")
    actual_files = {
        path.relative_to(dist_dir).as_posix()
        for path in dist_dir.rglob("*")
        if path.is_file() and path != receipt_file
    }
    if actual_files != set(expected_files):
        errors.append("Project dist inventory differs from its ownership receipt")

    for relative_path, expected_hash in expected_files.items():
        target = dist_dir / relative_path
        if not target.is_file():
            errors.append(f"Declared file missing from dist: {relative_path}")
        elif sha256_file(target) != expected_hash:
            errors.append(f"Hash mismatch for {relative_path}")

    if index_file.is_file():
        text = index_file.read_text(encoding="utf-8")
        if "آموزش تعاملی نجوم عمومی و عبادات اسلامی" not in text:
            errors.append("Built page is missing the article title")

    if errors:
        for error in errors:
            print(f"FAIL: {error}", file=sys.stderr)
        return False

    print("OK: Web output, ownership receipt, inventory, title, and hashes verified; no article ZIP is generated.")
    return True


if __name__ == "__main__" and not verify_build():
    sys.exit(1)
