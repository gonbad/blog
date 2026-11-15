# V6.0.2 — Rehearsal #1 finding: the kit connected to the wrong workshop

> **Source:** organizer's rehearsal #1 (`/home/omid/projects/event/`, unzipped from `agent/kandoo/out/codo.zip` V6.0.1), reported 2026-10-19.
> **Organizer's words:** «it was connected to previous workshop MCP and wrongly thought server is setup. it seems that you did not write the MCP address of the #6 workshop in `agent/kandoo/out/codo.zip` while you should have. and also i dont want to add MCPs globally but locally (only for that project).»
> **Status:** fixed, verified, artifacts rebuilt. No server-side change (the agent box was already correct).

---

## 1. What the organizer saw

`/start` in the rehearsal project finished with:

```
workshop connected (fanavar.kiloapp.ir, team p11); proxy verified; research verified.
```

`fanavar.kiloapp.ir` is a *previous* workshop, not the agent workshop (`agent.kiloapp.ir`, box `82.39.165.56`). The rehearsal then believed "server is setup" against the wrong server. Evidence on disk:

- `/home/omid/projects/event/.opencode/commands/` = V6.0.1 commands (correct kit), but root `opencode.json` (520 bytes) contained **no `mcp` section at all** — model + permissions only.
- `~/.config/opencode/opencode.json` (global) still held the previous workshop's entry: `workshop → https://mcp.fanavar.kiloapp.ir/mcp` (team p11 token).
- `event/docs/secrets/workshop.local.md` held the fanavar token — `/start` had written down whatever the (wrong) global connection answered.

## 2. Root cause (3 layers, all in the kit — not in the rehearsal)

1. **The compiled `opencode.json` baked no workshop address.** `compile/adapters/opencode/files/opencode.json` had no `mcp.servers.workshop` entry, even though `compile.py` already computes `{{MCP_URL}}` (`https://mcp.agent.kiloapp.ir/mcp`) for exactly this purpose. A fresh project therefore inherited whatever the laptop's global config pointed at.
2. **The instructions mandated the global config.** `adapters/opencode/tool.md` said *"The project's own `opencode.json` is **never** used for this"* and told `/start` to write the entry into the global settings file. `commands/start.md` step 5 did the same. So the bug was invisible by design: every project on a staff laptop shares one global pointer, and opening an old project silently re-points nothing — the *wrong* pointer just keeps working.
3. **No wrong-server guard.** `start.md` step 6 recorded whatever `whoami` answered into `docs/profile.md` without comparing `base_domain` against the workshop this kit was compiled for. A 200 OK from any workshop looked like success.

## 3. Fix (V6.0.2, project-local only — as requested)

Design (verified against official OpenCode docs + empirically with `opencode mcp list` / `debug config` v2.0.31):

- The kit's root `opencode.json` now carries the entry, compiled per workshop:
  `mcp.servers.workshop = {type: remote, url: {{MCP_URL}}, oauth: false, headers: {Authorization: Bearer {file:./docs/secrets/workshop.token}}}`.
- `{file:…}` is OpenCode's documented substitution (same family as `{env:…}`); the token stays in the git-ignored `docs/secrets/workshop.token`, so the tracked `opencode.json` holds only the public URL. Project config overrides global for the same server name, so old global entries stop leaking across workshops — and the global config is never touched.
- `/start` (step 5) now writes the token to `workshop.token` (raw) + `workshop.local.md`, verifies the entry exists in the *project* file, and (step 6) aborts unless `whoami`'s `base_domain` matches the entry's host — a 200 OK from the wrong server no longer counts as "connected".

Files changed in `agent/kandoo` (workshop artifacts):

| File | Change |
|---|---|
| `compile/adapters/opencode/files/opencode.json` | baked `mcp.servers.workshop` (`{{MCP_URL}}`, `oauth:false`, `{file:./docs/secrets/workshop.token}` header) |
| `compile/adapters/opencode/tool.md` | Connecting section rewritten: project-local only, never global; wrong-workshop guard |
| `compile/compile.py` | opencode `MCP_SETTINGS_PATH`/`RESTART_NOTE` defaults → project-local wording (flows into `03-tool.md`) |
| `templates/codo/commands/start.md` | steps 5–6: local token file, entry check, `base_domain` guard |
| `templates/codo/docs/constitution/03-tool.md` | connection bullet → project-local entry |
| `templates/codo/.gitignore` | added `docs/secrets/workshop.token` |
| `templates/codo/docs/secrets/README.md` | documented `workshop.token` (derived, raw, git-ignored) |

Verified before shipping:

- `compile.py --check` clean; `rtl_check` 0 violations; compiled `opencode.json` contains `https://mcp.agent.kiloapp.ir/mcp`.
- Live probe: project dir with `{file:./token.txt}` (real p01 token, trailing newline) → `opencode mcp list` = `✓ workshop connected`; same setup with wrong token → `○ pending`. Substitution + auth work end-to-end; trailing newline tolerated.
- `out/codo.zip` rebuilt and re-copied to `public/dist/codo.zip`, `private/dist/codo.zip` + `codo-6.0.1.zip` copies; `participant-book.pdf` refreshed.

## 4. Rehearsal project repair (`/home/omid/projects/event/`)

- Root `opencode.json`: added the agent-workshop `workshop` entry (same shape as the new kit).
- `docs/secrets/workshop.token` (new, git-ignored): seat **p01** of the agent workshop (organizer spare-seat convention from `rehearse.md`).
- `docs/secrets/workshop.local.md`: `WORKSHOP_TOKEN` replaced (fanavar p11 → agent p01).
- `.gitignore`: added `docs/secrets/workshop.token` (both secret files confirmed `git check-ignore`d; `git status` shows only the 5 intended tracked edits).
- Synced from the fixed kit (same as `/sync-rehearsal`): `.opencode/commands/start.md`, `docs/constitution/03-tool.md`, `docs/secrets/README.md`.
- `docs/status.md`: stale `fanavar` log corrected, fix logged.
- Verified in place: `opencode mcp list` → `✓ workshop connected`; `debug config` resolves the entry to `https://mcp.agent.kiloapp.ir/mcp`.
- **Still open for the organizer:** re-run `/start` from step 6 (`whoami` → expect `base_domain: agent.kiloapp.ir`) before `create_repo`, then continue the rehearsal.

## 5. Follow-ups (not in V6.0.2 scope)

- Same global-settings pattern exists in the other adapters (`claude-code/tool.md`, `codex`, `cursor`, `antigravity`, `devin` explicitly forbid the project file because "it is pushed to the team's repository"). They need the same treatment: bake URL at compile time, token via a git-ignored file the tool supports. OpenCode first because the rehearsal uses it.
- `freebuff` adapter has no MCP connection (knowledge-paste flow) — unaffected.
- Consider a pre-flight in `/start` step 1: if a global `workshop` entry points at a *different* base domain, warn explicitly instead of relying on the guard at step 6.
