# V7.4 — Presentation Rewrite: Analysis and Proposed Direction

Date: 2026-11-04  
Input: [01-transcription.md](01-transcription.md), 21 voice-message transcriptions from 08:13 to 09:36.  
Status: First analysis round, for review. The outline, examples, workflow additions, and visual direction proposed below are not approved implementation decisions.  
Language: English, as requested in the transcript. Proposed audience-facing labels are Persian.

## 1. What this version should achieve

V7.4 is a complete rewrite of the presentation's argument, teaching sequence, copy, and visual system. The existing deck is useful as a source of concepts and examples; it should not supply the new structure or visual template.

The presentation should leave the audience able to explain:

1. What an agent is, and how the model and harness contribute differently.
2. How to choose models and access plans using task quality, cost, language ability, and actual usage conditions.
3. Why model instructions alone cannot establish authority or protect secrets, and what the harness must enforce.
4. Why this workshop builds a focused agent with a framework, and how staged review makes that practical.
5. Which agent applications are useful today and which belong to a future scenario.

The central proposed argument is:

> A useful agent combines a model's ability to interpret and plan with software that controls execution. For the public service agents taught in this workshop, a focused harness makes the intended tools, permissions, data boundaries, and operating behavior explicit and testable.

This expresses a reason to choose the workshop's approach without claiming that custom code is automatically cheaper, safer, or better than every existing agent platform.

The requested order of work is consequential: analysis rounds → approved outline → new presentation → presentation feedback and corrections → propagation into public-agent Codo and, where needed, its book. This document completes the first analysis round. It does not authorize or report a presentation rebuild, archive move, package release, or Codo change.

## 2. Requirements extracted from every message

“Required” below means directly requested in the transcript. “Proposed” identifies an approach the speaker explicitly left open to discussion.

| Source time           | Requirement or proposal                                                                                                                                                                               | Consequence                                                                                                                                                                                          |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 08:13                 | Required: rewrite the deck from scratch; repair order, missing bridges, hooks, examples, interaction, and appearance.                                                                                 | Approve the argument and visual direction before producing the whole deck. The dissatisfaction covers typography as well as colors and background; no current design element has automatic approval. |
| 08:13                 | Required: archive the current deck and three previous decks; identify archives in the constitution.                                                                                                   | Preserve their dependencies and distinguish historical material from the active presentation.                                                                                                        |
| 08:13                 | Required: distribute one folder with `index.html` and relative local assets; opening it must not require a server.                                                                                    | Test the actual `file://` delivery and relocation of the folder.                                                                                                                                     |
| 08:13–08:15           | Required: several English analysis rounds, then the deck, then downstream Codo/book changes.                                                                                                          | Keep discussion and implementation separate; propose a coherent sequence for review.                                                                                                                 |
| 08:21                 | Proposed organizing device: agent = model + harness; explain each and compare responsibilities. Required substance: soft versus hard confirmation.                                                    | Use the equation as a teaching model; distinguish conversational behavior from independently enforced authorization.                                                                                 |
| 08:24                 | Required: state the custom-harness claim before arguing for it; explain Hermes and frameworks first.                                                                                                  | Introduce the options fairly, then compare them against the workshop's requirements.                                                                                                                 |
| 08:31                 | Required: model companies/families, open weights, common API formats, two Artificial Analysis charts, subscriptions versus usage billing, and Claude/ChatGPT/Antigravity/Cursor/OpenCode comparisons. | Separate model, provider, development client, subscription entitlement, and production inference. Date all commercial comparisons.                                                                   |
| 08:31                 | Required discussion: consider using an existing subscription for server inference, explain risk, and offer an API alternative.                                                                        | Preserve this requested decision, but check the specific provider and usage route before recommending it; see section 8.                                                                             |
| 08:38                 | Required research: names and remedies for ignored deletion instructions, production commentary appearing in products, and disclosure of internal checks.                                              | Treat these as distinct failures. Propose copy and dialogue review as concrete deliverables.                                                                                                         |
| 08:42, first message  | Required: discuss unnatural Persian, literal translations, and possible writer/editor model separation.                                                                                               | Evaluate actual Persian outputs; do not turn impressions about model origins into universal rankings.                                                                                                |
| 08:42, second message | Required: apply these lessons to our own presentation, Codo, and book.                                                                                                                                | Acceptance checks must cover audience copy, internal commentary, and natural Persian.                                                                                                                |
| 08:48                 | Required: teach layered work and correction before errors accumulate. Proposed analogy: P versus NP.                                                                                                  | Keep the reviewability principle; correct the complexity terminology before using it.                                                                                                                |
| 08:51                 | Proposed sequence: introduction → model → harness → future; a separate AI-assisted production chapter is undecided.                                                                                   | Recommendation: retain four main movements and teach staged production within them.                                                                                                                  |
| 08:52                 | Required: show the map again at each subsection boundary with completed/current/upcoming states.                                                                                                      | Use numbers and meaningful titles, without audience-facing labels such as “section,” “subsection,” or “act.”                                                                                         |
| 08:54                 | Required: approve a separate outline before writing the presentation.                                                                                                                                 | This analysis proposes the structure; the next artifact should be a dedicated, revised outline.                                                                                                      |
| 08:58                 | Required change: abandon CIA as the presentation structure and remove universal model-free completeness from the deck and Codo.                                                                       | Recommend an alternative deterministic client where useful; do not require feature parity for every agent. Include outage handoff and recovery.                                                      |
| 09:01                 | Required: direct, soft, and hard action policies; remove identity arguments the model should not choose.                                                                                              | Show action authority separately from authenticated caller binding.                                                                                                                                  |
| 09:05                 | Required: animate secret capture → handle → model/tool request → authorized resolution. Proposed Codo change: separate review of tools and sensitive data.                                            | Define which information is protected, where capture occurs, and which destinations may receive it.                                                                                                  |
| 09:10                 | Required: explain harness duties, including authentication and sessions; research other duties.                                                                                                       | Keep session implementation details in Codo while teaching the concept in the deck.                                                                                                                  |
| 09:13                 | Required: check for `/wire`; add a practical connection step if absent. Explain harness execution and restricted downstream tokens.                                                                   | Public-agent Codo has no canonical `/wire`; section 9 proposes its role.                                                                                                                             |
| 09:18                 | Required future topic: a personal agent as the main operating-system interface, accessing apps, web, APIs, MCP, or specialist agents through A2A.                                                     | Present this as an interface scenario; the unnamed recent company announcement remains unidentified. **COMMENT**: the news in below this very document                                               |
| 09:19                 | Required future topic: cheaper capability at a fixed quality level, model efficiency, and local phone inference.                                                                                      | Distinguish a scenario from a guaranteed trajectory; local inference does not make remote services work offline.                                                                                     |
| 09:30                 | Required examples: existing-service clients; Black Mirror's text/voice/physical progression; Harry Potter portraits, the Pensieve, and Riddle's diary.                                                | Distinguish simulation, identity, historical truth, embodiment, and current feasibility.                                                                                                             |
| 09:36                 | Required carry-over: textiles, football coach, human professional stamp, doctor/insurance examples. Other carry-over ideas require review.                                                            | Preserve the intended argument in new form; inventory additional candidates explicitly.                                                                                                              |

## 3. What the repository currently contains

The relevant local sources reviewed are the [active presentation](../../../presentation/index.html), [repository constitution](../../CONSTITUTION.md), public-agent Codo's commands, constitutions, living templates and reference guides, and the corresponding book content. The [V7.3 simplification decision](../V7.3/05-simplify-capabilities.md) also matters to the scope of agent delegation.

| Finding | Evidence | Implication for V7.4 |
|---|---|---|
| The current deck contains 118 slide `<section>` elements. | `presentation/index.html`; the repository constitution still describes 135 slides. | The old count is stale metadata, not a target for the rewrite. |
| The opening already uses the Mashhad travel example. | Current slides 1 and 26. | Reuse the situation if desired; rewrite its treatment and build a sustained question around it. |
| The old deck delays explaining the harness until after substantial architecture/security material. | Definition and responsibility slides occur around slides 63–64. | Introduce the two-part model early and revisit the harness when the audience understands model limitations. |
| Soft confirmation already exists in Codo and the book. | `docs/references/confirmation-policy.md`, `/capabilities`, and book chapter 7. | The new presentation must catch up with the three-policy teaching model. Preserve the existing hard-authorization contract. |
| Universal deterministic completeness is still mandatory. | Codo `docs/constitution/01-rules.md`, invariant 4 and AST-04; `/capabilities`; `/build`; capability template. | This is a real specification change, not a heading rename. Related fallback wording and checks must change together. |
| Secrets, context-bound identity, and bounded history already have explicit rules. | Codo security constitution, `/plan`, `/build`, `/data-model`, and living templates. | Add clearer discovery and review checkpoints instead of inventing a second security architecture. |
| `/tools` discovers and verifies integration choices; there is no public-agent `/wire`. | Public-agent canonical command directory and initial workflow. | Separate planned integration from proof that the built runtime can actually connect. A similarly named command in another workshop does not fill this gap. |
| The active deck loads its Persian font from Google Fonts. | External stylesheet in `presentation/index.html`. | Bundle the new font locally for a portable, self-contained presentation. |
| Paper and workshop rules are coupled. | Repository constitution's synchronization law; [paper](../../../paper/index.html), section 5. | The new optional fallback policy must be reconciled with the paper's stronger availability assumptions. |

The paper's model-free availability theorem depends on complete deterministic coverage. V7.4 can adopt a less restrictive workshop policy, but cannot continue claiming that theorem for an agent without that coverage. Recommended treatment: document the workshop's revised scope in the constitution and identify which paper guarantees still apply. Revising the research paper itself is a separate scope decision, not an automatic consequence of changing slide headings.

## 4. Proposed narrative and outline

### Recommendation: four main movements

Keep the speaker's four-part direction. Avoid a separate fifth movement about making products with AI: it would interrupt the model → harness explanation. Introduce staged review when discussing model mistakes, then show its full application when explaining how we build the harness.

Use one recurring service example, provisionally an agent that arranges a trip to Mashhad. It can illustrate interpretation, search, preferences, protected identity, booking proposals, confirmation, and a service outage. Use the workshop registration agent as a second, concrete example of what participants can build. Neither demo needs a live provider or real transaction.

The table below is a proposed outline, not a fixed slide list. Each row may need several screens. Persian labels are working copy awaiting language review.

| Number and working audience title | What it teaches | Example or visual treatment | Bridge to the next topic |
|---|---|---|---|
| **1 — از خواستن تا انجام‌شدن** | Establish the question: how can a message become completed work? | A travel request becomes a short sequence of visible actions. | What makes this different from a chatbot answering a question? |
| 1.1 — «برایم سفر بچین» | Distinguish explaining a trip, finding options, and making an authorized booking. | Reveal the three outcomes one at a time. | What turns language into action? |
| 1.2 — مدل و هارنس | Introduce “agent = model + harness” as a useful simplification. The harness includes orchestration, tools, context, and interfaces. | Split the same agent into the model's decision and software execution. | First understand what the model contributes. |
| **2 — مدل** | Build a practical understanding of model capability, limitations, selection, and access. | Return to the same travel message throughout. | Which responsibilities should software carry? |
| 2.1 — مدل چگونه پاسخ می‌سازد؟ | Brief neural-network intuition; learned weights; tokens; generation versus training. | A small network with clearly illustrative signals, followed by next-token generation. | What information does it receive on each turn? |
| 2.2 — زمینه، حافظه و ابزار | Context window, message history, tool requests/results, search, and a compact RAG example. | Assemble a prompt from a question and retrieved service information. | The model can be useful and still make characteristic mistakes. |
| 2.3 — خطاها را بشناسیم | Instruction failures, internal commentary leaking into output, disclosure, factual errors, and unnatural Persian. | Side-by-side flawed and corrected outputs; explain the difference. | How do we catch mistakes while work is still reviewable? |
| 2.4 — کار را قابل بررسی کنیم | Break a broad assignment into inspectable artifacts; approve copy and dialogues separately. | Request → outline → copy → interface → working behavior, with correction at each boundary. | Better workflow helps; model choice also matters. |
| 2.5 — کدام مدل برای کدام کار؟ | Provider versus model family; open weights versus hosted access; quality, language, latency, and task cost. | Two dated Artificial Analysis screenshots plus one Persian task comparison. | How do we pay for access to the chosen capability? |
| 2.6 — اشتراک یا پرداخت به‌اندازهٔ مصرف؟ | Compare development subscriptions and metered inference; explain common provider API formats. | A cost example with explicit workload assumptions, then compact product comparisons. | A model and an account still do not execute a safe service. |
| **3 — هارنس** | Explain execution, lifecycle, authority, privacy, integrations, and construction. | Keep model decisions and software execution visually distinct. | What does this enable beyond the workshop example? |
| 3.1 — از تصمیم تا اجرا | The model emits structured requests; the harness advertises tools, validates requests, executes integrations, and returns results. | Animate one search and one booking proposal. | The harness also owns continuity and identity. |
| 3.2 — کاربر، نشست و سابقه | Authentication; current conversation; stored history; deliberately retrieved older information. | Two separate sessions for the same person; selectively retrieve an earlier preference. | We must choose how to build this software. |
| 3.3 — سکوی آماده یا ساخت اختصاصی؟ | Explain Hermes, then framework alternatives and the WordPress versus Django/FastAPI analogy. State the workshop's claim before supporting it. | Compare one concrete service requirement across the two approaches. | The important design choice is where runtime authority lives. |
| 3.4 — زمان ساخت و زمان اجرا | A coding assistant can build and test the application; the serving agent receives its defined runtime tools. | Separate builder workspace and deployed service. | Now assign exactly what each runtime action may do. |
| 3.5 — حدود اختیار | Direct, soft, and hard policies; the model/harness responsibility split. | Run the same proposed change through all three policies. | Correct action scope also requires correct user scope. |
| 3.6 — فقط برای همین کاربر | Identity comes from authenticated context; the model does not select the caller's account. | `get_my_history()` acquires identity inside the harness. | Data can still leak even when the correct account is used. |
| 3.7 — راز کجا می‌ماند؟ | Sensitive input, opaque handle, storage, and authorized output resolution. | Two people exchange a protected value through the agent; show what each participant and the model actually sees. | The destination must enforce its own permissions too. |
| 3.8 — اتصال با دسترسی محدود | Real API/SDK/MCP calls; restricted service tokens; layered enforcement. | Harness rejects a forbidden action; downstream service also rejects an out-of-scope credential. | How should the service respond when inference is unavailable? |
| 3.9 — وقتی مدل در دسترس نیست | Where useful, an alternative web/mini-app/bot client serves the same backend; the harness supplies a link and manages return. | Turn inference off, show an honest handoff, then resume from current backend state. | How do participants build and verify these decisions? |
| 3.10 — این را چگونه بسازیم؟ | Apply the staged-review method through Codo: tools, policies, secrets, sessions, prompts, build, connection verification. | Show reviewed artifacts from one small service. | From a useful service agent, widen to a personal agent. |
| **4 — زندگی با ایجنت‌ها** | Connect present applications, interface futures, and social implications. | Mark demonstrated capability and hypothetical scenario distinctly. | Return to the opening: what can the audience now build and judge? |
| 4.1 — کارمند متخصص و دستیار شخصی | Organizational service agents versus a personal assistant; useful applications today. | Existing service API with a natural-language client. | One personal assistant might become a common entry point. |
| 4.2 — یک دستیار، چندین سامانه | Agent-centered interface; apps, browser use, APIs, MCP, and specialist-agent interaction. | One user request fans out to several services. | How do cost and local capability affect that future? |
| 4.3 — هوش ارزان‌تر، اجرای محلی | Explore cheaper fixed capability and efficient local inference without promising a date or universal offline operation. | Separate the local reasoning path from online service calls. | What kinds of experiences might this make possible? |
| 4.4 — از داستان تا تجربه | Black Mirror progression, speaking portraits, Pensieve, and diary examples. | A compact progression from text to voice/avatar to simulated space and physical embodiment. | New experiences also reshape work and institutions. |
| 4.5 — کار، اعتماد و مُهر انسان | Preserve the textile transition, football coach, professional stamp, doctor/insurance argument, and possible new work. | Visual comparison of production chains, then social and institutional examples. | End with a concrete skill: building and assessing a bounded, useful agent. |

At each subsection entrance, repeat a single map component with different state: completed entries subdued, current entry emphasized, upcoming entries distinct but readable. Show the current movement's children and the overall four-part route. This map is part of the delivery, not a substitute for the verbal bridge in the final column.

The outline deliberately teaches secret protection after identity and authority. An unconstrained “forward this handle to any destination” demo would undermine the earlier security explanation.

## 5. Carry-over from the old deck

Slide numbers below refer to the current 118-slide file, not earlier V7.0 variants. “Proposed” items need the requested review before inclusion.

| Old material                                                                 | Status and proposed treatment                                                                                                                                             |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Travel opening and tool loop, slides 1, 15–27                                | Proposed: retain the question and action loop, rebuild their narrative and visuals. Introduce the harness earlier.                                                        |
| Tokens, context, instruction tuning and reasoning effort, slides 7–13, 24–25 | Proposed: retain a short selection of fundamentals. Avoid a long introductory history before the audience understands the problem.                                        |
| Search and organizational retrieval, slides 16–20                            | Proposed: retain one example of each. Explain RAG as **retrieval-augmented generation**; the old Persian expansion reverses its meaning.                                  |
| Cost growth and benchmark literacy, slides 33–41                             | Proposed: retain the lessons, refresh evidence. Illustrative token counts are not measurements. Include the requested task-cost chart.                                    |
| General platform versus purpose-built service, slides 43–56                  | Required argument, revised comparison: introduce Hermes and frameworks; remove unsupported universal superiority claims.                                                  |
| Build/runtime separation and runtime authority, slides 49–70                 | Required substance: retain the distinction. Rebuild explanations around concrete duties and policies instead of absolute slogans.                                         |
| CIA pillars and mandatory model-free completeness, slides 71–85              | Explicit replacement: remove that organizing framework and completeness rule. Preserve relevant mechanisms under practical titles.                                        |
| Handles, ownership and outbound delivery, slides 80–84                       | Required substance: rewrite as a full inbound/outbound example with authorized destinations.                                                                              |
| Transport choices, slides 87–90                                              | Proposed: retain a compact explanation if it helps the audience understand harness interfaces. Detailed transport-specific mechanics belong in Codo.                      |
| Specialist/personal roles and protocols, slides 92–102                       | Required broad future direction; proposed depth: keep roles and simple integration paths, shorten delegated-approval mechanics.                                           |
| Textiles, slides 104–108                                                     | Explicit carry-over: preserve the analogy about automation and the pace of occupational transition. Do not preserve unsupported percentages as evidence.                  |
| Football coach, slide 110                                                    | Explicit carry-over: preserve the point about trust, emotional influence, and group coordination. Treat it as an argument, not proof of permanent immunity to automation. |
| Human stamp, doctor/insurance and engineering approval, slides 111–114       | Explicit carry-over: preserve the scenario about institutional permission and the economic value of the stamp. Do not present a fictional future policy as current law.   |
| Jevons paradox and new opportunities, slides 115–116                         | Proposed: useful counterweight to displacement, with the economic analogy framed as a possibility rather than a forecast. **COMMENT**: drop Jevons paradox                |

Additional old-deck content should earn its place by supporting a learning objective. The old terminology, metaphors, and slide count do not need to survive. In particular, the current master/slave body metaphor is a candidate for replacement with a clearer model/harness diagram. **COMMENT**: but keep the loop

V7.3 removed A2A and delegated-principal complexity from the participant Codo/book workflow. The transcript now explicitly asks for A2A in the presentation's future discussion. These scopes can coexist: mention the future interaction without silently restoring delegation machinery to the workshop. **COMMENT**: true

**COMMENT**: keep the model as adversary and the trust ladder too
## 6. Model and harness responsibilities

“Agent = model + harness” works as a pedagogical decomposition. It is not a universal mathematical definition. The harness means more than a chat wrapper: it includes the runtime machinery and integrations around inference.

| Responsibility | Model contribution | Harness contribution |
|---|---|---|
| Understand a request | Interpret language, ask clarifying questions, propose next steps. | Supply appropriate context and constrain executable operations. |
| Use a tool | Produce a structured tool request. | Advertise the schema, validate arguments, apply policy, call the actual service, process the result. |
| Establish identity | Understand references such as “my history.” | Authenticate the caller and bind identity from verified transport context. |
| Ask for soft confirmation | Summarize the proposed action and wait for assent. | Retain the ordinary direct executor under the selected policy; this is not independently enforced consent. |
| Obtain hard authorization | Propose the exact operation. | Render the authoritative proposal and verify authenticated, parameter-bound, expiring, one-use approval before execution. |
| Protect sensitive values | Work with an allowed summary or opaque handle. | Capture protected values before model exposure, store them, enforce ownership and destinations, and resolve at authorized boundaries. |
| Maintain conversation continuity | Use the supplied recent context; request allowed historical information. | Define sessions, persist events, choose bounded context, and enforce retrieval scope. |
| Handle failures and budget | Explain a supplied status when inference is working. | Detect failure without depending on the model; limit cost, avoid duplicate effects, and manage fallback/recovery. |

Additional harness duties worth researching and teaching selectively are input/output adaptation, durable business state, retries and timeouts, idempotency, cancellation, concurrency, rate limits, audit records, and operational monitoring. These are engineering responsibilities, not all separate presentation subsections. Google's [ADK conversational-context documentation](https://adk.dev/sessions/) distinguishes session history, state, and memory; this supports teaching them as related but different concepts. **COMMENT**: OK. include all in the presentation.

### The four practical security explanations

1. **Action authority:** direct / soft / hard. A trusted button is one possible hard-approval interface, but a button by itself establishes nothing. The server must validate the actor, exact action and parameters, validity, and one-use state. Pydantic AI's [deferred-tool documentation](https://pydantic.dev/docs/ai/tools-toolsets/deferred-tools/) explicitly distinguishes human approval from endpoint authentication and authorization.
2. **Caller and argument scope:** prefer `get_my_history()` to a model-selected `get_history(user_id)`. The harness supplies protected identity fields; it does not remove legitimate business arguments indiscriminately.
3. **Protected data:** raw value → protected storage → handle → permitted tool request → checked resolution. Apply the boundary to tool results, old history, logs, traces, attachments, and error paths as well as incoming chat. Regex cannot reliably identify every arbitrary secret; structured private input is a stronger option for data requiring strict exclusion.
4. **Downstream least privilege:** a tool should receive credentials limited to the needed service operations and resources. Harness policy and service-side permissions provide separate enforcement opportunities.

The alternative-client/outage pattern is a fifth engineering topic, explicitly optional under V7.4. Removing universal completeness does not remove hard authorization or data protection when a fallback is used.

For the secret-forwarding animation, the destination must be an authorized participant selected through a constrained reference or policy. Blind string substitution into an arbitrary `send_message(destination, text)` would allow the model to send a protected value to the wrong person. The current Codo constitution describes outbound unveiling to the owner; third-party forwarding therefore needs an explicit product policy and review rather than an unannounced widening of that rule. **COMMENT**: you are right. the harness should check if the receiver is eligible to see the secret or not. propose a simple mechanism.

## 7. Research: what to call the observed model failures

There is no single established scientific term covering every behavior in the transcript. The table distinguishes recognized research topics from descriptive labels useful for this project. These observations do not establish a particular model's hidden internal process.

| Observed behavior | Appropriate name and status | Practical response |
|---|---|---|
| Asked to remove an item, the assistant leaves it or adds a warning beside it. | **Instruction-following failure / constraint violation**. Negated requirements are one possible difficulty; the example does not prove a unique mechanism. | State the required final condition, edit the artifact, and inspect the rendered result and references. A deletion note is not a substitute for deletion. |
| The final product says “we removed X” or describes the author's instructions. | **Editorial commentary leaking into audience copy**, a descriptive project label. This is not automatically benchmark “data contamination” or chain-of-thought leakage. | Separate review notes from product copy; review an extracted audience-copy sheet before layout. |
| A registration agent tells callers how internal receipt checks work. | **Internal instruction/policy disclosure**; deliberate extraction is related to prompt leakage. It can also happen without an attacker. | Specify the user-facing response separately from internal procedure. Keep decisive validation rules and sensitive credentials in trusted code; hiding a checklist is not the underlying security control. |
| Persian contains literal idioms and English sentence patterns. | **Translationese**, **calque**, and localization/style failure. Translationese is a recognized research term; identifying a particular calque requires the actual source phrase. | Use a Persian style guide, reviewed examples, a terminology list, and a separate native-language editing pass. Judge the result with Persian readers. |
| Earlier corrections stop being respected in a long conversation. | **Long-context instruction/retrieval failure** is a possible contributor, not a diagnosis from one example. | Keep a concise current specification and explicit acceptance conditions; avoid relying on the model to reconstruct every prior correction. |
| Confident but unsupported factual or technical claims. | **Hallucination / factuality failure**, an additional candidate for the deck. | Require source-backed claims, label hypothetical examples, and verify tool outcomes independently. |
| The assistant reports a task as finished without checking the result. | **Unverified completion reporting**, a descriptive project label. | Define observable completion criteria and retain execution evidence; distinguish simulated demos from verified behavior. |
**COMMENT**: another: use mechanical operations like running test over code review

[IFEval](https://arxiv.org/abs/2311.07911) provides a research basis for evaluating verifiable instruction constraints; it does not supply a clinical diagnosis for the deletion example. [Lost in the Middle](https://arxiv.org/abs/2307.03172) documents context-position sensitivity in the models/tasks studied, not a universal explanation for all later models. The terminology of translationese is supported by [Graham, Haddow and Koehn](https://aclanthology.org/2020.emnlp-main.6/); that research does not establish why a particular generated Persian sentence was produced.

The exact English source behind «خودم درستت می‌کنم» is unknown. It would be speculation to assert that it came from “I'll fix you” or another particular phrase. Also, Persian dialogue attribution order is a stylistic choice, not an absolute grammatical prohibition. Preserve the speaker's preference as a writing guideline rather than teaching a false language rule. **COMMENT**: another example: "it will take minutes, not hours" with be translated wrongly to "این دقیقه‌ها می‌برد، نه ساعت‌ها" while correct translation is "این بجای چند ساعت، تنها چند دقیقه طول خواهد کشید"

### A review process that addresses these failures

Use a chain of inspectable deliverables: agreed intent → outline → exact audience copy → behavior/dialogue examples → implementation → observed result. At each boundary, check against the current specification and correct material errors before proceeding.

For the presentation, extract every visible title, label, caption, button, demo message, and tooltip for review. For a generated agent, review the runtime prompt and representative conversations, including refusal, correction, disclosure, outage, and action confirmation. Those are artifacts a product owner can assess without reading every line of code.

A stronger model or separate editor can help, but its output still needs evaluation. Research on [intrinsic self-correction](https://arxiv.org/abs/2310.01798) found limitations in reasoning tasks without external feedback; it supports using concrete feedback rather than treating “check your work” as verification. It does not prove that every current model or every editing task has the same limitation.

Recommendation for the main deck: teach the four directly reported failures using short examples, then briefly add factuality and unverified completion. Additional failure taxonomies can remain in supporting notes unless approved.

## 8. Claims and comparisons that need careful treatment

### P versus NP

Keep the insight that producing something and checking it can require different effort. Do not teach “P means easy; NP means hard” or claim that a software project becomes NP when divided into review stages.

Formally, P concerns decision problems solvable in polynomial time; NP concerns decision problems with polynomially verifiable certificates. P is contained in NP, and whether P equals NP remains unresolved. This is explained in the [Clay Mathematics Institute problem statement](https://www.claymath.org/wp-content/uploads/2022/02/MPPc.pdf).

Recommendation: use an easily checked puzzle as a brief analogy, then state the practical design principle: make each intermediate output small enough and explicit enough for the intended reviewer to judge. If formal complexity notation distracts from that point, omit it from the main narrative. **COMMENT**: drop p/np wording. just tell them we should break a large work into smaller steps that each step is verifiable easily.

### Models, providers, clients, and API formats

Use separate categories in the comparison:

- **Model/family and creator:** for example, the transcript's OpenAI/GPT, Anthropic/Claude, Google/Gemini, and Z.ai/GLM examples. Add other providers only where they help explain a real choice. **COMMENT**: add meta/muse, alibaba/qwen, xiaomi/mimo and deep seek too.
- **Hosting route:** creator API, third-party hosting, or a locally hosted open-weight model. Open weights alone do not imply a particular license, operating cost, or confidentiality guarantee.
- **Development client:** Claude Code, Codex, Antigravity, Cursor, or OpenCode.
- **Commercial entitlement:** subscription allowance, metered API access, prepaid credit, or a plan combining these.

“OpenAI-compatible” and “Anthropic-compatible” describe API interface compatibility, not model equivalence or a guarantee that every feature matches. In the later technical comparison, name the actual interface: for example, OpenAI Chat Completions versus Responses, or Anthropic Messages. Verify the chosen model, streaming, tool schemas, structured outputs, errors, and authentication route.

### Subscriptions versus usage billing

The transcript requests a comparison and an option to reuse subscription access for server inference. The analysis should preserve that request while correcting two broad assumptions:

1. A subscription is not universally cheaper. Compare the workload, usable allowance, reset windows, extra credits, overage, concurrency, supported models, and required operating conditions.
2. “Technically possible and the owner accepts suspension risk” does not establish that a provider supports that production route. Separate ordinary use of a native coding tool from using its account as a general inference backend for other callers.

The [official OpenAI authentication documentation](https://learn.chatgpt.com/docs/auth) distinguishes ChatGPT sign-in from API-key access and directs programmatic Codex workflows toward API-key authentication. It also documents enterprise access-token options for trusted automation. These routes should not be conflated with exposing a coding tool to public callers. [Codex pricing](https://learn.chatgpt.com/docs/pricing) distinguishes subscription usage from API pricing. As of this review, eligible Pro/Business plans can also claim [API credits](https://developers.openai.com/api/docs/guides/chatgpt-api-credits), so “subscriptions never include API benefits” would also be inaccurate.

Anthropic's [authentication and credential-use guidance](https://code.claude.com/docs/en/legal-and-compliance#authentication-and-credential-use) distinguishes ordinary subscription use from third-party products routing requests through subscription credentials, and directs product/service developers to API authentication. Its native-tool exceptions should not be generalized into permission for arbitrary public-service inference.

Recommended Codo decision: record the selected access route, actual provider conditions, supported deployment environment, allowance, outage behavior, and API alternative. Where a provider supports the required subscription-backed deployment, present that documented option. Where permission or support is unresolved, record that uncertainty rather than promising a working production route. This is a proposed refinement to the transcript's “accept the risk” flow and needs review.

For the eventual deck, compare the five requested product groups separately: Claude plans/Claude Code; ChatGPT plans/Codex; Google plans/Antigravity; Cursor; OpenCode and its selected providers/plans. The official [Antigravity plans](https://antigravity.google/docs/plans), [Cursor pricing](https://cursor.com/pricing), and the provider's own documentation should supply the dated snapshot. This analysis does not establish a complete live price table, current model ranking, or a cheapest-plan recommendation.

### Benchmarks and cost

The requested evidence consists of two separate [Artificial Analysis](https://artificialanalysis.ai/) captures: intelligence and cost to perform the specified benchmark workload. The speaker plans to supply them. Existing `presentation/assets/aa-index.png` and `arena-code.png` should not be assumed current or assumed to meet both requirements.

For each approved capture, retain source URL, capture date, index/version, metric definition, and units. Distinguish price per token, benchmark task cost, and actual application cost. Explain that Persian copy quality and the workshop's tool workflows need task-specific evaluation alongside the aggregate chart.
**COMMENT**: these are captured today:
score:
![[Pasted image 20261104132724.png]]

cost:
![[Pasted image 20261104132952.png]]

### Ready-made agent versus framework

Use Hermes as a concrete example, provisionally Nous Research's Hermes Agent; confirm the intended project before the final comparison. The [official Hermes security documentation](https://hermes-agent.nousresearch.com/docs/user-guide/security) already describes approval, isolation, credential filtering, and session boundaries. Therefore the old deck's implication that Hermes is necessarily closed or protected only by prompts should not carry over.

Introduce the limited WordPress analogy: configuring a prepared application versus building an application with framework components. Compare actual requirements such as domain-specific tools, public caller isolation, hard authorization, protected data, maintainability, and deployment effort.

Framework candidates for a concise landscape are Pydantic AI, Google ADK, LangGraph, and OpenAI Agents SDK. [Pydantic AI](https://pydantic.dev/docs/ai/tools-toolsets/deferred-tools/), [Google ADK](https://adk.dev/sessions/), and the [LangGraph reference](https://reference.langchain.com/python/langgraph/overview) illustrate different construction primitives. Pydantic AI remains the repository's workshop choice; a broader catalog does not by itself justify changing that stack. **COMMENT**: mention them all in the presentation.

### Future scenarios

Keep the ambitious examples, but distinguish demonstrated function from extrapolation:

- An agent client for an existing service is a concrete workshop application; its quality depends on available APIs and defined tasks.
- A text persona, imitated voice, or animated portrait is a simulation. It does not establish recovery of a person's identity or exact thinking.
- A generated visitable memory is a reconstruction from available material, not guaranteed access to a historically accurate recording.
- Physical embodiment requires capabilities beyond text, voice, or avatar generation; do not present the full Black Mirror progression as equally solved.
- An agent-centered interface may still contain many applications and services underneath. One main user interface does not imply only one executable program exists.
- Local inference can preserve some functions without internet; calling a remote service still requires connectivity. Efficiency is not the only engineering constraint.
- Cheaper intelligence at a fixed quality level is a scenario to examine with dated evidence. Flagship prices need not rise monotonically.

The “yesterday or the day before” operating-system announcement is not identified in the transcript. Leave its company, date, and claim unresolved until the source is supplied or independently matched. Similarly, select and verify exact Black Mirror episode references before using titles or clips. Preserve the textile and human-stamp arguments as the speaker's scenarios; the old deck's 10%/90% figures and universal claims about historical transitions are not established evidence.
**COMMENT**: episodes: be right beck (S02E01) and Eulogy (S07E05)
**COMMENT**: do not tell the audience that what is my forecast and what is not. just tell the forecast.
## 9. Proposed propagation into public-agent Codo and the book

### Existing foundation to preserve

The public-agent Codo is a Markdown instruction/template distribution; the participant's coding assistant generates runtime code. V7.4 should not add a shipped runtime framework to the kit. Maintain the current document review protocol, credential handling, Windows-compatible setup, and explicit deployment target checks.

The canonical initial workflow currently has 12 phases:

`/start → /idea-core → /prd → /tools → /sops → /data-model → /capabilities → /edge-cases → /prompts → /plan → /build → /deploy`

### Proposed changes and their reviewable outputs

| Area | Proposed change | Concrete output / verification |
|---|---|---|
| Tools and authority | Make the model-visible schema distinct from downstream API arguments. Mark fields supplied by verified context. | Tool contract showing business inputs, injected identity, permitted records/destinations, credentials, and effects. |
| Sensitive data | Add a separately reviewed privacy step; `/privacy` is a proposed name. | A data-flow table: sensitive field/source, capture method, vault/retention, model-visible representation, allowed destinations, and authorized resolution. |
| Sessions | Add a separately reviewed session/context step; `/sessions` is a proposed name. | Creation/reset/expiry rules, relation to upstream login, recent-context policy, historical retrieval, isolation, and behavior across restarts. |
| Confirmation | Reuse existing direct/soft/hard definitions and risk rationale. | Reviewed action matrix; conversational tests for soft, server-side authorization and bypass checks for hard. |
| Availability policy | Replace universal deterministic completeness with a documented product choice. | Alternative-client requirement where useful; otherwise explicit outage response. Update AST-04 and every dependent universal claim. |
| Access to inference | Add the subscription/API decision discussed in section 8 to provider selection. | Provider, model, supported access route, cost/allowance, deployment constraints, secret storage, and alternative route. |
| Audience copy and runtime dialogue | Review copy separately from internal validation procedures and engineering discussion. | Exact prompt files and conversation examples with a Persian editing pass and clear disclosure boundaries. |
| `/wire` | Add a practical runtime-connection procedure after the application exists. | Evidence for actual configured service identity, scoped credentials, callable integration, error handling, and deployment environment. |
| Packaging and documentation | Keep canonical procedures, generated command wrappers, routing, progress, and book aligned. | Rebuilt packages whose procedure content matches source; workflow examples and navigation updated together. |

Recommendation for discussion: keep tool/schema review in `/tools`, put `/privacy` after `/data-model`, put `/sessions` before `/prompts`, and put `/wire` after `/build` and before `/deploy`. `/wire` should be rerunnable; deployment must recheck the connection from the selected server. Final phase numbering and command names belong in the approved workflow design.

`/wire` must distinguish configuration from verified connectivity and from an authorized production effect. Use a read-only or explicitly permitted sandbox operation where available. A successful search call is different evidence from a sent Bale message or a created Git issue; the latter requires authorization for that exact verification action.

The session interview should not silently equate authentication expiry with conversation expiry. They may be linked for a specific product, but are distinct policies. Starting a new conversation also should not discard durable business state or authorize retrieval from someone else's history.

### Where consistency work will be needed

- Codo security constitution and AST-04; technology/access guidance; workflow constitution and status.
- `/tools`, `/sops`, `/data-model`, `/capabilities`, `/edge-cases`, `/prompts`, `/plan`, `/build`, and `/deploy`, plus the proposed procedures.
- Living templates, confirmation-policy and integration references, package-generation routing, and entry-file navigation.
- Book chapters 2 and 5–8 as affected by prerequisites, design flow, integration, data/policies, and build/deploy.
- Repository constitution: active/archive distinction, revised presentation metadata, and the paper/workshop availability scope.

The book should explain the changes participants must understand; it does not need to repeat every presentation example. The source instruction prioritizes Codo changes and makes book changes conditional on actual impact. Updating existing rehearsal agents or their deployed state is not part of this analysis and should not happen as an incidental packaging step.

## 10. Archive and presentation delivery design

### Archive inventory

The requested four candidates exist:

| Existing entry point | Proposed archive location |
|---|---|
| `workshop_docs/versions/V7.0/presentation1/08-presentation.html` | `presentation-archive/v7.0-presentation1/`, preserving the entry file and required assets. |
| `workshop_docs/versions/V7.0/presentation2.html` | `presentation-archive/v7.0-presentation2/`, with any dependencies. |
| `workshop_docs/versions/V7.0/presentation3/index.html` | `presentation-archive/v7.0-presentation3/`, with any dependencies. |
| `presentation/index.html` | `presentation-archive/pre-v7.4/`, including `presentation/assets/`. |

These are proposed destination names. Preserve historical analysis/transcription documents in their version folders. During implementation, inventory referenced files, move/copy the required deck dependencies, and update or redirect links that otherwise break. An archive index and constitution entry should identify the old presentations as historical and point to the active one. No archive move has been made for this analysis.

### Portable delivery contract

The active deliverable should remain `presentation/`, with `index.html` and local CSS, JavaScript, fonts, images, and media as needed. A build process during authoring is acceptable; the recipient should only open the completed folder's `index.html`.

The core deck and demonstrations should work without a local server or live inference. Avoid features that require network requests to load local data under `file://`, and do not rely on module-loading behavior that fails there. External source links may remain links; they must not be required to display the deck. Videos, charts, and fonts used during delivery should be local assets.

Acceptance checks for the later implementation:

1. Open `index.html` directly in the intended browser with networking disabled; inspect console/network failures.
2. Copy the folder to a different location, including a path with spaces, and repeat the check.
3. Confirm fonts, images, motion, navigation, overview, and subsection maps work from that copy.
4. Exercise each demonstration and its reset/replay; simulated outcomes must not masquerade as live verification.
5. Check Persian shaping, mixed-direction labels, clipping, contrast, and projector readability.
6. Ensure no production credentials, absolute machine paths, required CDN assets, or live service calls are embedded.

### Visual and copy direction

Rebuild typography, palette, background, spacing, and layout together. Before applying a design to the whole deck, review a small sample: opening, concept/example screen, animated mechanism, comparison, and roadmap state.

Use a diagram for a mechanism, a sequence for a handoff, a comparison for a choice, and a short example for an abstraction. A reveal animation should explain what changes; decorative motion does not repair a missing conceptual bridge. Provide manual progression and a readable static state. The transcript asks for richer visuals, not animation on every screen.

Audience copy must stand on its own. Keep author instructions, implementation commentary, removed-topic notices, hidden validation details, and labels such as “act/section/subsection” out of the actual presentation. This analysis document is an internal planning artifact, so structural labels here serve a different purpose.

## 11. Recommended work sequence and decisions for the next round

| Stage | Deliverable | Condition for moving on |
|---|---|---|
| Analysis | This document and subsequent analysis rounds as needed. | Resolve material disagreements about scope, claims, examples, and workflow. |
| Outline | A separate `03-presentation-outline.md`, revised from section 4. | Approve the narrative, subsection contents, bridges, and carry-over selection before authoring the deck. |
| Copy and visual sample | Exact audience copy plus representative screens. | Review Persian, factual claims, explanatory devices, and design direction. |
| Presentation | New portable HTML deck; preserved archives and updated archive references. | Feedback incorporated; offline delivery checks pass. |
| Propagation | Codo specifications/procedures/packages and affected book chapters. | Revised rules agree across artifacts; verification claims are appropriate to the actual guarantees. |

The next discussion should settle these choices; none blocks completion of this analysis:

1. **Narrative:** keep the four movements and weave staged production into model limitations and harness construction, or give it a separate movement? **COMMENT**: keep 4
2. **Scope and duration:** who is the primary audience, how much technical background should be assumed, and what is the delivery time? The transcript does not specify them; a final slide count would be premature. **COMMENT**: the audience is mixed: next workshop participants + some ورودی جدید دانشگاه . the presentation is intented to take about 3h and about 100-150 slides without counting the recurring map
3. **Depth of comparison:** compact main-route model/plan comparisons with detailed reference material, or a longer buying-guide treatment inside the talk? **COMMENT**: medium to low depth
4. **Codo checkpoints:** adopt `/privacy`, `/sessions`, and `/wire` as distinct commands, or preserve fewer commands while requiring separate reviewed artifacts? **COMMENT**: adopt /wire and /privacy but not /sessions. put session management instructions where we say about chat history (/tools I think?) or anywhere better. because all agents do not have chats! some agents do jobs on schedule!! or do we need /sessions even on scheduled agents?
5. **Provider access:** approve the provider-specific subscription decision in section 8 rather than a blanket “accept account risk” runtime recommendation? **COMMENT**: in /wire, codo/ should guide user to pick a provider and a model (or a set of them) and one option is to reuse their subscription that they are creating the agent with.
6. **Availability scope:** approve the optional alternative-client policy and explicit constitutional qualification of the paper's stronger theorem? **COMMENT**: leave the paper. let's adapt our rule for presentation/codo
7. **Carry-over:** approve additional candidates in section 5, especially RAG depth, transport details, Jevons paradox, and protocol/delegation depth? **COMMENT**: keep cut off issue and  search resolution too.
8. **Examples and assets:** provide/select the two Artificial Analysis captures and identify the recent operating-system announcement; confirm the intended Hermes project and exact media references. **COMMENT**: I provided

The strongest next artifact is an approved teaching outline with explicit transitions. That gives the visual rewrite and later Codo changes a shared, reviewable foundation.


# the news

📱 سایکلون می‌خواد گوشی رو از «اپ‌محور» به «ایجنت‌محور» تبدیل کنه

🤖 استارتاپ سایکلون روی گوشی‌ای کار می‌کنه که به‌جای اینکه فقط یه دستیار هوش مصنوعی داشته باشه، خودش می‌تونه داخل اپ‌های اندروید حرکت کنه و وظایف رو از طرف کاربر انجام بده.

⚙️ مثلا می‌تونه توی واتساپ عکس پیدا کنه و بفرسته، بین چند اپ اطلاعات جابه‌جا کنه یا حتی اگه ابزار موردنیاز وجود نداشته باشه، اون رو داخل Cloud Sandbox بسازه. 

البته گوشی نهایی هنوز آماده نیست. فعلاً نسخه آزمایشی Cyclon OS روی Pixel 8a ارائه می‌شه و سخت‌افزار اختصاصی شرکت برای ۲۰۲۷ برنامه‌ریزی شده.

چالش اصلی هم قابلیت اطمینان و حریم خصوصی‌ـه؛ چون بعضی وظایف هنوز به مدل‌های Cloud وابسته‌ان و همه اپ‌ها هم لزوما اجازه کنترل توسط هوش مصنوعی رو نمی‌دن.

 [🔗 ادامه خبر را در آتنا بخوانید](https://athenai.app/blog/news/cyclon-ai-phone/)