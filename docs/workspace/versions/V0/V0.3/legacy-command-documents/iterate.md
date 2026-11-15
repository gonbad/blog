# Develop a new version of this project

Read the selected project, its roadmap and the latest primary version input before inherited specifications. There are exactly two entry routes, both represented by a version folder plus one primary 01-*.md input.

1. Agent-assisted: for /iterate, use the supplied change or select an authorized roadmap idea. Run `python3 moom.py iterate --version V0.2 --note CHANGE`. The helper creates 01-request.md and records its checksum.
2. Owner-prepared: the owner creates docs/projects/ID/versions/V0.2/01-transcription.md (or another primary 01-*.md). Read it and run `python3 moom.py iterate --version V0.2 --note CHANGE --input docs/projects/ID/versions/V0.2/01-transcription.md`. The helper adopts that exact input and preserves owner files while merging inherited documents. Do not rename/delete a valid prepared folder to bypass an existence check.

The helper archives previous source/inputs/metadata under projects/ID/versions/VOLD/, preserves old version docs/answers/receipts, creates version.json with the primary input and entry mode, and resets readiness/acceptance. Initialized version markers and snapshots are never overwritten. New version source remains in projects/ID/; its metadata starts as a draft. Inspect the pinned publishing helper for published_snapshot support before changing a published project.

Identify superseded instructions and write a source-to-result contract: central problem, reader actions vs delegated actions, sequence, artifact languages, required and removed elements. Diagnose a reported process failure first at the workspace's configured analysis location; then fix the process and the result. Keep result-specific changes in the project dossier. Ask only material unresolved choices using a fresh numbered review file; follow the owner's submitted-blank policy rather than reasking delegated choices.

Use the selected method for content fidelity, functionality, packaging and authorized publication. /versions locates the actual documents. A result version does not silently change its pinned method; explicitly /migrate when the method changes.
