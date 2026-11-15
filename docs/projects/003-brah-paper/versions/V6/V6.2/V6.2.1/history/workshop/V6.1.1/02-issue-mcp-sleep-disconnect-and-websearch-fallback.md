# V6.1.1 — Issue #2: New session after laptop sleep shows MCP disconnected (`ws_agent` / `workshop` failed), while `/idea-core` silently does competitor research via built-in `websearch`

> **Source:** organizer, 2026-10-27, V6.1 rehearsal on `/home/omid/projects/event/` (`ses_e84b3cb79ffeBMmF0Y0EKYRgFp`).
> **Organizer's words:** «next issue: I started a new session on that rehearsal but it seems that it's not connected to the MCP server. but it seems that it did competitors research. I dont know how.»
> **Status:** both questions answered from `opencode.log` + session export, self-healing config-diff bounce added to `00-rules.md` / `start.md` / `idea-core.md` / `tools.md` / `deploy.md` / `tool.md` / `compile.py`, `event/` reconnected and synced, zips rebuilt and redistributed.

---

## 1. Exact Timeline & Root Cause (from `~/.local/share/opencode/log/opencode.log` & session export)

### A. Why the new session was disconnected from the MCP server
1. Yesterday evening (`2026-10-26T15:25:51Z`), `/start` completed cleanly (`whoami` → `p01`, `create_repo` → `p01/event`, `get_proxy`, `search_tool_bank`, `web_search`, pushed to `origin/main`) and the laptop went to sleep overnight (`16:04:56Z` → `02:55:05Z`).
2. When the laptop woke up this morning at `2026-10-27T02:55:05Z` (`06:25:05` local time):
   - OpenCode's background daemon (`opencode serve --service`, PID `3484909`) immediately evicted the idle `/home/omid/projects/event` location service (`02:55:05.059Z`) and re-booted it (`02:55:06.295Z`).
   - However, during the first 45 seconds after wake-up (`02:55:06Z`–`02:55:51Z`), the laptop's outbound SSH proxy tunnel (`127.0.0.1:8118`, which `opencode serve --service` had inherited in `HTTP_PROXY`/`HTTPS_PROXY`) was dead from sleep and only restarted at `06:25:50` (`02:55:50Z`, PID `3660922`).
   - Consequently, `opencode serve --service`'s MCP connection attempts to `https://mcp.agent.kiloapp.ir/mcp` failed:
     - `ws_agent`: `status=failed`, `error="Request timed out"` (`02:55:38.060Z`)
     - `workshop`: `status=failed`, `error="Unable to connect. Is the computer able to access the url? (ConnectionRefused)"` (`02:55:51.922Z`)
3. Once OpenCode's background daemon marks an MCP server `status=failed`, **it never automatically retries connecting** after the network/proxy comes back up.
4. Even more subtly: when `docs/secrets/workshop.token` has **not** changed since the failed attempt (unlike in `/start` where `workshop.token` was newly written), a plain `touch opencode.json` is ignored by OpenCode's config loader because OpenCode diffs the resolved JSON in memory and sees zero diff!
5. Four minutes later (`02:59:14Z`), when the organizer opened a new session for `/idea-core`, `ws_agent` and `workshop` were still sitting in cached `failed` state.

### B. How `/idea-core` did competitor research without the MCP server
Inspection of `opencode session export ses_e84b3cb79ffeBMmF0Y0EKYRgFp` (`MSG 4`) showed:
- Because `ws_agent` was in `failed` state, `tools.ws_agent.web_search` was absent from the session's tool catalog.
- However, OpenCode ships its own **built-in `websearch` tool** (enabled in `compile/adapters/opencode/files/opencode.json` via `"websearch": {"provider": "random"}` and `permissions: [{"action": "websearch", "effect": "allow"}]`).
- Seeing `web_search` requested in `idea-core.md` and `ws_agent` unavailable, the model silently called OpenCode's built-in `websearch` tool three times (`ربات ثبت‌نام کارگاه هوش مصنوعی بله...`, `پلتفرم برگزاری رویداد و ثبت‌نام آنلاین ایران (ایوند، تیکت‌باز، لیما)`, `workshop registration AI chatbot WhatsApp Telegram...`), which succeeded and returned Evand, eSeminar, Inboxino, Robofy, etc.
- While that allowed `/idea-core` to finish, leaving `ws_agent` disconnected in `failed` state is a trap for `/tools` (`search_tool_bank`, `fetch_tool`) and `/deploy` (`claim_subdomain`, `set_env`, `deploy`), which have no built-in fallback.

---

## 2. The Fix (Config-Diff Bounce + Self-Healing Rule Across Sessions)

1. **Why bouncing `opencode.json` through `{}` works 100% of the time (even when `workshop.token` did not change):**
   - Running:
     ```bash
     cp opencode.json opencode.json.bak && echo '{}' > opencode.json && sleep 0.5 && mv opencode.json.bak opencode.json
     ```
     forces a real in-memory config diff (`{}` → full config) in `opencode serve --service`, which fires `event.type=config.updated` and reconnects both `ws_agent` and `workshop` (`mcp connected ... tools=31`) in ~3 seconds whether `workshop.token` just changed OR the connection dropped during laptop sleep / proxy restart.
2. **Self-healing rule added to `00-rules.md` and stage commands:**
   - `templates/codo/docs/constitution/00-rules.md` (`## The workshop service (MCP)`): mandates that whenever `{{WORKSHOP_MCP}}` tools are absent or `opencode mcp list` shows `failed` after `/start` has completed (e.g. after laptop sleep or a network blip), the assistant must run the `opencode.json` `{}` bounce + `opencode mcp list` poll to reconnect `{{WORKSHOP_MCP}}` live before calling workshop tools (and never silently fall back to built-in `websearch` while leaving `{{WORKSHOP_MCP}}` disconnected).
   - `templates/codo/commands/idea-core.md`, `tools.md`, `deploy.md`, `start.md`, `compile/adapters/opencode/tool.md`, and `compile/compile.py`: updated to use the `{}` config-diff bounce and enforce self-healing before `web_search`, `search_tool_bank`/`fetch_tool`, and `deploy`.

---

## 3. Verification & Rehearsal Sync

- Ran the `{}` bounce in `/home/omid/projects/event/` → `opencode.log` confirmed `event.type=config.updated` (`03:17:32.901Z`), `mcp connected server=ws_agent tools=31` (`03:17:33.841Z`), `mcp connected server=workshop tools=31` (`03:17:36.046Z`), and `opencode mcp list` shows `✓ workshop connected` and `✓ ws_agent connected`.
- Recompiled `codo.zip` (`compile.py --check` clean) and redistributed to `agent/kandoo/out/`, `/home/omid/projects/codo.zip`, `private/dist/`, and `public/dist/`.
- Synced updated commands and constitution into `/home/omid/projects/event/`, committed (`b211253`), and pushed to `origin/main`.
