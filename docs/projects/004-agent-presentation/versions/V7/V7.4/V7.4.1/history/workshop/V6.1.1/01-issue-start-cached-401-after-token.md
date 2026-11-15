# V6.1.1 — Issue #1: `/start` hits cached `401 Unauthorized` after writing `workshop.token` (and falsely blames the seat token)

> **Source:** organizer, 2026-10-26, V6.1 rehearsal on `/home/omid/projects/event/`.
> **Symptom:** After `/start` wrote the valid `p01` seat token (`HSzkZK…`) into `docs/secrets/workshop.local.md` and `docs/secrets/workshop.token` and the organizer closed and reopened OpenCode to run `/start` again, step 5 still saw `401 unauthorized` on both `ws_agent` and `workshop` and concluded:
> *"The token you pasted is exactly what's saved, and the server still says invalid — so it's not a copy/paste or session issue. Please raise a hand to the staff for a valid seat token for this workshop, then type /start again."*
> **Status:** root cause proven in `opencode.log` + server logs, live-reload fix (`touch opencode.json`) verified end-to-end, kit recompiled & redistributed, `event/` rehearsal and seat `p01` reset/repaired.

---

## 1. Root cause (verified in `~/.local/share/opencode/log/opencode.log` + `kandoo-mcp-1` logs)

1. **Pre-token project boot caches `HTTP 401` in `opencode serve --service`:**
   - When the participant first opens a fresh project folder in OpenCode (before `/start` runs), `docs/secrets/workshop.token` does not exist yet.
   - OpenCode's persistent background daemon (`opencode serve --service`) boots the project directory, reads `opencode.json`, logs `config file reference is missing or unreadable ... {file:./docs/secrets/workshop.token} (ENOENT)`, attempts to connect to `ws_agent` and `workshop` without a valid token, receives `HTTP 401` from `mcp.agent.kiloapp.ir` (`14:35:58Z`), and caches `status=failed (HTTP 401)` in the daemon's memory for that directory.
2. **Writing `docs/secrets/workshop.token` + closing/reopening the OpenCode window does NOT trigger a config reload:**
   - OpenCode's file watcher watches top-level `opencode.json` for `event.type=config.updated` — it does **not** watch `docs/secrets/workshop.token` inside `docs/secrets/`.
   - Closing and reopening the OpenCode window/TUI only restarts the thin client; the background daemon `opencode serve --service` stays running and never re-reads `opencode.json` or `{file:./docs/secrets/workshop.token}` when a new client attaches (`14:42:23Z`).
   - Consequently, on the second `/start` run, `opencode mcp list` immediately returned the cached `401` from `14:35:58Z` without sending a single HTTP request to `mcp.agent.kiloapp.ir`.
3. **False diagnosis in `/start` step 5:**
   - Because `docs/secrets/workshop.token` existed and matched `workshop.local.md`, the assistant trusted `opencode mcp list`'s cached `401` as a live rejection from the workshop server and told the participant their seat token was invalid.

---

## 2. The fix (`touch opencode.json` live reload + server-side 401 verification)

Empirically verified on OpenCode 2.1.0 (`opencode.log` + live `opencode run` tests):
- Running `touch opencode.json` in the project root immediately fires `event.type=config.updated` inside `opencode serve --service`.
- Within ~2–3 seconds, the background daemon re-reads `opencode.json`, resolves `{file:./docs/secrets/workshop.token}`, connects both `ws_agent` and `workshop` (`mcp connected ... tools=31`), and exposes `tools.ws_agent.*` to the **current running session** — **no restart of OpenCode is needed at all**.

### Files changed in `agent/kandoo/`

| File | Change |
|---|---|
| `templates/codo/commands/start.md` | **Step 4.0a:** skip pre-token probe on `/start` re-runs when `docs/secrets/workshop.token` already exists.<br>**Step 4.3:** after writing `docs/secrets/workshop.token`, run `touch opencode.json` and poll `opencode mcp list` (up to 10s) until `{{WORKSHOP_MCP}}` shows `connected`, then continue **immediately** to step 5 in the same `/start` run (no pause/restart).<br>**Step 5:** never blame the seat token from `opencode mcp list` alone; on 401, rewrite `workshop.token` raw + `touch opencode.json` + poll; if still 401, probe the MCP URL directly over HTTP (`Authorization: Bearer <token>`) to distinguish a wedged local daemon (`HTTP 200` → `opencode service stop`) from a genuinely invalid token (`HTTP 401`). |
| `compile/adapters/opencode/tool.md` | Replaced *Restart: yes* with *Live reload (no restart needed)* documenting `touch opencode.json` + `opencode mcp list` poll and `opencode service stop` backstop. |
| `compile/compile.py` | Updated `ADAPTER_MCP_DEFAULTS["opencode"]["RESTART_NOTE"]` (flows into `docs/constitution/03-tool.md`) to prescribe `touch opencode.json` live reload. |

---

## 3. Rehearsal & server repair

- **Rehearsal `/home/omid/projects/event/`:**
  - Synced `.opencode/commands/start.md` and `docs/constitution/03-tool.md` from the recompiled V6.1.1 `codo.zip`.
  - Ran `touch opencode.json` → verified `opencode mcp list` shows `✓ workshop connected` and `✓ ws_agent connected`.
  - Cleared the false blocker in `docs/status.md` and committed (`637c574`).
- **Workshop server (`82.39.165.56`):**
  - Cleaned seat `p01`'s leftover V6.0.2 repository (`p01/event`), Coolify application/project/deploy-key, and `Project` row (plus the temporary `k9qezdsu` test seat) so all 12 seats (`p01`–`p12`) are 100% pristine (`next_step: create_repo`).
- **Artifacts:**
  - `compile.py --check` clean; `out/codo.zip` rebuilt and redistributed to `/home/omid/projects/codo.zip`, `private/dist/codo.zip`, `private/dist/codo-6.1.zip`, `public/dist/codo.zip`, `public/dist/codo-6.1.zip`.
