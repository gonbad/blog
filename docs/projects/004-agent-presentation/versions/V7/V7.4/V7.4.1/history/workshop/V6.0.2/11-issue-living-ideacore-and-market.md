# V6.0.2 — Issue #11: idea-core must be a living doc and must contain the market analysis

> **Source:** organizer, 2026-10-19. «I think we should move the idea core in a living doc. and it lacks market analysis (I saw in logs that it did the research but did not write it). why?»
> **Answer to «why»:** the command said «competitor check via web_search» with no instruction to write the findings anywhere — so the research informed the chat session and evaporated. Nothing required it in a file. Fixed below.

## What changed

- Living template `docs/living/idea-core.md` created (RTL-safe skeleton): job title, mission, rented/in-house, end-user plane, boundaries, **بازار و رقبا (mandatory, never skipped — real named rivals + our edge, or what was searched and why it came back empty)**, referral/billing, setup, plus version-record pointer. The command now says: fill THIS template directly in the documents language.
- `commands/idea-core.md`: market section mandated in the living doc (not «checked», *written*).
- Rehearsal `event/docs/living/idea-core.md` rewritten natively in Persian (it was English despite documents language = فارسی), complete with a «بازار و رقبا» section (Evand's dominance/commission verified live; open-source Bale bots; listing-only players; our edge: conversational in-Bale signup, dedicated bot per event, humanoid management, broker model). Committed in the event repo.
