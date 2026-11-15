# V6.0.4 — Issue #1: `/start` never mentioned the `existing_product/` handover path

> **Source:** organizer, 2026-10-21, rehearsal on `event/`. «after /start, it said nothing about existing product» — the closing message covered only the token-file restart and «write your idea into `00-idea-input.md`, then type /idea-core».
> **Why it happened:** `/start`'s *Next* section names exactly one action before `/idea-core` — write `docs/versions/0.1/00-idea-input.md`. The handover path exists (`existing_product/README.md` ships in the kit, `/idea-core` has a full handover mode: inventory → keep/adapt/rewrite → fast-track verified docs) but **nothing in the flow ever tells the participant the folder is there or what it is for**. A participant with a working product would type `/idea-core` over an empty `existing_product/` and start from zero — the feature was unreachable unless they stumbled on the README themselves. The book didn't help either: `01-bring` lists what to prepare (model key, bot, SIM, idea + real samples) but never «your existing product's files».

## What changed

- `templates/codo/commands/start.md` — *Next* now gives two things, not one: write the idea file **and** the handover line — «if you already run a working product or prototype, copy it into `existing_product/` first (the README inside says what goes in and what never does) and `/idea-core` adopts it instead of starting from zero».
- `templates/participant-book/01-bring.md` — §4 gains a bullet: participants who already have a working product bring its files (laptop or flash drive; code and docs, never secrets/`.env`) so the assistant can drop them into `existing_product/`. Checklist line added to match. This matters because a product snapshot is exactly the kind of thing that can't be produced on the workshop morning.
- `templates/participant-book/04-start.md` — the «در آخر از تو می‌خواهد ایدهٔ کارمندت را … بنویسی» bullet now also says: if you brought a working product, it will tell you to copy it into `existing_product/` so work continues from it — keeping the book truthful about what `/start` ends with.
- Rehearsal `event/.opencode/commands/start.md` synced with the fix (the Next paragraph carries no placeholders, so the compiled file is byte-identical to the template text) and committed in the event repo.
- `codo.zip` recompiled clean (RTL gate passed on the touched Persian pages) and redistributed to `out/`, `~/projects/`, and `private/dist/` (incl. `codo-6.0.4.zip`); `participant-book.pdf` rebuilt.

## Note

`/idea-core`'s handover trigger stays as designed: non-empty `existing_product/` → handover mode. No change needed there — the command already reads the folder; it was simply never fed.
