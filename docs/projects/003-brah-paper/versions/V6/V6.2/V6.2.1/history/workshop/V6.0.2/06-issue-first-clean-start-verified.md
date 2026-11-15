# V6.0.2 — Issue #6: first clean `/start` on the new kit + full server verification

> **Source:** organizer, 2026-10-19. Fresh `event/` from the newest `out/codo.zip`: «it seems that it worked. now look at the server. see if everything is OK; including check that files are pushed and search (via parallel) worked.»
> **Verdict:** all green, independently verified (not just from the rehearsal log).

## 1. Rehearsal project (independent checks, not the assistant's log)

- `git ls-remote origin` → `main` at `c0a33e0`, identical to local HEAD; `git status` clean — all 5 commits pushed, nothing waiting.
- Seat token file present (`workshop.token` + `workshop.local.md`); token resolves to **p01**.
- `whoami(p01)`: repo set, `app: True`, `db: True`, `next: claim_subdomain` — initialization complete through `create_repo`. (The earlier p01 half-state is closed.)
- Guard state from the log: seat p01, `base agent.kiloapp.ir` — passes.

## 2. Server (live probes, 2026-10-19)

- All 10 containers healthy (`mcp`, `workshop-db`, `gitea`, `browserless`, `coolify` + db/redis/realtime/proxy/sentinel; mcp restarted 13 min ago for the `coolify_git_url` fix).
- `CODO_CORE_VERSION=0.2.0`, `BASE_DOMAIN=agent.kiloapp.ir`, base image `workshop/agent-base:6.0-20261018` current; PyPI has 0.1.0 + 0.2.0; tool-bank at 13 tools.
- `web_search` via the project's own seat token → live Parallel results (first end-to-end Parallel proof from a rehearsal seat, not just the organizer's earlier check).
- `auxiliary_images_left: 2` — WAHA/WordPress slots free for `/tools`+`/build`.

## 3. Open threads

- None blocking. Next rehearsal steps: `/idea-core` (active phase per status), then the pipeline to `/wire` (model key collected there per V6.0.2-#4), `/test`, `/deploy`.
- Stale-session hygiene stays in force: any window opened before the 09:46 service restart still holds the old config — the 5.0a probe is the detector.
