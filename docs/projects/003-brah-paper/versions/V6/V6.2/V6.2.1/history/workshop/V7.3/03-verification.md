# V7.3 rehearsal correction audit

This is the checkpoint for issues 1–3, before issue 4 changed the capability policy and package contents. See [04-soft-confirmation.md](04-soft-confirmation.md) for that later correction and its verification.

Date: 2026-11-03. Scope: the three reports in [01-transcription.md](01-transcription.md), the public-agent Codo source, its book and packaged commands, and the active `../konkooria/mentoraAgent/` rehearsal. This audit does not run infrastructure setup or change the participant's answers, project specifications, credentials, or phase progress.

## Initial findings

1. **Issue 1 — partial fix.** `/start` now begins with a language choice and explicit waits, but its Git step still requests name and email together, and its server step requests IP, password, and optional domain together. Those instructions contradict its own single-question rule. Setup completion also names a status checkbox that does not exist in the current template.
2. **Issue 2 — unsafe/incomplete fix.** Automatic key installation was added, but the Paramiko example interpolates the password into shell/Python source and uses `AutoAddPolicy` without loading OpenSSH's saved host keys; the fallback can bypass the preceding probe's host-key rejection. The installed key may differ from the one used by subsequent commands because verification and tunnel examples omit the selected identity. Passwords are invited into chat and the ignore rule was lost from `/start`. The existing-key path still asks for a password unnecessarily.
3. **Issue 3 — partial fix.** Most initial specification commands now prohibit chat interviews, but the review loop is duplicated and incomplete. `/prompts` and `/plan` can still advance without the same questionnaire/review cycle; entry files hard-code `0.1` for later releases; most commands do not explicitly re-read answers, accept `done`, distinguish submitted blank defaults from an unanswered round, or wait after each revision for approval of the latest document. The book also needs those distinctions.

## Verification status

All three reports are addressed at the instruction, book and package level. Final independent document review is clean, both rebuilt archives match the source, and the rehearsal instructions are synchronized. Static packaging checks establish document delivery and consistency; they do not establish that Antigravity follows the instructions in a live conversation or that a fresh VPS accepts password-to-key bootstrap.

## Corrections

| Report | Correction | Main source |
|---|---|---|
| 1 | Fresh setup asks only for the language pair first. Missing Git name, email, server IP, bootstrap password and domain choice each have their own wait. Existing answers and setup progress are reused. Completion updates the actual status row. | [start.md](../../../workshops/public-agent/codo/docs/commands/start.md) |
| 2 | The assistant chooses or generates a usable key without overwriting existing keys, tests it first, and requests only a missing bootstrap password in the ignored local file. Passwords remain data; installation uses a restricted temporary file or Paramiko/SFTP with persisted host trust. The same absolute identity path, host and port are used for verification, tunneling and deployment. Successful key verification clears the bootstrap password. | [start.md](../../../workshops/public-agent/codo/docs/commands/start.md), [deploy.md](../../../workshops/public-agent/codo/docs/commands/deploy.md) |
| 3 | One canonical protocol governs all later phases. It distinguishes pending blanks from submitted defaults; re-reads files after completion signals; preserves rounds; applies COMMENT / نظر; returns to questions when needed; and waits for review of every materially revised document. All commands route to the active version folder, including prompt/plan and incremental work. | [03-workflow.md](../../../workshops/public-agent/codo/docs/constitution/03-workflow.md) |

The three vendor entry files and security/workflow constitutions state the same boundaries. Phase-specific requirements remain in each command. The initial status template now includes an active folder, review stage and questionnaire path. Book chapters 4 and 5 explain the corrected sequence and review cycle. The earlier analysis is retained as history with a pointer to this audit.

## Document walkthroughs

These are checks of the instructions, not executions of the assistant or remote setup:

| Scenario | Required stopping point / outcome in the revised protocol |
|---|---|
| Fresh `/start` | Language-pair choice only; wait before Obsidian or credentials. |
| Missing Git identity and server details | Separate name, email and IP requests; password only after key authentication fails; domain choice separately. |
| Key already works | Skip password collection and public-key installation. |
| Password contains quotes, spaces or shell metacharacters | Read as literal data; never insert it into shell/Python source. |
| Changed host key or unreachable server | Retain a blocker; do not attempt password installation as a workaround. |
| Questionnaire exists with empty answers | Wait for submission; file existence alone does not accept defaults. |
| Creator sends `done` / `I answered` / `پاسخ دادم` | Re-read the current stage from disk; resolve submitted blanks using explicit defaults. |
| A COMMENT creates a new decision | Add the next question round, wait for answers, revise the document, then wait for renewed review. |
| `/prompts`, `/plan` or work under `0.2/0.2.1/` | Use the same protocol and the active folder; no automatic advance or write-back to initial `0.1`. |

## Packaging and rehearsal scope

Rebuilt with `python3 scripts/build_codo.py --name codo` and `python3 scripts/build_codo.py --name codo-agent`. Both archives are under `workshops/public-agent/dist/`. Archive verification checks Markdown/template-only content, no local credential files or unsafe/duplicate archive paths, authored source equality, and all 14 canonical procedures plus their 42 generated wrappers. The corresponding instruction files, README and safe infrastructure example are synchronized into `mentoraAgent`.

Antigravity's official documentation confirms `.agents/skills/<name>/SKILL.md` as a workspace skill location, with slash invocation supported; the existing package integration uses that location. No extra Antigravity integration directory was needed. [Google Antigravity agent skills](https://antigravity.google/docs/skills?app=antigravity).

The rehearsal's profile/status, idea input, questionnaire answers, living specifications, actual prompt files, tunnel script and real secrets are excluded from synchronization. A hash comparison covers 18 such existing files; their contents are never included in this report. No SSH, key installation, server mutation, application deployment or participant-state reset is performed during this audit.

## Final review and checks

- Independent adjudicator review identified the multi-input setup prompts, unsafe password interpolation, initial-folder routing, missing prompt/plan review and unusable-key handling. The next review found two remaining details: recording the active patch before `/issue` clarification and including the configured SSH port in the book. Both were corrected; the final bounded re-review reported no remaining defects.
- Both final archives contain 83 entries: 41 authored Markdown/template files and 42 generated wrappers for 14 procedures. Exact archive membership, authored-file bytes and wrapper bodies match the source. The rehearsal's synchronized instruction files match both archives.
- All 18 protected rehearsal files retain their original hashes. The participant's current phase and answers are preserved.
- The three vendor entry files are identical. Markdown code fences and scoped `git diff --check` pass. Existing changes elsewhere in the workspace were left in place.
- No live Antigravity conversation, fresh-server password bootstrap, Caddy setup or deployment was executed. Continue the current rehearsal with the existing questionnaire; verify fresh `/start` and password bootstrap in a separate fresh setup rather than resetting the active project.
