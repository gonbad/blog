# V7.4 — Rebuilding slide 18 through the ending

Date: 2026-11-04  
Delivery: [presentation](../../../presentation/index.html) · [portable ZIP](presentation-v7.4.zip) · [local guide](../../../presentation/README.md).

The first 17 content-slide definitions are preserved exactly. The requested parameter explanation was added to the network diagram. All **113 content slides from visible slide 18 through 130** were rewritten, including their examples, visual treatment, and transitions. There are still 130 content slides and 21 recurring maps.

## The parameter count

The implemented network contains **108 connection weights**, plus **6 trainable biases**, for **114 parameters**:

- Input → hidden: 25 × 4 = 100 weights.
- Hidden → output: 4 × 2 = 8 weights.
- Hidden and output biases: 4 + 2 = 6.

The diagram now displays both the arithmetic and a short explanation of a bias. This count comes from the actual arrays in [learning.js](../../../presentation/learning.js), and is checked by [verify_presentation_scenes.cjs](../../../scripts/verify_presentation_scenes.cjs).

## What changed in the rest

Each page now has a concrete example or artifact: a conversation, document, form, record, connected diagram, chart, or local demonstration. The 113 later pages comprise 105 composed visual scenes, four illustrated fiction examples, two supplied benchmark charts, and two executable duplicate-reservation experiments. Twenty later pages have interactive or manually stepped demonstrations.

Examples include:

| Visible page | Visual / demonstration                                                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 18           | Generate a continuation, add it to the text, then predict the next continuation.                                                                                                           |
| 22           | Add or remove relevant travel history and see why “change the return” becomes interpretable.                                                                                               |
| 27           | Select the relevant internal policy and place its hotel-cost rule beside the question.                                                                                                     |
| 38           | Add model calls and recalculate the cost of the whole task using explicitly hypothetical rates.                                                                                            |
| 56           | Follow a specific travel request through context, model decision, checked execution, result, and response.                                                                                 |
| 63           | Request a sixth step and observe the harness refuse it at the five-step limit.                                                                                                             |
| 73–75        | Operate direct, conversational, and independently approved actions. Change the purchase amount, attempt model-side execution, or reuse a consumed approval.                                |
| 80–81        | Change the requested account while the authenticated caller and returned record remain properly scoped.                                                                                    |
| 87           | Try the caller's handle, another user's handle, an approved booking recipient, and an unapproved advertising recipient. The stored handle owner and recipient checks determine the result. |
| 93           | Disconnect the model while the authoritative issued-booking record remains present.                                                                                                        |
| 108, 112     | Step through coordination across phone applications, then continue the same plan across the day.                                                                                           |
| 115–116      | Toggle connectivity and distinguish local inference from remote booking services.                                                                                                          |
| 118–124      | Step through text/voice/face/body, a responding diary, photographic scenes, and the changing textile chain.                                                                                |

The visual scenes use local HTML, CSS and SVG. Controls are in [story.js](../../../presentation/story.js); the audience copy and sequence remain in [deck-data.js](../../../presentation/deck-data.js).

## Logical continuity

The travel example now supplies the questions that motivate the technical sections: identify the return trip → retrieve current availability → consult the internal expense policy → choose and access a model → build and verify a small behavior → operate it through a harness → limit actions and data → handle interruption → build the workshop service.

The final movement grows from that service into a specialist/personal-assistant distinction, coordination across applications, local execution, richer conversational experiences, and changes to work and institutional approval. The textile analogy is introduced explicitly as a way to understand that change.

Every later page has a short blue transition at the bottom. It raises the question or situation the following page takes up; speaker notes also record the intended handoff. These transitions accompany rewritten content, rather than attempting to connect the old list with transitional phrases alone.

## Sources and verification

The access/pricing material was checked against official sources, including [OpenAI pricing](https://learn.chatgpt.com/docs/pricing), [OpenAI authentication](https://learn.chatgpt.com/docs/auth), [Claude pricing](https://claude.com/pricing), [Antigravity plans](https://antigravity.google/docs/plans), [Cursor model billing](https://cursor.com/docs/models-and-pricing), and [OpenCode providers](https://opencode.ai/docs/providers/). The API examples cite their respective tool-definition documentation. MCP, A2A, Hermes and Cyclon references are available in the presentation's sources page and relevant footers.

Observed verification:

- All 151 pages passed the light-canvas, missing-content, outer-boundary and internal visual-boundary checks. The last check includes collisions with the heading and lower explanation areas.
- Eighty-five interaction states passed in Chrome, including the three generation stages, six loop stages, changed-amount/consumed approval cases, owner/recipient rejection, bounded execution, context changes, and local/online switching. Expanded states and representative laptop views were inspected.
- The original learning and temperature checks still pass. Both travel branches still deliver their three valid PDFs after approval.
- Overview search now accepts the **visible slide number**, including Persian digits: press `G`, enter `۱۸`, and select the result to start the revised section.
- The rebuilt 35-file ZIP was extracted into a path containing spaces. Its files matched the source bytes. The extracted deck passed the same 85-state interaction run offline, loaded all four font faces and seven images, and produced all six PDFs. No JavaScript page errors or HTTP(S) requests occurred.
- Syntax, local asset paths, the independent numerical/state checks, and `git diff --check` passed.

Evidence: [full-rewrite-checks.json](assets/full-rewrite-checks.json). Previews: [context](assets/context-preview.png), [approval](assets/approval-preview.png), [protected data](assets/protected-data-preview.png), [application coordination](assets/coordination-preview.png).

The network and cost calculation compute their displayed values. The permission/data exercises run small local checks. Retrieval, generation, phone applications and external-service routes illustrate predefined teaching scenarios; they do not call live models or services. Technical verification establishes those behaviors, not that every explanation will be clear to a new audience.

The preceding revision is preserved in [the archive](../../../presentation-archive/v7.4-before-full-rewrite/index.html). The original comments and earlier reports remain available.
