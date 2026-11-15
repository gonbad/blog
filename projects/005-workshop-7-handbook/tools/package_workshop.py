#!/usr/bin/env python3
"""Prepare public Workshop downloads from current Moom and the living handbook."""
from __future__ import annotations

import argparse
import base64
import html
import json
import hashlib
import zipfile
import re
import shutil
from pathlib import Path


def standalone(source):
    text = (source / 'index.html').read_text(encoding='utf-8')
    css = (source / 'handbook.css').read_text(encoding='utf-8')
    def font(match):
        resource = source / match[1]
        data = base64.b64encode(resource.read_bytes()).decode('ascii')
        return f'url("data:font/ttf;base64,{data}")'
    css = re.sub(r'url\("(assets/fonts/[^\"]+\.ttf)"\)', font, css)
    text = text.replace('<link rel="stylesheet" href="handbook.css">', '<style>' + css + '</style>')
    text = text.replace('<script src="handbook.js" defer></script>', '<script>' + (source / 'handbook.js').read_text(encoding='utf-8') + '</script>')
    # An inlined deferred script must still run after the body exists.
    script = re.search(r'<script>.*?</script>', text, re.DOTALL)[0]
    text = text.replace(script, '').replace('</body>', script + '</body>')
    text = text.replace('href="../"', 'href="#start"')
    text = text.replace('href="downloads/moom-', 'href="moom-')
    text = text.replace('href="assets/fonts/OFL.txt"', 'href="#font-license"')
    license_text = html.escape((source / 'assets/fonts/OFL.txt').read_text(encoding='utf-8'))
    return text.replace('</main>', f'<details id="font-license"><summary>مجوز قلم استعدا</summary><pre dir="ltr">{license_text}</pre></details></main>')


def material_settings(root):
    path = root / 'docs/projects/005-workshop-7-handbook/living/materials.md'
    fields = {'retained_kits': []}
    retained_section = False
    for line in path.read_text(encoding='utf-8').splitlines():
        if line.startswith('## '):
            retained_section = line == '## Retained kits'
        if retained_section and line.startswith('|'):
            cells = [cell.strip() for cell in line.strip('|').split('|')]
            if cells == ['Version', 'SHA256', 'File'] or all(set(c) <= {'-', ':'} for c in cells):
                continue
            if (len(cells) != 3 or not re.fullmatch(r'\d+\.\d+\.\d+(?:-[a-z0-9.-]+)?', cells[0])
                    or not re.fullmatch(r'[a-f0-9]{64}', cells[1])
                    or cells[2] != f'moom-{cells[0]}.zip'):
                raise ValueError('Invalid retained kit contract')
            fields['retained_kits'].append((cells[2], cells[1]))
        match = re.fullmatch(r'- ([A-Za-z][A-Za-z0-9 ]*):\s*(.*?)\s*', line)
        if match:
            fields[match[1].lower().replace(' ', '_')] = match[2]
    return fields


def verify_kit(archive, expected, handbook):
    if not archive.is_file():
        raise ValueError(f'Missing imported workshop kit: {archive}; restore the committed artifact')
    if archive.is_symlink() or not archive.resolve().is_relative_to(handbook.resolve()):
        raise ValueError('Imported kit must be a regular Project artifact')
    checksum = hashlib.sha256(archive.read_bytes()).hexdigest()
    if checksum != expected:
        raise ValueError('Imported kit checksum differs; restore/review the committed artifact')
    with zipfile.ZipFile(archive) as bundle:
        names = bundle.namelist()
        if (len(names) != len(set(names)) or bundle.testzip() is not None or not names
                or any(not (n.endswith('.md') or n == '.gitignore')
                       or Path(n).is_absolute() or '..' in Path(n).parts for n in names)):
            raise ValueError('Imported kit is not a valid Markdown-only archive')
    return checksum


def prepare(root):
    """Consume pinned artifacts; never build/fetch an upstream template."""
    config = material_settings(root)
    version = config['kit_version']
    if not re.fullmatch(r'\d+\.\d+\.\d+(?:-[a-z0-9.-]+)?', version):
        raise ValueError('Invalid imported kit version')
    filename = f'moom-{version}.zip'
    handbook = root / 'projects/005-workshop-7-handbook'
    announcement = root / 'projects/001-workshop-7'
    archive = handbook / 'materials' / filename
    checksum = verify_kit(archive, config['kit_sha256'], handbook)
    names = {filename, 'moom-0.1.zip'}
    retained = []
    for name, expected in config['retained_kits']:
        if name in names:
            raise ValueError('Retained kit conflicts with another download')
        names.add(name)
        path = handbook / 'materials' / name
        verify_kit(path, expected, handbook)
        retained.append(path)
    # Validate and render all inputs before replacing retained compatibility aliases.
    page = standalone(handbook / 'src')
    materials = announcement / 'materials'
    materials.mkdir(parents=True, exist_ok=True)
    shutil.copy2(archive, materials / filename)
    shutil.copy2(archive, materials / 'moom-0.1.zip')
    for path in retained:
        shutil.copy2(path, materials / path.name)
    (materials / 'handbook-0.1.html').write_text(page, encoding='utf-8')
    return {'moom_version': version, 'kit': filename, 'sha256': checksum,
            'handbook': '005-workshop-7-handbook', 'legacy_downloads': 'current kit alias',
            'retained_kits': [path.name for path in retained]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--workspace', type=Path, default=Path(__file__).resolve().parents[3])
    args = parser.parse_args()
    print(json.dumps(prepare(args.workspace.resolve()), ensure_ascii=False))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, KeyError) as error:
        raise SystemExit(str(error))
