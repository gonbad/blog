# V7.4 — Five-part presentation revision

Applied from [14-feedback.md](14-feedback.md) and the commented [15-feedback-analysis.md](15-feedback-analysis.md), including all three added comments. The active [presentation](../../../presentation/index.html) now has **167 content slides, 25 route maps, and five parts**. The preceding 37-file deck is preserved in [the archive](../../../presentation-archive/v7.4-before-five-part-revision/index.html).

## The comments

| Comment                                                                             | Applied result                                                                                                                                                                                                                                                          |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Introduce Tavily, Parallel, Exa                                                     | Page **58** introduces all three with selectable examples and official links, after the search demonstration and before the general tool interface. It explains their place in the harness.                                                                             |
| Name the new part «ایجنت تولیدکننده محصول»; introduce the working environments here | Part **4** uses that exact title. Page **118** introduces Claude Code, Cursor, Codex, OpenCode, and Antigravity as working environments. Their role in reading, editing, executing, and checking a project is separate from the access-plan/pricing material in part 2. |
| More than 150 slides is acceptable                                                  | The previous ceiling is superseded. The result has **167** content slides; explanations are no longer compressed to preserve the old count.                                                                                                                             |

The source analysis and its comments are preserved unchanged.

## What changed

| Feedback                                           | Result                                                                                                                                                                                                                                                                                                                         |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Evaluation should lead into benchmarks             | Pages **29–33** now run through the travel dataset, scoring, public benchmark examples, and the owner's actual intelligence/cost charts before moving to access and model families.                                                                                                                                            |
| Correct the model catalog                          | Carbon with limited availability; Wonder Full with its access distinction; Spark Contributor with data-use conditions and rates; GLM-5.3, Flash, and 5.2; Qwen3.8-27B with an interactive weight-memory calculation; MiMo-V2.6-Pro/Flash; DeepSeek versions and peak/off-peak rates. Official links are attached to the pages. |
| Explain tools before detailed context              | The harness now starts with the live-information problem and cutoff, search, search-service examples, answer/tool dispatch, a tool-input form, returned results, other tools, RAG, and history/reservation tools.                                                                                                              |
| Assemble context before relying on the term        | Page **68** lets the presenter add/remove instructions, recent messages, tool definitions, and tool results while the current request remains in the input packet.                                                                                                                                                             |
| Show both sufficient context and missing history   | Page **69** uses recent context; **70** distinguishes history/current context/authoritative records; **71** demonstrates lookup and a multiple-reservation result that requires clarification.                                                                                                                                 |
| Make the agent loop unmistakable                   | Page **72** has **12 stages**, returning to the same model for train search, hotel search, and reservation. A visible ledger records completed steps. Keyboard advance pauses for the independent approval button; the grant is tied to the trip and amount and consumed on the sample booking.                                |
| Improve the harness's language and visuals         | Reworked data-flow diagrams and staged cases explain sessions, retries, traces, authorization, account boundaries, private references, credentials, and resumption. Existing executable approval, identity, recipient, budget, outage, and duplicate-booking demonstrations remain.                                            |
| Separate producing a product from running an agent | Part **4** covers websites, book translation, research, and agent products. It distinguishes producer/method/product; demonstrates generation, review, correction, and integration; and compares general agents, configured working environments, and specialized production harnesses.                                        |
| Restore build/runtime and compilation material     | Pages **122–125** distinguish the builder from the delivered service and show where a C++ example and a CPython example encounter their errors. The analogy concerns where checks happen.                                                                                                                                      |
| Explain Codo in the broader method                 | Page **126** switches between website and agent workflows. The following project sequence turns an expected conversation into tools, data, tests, connections, and a usable service.                                                                                                                                           |
| Restore every actor in personal-agent diagrams     | Pages **136–138** distinguish Sara's assistant from the agency's agent and show the complete traveler → personal assistant → agency agent → existing system path, then coordination across services.                                                                                                                           |
| Give MCP its own explanation                       | Page **139** compares custom pairs with shared-protocol client/server implementations. Adding a service changes both the drawing and count. The count concerns implementation work, not network requests.                                                                                                                      |
| State the OS vision first                          | Page **141** explicitly introduces the operating-system change and switches between several app interactions and one assistant conversation. The mechanism and Cyclon follow. A sourced Gemini Connected Apps example also shows another current effort toward cross-app assistance.                                           |
| Merge the repeated local/offline explanation       | The former two pages become the single interactive page **149**. Local processing and remote booking remain distinguishable.                                                                                                                                                                                                   |
| State why the fictional examples are here          | Page **150** introduces the “magic to capabilities” premise before the Black Mirror and Harry Potter examples.                                                                                                                                                                                                                 |
| Restore the jobs argument                          | Pages **157–166** now follow the requested order: future-work question → textiles and factories → pace of change → expert work → human-stamp barrier → falling stamp prices → political change → later-displaced relational/emotional work → coach. The final invitation is page **167**.                                      |

## Review route

Press `G` and type the **visible content number**. Hash fragments retain internal IDs and are not the same numbering system.

| Pages   | Part                   |
| ------- | ---------------------- |
| 1–7     | از خواستن تا انجام‌شدن |
| 8–54    | مدل                    |
| 55–108  | هارنس                  |
| 109–135 | ایجنت تولیدکننده محصول |
| 136–167 | زندگی با ایجنت‌ها      |

Useful review points: **58** search services, **68** context, **71** ambiguous history, **72** the repeated loop, **112** checking different products, **118** working environments, **124** compilation/runtime, **139** MCP, **141** the OS vision, and **157** the restored closing sequence. Use `Space` or the next-step button to view complete staged demonstrations. On page 72, use Sara's independent approval button when prompted.

## Facts and limits

- DeepSeek's checked official API list names **V4.1 Flash** and **V4 Pro**. The deck uses those verified names. The [official pricing page](https://api-docs.deepseek.com/quick_start/pricing/) also establishes the UTC peak periods and exceptions. It does not establish the transcribed V4.1 Pro name.
- Meta's cheaper Contributor mode trades permission to use content for training future models. It also lacks Spark 1.3's `max` setting. The [official model](https://dev.meta.ai/docs/models) and [pricing](https://dev.meta.ai/docs/pricing-rate-limits) pages support the distinctions.
- The dated MiMo-V2.5 parameter example remains separately sourced; its parameter counts were not reassigned to the V2.6 catalog entries.
- Search results, booking replies, interface mockups, and example texts are local teaching material. No live model, search, booking, or payment service is called. The benchmark-scoring toy does not report a real model's result. Conversation-cost rates are hypothetical; the labeled provider-price examples use dated official rates.
- The occupation, professional-stamp, and political sequence is the presenter's future scenario. The diagrams are not employment statistics, current legal claims, or actual professional-service prices.

## Verification

All four numerical and behavioral suites pass: learning, existing execution boundaries, representation/retrieval/cost, and the new journeys suite. The new suite checks context selection, caller-scoped retrieval and ambiguity, weight arithmetic, peak-time boundaries, MCP counts, approval binding/consumption, chapter ownership, and the requested narrative order.

Offline Chrome checks cover **all 192 rendered pages**. The new/rebuilt scenes were checked in **437 states** across desktop (1600×960) and laptop (1366×768) layouts. The retained demonstrations passed **108 additional interaction states**, including all six downloadable PDFs, trained-network behavior, cosine calculations, caching, hard approval, account isolation, protected-data recipients, budgets, and outage behavior. No JavaScript errors, remote requests, or detected content overflows remain in these checks.

The full sequences and selected screenshots were also reviewed for actor paths, ordering, text wrapping, and diagram clarity. Mechanical checks support this review; they do not establish audience approval.

The [portable ZIP](presentation-v7.4.zip) contains **39 files**, all compared byte-for-byte with the final presentation folder. The extracted copy, opened offline from a path containing spaces, passed both the 437-state and 108-state checks, including the six PDF downloads. Evidence, the current slide index, and selected previews are saved under [assets/five-part-revision](assets/five-part-revision/).
