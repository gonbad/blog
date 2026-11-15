# V6.0.2 — Issue #7: purge stale V5 vocabulary (`/role`, `hiring.md`, `employment #0`…)

> **Source:** organizer, 2026-10-19. `/start` told them: «your pasted text named the next step ‹role›, but this kit renamed it — …then type /idea-core.»
> **Cause:** the V6.0.1 rename (`role`→`idea-core`, `hiring`→`management`, build-time persona/avatar→runtime employer settings, `#0`→first employer via `/wire`) was never propagated past `start.md`/`AGENTS.md`. Eleven template files still spoke V5: the assistant read them, then corrected itself mid-run with that confusing note. (The trigger text itself came from a pasted old-kit `/start` output — which is exactly why no old name may survive anywhere.)
> **Fix:** full vocabulary sweep of `templates/codo` — verified zero stale references remain (grep for `role.md|hiring.md|persona.md|avatar.md|‹role›|‹hiring›|‹persona›|‹avatar›|/role|/hiring|/persona|/avatar|employment #0|PersonaSlot|Hiring(|ensure_owner|manage-spec.md|employer.md` returns nothing).

## What changed (V6.0.1 vocabulary, everywhere)

- `commands/tools.md`: gate is `prd.md` (not `avatar.md`); reads `idea-core.md`+`prd.md`; "management channel" rewritten as employer `WiringSlot`s over `/employer/mcp` (no management bot/channel exists anymore); destinations become `/manage-spec` behavioral fields; humanoid-risk question decoupled from `/hiring`; payment sign-ups scoped to agents whose Work Plane actually collects money (everyone else skips payments — billing clears through brokers).
- `commands/sops.md`: reads `idea-core`+`prd`+`tools`+`management`; meters are wholesale meters from `management.md`.
- `commands/edge-cases.md`: reads `idea-core`+`prd`+`management`+`sops`+`data-model`; boundary lines live in `idea-core.md`.
- `commands/plan.md`: `job.py` structure rewritten for `ManagementSpec` + default persona/`persona_editable` + `@employer_tool`/`@work_tool`.
- `commands/build.md`: description fixed; the `ensure_owner` `#0` section (calling a function that does not exist in codo-core 0.2.0) replaced with «first run happens at `/wire`»; account activation moved to `/wire`, collection stays here; model-key tolerance already added in #4.
- `commands/ux.md`, `iterate.md`: `/role`→`/idea-core`, `hiring.md`→`management.md`.
- `backend/app/job.py`: V5 template (`Hiring(model="inhouse")`, `PersonaSlot(allowed=…)`, `role_file="role.md"`) rewritten as a 0.2.0 skeleton (`ManagementSpec`, `WiringSlot`, `employer_tools`, `work_tools`).
- `docs/README.md`, `00-idea-input.md`, `docs/living/architecture.md`, `01-workflow.md` (full 13-step + 3 floating pipeline table; living-list fixed), `02-tech-stack.md`: renamed throughout.
- Recompiled clean (`--check` OK, RTL 0), zips redistributed.

## Addendum — bilingual progress bar (organizer note: English users got a Persian bar)

`AGENTS.md` said «print one bar in the conversation language» but shipped only the Persian template, so English-conversation participants got a Persian bar. Fixed: `AGENTS.md` now carries both day-map templates (FA + EN), both legends, both version bars, and both next-step lines, with an explicit selector (read Conversation language from `docs/profile.md`; never mix). All command files already defer the bar shape to `AGENTS.md`, so no per-command change was needed. Participant-book `04-start.md` example bar + step bullets updated to the V6 steps (they still showed the V5 map: شغل/استخدام/پرسونا…).

## Addendum — file-based questions loop actually specified (organizer: questions asked in chat, should be in .md files)

The cookbook (`agent/cookbook/01-model.md`) already specified the design — «هر گامِ فکری یک گفت‌وگو روی پرونده‌هاست، نه در چت… شرکت‌کننده زیرِ «پاسخِ تو:» جواب می‌دهد» — but the kit never implemented it: only `prd.md`/`tools.md` name-dropped a «file-based questions loop» that existed nowhere, while 00-rules `Questions format` described chat Q&A. So assistants defaulted to chat.
Fixed: 00-rules now defines the loop authoritatively (per-step `docs/versions/<ver>/questions-<step>.md`, max 3 open questions per round, numbered + «چرا مهم است» + options with «پیشنهادِ ما» + `Your answer:` line; chat is notifications-only). All twelve question-asking commands point at their file (`idea-core`, `prd`, `tools`, `manage-spec`, `sops`, `data-model`, `edge-cases`, `test`, `iterate`, `design`, `prototype`; `plan` reads prior rounds). `/start` keeps its two bootstrap questions in chat as the documented sole exception. Books updated (`04-start.md`, cookbook path now V6 steps).
Explicit follow-up (not this round): cookbook `02-employee.md` still teaches the V5 job/hiring/persona/#0 model — needs a chapter rewrite, tracked separately since the book drives no agent behavior.

## Addendum 2 — no question cap; empty answer takes the default (organizer: «WTF!! why max 3? ask what you need to ask! and make sure in case of empty answer, default is taken»)

The «max 3 open questions» cap was removed everywhere (00-rules loop, edge-cases, prototype): ask everything the step needs, rounds are only readability sections. Empty-answer rule added to 00-rules: a blank `Your answer:` = the marked default («پیش‌فرض گرفته شد»), recorded in the file. Explicit carve-out, not guessable: secrets, tokens, names, and anything only the participant can know have NO default — re-ask once, then stop and wait. (Deliberately kept: design's «at most 2 directions» — that caps options inside one question against menu-overload, not the number of questions.)

## Addendum 3 — exact slash commands, no angle quotes (organizer: end-of-step line said «گامِ بعد: ‹manage-spec›» instead of the command to send)

The kit's convention («a name in angle quotes — ‹build› — marks such a place») leaked into user-facing output. Removed kit-wide: every `‹command›` is now the literal slash command (`/manage-spec`), the AGENTS.md convention paragraph now mandates exact-slash-form always, and both next-step templates show examples (`«گامِ بعد: /manage-spec»`, `Next step: /manage-spec`). Verified zero `‹›` remain in templates.

## Addendum 4 — rehearsal check: /manage-spec one-shot review + thin-input counterfactual (2026-10-19)

Organizer ran `/manage-spec` in `event/` (old-kit folder: its 00-rules has no file-loop rule, its manage-spec.md never says to ask — so one-shotting was instruction-following, not laziness). Reviewed `management.md`: good draft — all 16 fields captured from 7 voice notes; wholesale meter correctly follows the voice (100k per *started* registration) over the stale rehearsal idea-input (per *paid* registration); v0.1 scoping correct (employer builds bot, BotFather-provisioner deferred); money-flow separation recorded; `approve/cancel/event_update` employer_tools are grounded extrapolations.
Genuine gaps it should have asked even with this rich input: discount-band numbers, persona defaults, free units, `pay_first` default, and the explicitly requested opinion on owner-builds-vs-employer-builds + commission model («ببین چه کاری کنیم بهتره») — recorded the v0.1 choice with no recommendation. Recommendation: recreate from the newest zip and re-run `/manage-spec`.
Counterfactual proven on the new kit: a one-line idea-input («یه ایجنت برای فروشگاهم…») through `/idea-core` produced 7 numbered Persian questions in `questions-idea-core.md` (why-it-matters + options + «پیشنهادِ ما» + «بدون پیش‌فرض» where apt + blank=default rule) and stopped to wait. With a poor input, the new kit asks; with this rich one, silence was defensible except the 5 items above.

## Addendum 5 — docs stay inside docs/ + Persian RTL shape (organizer: sops.md pointed outside docs/ and was unreadable)

Two rules added to 00-rules: (1) living/versioned documents never reference `.md` files outside `docs/` — SOP instruction bodies live in full in `sops.md` (`متن دستورالعمل` blocks) and `/build` copies them to the backend; the doc is the source of truth, never the reverse; (2) every Persian-containing line must start with a Persian word (same rule the template RTL gate already enforces) — no leading Latin labels/paths/code spans; pure-English lines stay in fenced blocks; Persian table headers.
Applied: template `sops.md` rewritten (inline instruction blocks, Persian-first skeleton); `sops`/`build`/`plan` commands reworded to copy-semantics; event `sops.md` rewritten in place (same content: 6 SOPs + zero-balance + meter table; headings `## رویهٔ …`, fields `محرک/مخاطب/…`, Persian table headers, zero backend `.md` references — build destination described without a path). Verified zero `backend/*.md` references remain in any kit docs or commands.

## Addendum 6 — edge cases: no codes, no tables, resolution inline (organizer: «asked me about A1+A2+A8 and I don't know what to say»)

The old shape (code table + empty resolution column + questions-file round-trip) was wrong for this step: most edge cases are analysis the assistant does itself, not participant decisions. New `/edge-cases` procedure: every case is a section with a plain Persian heading (codes banned), a replayable **سناریو**, a **رفتار درست** traced to real SOPs/tools/meters, and a **وضعیت** resolved inline with the exact doc pointer — doc changes applied in the same session. Participant input happens only for (a) facts no default can fill (rare `open — needs organizer`), (b) explicit risk sign-off; everything else ships with a documented safe default in the «چیزهایی که با پیش‌فرض امن حل شده‌اند» box. Template `edge-cases.md` rewritten to the section skeleton.
Event file rewritten: 24 full scenarios, all `resolved` with pointers (5 surgical doc lines added along the way: sops engine-failure/retry, payment-reconciliation, approval-reminder 6h, management readiness gate, discount/meter defaults). Verified with the repo's own `rtl_check.py`: 1 violation found and fixed (Latin-led heading). Kit questions files are now the exception path, not the method.

## Addendum 7 — docs stay inside docs/ + Persian RTL (organizer: sops.md «refers to .md files outside docs/» and «unreadable»)

Two new 00-rules sections: (1) living/versioned docs never reference `.md` files outside `docs/` — SOP instruction bodies live in full in `sops.md` (`متن دستورالعمل` blocks) and `/build` copies them to the backend; (2) every Persian-containing line must start with a Persian word (same rule the template RTL gate enforces), pure-English lines in fenced blocks, Persian table headers. Template `sops.md` + `sops`/`plan`/`build` commands reworded to copy-semantics.
Event `sops.md` rewritten in place (same 6 SOPs + zero-balance + meter table, Persian-first headings/fields, inline instruction bodies, no outside refs) + `edge-cases.md` rewritten (24 full scenarios, no codes/tables, inline resolutions, safe-defaults box; 5 surgical doc lines added so every resolution points at real text) + `management.md`/`tools.md`/`00-idea-input.md`/`01-idea-core.md` RTL fixes. Verified with the repo's own `rtl_check.py`: 0 violations across all living + versioned docs. Committed in the event repo.

## Addendum 8 — edge cases rewritten: no codes/tables, resolution inline, assistant does the work (organizer: «asked me about A1+A2+A8 and I don't know what to say… I don't expect non-technical users to handle this step»)

Agreed — quizzing the participant was the wrong design. New contract: the ASSISTANT generates, scenarios, traces, and resolves every case itself (editing living docs on the spot); the participant's entire job is (a) answering only true missing facts, (b) one plain-language sign-off. `resolved` = handled in the docs with a pointer (verified); `accepted` = participant signed the risk list; `open` = a true blocker naming exactly what's missing — the only thing that gates `/plan`. Event file rewritten (26 sections, all resolved, defaults box, sign-off block); 5 missing doc lines added so every pointer is real (engine-failure, payment-reconciliation, 6h reminder, readiness gate, discount/meter defaults); rtl_check clean; committed.
