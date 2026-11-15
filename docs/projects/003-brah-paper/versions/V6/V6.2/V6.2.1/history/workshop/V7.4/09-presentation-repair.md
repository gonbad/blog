# V7.4 — Presentation repair

Date: 2026-11-04  
Status: Repairs implemented; local behavior and portable ZIP checked.  
Deliverables: [presentation](../../../presentation/index.html), [portable ZIP](presentation-v7.4.zip), [controls and demo guide](../../../presentation/README.md).

The opening now follows a complete trip before explaining the components behind it. The model chapter starts with a recognizable task and its actual input and output, then introduces the network, learning, and text generation. The light visual style is used throughout.

## Changes against your feedback

| Feedback                                                                | Repair                                                                                                                                                                                                                                   |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Light/dark transitions hurt the eyes.                                   | All 130 content pages and 21 route maps use the same light canvas. Photographs sit inside that composition.                                                                                                                              |
| “Answering / doing” was abstract.                                       | The audience sees an actual advice-only reply to the travel request, followed by an agent carrying the same task through.                                                                                                                |
| The phone was too small; the conversation omitted the actual decisions. | The phone is now 650 design pixels tall. Seven stages show the questions, one traveler, an eight-million-toman budget, train preference, agreed times, two priced options, selection, explicit approval, and delivery.                   |
| There were no usable booking results.                                   | Each option produces three real local PDFs: outward ticket, return ticket, and hotel voucher. The selected option determines their contents. Download links appear after approval and the simulated booking step.                        |
| “Service” was unclear.                                                  | The explanation names Ali Baba as an example travel service and shows its relationship to the request, harness, and returned options.                                                                                                    |
| The scheduled-agent discussion did not belong here.                     | Removed the opening detour and its two later repeats, including related speaker guidance.                                                                                                                                                |
| The model chapter lacked prerequisites.                                 | Added earlier AI examples, a zero-versus-one recognition task, an explicitly labeled 25-cell input and desired output, and a network diagram before training.                                                                            |
| The network control did not demonstrate learning.                       | Replaced it with a small working neural network. Training updates its actual weights; connection appearance, prediction, probabilities, and measured error come from that network. Manual weight adjustment has its own subsequent page. |
| Slide 8 rendered `undefined`.                                           | Renamed the conflicting route-overview and search functions. The route overview now renders its four intended sections.                                                                                                                  |
| Candidate probabilities and temperature were missing.                   | Restored candidate-word probabilities, weighted random selection, a working temperature control, and the connection to the next generation step.                                                                                         |

The travel options use explicit amounts and times: option A totals 6.2 million toman and returns to Tehran at 22:00 Friday; option B totals 7.4 million and returns at 23:00. The hotels, prices, reservations, and PDFs are educational examples. The presentation does not contact a live booking service.

## The teaching sequence

The opening is now: request → advice-only response → complete agent conversation → where the prices came from → who executes the search → model and harness → the two questions the presentation will answer.

The model sequence is now: familiar AI applications → recognize zero or one → identify input and output → connect them through a network → observe learning → adjust one weight manually → distinguish training from use → introduce tokens → compare possible continuations → change temperature → continue generation.

Later explanations were also revised around concrete examples, including conversation history, business state, tool execution, retries, permission boundaries, and the workshop build process. The two test-demo pages now run a local duplicate-reservation experiment: sending the same request twice creates one booking with the guard enabled and two bookings with it disabled. Their pass/fail output comes from that execution.

## What was verified

Chrome ran the presentation through `file://` with its context offline. Verification covered both rendered content and the effects of the controls.

- All 151 pages were checked for the light background, missing-content markers such as `undefined`/`NaN`, and measured text/diagram overflow. No failures were found in those checks. Representative screenshots were inspected, including the revised opening, network, probabilities, route maps, and framed photographs.
- Twenty actual training steps reduced mean training loss from **0.920166 to 0.152988**. The displayed probabilities matched the network's calculated probabilities exactly. The diagram changed with training; moving the selected weight changed its visible connection and the prediction without adding training steps.
- The independent [numerical checks](../../../scripts/verify_presentation_learning.cjs) passed: finite-difference gradient checks, weight updates, learning both taught classes, manual-weight effects, temperature normalization, and sampling boundaries.
- Normal-motion training was observed between its initial and final states and completed all 20 steps. The laptop view was checked at 1366 × 768; the full page scan used 1600 × 960.
- Both travel branches were exercised, including their selection and approval gates. All six browser downloads were valid PDFs. A sample PDF was rendered and inspected.
- The remaining 15 interactive sequences were exercised through 69 states, with no regression failures in their checked behavior. Both duplicate-reservation demos produced the expected pass and intentional failure.
- The rebuilt ZIP contains 33 files. Every extracted file matched the source bytes. Its extracted copy ran offline from a folder with spaces in its name: all four font faces and seven images loaded; overview, notes, learning, temperature, and travel downloads worked. Downloaded PDFs matched the packaged files exactly. No JavaScript page errors or HTTP(S) requests occurred in that run.

The detailed results are saved in [presentation-repair-checks.json](assets/presentation-repair-checks.json). Previews: [opening example](assets/presentation-preview.png), [learning after training](assets/learning-preview.png).

The neural network is a deliberately small, local 25-input / 4-hidden-unit / 2-output example trained on twelve labeled patterns. Its training results describe those examples, not general handwriting-recognition accuracy. Candidate-word probabilities are illustrative; temperature transforms them mathematically. These checks establish the demonstrations' behavior; they do not establish beginner comprehension.

## Version record

The repaired presentation has **130 content pages + 21 recurring route maps**. Existing internal IDs remain usable; the visible content counter is continuous. Three scheduled-topic pages were removed and six explanatory pages were added.

The first V7.4 draft is preserved in [presentation-archive/v7.4-first-draft](../../../presentation-archive/v7.4-first-draft/index.html). The original comments, outline, feedback, and diagnosis remain available. This report supersedes the first build report's readiness assessment. The separately documented Codo/book update remains in [08-public-agent-codo.md](08-public-agent-codo.md).
