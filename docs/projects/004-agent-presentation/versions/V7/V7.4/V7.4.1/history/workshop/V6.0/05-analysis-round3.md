# V6.0 — round 3: the two agency rehearsals, job vs. employment, Pydantic AI as the base, and payments

> Input: your 9 **COMMENT**s inside [03-analysis-round2.md](03-analysis-round2.md) + the 18 voice notes in [04-transcription.md](04-transcription.md) (2026-10-17 12:46 → 2026-10-18 08:33). Written 2026-10-18.
> Also checked: V4.1 codo commands (`private/kandoo/templates/codo/commands/` — `idea-core`, `ux`, `design`, `prototype`), V5.0's payment round, Vista V0.2 `03-gaps`, and the current upstream docs of Pydantic AI V2 / Pydantic AI Harness, Bale payments, Rubika Bot API, Eitaayar API, Telegram MTProto view counters, and Ghost's Admin API.

> **Read of the day.** The two rehearsals — **Neda Soroushian the reporter («ندا سروشیان، خبرنگار»)** and **Hanieh the support agent («هانیه، پشتیبان»)** — are the right two to rehearse with. They are the two shapes almost every participant agent will take: a **scheduled producer** (wakes on a clock, researches, publishes outward) and a **reactive responder** (wakes on a message, answers inside one conversation). But they also expose five things round 2 got wrong or never saw:
> 1. **An agent is two things, not one: a *Job* (built once) and an *Employment* (filled at hire time).** Persona, avatar, business knowledge, channels, schedule and balance belong to the employment, not to the build. That is the contradiction you hit in the last voice note, and it is also the answer to your "in-house vs. rented workforce" question (Part 1).
> 2. **"7 on top of 6" — yes, and most of 7 already exists upstream.** Pydantic AI V2 now ships *capabilities*, and its official **Pydantic AI Harness** package ships memory, conversation search, compaction, planning, guardrails, a prompt-injection defender, per-tenant spend limits, Playwright/browser-use, human-in-the-loop approvals and durable execution on Postgres. Round 2 was about to hand-write all of that. Our own layer shrinks to what is Iranian- or agency-specific (Part 3).
> 3. **Payments need a ledger, not a tool.** Bale wallet invoices bring money in; an append-only ledger driven by *harness metering events* decides what is owed. The model can read the balance, quote a budget and issue a top-up invoice, but it has no tool that moves value (Part 4).
> 4. **Round 2 left a cross-customer leak open.** Its `search_history(scope="all_peers")` default is exactly the hole you described in the 13:14 voice ("someone talks to support and pulls out another customer's data"). It must go (Part 7.3, Errata).
> 5. **Quality, not thrift, is the bar for the agency (12:46 voice).** Round 2's "featherweight / zero-token / cheapest model" arguments were workshop arguments. For the agency agents they are not decision drivers anymore.

---

## Part 0 — Reconciliation

### 0.1 Your 9 comments on round 2

| # | Where in `03-analysis-round2.md` | Your comment | Resolution in round 3 | Section |
|---|---|---|---|---|
| **R1** | §1.1, Type B | *for type B, we first try to reverse engineer. e.g. we may find an API that its frontend uses* | A **4-rung bridge ladder**: official API → the frontend's own private API (reverse-engineered) → deterministic UI automation → agentic browser. `eBot` (Eitaa web MTProto) is already rung 2. | **§5.1** |
| **R2** | §1.5-A, `bmad-forge-idea` | *inspire it* | A **pressure-test round («آزمونِ فشار»)** at the end of `/role`: the riskiest questions first, one theme per question, written as a normal `NN-questions.md` round. | **§2.3** |
| **R3** | §1.5-A, `bmod-toolsmith` | *inspire it* | Its 4-question interview maps onto `/role` → `/hiring` → `/tools` → `/sops`; its **3 quality lenses** (adversarial, edge-case hunter, verification gap) become a gate before `/plan`. | **§2.4** |
| **R4** | §1.5-B, Telethon | *use it* | Adopted for the Telegram humanoid account (rung 2: it *is* the official MTProto protocol). | **§5.2** |
| **R5** | §1.5-B, GitLab/GitHub MCP | *use it* | Adopted through Pydantic AI's `MCPToolset` (GitLab) and the Harness `GitHub` capability. | **§5.2** |
| **R6** | §1.5-B, firecrawl / trafilatura | *use it* | `trafilatura` + `feedparser` are Neda's reading stack; self-hosted Firecrawl only for JavaScript-heavy sources. | **§6.3** |
| **R7** | §1.5-B, MCP catalogs | *good* | Kept. | — |
| **R8** | §2.1, end | *can we have 7 (pre-built) on top of 6 (Pydantic AI)? I don't want to reinvent the wheel; follow standards.* | **Yes.** Component-by-component mapping of round 2's `core/` onto Pydantic AI V2 + Harness; what stays ours is a thin, named package. | **Part 3** |
| **R9** | §3.5, end | *what about payment mechanisms?* | A full **billing & payments subsystem**: ledger, metering, entitlements, holds, Bale wallet invoices, budget quotes, admin-only discounts/refunds. | **Part 4** |

### 0.2 The 18 voice notes in `04-transcription.md`

| #       | Time        | Gist                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Section                     |
| ------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- |
| **V1**  | 10-17 12:46 | Not a workshop project: the **agent agency («آژانس / خدمه»)** is a product and a lead-generation engine for the workshop. Quality over tokens and time. Omid owns and runs every agent. There must be a process for adding new agents. **COMMENT**: they are rehearsals                                                                                                                                                                                                                                                        | Read of the day, **Part 8** |
| **V2**  | 12:58       | **Neda the reporter**: twice a day at employer-set times, searches the employer's domain, researches, writes a long blog post + AI image, posts a summary + image + link to every employer channel (Eitaa/Bale/Telegram/Rubika). Employer steers tone/topic/schedule/channels, asks for reports (posts, views), balance, top-ups. Pricing: 100k Toman per post, first channel free, 500k per extra channel, 3 free posts. **COMMENT**: times in a day is configurable                                                          | **Part 6**, **§4.6**        |
| **V3**  | 12:58       | Budget help: "60 posts a month, 3 free, 57 to buy — how much? Help me pay."                                                                                                                                                                                                                                                                                                                                                                                                                                                    | **§4.5**                    |
| **V4**  | 13:00       | Separate code per agent. **The harness does the acting** (messages, accounting, views, reading); the LLM only decides which tools to use. Accounting is outside the LLM; no discounts; read-only accounting reports are fine.                                                                                                                                                                                                                                                                                                  | **Part 3**, **Part 4**      |
| **V5**  | 13:03       | Agents speak like humans, not machines. Neda: 22, BA journalism (Tehran), single, third child, patient, phlegmatic («بلغمی»), profile photo. Out-of-scope refusals are polite, varied and human.                                                                                                                                                                                                                                                                                                                               | **§6.1**, **§9.1**          |
| **V6**  | 13:14       | **Hanieh the support agent**: employer briefs business facts and FAQ through the management channel. She logs into **humanoid accounts** (the employer's SIM, already active on his phone) on Eitaa/Bale/Telegram/Rubika. Every incoming message triggers her. She can **send** and **read only the current chat**, never another customer's. Unknown answer → escalate to manager. The manager answers from his own phone in the same chat and can later add the Q&A to the FAQ. RAG, so not everything goes into the prompt. | **Part 7**                  |
| **V7**  | 13:14       | Her summary/memory is editable by her; a scolding from the employer becomes a remembered lesson (summary + RAG).                                                                                                                                                                                                                                                                                                                                                                                                               | **§7.4**                    |
| **V8**  | 13:17       | She manages her own RAG. Voice/image understanding later. Detect token-burning abusers, exit politely, tell the manager. Per-customer instructions from the manager are injected **by the harness** when that customer writes.                                                                                                                                                                                                                                                                                                 | **§7.5–7.6**                |
| **V9**  | 13:20       | No access to the employer's own systems (e.g. gold balance) even if anyone insists → tell the customer, tell the manager, and **upsell**: build your own agent with us or in the workshop.                                                                                                                                                                                                                                                                                                                                     | **§1.3**, **§7.7**          |
| **V10** | 13:26       | Hanieh: ~32, married, a 4-year-old daughter, 5 years in support, BA public relations (Tehran/Beheshti), phlegmatic or sanguine («دموی»): calm but warm; represents the business well, sells well.                                                                                                                                                                                                                                                                                                                              | **§7.1**                    |
| **V11** | 13:31       | "Don't censor yourself." Maybe a separate management bot per agent? Pricing for Hanieh: per new chat, per message, per new instruction (e.g. 100k), initial setup free.                                                                                                                                                                                                                                                                                                                                                        | **Part 9**, **§4.6**        |
| **V12** | 13:31       | Per humanoid account: first free, the rest paid. "Propose the amounts."                                                                                                                                                                                                                                                                                                                                                                                                                                                        | **§4.6**                    |
| **V13** | 13:44       | Decision: **each agent is a separate project with its own bot**. Owners of other businesses are just the agency's customers, so Hanieh can sell herself the same way she serves any business.                                                                                                                                                                                                                                                                                                                                  | **§1.4**, **§8.1**          |
| **V14** | 13:47       | **The persona differs per business.** The agency defines one persona to sell; each hiring business defines its own (e.g. "Hamideh Zeraatgar"). In the agency's own instance she also has tools such as accounting; elsewhere she doesn't. You hire her by talking to her on Telegram/Eitaa/Bale.                                                                                                                                                                                                                               | **Part 1**                  |
| **V15** | 13:49       | Same for Neda: per-employer persona. A **shared blog** where every employer's reporter writes; an agency channel aggregating everything; **network effect** across channels.                                                                                                                                                                                                                                                                                                                                                   | **§6.5**, **§8.2**          |
| **V16** | 13:51       | The common thread: all built by the same pipeline (Codo); all promote the workshop and each other; shared mechanisms (payments, keeping data from the LLM, out-of-LLM approval); separate code.                                                                                                                                                                                                                                                                                                                                | **§3.4**, **§8.3**          |
| **V17** | 13:55       | The upsell pitch is role-specific (support → "connect to your own system"; reporter → "Twitter, Instagram, your own platform like Konkooria").                                                                                                                                                                                                                                                                                                                                                                                 | **§8.3**                    |
| **V18** | 10-18 08:33 | Treating both as rehearsals reveals contradictions: (1) persona/avatar is decided **at hire**, not at build — the agent is an empty vessel; (2) Neda has a website (the blog) — should the pipeline have optional design steps, activated at idea-core time? (3) "Make the mental model clear: which agents are for others, which are only for the participant — what is a rented workforce («نیروی اجاره‌ای»)?"                                                                                                               | **Parts 1–2**               |

---

## Part 1 — The mental model you asked for (V18, V13, V14, V9)

### 1.1 An agent = a Job + one or more Employments

| | **Job («شغل») — decided at build time** | **Employment («استخدام») — decided at hire time** |
|---|---|---|
| What it is | What this kind of employee *can do* and *how*. | *Who* she is for one employer, and *what she knows* about that employer. |
| Contents | Role & scope boundaries, SOPs, tool set, state machine, safety rules, pricing catalog, the **persona slot** (which persona fields exist and which are locked), the hiring SOP. | Persona values (name, age, temperament, bio), avatar, business facts / FAQ / knowledge base, connected channels & accounts, schedule, per-customer directives, remembered lessons, ledger & balance. |
| Lives in | The agent's **code repository** (one Codo project per agent — V13). | **Database rows** keyed by `employment_id` (= tenant). |
| Changed by | Omid, through `/iterate` (a new version). | The employer, through the management channel (an instruction, a top-up, a new channel). |
| Shared across employers? | Yes — same code serves everyone. | Never — strictly isolated per employment. |

So the "empty vessel" you described in V18 is exactly the **Job**, and "the employer fills the vessel" is the **Employment**. The two don't contradict each other; round 2 just treated them as one object.

### 1.2 Two kinds of employee, one engine

| | **In-house employee («کارمندِ اختصاصی»)** | **Rented workforce («نیروی اجاره‌ای»)** |
|---|---|---|
| Employers | Exactly one — the builder. | Many — whoever hires her through the agency. |
| Who builds it | The employer himself (a workshop participant), or the agency *for* that employer. | The agency, once, for the market. |
| Persona & avatar | Chosen during the build (`/persona`, `/avatar`), stored as employment #1. | A **default persona** for the agency's own instance + a **persona slot** that each employer fills during hiring. |
| May touch the employer's private systems? | **Yes** (his gold platform, his ERP, his database) — he is the builder and can grant access. | **No.** Only generic, public-facing tools (messengers, the shared blog, web research). |
| Billing | None (or the participant's own customers pay *him* — a feature of his role, not of the engine). | The agency's ledger: credits, metering, invoices. |
| Example | A gold shop's own "Eitala support" agent with read access to customer balances. | Hanieh, Neda. |

**The boundary rule (the sentence that makes it clear):**
> **If the employee must touch the employer's own systems, she is in-house. If she works only with general-purpose tools, she can be rented.**
> «اگر کارمند باید به سامانهٔ اختصاصیِ کارفرما دست بزند، اختصاصی است؛ اگر فقط با ابزارهای عمومی کار می‌کند، می‌تواند اجاره‌ای باشد.»

Your V9 rule ("Hanieh can't see the customer's gold balance; build your own agent for that") is not a limitation added by hand. It *is* this boundary, and the upsell sits exactly on it. When a rented employee hits a request that needs the employer's private system, that moment is the natural point to suggest an in-house employee (Part 8.3).

### 1.3 Single-tenant is just multi-tenant with N = 1

One engine serves both kinds. Every table, memory namespace, toolset and ledger is keyed by `employment_id` from day one:
- An **in-house** agent has exactly one employment, created during `/wire` from the persona the participant wrote in `/persona`. Billing is switched off.
- A **rented** agent has employment **#0** (the agency's own instance — Hanieh selling Hanieh, Neda writing for the agency's channel) plus one per hiring employer.

This keeps one code path for the workshop and the agency. It costs participants nothing (they never see the word "tenant") and saves the agency a rewrite.

### 1.4 Employment #0: the agency's own instance (V13, V14)

You noticed that the owners of other businesses are just customers of *your* business. So:
- **Hanieh #0** is the agency's own support agent. She represents the agency, explains the support agent to business owners on the agency's humanoid accounts, and walks them into hiring. She has extra tools the other employments don't: accounting and plan lookup (V14). Those are enabled per employment by the harness, never by the model.
- **Neda #0** writes for the agency's own channel and blog about agents, the agency and the workshop (V15).

Note a difference from V5.0: there, the organizer agent haggled over price with hard floors. Here (V4) the agent has **no discount power at all**. Hanieh #0 explains and persuades; the prices come from the catalog. If you want haggling back for the agency instance, it must be a bounded, code-enforced capability (Part 4.4), not a persona trait. **COMMENT**: it was nice for an agent to haggle

### 1.5 What the two rehearsals cover — and what they don't

| Pipeline shape | Neda | Hanieh | Typical participant |
|---|---|---|---|
| Trigger | Clock (`schedule_tick`) | Message (`external_message`) | One of the two |
| Output | Publishes outward (blog + channels) | Replies inside one conversation | One of the two |
| Employment model | Rented | Rented | **Mostly in-house** |

Gap: both rehearsals are rented, while most participants will build in-house. **Recommendation:** build each rehearsal's **v0.1 as employment #0 only, with no hiring and no billing**. That is precisely the in-house path a participant walks. Then add hiring and billing in v0.2. The version order then doubles as rehearsal coverage, and nothing is made smaller: v0.2 is the same product, just later. **COMMENT**: no. I think maybe participants like to rent their agents too.

---

## Part 2 — Pipeline changes (V18, R2, R3)

### 2.1 Persona and avatar at hire time: what `/persona` and `/avatar` become

| Command | In-house | Rented |
|---|---|---|
| `/persona` | The persona (as round 2). Stored as employment #1. | (a) The **default persona** of employment #0; (b) the **persona slot spec**: which fields an employer may set (name, age, bio, tone, temperament, signature), which are **locked by the agency** (honesty rules, red lines, scope boundaries, never claims credentials she doesn't have), validation rules (e.g. a name must not impersonate a real public figure); (c) the **hire-time persona interview** questions. |
| `/avatar` | The avatar (as round 2). | Avatar of employment #0, plus the **hire-time avatar flow**: the employer uploads a picture, *or* the agent generates one from the employment's persona with the image-generation capability (consistent style rules written in `avatar.md`). |

Nothing written in `/persona` is wasted for a rented agent: it defines employment #0 and the template every employer starts from.

### 2.2 A conditional `/hiring` step (rented agents only)

`/role` asks one new question: **in-house or rented?** (with the boundary rule above as the explanation). If rented, a new command `/hiring («استخدام»)` runs between `/avatar` and `/tools`. It writes `docs/living/hiring.md`:
- **The hire flow**: how an employer first meets the agent (employment #0's channels), how they become an employer (binding — §8.4), the free onboarding interview, and activation.
- **The employment fields** (persona slot + business-specific fields: Neda's domain/sources/schedule/channels; Hanieh's business facts/FAQ/accounts).
- **The price catalog** and free allowances (Part 4.6), which `/plan` turns into catalog rows and `/test` into scenarios.
- **Which tools each employment gets** (employment #0 vs. ordinary employments).
**COMMENT**: I think we should add `/hiring` just after `/role`. there we discuss in house vs rented. also we discuss the fields we should ask the employer. after that, comes /persona and /avatar for employment#0
### 2.3 Optional design track — the blog question (V18)

Two different things were mixed in your question:

1. **The blog is a *service the agent uses*, not part of the agent.** Neda publishes *to* a blog the way she publishes *to* a Telegram channel. The blog is agency infrastructure: an off-the-shelf CMS deployed once (§8.2), with its own one-time theme work. Its look is designed once, for all reporters, not inside Neda's pipeline. **No design step in Neda's project.**
2. **An agent may need *its own* screen.** Examples: an Eitaa mini-app storefront (V1 mentions "Bale bot or Eitaa mini-app"), an employer dashboard, a hiring landing page. For those, **yes: reuse V4.1's track as-is** — `/ux` → `/design` → `/prototype`, which already exist and are proven in `private/kandoo/templates/codo/commands/`. `/role` asks "does this employee need a screen of its own?" (default **no**); if yes, the three commands slot in between `/sops` and `/plan`, and `/build` adds the frontend. **COMMENT**: OK. good.

The agency's own catalog/landing site is a plain web product, so it is a **V4.1 Codo project** in its own right, not an agent.

### 2.4 BMAD-inspired additions (R2, R3)

**Pressure-test round («آزمونِ فشار») at the end of `/role`** (from `bmad-forge-idea`). After the role draft settles, Codo writes one extra `NN-questions.md` round containing only the hardest questions, ordered by risk, one theme each, each with «چرا مهم است» and a recommended answer. For the rehearsals, for example:
- Hanieh: *A customer asks for their account balance on the employer's platform, and the employer, in a hurry, says "just tell him." What does she do?* · *A spammer sends 300 messages in an hour; who pays?* · *The manager replies to a customer from his phone; does she reply too?*
- Neda: *Two sources contradict each other on a number; what gets published?* · *The only fresh story in the domain is from a site that forbids reuse?* · *The balance runs out at 10:29 for the 10:30 post?*
**COMMENT**: what about make it a dedicated step as `/edge-cases` or sth?

**Toolsmith interview → our commands** (from `bmod-toolsmith`):

| Toolsmith question | Our command |
|---|---|
| Who is the agent, and what single role does it hold? | `/role` (+ in-house/rented) |
| Who interacts with it? | `/role` actors + `/hiring` |
| What tools/capabilities may it touch? | `/tools` |
| What concrete input→output scenarios define success? | `/sops` + `test-scenarios.md` |

**Three quality lenses, a gate before `/plan`.** Codo writes `docs/versions/<v>/NN-lenses.md`. Every finding must be either fixed in a living doc or explicitly accepted in `docs/decisions.md` before `/plan` may start:
1. **Adversarial**: prompt injection (inside news articles, customer messages, forwarded text), discount extortion, cross-customer and cross-employer extraction, impersonating the employer, making the agent publish to a wrong destination.
2. **Edge-case hunter**: empty or duplicate inputs, Persian/Latin digits, time zones (`Asia/Tehran`), messenger outages, a balance exactly at zero, a re-login in the middle of a SOP.
3. **Verification gap**: every SOP step has an observable result and at least one test scenario. "Writes a good article" is not verifiable; "the article cites ≥ 2 sources, all fetched in this run, all reachable" is.

### 2.5 Updated command list

```
[01] /start      (unchanged — V4.1 parity)
[02] /role       + in-house/rented · + own screen? · + pressure-test round
[03] /persona    in-house: the persona · rented: default persona + persona slot spec
[04] /avatar     in-house: the image · rented: #0 image + hire-time avatar flow
[04b] /hiring    ONLY if rented: hire flow, employment fields, price catalog
[05] /tools      + bridge ladder (§5.1) · + quality lenses (adversarial part)
[06] /sops       + quality lenses (edge cases, verification gap)
[06b] /ux → /design → /prototype   ONLY if the employee has its own screen (V4.1 commands)
[07] /plan       gate: NN-lenses.md resolved
[08] /build  [09] /wire  [10] /test  [11] /deploy  [12] /iterate  [13] /migrate   (as round 2)
```

The progress bar shows the conditional steps only when they are switched on, so an in-house agent without a screen sees exactly round 2's bar.

---

## Part 3 — Runtime: "7 on top of 6" (R8, V4, V16)

### 3.1 Answer: yes, and upstream already covers most of 7

Since round 2, Pydantic AI's current major (V2) organises everything around **capabilities**: reusable bundles of tools, lifecycle hooks, instructions and model settings passed via `capabilities=[...]`. Its official companion package **Pydantic AI Harness** ships 30+ of them. (The name is apt: you already call our code "the harness".) Mapping round 2's planned hand-written `core/` onto them:

| Round 2 planned to write | Upstream replacement | Keep ours? |
|---|---|---|
| `runner.py` (turn loop + gateway client) | `pydantic_ai.Agent` with an OpenAI-compatible provider pointed at the Konkooria multi-provider gateway | No |
| `memory.py` `[narrative]` rolling summary | Harness **Compaction** (model-agnostic: tool-result clearing, sliding window, LLM summarisation, tiered) | No |
| `memory.py` `[plan]` | Harness **Planning** (model-owned plan with a live reminder) | No |
| `memory.py` `[facts]` (written by code, never by the LLM) | A dynamic-instructions capability fed from our DB | **Yes (small)** |
| Employer lessons, editable summary (V7) | Harness **Memory**: a namespaced notebook with `write_memory` / `read_memory` / `search_memory`, Postgres store, compare-and-swap + idempotent writes. **The namespace is resolved by application code, so the model cannot select another user's namespace.** | No |
| `search_history` / `get_messages` | Harness **Conversation Search** (BM25 over stored history) — only if it can be hard-bound to `(employment, peer)`; otherwise our own peer-bound tool (§7.3) | Probably ours |
| Conversation storage | Core `Conversation` serialised into our own table (Pydantic AI deliberately leaves the schema and tenant column to us) | Schema ours |
| `guard.py` secret masking | Harness **Guardrails** (validate/block/redact input, tool calls, tool results, output; secret masking) + our Persian/Arabic digit normaliser as a custom guard | Normaliser ours |
| Spotlighting `<untrusted_data_…>` | Harness **Prompt Injection Defender** (classifies tool results, can withhold high-risk ones) + our spotlight wrapper | Wrapper ours |
| Out-of-LLM approval cards | Core **deferred tools**: `requires_approval=True` / `ApprovalRequiredToolset`; the run ends with `DeferredToolRequests`, our Bale card collects the decision, the next run resumes with `DeferredToolResults` | Bale card adapter ours |
| Rate limits / budgets | Harness **Spend Limits** (USD/token budgets per model *and per tenant*) + our per-peer abuse guard (§7.5) | Abuse guard ours |
| Agentic browser (round 2's `tools/agentic_browser/` port) | Harness **Playwright Browser** and **Browser Use** capabilities | No — drop the port |
| Long multi-step SOP runs surviving restarts | Core **durable execution** (DBOS / Temporal / Prefect / Restate), or Harness **pgtask** / **Absurd** on PostgreSQL | No |
| Web research / images | Core **Web Search**, **Web Fetch**, **Image Generation** capabilities | No |
| MCP (Workshop MCP, GitLab) | Core **`MCPToolset`** | No |

### 3.2 What remains ours: a thin package

Name it `codo-core` (workshop) — the agency uses the very same package. It contains only what no upstream library can know:

1. **Messenger transports**: ingress/egress adapters for Bale bot, Telegram bot + Telethon user session, Rubika bot, Eitaayar, Eitaa user session (`eBot` port). They are adapters, not capabilities: they turn platform events into turns and turn send-intents into platform calls.
2. **Employment (tenancy)**: the employment model, persona slot, per-employment toolset selection (Pydantic AI builds toolsets per run from `RunContext`, so "employment #0 gets accounting" is a dynamic-toolset function).
3. **Lifecycle stance**: round 2's role-neutral state machine as a capability that contributes dynamic instructions (`BASE + LIFECYCLE_STANCE + SOP_STANCE`).
4. **Sealed envelopes** (`inp_` / `env_`): a capability whose hooks resolve `inp_` references just before a tool runs and wrap `env_` outputs after it returns.
5. **Ledger & metering** (Part 4): a plain domain service plus a read-only toolset.
6. **Bale approval-card adapter** for deferred tools.
7. **Abuse guard, human-takeover detector, peer directives** (Part 7).

**Distribution.** One versioned package, not copied code. That way a fix to sealing or the ledger reaches every agent through a version bump, while each agent pins its own version (V16: "shared mechanisms, separate code"). Gitea has a built-in PyPI package registry, so Kandoo can host `codo-core` on `git.<base_domain>` for participants behind the workshop proxy, and the agency installs the same versions.

**Risk to manage.** Pydantic AI Harness is on 0.x releases and says its API may change between minor versions. So: pin exact versions in each agent; wrap Harness capabilities behind `codo-core` names wherever our code depends on them; and keep the `/test` evals (§2.4) as the upgrade gate.

### 3.3 The principle that ties V4, V6 and V9 together

> **The model chooses *what* to say. The harness decides *to whom*, *where*, *what it costs*, and *whether it is allowed*.**

Concretely:
- No customer-facing tool takes a `peer_id`.
- No publishing tool takes a destination; destinations come from the employment's config.
- No tool changes a balance.

The model fills in content and intent. Everything that can leak, misdirect or cost money is fixed by code before the model runs.

### 3.4 Shared mechanisms across agents (V16)

| Mechanism | Where it lives |
|---|---|
| Payments & ledger | `codo-core.billing` |
| Data that must not reach the LLM (sealed inputs/outputs) | `codo-core.sealed` |
| Approval outside the LLM | Pydantic AI deferred tools + `codo-core.bale.approvals` |
| Login relay (phone / OTP / captcha via the management bot) | `codo-core.transports.auth_relay` |
| Cross-referral catalog & lead capture | `codo-core.agency` (§8.3) |

---

## Part 4 — Billing & payments (R9, V2, V3, V4, V11, V12)

### 4.1 Money in: Bale wallet invoices

- Bale bots send a «درخواست پول» with `sendInvoice` using a **wallet `provider_token` from `@botfather`**. The user pays from their Bale wallet; Bale sends `pre_checkout_query` (we validate) and then the successful-payment update (we credit). The money lands **in the bot developer's wallet**: for the agency that is you, and for a participant's own bot it is the participant.
- **Card-to-card invoices have been removed from Bale bots; the wallet is the only official in-bot method now.** Round 2's assumptions still hold, but only through the wallet.
- A test token exists that behaves like the real one without moving money, which is how `/test` exercises payments.
- **Telegram** requires Stars for digital goods, and **Eitaa/Rubika** offer no comparable in-bot payment. So the **management channel for paying employers is Bale** (D3). An employer who meets Hanieh #0 on Telegram is handed over to the Bale management bot to hire and pay. **COMMENT**: no. hanieh is paid via OCR. Neda is paid via bale bot payment. we should rehearse both payment methods. note that hanieh has no bale bot at all. even in bale, its humanoid.
- Card-to-card with modulo-1000 matching stays in V5.0's archival spec for anyone without Bale. An IPG (Zarinpal etc.) is a later option that needs e-Namad. **COMMENT**: they can change their payment method is next versions (e.g. V0.3) so that the agent creates a one time payment link and sends it to the customer/employer.

### 4.2 The ledger

All amounts are integer **Rials** internally (Bale invoices use Rials) and are displayed in Toman.

| Table | Purpose |
|---|---|
| `price_catalog` | Versioned price list per agent: `meter`, `unit_price`, `effective_from`. An employment is billed at the catalog version active when the event happened. |
| `entitlements` | Permanent free allowances: "first channel free", "first account free". |
| `ledger_entries` | **Append-only.** `employment_id`, `kind` (`topup`, `welcome_credit`, `usage`, `hold`, `release`, `admin_adjustment`, `refund`), `amount_rials`, `ref_type`/`ref_id`, `idempotency_key UNIQUE`. The balance is a sum, never a stored number. |
| `invoices` | Every Bale invoice: our `payload` = invoice id, status, Bale charge ids; the successful-payment handler is idempotent on them. |
| `usage_events` | What happened (`post_published`, `channel_added`, `conversation_opened`, …), emitted **by harness code at SOP completion** and priced into `ledger_entries`. |

**Holds.** Before an expensive SOP run (Neda's news cycle), the harness places a hold for its price. It is captured on success and released on failure, so a crash never charges for a post that wasn't published, and two concurrent runs can't overspend.

**Low and zero balance.**
- Below a threshold: a heads-up to the employer with a top-up button.
- Neda at zero: the scheduled run is skipped and the employer gets a quote plus an invoice.
- Hanieh at zero: she must not suddenly go silent to the employer's customers. A small, configurable **grace overdraft** applies, after which she sends a polite holding reply ("a colleague will get back to you"), the employer is alerted, and new conversations are queued.
**COMMENT**: exactly in which step these rules are decided?
### 4.3 What the model may and may not do with money

| Tool given to the model | Behaviour |
|---|---|
| `get_balance_and_usage(period)` | Read-only statement: balance, usage by meter, free allowances left. |
| `quote(plan)` | **Deterministic estimator**: the model passes structured inputs (posts/day, days, channels); code computes the breakdown. The model never does the arithmetic (V3). |
| `issue_topup_invoice(amount_toman)` | Sends a Bale invoice to the *employer* (bounded min/max). Safe: money moves only when the employer pays. |
| *(not given)* discounts, credits, refunds, price changes | Only in the **agency admin bot**, for you (§8.5). This is V4's "the employer can't trick her into a discount", enforced by absence. |

### 4.4 If you ever want negotiation

If an agency instance should be able to offer, say, "10% off a 3-month bundle", that offer is a **catalog bundle**, or a deferred tool whose ceiling is checked in code (round 2's bounded delegation), never a persona trait.

### 4.5 The budget conversation (V3), worked through

Using your Neda numbers and one assumption to confirm (D7: is the extra-channel fee one-time or monthly?):

```
Plan: 2 posts/day × 30 days = 60 posts, 3 channels
Posts:     60 − 3 free  = 57 × 100,000 T = 5,700,000 T
Channels:   3 − 1 free  =  2 × 500,000 T = 1,000,000 T
First month total                         = 6,700,000 T
From month 2: 6,000,000 T (+1,000,000 T only if channel fees are monthly)
Welcome value: 3 posts + 1 channel = 300,000 + 500,000 = 800,000 T   ← matches your «با ۸۰۰ هزار تومن شروع می‌کند»
```

Neda says this in her own voice, from the `quote()` result, and attaches the invoice button.

### 4.6 Pricing proposal (you asked — V12)

**Neda.** Keep your structure; it is simple and maps one-to-one to value:
- 100,000 T per published post (blog article + image + distribution to all connected channels).
- First channel free; 500,000 T per extra channel (D7: one-time or monthly).
- 3 free posts as welcome credit.
- Optional catalog bundles (e.g. 30 or 60 posts/month at a fixed lower unit price) — set by you, never by the agent.

**Hanieh.** Your proposal: a fee per new chat, per message and per new instruction (100k), setup free, first account free. I recommend changing two things:
1. **Drop the per-instruction fee** (or make it free inside a generous quota). Teaching her is what makes her good, so charging for teaching pushes employers to stop teaching, and quality falls. It costs almost nothing to run. It also clashes with V7, where she *should* learn from every correction.
2. **Bill per conversation, not per message.** A *conversation unit* = one customer, a rolling 24-hour window, up to N replies (e.g. 20); beyond N it counts as another unit.
   - Employers can predict it.
   - It caps what a token-burning abuser can cost (V8).
   - Optionally, outcome-aligned: a conversation she escalated and could not answer is not charged.

**Accounts:** first humanoid account free; each extra account a **monthly** fee, since it costs ongoing session upkeep and re-logins.

**How to set the conversation price.** Value-anchored: price it so that a typical small business with C conversations a day pays about half of a junior support operator's monthly salary S:

`P ≈ 0.5 · S / (30 · C)`

For example, with S = 20,000,000 T and C = 30, P ≈ 11,000 T, so a round 10,000 T. **S is an assumption — plug in the current salary.** Floor: P ≥ 3 × the measured cost per conversation; measure it during the rehearsal with Spend Limits' per-tenant tracking before fixing the number.
**COMMENT**: we should find the step that these rules are decided in workshop. Neda and Hanieh are just two rehearsals of the workshop pipeline

---

## Part 5 — Tool bank updates (R1, R4–R7)

### 5.1 The bridge ladder (R1)

For every platform, `/tools` tries these rungs in order and records why each higher rung was rejected:

| Rung | Approach | Cost to the agent | Fragility | Example |
|---|---|---|---|---|
| **0** | Official API | — | Low | Bale/Telegram/Rubika bot APIs, Eitaayar |
| **1** | **The frontend's own private API**, reverse-engineered (DevTools network tab / HAR, then a typed client) | Zero LLM tokens | Medium (silent changes, sometimes encrypted payloads) | `eBot` (Eitaa web's MTProto); Telethon (Telegram's own protocol, R4) |
| **2** | Deterministic UI automation (Playwright selectors) | Zero LLM tokens | High (breaks on redesign) | A portal with server-rendered HTML forms |
| **3** | Agentic browser (Harness Playwright Browser / Browser Use) | LLM calls per task | Self-healing | A one-off site a participant brings |

All four rungs keep round 2's token-issued contract (`auth_request_code` → `auth_verify_otp` → session token, OTP and captcha via the management bot).

Two rules for rung 1:
- **Consent:** the account belongs to the employer, and they explicitly accept the platform risk in `/hiring` or `/tools`.
- **Ban budget:** the opt-in rate limiting from round 2's C17 applies.

### 5.2 Corrected platform matrix

Round 2 said Eitaa and Rubika have no usable official APIs. That is wrong for publishing:

| Need                                     | Bale                                       | Telegram                                                        | Rubika                                                                                   | Eitaa                                                                                                                                                                                        |
| ---------------------------------------- | ------------------------------------------ | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Post to a channel/group                  | Bot as admin (official)                    | Bot as admin (official)                                         | **Bot API v3** as admin (official; `botapi.rubika.ir`, webhooks via `updateBotEndpoint`) | **Eitaayar API** (official; send-only to channels/groups, per-employer token)                                                                                                                |
| DM customers who wrote first             | Bot (official)                             | Bot (official)                                                  | Bot (official)                                                                           | Eitaa "app" messages after the user presses start (official, daily send credit) **COMMENT**: eitaa does not receive the users messages in app. just it can blindly send (text only) messages |
| Act as a humanoid account (Hanieh)       | Unknown — **spike** (rung 1/2 on Bale web) | **Telethon** (rung 1, R4)                                       | Web client — **spike** (community libraries exist)                                       | **`eBot`** (rung 1) — Eitaa says client APIs are not part of its policy, so this is the riskiest                                                                                             |
| Read channel post views (Neda's reports) | Unknown — spike                            | **User session only** (`messages.getMessagesViews`; bots can't) | Unknown — spike                                                                          | Unknown — spike                                                                                                                                                                              |

So **Neda needs no humanoid account to publish**: official bots or Eitaayar cover all four messengers. Only her view reports may need a user session. Hanieh does need humanoid accounts, because customers already message the business's number.

**Adopted as-is:**
- R5: GitLab MCP through `MCPToolset`; GitHub through the Harness capability.
- R6: `trafilatura` + `feedparser` (§6.3).
- R7: MCP catalogs in `/tools`.
---

## Part 6 — Rehearsal 1: Neda Soroushian, reporter («ندا سروشیان، خبرنگار»)

### 6.1 Job

- **Role:** a reporter who covers one domain per employer.
  - Twice a day (employer-set), she finds what's new, researches it, publishes a long article to the shared blog under her byline with an illustrative image, and posts a summary + image + link to each of the employer's channels.
- **Out of scope:** opinion pieces on politics/religion unless the domain is explicitly that; anything outside the employer's domain; replying to channel comments (a later version).
- **Default persona (employment #0):** as you described in V5.
  - 22, BA journalism (University of Tehran), single, third child, patient, phlegmatic.
  - Humanlike, varied refusals.
  - Suggestions in §9.4.

### 6.2 Employment fields (filled at hire time)

| Group | Fields |
|---|---|
| Persona | name, short bio, age, temperament, tone, signature line, avatar |
| Beat | domain/topics, language(s), source allow-list and deny-list, recency window, article length, citation style |
| Schedule | run times (`Asia/Tehran`), days off |
| Channels | per messenger: connection method (bot-as-admin / Eitaayar token as a **sealed input**), channel id, summary format |
| Publishing | **auto-publish** vs **approve each draft** on the management bot (D12) |
| Blog | author profile (name, bio, avatar) on the shared blog |

### 6.3 SOPs

1. **SOP-1 News cycle (`schedule_tick`, durable):**
   1. Discover: RSS feeds of allowed sources + web search in the domain, inside the recency window.
   2. Dedup against this employment's `processed_items`.
   3. Pick one story (newsworthiness score, explained in the run log).
   4. Research: fetch 3–5 sources with `trafilatura`; Firecrawl only for JavaScript-heavy pages.
   5. Cross-check facts; numbers must appear in ≥ 2 sources or be attributed.
   6. Write the article in persona voice, with source links (structured output: title, lead, body, sources, image brief).
   7. Generate the image (illustrative style, §9.3).
   8. Publish to the blog as the employment's author.
   9. Post summary + image + link to each channel from config.
   10. Capture the hold; log.

   Every external write is idempotent per `(post_id, destination)`, so a crash and resume never double-posts.
2. **SOP-2 Employer steering (`employer_message`):** change tone, topic, schedule, sources or channels. Adding a channel first shows its price from `quote()` and asks for confirmation.
3. **SOP-3 Reports:** posts published, blog views (from the blog's own analytics), channel views where the platform allows (§5.2), balance and usage.
4. **SOP-4 Billing:** the budget conversation (§4.5) and top-ups.
5. **SOP-5 Hiring & onboarding (rented, v0.2):** persona interview, channel connection, beat, schedule — free.

### 6.4 Safety specifics

- **Articles are untrusted input.** A poisoned page could try to make her publish something malicious to every employer's channel. Defences:
  - spotlighting + the Harness injection defender on fetched content;
  - output only through the structured article schema;
  - links only to fetched sources;
  - destinations only from config;
  - optional approve-before-publish for each employment's first N posts.
- **Copyright and attribution:** rewrite and cite, never copy; respect sources that forbid reuse (deny-list).
- **Iranian press regulation for news sites: verify with a lawyer** before the shared blog presents itself as a news outlet.

### 6.5 Open questions for you (V2: "you must check with me first")

1. Default sources: which Persian and international outlets/RSS feeds are allowed for employment #0, and is translation from English sources welcome? **COMMENT**: you suggest. yes, translation is welcomed
2. Article length and structure (e.g. 600–900 words, lead + sections + sources)? **COMMENT**: you suggest
3. Summary length per messenger, and whether to use hashtags? **COMMENT**: you suggest
4. What counts as a "view" in reports when a platform doesn't expose it — omit, or estimate? **COMMENT**: omit
**COMMENT**: let's not continue the rehearsals here. we'll do them later. just focus on pipelines. it should be general enough so we can build both rehearsals via the codo/
---

## Part 7 — Rehearsal 2: Hanieh, support agent («هانیه، پشتیبان»)

### 7.1 Job and default persona

- **Role:** chat support on behalf of one business per employment, across the employer's humanoid accounts.
  - Answers from the business facts and knowledge base.
  - Escalates what she can't answer.
  - Never touches the business's own systems (rented — §1.2).
- **Default persona (employment #0):**
  - ~32, married, one 4-year-old daughter, 5 years in support, BA public relations, calm and warm.
  - Temperament: you wavered between phlegmatic and sanguine (D17). Your description ("calm, slow to boil, but warm-blooded") reads as **sanguine with a phlegmatic streak** — and traditional temperament theory does allow a dominant temperament with a secondary one.

### 7.2 Employment fields

| Group | Fields |
|---|---|
| Persona | name (e.g. "Hamideh Zeraatgar" for another business — V14), bio, tone, avatar |
| Business | facts, products/prices (as text, not a live system), hours, policies, things she must never say |
| Knowledge base | FAQ and Q&A entries (grows over time) |
| Accounts | the humanoid accounts per messenger (login via the management bot, sealed session tokens) |
| Escalation | who gets escalations, when, quiet hours |
| Peer directives | "if X writes, do Y" (§7.6) |
| Limits | per-customer daily caps, abuse sensitivity |

### 7.3 Isolation by construction (V6) — and the round 2 hole

Every turn's dependencies are fixed by the harness to `(employment_id, platform, peer_id)` **before** the model runs. Her tools are shaped so that reaching another customer is impossible, not merely forbidden:

| Tool | Bound to | Note |
|---|---|---|
| `send_reply(text, media?)` | current peer | No recipient parameter. |
| `get_my_chat_history(limit, before?)` | current peer | Replaces round 2's `search_history(scope="all_peers")`. |
| `search_knowledge(query)` | current employment's KB | The KB holds only employer-approved content. |
| `escalate_to_employer(question, summary)` | current employment's management chat | Sends a card with a link to the chat where the platform supports it. |
| `end_conversation_politely(reason)` | current peer | The harness mutes the peer and notifies the employer. |
| `remember_about_employer(note)` | employment memory namespace | **Only in employer-channel stances.** A customer can never write into what she "knows about the boss". |
| `propose_faq_entry(q, a)` | employment KB | A **deferred tool**: the employer approves on the management bot. |

**KB hygiene.** When the manager answers a customer and the Q&A is turned into an FAQ entry, Hanieh proposes a **generalised** entry without that customer's name, numbers or details, and the employer approves it. Customer text never enters the KB directly.

### 7.4 Learning from the employer (V7, V8)

- Corrections and scoldings arrive in the employer channel. She writes a lesson to the employment's memory notebook (Harness Memory, namespace resolved by code).
- Durable facts go to the KB, as V8 says: she manages it herself, with the employer's approval for anything customer-visible.
- Lessons are injected into later turns within a bounded budget. The employer can ask "what have you learned about me?" and edit or delete lessons.

### 7.5 Abuse and token-burn defence (V8)

- **Deterministic signals in the harness:** messages per minute/hour/day per peer, repetition, very long inputs, off-topic ratio over the window.
- **Plus a cheap classifier pass** when signals are borderline.
- **When tripped:** she sends a polite, persona-voiced exit ("I have to step away; a colleague will follow up"), the harness mutes the peer for a period, and the employer gets a note with the reason and an "unmute" button.
- **Per-conversation billing (§4.6) caps the cost** of anyone who gets through.

### 7.6 Peer directives, injected by the harness (V8)

- **Storage:** "if Ali Rezaei writes, talk to him this way" is stored as a structured `peer_directives` row (employment, platform, handle/phone), not as free text in the KB.
- **Resolving the target:** when the employer names a person, Hanieh asks for a handle or phone number so the match is exact.
- **Injection:** on every incoming message the harness looks the sender up and, if they match, injects the directive into the stance. This happens deterministically, without the model having to retrieve it — exactly as you described.

### 7.7 Human takeover (V6) and upsell (V9, V17)

- **Takeover:** the manager answers from his own phone in the same account. To the harness that is an **outgoing message the agent didn't send** (multi-device).
  - The thread is marked `human_takeover` and Hanieh stays silent there for a configurable period, so she never double-answers.
  - Afterwards she offers: "I saw you answered *X*; shall I add it to the FAQ?" — a generalised `propose_faq_entry`.
  - The FAQ then grows without the manager having to remember to teach her.
- **Upsell:** when a request needs the employer's private system (gold balance), she:
  1. tells the customer politely that she doesn't have access and that the manager will follow up;
  2. escalates;
  3. in the employer channel, at most once per topic per week, suggests an in-house agent: "build it with the agency, or learn to build it in the workshop".

### 7.8 Open questions for you

1. Should she keep human working hours with human-like reply delays (consistent with the persona), or answer 24/7 instantly (better for customers)? (D18) **COMMENT**: 24/7 with debounce in case the customer is typing.
2. Voice and image messages: understand them in v0.1, or reply "please write it" until v0.3? **COMMENT**: reply "please write it" until v0.3
3. Who may give instructions inside one employment — one manager, or several managers with roles? (D21) **COMMENT**: one manager
**COMMENT**: let's not continue the rehearsals here. we'll do them later. just focus on pipelines. it should be general enough so we can build both rehearsals via the codo/
---

## Part 8 — Agency-level pieces (V1, V13, V15, V16, V17)

### 8.1 Repositories

- One Codo project per agent: `neda`, `hanieh`, … (V13).
- Plus:
  - `codo-core` (the shared package, Part 3);
  - `agency-blog` (infrastructure: CMS compose file, theme, backups); **COMMENT**: this is part of خبرنگار rehearsal project
  - `agency-site` (catalog/landing — a V4.1 web project, if wanted); **COMMENT**: I changed my mind. there will be no agency at all. just refer the employers to https://ble.ir/workshop_ai . there they can find out about next workshop and also they can contact me for building a custom agent for them.
  - the agency admin bot (§8.5). **COMMENT**: no

**Adding a new agent (V1's "process for adding agents"):** run Codo with "rented", then add one entry to the agency catalog (slug, job title, employment #0 persona and avatar, price summary, hire link). Cross-referral and lead capture pick it up automatically.

### 8.2 The shared blog (V2, V15)

| | WordPress | Ghost |
|---|---|---|
| Persian/RTL | Native (`fa_IR`, RTL core) | Limited; depends on the theme (a few themes ship an RTL toggle) |
| Create authors per employment via API | Yes (REST `users` endpoint with an application password) | Staff users are managed by invitation — **verify** whether the Admin API can create them; posts can be attributed to existing authors |
| Post via API | REST `posts`, media upload | Admin API `posts` (HTML or Lexical), image upload |
| Iranian hosting/know-how | Very common | Less common |

**Recommendation: WordPress** for Persian-first readers and per-employment authors. Run a one-day spike to confirm author creation, avatars and media through the API before committing (D9).

- **Structure:** one blog, a category or author page per employment, the agency's posts (Neda #0) on top.
- **Network effect (V15):** each employment's channel links back to its blog posts, and the agency channel aggregates the best of all employments. Inclusion in the agency aggregator is **opt-in per employment**, with the employer's consent, and the agency can unlist content that hurts the shared brand (D10).

### 8.3 Cross-referral and lead capture (V1, V16, V17)

- **Catalog:** `codo-core.agency` gives every agent read access to the agency catalog, so she can introduce colleagues (V16).
- **Lead capture:** a `capture_lead(need, contact)` tool sends the lead to your admin bot. The phone number arrives as a sealed input and never stays in the model context.
- **Role-specific pitches (V17)** live in each agent's SOPs as **upsell moments** with triggers:
  - Hanieh: the "private system" boundary (§7.7).
  - Neda: an employer asks for Twitter/Instagram/their own platform (e.g. Konkooria) → custom reporter.
- **Frequency caps** keep the pitch from feeling like spam (at most once per topic per week per employer; never to the employer's customers unless the employment is #0).
**COMMENT**: we'll write two docs as idea input for our two rehearsal projects. write these upsells into there. 
### 8.4 Becoming an employer (V2: "the procedure I'll describe later")

A placeholder until you describe your procedure:
1. The prospect talks to employment #0.
2. Hanieh #0 / Neda #0 sends a hire link to the agent's Bale management bot (`/start hire_<one-time-token>`).
3. The token binds that Bale user id as the employer of a new employment.
4. Free onboarding interview.
5. Welcome credit.
6. Activation.

### 8.5 The agency admin bot (missing from every round so far)

You need one place, only for you, to:
- see all employments, balances and usage;
- grant credits, discounts and refunds (the only place they exist);
- pause or kill an employment;
- read the lead inbox;
- see escalations that went unanswered;
- watch spend per model.

This is where V4's "no discounts by the agent" becomes operable.
**COMMENT**: I want no admin panel. the codo should have the ability to do admin jobs via the MCP. so a participant just writes "/admin how many employments so far" and codo uses MCP to read the DB and answers.
### 8.6 Hosting topology — needs a decision (D14)

The agency is production, not Kandoo staging (staging seats expire after 5 days). It must reach **Iranian messengers** (Eitaa/Rubika/Bale; some services may restrict foreign IPs — **verify per platform**) **and** foreign LLM providers (which restrict Iranian IPs).

Two shapes:
- **(a) Iran-hosted app + LLM calls through the Konkooria multi-provider gateway** — you already run it. **Recommended.**
- **(b) Abroad-hosted app + an Iranian egress proxy for messengers.**
**COMMENT**: they are just two rehearsals. I'll migrate them into k8s after they proved themselves.
---

## Part 9 — Honest pushback (V11: "don't censor yourself")

### 9.1 "Pretend to be human" works against the agency's own goal

The agency exists so that people **see what agents can do** and then come to the workshop (V1). If Neda and Hanieh pass as humans, nobody learns that an agent did the work, and the showcase demonstrates nothing.

There is also a trust risk: a customer who later finds out that "Hanieh with the 4-year-old daughter" was invented feels deceived, and that sticks to the employer's brand. Some jurisdictions already require bots to disclose themselves; Iran's position is unclear to me.

**Recommendation — human voice, honest identity («لحنِ انسانی، هویتِ صادق»):**
- Keep everything you described about tone: warm, varied, never robotic, never "I am a language model programmed to…".
- But if someone **sincerely asks** whether they're talking to a person, she doesn't deny it. She answers in persona style, e.g. "I'm this business's smart assistant…".
- Personal biography details (marriage, child) shape her *voice*; she doesn't volunteer them as factual claims to customers.
- Employment #0 (the agency's own instances) is openly an agent — that *is* the advertisement.
- Other employers may choose (within that floor) how much to disclose (D5).
**COMMENT**: agreed
### 9.2 Hardship lines as refusal scripts

"I'm just a worker trying to cover my rent" is a lovely human touch once, but as a *scripted deflection* for discount requests it is an invented sob story told to paying customers. Keep the warmth and the variety; drop fabricated hardship. **COMMENT**: I'm just a worker trying to cover **my master's** rent

### 9.3 AI news images

Photo-realistic AI images next to real news can be mistaken for photos of the event. Recommendation:
- an illustrative or editorial style (no photo-real depictions of real people or events);
- a small «تصویر تزئینی» label (D11).
**COMMENT**: OK
### 9.4 Persona details

- **"Hanieh Poshtiban" («هانیه پشتیبان»):** the surname is her job title, so it reads as fake the moment a customer sees it. That is fine if the agency is open about agents (9.1), not if you want her to feel real. A natural alternative with the same meaning: «هانیه یاوری». **COMMENT**: OK
- **"Soroushian" («سروشیان»):** nice etymology, but Soroush is also a well-known Iranian messenger app, so readers may associate it with that. **COMMENT**: what alternative?
- **Neda at 22, fresh from her BA, publishing analytical articles under her byline:** this undercuts credibility. A 26–28-year-old with 3–4 years at a newsroom keeps the youth and gains authority (D17). **COMMENT**: agreed.

### 9.5 Humanoid accounts carry platform risk for the employer

Automating a personal account on Eitaa (whose policy doesn't offer client APIs) or Telegram can get **the employer's own number** limited or banned, and that number is also his personal or business line.

`/hiring` must:
- state this plainly;
- recommend a dedicated SIM;
- offer the official-bot alternative where it suffices (Bale/Telegram/Rubika bots can serve customers who start the bot).
**COMMENT**: agreed
### 9.6 These rehearsals are products, not workshop exercises

At full scope (multi-employment, billing, four messengers, blog, images, KB, abuse defence), each is many `/iterate` versions. That is fine — you said time isn't the constraint. But don't read slow progress on them as a sign the workshop pipeline is too slow: a participant's in-house agent is the v0.1 slice (§1.5).

---

## Part 10 — Errata to round 2

| # | Round 2 said | Correction |
|---|---|---|
| **E1** | `search_history(scope="all_peers")` as the default memory tool | Remove for customer-facing agents; peer-bound tools only (§7.3). Cross-peer search exists only in the employer stance, and only over *summaries* the employer is entitled to. |
| **E2** | Eitaa and Rubika have no usable official APIs | Rubika has an official Bot API v3; Eitaa has the Eitaayar send API and in-app "برنامه" messages (§5.2). |
| **E3** | Port `@playwright/mcp` / browser-use into `tools/agentic_browser/` | Use Harness Playwright Browser / Browser Use (§3.1). |
| **E4** | Hand-write `runner`, memory, guard, approvals, budgets | Use Pydantic AI V2 + Harness; keep only `codo-core`'s list (§3.2). |
| **E5** | "Featherweight", "zero tokens", cheapest default model as decision drivers | Workshop arguments only. Agency agents choose models and approaches on quality (V1). |
| **E6** | Mode A: "the bot engine executes the approved action without the LLM" | Same guarantee, standard mechanism: a deferred tool resumed with `DeferredToolResults`. The tool function runs in code with the approved arguments; the model can't alter them. |
| **E7** | Bale native payments as in V5.0 | Still right, but wallet only: card-to-card invoices were removed from Bale bots (§4.1). |
| **E8** | Channel view counts as a generic tool | Telegram views need a user session (`messages.getMessagesViews`); the other three are unknown and need spikes (§5.2). |

---

## Part 11 — Decisions needed from you

| #       | Decision                                                  | Options                                                                                                                                                                                                       | Recommendation                                                                                                                                                                                         |
| ------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **D1**  | The agency's name                                         | «خدمه» / «آژانس …» / other                                                                                                                                                                                    | Your call; it also names the blog and channel.                                                                                                                                                         |
| **D2**  | The mental model                                          | Job + Employment; in-house vs. rented; the boundary rule (§1.1–1.3)                                                                                                                                           | Accept as written.                                                                                                                                                                                     |
| **D3**  | Management/payment channel                                | Bale only / Bale + others                                                                                                                                                                                     | **Bale only** for management and payment; meet prospects on all four (§4.1).                                                                                                                           |
| **D4**  | Management bot identity when personas differ per employer | (a) one neutral product bot per agent (e.g. «میزِ کارِ پشتیبان»), messages signed with the employment's persona name · (b) employer brings his own bot token (white-label) · (c) (a) by default, (b) optional | **(c)**                                                                                                                                                                                                |
| **D5**  | Disclosure                                                | (a) full pretence · (b) human voice, never deny when sincerely asked · (c) explicit disclosure                                                                                                                | **(b)** as the floor; #0 openly an agent (§9.1).                                                                                                                                                       |
| **D6**  | Ledger scope                                              | Per agent / one agency-wide wallet per employer                                                                                                                                                               | **One agency-wide wallet** if employers will hire more than one agent (better UX, simpler cross-selling); per agent if you want strict independence. Your call — the interface is the same either way. |
| **D7**  | Neda pricing                                              | Extra channel one-time or monthly; bundles yes/no                                                                                                                                                             | Monthly for extra channels; bundles yes.                                                                                                                                                               |
| **D8**  | Hanieh pricing                                            | Your model (per chat + per message + per instruction) / per-conversation units, instructions free, extra accounts monthly                                                                                     | **Per-conversation** (§4.6).                                                                                                                                                                           |
| **D9**  | Blog engine                                               | WordPress / Ghost / other                                                                                                                                                                                     | **WordPress**, after a one-day API spike (§8.2). **COMMENT**: only if it has an API                                                                                                                    |
| **D10** | Shared blog & aggregator                                  | Opt-in per employment; agency may unlist                                                                                                                                                                      | Yes.                                                                                                                                                                                                   |
| **D11** | News images                                               | Photo-real / illustrative + labelled                                                                                                                                                                          | **Illustrative + labelled.**                                                                                                                                                                           |
| **D12** | Neda publish mode default                                 | Auto / approve each draft / approve the first N                                                                                                                                                               | **Approve the first 5, then auto** (employer can change it).                                                                                                                                           |
| **D13** | Neda's default sources & article format                   | —                                                                                                                                                                                                             | Your list (§6.5).                                                                                                                                                                                      |
| **D14** | Hosting                                                   | (a) Iran + Konkooria gateway · (b) abroad + Iranian egress                                                                                                                                                    | **(a)**, after per-platform reachability checks.                                                                                                                                                       |
| **D15** | Shared code distribution                                  | `codo-core` package (Gitea PyPI) / copied template                                                                                                                                                            | **Package.** **COMMENT**: codo/ is just a template. it may fetch the codo core package from gitea                                                                                                      |
| **D16** | Durable engine for SOP runs                               | DBOS / Temporal / pgtask                                                                                                                                                                                      | **DBOS** (Postgres-only, no extra server, co-maintained integration).                                                                                                                                  |
| **D17** | Persona tweaks                                            | Hanieh's surname & temperament; Neda's age                                                                                                                                                                    | §9.4 and §7.1.                                                                                                                                                                                         |
| **D18** | Hanieh's hours                                            | Human hours + delays / 24/7 instant / 24/7 with small human-like delays                                                                                                                                       | **24/7 with small delays**; optional quiet hours per employer.                                                                                                                                         |
| **D19** | Version slicing                                           | v0.1 = employment #0 only, no billing; v0.2 = hiring + billing; v0.3 = remaining messengers + views; v0.4 = voice/image                                                                                       | Accept (§1.5).                                                                                                                                                                                         |
| **D20** | Becoming an employer                                      | Your procedure / the placeholder in §8.4                                                                                                                                                                      | Waiting for your description.                                                                                                                                                                          |
| **D21** | Managers per employment                                   | One / several with roles                                                                                                                                                                                      | One in v0.2; several later.                                                                                                                                                                            |
