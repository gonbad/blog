# Start the first owner rehearsal

Status: technically prepared on 14 November 2026. The owner has not rehearsed yet.
All 45 regression tests, detached publishing, fresh-kit extraction, and handbook
browser/offline checks passed. These results do not supply human acceptance.

## First run: a new private Journal post

1. Open the existing `blog/` workspace in the AI host and its `docs/` folder in
   Obsidian. Close and reopen the host to load the revised commands.
2. Invoke `kandoo-new-project` using the host's command picker (`/kandoo-new-project`
   in slash-command hosts or `$kandoo-new-project` in Codex CLI). State that this is
   your first rehearsal and the new post must stay private with local delivery.
3. Give one real topic and the intended reader outcome. The assistant allocates the
   next unused Project ID, prefills its Markdown input, and shows the exact next file
   or command. It preserves Project 006 and all earlier work.
4. Follow idea → brief → story → content → layout → build → local delivery. Read and
   edit only the Markdown files the assistant names inside this vault. The assistant
   runs technical commands and serves browser previews for you to inspect.
5. Include one submitted blank specification answer, a host restart/resume, a
   `kandoo-add-idea` item affecting both Project and method, and a switch away/back.
   Record actual friction, interventions, timing, and acceptance in the new Project's
   open-version Markdown notes. No public publication is needed.

Do not run `moom-start` or `moom-job` to reinitialize this configured Journal. The
current selected Project remains 006 until you deliberately create the new Project.

## Second run: a fresh Kandoo

Ask the assistant to extract the verified local kit into a new separate folder and
verify the checksum below. The source artifact is identified in the
[imported-material record](../../projects/005-workshop-7-handbook/living/materials.md).
The assistant handles ZIP extraction; you open the resulting workspace in the host
and its `docs/` folder in Obsidian.

```text
Kit: moom-0.6.0.zip — local candidate, not a published release
SHA-256: 511f00242facf5df8f5a4983889acfe3ca66425ab36024e069913ebfa5781bbf
```

Run `moom-start`, deliberately defer an optional setup dependency, then define a small
presentation Job through `moom-job`. Test the four-stage output, restart/resume, and a
second independent Project. Windows without a server may use the owner's explicit
SQLite planning fallback for a later software Job; live PostgreSQL migration checks
remain pending before server deployment.

Current next action: reopen the host on `blog/` and invoke `kandoo-new-project`.

V9.8 follow-up: use the visual progress display, source intake locations and naming
explanation in the updated method. Ordinary articles now produce a verified web page,
without a ZIP. Existing Project 007 and its submitted records are preserved.
