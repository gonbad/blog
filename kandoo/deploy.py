#!/usr/bin/env python3
"""Upload only verified dist/ files and activate them under the existing Caddy service."""
from __future__ import annotations

import hashlib
import json
import os
import re
import shlex
import subprocess
import sys
import tarfile
import tempfile
from pathlib import Path

ROOT = Path(os.environ.get("KANDOO_WORKSPACE", Path(__file__).resolve().parents[1])).resolve()
from publisher import markdown_fields, publication_origins, publication_settings

REMOTE = r'''
import hashlib, json, os, pathlib, shutil, socket, subprocess, sys, tarfile, tempfile, time, urllib.request
P = pathlib.Path
opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
def run(*args):
    return subprocess.run(args, check=True, capture_output=True, text=True).stdout
def fetch(url):
    with opener.open(url, timeout=15) as response:
        return response.read()
def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()
def inventory(folder):
    return {p.relative_to(folder).as_posix() for p in folder.rglob('*') if p.is_file()}
archive = P(sys.argv[1])
settings = json.loads(sys.argv[2])
config = P(settings['deployment_config'])
unit = P(settings['deployment_unit'])
assert config.is_file() and unit.is_file(), 'Provision the static server separately before uploading dist/'
run('caddy', 'validate', '--config', str(config), '--adapter', 'caddyfile')
assert run('systemctl', 'is-active', settings['deployment_service']).strip() == 'active'
server_before = {str(p): digest(p) for p in (config, unit)}
base = P(settings['deployment_base'])
current = base / 'current'
assert current.is_symlink(), 'Expected the existing static release symlink'
old_target = os.readlink(current)
switched = False
try:
    with tempfile.TemporaryDirectory(prefix='workshop-blog-deploy-') as temporary:
        work = P(temporary)
        with tarfile.open(archive) as bundle:
            members = bundle.getmembers()
            names = [member.name for member in members]
            assert len(names) == len(set(names)), 'Duplicate upload path'
            for member in members:
                parts = P(member.name).parts
                assert member.isfile() and parts[0] == 'dist' and '..' not in parts, 'Only regular dist/ files may be uploaded'
            bundle.extractall(work, filter='data')
        site = work / 'dist'
        manifest = json.loads((site / 'release.json').read_text())
        assert not manifest.get('preview_only'), 'A local preview is not a publication release'
        assert manifest['origin'] == settings['origin'], 'Publication origin differs'
        origins = [manifest['origin'], *manifest.get('aliases', [])]
        assert origins == settings['publication_origins'], 'Publication aliases differ'
        expected = set(manifest['sha256']) | {'release.json'}
        assert inventory(site) == expected, 'Upload includes unverified files'
        for name, checksum in manifest['sha256'].items():
            assert digest(site / name) == checksum, f'Artifact checksum differs: {name}'
        release_id = manifest['version'] + '-' + digest(site / 'release.json')[:12]
        release = base / 'releases' / release_id
        release.parent.mkdir(parents=True, exist_ok=True)
        assert not release.is_symlink(), 'Release path must not be a symlink'
        if not release.exists():
            shutil.copytree(site, release)
        assert inventory(release) == expected, 'Remote release inventory differs'
        for name, checksum in manifest['sha256'].items():
            assert digest(release / name) == checksum, f'Remote release differs: {name}'
        release_paths = [release, *release.rglob('*')]
        assert all(not path.is_symlink() for path in release_paths), 'Release inventory cannot contain symlinks'
        for path in release_paths:
            if path.is_dir():
                path.chmod(0o755)
            elif path.is_file():
                path.chmod(0o644)
        pending = base / 'current.next'
        pending.unlink(missing_ok=True)
        pending.symlink_to(P('releases') / release_id)
        pending.replace(current)
        switched = True
        verified_downloads = []
        for origin in origins:
            for attempt in range(15):
                try:
                    assert json.loads(fetch(origin + '/release.json')) == manifest
                    break
                except Exception:
                    if attempt == 14:
                        raise
                    time.sleep(1)
            for project_id, project in manifest['projects'].items():
                public_path = project['public_path']
                entry = (public_path + '/' if public_path else '') + 'index.html'
                assert hashlib.sha256(fetch(origin + '/' + entry)).hexdigest() == manifest['sha256'][entry]
                download = project.get('targets', {}).get('offline')
                if download:
                    assert hashlib.sha256(fetch(origin + '/' + download)).hexdigest() == manifest['sha256'][download]
                    verified_downloads.append(origin + '/' + download)
            # Verify selected materials and runtime assets as well as entry pages.
            for name, checksum in manifest['sha256'].items():
                assert hashlib.sha256(fetch(origin + '/' + name)).hexdigest() == checksum, f'Public file differs: {name}'
        published_projects = list(manifest['projects'])
        assert server_before == {str(p): digest(p) for p in (config, unit)}, 'Static server configuration changed'
        report = {
            'published': True, 'origin': manifest['origin'],
            'post': manifest['origin'] + '/' + (manifest['post'].strip('/') + '/' if manifest.get('post') else ''),
            'verified_origins': origins,
            'host': socket.gethostname(), 'release': release_id,
            'upload_root': 'dist/', 'uploaded_files': len(expected),
            'artifacts_verified': len(manifest['sha256']), 'serving_server': 'Caddy',
            'offline_download_verified': bool(verified_downloads),
            'verified_offline_downloads': verified_downloads, 'projects': published_projects,
            'release_manifest_sha256': digest(release / 'release.json'),
            'publication_health': True,
            'public_permissions_normalized': True,
            'server_configuration_unchanged': True,
        }
        (base / 'last-deployment.json').write_text(json.dumps(report, indent=2) + '\n')
        print(json.dumps(report, indent=2))
except Exception:
    if switched:
        pending = base / 'current.rollback'
        pending.unlink(missing_ok=True)
        pending.symlink_to(old_target)
        pending.replace(current)
    raise
finally:
    archive.unlink(missing_ok=True)
'''


def create_archive(dist: Path, destination: Path) -> dict:
    """Allowlist the manifest and its verified public files; never package the repo."""
    from publisher import check_release

    dist = dist.resolve()
    check_release(dist)
    manifest_file = dist / "release.json"
    manifest = json.loads(manifest_file.read_text(encoding="utf-8"))
    if manifest.get("preview_only"):
        raise ValueError("Preview-only builds cannot be deployed")
    names = ["release.json", *sorted(manifest["sha256"])]
    with tarfile.open(destination, "w:gz") as bundle:
        for name in names:
            path = dist / name
            if path.is_symlink() or not path.resolve().is_relative_to(dist) or not path.is_file():
                raise ValueError(f"Not a regular public dist file: {name}")
            bundle.add(path, arcname=f"dist/{name}", recursive=False)
    return manifest


def save_receipt(root: Path, report: dict) -> Path:
    """Keep deployment evidence immutable when a later release updates the latest alias."""
    fields = markdown_fields(root / "docs/kandoo/living/status.md")
    version = fields["shared_open_version"]
    if not re.fullmatch(r"[0-9]+(?:\.[0-9]+)*", version):
        raise ValueError("Invalid shared version for deployment evidence")
    folder = root / "docs/kandoo/versions" / version / "release"
    folder.mkdir(parents=True, exist_ok=True)
    payload = (json.dumps(report, indent=2) + "\n").encode("utf-8")
    receipt = folder / f"deployment-{hashlib.sha256(payload).hexdigest()}.json"
    if receipt.exists():
        if receipt.read_bytes() != payload:
            raise ValueError("Existing deployment receipt differs")
    else:
        with receipt.open("xb") as output:
            output.write(payload)
    (folder / "deployment.json").write_bytes(payload)
    return receipt


def main() -> None:
    dist = ROOT / "dist"
    settings = publication_settings(ROOT)
    settings['publication_origins'] = publication_origins(settings)
    settings['origin'] = settings['publication_origins'][0]
    host = settings["deployment_ssh_host"]
    with tempfile.TemporaryDirectory(prefix="workshop-blog-package-") as temporary:
        archive = Path(temporary) / "deployment.tar.gz"
        manifest = create_archive(dist, archive)
        identifier = hashlib.sha256((dist / "release.json").read_bytes()).hexdigest()[:12]
        remote_archive = f"/tmp/workshop-blog-{identifier}.tar.gz"
        subprocess.run(["scp", "-o", "BatchMode=yes", "-o", "ConnectTimeout=10", str(archive), f"{host}:{remote_archive}"], check=True)
        result = subprocess.run(["ssh", "-o", "BatchMode=yes", "-o", "ConnectTimeout=10", host, "python3", "-", remote_archive, shlex.quote(json.dumps(settings))], input=REMOTE, text=True, capture_output=True, check=False)
        if result.returncode:
            raise SystemExit(result.stderr.strip() or "Remote deployment failed")
        report = json.loads(result.stdout)
        if report["origin"] != manifest["origin"]:
            raise SystemExit("Remote publication origin differs from the verified build")
        receipt = save_receipt(ROOT, report)
        report["receipt_file"] = receipt.relative_to(ROOT).as_posix()
        print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
