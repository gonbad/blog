# V7.4 — Analysis of the third feedback round

Date: 4 November 2026. Source: [14-feedback.md](14-feedback.md), compared with the [current presentation](../../../presentation/index.html), its [slide index](assets/structural-revision/slide-index.json), and the [presentation preceding V7.4](../../../presentation-archive/pre-v7.4/index.html).

**The intended feedback is understandable despite the transcription errors. No clarification is needed to establish the next revision's structure or argument.** Some model claims need factual qualification; those are recorded below rather than silently accepting or guessing them. This document analyzes the next revision. It does not modify the presentation.

All current slide numbers below mean the **visible content counter**, excluding route maps. New subsection numbers are proposed; final slide numbers should follow the finished sequence.

## 1. What the feedback changes

The next version needs **five major parts**. This explicitly replaces the earlier four-part constraint:

| Part | Proposed title                | Question it answers                                                                                           |
| ---- | ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 1    | از خواستن تا انجام‌شدن        | What changes when an assistant can complete a task?                                                           |
| 2    | مدل                           | How does the model work, how do we compare choices, and how do we obtain access?                              |
| 3    | هارنس                         | How does the program supply information, execute tools, repeat the model/tool cycle, and control the service? |
| 4    | تولید محصول با کمک هوش مصنوعی | How do we use an agent to produce a website, translation, research deliverable, or another agent?             |
| 5    | زندگی با ایجنت‌ها             | How might personal assistants, operating systems, experiences, and work change?                               |

Part 4's proposed title is intentionally broad enough to include non-software products. The feedback leaves its exact title open; that does not prevent adopting this structure.

The first two parts are now broadly approved. They need the specific benchmark reordering and catalog corrections requested here. Parts 3–5 need a substantive teaching revision: better explanations, visible mechanisms, clear openings, and the intended causal argument.

### Reading the weaker transcription

| Transcribed expression          | Interpretation and basis                                                                                                                                                           |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| «در حدت دیتا ست»، «ارزیاب»      | The dataset/evaluation discussion on current page 29, followed by public benchmarks and their results. This is not a request to introduce a separate agent acting as an evaluator. |
| «کربن»                          | Gemini 4 Carbon; confirmed in Google's announcement.                                                                                                                               |
| «میوز واندر فول»                | Muse Wonder Full; a named variant in Meta's documentation.                                                                                                                         |
| «یک ممیز اسپارک یک ممیز سه»     | Muse Spark 1.3 and its Contributor mode.                                                                                                                                           |
| «جی ال ام 5 3»، «شیاء عومی 2 6» | GLM-5.3 / GLM-5.3-Flash and Xiaomi MiMo-V2.6-Pro / Flash.                                                                                                                          |
| «استعمام…»، «سیمایز…»           | Corrupted subsection numbers. The intended ordering is tools → context → a clearly taught loop → operating the agent.                                                              |
| «انسان محرمی»                   | A human professional applying the required stamp/sign-off. The surrounding sentence and archived slides establish this meaning.                                                    |
| «یک نفر رأی می‌آورد»            | The political step in the forecast: a candidate wins support to remove the professional sign-off barrier. The archive explicitly contains this step.                               |

The Alibaba comment does not specify a release number. A verified 27B open-weight Qwen model can satisfy that teaching purpose without pretending the transcription named a particular version. DeepSeek's Pro version is a source discrepancy, discussed in section 3.

## 2. Why the previous repair was insufficient

The principal problem is **the argument the audience can follow**. Having the right nouns, a diagram, a transition sentence, and working controls does not establish that argument.

Three concrete examples explain the gap:

1. **Evaluation is followed by a change of subject.** Current page 29 introduces an evaluation dataset, but page 30 immediately asks who made and hosts the model. The public results that should complete the evaluation explanation are delayed until pages 40–41.
2. **The loop exists in the implementation but is not convincingly taught.** Page 54, internal ID `51`, has an `agent-loop` scene. Its six stages progress from one tool request through one tool result to a model response. They do not visibly return to another model decision and another tool execution. Telling the presenter that the slide exists would not resolve the feedback.
3. **The ending preserves examples while losing their argumentative role.** The coach appears before the human-stamp discussion; the political step is missing. The audience cannot infer the intended answer to “Which work is displaced later?” from that order.

The mechanical checks in [13-structural-revision.md](13-structural-revision.md) remain useful evidence about layout and interaction behavior. They did not establish that these explanations were clear. The next review must evaluate complete sequences and ask what a first-time viewer could explain after seeing them.

## 3. Model chapter: complete the evaluation story and correct the catalog

### Evaluation → benchmarks → results → model options

Move current pages **40 and 41 immediately after the evaluation material on page 29**. Merely putting them somewhere before page 32 would preserve the original interruption.

The proposed sequence is:

`our travel evaluation dataset → what a public benchmark measures → selected benchmark examples → supplied intelligence chart → supplied cost chart → access/hosting choices → company/model cards → build/runtime model choice → trust ladder → billing`

Add a compact explanation before displaying the charts:

| Example                                | What the audience should understand                                                                                                                                                                                  |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SWE-bench Verified                     | A model/agent attempts real repository issues; the reported result concerns solved tasks under a stated setup. [Official leaderboard](https://www.swebench.com/)                                                     |
| Terminal-Bench                         | The agent completes tasks through a terminal; model, agent, success rate, cost, and tokens can all matter. [Official benchmark](https://www.tbench.ai/)                                                              |
| Artificial Analysis Intelligence Index | A composite of several evaluations. It summarizes selected capabilities and is not a direct score for our Persian travel service. [Methodology](https://artificialanalysis.ai/methodology/intelligence-benchmarking) |

These are examples with distinct purposes, not a new catalog to memorize. The visual should show a task, its checking rule, and how results form a chart. Explain the benchmark provider, benchmark, and leaderboard as different things.

Use the owner's supplied chart images with their capture date and actual index version. A new methodology page must not be used to relabel an older screenshot. Do not compare numbers across different index versions as if they shared a scale. The original travel dataset remains the final check for the actual use case.

### Catalog verification

Checked against primary sources on 4 November 2026:

| Requested correction               | Finding and revision decision                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Google: add Carbon                 | Confirmed: **Gemini 4 Carbon**. Google's 28 October announcement describes its strongest model and a phased rollout beginning with selected cyber defenders and trusted partners. Add it with a visible limited-access label, rather than treating it as generally selectable alongside Argon. [Announcement](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/)                             |
| Meta: add Wonder Full              | Confirmed. **Muse Wonder Full** is a higher-capability variant available through specified Muse Code subscription plans, not the Model API. Setting ordinary Wonder's reasoning effort to `max` does not select Full. [Model documentation](https://dev.meta.ai/docs/models)                                                                                                                                                                    |
| Meta: Spark data-for-discount mode | Confirmed: **Muse Spark 1.3 Contributor**. Explain the exchange plainly: permission to use submitted content and responses for future model training buys cheaper usage. Meta describes the same models, but Contributor does not support Spark 1.3's `max` reasoning setting; avoid promising identical behavior under every configuration. [Models](https://dev.meta.ai/docs/models), [pricing](https://dev.meta.ai/docs/pricing-rate-limits) |
| Z.ai: newer models                 | Confirmed: show **GLM-5.3**, **GLM-5.3-Flash**, and the preceding **GLM-5.2**. Explain the flagship versus efficient multimodal choice rather than retaining GLM-5 / 4.7 as the main current selection. [5.3](https://docs.z.ai/guides/llm/glm-5.3), [5.3-Flash](https://docs.z.ai/guides/vlm/glm-5.3-flash), [5.2](https://docs.z.ai/guides/llm/glm-5.2)                                                                                       |
| Alibaba: a 27B local model         | A suitable verified example is **Qwen3.8-27B**, with published weights and 27B parameters. The feedback's purpose is to make local execution concrete. Say “on a suitably equipped computer, including some laptops,” with memory/quantization conditions; do not promise comfortable execution on any weak laptop. [Official Qwen model card](https://huggingface.co/Qwen/Qwen3.8-27B)                                                         |
| Xiaomi: update to 2.6              | Confirmed: **MiMo-V2.6-Pro** and **MiMo-V2.6-Flash**. Xiaomi positions Pro as its most capable option and Flash around capability, efficiency, and cost. Use these current names instead of the V2 generation in the card. [Series announcement](https://mimo.xiaomi.com/mimo-v2-6/article)                                                                                                                                                     |
| DeepSeek: 4.1 Pro and 4.1 Flash    | **V4.1 Flash is confirmed. V4.1 Pro is not established by the checked official API catalog.** The pricing page lists **DeepSeek-V4.1-Flash-1017** and **DeepSeek-V4-Pro-0813**. Preserve this distinction in the planned card; do not infer a Pro release number from Flash's number. This source disagreement does not obscure the requested teaching change. [Official catalog/pricing](https://api-docs.deepseek.com/quick_start/pricing/)   |
| DeepSeek: peak pricing             | Confirmed. The official schedule lists peak periods **01:00–04:00 and 06:00–10:00 UTC, Monday–Friday, excluding Chinese public holidays**. Other times are off-peak; off-peak token rates are half the peak rates. State the timezone and exceptions instead of the loose phrase “some busy hours in China.” [Pricing rules](https://api-docs.deepseek.com/quick_start/pricing/)                                                                |

Two short explanatory additions would make those cards useful:

- **Contributor mode:** a small switch can display the data-use condition alongside the price change. Current Spark ordinary-input/output rates are $1.25/$4.25 per million tokens in Standard mode and $0.10/$0.20 in Contributor mode. This is a concrete example of a cost decision involving data use, not a free quality upgrade. Keep the main subscription comparison compact. [Meta pricing](https://dev.meta.ai/docs/pricing-rate-limits)
- **Local 27B model:** show model weights moving onto a laptop and a memory budget. As an illustrative calculation, 27B weights at four bits require about **13.5 GB for weight bits alone**, before other storage and runtime memory. Label this as arithmetic, not a measured minimum-RAM recommendation or a speed benchmark.

Keep the eight-company format. Add meaningful availability and access distinctions within it. The build/runtime **model choice and four-level trust ladder remain in part 2**, as previously requested; the new product chapter does not revoke that placement.

The separately sourced MiMo-V2.5 parameter-count example can remain a dated illustration of scale. Updating the company card to V2.6 must not silently transfer V2.5's published parameter counts to a different model.

## 4. Rebuild the harness chapter around prerequisites

The audience must first understand what the program does, then what tools are, then what information reaches the model, then why these interactions repeat. The current page-level repairs leave that dependency chain unclear.

### Proposed teaching sequence

| Proposed subsection                        | Teaching job                                                                                                                                 | Material to reuse or move                                                                |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 3.1 — برنامهٔ اطراف مدل چه می‌کند؟         | Reopen the familiar travel conversation and identify the program between user, model, and travel system. Name the harness.                   | Current page 50, simplified; introduce other terms through the following demonstrations. |
| 3.2 — ابزار؛ از جستجو تا انجام کار         | Motivate fresh information, demonstrate search, generalize tool calling, introduce knowledge-base retrieval, and preview other tools.        | Current pages 51–53 and 57–62, reordered; preserve the working vector/cosine scenes.     |
| 3.3 — مدل در هر نوبت چه اطلاعاتی می‌گیرد؟  | Assemble and name context; distinguish supplied messages from stored history and business records; retrieve missing information when needed. | Current pages 55–56 plus a new context-assembly scene and history/booking lookup.        |
| 3.4 — حلقهٔ ایجنت را اجرا کنیم             | Follow the same task through several model/tool cycles, then stop with a result.                                                             | Rebuild current page 54 as a prominent multi-cycle demonstration.                        |
| 3.5 — ادارهٔ یک ایجنت                      | Now explain sessions, state, ambiguous outcomes, repeat requests, budgets, and execution traces.                                             | Current pages 63–69; rewrite the prose around visible cases.                             |
| 3.6–3.10 — اختیار، هویت، داده، اتصال، قطعی | Teach the existing execution and data boundaries through concrete failures and controls.                                                     | Current pages 77–104, with the visual and wording changes described below.               |

Current subsections **3.4, 3.10, and 3.11 move into the new product part**. The harness chapter should no longer pause for choosing a development platform or planning a Codo project.

### Tools: teach the reason before the interface

Use this progression:

1. Ask for a current price or available departure. The model's learned parameters are not a live availability database.
2. Explain knowledge cutoff in one concrete sentence. Avoid claiming that the model can know nothing after that date. It can use supplied information and make inferences; today's date can also be included by the application. The missing capability is reliable access to the live fact we need.
3. Offer a web-search tool. Show the model's tool request, the harness recognizing it, the actual program-side operation, and the returned result. Contrast this with a final answer to the user. **COMMENT**: introduce Tavily, Parallel, Exa, etc
4. Generalize: the same mechanism can invoke other defined functions. Now the tool name, description, and inputs have a purpose the viewer understands.
5. Search the company's documents. Explain RAG as retrieving relevant material and using it to generate a grounded response. A knowledge-base search can be exposed as a tool; RAG as a whole is a retrieval-plus-generation pattern, not necessarily one tool call.
6. Show other examples: lookup of prior reservations, search of permitted conversation history, and checking availability in a booking system. Distinguish reading information from actions such as purchasing.

A small, initially unnamed **input packet** can appear during the first tool demonstration. The full definition and assembly of “context” follow in 3.3. This resolves the feedback's two requirements: tools precede the detailed context lesson, and the audience still sees how the model learns which tools are available.

### Context: assemble it before using the term as an explanation

Show the harness placing visible items into the packet sent to the model:

`system instructions + relevant user/assistant messages + current request + tool definitions + relevant tool results and supplied facts`

Name that packet **زمینهٔ این نوبت**. Explain that this is a simplified teaching view of the application's supplied context; interfaces can package the components differently.

Then use two versions of the same request:

- **Recent context is sufficient:** the preceding messages identify reservation 124; “change the return” is understandable without a history search.
- **The reference is missing:** the relevant messages are outside the selected context. The model can request an allowed history or reservation lookup; the harness returns the relevant result and calls the model again. If several trips still match, ask the user which one.

Conversation history, the current input packet, and authoritative reservation records must remain visibly different. Do not imply that all history must always be resent, that history must always be accessed through a tool, or that the model secretly remembers every earlier chat.

### The loop must visibly loop

Keep a stable diagram with the **same model node and the same harness node** throughout. Animate data passing between them. Return arrows and a growing turn counter should show repeated work; a numbered list of stages is insufficient.

For the established travel example:

`request → prepared context → model requests train search → harness executes → result returns to model → model requests hotel search → harness executes → result returns to model → reservation proposal → independent approval → authorized booking tool → result returns to model → final response and documents`

This gives at least two visible returns to the model before completion. The approval appears as a program-controlled event, not a sentence the model can grant itself. Its detailed explanation belongs in the later action-policy section.

Provide clear next-step, replay, and restart controls, with a visible instruction to use them. Inspect the complete playback during review. The first frame alone must also communicate the existence of the loop. Keep it before “ادارهٔ یک ایجنت,” where persistence, retries, and budgets then have an understandable object to manage.

### Improve the rest of the harness through observable changes

| Concept                    | What the audience should see happen                                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| History and context        | Selecting a stored trip adds its relevant information to the outgoing packet.                                          |
| Tool calling               | A model request moves to a program-side function; its result returns to the same model.                                |
| Sessions versus records    | Closing the chat clears the chat view while the issued ticket remains in the reservation store.                        |
| Uncertain result and retry | Lose the booking response; inspect the request ID; retry without creating another booking.                             |
| Budget                     | A counter advances, reaches the program's limit, and stops another tool call.                                          |
| Purchase approval          | Changing the amount or reusing approval visibly prevents execution.                                                    |
| Caller isolation           | Changing a name in the text leaves the authenticated account unchanged.                                                |
| Protected data             | A private value stays out of the model packet; changing recipient or owner blocks its release.                         |
| Outage                     | Disconnect the model, retrieve an existing ticket through the available service path, and resume without buying again. |

Several of these behaviors already exist. Preserve their working logic while improving staging and language. The feedback calls for a substantial rewrite of the teaching, not for discarding implemented boundaries or replacing them with decorative animations.

## 5. A new part: producing a product with AI
**COMMENT**: name it ایجنت تولیدکننده محصول. you can name claude code/cursor/codex/opencode/antigravity/etc here. do not mixed it with earlier subscriptions like google AI pro, etc.

This part needs its own premise: **a useful product is usually too large to specify, generate, and verify as one undifferentiated output.** The product may be a website, translated book, research report, or another agent.

### Separate three things throughout

| Thing                    | Meaning                                                                            | Example                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| The agent doing the work | The model, harness, tools, and working environment used to produce the deliverable | A coding assistant or a translation agent                                  |
| The production method    | How the work is divided, checked, corrected, and integrated                        | A glossary and one checked chapter before translating the whole book       |
| The product              | The resulting deliverable                                                          | A translated book, deployed website, research report, or live travel agent |

A producing agent can build another agent. That does not make the builder and the resulting service the same running program. A website or translated book also need not keep an LLM running merely because AI helped produce it.

### Teach one method across different outputs

`define the result and checking criteria → break it into meaningful stages → produce one reviewable part → inspect it against its criteria → correct it → integrate → check the complete product`

Use actual intermediate artifacts, not a staircase with abstract labels:

| Product              | Early artifact                                                             | A meaningful check before expansion                                 |
| -------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Website              | One complete page or user journey                                          | Read and use the rendered page; verify the intended action.         |
| Book translation     | Glossary, style sample, then one chapter                                   | Compare meaning with the original and check consistent terminology. |
| Research deliverable | Question, sources, argument structure, then a section                      | Trace claims to sources and check calculations or evidence.         |
| Agent                | Expected conversation, tool/data definitions, then one end-to-end behavior | Execute the behavior and its relevant authorization/data checks.    |

Review does not mean asking for approval after every trivial step. It means inspecting meaningful outputs before errors propagate. Software tests are one checking method; they cannot stand in for reading a translation or assessing a research argument.

### Expand “ready-made or custom” into understandable choices

The current seven-slide subsection is narrow because almost every choice returns immediately to the travel service. The new part should compare **how work gets produced**, using the broader examples above:

1. Use a general-purpose agent with appropriate tools and instructions.
2. Configure an existing specialized environment, such as a coding assistant, with a production method.
3. Build a specialized harness for a repeated product workflow, such as book translation with a persistent glossary, chapter state, and review tools.

Do not present Hermes as universally closed or incapable of adaptation merely because an archived slide says so. Reuse the old comparison's teaching purpose, while assessing concrete capabilities and constraints. Do not present a coding assistant as limited to writing code when it can operate tools and files for other work.

Explain **Codo as instructions and project workflow** used with the producing agent, rather than as a newly trained model or a guarantee that the method will be followed. Distinguish the website-building and public-agent-building workflows through the products and checks they organize. Then demonstrate the actual workshop project using Codo.

### Restore build time, runtime, and the compilation analogy

The archive contains useful material under “زمانِ توسعه در برابر زمانِ اجرا” and “قیاسِ زبان‌های برنامه‌نویسی.” Restore their explanatory role here:

- At build time, the producing assistant reads and changes project files, runs checks, and prepares a release.
- At runtime, the delivered travel service handles its users with its defined tools and enforced access rules.
- A compiled/interpreted-language illustration can show that different checks happen before execution or during execution. The point is **where the check happens**, not that a compiled language eliminates runtime errors or guarantees security.

Avoid reproducing the archive's overly binary language comparison. For example, CPython itself compiles source into bytecode before interpreting it. A simple source → checking/build step → running program animation is enough to teach the distinction. [Python's bytecode definition](https://docs.python.org/3/glossary.html#term-bytecode)

This expands the earlier model-choice discussion into a concrete production architecture. It should not repeat the company catalog, cost table, or trust ladder.

Move current pages **70–76 and 105–115** into this new part, rewriting and expanding them around the broader method. Preserve a worked agent project near the end, after the audience understands the general approach.

## 6. Rebuild the final part around its opening claims

The final part becomes part **5**. Improve its Persian by naming actual actors and actions. Prefer **«ایجنتِ آژانس مسافرتی»** or **«ایجنتِ فروش و پیگیریِ بلیت»** to an unexplained “متخصص شرکت سفر.”

### 5.1 — My assistant and the agency's agent

On current pages 117–118, show the complete path explicitly:

`مسافر → دستیار شخصیِ مسافر → ایجنتِ آژانس مسافرتی → سامانهٔ جستجو و رزرو`

The reply travels back through the same actors. For a coordinated trip, the personal assistant contacts the airline/train, hotel, and transport agents while retaining the traveler's overall objective. A final “integrated plan” is an output, not a replacement for showing who communicated with whom.

Current page 118 mentions a personal assistant, but its three-stage path compresses the actors and does not show the full chain. The correction should address that ambiguity, not claim the words were completely absent.

### Give MCP its own explanatory slide

The current three-protocol table on page 119 does not explain why MCP is useful. Add a separate before/after diagram:

- Before: several assistants each require custom integrations with several services.
- After: the applications and services support a common MCP interface; service-specific APIs are wrapped behind their servers.

For example, three clients and four services have twelve potential custom pairs; a simplified shared-protocol diagram has three client implementations and four server implementations. Label the count as **integration implementations**, not as a reduction in logical conversations or network calls.

Explain that a common discovery/calling contract reduces repeated integration work. It does not remove each service's business rules, account connection, permissions, or implementation work. Use the [official MCP introduction](https://modelcontextprotocol.io/docs/getting-started/intro) as the factual basis. A brief comparison with A2A and user-interface protocols can follow after MCP has a meaning.

### 5.2 — A different way to use the operating system

Open with the claim before implementation:

**«در تصویری که از آیندهٔ سیستم‌عامل داریم، به‌جای بازکردنِ چند برنامه، خواسته را به یک دستیار می‌گوییم؛ او کار را میان برنامه‌ها و سرویس‌ها پیش می‌برد.»**

Then show the familiar phone task with several apps versus one conversation. Only after that should the deck explain screen interaction, API/MCP calls, and conversations with service agents. The viewer should know from the opening that this subsection is about the phone/operating-system interface.

Introduce Cyclon after the vision and example. Its official site describes a phone and OS in development that connect services and work across apps; use it as a concrete effort toward that vision. The claim that all operating systems will converge on this experience is the presenter's forecast, not a fact established by Cyclon's existence. [Cyclon](https://cyclon.ai/)

### 5.3 — Local execution: merge the duplicate demonstration

Current pages **127 and 128** use the same `local-lab` scene. Merge their teaching into one interactive scene: show what runs on the phone, then disconnect the network and show what still works. Retain the useful distinction between local inference and a remote reservation service; do not spend two pages establishing it again.

### 5.4 — What once looked like magic

Open with the missing premise:

**«بعضی تجربه‌هایی که قبلاً فقط در داستان‌ها جادو به نظر می‌رسیدند، حالا از کنار هم گذاشتنِ چند تواناییِ واقعی قابل تصور یا ساختن شده‌اند.»**

Then introduce the Black Mirror and Harry Potter examples as recognizable illustrations of that premise. For each one, connect the fictional experience to its ingredients: source material, generated language, voice, image, a scene, or a physical interface. Distinguish a fictional reference, an implemented demonstration, and a possible future experience. The audience should not have to infer why a television episode suddenly appeared.

### 5.5 — آیندهٔ کار

Restore the owner's argument using the legacy material and the explicit order in this feedback. The requested chain is:

| Step                                         | Its role in the argument                                                                                              | Suitable visual                                                       |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 1. State the question                        | What happens to work when agents can perform more specialized tasks?                                                  | An explicit question about future jobs, before the historical example |
| 2. Textile production before/after factories | Technology can reorganize a whole production chain and change the number and roles of people involved.                | The same clothing-production chain before and after mechanization     |
| 3. The pace of transition                    | This transition may affect people during their working lives.                                                         | A career timeline showing the change arriving mid-career              |
| 4. Specialized professional work             | In the presenter's scenario, AI takes over substantial expert work, including medical and building-engineering tasks. | The deliverable being produced by an agent                            |
| 5. Professional resistance                   | Human sign-off becomes a barrier to accepting the agent's output: insurance or building approval in the scenario.     | Completed work stopped at a human-signature gate                      |
| 6. The price of the stamp falls              | Work is obtained from AI; humans compete to supply the required formal sign-off.                                      | The same completed work with several competing stamp offers           |
| 7. Political change removes the barrier      | A candidate wins support to change the acceptance rules. This is the missing causal step.                             | Campaign promise → changed rule → removal of the signature gate       |
| 8. Ask which work is displaced later         | A temporary institutional barrier and a relationship-based role have different sources of value.                      | A direct question, following the removed gate                         |
| 9. Relationships and emotional leadership    | Interpersonal trust, group coordination, and emotional work motivate the football-coach example.                      | Model-assisted tactics alongside a coach working with the team        |

The coach belongs **after** the question about later-displaced work. Its purpose is to distinguish technical advice from the emotional and interpersonal role of leading people. “AI gives tactics” alone does not establish the conclusion.

The archive contains the required “مقاومتِ میان‌مدت: مُهرِ انسان,” “قیمتِ مُهر می‌ریزد,” and “فروپاشیِ آخرین مقاومت” material. Restore the political step explicitly. Do not substitute the current vague competition-for-signatures ending or a generic list of supposedly permanent human tasks.

The feedback is the authority for the new order, even where the archive's slide order differs. Preserve the argument while treating its occupation ranking, price path, and political outcome as a **future scenario**. Do not present hypothetical insurance/building rules as universal current law. Likewise, do not copy the archive's illustrative 10%/90% career figures as evidence, or its claim that industrialization never forced a mid-career change. Those assertions are unnecessary to the requested logic.

## 7. Scope of the next implementation

| Current material                          | Planned treatment                                                                                                         |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Parts 1–2, apart from named changes       | Preserve the successful explanations and visuals.                                                                         |
| Page 29 and pages 40–41                   | Complete the evaluation/benchmark/results sequence before the access and company material.                                |
| Company pages 34–39                       | Apply the verified additions and qualifications above; retain eight separate company pages.                               |
| Harness pages 50–69                       | Reorder around tools and context; rebuild the multi-cycle loop; improve demonstrations and prose.                         |
| Pages 70–76, 105–115                      | Move to new part 4; expand beyond producing code and agents.                                                              |
| Harness pages 77–104                      | Preserve the controls while making the teaching concrete, visible, and easier to follow.                                  |
| Pages 116–119                             | Show the complete personal-assistant/service-agent/backend chain and add a dedicated MCP explanation.                     |
| Pages 120–124                             | State the operating-system vision first, then demonstrate it and introduce Cyclon.                                        |
| Pages 127–128                             | Merge their local/offline demonstration.                                                                                  |
| Pages 129–134                             | Add the explicit magic-to-capabilities premise and connect every story example to it.                                     |
| Pages 135–142                             | Restore the jobs argument, including resistance, stamp pricing, political change, and the correctly placed coach example. |
| Maps, overview, notes, numbering, package | Update for five parts after the content order is settled.                                                                 |

Keep the earlier 100–150 content-slide target in view. Reuse and merge overlapping explanations before adding pages; the fifth part does not require preserving every old page as well as adding a second treatment. Final counts should follow a coherent sequence rather than dictate it.

## 8. Acceptance criteria for the next review

The next version should support a continuous explanation, including these observable outcomes:

1. After the evaluation dataset, the audience sees how public benchmarks and charts help compare choices before the talk changes to companies and providers.
2. Before tool schemas or context-management terminology, the viewer understands why live information requires an external operation and who executes it.
3. “Context” is introduced by assembling an actual input packet. Recent context, stored history, and reservation records stay distinguishable.
4. The agent-loop scene visibly returns to the model and executes further tools. It ends with a clear stopping condition and preserves independent purchase authorization.
5. The product part applies one staged method to software and non-software outputs. The producing agent, method, and produced artifact stay distinct.
6. Personal-assistant diagrams show every required actor; MCP has an understandable integration problem to solve.
7. The OS, fictional-experience, and jobs subsections each state their question or claim before presenting an example.
8. The final argument can be retold in order: textile change → AI work displacement → professional resistance → cheaper stamps → political change → later-displaced relational/emotional work → football coach.
9. Titles and body copy use ordinary Persian, and visuals demonstrate actions or consequences instead of merely decorating abstract terms.
10. Chapter-by-chapter teaching review precedes the usual interaction, layout, offline, and package checks. Passing those technical checks must not again be reported as proof that the audience can follow the presentation.

**COMMENT**: it's oK to have more than 150 slides.