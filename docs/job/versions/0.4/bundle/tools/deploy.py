#!/usr/bin/env python3
"""Publish the built journal to the existing, inspected workshop VPS.

This deployment adapter is specific to its Traefik file provider/private bridge.
It does not configure DNS or change existing application routes.
"""
from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
import subprocess
import tarfile
import tempfile

ROOT = Path(os.environ.get("MOOM_WORKSPACE", Path(__file__).resolve().parents[1])).resolve()
BUNDLE = Path(os.environ.get("MOOM_BUNDLE", ROOT)).resolve()
HOST = "root@agent.kiloapp.ir"

REMOTE = r'''
import hashlib, json, os, pathlib, pwd, shutil, socket, subprocess, sys, tarfile, tempfile, time, urllib.request
P = pathlib.Path
def run(*args):
    return subprocess.run(args, check=True, capture_output=True, text=True).stdout
def health():
    with urllib.request.urlopen('http://10.0.1.1:8011/healthz', timeout=8) as response:
        assert json.load(response)['ok'] is True
def fetch(url):
    with urllib.request.urlopen(url, timeout=12) as response:
        return response.read()
def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()
archive = P(sys.argv[1])
dynamic = P('/data/coolify/proxy/dynamic')
assert dynamic.is_dir(), 'Expected existing Traefik file provider'
assert '10.0.1.1/' in run('ip', '-4', 'addr', 'show'), 'Private bridge differs from inspected host'
health()
other_routes = {p.name: digest(p) for p in dynamic.iterdir() if p.is_file() and p.name != 'workshop-blog.yaml'}
base = P('/srv/workshop-blog')
current = base / 'current'
assert not current.exists() or current.is_symlink(), 'Refusing to replace an unrelated current directory'
old_target = os.readlink(current) if current.is_symlink() else None
config = P('/etc/workshop-blog/Caddyfile')
unit = P('/etc/systemd/system/workshop-blog.service')
route = dynamic / 'workshop-blog.yaml'
old_files = {p: p.read_bytes() if p.exists() else None for p in (config, unit, route)}
was_active = subprocess.run(['systemctl', 'is-active', '--quiet', 'workshop-blog.service']).returncode == 0
switched = False
with tempfile.TemporaryDirectory(prefix='workshop-blog-deploy-') as temporary:
    work = P(temporary)
    with tarfile.open(archive) as bundle:
        bundle.extractall(work, filter='data')
    manifest = json.loads((work/'site/release.json').read_text())
    assert not manifest.get('preview_only'), 'A local preview is not a publication release'
    assert manifest['origin'] == 'https://blog.agent.kiloapp.ir', 'Route and selected publication origin must match'
    for name, expected in manifest['sha256'].items():
        assert digest(work/'site'/name) == expected, f'Artifact checksum differs: {name}'
    release_id = manifest['version'] + '-' + digest(work/'site/release.json')[:12]
    release = base / 'releases' / release_id
    try:
        try:
            pwd.getpwnam('workshop-blog')
        except KeyError:
            run('useradd', '--system', '--user-group', '--home-dir', '/var/lib/workshop-blog', '--shell', '/usr/sbin/nologin', 'workshop-blog')
        release.parent.mkdir(parents=True, exist_ok=True)
        if not release.exists():
            shutil.copytree(work/'site', release)
        for name, expected in manifest['sha256'].items():
            assert digest(release/name) == expected, f'Remote release differs: {name}'
        config.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(work/'deploy/Caddyfile', config)
        shutil.copyfile(work/'deploy/workshop-blog.service', unit)
        config.chmod(0o644)
        unit.chmod(0o644)
        run('caddy', 'validate', '--config', str(config), '--adapter', 'caddyfile')
        pending = base / 'current.next'
        pending.unlink(missing_ok=True)
        pending.symlink_to(P('releases')/release_id)
        pending.replace(current)
        switched = True
        run('systemctl', 'daemon-reload')
        run('systemctl', 'enable', 'workshop-blog.service')
        config_changed = old_files[config] != config.read_bytes() or old_files[unit] != unit.read_bytes()
        run('systemctl', 'restart' if was_active and config_changed else 'start', 'workshop-blog.service')
        for attempt in range(15):
            try:
                assert json.loads(fetch('http://10.0.1.1:8014/release.json')) == manifest
                break
            except Exception:
                if attempt == 14: raise
                time.sleep(1)
        pending_route = dynamic / 'workshop-blog.route-pending'
        shutil.copyfile(work/'deploy/workshop-blog.yaml', pending_route)
        pending_route.chmod(0o644)
        pending_route.replace(route)
        for attempt in range(15):
            try:
                assert json.loads(fetch(manifest['origin']+'/release.json')) == manifest
                break
            except Exception:
                if attempt == 14: raise
                time.sleep(1)
        offline_path = manifest['targets']['offline']
        assert hashlib.sha256(fetch(manifest['origin']+'/'+offline_path)).hexdigest() == manifest['sha256'][offline_path]
        health()
        assert other_routes == {p.name: digest(p) for p in dynamic.iterdir() if p.is_file() and p.name != 'workshop-blog.yaml'}
        report = {'published': True, 'origin': manifest['origin'], 'post': manifest['origin']+'/'+manifest['post'].strip('/')+'/',
                  'host': socket.gethostname(), 'release': release_id, 'artifacts_verified': len(manifest['sha256']),
                  'offline_download_verified': True, 'registration_health': True, 'other_routes_unchanged': True}
        (base/'last-deployment.json').write_text(json.dumps(report, indent=2)+'\n')
        print(json.dumps(report, indent=2))
    except Exception:
        if switched:
            pending = base/'current.rollback'
            pending.unlink(missing_ok=True)
            if old_target:
                pending.symlink_to(old_target)
                pending.replace(current)
            else:
                current.unlink(missing_ok=True)
        for path, content in old_files.items():
            if content is None: path.unlink(missing_ok=True)
            else: path.write_bytes(content)
        run('systemctl', 'daemon-reload')
        if was_active: run('systemctl', 'restart', 'workshop-blog.service')
        else:
            subprocess.run(['systemctl', 'disable', '--now', 'workshop-blog.service'], capture_output=True)
        raise
archive.unlink(missing_ok=True)
'''


def main() -> None:
    dist = ROOT / "dist"
    manifest_file = dist / "release.json"
    manifest = json.loads(manifest_file.read_text())
    if manifest.get("preview_only"):
        raise SystemExit("Build the approved publication before deploying; preview-only build selected")
    for name, expected in manifest["sha256"].items():
        actual = hashlib.sha256((dist / name).read_bytes()).hexdigest()
        if actual != expected:
            raise SystemExit(f"Rebuild before publishing; checksum differs: {name}")
    identifier = hashlib.sha256(manifest_file.read_bytes()).hexdigest()[:12]
    remote_archive = f"/tmp/workshop-blog-{identifier}.tar.gz"
    with tempfile.TemporaryDirectory(prefix="workshop-blog-package-") as temporary:
        archive = Path(temporary) / "deployment.tar.gz"
        with tarfile.open(archive, "w:gz") as bundle:
            bundle.add(dist, arcname="site")
            bundle.add(BUNDLE / "deploy", arcname="deploy")
        subprocess.run(["scp", "-o", "BatchMode=yes", "-o", "ConnectTimeout=10", str(archive), f"{HOST}:{remote_archive}"], check=True)
        subprocess.run(["ssh", "-o", "BatchMode=yes", "-o", "ConnectTimeout=10", HOST, "python3", "-", remote_archive], input=REMOTE, text=True, check=True)


if __name__ == "__main__":
    main()
