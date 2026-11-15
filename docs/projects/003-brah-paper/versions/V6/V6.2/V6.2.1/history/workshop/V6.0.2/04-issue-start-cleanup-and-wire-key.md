# V6.0.2 — Issue #4: `/start` cleans the global MCP itself + model key moves to `/wire`

> **Source:** organizer, 2026-10-19. «still not fixed. I end up closing the terminal tabs and opening again to remove the global MCP. it should be told in /start that it should remove the global MCP if there is no token in current project secret docs yet. also look at server and make sure initialization is correct. another issue: it asks me to provide LLM base URL and API key. but it's too soon!! it should ask it on /wire not in /start.»
> **Status:** kit fixed + rebuilt; server verified healthy, seat inventory below. No `../event` change.

---

## 1. `/start` now removes the global entry itself (organizer's manual workaround, codified)

New sub-step **4.0b** (renumbered pipeline): *if this project has no seat token yet AND the laptop's global tool settings hold any `workshop` MCP entry → remove ONLY that entry with the editing tool, then full close + reopen + `opencode service stop` before continuing; never touch global settings again after this.* Conditioned on "no project token yet" so it cannot nuke anything on a working machine — it fires exactly in the polluted-laptop case and never otherwise.

## 2. Model key moved `/start` → `/wire`

`/start` no longer asks for `LLM_BASE_URL`/`LLM_API_KEY`/`LLM_MODEL` (step deleted, steps renumbered; frontmatter updated). Rationale: `/start` needs only the seat token; the employee key is first needed when the local agent runs.
- `/wire` gained step 1: collect the key into `docs/secrets/model.local.md` (if empty, ask once, stop otherwise), then regenerate `backend/.env`.
- `/build` softened: `codo-core check` flagging a missing key is now an expected pre-`/wire` blocker, not a build stopper — scaffolding continues.
- `03-tool.md` timing line and participant-book `04-start.md` updated (`only the seat token is asked in /start` was already written there — now true).

## 3. Server + initialization check (2026-10-19, live)

- Box `82.39.165.56`: all 10 containers up (`mcp`, `workshop-db`, `gitea`, `browserless`, `coolify` + db/redis/realtime/proxy/sentinel), `CODO_CORE_VERSION=0.2.0`, base image `workshop/agent-base:6.0-20261018` rebuilt with 0.2.0, Gitea PyPI has 0.1.0 + 0.2.0, tool-bank at 13 tools.
- Seat inventory (live `whoami` per seat): **p02–p12 pristine** (`next_step: create_repo`, nothing created). **p01 partial**: repo `p01/event.git` exists but **no app, no DB** — initialization did NOT complete (leftover of the deleted rehearsal run; `create_repo` is resumable so reusing p01+`event` would continue, but the clean recommendation stays **p02** for the fresh rehearsal). Nothing on the server blocks a fresh `/start`.

## Addendum — stale in-memory session beats clean files (2026-10-19)

After the global file was emptied AND the kit fixed, the organizer's window still saw the previous workshop working with no token asked. Cold-process ground truth in the same folder at the same time: global `{}`, project pristine (no token files, no git), `opencode mcp list` → only the tokenless entries failing 401 — nothing usable. Conclusion: the window itself predates every fix and holds the old workshop in memory; no file change can reach it. `/start` gained step **5.0a**: a verifiable shell probe (`opencode mcp list` in the project dir) that MUST show no working workshop entry before the token exists — if a bare `workshop` shows connected anyway, the session/service is stale: `opencode service stop`, full quit, reopen only this folder, re-probe. Checkable gates replace "restart if needed".
