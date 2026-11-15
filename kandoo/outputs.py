"""Verified output replacement and bounded, content-addressed local rollback copies."""
from __future__ import annotations

import hashlib
import json
import os
import re
import shutil
from dataclasses import dataclass
from pathlib import Path

HISTORY = ".publication-history"
KEEP_PREVIOUS = 3


def checked_directory(path):
    path = Path(path).absolute()
    if any(parent.is_symlink() for parent in (path, *path.parents)):
        raise ValueError(f"Output paths cannot contain symlinks: {path}")
    if path.exists() and not path.is_dir():
        raise ValueError(f"Output must be a directory: {path}")
    return path.resolve()


def inventory(folder):
    files = {}
    for path in sorted(folder.rglob("*")):
        if path.is_symlink():
            raise ValueError(f"Symlink in generated output: {path}")
        if path.is_file():
            files[path.relative_to(folder).as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
        elif not path.is_dir():
            raise ValueError(f"Non-regular output file: {path}")
    return files


def identity(files):
    return hashlib.sha256(json.dumps(files, sort_keys=True).encode("utf-8")).hexdigest()


def history_directory(destination):
    return checked_directory(destination.parent / HISTORY / destination.name)


@dataclass(frozen=True)
class Replacement:
    staged: Path
    destination: Path
    previous: dict[str, str] | None


def plan_replacement(staged, destination, *, owns, legacy_inventories=()):
    """Check every destination before the caller activates any of its staged trees."""
    destination = checked_directory(destination)
    backup = destination.with_name(destination.name + ".previous")
    if backup.exists() or backup.is_symlink():
        raise ValueError(f"Recover the interrupted build before replacing {backup}")
    previous = inventory(destination) if destination.exists() else None
    if (destination.exists() and any(destination.iterdir())
            and not owns(destination) and previous not in legacy_inventories):
        raise ValueError(f"Refusing to replace unowned or changed output; move it aside first: {destination}")
    history = history_directory(destination)
    if previous:
        snapshot = history / identity(previous)
        if snapshot.exists() or snapshot.is_symlink():
            checked_directory(snapshot)
            if inventory(snapshot) != previous:
                raise ValueError(f"Existing rollback snapshot differs: {snapshot}")
    return Replacement(staged, destination, previous)


def prune_history(history):
    # Unknown or modified directories are preserved, never treated as generated trash.
    snapshots = []
    for path in history.iterdir():
        if path.is_symlink() or not path.is_dir() or not re.fullmatch(r"[a-f0-9]{64}", path.name):
            continue
        try:
            intact = identity(inventory(path)) == path.name
        except ValueError:
            intact = False
        if intact:
            snapshots.append(path)
    snapshots.sort(key=lambda path: path.stat().st_mtime_ns, reverse=True)
    for path in snapshots[KEEP_PREVIOUS:]:
        shutil.rmtree(path)


def activate(replacement):
    staged, destination, previous = replacement.staged, replacement.destination, replacement.previous
    checked_directory(destination)
    actual = inventory(destination) if destination.exists() else None
    if actual != previous:
        raise ValueError(f"Output changed after preflight; rebuild before replacing {destination}")
    backup = destination.with_name(destination.name + ".previous")
    if backup.exists() or backup.is_symlink():
        raise ValueError(f"Recover the interrupted build before replacing {backup}")
    history = history_directory(destination)
    if previous == inventory(staged):
        return  # An identical rebuild must not evict an older rollback edition.
    snapshot = history / identity(previous) if previous else None
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists():
        destination.rename(backup)
    try:
        staged.rename(destination)
        if snapshot is not None:
            history.mkdir(parents=True, exist_ok=True)
            if snapshot.exists() or snapshot.is_symlink():
                checked_directory(snapshot)
                if inventory(snapshot) != previous:
                    raise ValueError(f"Existing rollback snapshot differs: {snapshot}")
            else:
                backup.rename(snapshot)
    except BaseException:
        if backup.exists():
            if destination.exists():
                destination.rename(staged)
            backup.rename(destination)
        raise
    if backup.exists():
        if previous:
            shutil.rmtree(backup)  # Byte-identical snapshot was already retained.
        else:
            backup.rmdir()  # An existing empty output had no artifact to retain.
    if snapshot is not None:
        os.utime(snapshot, None)
        prune_history(history)
