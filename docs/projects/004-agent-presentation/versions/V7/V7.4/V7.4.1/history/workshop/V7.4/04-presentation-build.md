# V7.4 — Presentation build and verification

Date: 2026-11-04  
Delivery: [presentation/index.html](../../../presentation/index.html) and [portable ZIP](presentation-v7.4.zip).  
Status: Historical first build. Its readiness assessment is superseded by [07-response-to-feedback.md](07-response-to-feedback.md) and the implemented repairs in [09-presentation-repair.md](09-presentation-repair.md). The [first draft is archived](../../../presentation-archive/v7.4-first-draft/index.html).

## Delivered

The presentation is rebuilt with 127 content slides and 21 recurring route maps. It uses local Estedad fonts, a warm paper/ink/blue visual system, large Persian typography, varied compositions, source captions, and dedicated visual treatments for the future examples.

The folder opens directly through `file://`. Classic JavaScript and local relative assets avoid a server or build step for recipients. Searchable overview, deep links, full-screen controls, keyboard/touch navigation, chart enlargement, and speaker notes are included. [The local guide](../../../presentation/README.md) lists controls.

Interactive sequences cover travel planning, the model/harness/tool loop, direct/soft/hard confirmation, secret handling, and outage/recovery. A small neural-network example has an adjustable numerical weight. Fiction references use Netflix episode stills, a moving book/ink scene, an animated figure, an official Cyclon product visual, and two original illustrations.

The illustrations were produced with the built-in imagegen tool and saved as `presentation/assets/portrait.png` and `presentation/assets/memory.png`. Their exact prompts and provenance are in [05-visual-prompts.md](05-visual-prompts.md). Media credits, font license and research links are also available inside the deck's [sources page](../../../presentation/sources.html).

## Latest comments applied

| Comment | Delivered treatment |
|---|---|
| Connector-verification slide belongs in Codo | Original outline slide 89 is omitted. The content count is therefore 127. Original IDs remain stable for review links; the displayed counter is continuous. |
| Slide 95 title is unnatural Persian | Rewritten as «قرار است چه کاری انجام دهد؟»; audience copy was written separately from the English planning notes. |
| Every fiction example needs an image, motion or video | Dedicated stills for Be Right Back and Eulogy; generated portrait and memory illustrations; animated figure and diary scenes. All required media are local. |
| Simplify the presentation's secret example | The demo uses a phone number passed to a booking service. The harness checks current-user ownership and whether the tool may receive that secret type before resolving the handle. An unauthorized service is visibly denied. |
| Keep the more general recipient mechanism for Codo | Retained in the planning record as a later Codo requirement; the presentation uses the simpler service example. |
| Take special care with Persian | Visible copy is independent of revision history. It uses the supplied translation example, short explanations, and concrete question-led transitions. |

The two earlier annotated documents are preserved with their comments. The paper and participant Codo/book have not been rewritten during this presentation build; their propagation remains after presentation feedback, following the agreed sequence.

## Verification

Chrome was launched through Playwright against the actual local HTML, with the browser context offline. The checks did not use a development server or a file-access bypass flag.

- All 148 pages were visited and checked for text/diagram boundaries against the slide and footer. Final scan: no clipping detected. Representative screenshots were inspected for the opening, route map, loop, secret mechanism, benchmark, pricing, diary and cinematic compositions.
- No JavaScript page errors and no HTTP(S) requests occurred during the deck run.
- Bundled fonts loaded. All seven image assets used by the deck decoded successfully.
- Allowed secret delivery exposes the illustrative value only to the permitted service panel. The denied destination displays rejection and no raw value.
- All 16 interactive demonstrations were exercised through 73 states, including visible final chat messages and the independent confirmation-button path. Loop progression, reset/next controls, the adjustable network weight, overview search, speaker notes and chart zoom were exercised. A dialog-focus race found during review was corrected.
- Desktop/laptop views were checked at 1600 × 960, 1366 × 768 and 1920 × 1080.
- The ZIP was extracted under `/tmp/workshop v7.4 portable/`; `index.html` was then opened offline from that path containing spaces. Images, notes, search, zoom and the denied-service sequence worked with no page errors or remote requests.
- JavaScript syntax and local HTML/CSS asset paths were checked.

These checks establish the presentation's local behavior, not the operation of a production agent. The diagrams and simulated service sequences are identified as educational examples and do not call live business APIs.

## Archive

The previous active presentation and the three V7.0 decks are preserved under [presentation-archive](../../../presentation-archive/README.md), together with their original local assets. The three historical entry files now redirect to their archived originals, keeping old analysis links usable. The active deck's old benchmark images were moved into its preserved archive.

The repository constitution identifies the active presentation, the archives, and the agreed V7.4 optional alternative-client policy. It leaves the research paper unchanged and explicitly avoids claiming that downstream Codo propagation is already complete.

## Review and next propagation

The deck is ready for presentation feedback. Subsequent Codo work should add `/privacy` and `/wire`, put provider/model-set selection and the existing-subscription option in `/wire`, incorporate protected-recipient rules, adapt the model-outage policy, and place conversation/run-context decisions in existing design steps rather than a universal `/sessions` command. Book changes should follow actual participant-facing impact.
