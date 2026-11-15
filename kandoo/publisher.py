"""Static publication assembly and verification. Python 3.10+, standard library only."""
from __future__ import annotations

import fnmatch
import hashlib
import json
import os
import re
import shlex
import shutil
import subprocess
import sys
import tempfile
import zipfile
from dataclasses import replace
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

from outputs import HISTORY, activate, checked_directory, inventory, plan_replacement

PRIVATE = {"inputs", "secrets", "versions", ".git", ".venv", "node_modules", "__pycache__", "docs"}
PRIVATE_FILES = (".env*", "*.local.md", "*.pem", "*.key", "*.p12", "*.pfx",
                 "id_rsa*", "id_ed25519*", "known_hosts*", "credentials*")
PROJECT_OUTPUT_MANIFEST = ".journal-output.json"


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def workspace(explicit=None):
    root = Path(explicit or os.environ.get("KANDOO_WORKSPACE") or Path(__file__).resolve().parents[1]).resolve()
    if not (root / "projects").is_dir() or not (root / "docs/kandoo/living/publication.md").is_file():
        raise ValueError(f"Publication needs projects/ and docs/kandoo/living/publication.md: {root}")
    return root


def markdown_fields(path, *, only=None):
    """Read the documented bullet settings, not assistant workflow state."""
    fields = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        match = re.fullmatch(r"- ([A-Za-z][A-Za-z0-9 ]*):\s*(.*?)\s*", line)
        if match:
            key = match[1].lower().replace(" ", "_")
            if only is not None and key not in only:
                continue
            if key in fields:
                raise ValueError(f"Duplicate publication setting {key}: {path}")
            fields[key] = match[2]
    return fields


def publication_settings(root):
    return markdown_fields(root / "docs/kandoo/living/publication.md")


def publication_origins(settings):
    """One preferred origin and explicit additional HTTPS entry points."""
    origins = []
    for value in [settings["origin"], *settings.get("aliases", "").split(",")]:
        origin = value.strip().rstrip("/")
        if not origin:
            continue
        parsed = urlsplit(origin)
        if (parsed.scheme != "https" or not parsed.hostname or parsed.path
                or parsed.query or parsed.fragment or parsed.username or parsed.password):
            raise ValueError("Select HTTPS publication origins without paths or credentials")
        if origin in origins:
            raise ValueError("Duplicate publication origin or alias")
        origins.append(origin)
    if not origins or not settings["origin"].strip():
        raise ValueError("Select the primary HTTPS publication origin")
    return origins


def project_metadata(root, folder, *, preview=False):
    """New Projects are private drafts; no generated manifest is a prerequisite."""
    path = root / "docs/projects" / folder.name / "living/publication.md"
    meta = {"id": folder.name, "kind": "post", "source": "src", "version": "0.1", "publish": False}
    if not path.is_file():
        return meta
    if path.is_symlink() or not path.resolve().is_relative_to(root.resolve()):
        raise ValueError(f"Publication contract leaves workspace: {path}")
    selected = markdown_fields(path, only={"publish"}).get("publish", "no")
    if selected not in {"yes", "no"}:
        raise ValueError(f"Publish must be yes/no in {path}")
    if selected == "no" and not preview:
        return meta
    fields = markdown_fields(path)
    fields.pop("publish", None)
    if fields.get("id", folder.name) != folder.name:
        raise ValueError(f"Publication ID must match the Project directory: {path}")
    meta.update(fields, publish=selected == "yes")
    if meta["kind"] not in {"index", "post"} or not meta["version"]:
        raise ValueError(f"Invalid publication kind/version: {path}")
    if not meta.get("archive"):
        meta.pop("archive", None)
    meta["archive_aliases"] = [s.strip() for s in fields.get("archive_aliases", "").split(",") if s.strip()]
    if meta["archive_aliases"] and not meta.get("archive"):
        raise ValueError(f"Archive aliases require an explicit Archive filename: {path}")
    if meta["kind"] == "index" and meta.get("archive"):
        raise ValueError(f"Select standalone archives on a post, not the aggregate index: {path}")
    if fields.get("build_command"):
        meta["build_command"] = shlex.split(fields["build_command"])
    materials = []
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.startswith("|"):
            cells = [c.strip() for c in line.strip("|").split("|")]
            if len(cells) != 2 or cells[0] == "Source" or re.fullmatch(r"[-: ]+", cells[0]):
                continue
            materials.append(dict(source=cells[0], target=cells[1]))
    meta["materials"] = materials
    return meta


def confined(root, name):
    raw = root / name
    if any(part.lower() in PRIVATE or part == HISTORY or any(
            fnmatch.fnmatchcase(part.lower(), pattern) for pattern in PRIVATE_FILES)
           for part in Path(name).parts):
        raise ValueError(f"Private path is not a publication asset: {name}")
    for path in [raw, *raw.parents]:
        if path == root.parent:
            break
        if path.is_symlink():
            raise ValueError(f"Publication paths cannot contain symlinks: {name}")
    path = raw.resolve()
    if not path.is_relative_to(root.resolve()):
        raise ValueError(f"Path leaves publication: {name}")
    return path


class MinifiedHTML(HTMLParser):
    """Collapse HTML formatting whitespace without rewriting code or preformatted text."""
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.output, self.protected = [], []

    def handle_starttag(self, tag, attrs):
        self.output.append(self.get_starttag_text())
        if tag in {"pre", "code", "textarea", "script", "style", "svg", "math"}:
            self.protected.append(tag)

    def handle_startendtag(self, tag, attrs):
        self.output.append(self.get_starttag_text())

    def handle_endtag(self, tag):
        self.output.append(f"</{tag}>")
        if self.protected and self.protected[-1] == tag:
            self.protected.pop()

    def handle_data(self, data):
        self.output.append(data if self.protected else re.sub(r"\s+", " ", data))

    def handle_entityref(self, name):
        self.output.append(f"&{name};")

    def handle_charref(self, name):
        self.output.append(f"&#{name};")

    def handle_decl(self, decl):
        self.output.append(f"<!{decl}>")

    def handle_comment(self, data):
        if self.protected or data.startswith("[if"):
            self.output.append(f"<!--{data}-->")


def minify_html(text):
    parser = MinifiedHTML()
    parser.feed(text)
    parser.close()
    return "".join(parser.output).strip() + "\n"


def public_tree(source, target):
    if not (source / "index.html").is_file():
        raise ValueError(f"Explicit public source needs index.html: {source}")
    target.mkdir(parents=True, exist_ok=True)
    for path in sorted(source.rglob("*")):
        relative = path.relative_to(source)
        confined(source, relative)
        if any(part.startswith(".") for part in relative.parts):
            raise ValueError(f"Hidden working file in public source: {path}")
        if not path.is_file() or path.suffix in {".py", ".pyc", ".map", ".pem", ".key"}:
            continue
        if path.suffix == ".md" and "downloads" not in relative.parts:
            continue
        if path.name in {"project.json", "workspace.json"}:
            raise ValueError(f"Working metadata in public source: {path}")
        dest = target / relative
        dest.parent.mkdir(parents=True, exist_ok=True)
        if path.suffix.lower() in {".html", ".htm"}:
            dest.write_text(minify_html(path.read_text(encoding="utf-8")), encoding="utf-8")
        else:
            shutil.copy2(path, dest)


def validate_url(value, file, root, *, asset=True):
    value = value.strip()
    if not value or value.startswith("#"):
        return
    parsed = urlsplit(value)
    if parsed.scheme in {"data", "blob"}:
        return
    if parsed.scheme or parsed.netloc or value.startswith("//"):
        if not asset and parsed.scheme in {"http", "https", "mailto", "tel"}:
            return
        raise ValueError(f"Remote or unsupported runtime reference in {file.relative_to(root)}: {value}")
    if value.startswith("/"):
        raise ValueError(f"Use file-portable relative references in {file.relative_to(root)}: {value}")
    target = (file.parent / unquote(parsed.path)).resolve()
    if not target.is_relative_to(root.resolve()):
        raise ValueError(f"Reference leaves output in {file.relative_to(root)}: {value}")
    if target.is_dir():
        target /= "index.html"
    if not target.is_file():
        raise ValueError(f"Missing local reference in {file.relative_to(root)}: {value}")


def check_css(text, file, root):
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    for match in re.finditer(r"url\(\s*(['\"]?)(.*?)\1\s*\)", text, re.S | re.I):
        validate_url(match[2], file, root)
    for match in re.finditer(r"@import\s+(['\"])(.*?)\1", text, re.I):
        validate_url(match[2], file, root)


def check_js(text, file, root):
    for match in re.finditer(r"\b(?:fetch|import|Worker|WebSocket|EventSource|sendBeacon)\s*\(\s*(['\"])([^'\"]+)\1", text):
        validate_url(match[2], file, root)
    for match in re.finditer(r"\b(?:import|export)\s+[^;\n]*?\sfrom\s*(['\"])([^'\"]+)\1", text):
        validate_url(match[2], file, root)


class References(HTMLParser):
    def __init__(self, file, root, offline=False):
        super().__init__()
        self.file, self.root, self.offline = file, root, offline
        self.raw = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "base":
            raise ValueError(f"Base URLs break standalone output: {self.file}")
        for key in ("src", "href", "poster", "data" if tag == "object" else "xlink:href"):
            if key not in attrs:
                continue
            if self.offline and tag == "a" and ("data-online-only" in attrs or "data-home-link" in attrs):
                continue
            validate_url(attrs[key] or "", self.file, self.root, asset=tag != "a")
        if attrs.get("srcset") and not attrs["srcset"].startswith("data:"):
            for entry in attrs["srcset"].split(","):
                validate_url(entry.strip().split()[0], self.file, self.root)
        if attrs.get("style"):
            check_css(attrs["style"], self.file, self.root)
        if tag in {"style", "script"}:
            self.raw = tag

    handle_startendtag = handle_starttag

    def handle_endtag(self, tag):
        if tag == self.raw:
            self.raw = None

    def handle_data(self, data):
        if self.raw == "style":
            check_css(data, self.file, self.root)
        elif self.raw == "script":
            check_js(data, self.file, self.root)


def check_tree(root, *, offline=False):
    if not (root / "index.html").is_file():
        raise ValueError(f"Output needs index.html: {root}")
    count = 0
    for file in sorted(root.rglob("*")):
        if file.is_symlink():
            raise ValueError(f"Symlink in output: {file}")
        if not file.is_file():
            continue
        confined(root, file.relative_to(root))
        if file.suffix.lower() in {".html", ".htm", ".svg"}:
            parser = References(file, root, offline)
            parser.feed(file.read_text(encoding="utf-8"))
            parser.close()
        elif file.suffix == ".css":
            check_css(file.read_text(encoding="utf-8"), file, root)
        elif file.suffix in {".js", ".mjs"}:
            check_js(file.read_text(encoding="utf-8"), file, root)
        count += 1
    return count


def package(post, metadata, temporary):
    offline = temporary / (metadata["id"] + "-offline")
    shutil.copytree(post, offline)
    entry = offline / "index.html"
    entry.write_text(entry.read_text(encoding="utf-8").replace('data-delivery="online"', 'data-delivery="offline"'), encoding="utf-8")
    checksums = {p.relative_to(offline).as_posix(): digest(p) for p in sorted(offline.rglob("*")) if p.is_file()}
    write_json(offline / "offline-manifest.json", {"project": metadata["id"], "version": metadata["version"], "sha256": checksums})
    names = [metadata["archive"], *metadata.get("archive_aliases", [])]
    if len(names) != len(set(names)):
        raise ValueError("Duplicate archive filename or alias")
    for name in names:
        if Path(name).name != name or not name.endswith(".zip"):
            raise ValueError(f"Archive must be a ZIP filename: {name}")
    archive = post / "downloads" / names[0]
    archive.parent.mkdir(exist_ok=True)
    with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as bundle:
        for file in sorted(offline.rglob("*")):
            if file.is_file():
                relative = file.relative_to(offline).as_posix()
                if relative in {"downloads/" + n for n in names}:
                    raise ValueError("Offline archive cannot contain itself")
                info = zipfile.ZipInfo(relative, date_time=(2026, 1, 1, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = 0o644 << 16
                bundle.writestr(info, file.read_bytes())
    for alias in names[1:]:
        shutil.copy2(archive, archive.parent / alias)
    return names[0]


def check_archive(archive):
    with zipfile.ZipFile(archive) as bundle, tempfile.TemporaryDirectory(prefix="offline-check-") as temp:
        root = Path(temp)
        for name in bundle.namelist():
            confined(root, name)
        if bundle.testzip():
            raise ValueError(f"Corrupt archive: {archive}")
        bundle.extractall(root)
        manifest = json.loads((root / "offline-manifest.json").read_text(encoding="utf-8"))
        check_hashes(root, manifest, manifest_name="offline-manifest.json")
        return check_tree(root, offline=True)


def check_hashes(root, manifest, *, manifest_name=None):
    expected = manifest["sha256"]
    actual = {p.relative_to(root).as_posix() for p in root.rglob("*") if p.is_file()}
    excluded = {manifest_name} if manifest_name else (
        {"release.json"} if (root / "release.json").is_file() else {"offline-manifest.json"})
    if actual - excluded != set(expected):
        raise ValueError("Output file inventory differs from its manifest; rebuild the release")
    for name, checksum in expected.items():
        if digest(confined(root, name)) != checksum:
            raise ValueError(f"Output checksum differs: {name}")


def check_release(output):
    manifest = json.loads((output / "release.json").read_text(encoding="utf-8"))
    check_hashes(output, manifest)
    count = check_tree(output)
    archives = 0
    for record in manifest["projects"].values():
        archive = record.get("targets", {}).get("offline")
        if archive:
            check_archive(confined(output, archive))
            archives += 1
    return {"ok": True, "files": count, "offline_archives": archives, "projects": list(manifest["projects"])}


def owned_output(destination, *, project=None):
    try:
        if project is None:
            check_release(destination)
        else:
            manifest = json.loads((destination / PROJECT_OUTPUT_MANIFEST).read_text(encoding="utf-8"))
            if manifest.get("output_type") != "journal-project" or manifest.get("project") != project:
                return False
            check_hashes(destination, manifest, manifest_name=PROJECT_OUTPUT_MANIFEST)
        return True
    except (ValueError, OSError, KeyError, TypeError, zipfile.BadZipFile):
        return False


def aggregate_output(root, output):
    output = checked_directory(output if output is not None else root / "dist")
    protected = [root / name for name in ("docs", "projects", "kandoo", "inputs", "secrets",
                                         "deploy", ".git", ".claude", ".agents", ".opencode")]
    if (root.is_relative_to(output) or HISTORY in output.parts
            or any(output.is_relative_to(path) for path in protected)
            or (output != root / "dist" and output.is_relative_to(root / "dist"))):
        raise ValueError(f"Output overlaps protected workspace content: {output}")
    if output.exists() and any(output.iterdir()) and not owned_output(output):
        raise ValueError(f"Refusing to replace unowned or changed output; move it aside first: {output}")
    return output


def previous_project_inventories(root, output):
    """Recognize pre-fix Project dist only through an independently verified release."""
    previous = {}
    for candidate in {root / "dist", output}:
        if not candidate.is_dir() or not owned_output(candidate):
            continue
        manifest = json.loads((candidate / "release.json").read_text(encoding="utf-8"))
        post_paths = [record["public_path"] + "/" for record in manifest["projects"].values()
                      if record["kind"] == "post"]
        for identifier, record in manifest["projects"].items():
            prefix = record["public_path"] + "/" if record["public_path"] else ""
            hashes = {name[len(prefix):]: checksum for name, checksum in manifest["sha256"].items()
                      if (name.startswith(prefix) if prefix else not any(name.startswith(p) for p in post_paths))}
            previous.setdefault(identifier, []).append(hashes)
    return previous


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


def build(root, output=None, preview=None):
    root = root.resolve()
    output = aggregate_output(root, output)
    settings = publication_settings(root)
    origins = publication_origins(settings)
    origin = origins[0]
    available = []
    for folder in sorted((root / "projects").iterdir()):
        if not folder.is_dir() or folder.name.startswith("."):
            continue
        metadata = project_metadata(root, folder, preview=folder.name == preview)
        available.append((folder, metadata))
    if preview and not any(meta["id"] == preview for _, meta in available):
        raise ValueError(f"Unknown preview Project: {preview}")
    selected = [(folder, meta) for folder, meta in available if meta.get("publish") or meta["id"] == preview]
    selected.sort(key=lambda item: item[1]["kind"] != "index")
    if sum(meta["kind"] == "index" for _, meta in selected) != 1:
        raise ValueError("Exactly one explicitly authored publication index is required")
    inputs, project_destinations = [], []
    for folder, meta in selected:
        if not re.fullmatch(r"[0-9]{3,}-[a-z0-9]+(?:-[a-z0-9]+)*", meta["id"]):
            raise ValueError(f"Invalid selected Project ID: {meta['id']}")
        inputs.append(confined(folder, meta["source"]))
        inputs.extend(confined(folder, material["source"]) for material in meta.get("materials", []))
        project_destinations.append(checked_directory(folder / "dist"))
    for destination in project_destinations:
        if any(destination.is_relative_to(source) or source.is_relative_to(destination) for source in inputs):
            raise ValueError(f"Project output overlaps a declared source or material: {destination}")
    prior_projects = previous_project_inventories(root, output)
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="publication-build-", dir=output.parent) as temp:
        temporary = Path(temp)
        staged = temporary / "site"
        staged.mkdir()
        records, project_outputs, destinations = {}, {}, set()
        for folder, meta in selected:
            public_path = meta.get("public_path", "" if meta["kind"] == "index" else meta["id"])
            if public_path and (Path(public_path).is_absolute() or Path(public_path).as_posix() != public_path or any(part in {".", ".."} or part.startswith(".") for part in Path(public_path).parts)):
                raise ValueError(f"Use a canonical relative public path: {public_path}")
            if (meta["kind"] == "index" and public_path) or (meta["kind"] == "post" and not public_path):
                raise ValueError("Index must own the root and each post must own a subdirectory")
            if any(public_path == old or (old and public_path.startswith(old + "/")) or (public_path and old.startswith(public_path + "/")) for old in destinations):
                raise ValueError(f"Overlapping public paths: {public_path}")
            destinations.add(public_path)
            target = confined(staged, public_path)
            if meta["kind"] == "post" and target.exists():
                raise ValueError(f"Post overlaps the index's public assets: {public_path}")
            source = confined(folder, meta["source"])
            if source == folder.resolve():
                raise ValueError("Project root is private; select its explicit public source directory")
            if meta.get("build_command"):
                command = meta["build_command"]
                if not isinstance(command, list) or not command or not all(isinstance(s, str) for s in command):
                    raise ValueError("build_command must be a reviewed argv list")
                subprocess.run(command, cwd=folder, stdout=sys.stderr, check=True)
            public_tree(source, target)
            for material in meta.get("materials", []):
                resource = confined(folder, material["source"])
                destination = confined(target, material["target"])
                if not resource.is_file():
                    raise ValueError(f"Prepare declared material before build: {resource}")
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(resource, destination)
            for calendar in target.rglob("*.ics"):
                calendar.write_bytes(fold_calendar(calendar.read_text(encoding="utf-8").replace("URL:https://blog.kiloapp.ir/", f"URL:{origin}/")))
            entry = target / "index.html"
            entry.write_text(entry.read_text(encoding="utf-8").replace('<meta name="journal-origin" content="https://blog.kiloapp.ir">', f'<meta name="journal-origin" content="{origin}">'), encoding="utf-8")
            record = {"source": folder.relative_to(root).as_posix(), "kind": meta["kind"], "version": meta["version"], "public_path": public_path}
            if meta["kind"] == "post":
                record["targets"] = {"web": f"{public_path}/index.html"}
                if meta.get("archive"):
                    archive = package(target, meta, temporary)
                    record["targets"]["offline"] = f"{public_path}/downloads/{archive}"
            records[meta["id"]] = record
            local_output = temporary / (meta["id"] + "-dist")
            shutil.copytree(target, local_output)
            project_outputs[meta["id"]] = local_output
        posts = [key for key, value in records.items() if value["kind"] == "post"]
        status = root / "docs/kandoo/living/status.md"
        saved_active = markdown_fields(status).get("active_project") if status.is_file() else None
        active = preview or os.environ.get("KANDOO_PROJECT") or saved_active
        primary = active if active in posts else (posts[-1] if posts else None)
        manifest = {"version": records[primary]["version"] if primary else "0.1", "origin": origin, "aliases": origins[1:],
                    "post": records[primary]["public_path"] if primary else None, "preview_only": bool(preview),
                    "projects": records, "targets": records[primary]["targets"] if primary else {},
                    "sha256": {p.relative_to(staged).as_posix(): digest(p) for p in sorted(staged.rglob("*")) if p.is_file()}}
        write_json(staged / "release.json", manifest)
        result = check_release(staged)
        replacements = []
        for identifier, local_output in project_outputs.items():
            destination = root / "projects" / identifier / "dist"
            payload = inventory(local_output)
            if PROJECT_OUTPUT_MANIFEST in payload:
                raise ValueError(f"Reserved Project output metadata name: {PROJECT_OUTPUT_MANIFEST}")
            write_json(local_output / PROJECT_OUTPUT_MANIFEST, {
                "output_type": "journal-project", "project": identifier,
                "version": records[identifier]["version"], "sha256": payload,
            })
            replacements.append(plan_replacement(
                local_output, destination,
                owns=lambda path, identifier=identifier: owned_output(path, project=identifier),
                legacy_inventories=[payload, *prior_projects.get(identifier, [])],
            ))
        replacements.append(plan_replacement(staged, output, owns=owned_output))
        for replacement in replacements[:-1]:
            destination = replacement.destination
            destination.parent.mkdir(parents=True, exist_ok=True)
            with tempfile.TemporaryDirectory(prefix="project-build-", dir=destination.parent) as local_temp:
                local_staged = Path(local_temp) / "dist"
                shutil.copytree(replacement.staged, local_staged)
                activate(replace(replacement, staged=local_staged))
        activate(replacements[-1])
    return {**result, "built": str(output), "preview_only": bool(preview)}
