#!/usr/bin/env python3
"""Validate a release and invoke the workspace's configured hosting adapter."""
import argparse
import json
import os
import subprocess
import sys
from pathlib import Path
from publisher import check_release, publication_origins, publication_settings, workspace

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--workspace", type=Path)
parser.add_argument("--dry-run", action="store_true")
args = parser.parse_args()
try:
    root = workspace(args.workspace)
    result = check_release(root / "dist")
    manifest = json.loads((root / "dist/release.json").read_text())
    if manifest.get("preview_only"):
        raise ValueError("Preview builds cannot be deployed")
    settings = publication_settings(root)
    if [manifest['origin'], *manifest.get('aliases', [])] != publication_origins(settings):
        raise ValueError("Publication origin/aliases changed; rebuild before deployment")
    adapter = (root / settings["deployment_adapter"]).resolve()
    if not adapter.is_relative_to(root / "kandoo") or not adapter.is_file():
        raise ValueError("Configure the workspace's Python hosting adapter under kandoo/")
    if args.dry_run:
        print(json.dumps({**result, "origin": manifest["origin"], "adapter": str(adapter), "deployed": False}, indent=2))
    else:
        raise SystemExit(subprocess.run([sys.executable, str(adapter)], cwd=root, env={**os.environ, "KANDOO_WORKSPACE": str(root)}).returncode)
except (ValueError, OSError, KeyError) as error:
    raise SystemExit(str(error))
