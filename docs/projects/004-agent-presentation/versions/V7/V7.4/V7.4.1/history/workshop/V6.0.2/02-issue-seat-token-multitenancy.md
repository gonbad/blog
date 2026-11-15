# V6.0.2 — Issue #2: "the kit never asked for my seat token"

> **Source:** organizer, fresh rehearsal project (`/home/omid/projects/event/`, deleted + recreated from the V6.0.2 `out/codo.zip`), reported 2026-10-19.
> **Organizer's words:** «it did not ask me my seat token in the workshop server!! it seems that it was embedded into it!! remove the token and make it ask me because I want to send codo.zip to multiple participants and each have their own token. also give me the list of all tokens and the one that is used. also check the server and see if initialization did correctly for that token or not.»
> **Verdict:** no token is, or ever was, embedded in `codo.zip` (proven below). What answered without asking was the laptop's **global** config — the previous (fanavar) workshop. Fixed by hardening, not by removal.

---

## 1. Proof the kit carries no token

- `grep` for every live seat token across the unzipped `out/codo.zip`: **no match** (exit 1).
- The zip's `docs/secrets/` holds **only** `*.example` files (`WORKSHOP_TOKEN=` empty).
- The fresh `/home/omid/projects/event/` is pristine: no `.git`, no `docs/secrets/workshop.local.md`, no `workshop.token`, `status.md` untouched, `/start` never ran. Nothing in it could answer — except the global entry:
  `~/.config/opencode/opencode.json` → `workshop → https://mcp.fanavar.kiloapp.ir/mcp` (team p11).
- So "it did not ask" = the tools were already usable through the global fallback, and "embedded" = that invisible fallback. Same family as issue #1, one layer deeper (this time the project entry exists but has no token file yet).

## 2. Server-side seat inventory (agent workshop, live `whoami` per seat, 2026-10-19)

| Seat | Repo | App | DB | Subdomain | Next step | Initialized? |
|---|---|---|---|---|---|---|
| p01 | `p01/event.git` | no | no | — | `create_repo` | **Partial** (repo without app/db — leftover of the deleted rehearsal run; resumable, not broken) |
| p02–p12 | — | no | no | — | `create_repo` | Pristine, ready |

Full seat↔token table was handed to the organizer directly (source of truth stays `agent/kandoo/docs/secrets/roster.local.md`). Net: 11 of 12 seats untouched; the deleted rehearsal's seat (p01) needs a re-run of `/start` from step 6/7, or a clean seat (recommend **p02**) for the fresh run.

## 3. Fix (kit hardening — one `codo.zip` stays valid for all participants)

`templates/codo/commands/start.md` step 5 gained step **5.0 — "Ignore already-working tools"**: if workshop tools answer before any token file exists in the project, they come from the laptop's global config (a previous workshop). The assistant must not use/trust/record them, must still ask for this workshop's seat token, write both token files, restart, and pass the step-6 `base_domain` guard. The guard from issue #1 stays as the backstop.

Rebuilt + redistributed: `agent/kandoo/out/codo.zip` → `public/dist/codo.zip`, `private/dist/codo.zip`, `codo-6.0.1.zip` copies, participant book PDF. `compile --check` clean, `rtl` 0 violations.

## 4. Distribution rule (for the organizer's own procedure)

- Send every participant the **same** `codo.zip` — it contains the workshop *address* (public) and zero tokens.
- Hand each participant **their own seat token** through a personal channel (max one seat per laptop; never reuse a seat across two projects).
- First thing in each project: `/start` asks for the token (step 5) and proves the server with the `base_domain` guard (step 6). If step 6 ever names a different domain, stop — that session is reading another workshop.

## 5. Addendum — global entry removed, fail-closed confirmed (2026-10-19)

- Organizer asked to remove the laptop-global workshop entry. `~/.config/opencode/opencode.json` held nothing but the fanavar entry; backed up to `/tmp/opencode.global.backup.json`, file reset to `{}` (the `.jsonc` beside it never held an entry).
- Fresh `event/` project (from new `codo.zip`, pre-`/start`, no token file) now resolves to `✗ workshop failed: 401 توکن نامعتبر است` — the project-local agent entry with no token. This is the demanded behavior: fail closed, ask for the token, no silent fallback anywhere.
- The p01 repair from §4 died with the deleted project folder; the seat itself is untouched on the server. Recommendation stands: run `/start` in the fresh project and paste the **p02** token when asked.

## 6. Root cause confirmed — the stale background service (2026-10-19)

After the global entry was deleted, a fresh project *still* showed "connected". Cause: the OpenCode background service (`opencode serve --service`, running since 08:02) had loaded the old global config at startup and kept serving the fanavar entry from memory — exactly the case `tool.md` already warned about ("the background service may still hold the old settings"). `opencode service stop` cleared it (the pre-restart service process is gone; the post-restart one never saw the old config).
Verified after the restart: neutral dir → `No MCP servers configured`; fresh `event/` (token file absent) → `No MCP servers configured` — the project entry resolves only once `/start` writes `docs/secrets/workshop.token`. No silent fallback remains anywhere: no global entry, no service cache, no token in the kit.
Rule of thumb for staff and participants: after ANY connection change, fully quit OpenCode **and** run `opencode service stop` before reopening the project — otherwise the previous workshop stays alive in memory.

## 7. Second "still connected" report — stale client session, not stale config (2026-10-19)

After the service restart the machine verified clean from cold processes (neutral dir and fresh `event/` both → `No MCP servers configured`), yet the organizer's open window still showed the previous workshop with no token prompt. Diagnosis: that window/session was opened **before** the fixes (long-running TUI processes from 08:02/08:27) and holds the deleted global entry in memory; OpenCode loads MCP config once at session start. Filesystem, service, and kit are all clean — only the old window is stale.
Prescription (no kit change): fully quit OpenCode (all windows + tray), `opencode service stop`, reopen the fresh folder, run `/start`. Self-test in any *new* terminal beforehand: `cd ~/projects/event && opencode mcp list` must print `No MCP servers configured` before `/start`, and `✓ workshop connected` only after the token file + restart.
On renaming the MCP server (organizer's suggestion): rejected as the fix. A new name does not evict anything from a stale session — it would show *both* entries and force every command, doc, and tool-prefix reference (`tools.workshop.*`, `workshop_whoami`) to be renamed for zero gain. Distinct-per-workshop names remain an option for visibility, but the actual cure is session restart; the `base_domain` guard stays as the backstop.
