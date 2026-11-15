# V6.0.2 — Issue #3: make `/start` work WITH the polluted global MCP present

> **Source:** organizer, 2026-10-19. «then what happens to a participant that comes from workshop #5 to workshop #6? it will have that global MCP! we should assume that it works even with that fucking global MCP!!»
> **Answer shipped:** per-workshop server name (`ws_agent`) + shadow re-declaration of the bare name `workshop` with this workshop's URL/token. Verified by runtime tests E1/F1/F2 below. No `../event` change (per organizer constraint).

---

## 1. What was tried first — and why it failed

Three candidate kill-switches, all tested live on OpenCode v2.0.31 against a deliberately polluted laptop (real fanavar global entry, trap-protected, restored after each test):

| # | Mechanism | Result |
|---|---|---|
| 1 | `"tools": {"workshop_*": false}` in project config | **Harmful, reverted.** v2.0.31 silently rewrites it into a `permission: {action: workshop_*, effect: deny}` rule (seen in `debug config`). It does not gate MCP tools; it only adds a confusing phantom rule. |
| 2 | `"mcp.servers.workshop": {"enabled": false}` declaration | **Inert, reverted.** The live legacy entry kept working in agent sessions (`tools.workshop.*` callable, naive `whoami` → `fanavar.kiloapp.ir`). |
| 3 | Distinct server name only (`ws_agent`), no shadow | **Insufficient (proven).** Polluted + token + explicit *"call whoami on ws_agent"* → agent STILL called legacy `tools.workshop.whoami` → `fanavar.kiloapp.ir`. Model direction-following is not enforceable when a working same-shaped alternative exists. |

Test C (same setup, no token, naive prompt) likewise returned `fanavar.kiloapp.ir` — the exact silent wrong-server success from issues #1/#2.

## 2. What shipped: shadowing (correct under every merge behavior)

The kit's `opencode.json` now declares two servers reaching the SAME backend with the SAME `{file:workshop.token}` credential: `{{WORKSHOP_MCP}}` (`ws_agent` for this workshop, derived as `ws_` + first DNS label of `base_domain`) and a shadow re-declaration of the bare name `workshop` with this workshop's URL/token.

- Merge replaces the legacy entry → both names are correct. Merge deep-merges fields → URL/token overridden to correct values. Merge ignores the project (global wins) → status quo, no worse. There is no merge outcome that answers for the wrong workshop.
- No token file: both entries 401 → the assistant must ask (test F1: naive prompt → `NOTAVAILABLE`).
- Token present, naive prompt with NO server direction, fully polluted laptop: `agent.kiloapp.ir`, twice in a row (test F2 ×2). Whichever name the model picks, it lands right.
- `{file:}` token delivery itself proven working end to end (F2 used the token file, not inline).
- Direct-MCP and inline-token controls confirm the server side is fine; all failures were client-config behavior.

## 3. What shadowing does NOT fix (stale sessions)

A session opened before the fix holds the old config in memory; no file change reaches it. Symptom pattern: `mcp list` in a NEW process shows nothing/401 while the old window shows the previous workshop working. Prescription (unchanged): fully quit OpenCode + `opencode service stop` + reopen. The `base_domain` guard in `/start` step 6 stays as the backstop: any answer naming another workshop aborts before `create_repo`.

## 4. Files changed (kit only)

`compile/adapters/opencode/files/opencode.json` (two server entries), `compile/compile.py` (`WORKSHOP_MCP` derivation: `ws_` + sanitized first domain label), `compile/adapters/opencode/tool.md` (honest shadowing description + negative results), `templates/codo/commands/start.md` (steps 2/5.0/5/6: per-workshop name, shadow expectation, guard), `templates/codo/docs/constitution/00-rules.md`, `03-tool.md`. Recompiled (`--check` clean, RTL 0), `out/codo.zip` redistributed to `public/dist/codo*.zip`, `private/dist/codo*.zip`.
