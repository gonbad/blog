# V6.0.2 — Issue #9: `/plan` skipped risk acceptance + model-comparison question

> **Source:** organizer, 2026-10-19. New session, Gemini 4 Argon Contributor High, ran `/plan`: (1) «it did not mention open remaining risks at all. it was expected that I accept the risks or ask for a better resolution»; (2) «look at the plan it generated — is it better than what Muse does? if yes, recommend all participants to start a new session with Argon and after that do /build in a new session with Muse again»; (3) «I see that my new issues are not reflected in V6.0.2 docs».
> **Verdict on (1): real gap, fixed in kit + applied.** Verdict on (2): no model recommendation on this evidence — details below. Verdict on (3): coverage audit included below; this file closes the gaps.

## 1. Why Gemini acted on V5 — mechanism, not model

The participant folder's `.opencode/commands/plan.md` line 12 literally instructs: `Hiring(...)`, `Persona for #0 + PersonaSlot`, `hiring.management`, `instruction file`. The assistant followed its instructions to the letter — any model fed that file (Muse included) produces V5-shaped output. The folder predates the vocabulary sweep; the kit template had already been fixed. Lesson enforced in kit: none needed beyond what V6.0.2 already did (templates are the single source; stale folders get recreated, never patched by hand).

## 2. The acceptance gap was real — fixed in kit, applied here

`/plan` counted zero `open` cases and moved on; the unsigned sign-off and the safe-defaults box were never presented. Kit fix (already shipped in `commands/plan.md`): an **acceptance step before writing** — residual risks + defaults go in `questions-plan.md`, and `plan.md` is not written while the sign-off is unsigned and unanswered. Applied to the rehearsal: `event/docs/versions/0.1/plan.md` rewritten to the 0.2.0 API, header marked «پیش‌نویس — در انتظار امضای پذیرش», and `questions-plan.md` created with the 3 risks + 4 defaults awaiting قبول/ویرایش.

## 3. Model comparison: inconclusive — do NOT switch models on this evidence

The generated plan is genuinely strong in places (numbered build order with a check after each step, test hooks mapped per edge case, full env table with `check` wiring). But it was produced by the **V5 template** — `management="event_bot"`, `referral="broker"`, `Band(floor_pct=100…)`, `backend/app/persona.py`, invented `EVENT_WEBHOOK_SECRET`, `#0` bootstrap thinking. A plan that follows outdated instructions proves thoroughness, not model superiority; as specified it would not survive `codo-core check` on 0.2.0. The V6.0.1-specific judgment calls (meters, wholesale, MCP planes) were absent from its instructions, so there is no evidence either way on those.
Ruling: keep one model per the stack preset. If a comparison is wanted, run it controlled: same newest kit, same inputs, both models, scored blind on (a) compiles against the 0.2.0 API, (b) every edge case traced, (c) no invented APIs/secrets, (d) meters/prices faithful to management.md. Until such a run exists, no routing recommendation changes. (Noted for a possible follow-up: `/plan` is the most reasoning-heavy step, so it is the natural candidate IF a controlled test ever justifies split models.)

## 4. Docs coverage audit (organizer: «new issues not reflected»)

Every reported issue now has a home: #1 wrong-workshop → `01`; #2 seat-token/multitenancy → `02`; #3 polluted-global design → `03`; #4 start-cleanup + wire-key → `04`; #5 create_repo 422 → `05`; #6 first clean start → `06`; #7 vocab purge + addenda 1–8 (bilingual bar, file-loop, no-cap, angle-quotes, manage-spec review, docs-inside+RTL, edge-cases redesign, stale-session diagnosis) → `07`; #8 native documents → `08`; #9 this file. Gaps closed by it: the /plan acceptance step above and this model verdict. Remaining known follow-ups (stated, not hidden): cookbook `02-employee.md` V5 chapter rewrite; controlled Argon-vs-Muse comparison if wanted.
