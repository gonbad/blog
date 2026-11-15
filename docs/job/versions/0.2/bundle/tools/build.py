#!/usr/bin/env python3
"""Assemble actual blog projects and their offline deliveries; standard library only."""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
from pathlib import Path
import shutil
import tempfile
import zipfile
from urllib.parse import urlsplit

ROOT = Path(os.environ.get("MOOM_WORKSPACE", Path(__file__).resolve().parents[1])).resolve()
OUTPUT = ROOT / "dist"


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def confined(root, name):
    path = (root / name).resolve()
    if not path.is_relative_to(root.resolve()):
        raise ValueError(f"Path leaves project: {name}")
    return path


def fold_calendar(text):
    lines = []
    for line in text.splitlines():
        fragment = ""
        for char in line:
            if len((fragment + char).encode("utf-8")) > 75:
                lines.append(fragment)
                fragment = " "
            fragment += char
        lines.append(fragment)
    return ("\r\n".join(lines) + "\r\n").encode("utf-8")


def package_post(post, metadata, temporary):
    offline = temporary / (metadata["id"] + "-offline")
    shutil.copytree(post, offline)
    entry = offline / "index.html"
    entry.write_text(entry.read_text(encoding="utf-8").replace('data-delivery="online"', 'data-delivery="offline"'), encoding="utf-8")
    name = metadata.get("archive", f"{metadata['id']}-v{metadata['version']}.zip")
    aliases = metadata.get("archive_aliases", [])
    if Path(name).name != name:
        raise ValueError("Archive must be a filename")
    archive = post / "downloads" / name
    archive.parent.mkdir(exist_ok=True)
    with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as bundle:
        for path in sorted(offline.rglob("*")):
            if not path.is_file(): continue
            relative = path.relative_to(offline).as_posix()
            if relative in {"downloads/" + value for value in [name, *aliases]}:
                raise ValueError("The presentation archive must not contain itself")
            # A distinct Moom/material ZIP is valid offline content, not recursion.
            info = zipfile.ZipInfo(relative, date_time=(2026, 11, 9, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            bundle.writestr(info, path.read_bytes())
    for alias in aliases:
        if Path(alias).name != alias:
            raise ValueError("Archive aliases must be filenames")
        shutil.copy2(archive, archive.parent / alias)
    return name


def build(preview=None):
    if OUTPUT.is_symlink():
        raise ValueError("Refusing to replace a symlink at dist/")
    origin = json.loads((ROOT / "publication.json").read_text())["origin"].rstrip("/")
    parsed = urlsplit(origin)
    if parsed.scheme != "https" or not parsed.hostname or parsed.path or parsed.query or parsed.fragment or parsed.username:
        raise ValueError("Select an HTTPS publication origin without a path")
    available = [(path.parent, json.loads(path.read_text())) for path in sorted((ROOT / "projects").glob("*/project.json"))]
    if preview and not any(meta["id"] == preview for _, meta in available):
        raise ValueError(f"Unknown preview project: {preview}")
    selected = [(folder, meta) for folder, meta in available if meta.get("publish") or meta["id"] == preview]
    if sum(meta["kind"] == "index" for _, meta in selected) != 1:
        raise ValueError("Exactly one explicitly authored index project is required")
    with tempfile.TemporaryDirectory(prefix="workshop-blog-") as temporary_name:
        temporary = Path(temporary_name)
        staging = temporary / "site"
        staging.mkdir()
        projects = {}
        destinations = set()
        for folder, metadata in selected:
            public_path = metadata.get("public_path", "" if metadata["kind"] == "index" else metadata["id"])
            if public_path in destinations:
                raise ValueError(f"Duplicate public path: {public_path}")
            destinations.add(public_path)
            target = confined(staging, public_path)
            source = confined(folder, metadata["source"])
            if not (source / "index.html").is_file():
                raise ValueError(f"Project needs its real index.html: {metadata['id']}")
            shutil.copytree(source, target, dirs_exist_ok=True)
            for material in metadata.get("materials", []):
                resource = confined(folder, material["source"])
                destination = confined(target, material["target"])
                if not resource.is_file():
                    raise ValueError(f"Prepare the actual material before build: {resource}")
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(resource, destination)
            record = {"source": folder.relative_to(ROOT).as_posix(), "kind": metadata["kind"], "version": metadata["version"], "public_path": public_path}
            if metadata["kind"] == "post":
                entry = target / "index.html"
                marker = '<meta name="journal-origin" content="https://blog.kiloapp.ir">'
                entry.write_text(entry.read_text(encoding="utf-8").replace(marker, f'<meta name="journal-origin" content="{html.escape(origin, quote=True)}">'), encoding="utf-8")
                for calendar in target.rglob("*.ics"):
                    calendar.write_bytes(fold_calendar(calendar.read_text(encoding="utf-8").replace("URL:https://blog.kiloapp.ir/", f"URL:{origin}/")))
                archive = package_post(target, metadata, temporary)
                record["targets"] = {"web": f"{public_path}/index.html", "offline": f"{public_path}/downloads/{archive}"}
            projects[metadata["id"]] = record
        posts = [identifier for identifier, metadata in projects.items() if metadata["kind"] == "post"]
        active = os.environ.get("MOOM_PROJECT")
        primary = active if active in posts else (posts[0] if posts else None)
        files = {path.relative_to(staging).as_posix(): digest(path) for path in sorted(staging.rglob("*")) if path.is_file()}
        manifest = {"version": projects[primary]["version"] if primary else "0.1", "origin": origin,
                    "post": projects[primary]["public_path"] if primary else None, "preview_only": bool(preview),
                    "projects": projects, "targets": projects[primary]["targets"] if primary else {}, "sha256": files}
        (staging / "release.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        if OUTPUT.exists(): shutil.rmtree(OUTPUT)
        shutil.copytree(staging, OUTPUT)
    print(json.dumps({"built": str(OUTPUT), "projects": list(projects), "artifacts": len(files), "preview_only": bool(preview)}, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--preview", help="Include this draft project in a local-only preview")
    try:
        build(parser.parse_args().preview)
    except (ValueError, OSError, KeyError) as error:
        raise SystemExit(str(error))
