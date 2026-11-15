# 01-questions: Idea and Scope Clarifications

- Project: `007-islamic-astronomy`
- Version: `0.1`
- Input reference: `docs/projects/007-islamic-astronomy/versions/0.1/00-idea-input.md`

Please review and answer the questions below in Obsidian. You may answer directly under `Your answer:`, confirm the recommendations, or leave blank to accept the AI recommendation as provisional. When finished, save the file and say `done` (یا «نوشتم»).

---

## 1. Channel notes intake for `#نجوم_عمومی`
Kind: open question
Context: You mentioned you have a collection of channel notes tagged `#نجوم_عمومی` regarding the Sun, Moon, and Islamic worship that you wish to provide. We created `docs/projects/007-islamic-astronomy/versions/0.1/channel-notes.md` as a dedicated place in your Obsidian vault for these materials.
Options:
A. Paste the channel notes into `docs/projects/007-islamic-astronomy/versions/0.1/channel-notes.md` now before drafting the editorial brief.
B. Proceed with the proposed lesson structure now, and paste/supplement the channel notes during the content drafting stage (`job-content`).
C. The voice notes in `00-idea-input.md` already contain enough initial direction; develop the curriculum and incorporate specific channel notes only if needed.
AI Recommendation: A, because having the creator's raw notes upfront informs the pedagogical flow, tone, and specific astronomical examples from the start.
Your answer: A

## 2. Project slug and working title
Kind: AI decision
Context: The project was initialized with the provisional slug `007-new-post`. The topic is an interactive lesson on practical astronomy for Islamic worship (Sun, Moon, prayer times, day length, Qibla hour). Renaming to a descriptive slug clarifies references across the journal workspace.
Options:
A. Rename the project to `007-islamic-astronomy` (or `007-general-astronomy`).
B. Keep the existing slug `007-new-post`.
AI Recommendation: A (`007-islamic-astronomy`), because meaningful ASCII slugs keep workspace projects and asset directories organized and unambiguous.
Your answer: A

## 3. Interactive widgets and offline execution architecture
Kind: AI decision
Context: You requested interactive educational tools: (1) Tropic of Cancer and Iran's position on an interactive map, (2) Sunrise, solar noon, sunset, and makruh prayer intervals by location/date, (3) Annual day length variation curve across latitudes, and (4) Solar Qibla hour calculator (the exact time when facing the Sun points towards the Qibla). Kandoo constitution requires completely self-contained offline builds and standalone ZIP packaging without external CDNs or online runtime dependencies.
Options:
A. Build self-contained client-side vanilla JavaScript calculation engines (using exact spherical trigonometry and solar position algorithms) combined with inline SVG/Canvas interactive widgets with zero external network dependencies.
B. Vendor a bundled local JavaScript astronomy library into `projects/ID/src/` to power the mathematical calculations.
AI Recommendation: A, because standard solar coordinate and spherical trigonometry formulas for day length, solar azimuth, prayer times, and Qibla direction are compact, fast, mathematically transparent, and require no third-party library overhead.
Your answer: B, but do A if libraries are not enough. and I dont like "makruh" idea.

## 4. Initial delivery route
Kind: AI decision
Context: Every new post starts as an isolated private draft. Public site release requires an explicit contract in `living/publication.md`.
Options:
A. Keep as a private draft with local preview and standalone offline ZIP delivery first; decide on public blog deployment at the deploy step (`job-deploy`).
B. Create `docs/projects/007-islamic-astronomy/living/publication.md` immediately to target public site release from the outset.
AI Recommendation: A, adhering to the Kandoo protocol of verifying local interactive prototypes and offline bundles before authorizing public deployment.
Your answer: when we finished, we deploy it.

---

## Resolution

Submitted by user on 2026-11-15.

| Item | User response | Certainty | Behavior & Decision |
| --- | --- | --- | --- |
| 1. Channel notes intake | Explicit answer: A | Confirmed (`قطعی`) | Channel notes supplied in `docs/projects/007-islamic-astronomy/versions/0.1/channel-notes.md`. These constitute the authentic primary material and progression outline for the post. |
| 2. Project slug & title | Explicit answer: A | Confirmed (`قطعی`) | Renamed project workspace and docs from `007-new-post` to `007-islamic-astronomy`. |
| 3. Interactive architecture & scope | Explicit answer: "B, but do A if libraries are not enough. and I dont like 'makruh' idea." | Confirmed (`قطعی`) | Use bundled local libraries where suitable, falling back to clean vanilla calculations if libraries are insufficient or violate offline integrity. **Completely excluded "makruh times" from scope.** |
| 4. Delivery route | Explicit answer: "when we finished, we deploy it." | Confirmed (`قطعی`) | Proceed with local private draft, verify local build/preview, and deploy to public blog upon finished acceptance. |
