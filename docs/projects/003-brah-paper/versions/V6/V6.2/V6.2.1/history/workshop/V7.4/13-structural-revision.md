# V7.4 — Applying the second presentation feedback

Implemented on 4 November 2026 from [11-feedback.md](11-feedback.md), the approved [12-feedback-analysis.md](12-feedback-analysis.md), and the added request about development/runtime models and the trust ladder.

The active deck is [presentation/index.html](../../../presentation/index.html). It contains **142 content slides and 22 route maps**, all on the existing light background. The previous version is preserved in [the archive](../../../presentation-archive/v7.4-before-structural-revision/index.html). The opening travel conversation, working neural network, temperature controls, and later visual examples remain in place. Focused additions around the network introduce the newly requested dataset and evaluation concepts.

## What changed

| Feedback                                            | Applied change                                                                                                                                                                                                                                          | New content page(s)         |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| Name the training dataset                           | All twelve actual labeled images are shown; selecting one enlarges its image and label.                                                                                                                                                                 | 11                          |
| Separate learning from evaluation                   | Two images excluded from training run through the current network without changing its weights. The travel cases explicitly form an evaluation dataset with checking criteria.                                                                          | 16, 29                      |
| Bridge the small network to language models         | A numerical text example separates token IDs, input vectors, fixed weights, and output probabilities. Changing Iran to France changes the probabilities while the weights stay fixed.                                                                   | 17–22                       |
| Explain parameter scale                             | The teaching network has **108 weights + 6 biases = 114 parameters**. MiMo-V2.5 provides a sourced large-model example: 310B total and 15B active parameters. Input-vector dimensions and learned-parameter counts are separate.                        | 12, 19                      |
| Show mistakes before model selection                | Unsupported claims, missed instructions, editing commentary, and unnatural Persian precede the evaluation and selection section. Construction methods moved to the harness chapter.                                                                     | 25–29, 105–108              |
| Separate creator, intermediary, and host            | The route diagram distinguishes the model's creator from the inference host and the service through which the customer obtains access. A control switches between direct and intermediary routes.                                                       | 30–31                       |
| Give eight companies their own pages                | OpenAI, Anthropic, Google, Meta, Z.ai, Alibaba, Xiaomi, and DeepSeek each get a page of selected models and uses, with official sources. Company names replace the misleading generic logo-like icons.                                                  | 32–39                       |
| Explain building versus running                     | Development emphasizes capable design/debugging/review; repeated execution also emphasizes cost and latency, subject to sufficient quality.                                                                                                             | 42                          |
| Use the requested trust order before billing        | Four rungs: developed/trained ourselves → self-hosted open weights → API from friendly countries → API from adversarial countries as the last option. Task sensitivity and actual processing arrangements remain explicit.                              | 43                          |
| Teach billing mechanisms first                      | Subscription and pay-as-you-go precede the cost example and short product/plan comparisons. File-editing workflows are removed from the displayed pricing material.                                                                                     | 44–49                       |
| Include growing context and caching                 | One, two, or three rounds accumulate earlier input, previous output, and new messages. Ordinary input, cached input, output, and total cost are calculated separately.                                                                                  | 45                          |
| Distinguish OpenCode Go and Zen                     | Go is optional subscription access; Zen/Console illustrates usage billing, separately from the OpenCode client.                                                                                                                                         | 46, 49                      |
| Move context/search/RAG into the harness            | The agent loop now leads into history, fresh information, search, document passages, embeddings, similarity, and retrieved text.                                                                                                                        | 50–62                       |
| Make cosine similarity visible                      | Two sliders rotate the query vector in a projected 3D space. Coordinates, the angle arc, cosine scores, and document ranking change together using actual calculations. The following page inserts the selected passage's text into the answer context. | 60–62                       |
| Relocate security and implementation details        | The untrusted-model example precedes action policies; API formats sit beside credentials and restricted access; the receipt/internal-rule example sits with protected information.                                                                      | 77–100                      |
| Remove repeated explanations and repair transitions | The duplicate history explanation is merged. The repeated duplicate-booking test is demonstrated once; project acceptance cases cover other behaviors. Route maps, speaker notes, source links, and handoffs follow the new order.                      | 55–56, 107, 113; throughout |

## Review route

Page numbers here are the **visible content counter**, excluding route maps. Press `G` and enter the number in English or Persian digits. Hash fragments retain internal IDs, so `#slide-33` opens content page 45, rather than content page 33.

| Range   | Teaching sequence                                                                            |
| ------- | -------------------------------------------------------------------------------------------- |
| 1–7     | Travel request → model and harness                                                           |
| 8–24    | Dataset → network → learning/evaluation → numerical language input → parameters → generation |
| 25–28   | Common language-model mistakes                                                               |
| 29–43   | Evaluation → access roles → model options → charts → development/runtime choice → trust      |
| 44–49   | Subscription/usage billing → accumulating cost/cache → access products and plans             |
| 50–69   | Harness loop → context/search/RAG → operating the service                                    |
| 70–76   | Ready-made software, frameworks, and development/runtime access                              |
| 77–100  | Action policies, caller isolation, protected data, and restricted connections                |
| 101–104 | Model outage and resumption                                                                  |
| 105–115 | Staged construction, testing, and the Codo project                                           |
| 116–142 | Specialist/personal agents, wider applications, and work                                     |

The build/runtime **model choice** remains in chapter 2. The later development/runtime **software-access example** in chapter 3 explains why the live service does not inherit the builder's file and command access; it does not repeat the model catalog.

## Factual and computational boundaries

The model cards show selected representative choices, not a complete release catalog or an invented performance ranking. Their official links are available in the slide footer, speaker notes, and [sources page](../../../presentation/sources.html).

Pricing uses a dated monthly US-dollar snapshot, before tax. The concise Claude table retains the current **Ultra** name because Anthropic describes it as the renamed Max 20x plan; the current weekly allowance is not silently labeled 20×. See [Anthropic's explanation](https://support.claude.com/en/articles/17728952-what-is-the-ultra-plan). Google AI Pro and entry Ultra prices are linked to the [official Google One plan page](https://one.google.com/about/google-ai-plans/), alongside [Antigravity's quota rules](https://antigravity.google/docs/plans). Plan names, eligibility, and limits can change.

The numerical language example uses small hand-specified weights; it is not a Transformer implementation. The 3D passage vectors are teaching coordinates, not outputs of a live embedding service. The angle and ranking are calculated, while the final example answer is predefined. Two held-out images explain the procedure rather than establishing general handwriting accuracy.

The cost calculator uses hypothetical rates of $2/M ordinary input, $0.50/M cached input, and $8/M output, with no cache-write charge. Two rounds cost **$0.01580** without a cache hit or **$0.01280** under the illustrated cache assumption. Three rounds cost **$0.02360** or **$0.01655** respectively. Cached tokens remain part of the input; the control does not promise that a real provider will return a cache hit.

## Validation

- All three numerical/behavior suites pass: `verify_presentation_learning.cjs`, `verify_presentation_scenes.cjs`, and the added `verify_presentation_lessons.cjs`.
- Offline Chrome traversed all **164 rendered pages** at 1600×960, with no JavaScript errors, remote requests, dark pages, invalid rendered values, or detected content-boundary overflows.
- **117 interaction states** were checked, including 1366×768 layouts for the new scenes and selected later scenes. Checks cover actual held-out probabilities and unchanged weights; fixed-weight language computation; linked 3D coordinates, angles and ranking; accumulated/cache costs; the existing approval, caller, recipient and budget boundaries; and reset/navigation behavior.
- Both travel alternatives produced their three valid downloadable PDFs: **six downloads** in total. All four local fonts and all seven slide images loaded offline.
- The final ZIP contains **37 files**. Every extracted file was compared byte-for-byte with the source folder, and the extracted copy passed the same 117-state offline interaction check from a path containing spaces. The previous deck's 35 archived files also match the pre-revision SHA-256 snapshot.
- Slide-to-slide handoffs and chapter ownership were reviewed separately from the mechanical checks. New scene screenshots were inspected for text wrapping and diagram clarity. These checks establish implementation behavior, not audience approval.

The machine-readable results and selected previews are saved in [assets/structural-revision](assets/structural-revision/). The portable delivery is [presentation-v7.4.zip](presentation-v7.4.zip); extract it and open `presentation/index.html`.
