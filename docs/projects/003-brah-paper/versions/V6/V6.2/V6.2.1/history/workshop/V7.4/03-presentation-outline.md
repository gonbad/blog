# V7.4 — Presentation Outline

Date: 2026-11-04  
Inputs: [transcript](01-transcription.md) and the owner's inline comments and supplied news in [02-analysis.md](02-analysis.md).  
Status: Outline for review, incorporating those comments.  
Format: English planning document; working Persian audience titles.  
Target: Approximately three hours; **128 content slides**, excluding recurring maps.

## 1. Direction after the comments

Proceed to the outline. The comments settle the main structure, audience, length, comparison depth, retained content, and Codo changes sufficiently; another general analysis round would repeat those decisions. This document includes the two small design proposals still needed: recipient permission for secrets and context management for conversational/scheduled agents.

The audience combines future workshop participants with new university students. Introduce each technical term through a concrete example before using it in a comparison. Keep provider, plan, framework, and protocol coverage at low-to-medium depth. Spend the explanatory time on the agent loop, the model/harness division, reviewable work, and visible mechanisms.

The four movements are:

1. **از خواستن تا انجام‌شدن** — establish the question and the model/harness decomposition.
2. **مدل** — explain capability, context, selection, access, and characteristic failures.
3. **هارنس** — explain execution, operating responsibilities, construction choices, authority, and protected data.
4. **زندگی با ایجنت‌ها** — connect useful agents, personal interfaces, imaginative applications, and changes to work.

Use the Mashhad trip as the main thread. Use workshop registration to show a realistic public service and a scheduled morning report to make clear that an agent need not have a chat interface. Each additional example should explain something these three cannot explain well.

### Running order

| Movement / activity | Content slides | Time |
|---|---:|---:|
| 1 — از خواستن تا انجام‌شدن | 1–8: 8 slides | 12 min |
| 2 — مدل | 9–46: 38 slides | 45 min |
| Break after movement 2 | — | 10 min |
| 3 — هارنس | 47–100: 54 slides | 60 min |
| 4 — زندگی با ایجنت‌ها | 101–128: 28 slides | 33 min |
| Recurring maps and movement transitions, distributed throughout | Excluded from the 128 | 10 min |
| Closing questions | — | 10 min |
| **Total** | **128 content slides** | **180 min** |

Demonstrations, short audience prompts, and their explanations are included in each movement's time. They are not extra sessions. There are 21 subsection entrances below, hence approximately 21 recurring map states; a movement entrance can share its first subsection's map.

### Map and copy rules

At each subsection entrance, show the four-movement route and the current movement's children. Completed entries, the current entry, and upcoming entries must be visibly different without making the text unreadable. Use numbering such as `۳.۶` and meaningful titles. The audience sees those labels, not authoring terms such as “act,” “section,” or “subsection.”

The numbered slide titles below are working copy, not the final copy sheet. Mechanisms get diagrams or sequences; choices get comparisons; abstractions get examples. Motion should expose an actual change. Every demonstration needs manual progression and reset, and must remain understandable in a static state.

## 2. Detailed outline

### 1.1 — «برایم سفر بچین»

**Slides 1–4 · 6 minutes.** Hook: the same request can produce advice, options, or an actual booking. Ask the audience which of these they expected.

| Slide | Working audience title | Content and treatment |
|---:|---|---|
| 1 | برایم سفر بچین | Open with the Mashhad request and a visual of the intended outcome: transport, hotel, and arrival arranged. Hold back the mechanism. |
| 2 | پاسخ خوب کافی است؟ | A chatbot describes how to organize the trip. Contrast the explanation with the user's still-unfinished task. |
| 3 | از حرف تا عمل | Reveal finding options, selecting an itinerary, and preparing a booking. Distinguish a proposed action from an executed one. |
| 4 | چه چیزی این کار را ممکن می‌کند؟ | Freeze before the final commitment. Establish the two questions: how does it act, and who gave it that authority? |

**Bridge:** take the working assistant apart before explaining its components.

### 1.2 — مدل و هارنس

**Slides 5–8 · 6 minutes.** Give the audience a simple map they can retain for the rest of the talk.

| Slide | Working audience title | Content and treatment |
|---:|---|---|
| 5 | ایجنت = مدل + هارنس | Introduce the teaching decomposition. The model interprets and proposes; the surrounding software manages context, tools, execution, and interfaces. |
| 6 | چه کسی تصمیم می‌گیرد؟ چه کسی اجرا می‌کند؟ | Split one travel action into the model's structured request and the software's real service call. |
| 7 | همیشه منتظر پیام نیست | A scheduled morning reporter wakes on a timer, gathers news, and prepares a report. An incoming chat is one trigger among several. |
| 8 | مسیر امروز | First overall map: model → harness → applications and future. Return to the booking question as the reason to learn the machinery. |

**Bridge:** understand the model before deciding what authority to give it.

### 2.1 — مدل چگونه پاسخ می‌سازد؟

**Slides 9–16 · 9 minutes.** A short, concrete explanation of learned computation; no long history lesson.

| Slide | Working audience title | Content and treatment |
|---:|---|---|
| 9 | یک شبکهٔ کوچک | Show a small neural network transforming inputs into an output. The animation illustrates the idea rather than pretending to expose a large model's exact internals. |
| 10 | وزن‌ها چه هستند؟ | Adjust a few connection weights and show an output changing. Connect learned numerical parameters to the model being distributed or hosted. |
| 11 | یادگیری و پاسخ‌دادن | Separate training from inference. A conversation is not automatically a new training run that changes the model's weights. |
| 12 | متن چگونه وارد مدل می‌شود؟ | Break a short Persian sentence into illustrative tokens. Explain why token counts matter for context and billing. |
| 13 | پاسخ، گام‌به‌گام | Animate successive token generation. Treat next-token prediction as an entry point to understanding generation, not an explanation of every capability. |
| 14 | برای فکرکردن چقدر وقت بدهیم؟ | Explain reasoning effort through a simple versus a multi-step task; introduce latency and cost as practical tradeoffs. |
| 15 | یک مدل، چند زبان و چند جور کار | Text, code, and other supported modalities; capability varies by model and task. Use one Persian instruction. |
| 16 | روان‌بودن، درست‌بودن را ثابت نمی‌کند | Show a plausible but incorrect answer and an external check. Establish why later verification matters. |

**Bridge:** the model's response depends on the information supplied to it.

### 2.2 — زمینه، دانش و ابزار

**Slides 17–22 · 7 minutes.** Preserve cutoff and search as an explicit problem/solution pair; introduce retrieval through a different information gap.

| Slide | Working audience title | Content and treatment |
|---:|---|---|
| 17 | مدل این‌بار چه می‌بیند؟ | Assemble instructions, the request, recent messages, and tool results into a bounded context window. |
| 18 | سابقه را چه کسی نگه می‌دارد؟ | The harness stores and selects context. Separate what is saved from what is sent on a particular inference call. |
| 19 | دانش تا چه زمانی؟ | Ask for information after a model's training cutoff. Explain why stored model knowledge cannot establish today's answer. |
| 20 | جستجو، شکاف را پر می‌کند | The model requests search; software retrieves a dated source; the model answers from the returned evidence. Show all three steps. |
| 21 | اطلاعات داخل سازمان چطور؟ | Public search cannot retrieve a private organization's material by assumption. Introduce a permitted internal knowledge source. |
| 22 | سند مرتبط، کنار پرسش | Show a compact RAG flow: retrieve relevant material, add it to context, answer from it. Keep embeddings at an intuitive level. |

**Bridge:** models differ; choosing one requires more than recognizing a company name.

### 2.3 — کدام مدل برای کدام کار؟

**Slides 23–32 · 12 minutes.** Cover the requested families, both supplied charts, model-as-adversary framing, and the trust ladder.

| Slide | Working audience title | Content and treatment |
|---:|---|---|
| 23 | مدل، سازنده، میزبان | Separate a model's identity, the company that created it, and the provider serving the request. Use one route diagram. |
| 24 | چند خانوادهٔ مهم | Locate OpenAI/GPT, Anthropic/Claude, Google/Gemini, and Meta/Muse. A brief landscape, not a release-history catalog. |
| 25 | گزینه‌های دیگر | Locate Z.ai/GLM, Alibaba/Qwen, Xiaomi/MiMo, and DeepSeek. Explain why comparing the actual task matters more than the country or logo. |
| 26 | وزن باز یعنی چه؟ | Contrast access to model weights with access to an inference endpoint. Keep license, hosting, compute, and quality separate. |
| 27 | بهترین برای کار ما | A compact checklist: task quality, Persian, tool use, latency, context, cost, and data handling. Use travel/registration as the selection task. |
| 28 | امتیاز هوشمندی | Use the supplied November 4 intelligence chart. Read a few positions with the audience; explain what an aggregate score can and cannot decide. |
| 29 | هزینهٔ انجام کار | Use the supplied cost chart. Compare benchmark cost with quality; distinguish its workload cost from per-token pricing and a customer request's cost. |
| 30 | اگر به خود مدل هم اعتماد نکنیم؟ | Retain the second threat: the model may fail or act adversarially, and its hosting provider receives the submitted context. Prepare the need for data minimization and restricted authority. |
| 31 | داده را به چه کسی می‌سپاریم؟ | Retain the trust ladder: a model under our own development/control; self-hosted open weights; an appropriately trusted hosted provider. Explain custody, jurisdiction, operations, and residual risk without promising safety from location alone. |
| 32 | یک قالب آشنا برای اتصال | Introduce common OpenAI-style and Anthropic-style API interfaces. Similar request formats do not make every model feature or behavior interchangeable. |

**Bridge:** the model and the commercial route used to access it are separate decisions.

### 2.4 — اشتراک و پرداخت به‌اندازهٔ مصرف

**Slides 33–38 · 7 minutes.** Six compact slides; use dated facts in the later copy pass rather than filling the main talk with plan tables.

| Slide | Working audience title | Content and treatment |
|---:|---|---|
| 33 | دو روش پرداخت | Subscription allowance versus metered usage. Show one assumed development workload and one serving workload; compare limits as well as headline price. |
| 34 | Claude و Claude Code | Explain the relevant plan/client distinction, model access, allowance, strengths, and limits at a practical level. |
| 35 | ChatGPT و Codex | Explain the subscription/client/API distinction and the relevant development choice. Use the actual plan snapshot at authoring time. |
| 36 | Antigravity | Explain its place as a development environment and how the selected access plan affects model usage. |
| 37 | Cursor | Explain its editor workflow, model selection, allowance, and extra usage without implying the plan is itself a model. |
| 38 | OpenCode و انتخاب ارائه‌دهنده | Explain the client/provider separation. Close with development access versus runtime access: `/wire` will offer model/provider selection, including reuse of the builder's existing subscription where that route is usable. |

**Bridge:** a capable model and a good plan still produce mistakes. Show the failures participants can recognize and correct.

### 2.5 — خطا را همان‌جا پیدا کنیم

**Slides 39–46 · 10 minutes.** Apply the owner's concrete examples, staged review, and preference for mechanical checks.

| Slide | Working audience title | Content and treatment |
|---:|---|---|
| 39 | گفتیم حذف شود | Show an item left in place or replaced by “this was removed.” The required final artifact is the check; an acknowledgement is not evidence. |
| 40 | حرفِ پشت صحنه وارد محصول شد | Show author instructions or revision commentary leaking into audience copy. Separate the specification, review conversation, and final text. |
| 41 | هر توضیحی برای کاربر نیست | A registration bot exposes internal receipt checks. Show the useful user response separately from trusted internal validation. |
| 42 | فارسیِ ترجمه‌ای | Use the supplied example: “It will take minutes, not hours” → awkward «این دقیقه‌ها می‌برد، نه ساعت‌ها» → natural «این به‌جای چند ساعت، تنها چند دقیقه طول خواهد کشید». Explain rewriting for Persian readers. |
| 43 | نویسنده و ویراستار | Demonstrate a separate Persian editing pass, examples, and terminology guidance. A different model can help; the resulting copy still needs review. |
| 44 | هر گام، یک خروجی قابل بررسی | Break a large request into intent, outline, copy, behavior, and implementation. Review and correct each small artifact before dependent work grows. |
| 45 | چیزی را که می‌شود آزمود، بیازماییم | Prefer an executable check for a checkable property: run behavior tests, check a link, open the actual file, inspect the rendered page. Tests and review answer different questions. |
| 46 | یک اصلاح کوچک، پیش از ادامه | Show one worked iteration: proposed change → checked result → correction → next step. Tie claimed completion to observed evidence. |

**Bridge:** staged work improves construction. At runtime, the harness must carry responsibilities that should not depend on the model remembering instructions.

**Break: 10 minutes.**

### 3.1 — از درخواست تا اجرای واقعی

**Slides 47–51 · 6 minutes.** Keep and rebuild the loop; replacing the body metaphor does not remove it.

| Slide | Working audience title | Content and treatment |
|---:|---|---|
| 47 | هارنس چه چیزی را دربرمی‌گیرد؟ | Show transport adapters, context assembly, orchestration, policies, tools, and service connections around the model. |
| 48 | خروجی مدل، درخواست است | A structured search/booking request leaves the model. The external service has not yet been called. |
| 49 | ابزار را چگونه معرفی می‌کنیم؟ | Show a small tool schema, allowed inputs, and validation. Explain that introducing a schema and executing an operation are different steps. |
| 50 | نرم‌افزار سرویس را صدا می‌زند | Animate the harness's actual API/SDK/MCP call, bounded result handling, and return to the model. |
| 51 | حلقهٔ ایجنت | Full loop: trigger → context → model → checked tool call → result → next decision or finish. Step through the travel case, then briefly replay with a timer trigger. |

**Bridge:** making one tool call work is only the beginning of operating an agent.

### 3.2 — ادارهٔ یک ایجنت

**Slides 52–60 · 10 minutes.** Include every approved harness duty, grouped into understandable operating situations.

| Slide | Working audience title | Content and treatment |
|---:|---|---|
| 52 | ورودی، خروجی و هویت | Transport adapters receive web/chat/events, authenticate the source, and render the response appropriately. An identity string in a message does not authenticate its author. |
| 53 | یک گفت‌وگو از کجا تا کجاست؟ | Explain a conversation session and a new conversation. Upstream login expiry and conversation expiry are distinct choices. |
| 54 | سابقه، زمینه و حافظه | Separate persisted events, recent model context, and retrieved long-term information. A history request remains scoped to authorized records. |
| 55 | کار انجام‌شده کجا می‌ماند؟ | Durable booking/registration state survives a new chat or a restarted process. The model's memory is not the business database. |
| 56 | اجرای ساعت هشت صبح | Timer, run identifier, scoped input, progress, and completion. A scheduled agent needs execution context and possibly memory; it need not invent a conversation. |
| 57 | اگر پاسخ دیر رسید؟ | Timeouts, bounded retries, and distinct provider/tool errors. A retry after an uncertain response needs care about completed side effects. |
| 58 | دوبار اجرا نشود | Use one booking/payment example to explain idempotency and concurrent runs. State transitions and deduplication belong to software. |
| 59 | سقف مصرف و تعداد درخواست | Budgets, rate limits, and bounded loops. Show runaway spending stopped by the harness rather than by a model promise. |
| 60 | توقف، ردگیری و پایش | Cancellation at defined safe points; an audit trail and operational monitoring show what ran, failed, or remains pending. Keep raw secrets out of ordinary traces. |

**Bridge:** ready-made agents and custom applications both need these duties; compare how to obtain the required behavior.

### 3.3 — سکوی آماده یا ساخت اختصاصی؟

**Slides 61–67 · 8 minutes.** Define the alternatives and state the workshop's claim before giving the reasons.

| Slide | Working audience title | Content and treatment |
|---:|---|---|
| 61 | دو راه برای ساختن | Configure an existing agent application or build an application with framework components. Both are real engineering choices. |
| 62 | Hermes چیست؟ | Introduce Hermes Agent as the prepared application being compared. Show what it supplies, including existing controls, instead of treating it as a straw man. |
| 63 | چند چارچوب ساخت | Mention all four: Pydantic AI, Google ADK, LangGraph, and OpenAI Agents SDK. Give each a short description of its construction role. |
| 64 | وردپرس و چارچوب‌های وب | Use the WordPress versus Django/FastAPI analogy to distinguish configuration from application construction. State the limits of the analogy briefly. |
| 65 | چرا در این کارگاه هارنس اختصاصی می‌سازیم؟ | State the scoped claim: our public service needs explicit domain tools, authority, protected data, and verifiable behavior. Compare fit, development effort, maintenance, and ownership. |
| 66 | زمان ساخت | The coding assistant designs, edits, installs, and tests within the builder's authorized environment. Show staged artifacts replacing one enormous request. |
| 67 | زمان اجرا | The deployed agent gets the tools and limits its service requires. Contrast builder access with serving access; return to the booking authority question. |

**Bridge:** make “limited runtime authority” concrete with three action policies.

### 3.4 — حدود اختیار

**Slides 68–74 · 8 minutes.** Show the distinction through execution paths, not only policy names.

| Slide | Working audience title | Content and treatment |
|---:|---|---|
| 68 | برای هر کار، چه اختیاری؟ | Introduce direct, soft, and hard policies. Pure reads remain distinct from actions with effects. |
| 69 | اجرای مستقیم | A low-risk, scoped action can run without another question under its approved policy. Show the harness still applying business permissions. |
| 70 | تأیید نرم | The model holds the direct tool but is instructed to summarize and wait for assent. Show a correction before assent; explain the behavioral limitation. |
| 71 | تأیید سخت | The model can propose; a separate authenticated interaction authorizes execution. Animate the path outside the model. |
| 72 | کدام وظیفه دست کدام است؟ | Compare the same action across the three policies. Show conversational flexibility versus an enforced boundary. |
| 73 | تأییدِ همین کار، با همین جزئیات | The trusted confirmation binds the caller, action, exact material parameters, validity, and one-use state. Editing the booking invalidates the old approval. |
| 74 | اگر مدل فریب بخورد | A malicious instruction cannot reach an absent executor or bypass the server's authorization check. Explain the guarantee within the implemented boundary. |

**Bridge:** permission for an action is not permission to choose anybody's account.

### 3.5 — فقط در محدودهٔ مجاز

**Slides 75–78 · 5 minutes.** Preserve context-bound identity and show why removing the right argument matters.

| Slide | Working audience title | Content and treatment |
|---:|---|---|
| 75 | تاریخچهٔ چه کسی؟ | Show the risk in a model-selected `get_history(user_id)` when the model should only serve the current caller. |
| 76 | هویت را هارنس اضافه می‌کند | Animate `get_my_history()` → verified caller identity → scoped backend request. Leave legitimate business arguments intact. |
| 77 | درخواست حساب دیگری | Attempt a foreign-account lookup. The harness rejects it independently of the wording generated by the model. |
| 78 | خواندن هم حد دارد | A read is restricted to authorized records and does not hide a write or notification. Demonstrate a boundary test. |

**Bridge:** even an operation on the right account can expose data the model never needed to see.

### 3.6 — راز کجا می‌ماند؟

**Slides 79–85 · 10 minutes.** Use the requested two-person forwarding animation and the small permission mechanism in section 3 below.

| Slide | Working audience title | Content and treatment |
|---:|---|---|
| 79 | چه چیزی لازم نیست به مدل برسد؟ | Distinguish useful task information from protected fields such as a phone number or private message. Show the model's actual view. |
| 80 | راز را پیش از مدل بگیریم | Compare a structured private input with pattern capture for recognizable fields. Arbitrary secrets need an explicit capture route. |
| 81 | مقدار واقعی و شناسهٔ ارجاع | The harness stores the value and creates an opaque handle. Show the separate secret store and sanitized model context. |
| 82 | مدل با شناسه کار می‌کند | The model receives and passes the handle while composing an allowed forwarding request. It does not receive the raw secret. |
| 83 | چه کسی اجازهٔ دیدن دارد؟ | The owner chooses the permitted receiver through a trusted control. Show the secret's recipient-permission row and the harness check. |
| 84 | برای گیرندهٔ مجاز؛ برای دیگری، رد | Resolve for the approved receiver; change the destination and show rejection. A guessed/copied handle is insufficient authority. |
| 85 | گشودن در آخرین مرز | The harness inserts the value only into the authorized delivery. Tool results, model history, and normal logs retain handles or non-sensitive status. |

**Bridge:** the harness should also have limited powers when it talks to external services.

### 3.7 — اتصال با دسترسی محدود

**Slides 86–89 · 4 minutes.** Explain two enforcement layers through the same integration.

| Slide | Working audience title        | Content and treatment                                                                                                                                                                                 |
| ----: | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    86 | اتصال واقعی به سامانه         | Use a search service, Git issue service, or Bale integration to show that the harness performs the actual request.                                                                                    |
|    87 | کلید فقط برای کار لازم        | Scope a service token to the required project, resource, and operations. Credentials remain outside model-visible context.                                                                            |
|    88 | دو لایهٔ کنترل                | First the harness rejects an unauthorized call; then show how the service's restricted token independently limits access.                                                                             |
|    89 | از «تنظیم شد» تا «کار می‌کند» | Show verification of service identity, permitted operation, and denied operation. Distinguish a configured connector from a proven working connection. **COMMENT**: why in presentation? just in codo |

**Bridge:** what should the user receive if inference becomes unavailable?

### 3.8 — وقتی مدل در دسترس نیست

**Slides 90–93 · 4 minutes.** Teach the revised optional pattern without restoring feature parity as a universal rule.

| Slide | Working audience title | Content and treatment |
|---:|---|---|
| 90 | مدل قطع شد | Trigger a provider timeout, unavailable allowance, or user quota. The harness detects the condition and supplies the correct response. |
| 91 | یک خدمت، چند راه استفاده | Where useful, show the same backend with an agent client and a conventional web/mini-app/bot client. Agent-only products remain possible. |
| 92 | ادامه از مسیر دیگر | The harness sends the alternative-client link and preserves pending business state. If there is no suitable alternative, it explains the interruption honestly. |
| 93 | برگشت به گفت‌وگو | After recovery, notify appropriately and resume from authoritative state. Do not repeat completed actions or treat an outage as approval. |

**Bridge:** participants can build these mechanisms by making each design decision reviewable.

### 3.9 — از ایده تا ایجنتِ خودمان

**Slides 94–100 · 5 minutes.** Connect the talk to Codo without turning the presentation into command documentation.

| Slide | Working audience title                      | Content and treatment                                                                                                                                    |
| ----: | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    94 | کار بزرگ، گام‌های قابل بررسی                | Revisit the method from slide 44, now applied to a small service agent.                                                                                  |
|    95 | اول رفتار را روشن کنیم **COMMENT**: نامانوس | Define purpose, triggers, workflows, and user-facing responses before building. Include a scheduled task alongside a conversation.                       |
|    96 | ابزارها و داده‌های حساس                     | Show `/tools` producing contracts and `/privacy` producing protected-data/recipient rules. Review them separately.                                       |
|    97 | وضعیت، سابقه و اجرای بعدی                   | Review conversation context if relevant, run context for scheduled work, and durable state in the existing design steps.                                 |
|    98 | بسازیم و بیازماییم                          | Coding assistant generates the application; run meaningful behavior and boundary checks. Show an actual result rather than a claim that tests exist.     |
|    99 | وصل کنیم                                    | `/wire` selects provider/model(s), offers existing subscription reuse as an access option, and verifies chosen external integrations.                    |
|   100 | روی سرورِ درست، با شواهد                    | Deploy to the intended host, verify the real entry point, and keep credentials and durable state intact. End with the service the participant can build. |

**Bridge:** a bounded service agent is one role. A personal assistant coordinating many services is another.

### 4.1 — کارمند متخصص و دستیار شخصی

**Slides 101–105 · 6 minutes.** Widen the view from the workshop project to the surrounding ecosystem.

| Slide | Working audience title | Content and treatment |
|---:|---|---|
| 101 | دو نقش | Organizational specialist serving callers versus personal assistant working for its owner. |
| 102 | یک سامانه، یک کلاینت تازه | Add natural-language access to an existing service API. Connect directly to the registration example. |
| 103 | کارمندِ همیشه در چت نیست | A reporter collects information on schedule and prepares a digest. Explain useful automation with bounded tasks and observable output. |
| 104 | دستیارِ من، خدمتِ شما | The personal assistant coordinates a trip through specialist services while maintaining the owner's preferences and permissions. |
| 105 | API، MCP و A2A | Identify the three interaction concepts at a high level. Keep future agent-to-agent interaction in the talk without restoring delegated-principal machinery to Codo. |

**Bridge:** an assistant coordinating services can become the user's main interface.

### 4.2 — یک دستیار، چندین سامانه

**Slides 106–110 · 6 minutes.** Tell the interface forecast directly and use the supplied Cyclon news as its concrete industry example.

| Slide | Working audience title | Content and treatment |
|---:|---|---|
| 106 | به‌جای گشتن بین برنامه‌ها | Show one request replacing several manual app transitions. The underlying services remain present. |
| 107 | دستیار راه را پیدا می‌کند | Animate app/browser interaction, an API/MCP call, and a specialist-agent interaction as different access paths. |
| 108 | Cyclon | Introduce the actual project and its agent-centered phone interface. Show Pixel 8a early-access prototype versus planned custom hardware, with a concise source/date caption. |
| 109 | ابزاری که هنوز نداریم | Cyclon's described cloud-sandbox app-building route connects the interface forecast back to AI-assisted construction. |
| 110 | خواستهٔ ما، اجرای دستیار | Carry the forecast forward: conversation becomes a common entry point for calls, alarms, service requests, and coordination under permissions. |

**Bridge:** the economics and location of inference influence how widely this interface can work.

### 4.3 — هوش ارزان‌تر و نزدیک‌تر

**Slides 111–114 · 4 minutes.** Separate the cost of frontier capability from the cost of a fixed level of useful capability.

| Slide | Working audience title | Content and treatment |
|---:|---|---|
| 111 | توان مشخص، هزینهٔ کمتر | Use the smartphone analogy to explain falling cost for a fixed useful capability. Any plotted numbers need dated evidence; otherwise use a qualitative illustration. |
| 112 | مرز توان جلو می‌رود | Explain why premium frontier capability and cheaper existing capability can coexist. Do not invent a monotonic flagship-price law. |
| 113 | مدل روی خود دستگاه | Show efficient local inference carrying some reasoning and interaction onto a phone, with cloud services available when needed. |
| 114 | بی‌اینترنت چه می‌ماند؟ | Local assistant functions continue locally; remote booking, messages, or fresh information still need their service connection. |

**Bridge:** more accessible capability changes what kinds of experiences people can build.

### 4.4 — از داستان تا تجربه

**Slides 115–120 · 7 minutes.** Use the named fictional references as vivid anchors, then tell the technological progression in ordinary future-oriented language.

| Slide | Working audience title | Content and treatment |
|---:|---|---|
| 115 | Be Right Back | Correct title: *Black Mirror*, S02E01. Connect a person's digital traces to text and voice interaction. Keep the explanation brief. |
| 116 | از صدا تا حضور | Extend the progression to avatar interaction and physical embodiment. Explain the added capabilities through the experience, not a list of model buzzwords. |
| 117 | تابلوهای سخنگو | Use the portraits in Dumbledore's office: a display, appearance, voice, and a persona that can respond. |
| 118 | دفترچهٔ ریدل | A conversational artifact leads into a remembered or generated scene. Connect dialogue with world construction. |
| 119 | Eulogy | Correct reference: *Black Mirror*, S07E05. Use its photo/memory exploration to connect personal media and immersive interaction. |
| 120 | قدم‌زدن در خاطره | Connect the Pensieve to generated video or a navigable environment built from photos, recordings, and stories. |
**COMMENT**: for each, we need an image, a motion or a short video
**Bridge:** these experiences require new kinds of work and alter the economics of existing professions.

### 4.5 — کار، اعتماد و مُهر انسان

**Slides 121–128 · 10 minutes.** Preserve the owner's argument and examples; give it a deliberate ending rather than an appended list.

| Slide | Working audience title | Content and treatment |
|---:|---|---|
| 121 | لباس پیش از کارخانه | Show the textile chain: spinning, weaving, dyeing, and tailoring, with people distributed across it. |
| 122 | کارخانه زنجیره را عوض کرد | Animate consolidation and increased output. Explain the analogy without invented historical counts. |
| 123 | سرعتِ گذار مهم است | Contrast replacement across generations with a change fast enough to force retraining during a working life. |
| 124 | کارهای تازه و نقش‌های تازه | Building specialist agents, connecting services, evaluation, security, and operating useful automated work. Avoid unsupported displacement percentages. |
| 125 | چرا سرمربی هنوز مهم است؟ | Tactics alone do not explain team performance. Preserve the point about emotional influence, trust, and collective coordination. |
| 126 | ارزشِ مُهر انسان | Preserve the doctor/insurance and professional-approval examples: institutions may initially require human sign-off even when the underlying work is increasingly automated. |
| 127 | رقابت بر سر مُهر | Tell the owner's forecast: competition pressures the price of sign-off, institutions change, and professional value shifts. Use future tense rather than implying an existing legal rule. |
| 128 | حالا چه چیزی می‌توانیم بسازیم؟ | Return to the opening trip and the workshop's service agent. Close with the ability to build, bound, and verify useful agents. |

**Then:** ten minutes for audience questions, outside the numbered content-slide budget.

## 3. Two design details resolved for this outline

### Recipient eligibility: a small permission list per secret

Use a server-side permission list, attached to the stored secret. The handle names a secret; possession of the handle does not grant permission to disclose it.

For the demonstration:

| Secret record | Trusted value |
|---|---|
| Owner | Authenticated Alice |
| Model-visible reference | An opaque, unguessable handle such as `h_7f…` |
| Permitted recipient | Authenticated Bob's stable service identity |
| Permitted destination | The specific private delivery channel associated with Bob |
| Permission creation | Alice selects Bob through the harness's trusted recipient control |

The sequence is simple:

1. Alice enters the secret through a private capture route and selects Bob from a trusted contact/participant selector. The server verifies Alice's identity and records her choice. The model cannot add recipients or edit this permission list.
2. The model works with the handle and a constrained recipient reference. It requests forwarding without seeing the raw value.
3. Immediately before delivery, the harness checks that the request belongs to Alice's authorized context, that the handle belongs to the permitted scope, and that the resolved recipient/channel matches the stored permission. It rejects missing, foreign, or revoked permissions.
4. If permitted, the harness resolves the value only into that delivery. A changed destination is rejected. The model receives a non-sensitive success/failure result, and ordinary history/logging does not receive the secret.

Show one granted delivery to Bob and one denied attempt to another recipient. This teaches the essential mechanism without introducing delegated identities or a broad policy language. If a product needs time-limited grants, expiry can be added to the same record; it is not necessary for the introductory animation.

Keep this check distinct from action confirmation. A hard-authorized operation still requires its separate approval contract, and an approval to send does not authorize an otherwise forbidden recipient. `/privacy` should specify the eligibility rule; `/wire` and build/deploy checks should prove the configured delivery honors it.

This is a proposed mechanism for review. It deliberately extends the old owner-only outbound example to an explicitly owner-authorized recipient; it does not permit arbitrary forwarding.
**COMMENT**: apply in codo but in presentation, write down a simpler example. for example harness sends mobile number to a service. the harness allowed that service as a tool to know mobile number so when LLM tells harness to open the handle and sends it to the external service, harness checks that the secret belongs to the user and opens it.
### Conversation sessions and scheduled execution context

There is no need for a universal `/sessions` command. A scheduled agent can run without a conversation session. It still needs a defined trigger, execution identity, input scope, run identifier, durable progress where appropriate, and a policy for retries, overlap, and retained history.

Place the questions where they belong:

| Existing step | Context decision |
|---|---|
| `/prd` | Conversational, scheduled, event-driven, or hybrid operation; who the service acts for and who can receive output. |
| `/sops` | Start/finish conditions, triggers, repeated/overlapping runs, cancellation, and recovery; conversation boundaries where relevant. |
| `/data-model` | Durable business state, run records, conversation/history records if needed, retention, and authorized retrieval. |
| `/tools` | Schemas and permissions for retrieving context/history or calling external services. This is not the sole home of session policy. |
| `/prompts` and `/plan` | What context each inference receives and how the harness assembles it for each mode. |
| `/build`, `/wire`, `/deploy` | Verify the declared behavior and the actual configured model/service connections. |

Do not introduce a fake conversation merely to reuse a chat-oriented template. Authentication state, conversation state, run state, and business state can be related without being treated as one object.

## 4. Supplied assets and source notes

### Artificial Analysis captures

The owner's two captures have been inspected and copied into this version folder without editing. Originals remain at the repository root.

| Use | Local asset | Provenance |
|---|---|---|
| Slide 28: intelligence | [Intelligence capture](assets/artificial-analysis-intelligence-2026-11-04.png) | Supplied `Pasted image 20261104132724.png`; 1013 × 338; captured 2026-11-04 per the comment. |
| Slide 29: cost | [Cost capture](assets/artificial-analysis-cost-2026-11-04.png) | Supplied `Pasted image 20261104132952.png`; 1012 × 349; captured 2026-11-04 per the comment. |

`Pasted image 20261104132955.png` is byte-identical to the supplied cost capture. It is not a third metric. Both crops omit their full page heading and some chart context; recover the exact metric title, units, legend, and index version for the final source caption rather than inventing them. The source site is [Artificial Analysis](https://artificialanalysis.ai/).

### Cyclon and named examples

The supplied news identifies **Cyclon**. Its [official product page](https://cyclon.ai/) describes a phone/OS that works across existing apps and identifies the Pixel 8a early-access prototype; custom hardware is expected in Q2 2027, subject to authorization. The [official detail page](https://cyclon.ai/preorder) describes cloud-sandbox app building and cloud inference. These support slides 108–109; a concise factual caption is enough. Source check: 2026-11-04.

The provided [Athena article](https://athenai.app/blog/news/cyclon-ai-phone/) could not be retrieved through the web tool; the pasted news and Cyclon's primary pages establish the intended reference. There is no need to ask the owner to identify the company again.

The episode names and numbers are **Be Right Back, S02E01**, and **Eulogy, S07E05**, confirmed by [Netflix Tudum](https://www.netflix.com/tudum/articles/black-mirror-best-episodes). Use those spellings in asset requests and captions. No clip or still has been acquired for this outline.

The requested **Meta/Muse** naming is retained; Meta's [developer site](https://dev.meta.ai/) identifies its Muse models. Xiaomi's [MiMo documentation](https://mimo.mi.com/docs/welco) is the starting point for that family. Exact models, plan allowances, and prices belong to the dated copy pass; these outline rows are not a claim about a permanent ranking.

### Forecast delivery

Tell the future movement as a connected forecast. Do not add badges, repeated qualification slides, or statements identifying which predictions came from the owner. Keep research notes and sourcing behind the presentation. Use natural future tense for predictions and accurate present-tense descriptions for actual products; this preserves the confident delivery without turning an announced prototype or a fictional scene into an accomplished capability.

## 5. Codo consequences to carry forward after the presentation

The accepted direction is **add `/privacy` and `/wire`; do not add `/sessions`**. Detailed downstream changes follow presentation review, as originally requested.

- `/privacy` should turn sensitive-field handling, capture, ownership, permitted recipients/destinations, retention, and model exposure into a reviewed specification.
- `/wire` should guide the creator through choosing a provider and a model or model set, including task/role routing if useful. It must offer reuse of the subscription used to build the agent as one option, alongside metered APIs and appropriate self-hosted routes. Record the actual supported connection, allowance, provider conditions, deployment behavior, and API alternative; do not imply every subscription exposes the same runtime interface.
- `/wire` also proves required runtime connectors work. Keep discovery in `/tools`; do not silently move every credential or infrastructure decision out of `/start` or postpone every design choice until wiring.
- The working placement remains `/privacy` after `/data-model`, and `/wire` after `/build` before `/deploy`. Model requirements belong in the earlier specification/plan; final selection and connection proof belong in `/wire`, with a rebuild if the selected route requires it.
- Adapt fallback and completeness rules in the presentation/Codo, including their templates and verification wording. A conventional alternative client is a useful product choice, not a required equivalent path for every agent feature.
- **Leave the paper unchanged.** The repository constitution must describe the updated workshop scope accurately rather than reimpose the paper's universal availability premise. Preserve applicable authorization, identity, and protected-data rules.
- Keep A2A in the future presentation at the agreed depth. Do not restore delegated-principal or approval-tier complexity to Codo/book.

## 6. Comment coverage and authoring checkpoints

| Comment decision | Where it appears |
|---|---|
| Four movements; mixed workshop/new-student audience; about 3 hours and 100–150 content slides | Sections 1–2: four movements, 128 slides, 180-minute budget. |
| Medium-to-low comparison depth; add Meta/Muse, Qwen, MiMo, DeepSeek; mention all four frameworks | Slides 23–38 and 61–67. |
| Keep the loop, model as adversary, and trust ladder | Slides 30–31 and 47–51. |
| Include all listed harness operating duties | Slides 47–60 and the context design above. |
| Propose simple secret-recipient eligibility | Slides 79–85 and section 3's permission list. |
| Prefer mechanical checks; use the supplied Persian example | Slides 42 and 45–46. |
| Replace P/NP terminology with easily verified small steps | Slides 44, 46, and 94. |
| Retain cutoff and search resolution | Slides 19–20. |
| Drop Jevons; preserve textiles, coach, human stamp, doctor/insurance | Slides 121–127 follow the retained argument. |
| Use supplied captures, Cyclon news, and identified episodes | Slides 28–29, 108–109, 115, and 119; section 4. |
| Deliver the forecast directly | Future movement and section 4's delivery rule. |
| Add `/privacy` and `/wire`, place provider/model selection and subscription option in `/wire`, omit `/sessions` | Slides 94–100 and sections 3 and 5. |
| Adapt presentation/Codo; leave paper alone; keep A2A scope distinction | Section 5. |

After outline review, prepare the exact audience copy and representative visual treatments before building the full deck. Then implement the portable `index.html` presentation with local relative assets, incorporate presentation feedback, and propagate the agreed changes into Codo and affected book chapters. Archive the four older decks with their dependencies during that implementation stage.


**COMMENT**: ببین این بار موقع ایجاد ارائه باید نهایت دقت رو بکنی. مثلا سعی کن تا جای ممکن از عبارات نامانوس در زبان فارسی استفاده نکنی.