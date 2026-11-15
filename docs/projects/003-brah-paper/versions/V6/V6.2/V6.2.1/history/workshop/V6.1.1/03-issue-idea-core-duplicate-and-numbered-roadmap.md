# V6.1.1 — Issue #3: Duplicate `01-idea-core.md` in `docs/versions/0.1/` (colliding with `01-idea-core-questions.md`) + Unnumbered Items in `docs/living/roadmap.md`

> **Source:** organizer, 2026-10-27, V6.1 rehearsal on `/home/omid/projects/event/`.
> **Organizer's words:** «next issue: it created two docs for idea core: one in living folder and one numbered (wrongly numbered!) in v0.1 folder. I think the living one would suffice. another issue: the roadmap items should be numbered so that I can refer to them.»
> **Status:** fixed across kit templates/commands, `codo.zip` recompiled (RTL check clean) and redistributed, `/home/omid/projects/event/` cleaned up, committed (`2f4a6e5`), and pushed.

---

## 1. Issue #3a: Duplicate `docs/versions/0.1/01-idea-core.md`

### Why it happened
- When numbered per-step question files (`01-idea-core-questions.md`, `02-prd-questions.md`, …) were introduced in V6.0.2-#20, `templates/codo/commands/idea-core.md` (line 33), `00-rules.md` (line 38), `docs/living/idea-core.md` (line 3), and `docs/versions/README.md` still held a pre-V6.0.2 instruction to also write a snapshot file `docs/versions/0.1/01-idea-core.md`.
- That created two problems:
  1. It duplicated `docs/living/idea-core.md` (whereas every other spec step — `/prd`, `/tools`, `/sops`, `/data-model`, `/edge-cases` — writes only to `docs/living/`).
  2. It collided on the `01-` prefix with `01-idea-core-questions.md` in `docs/versions/0.1/`.

### What changed
- `templates/codo/commands/idea-core.md` (`## Writes`): writes `docs/living/idea-core.md` only; explicitly forbids creating a duplicate `01-idea-core.md` in `docs/versions/0.1/`.
- `templates/codo/docs/constitution/00-rules.md` (`## Questions format`): removed `01-idea-core.md its snapshot` and stated that approved specs live only in `docs/living/`, never duplicated in `docs/versions/`.
- `templates/codo/docs/living/idea-core.md`: removed `رکورد نسخه: docs/versions/0.1/01-idea-core.md` from the header blockquote.
- `templates/codo/docs/versions/README.md`: replaced the stale V4/V5 file tree (`01-idea-core.md`, `02-questions.md`, `03-input.md`, `checklist.md`, `handoff.md`) with the actual V6.1 version directory layout (`00-idea-input.md`, `01-idea-core-questions.md` … `10-test-questions.md`, `plan.md`, `test.md`).
- In `/home/omid/projects/event/`: removed `docs/versions/0.1/01-idea-core.md` (`git rm`) and cleaned line 3 of `docs/living/idea-core.md`.

---

## 2. Issue #3b: Numbered Items in `docs/living/roadmap.md`

### Why it happened
- `templates/codo/docs/living/roadmap.md` had an English header (`# Roadmap — banked ideas`) and a bullet placeholder (`- (empty)`), and `idea-core.md` / `prd.md` didn't require sequential numbers, while `add-idea.md` still referred to an old table format. As a result, `/idea-core` wrote 5 unnumbered `-` bullets into `docs/living/roadmap.md`, making it awkward for the owner to refer to specific banked ideas by number.

### What changed
- `templates/codo/docs/living/roadmap.md`: rewritten as a clean Persian template (`# نقشهٔ راه — بانکِ ایده‌های نسخه‌های بعد`) prescribing sequential item numbers (`۱.`، `۲.`، `۳.` …).
- `templates/codo/commands/idea-core.md` & `prd.md`: require all scope cuts added to `docs/living/roadmap.md` to use sequential numbers (`۱.`، `۲.`، `۳.` …), never unnumbered bullets.
- `templates/codo/commands/add-idea.md`: aligned with the numbered list format in `docs/living/roadmap.md` (appends the next sequential number `N.` without renumbering existing items).
- `templates/codo/commands/iterate.md`: lists `docs/living/roadmap.md` items with their numbers in `01-iterate-questions.md` so the owner can pick items by number.
- In `/home/omid/projects/event/docs/living/roadmap.md`: converted the 5 banked ideas to numbered items `۱.` through `۵.` under the Persian header.
