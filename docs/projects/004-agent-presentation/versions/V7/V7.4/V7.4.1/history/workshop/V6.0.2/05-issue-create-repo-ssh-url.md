# V6.0.2 — Issue #5: `create_repo` 422 — Coolify rejects `ssh://` git URLs

> **Source:** organizer's rehearsal `/start` step 7 log (2026-10-19): «Repository: create_repo still fails with a bare server-side error — blocked… the repo exists but empty, and without the push token I cannot push». The organizer's folder was also one kit behind (its log still shows the old step 4 model-key ask — fixed separately in `04-issue-start-cleanup-and-wire-key.md`).
> **Verdict:** real server-side bug, fixed and verified. No kit-zip change needed (server component only); improved error surfacing included.

## 1. Root cause (proven from Coolify 4.3.16 source on the box)

`create_repo` sent `git_repository: ssh://git@git.agent.kiloapp.ir:2222/p01/event.git` (Gitea SSH is on 2222; box :22 is system sshd). Coolify's `ValidGitRepositoryUrl` accepts only `https://|http://|git://|git@` — `ssh://` hard-fails 422. Its `convertGitUrl`, however, explicitly parses the form `git@host:port/path` (port extracted for `ssh -p` at clone time, confirmed at `Application.php:1529,1656,1976`). So the box's custom SSH port had no sendable representation until now — meaning `create_repo` could NEVER have succeeded on this box (consistent with p01's half-state: repo without app/db).

## 2. Fix (in `mcp-coolify`, deployed)

- `gitea.py`: new `coolify_git_url()` — `ssh://git@host:port/path` → `git@host:port/path` (port 22 → classic `git@host:path`). Stored `repo_url` keeps the `ssh://` form because `repo.read_file`'s plain `git clone` needs the port in `ssh://` syntax; only the Coolify call site converts.
- `tools.py:create_repo`: uses the converted URL; `CoolifyError` now surfaces as a readable `ToolError` («ساختِ اپ روی سرویسِ استقرار ناموفق بود: …») instead of the bare «Error executing tool».
- Deployed: scp + `compose up -d --build mcp`, healthy.

## 3. Proof (live, p01)

- Before: `create_repo(event)` → bare `Error executing tool create_repo`; server log: `CoolifyError 422 … must start with https://, http://, git://, or git@`.
- After: `create_repo(event)` → `{"ok": true, clone_url, push_token, package_index, …}`; `whoami(p01)` → `app: True, db: True, next: claim_subdomain`. p01's initialization is now complete (repo + app + database). Seats p02–p12 untouched/pristine.

## 4. For the rehearsal

Recreate `event/` from the newest `out/codo.zip` (the organizer's failing log came from the previous kit: model key still asked at step 4), run `/start` with seat **p01** (everything server-side is ready for project `event` — push + deploy next) or a pristine seat for a from-zero run.
