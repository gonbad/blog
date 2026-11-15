# V6.0 — Round 5: The Four-Plane Agent Model, the Open Hiring Protocol (`/hiring/mcp`), Marketplace Economics, and the Four-Rehearsal Execution Loop

> **Inputs:**
> - Your 5 new voice notes in [09-transcription.md](09-transcription.md) (recorded 2026-10-18, 12:45 → 15:00)[cite: 1].
> - Your rehearsal idea inputs in [07-idea-input-neda.md](07-idea-input-neda.md)[cite: 3] and [08-idea-input-hanieh.md](08-idea-input-hanieh.md)[cite: 2].
> - Baseline pipeline architecture from [06-analysis-round4.md](06-analysis-round4.md)[cite: 4], [05-analysis-round3.md](05-analysis-round3.md)[cite: 5], and [03-analysis-round2.md](03-analysis-round2.md)[cite: 7].

> **Read of the day.**
> 1. **The "Agent Agency" returns — not as hard-coded Codo/Kandoo infrastructure, but as Rehearsal #4 (an In-House Agent built with Codo itself)**[cite: 1]. Codo and Kandoo remain completely general[cite: 1, 4]. What goes into Codo and `codo-core` is an **open, standard Hiring & Usage Protocol** so that *any* rented agent built in the workshop can be hired either **directly** or **through one or more Agencies** (Cafe Bazaar / Job Agency model)[cite: 1].
> 2. **Every agent now has a clean 4-Plane Domain Model** covering all parties (Owner, Employer, End-User, and Agency Broker) and their interfaces[cite: 1]:
>    - **Plane 1 — Owner Plane (`/admin/mcp`)**: Always present (1 interface)[cite: 1, 4].
>    - **Plane 2 — Hiring Plane (Direct `#0` Chat + `/hiring/mcp`)**: Present **only on Rented agents**; omitted on In-House agents[cite: 1]. **COMMENT**: I think we should drop /persona and /avatar and let hiring mcp do the hiring for #0 and in house employments. of course the fields should be declared earlier in /hiring step. what do you say?
>    - **Plane 3 — Employer Management Plane (`ManagementChannel`)**: Present on every employment[cite: 1, 4].
>    - **Plane 4 — End-User Work Plane (Messengers / Web Companion / `/work/mcp`)**: Role-dependent, now including an agent-to-agent `/work/mcp` interface so a user's personal general-purpose assistant can invoke the agent headlessly[cite: 1].
> 3. **Protocol Verdict — Streamable HTTP MCP + A2A Agent Card:** We use **MCP** (`/hiring/mcp` and `/work/mcp`) for deterministic operations (inspecting manifests, quoting prices, creating employments, relaying sealed tokens/OTPs, and crediting ledgers) paired with a standard `/.well-known/agent.json` discovery card and a single A2A-style conversational tool (`ask_presales_question`)[cite: 1, 4, 5].
> 4. **Business Development Verdict — Dual-Path Billing + Prepaid Owner Wallet:** Employers can hire and pay an agent **directly** (0% agency fee) or **via an Agency**[cite: 1]. For the Agency's revenue model, your **Prepaid Owner Credit Wallet («شارژ حساب صاحب ایجنت نزد آژانس»)** is combined with a **Conversion-Triggered CPA / Revenue-Share Deduction** so developers never get drained by fake/unpaid clicks while keeping you out of complex multi-party bank escrow settlements[cite: 1].
> 5. **Four Rehearsals (3 Rented + 1 In-House) & a Dual-Workspace Feedback Loop:** Adding the **Event Registration Agent** (rented, used for real V6.0 workshop sign-ups) and the **Agent Agency** (in-house) alongside **Neda** (rented) and **Hanieh** (rented) exercises 100% of the pipeline[cite: 1, 2, 3].

---

## Part 0 — Master Reconciliation of `09-transcription.md`

| # | Timestamp in `09` | Your Point / Question | Architectural Resolution in Round 5 | Section |
|---|---|---|---|---|
| **N1** | 12:45 | An agent has 3 sides: **Owner** («صاحب ایجنت»), **Employer** («استخدام‌کننده»), and **End-User** («کاربر انتهایی»); Owner uses Admin MCP, what about an MCP for the Employer / Hiring side?[cite: 1] | Formalized into the **4-Party, 4-Plane Agent Model** (`Admin MCP`, `Hiring MCP`, `Management Channel`, and `Work Plane`)[cite: 1, 4]. | **Part 1** |
| **N2** | 13:03 (1) | Build the **Agent Agency («آژانس ایجنت‌ها»)** as a rehearsal project using the Codo protocol, modeled like a job agency or Cafe Bazaar / Google Play[cite: 1]. | The Agency is **Rehearsal #4** — an in-house Codo agent whose tools consume other agents' `/hiring/mcp` endpoints[cite: 1]. | **Part 1, Part 6** |
| **N3** | 13:03 (1) | Two user groups of the Agency: (1) **Agent Owners** listing Codo-built agents, (2) **Employers** asking what agents can/cannot do, checking prices, and hiring/installing them[cite: 1]. | The Agency Agent has two SOP tracks: **Developer Listing & Credit SOPs** and **Employer Discovery, Hiring & Wiring SOPs**[cite: 1]. | **Part 6** |
| **N4** | 13:03 (1) | **Hire-time wiring («وصلی‌های زمان استخدام»):** connecting a Bale bot (user brings token via BotFather guide, or gives account for automated creation) or connecting a humanoid account[cite: 1]. | Standardized in `/hiring/mcp` via `wire_bot_token` and `auth_relay_start` / `auth_relay_verify` using Sealed Inputs (`inp_`)[cite: 1, 7]. | **Part 2.4** |
| **N5** | 13:03 (2) | Rented agents expose two MCPs: **Admin MCP** (for Owner in Codo) and **Hiring MCP / A2A** (for Agencies to inspect, hire, and configure)[cite: 1]. | Every rented agent mounts both `/admin/mcp` and `/hiring/mcp` (+ `/.well-known/agent.json`)[cite: 1, 4]. | **Part 2** |
| **N6** | 13:03 (2) | When a developer submits an agent URL to the Agency, the Agency inspects it via MCP/A2A and saves it as **`unverified` («تأیید نشده»)** (installable via deep link only, not promoted) until the Agency Owner approves it via the Agency's Admin MCP[cite: 1]. | Built into the Agency rehearsal's data model (`status: unverified | approved | suspended`) and its `/admin/mcp` (`approve_listed_agent`)[cite: 1]. | **Part 6.2** |
| **N7** | 13:03 (2) | The Agency Agent itself is **non-rentable / in-house («غیر اجاره‌ای»)** with only 1 employment (yours); therefore it has **no Hiring MCP/A2A** and is set up via Admin MCP / build time[cite: 1]. | `/hiring` branches cleanly: `is_rented = False` disables `/hiring/mcp` and configures Employment `#0` once via `/wire` and `/admin/mcp`[cite: 1, 4]. | **Part 1.3, Part 4** |
| **N8** | 13:09 | **4 Rehearsals:** (1) Agency (in-house), (2) Support / Hanieh (rented), (3) Reporter / Neda (rented), (4) **Event Registration / Organizer** (rented — also used for the V6.0 workshop's own sign-ups)[cite: 1, 2, 3]. | All 4 rehearsals mapped; ideas and pipeline coverage matrix defined[cite: 1, 2, 3]. | **Part 5, Part 6** |
| **N9** | 13:09 | **End-user interface for personal AI assistants:** Some agents have no bot/web UI for end-users and are instead called by a user's **personal general-purpose agent** via a **Work/Usage MCP or A2A**[cite: 1]. | Added **Plane 4C (`/work/mcp`)** as a first-class end-user transport option in `/role` and `/tools`[cite: 1, 4]. | **Part 1.2, Part 2.5** |
| **N10** | 13:09 | Clearly separate what goes into **(1) Protocol**, **(2) Codo & Kandoo**, and **(3) the 4 Rehearsals**, and define the **step-by-step workflow** for running the rehearsals and feeding fixes back into the workshop repo[cite: 1]. | Detailed boundary matrix in **Part 4** and the **Dual-Workspace Rehearsal Loop** in **Part 7**. | **Part 4, Part 7** |
| **N11** | 15:00 | **Business Developer analysis:** Direct hiring vs. Agency hiring; how Employer top-ups work in each path; who pays the commission (Employer vs. Agent Owner via a prepaid Agency balance that pauses promotion when empty)[cite: 1]. | Full BD comparison and the **Hybrid Conversion-Backed Owner Wallet + Optional Agency Checkout** model[cite: 1]. | **Part 3** |

---

## Part 1 — The Domain Model: Parties, Analogies, and the 4 Planes of an Agent (`N1`, `N2`, `N7`, `N9`)

### 1.1 Real-World Analogies: Job Placement Agency + Cafe Bazaar / Google Play

To keep the mental model intuitive for both us and workshop participants, we combine the two analogies you named in `09-transcription.md`[cite: 1]:

| Real-World Concept | In Cafe Bazaar / Google Play | In a Job Placement Agency («کاریابی») | In Our Agent Ecosystem |
|---|---|---|---|
| **Creator / Supplier** | App Developer[cite: 1] | Training Institute / Specifier[cite: 1] | **Agent Owner («صاحب / توسعه‌دهندهٔ ایجنت»)** — builds and hosts the agent via Codo[cite: 1, 4]. |
| **The Product / Workforce** | Android `.apk` Package[cite: 1] | Skilled Specialist Candidate[cite: 1] | **The Job («شغل»)** — the running agent codebase and its capabilities[cite: 4, 5]. |
| **Installation / Hiring** | Installing the app on a phone[cite: 1] | Signing an employment contract & onboarding[cite: 1] | **An Employment («استخدام»)** — an isolated tenant row (`employment_id`) wired to the Employer's channels/accounts[cite: 1, 5]. |
| **Buyer / Manager** | Phone Owner | **Employer («کارفرما / استخدام‌کننده»)**[cite: 1] | **Employer («استخدام‌کننده / کارفرما»)** — hires, configures, and pays for the employment[cite: 1, 4]. |
| **End-User** | App User (if B2B2C) | The Employer's Customers («مشتریانِ کارفرما»)[cite: 1, 2] | **End-User («کاربر انتهایی»)** — customers chatting with Hanieh, readers of Neda's blog/channels, or registrants talking to the Event agent[cite: 1, 2, 3]. |
| **Intermediary Store** | Cafe Bazaar / Play Store[cite: 1] | Job Placement Agency («آژانس کاریابی»)[cite: 1] | **Agency Agent («ایجنتِ آژانس»)** — lists agents, answers presales questions, facilitates hiring & wiring, and takes a commission[cite: 1]. |
| **Direct Distribution** | Sideloading APK from developer's website | Direct hiring without a broker[cite: 1] | **Direct Hiring via Employment `#0` ("Front Desk")** — 0% agency commission[cite: 1, 4]. |

---

### 1.2 The 4 Parties and Their Interfaces on Every Agent (`N1`, `N5`, `N9`)

In Voice 5 (`15:00`), you asked: *"What parties does each agent have, what interfaces does each party have, and does each party have one interface or more than one interface?"*[cite: 1]

Here is the complete topology. Every Codo agent is structured around **Four Planes (Ports)**:

```
                           ┌─────────────────────────────────────────┐
                           │         1. AGENT OWNER (صاحب)           │
                           │    (Runs Codo on Laptop / Terminal)     │
                           └────────────────────┬────────────────────┘
                                                │
                                   [Plane 1: /admin/mcp] (Always 1)
                                                │
                                                ▼
┌──────────────────────────┐     ┌───────────────────────────────────┐     ┌──────────────────────────┐
│  4. AGENCY BROKER AGENT  │     │                                   │     │  2. EMPLOYER (کارفرما)   │
│     (ایجنت آژانس)        │     │         CODO AGENT RUNTIME        │     │  (Business / Manager)    │
│                          │     │         (`codo-core` app)         │     │                          │
│ • Catalog & Presales     ├────►│ • Plane 1: Owner Admin (/admin)   │◄────┤ • Direct Hire (via #0)   │
│ • Agency Hire & Wiring   │     │ • Plane 2: Hiring (ONLY if Rented)│     │ • Ongoing Steering &     │
│ • Agency Billing Split   │     │   ├─ 2A: #0 Front-Desk Chat       │     │   Approvals (via Mgmt    │
└──────────────────────────┘     │   └─ 2B: /hiring/mcp + agent.json │     │   Channel: Bot/Humanoid) │
  (Calls Plane 2B: /hiring/mcp)  │ • Plane 3: Management Channel     │     └──────────────────────────┘
                                 │ • Plane 4: End-User Work Plane    │
                                 └─────────────────┬─────────────────┘
                                                   │
                        ┌──────────────────────────┼──────────────────────────┐
                        │                          │                          │
                        ▼                          ▼                          ▼
             [Plane 4A: Messengers]     [Plane 4B: Companion UI]    [Plane 4C: /work/mcp]
             (Bale/Telegram/Rubika      (WordPress Blog, Eitaa      (For End-User's Personal
              Bots or Humanoid SIMs)     Mini-App, Web Portal)       General-Purpose Agent!)
                        │                          │                          │
                        └──────────────────────────┼──────────────────────────┘
                                                   ▼
                                 ┌───────────────────────────────────┐
                                 │   3. END-USERS (کاربران انتهایی)  │
                                 │ (Customers, Readers, Registrants, │
                                 │   or Personal AI Assistants)      │
                                 └───────────────────────────────────┘
```

#### Summary Table: How Many Interfaces Does Each Party Have?

| Party («طرف») | Exists in In-House? | Exists in Rented? | Number of Interfaces & What They Are |
|---|---|---|---|
| **1. Owner («صاحب ایجنت»)** | **Yes**[cite: 1] | **Yes**[cite: 1] | **1 Interface** for administration: **`/admin/mcp`** (used by Codo's `/admin` command)[cite: 1, 4]. *(Note: For Employment `#0`, the Owner is also Employer `#0` and therefore also has `#0`'s Management Channel)[cite: 4].* |
| **2. Prospective Employer — Hiring («متقاضی استخدام»)** | **No** *(Owner = sole Employer)*[cite: 1, 4] | **Yes**[cite: 1] | **2 Interfaces (Direct + Brokered)**[cite: 1]:<br/>• **Interface 2A (Direct Human Chat):** Employment `#0`'s management channel (e.g., talking to Neda `#0`'s bot or Hanieh `#0`'s humanoid account)[cite: 4, 5].<br/>• **Interface 2B (Agency / Broker API):** **`/hiring/mcp`** + `/.well-known/agent.json`, allowing *any* Agency Agent to inspect, quote, hire, wire, and top up on the Employer's behalf[cite: 1]. |
| **3. Active Employer — Management («کارفرمای فعلی»)** | **Yes** (`#0` only)[cite: 1, 4] | **Yes** (`#0..#N`)[cite: 1, 4] | **1 Primary Interface per Employment + 1 Delegated Interface**[cite: 1, 4]:<br/>• **Interface 3A (Direct Management Channel):** The bot or humanoid chat configured in `/hiring` (for daily commands, approvals, escalations, and direct top-ups)[cite: 4].<br/>• **Interface 3B (Via `/hiring/mcp`):** If hired through an Agency, the Employer can also ask the Agency to update their employment fields or top up their balance through `/hiring/mcp`[cite: 1]. |
| **4. End-User («کاربر انتهایی»)** | **Optional** (role-dependent)[cite: 1] | **Optional** (role-dependent)[cite: 1] | **0, 1, or Multiple Interfaces** (chosen in `/role` and `/tools`)[cite: 1, 4]:<br/>• **4A:** Messenger bots (`bale_bot`, `telegram_bot`, `rubika_bot`)[cite: 5, 7]<br/>• **4B:** Humanoid accounts (`bale_user`, `telegram_user`, `eitaa_client`)[cite: 2, 7]<br/>• **4C:** Companion web UI (`WordPress`, mini-app)[cite: 4, 5]<br/>• **4D:** **`/work/mcp`** (so an end-user's personal general-purpose AI assistant can interact with this agent programmatically!)[cite: 1]. |

---

### 1.3 In-House vs. Rented: The Exact Structural Difference (`N7`, `N8`)

Your insight in Voice 3 (`13:03`) about the Agency Agent itself resolves the symmetry between in-house and rented agents[cite: 1]:

| Dimension | In-House Agent («ایجنت غیر اجاره‌ای / اختصاصی») | Rented Agent («ایجنت اجاره‌ای») |
|---|---|---|
| **Who can hire it?** | Only the Owner (`employment #0`), installed once per environment (dev / staging / prod)[cite: 1]. | Anyone (via `#0` Direct Chat or via an Agency over `/hiring/mcp`)[cite: 1, 4]. |
| **Examples in our 4 Rehearsals** | **Rehearsal #4: The Agent Agency (`agent-agency`)**[cite: 1]. | **Rehearsal #1: Neda (Reporter)**, **Rehearsal #2: Hanieh (Support)**, **Rehearsal #3: Event Organizer**[cite: 1, 2, 3]. |
| **Does it expose `/hiring/mcp`?** | **No** (`is_rented = False`)[cite: 1]. | **Yes** (`is_rented = True`)[cite: 1]. |
| **Does it have Employer Billing / Ledger?** | **No** (Owner = Employer; paying yourself has no meaning)[cite: 1]. *(Note: It may still collect money from End-Users or Agent Owners if that is its job, like a shop agent or the Agency itself!)*[cite: 1, 4]. | **Yes** (Employer ledger, meters, holds, price catalog, haggling band)[cite: 1, 4]. |
| **How is Employment `#0` set up?** | During `/wire` (and `/admin/mcp`), reading secrets/config directly[cite: 1, 4]. | During `/wire` for `#0`; subsequent employments `#1..#N` are created dynamically at runtime by the `HireService`[cite: 1, 4]. |

---

## Part 2 — Protocol Architecture: MCP vs. A2A for Hiring & End-User Work (`N4`, `N5`, `N9`)

### 2.1 Answering Your Question: Should We Use MCP or A2A? (`N5`)

In `09-transcription.md`, you weighed **MCP** against **A2A (Agent2Agent)** for the Hiring interface and the End-User agent-to-agent interface[cite: 1]. Here is the side-by-side engineering evaluation:

| Requirement | Pure A2A (Conversational Task Passing) | Pure MCP (Typed Tools & Resources) | **Recommended Hybrid: Streamable HTTP MCP + Agent Card + `ask_agent` Tool** |
|---|---|---|---|
| **Discovering what the agent does, its fields, and exact pricing** | Uses `/.well-known/agent.json` (great for discovery), but pricing & field schemas are unstructured text. | Exposes `agent://manifest` resource + `get_manifest()` tool with strict JSON Schema. | **Both:** serves `GET /.well-known/agent.json` AND MCP `get_manifest()` from the exact same Pydantic model. |
| **Executing Hire, Configuration, Token Wiring, and Billing** | **Dangerous in pure A2A:** Two LLMs chatting in natural language can hallucinate prices, corrupt configuration JSON, or leak bot tokens into chat logs. | **100% Deterministic:** Typed RPC calls (`create_employment`, `set_fields`, `wire_channel`, `credit_ledger`) validated by Pydantic and Sealed Envelopes. | **Handled via MCP typed tools** — zero LLM hallucination in financial or wiring steps. |
| **Answering nuanced presales questions from a prospect** ("Can Neda summarize PDF reports too?") | **Natural fit:** Agency delegates the question to the target agent's LLM. | Needs a tool wrapper to invoke the agent's LLM. | **Included as one MCP tool:** `ask_presales_question(question)` wakes Employment `#0` in presales stance and returns the answer![cite: 1] |
| **Implementation cost in `codo-core`** | Requires adding a second protocol server & client library alongside MCP. | **Zero extra stack:** `codo-core` already runs FastAPI Streamable HTTP MCP for `/admin/mcp`[cite: 4] and Pydantic AI V2 natively consumes MCP via `MCPToolset`[cite: 5]. | **100% unified stack** — one MCP server router in `codo-core`, consumed by `MCPToolset`. |

**Verdict:** Every Codo agent uses **Streamable HTTP MCP** as its wire protocol (`/admin/mcp`, `/hiring/mcp`, and optional `/work/mcp`), supplemented by `GET /.well-known/agent.json` for public metadata discovery and one conversational delegation tool (`ask_presales_question` on `/hiring/mcp`, `ask_agent` on `/work/mcp`).

---

### 2.2 The Standard Discovery Manifest (`/.well-known/agent.json` & `hiring.get_manifest`)

Every rented agent automatically generates and serves this manifest from its `docs/living/role.md`, `hiring.md`, `persona.md`, and `tools.md` specifications[cite: 1, 4]:

```json
{
  "protocol_version": "codo-hiring/1.0",
  "slug": "neda-reporter",
  "job_title_fa": "خبرنگار و تولیدکنندهٔ محتوا",
  "is_rented": true,
  "default_persona": {
    "name_fa": "ندا نویدی",
    "age": 27,
    "summary_fa": "روزنامه‌نگار دقیق، وقت‌شناس و کوتاه‌نویس",
    "avatar_url": "https://neda.<domain>/assets/avatar.png"
  },
  "capabilities": {
    "duties_fa": [
      "پایش روزانهٔ منابع خبری و RSS در حوزهٔ کارفرما",
      "نگارش مقالهٔ تحلیلی با تصویر تزئینی در وبلاگ",
      "انتشار خلاصه و لینک در کانال‌های بله، تلگرام، ایتا و روبیکا"
    ],
    "out_of_scope_fa": [
      "انتشار خبر بدون منبع معتبر",
      "پاسخ‌گویی به کامنت‌های کاربران یا مدیریت پیج اینستاگرام"
    ],
    "referral_target": "[https://ble.ir/workshop_ai](https://ble.ir/workshop_ai)"
  },
  "wiring_requirements": [
    {
      "slot": "publishing_channels",
      "kind": "channel_admin_or_token",
      "platforms": ["bale_channel", "telegram_channel", "rubika_channel", "eitaayar_token"],
      "min_count": 1,
      "instructions_fa": "ربات را ادمین کانال کنید یا توکن ایتایار بدهید."
    }
  ],
  "employment_fields_schema": {
    "type": "object",
    "required": ["domain_topic", "schedule_times"],
    "properties": {
      "persona_name": { "type": "string", "default": "ندا نویدی" },
      "domain_topic": { "type": "string", "description": "حوزهٔ خبری کارفرما" },
      "rss_sources": { "type": "array", "items": { "type": "string" } },
      "schedule_times": { "type": "array", "items": { "type": "string" }, "default": ["09:00"] }
    }
  },
  "commercial_model": {
    "currency": "IRR",
    "binding_trigger": "acceptance",
    "welcome_credit_rials": 3000000,
    "meters": [
      { "id": "scheduled_run", "title_fa": "گزارش روزانه", "unit_price_rials": 1000000 },
      { "id": "monthly_sub", "title_fa": "اشتراک ماهانه", "unit_price_rials": 30000000 }
    ],
    "negotiation_band": { "floor_percent": 70, "max_concessions": 2, "offer_ttl_hours": 24 },
    "native_payment_methods": ["bale_wallet"]
  }
}
```

---

### 2.3 The Standard Tools on `/hiring/mcp` (`N3`, `N4`, `N5`)

When an Agency Agent (or any authorized broker) connects to a rented agent's `https://<agent-domain>/hiring/mcp`, it gets the following standard toolset built into `codo-core.hiring_mcp`[cite: 1]:

| Tool Name | Purpose | Security & Determinism |
|---|---|---|
| `get_manifest()` | Returns the complete JSON manifest above (capabilities, boundaries, required wiring, employment fields schema, pricing)[cite: 1]. | Read-only, deterministic. |
| `ask_presales_question(question, prospect_context?)` | Wakes the target agent's LLM in a read-only `PRESALES` stance to answer detailed questions about what the agent can or cannot do for a specific business[cite: 1]. | Read-only; no state mutation. |
| `quote_plan(usage_plan)` | Deterministic calculator: takes desired usage (e.g. runs/day, days, extra channels/accounts) and returns exact itemized Rial/Toman cost and free welcome credit[cite: 1, 5]. | Pure Python math (`codo-core.billing`). |
| `propose_haggle_offer(prospect_id, items, requested_price_rials)` | Validates a discount request against the agent's `/hiring` negotiation band (`floor_percent`, `max_concessions`)[cite: 3, 4]. | Enforced by code validator[cite: 4]. |
| `create_employment(agency_id, employer_external_id, employer_contact, agreed_offer_id?)` | Creates a new isolated `employment_id` in `onboarding` status and binds it to the employer and originating `agency_id`[cite: 1, 4]. | Writes `employments` row + `welcome_credit` ledger entry[cite: 5]. |
| `set_employment_fields(employment_id, fields_json)` | Sets or updates the employer's configuration (persona overrides, schedule, beat/FAQ, business facts) validated against `employment_fields_schema`[cite: 1, 4]. | Typed Pydantic validation. |
| `wire_channel_or_bot(employment_id, slot, mode, sealed_secret_ref?, config?)` | Performs hire-time wiring (see §2.4 below): attaches a bot token, registers a channel, or starts/verifies a humanoid OTP/Captcha login relay[cite: 1, 7]. | Secrets passed as Sealed Envelopes (`inp_`)[cite: 7]. |
| `request_direct_payment(employment_id, amount_rials, method?)` | Triggers the agent's *own* payment method (`bale_wallet`, `card_ocr`, or `payment_link`) and returns instructions/invoice to show the employer[cite: 1, 4]. | Uses `codo-core.payments`[cite: 4]. |
| `credit_from_agency(employment_id, amount_rials, agency_tx_id, hmac_signature)` | Used when the **Agency** collects the money from the Employer and credits the Employer's ledger on the agent (see Part 3)[cite: 1]. | Requires a shared `agency_secret` minted when the Owner registered the agent with that Agency; idempotent on `agency_tx_id`[cite: 1, 5]. |
| `get_employment_status(employment_id)` | Returns current status (`onboarding`, `active`, `paused_zero_balance`), balance, and connected channels[cite: 1, 4]. | Scoped strictly to employments created by that `agency_id`. |

---

### 2.4 Solving Hire-Time Wiring («وصلی‌های زمان استخدام») Across Messengers (`N4`)

In Voice 2 (`13:03`), you pointed out that different agents require different "installations" when hired: some need a Bale bot token (either created by the employer or auto-created on their behalf), while others need a humanoid account login[cite: 1].

`codo-core` standardizes **Four Hire-Time Wiring Modes** (`wiring_requirements` in `/hiring` and `/tools`):

1. **Mode W1 — Shared Agent Bot (Zero-Bot Setup for Employer):**
   - *When used:* The agent runs on a single bot owned by the Agent Owner (e.g., Neda's `@neda_bot`), and the Employer either chats with it in DM or adds that existing bot as an administrator to their channel[cite: 3, 5].
   - *Hire-time step:* The Employer forwards a message from their channel or enters their `@channel_id`; `wire_channel_or_bot` verifies the bot has admin post permissions.
2. **Mode W2 — Employer Brings a Dedicated Bot Token (Guided Self-Service):**
   - *When used:* The Employer wants a dedicated bot with their own brand name (e.g., `@MyShopSupportBot`)[cite: 1, 5].
   - *Hire-time step:* The agent (or Agency) sends step-by-step instructions to message `@BotFather` on Bale/Telegram and get a token[cite: 1]. When the Employer sends the token in chat, the ingress interceptor seals it (`inp_...`) so it never enters LLM context, calls `getMe` to verify it, mounts the webhook at `/webhooks/bale/<employment_id>`, and calls `setMyName` / `setChatPhoto` to apply the employment's persona and avatar[cite: 1, 7]!
3. **Mode W3 — Automated BotFather Creation via Temporary Humanoid Login (Optional Convenience Tool):**
   - *When used:* Your second idea in Voice 2 — a non-technical Employer doesn't even know how to use `@BotFather` and prefers the agent/Agency to create the bot for them[cite: 1].
   - *Hire-time step:* Using the `botfather_provisioner` helper in `tool-bank`, the Employer logs into their Bale/Telegram account via the standard OTP relay, the deterministic script messages `@BotFather`, creates the bot with the chosen persona name/username, captures the minted bot token directly into the Agent's Sealed Store, and **immediately logs out and deletes the personal user session**[cite: 1, 7].
4. **Mode W4 — Persistent Humanoid Account Login (`bale_user`, `telegram_user`, `eitaa_client`, `rubika_client`):**
   - *When used:* Agents like Hanieh that must live inside a real phone number's account[cite: 1, 2].
   - *Hire-time step:* First displays the mandatory **Humanoid Ban-Risk Warning** (recommend a dedicated SIM, never a primary personal number)[cite: 2, 4]. Once accepted, runs the 3-step Token-Issued Auth Relay (`auth_request_code` → optional Captcha image relay → `auth_verify_otp`) either directly in the agent's chat or proxied through the Agency chat via `/hiring/mcp`[cite: 1, 7].

---

### 2.5 The 3rd Interface: `/work/mcp` for End-Users' Personal AI Assistants (`N9`)

In Voice 4 (`13:09`), you noticed an important third case:
> *"For *using* an agent, one agent might use a Bale bot for end-users, another might use a humanoid account on Eitaa, and another might have an MCP or A2A for end-user usage — which is completely different from the Admin MCP and the Hiring MCP! Somebody might build a personal general-purpose agent that connects to different specialist agents."*[cite: 1]

This is **Plane 4D (`/work/mcp`)** in our 4-Plane architecture:

| MCP Endpoint on an Agent | Who Calls It | Auth Token | What It Can Do |
|---|---|---|---|
| **1. `/admin/mcp`** | **Agent Owner** (via Codo `/admin`)[cite: 1, 4] | `ADMIN_TOKEN` (1 per agent)[cite: 4] | Global stats, ledger audits, receipt approvals, price overrides, pausing any employment[cite: 4]. |
| **2. `/hiring/mcp`** | **Agencies / Brokers** (only if `is_rented=True`)[cite: 1] | `AGENCY_API_KEY` (or open presales + signed write calls)[cite: 1] | Inspect manifest, quote, create an employment, configure employer fields, wire channels, top up employer ledger[cite: 1]. |
| **3. `/work/mcp`** *(Optional, chosen in `/role` & `/tools`)* | **End-Users' Personal AI Assistants** (or B2B client systems)[cite: 1] | `WORK_TOKEN` (scoped to a specific `employment_id` + `end_user_id`)[cite: 1] | **Only the end-user operational tools of that agent** (e.g., `ask_support(question)`, `register_for_event(name, phone)`, `request_custom_article(topic)`) — with zero access to admin or employer settings[cite: 1]! |

---

## Part 3 — Business Development Analysis: Marketplace Economics, Payments & Commissions (`N11`)

In Voice 5 (`15:00`), you asked me to put on a **Business Developer («بیزینس دولوپر»)** hat and evaluate:
1. How payments work when an Employer hires an agent **directly** vs. **through the Agency**[cite: 1];
2. Whether the Agency commission should be taken from the **Employer's payment (Cafe Bazaar split model)** or charged to the **Agent Owner via a Prepaid Agency Credit Wallet («شارژ حساب صاحب ایجنت نزد آژانس»)** where running out of credit pauses promotion and hiring[cite: 1].

### 3.1 Comparing the 3 Commercial Models in the Iranian Reality

| Dimension | Model A: Cafe Bazaar Escrow Split (Employer Pays Agency → Agency Pays Owner) | Model B: Pure Prepaid Owner Ad-Wallet (Owner Pays Agency Per Hire Click) | **Model C (RECOMMENDED BD HYBRID): Conversion-Backed Owner Wallet + Dual Checkout** |
|---|---|---|---|
| **How money flows** | Employer pays 100% to Agency; Agency keeps $X\%$ and transfers $(100-X)\%$ to Agent Owner's bank/wallet[cite: 1]. | Owner tops up balance at Agency; Employer pays Owner directly; Agency deducts fee from Owner's Agency balance[cite: 1]. | **Both paths supported** (see below): Owner holds a Prepaid Wallet at the Agency, **and** commission is only locked/deducted on **verified conversion**[cite: 1]. |
| **Financial & Tax Friction for You (Omid)** | **High risk.** If 20 workshop developers sell through your Agency and all money enters *your* bank card or Bale wallet, you must do weekly Sheba payouts to 20 people and explain gross inflows to tax authorities. | **Zero payout friction!** Money only flows *into* the Agency when Agent Owners top up their Agency wallet[cite: 1]. Employers pay Agent Owners directly[cite: 1]. | **Zero payout friction by default** (Owners top up the Agency; Employers pay Owners directly) — while still allowing Agency-collected checkout for Owners who don't have a payment gateway yet! |
| **Vulnerability to Click-Fraud / Free-Trial Abuse** | Low (commission comes out of real Employer payments). | **High if charged on raw "Hire":** A competitor or curious user could click "Hire" 30 times without paying the agent, draining the developer's Agency balance! | **Zero abuse:** When an Employer starts a hire via the Agency, the Agency places a **Hold** on the Owner's Agency balance, and only **Captures** the commission when the Employer either (a) completes first payment or (b) passes the free trial / onboarding milestone! |
| **Cold-Start for Workshop Graduates** | Easy (no upfront cost to list). | Friction if developers must pay cash before getting their first customer. | **Solved via Welcome Listing Credit:** Every new agent approved in the Agency gets e.g. **500,000 Toman free Agency credit** (enough for ~3–5 hires) so their first customers are 100% risk-free! |

---

### 3.2 How the Recommended Hybrid Model Works Step-by-Step (`N6`, `N11`)

Your intuition in Voice 5 — **charging the Agent Owner via a Prepaid Agency Balance and pausing promotion/hiring when their balance is empty**[cite: 1] — is the **smartest business model for an Iranian Agent Marketplace**, provided we add **three BD safeguards**:

#### Rule 1: The Two Ways an Employer Can Hire and Pay a Rented Agent[cite: 1]

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                     DUAL HIRING & PAYMENT PATHS FOR RENTED AGENTS                      │
├───────────────────────────────────────────┬────────────────────────────────────────────┤
│ Path 1: Direct Interface (واسط اختصاصی)   │ Path 2: Via Agency (واسط آژانس)            │
├───────────────────────────────────────────┼────────────────────────────────────────────┤
│ • Employer talks directly to Agent #0     │ • Employer discovers agent in Agency (or   │
│   (e.g. Neda's Bot or Hanieh's account).  │   opens `agency_bot?start=agent_neda`).    │
│ • Employment created with                 │ • Agency calls `/hiring/mcp` ->            │
│   `agency_id = NULL`.                     │   `create_employment(agency_id="main")`.   │
│ • Employer tops up via the Agent's own    │ • Employer can pay in TWO ways:            │
│   payment method (`bale_wallet`,          │   - **2A (Default):** Pays the Agent's own │
│   `card_ocr`, or `payment_link`).         │     payment method; Agent notifies Agency  │
│ • **0% Agency Commission.**               │     of paid top-up -> Agency deducts X%    │
│                                           │     commission from Owner's Agency Wallet! │
│                                           │   - **2B (Agency Checkout):** Pays Agency  │
│                                           │     directly; Agency calls                 │
│                                           │     `credit_from_agency()` on Agent, and   │
│                                           │     credits (100-X)% to Owner's Wallet!    │
└───────────────────────────────────────────┴────────────────────────────────────────────┘
```

#### Rule 2: The Agent Owner's Lifecycle & Wallet Inside the Agency[cite: 1]

1. **Submission (`unverified` / «تأیید نشده»):**
   - The Agent Owner gives their agent's `/hiring/mcp` URL to the Agency Agent[cite: 1].
   - The Agency Agent calls `get_manifest()`, verifies the endpoint is alive, creates an `agency_shared_secret`, and registers the agent as `status = "unverified"`[cite: 1].
   - **Deep-Link Access Only:** While `unverified`, the agent is **not** recommended in catalog searches, **but** anyone with the direct deep link (e.g. `ble.ir/agency_bot?start=hire_neda`) can hire it[cite: 1].
   - *BD Tip:* For `unverified` deep-link hires, charge **0% (or half) commission**, because the developer brought their own traffic and is simply using the Agency as a convenient hiring wizard!
2. **Approval (`approved` / «تأیید شده») + Welcome Credit:**
   - You (the Agency Owner) review the agent and run `/admin approve agent neda-reporter` on the Agency's Admin MCP[cite: 1].
   - Upon first approval, the Agency grants the Agent Owner a **Welcome Listing Credit** (e.g., `500,000 Toman` in `owner_ledger`) so the agent immediately starts getting promoted in the Agency!
3. **Active Promotion & Commission Deduction:**
   - As long as `status == "approved"` **and** `owner_balance >= min_commission_hold`, the Agency promotes the agent to Employers looking for that role[cite: 1].
   - When an Agency-referred Employer hires the agent and makes a payment (or activates a paid employment), the Agency deducts its commission (e.g., **20% of top-ups** or a **fixed CPA per active hire**, configurable per agent in the Agency) from the Owner's Agency Wallet[cite: 1].
4. **Low Balance & Zero Balance Auto-Pause:**
   - When `owner_balance` drops below a threshold, the Agency messages the Agent Owner: *"شارژ حساب شما در آژانس رو به اتمام است. برای ادامهٔ تبلیغ و جذب کارفرمای جدید، حساب خود را شارژ کنید."*[cite: 1]
   - When `owner_balance <= 0`, the agent's catalog status automatically flips to **`paused_no_credit`**: the Agency stops promoting it and blocks new hires through the Agency until the Owner tops up (while existing Employers already running on the agent continue working normally)[cite: 1].

---

## Part 4 — Strict Boundary Allocation: Protocol vs. Codo/Kandoo vs. The 4 Rehearsals (`N8`, `N10`)

In Voice 4 (`13:09`), you asked for an explicit map of what belongs where, so that Agency rehearsal specifics never pollute Codo or Kandoo[cite: 1].

| Layer | What Lives Here | What Does NOT Live Here |
|---|---|---|
| **1. The Open Agent Protocol (`codo-protocol`)** | • The 4-Plane specification (`/admin/mcp`, `/hiring/mcp` + `/.well-known/agent.json`, `ManagementChannel`, and `WorkPlane` / `/work/mcp`)[cite: 1, 4].<br/>• Standard JSON Schema for `agent.json` (`capabilities`, `wiring_requirements`, `employment_fields_schema`, `commercial_model`)[cite: 1].<br/>• Standard tool names & payloads for `/hiring/mcp` (§2.3) and `/admin/mcp` (Round 4 §7.2)[cite: 1, 4]. | • Any knowledge of a specific "Agency" brand, catalog database, or `unverified`/`approved` listing rules[cite: 1]. |
| **2. `codo-core` (Shared Python Package on Gitea PyPI)** | • `codo_core.admin_mcp`: FastAPI router mounting `/admin/mcp`[cite: 4].<br/>• `codo_core.hiring_mcp`: FastAPI router mounting `/.well-known/agent.json` & `/hiring/mcp` **automatically whenever `settings.is_rented == True`** (disabled when `is_rented == False`)[cite: 1].<br/>• `codo_core.work_mcp`: Optional router mounting `/work/mcp` when enabled in `/tools`[cite: 1].<br/>• `codo_core.billing`: Append-only Employer ledger, holds, meters, `make_offer` haggling validator, and `credit_from_agency` HMAC verification[cite: 1, 4, 5].<br/>• `codo_core.payments`: `bale_wallet`, `card_ocr`, `payment_link`[cite: 4].<br/>• `codo_core.wiring`: The 4 hire-time wiring handlers (shared bot, custom bot token, BotFather provisioner, humanoid OTP/Captcha relay)[cite: 1, 7]. | • WordPress blog logic (belongs to Neda)[cite: 3, 4].<br/>• Agency catalog / developer wallet logic (belongs to the Agency rehearsal)[cite: 1].<br/>• Event ticket / workshop registration logic (belongs to Event Organizer rehearsal)[cite: 1]. |
| **3. `codo/` (Participant Template & Slash Commands)** | • **`/role`**: Adds the End-User interface question: *"How do end-users (if any) interact with this employee? (Messenger bot / Humanoid account / Companion web UI / Personal AI Assistant via `/work/mcp` / No end-user)"*[cite: 1, 4].<br/>• **`/hiring`**: Branches cleanly on **In-House (`is_rented=False`)** vs. **Rented (`is_rented=True`)**[cite: 1, 4]:<br/>  - **In-House path:** Skips commercial model, price catalog, and `/hiring/mcp`; defines Employment `#0` fields and single-install bootstrap via `/wire` & `/admin`[cite: 1].<br/>  - **Rented path:** Defines manager binding, employment fields, hire-time wiring mode (W1–W4), meters, price catalog, haggling band, payment methods, and auto-enables `/hiring/mcp` so the participant's agent can be hired directly or submitted to any Agency[cite: 1, 4].<br/>• **`/sops`, `/edge-cases`, `/plan`, `/build`, `/wire`, `/test`, `/deploy`, `/iterate`, `/migrate`, `/admin`**: Updated to verify `/hiring/mcp` (if rented) and `/work/mcp` (if enabled) during `/test`[cite: 1, 4]. | • Any hard-coded reference to your Agency rehearsal project[cite: 1]. |
| **4. `kandoo/` & Books (`cookbook/`, `participant-book/`)** | • Gitea (`workshop/tool-bank` + PyPI registry for `codo-core`), Coolify, Postgres, Browserless, Squid, and the Zero-Drift WSS Webhook Relay (`<team>-dev.<base_domain>`) — which now seamlessly relays `/admin/mcp`, `/hiring/mcp`, and `/work/mcp` alongside messenger webhooks during local `/wire` and `/test`[cite: 4, 7]! | • Any rehearsal-specific containers[cite: 1, 4]. |
| **5. The 4 Rehearsal Projects (Separate Repositories)** | • **#1 `neda-reporter` (Rented)**[cite: 1, 3]<br/>• **#2 `hanieh-support` (Rented)**[cite: 1, 2]<br/>• **#3 `event-organizer` (Rented)**[cite: 1]<br/>• **#4 `agent-agency` (In-House)**[cite: 1] | • Never bundled inside `codo.zip` given to participants[cite: 1]. |

---

## Part 5 — The Complete 4-Rehearsal Matrix (`N8`)

With the two new rehearsals introduced in `09-transcription.md` (**Event Registration** and **Agent Agency**) alongside **Neda** and **Hanieh**, look at how thoroughly the 4 rehearsals cover every single branch of the Codo pipeline[cite: 1, 2, 3, 4]:

| Feature / Pipeline Branch | #1 Neda (`neda-reporter`)[cite: 3] | #2 Hanieh (`hanieh-support`)[cite: 2] | #3 Event Organizer (`event-organizer`)[cite: 1] | #4 Agent Agency (`agent-agency`)[cite: 1] |
|---|---|---|---|---|
| **Employment Model (`/hiring` A)** | **Rented** (`is_rented=True`)[cite: 1, 3] | **Rented** (`is_rented=True`)[cite: 1, 2] | **Rented** (`is_rented=True`)[cite: 1] | **In-House** (`is_rented=False`, single employment `#0`)[cite: 1] |
| **Exposes `/hiring/mcp`?** | **Yes**[cite: 1] | **Yes**[cite: 1] | **Yes**[cite: 1] | **No** (configured via `/admin/mcp` & `/wire`)[cite: 1] |
| **Primary Trigger** | Clock (`schedule_tick`) + Steering[cite: 3, 5] | Customer DM (`external_message` + debounce)[cite: 2, 4] | Registrant DM (`external_message`)[cite: 1] | Developer or Employer DM (`external_message`)[cite: 1] |
| **Management Channel** | `bale_bot`[cite: 3] | Humanoid (`bale_user` / `telegram_user`) with numeric approval codes[cite: 2] | `bale_bot` (or Employer's choice)[cite: 1, 4] | `bale_bot` (your personal management chat)[cite: 1, 4] |
| **End-User Work Plane** | Channels (`bale`, `telegram`, `eitaayar`, `rubika`) + WordPress Blog[cite: 3, 5] | Humanoid 1-to-1 DMs (`bale_user` / `telegram_user`)[cite: 2] | `bale_bot` / `telegram_bot` + **`/work/mcp`** (so personal agents can register users!)[cite: 1] | `bale_bot` (for Developers & Employers)[cite: 1] |
| **Hire-Time Wiring Mode** | **W1** (Add bot to channel / Eitaayar token)[cite: 3, 5] | **W4** (Humanoid SIM login via OTP/Captcha relay)[cite: 1, 2] | **W1 or W2** (Shared bot with event deep-link, or Organizer's own bot token)[cite: 1] | *N/A (In-House)*[cite: 1] |
| **Payment Method Exercised** | **`bale_wallet`** (native invoice)[cite: 3, 4] | **`card_ocr`** (Card-to-card + Vision OCR + audit queue)[cite: 2, 4] | **Both `bale_wallet` & `card_ocr`** (for Employer **and** for Event Registrants paying ticket fees!)[cite: 1, 4] | **`bale_wallet` & `card_ocr`** (for Agent Owners topping up their Agency Wallet + Optional Employer Checkout)[cite: 1] |
| **Real-World Production Use** | AI/Tech news channel & blog[cite: 3, 5] | Customer support for businesses[cite: 2, 5] | **Registers real participants for your V6.0 Workshop!**[cite: 1] | **Showcases & rents out Neda, Hanieh, Event Organizer, and future participant agents!**[cite: 1] |

---

## Part 6 — Specifications for the Two New Rehearsals (#3 Event Organizer & #4 Agent Agency) (`N2`, `N3`, `N6`, `N8`)

You already wrote `07-idea-input-neda.md`[cite: 3] and `08-idea-input-hanieh.md`[cite: 2]. Below are the architectural blueprints (and ready-to-save `/role` idea inputs) for the two new rehearsals introduced in `09-transcription.md`[cite: 1].

### 6.1 Rehearsal #3: Event Registration Agent («مسئول ثبت‌نام و هماهنگی رویداد — مثلاً مهتاب»)[cite: 1]

- **What she does all day:**
  - Represents an event, course, or workshop organizer (one event series per employment; **Employment `#0` is your own V6.0 Agent Workshop registration desk!**)[cite: 1].
  - Greets prospective attendees, explains the event syllabus, prerequisites, date/location, and value proposition, and answers FAQ questions from the employment's knowledge base.
  - Negotiates discounts within the organizer's `/hiring` haggling band (e.g., early-bird, group registration, or student concessions)[cite: 4].
  - Collects the ticket/registration fee from the attendee (via `bale_wallet` or `card_ocr`), records their registration fields (name, phone, background, laptop readiness), issues a confirmed seat receipt, and notifies the organizer on the management channel.
  - Exposes **`/work/mcp`** so an attendee's personal AI assistant can query event details and register them programmatically[cite: 1]!
- **Why she is Rented (`is_rented = True`):**
  - Any teacher, conference organizer, or webinar host can hire her (directly or via the Agency), configure their own event details, capacity, ticket price, haggling band, and destination card/wallet, and get a dedicated registration link or connect their own bot token[cite: 1].
- **Employer Meters:**
  - Either **per confirmed paid registrant** (e.g., X Toman per registered seat) or **per active event month**; answering questions and setup are free.

### 6.2 Rehearsal #4: The Agent Agency («آژانس استخدام ایجنت‌ها»)[cite: 1]

- **What it is:**
  - An **In-House (`is_rented = False`)** Codo agent owned by you (only Employment `#0` exists)[cite: 1].
  - Its external tools include a **Dynamic MCP Client (`codo-core.agency_client` wrapping Pydantic AI's `MCPToolset`)** that can connect to any URL speaking the `codo-hiring/1.0` protocol (`/hiring/mcp`)[cite: 1, 5].
- **Core SOPs of the Agency Agent:**
  1. **SOP-1 Developer Onboarding & Agent Submission (for Agent Owners):**
     - An Agent Owner sends their agent's `/hiring/mcp` URL[cite: 1].
     - The Agency Agent connects to `/hiring/mcp`, calls `get_manifest()`, validates that the protocol version and required tools exist, and stores the agent in its `listed_agents` table with `status = "unverified"`[cite: 1].
     - Generates a **Deep Link** (`https://ble.ir/<agency_bot>?start=hire_<slug>`) and gives it to the developer: *"ایجنت شما در وضعیت «تأیید نشده» ثبت شد. تا پیش از تأیید مدیر آژانس، در فهرست عمومی تبلیغ نمی‌شود، اما کارفرمایان با این لینک مستقیم می‌توانند همین الان آن را استخدام کنند."*[cite: 1]
  2. **SOP-2 Owner Approval via Agency `/admin/mcp` (for You):**
     - In the Agency project's Codo terminal, you run:
       `/admin list unverified agents` → inspect → `/admin approve agent neda-reporter`[cite: 1, 4].
     - The status becomes `approved`, the Owner receives their Welcome Listing Credit, and the Agency starts promoting the agent in catalog searches[cite: 1].
  3. **SOP-3 Developer Credit Top-Up & Auto-Pause:**
     - The Agent Owner can check their Agency balance and top it up (via `bale_wallet` or `card_ocr`)[cite: 1, 4].
     - If `owner_balance <= 0`, promotion and Agency-originated hires pause automatically[cite: 1].
  4. **SOP-4 Employer Discovery & Presales Consultation (for Employers):**
     - An Employer asks the Agency what agents exist or asks about a specific agent (e.g., *"ایجنت خبرنگار چطور کار می‌کنه؟ می‌تونه از سایت‌های انگلیسی هم ترجمه کنه؟"*)[cite: 1, 5].
     - The Agency checks its `approved` catalog (or the specific `unverified` agent if the user entered via deep link)[cite: 1], answers from the cached `manifest`, and for deeper questions calls `ask_presales_question` on the target agent's `/hiring/mcp`[cite: 1].
  5. **SOP-5 Brokered Hiring, Wiring & Payment (for Employers):**
     - When the Employer decides to hire an agent, the Agency calls `quote_plan` (and `propose_haggle_offer` if bargaining) on the target agent's `/hiring/mcp`[cite: 1].
     - Calls `create_employment` and interviews the Employer for `employment_fields_schema` (`set_employment_fields`)[cite: 1].
     - Executes **Hire-Time Wiring** (`wire_channel_or_bot`): guides the Employer through BotFather token creation or relays the humanoid OTP/Captcha via Sealed Envelopes (`inp_`)[cite: 1, 7].
     - Handles payment (either invoking the target agent's native payment via `request_direct_payment` or collecting payment in the Agency and calling `credit_from_agency`), deducts the Agency commission from the Developer's Agency Wallet, and hands the Employer over to their newly activated agent[cite: 1]!

---

## Part 7 — The Rehearsal Execution Procedure & Upstream Feedback Loop (`N10`)

In Voice 4 (`13:09`), you asked:
> *"Tell me what to do with these 4 rehearsals: how to capture their feedback, weaknesses, and flaws and apply them to the protocol, book, Codo, and Kandoo. Should I run them in separate rehearsal projects and report issues back to the workshop project, or start them inside the workshop project? Introduce a clear procedure (`رویه`) so that after it finishes, all 4 rehearsals are working well and the workshop project is flawless."*[cite: 1]

### 7.1 Rule #1: Separate Sibling Folders for Rehearsals, Never Inside `workshop/`

Run the 4 rehearsals in **separate sibling directories outside the `workshop` repository**, each unpacked from a compiled `codo.zip` produced by `agent/kandoo`:

```
/home/omid/projects/
├── workshop/                                 <-- THE FACTORY (Kandoo, Codo template, codo-core, tool-bank, Books)
│   ├── workshop_docs/versions/V6.0/
│   │   ├── 07-idea-input-neda.md             <-- Idea inputs live here for version control
│   │   ├── 08-idea-input-hanieh.md
│   │   ├── 11-idea-input-event-organizer.md
│   │   ├── 12-idea-input-agency.md
│   │   └── rehearsal-feedback-log.md         <-- Cumulative log of every flaw found & fixed
│   └── agent/                                <-- Source of truth for Kandoo, codo-core, tool-bank, codo/
│
└── rehearsals/                               <-- THE TEST TRACK (Unpacked from compiled `codo.zip`!)
    ├── 01-event-organizer/                   <-- Rehearsal 1 (Rented — also used for real V6.0 sign-ups!)
    ├── 02-neda-reporter/                     <-- Rehearsal 2 (Rented — Cron + WordPress + Bale Wallet)
    ├── 03-hanieh-support/                    <-- Rehearsal 3 (Rented — Humanoid SIM + Card OCR)
    └── 04-agent-agency/                      <-- Rehearsal 4 (In-House — Hires #1, #2, and #3 via /hiring/mcp!)
```

**Why this separation is critical:**
- If you run a rehearsal *inside* `/home/omid/projects/workshop/`, the AI coding assistant has access to Kandoo's internal source files and uncompiled templates, which masks broken paths, missing dependencies in `codo-core`, or unclear instructions in `codo/commands/*.md`.
- Running each rehearsal in its own isolated folder unpacked from `codo.zip` guarantees you experience **100% of what a workshop participant experiences**[cite: 1].

---

### 7.2 Rule #2: The Recommended Order of the 4 Rehearsals

Execute the rehearsals in this specific sequence:

1. **First — `01-event-organizer` (Rented, Bale Bot + Bale Wallet / Card OCR + `/work/mcp`):**
   - *Why first:*
     - It uses official `bale_bot` (Rung 0), which is the fastest transport to bring up end-to-end[cite: 5].
     - It tests the entire **Rented** pipeline (`/role` → `/hiring` → `/persona` → `/avatar` → `/tools` → `/sops` → `/edge-cases` → `/plan` → `/build` → `/wire` → `/test` → `/deploy` + `/admin/mcp` + `/hiring/mcp` + `/work/mcp`)[cite: 1, 4].
     - **Immediate Business Value:** As soon as v0.1 is deployed, you use Employment `#0` of this agent to start **registering real participants for the upcoming V6.0 Workshop** while you build the other three rehearsals[cite: 1]!
2. **Second — `02-neda-reporter` (Rented, Cron + WordPress Companion + Channels + Bale Wallet):**
   - *Why second:* Tests **scheduled durable execution (DBOS)**, **companion services (`WordPress` via REST API)**, **the optional design track (theme customization)**, and multi-channel publishing (`bale`, `telegram`, `eitaayar`, `rubika`)[cite: 3, 4, 5].
3. **Third — `03-hanieh-support` (Rented, Humanoid Account + Debounce + Numeric Approvals + Card OCR):**
   - *Why third:* Tests the **humanoid management & customer transport** (`bale_user` / `telegram_user`), `/admin login` bootstrap, one-time numeric approval codes, inbound message debounce, and the full **Card-to-Card + Vision OCR + Owner Audit Queue** payment flow[cite: 2, 4].
4. **Fourth — `04-agent-agency` (In-House, Dynamic `MCPToolset` Client over `/hiring/mcp`):**
   - *Why fourth:*
     - Tests the **In-House (`is_rented = False`)** branch of `/hiring`[cite: 1].
     - By the time you start `04-agent-agency`, **Rehearsals #1, #2, and #3 are already live and serving `/hiring/mcp`!** So during `/test` of the Agency Agent, you register `event-organizer`, `neda-reporter`, and `hanieh-support` into the Agency (`unverified` → deep link test → `/admin approve` → full catalog search, presales Q&A, hiring, wiring, and payment test)[cite: 1]!

---

### 7.3 Rule #3: The 5-Step "Stop-Fix-Upstream-Sync" Loop («رویهٔ ثبت و رفع نقص در کارگاه»)

Whenever you hit **any** bug, awkward question, missing tool behavior, or protocol gap while running a rehearsal in `/home/omid/projects/rehearsals/<name>/`, follow this exact 5-step procedure so the workshop repo stays the single source of truth[cite: 1]:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                 THE UPSTREAM FEEDBACK LOOP DURING THE 4 REHEARSALS                     │
└────────────────────────────────────────────────────────────────────────────────────────┘

  [1. SPOT FLAW IN REHEARSAL]
   While running step `/X` in `rehearsals/02-neda-reporter`, you notice a flaw
   (e.g. `/hiring` didn't ask about wiring mode, or `codo-core` had a bug in `/hiring/mcp`).
         │
         ▼
  [2. LOG IT TO THE WORKSHOP SESSION]
   Keep a second OpenCode window open on `/home/omid/projects/workshop`.
   Describe the flaw in plain language (or paste the error/transcript).
         │
         ▼
  [3. CLASSIFY & FIX IN `workshop/agent/` FIRST (NEVER hot-patch only the rehearsal!)]
   The `workshop` assistant logs the issue in `rehearsal-feedback-log.md` and fixes the
   root cause in the right upstream layer:
     • Layer A (`codo-core`): fix Python package -> bump version `0.1.x` -> publish to Gitea PyPI
     • Layer B (`tool-bank`): fix bridge client -> push to `git.<domain>/workshop/tool-bank.git`
     • Layer C (`codo/commands/` or `constitution/`): fix prompt/rule in template
     • Layer D (`kandoo/` or `cookbook/` / `participant-book/`): fix infra or book text
         │
         ▼
  [4. RUN `kandoo /sync-rehearsal <path>` (A 10-second helper script)]
   Updates the rehearsal project's `.opencode/commands/` and `docs/constitution/` from
   the freshly compiled `codo` template and upgrades `codo-core` in its `.venv` —
   WITHOUT touching the rehearsal's `docs/living/`, `docs/versions/`, or `.env`!
         │
         ▼
  [5. RESUME THE REHEARSAL STEP `/X`]
   Re-run `/X` in the rehearsal window to confirm the upstream fix solved it cleanly.
```

**Why `kandoo /sync-rehearsal <path>` is a game-changer:**
- If you had to restart a rehearsal from `/start` every time you improved a command prompt in `workshop/agent/`, you would waste days redoing earlier steps.
- Conversely, if you manually edited the rehearsal's code without fixing `workshop/agent/`, the workshop template would still have the bug on workshop day[cite: 1].
- `sync-rehearsal` updates the *rules, commands, and `codo-core` package* inside the live rehearsal folder in 10 seconds while preserving all the `docs/living/` decisions and database state you already built in that rehearsal!

---

## Part 8 — Concrete Updates to `/role`, `/hiring`, and `/tools` from Round 4

To incorporate everything from `09-transcription.md` into Round 4's pipeline (`06-analysis-round4.md`)[cite: 1, 4], only these targeted additions are needed:

1. **In `/role` (`commands/role.md`):**
   - Alongside *"Does this employee need a screen of its own?"*, ask:
     **"Who is the End-User («کاربر انتهایی») of this employee, and how do they reach her?"**[cite: 1]
     - *(a)* Humans on messengers (Bots or Humanoid accounts)[cite: 1];
     - *(b)* Humans on a web page / companion service[cite: 4];
     - *(c)* **Other AI agents / Personal general-purpose assistants via `/work/mcp`**[cite: 1];
     - *(d)* No end-user (she only reports to or acts for her Employer)[cite: 1].
2. **In `/hiring` (`commands/hiring.md`):**
   - **Section A (In-House vs. Rented):**
     - If **In-House (`is_rented = False`)**: records that the agent has only 1 employment (`#0`), disables `/hiring/mcp`, skips Section D (Commercial Model), and uses Section C only to list which settings the Owner wants to adjust at runtime from their phone or `/admin`[cite: 1, 4].
     - If **Rented (`is_rented = True`)**: enables `/.well-known/agent.json` and `/hiring/mcp` automatically so the agent can be hired both **directly via `#0`** and **through any compliant Agency**[cite: 1].
   - **Section E (Hire-Time Wiring Mode — NEW from `N4`):**
     - Explicitly specifies which of the 4 wiring modes (**W1** Shared Bot, **W2** Employer Brings Bot Token, **W3** Auto-Create via BotFather, **W4** Humanoid SIM Login) happens when a new Employer hires the agent[cite: 1].
   - **Section D (Commercial Model — Updated from `N11`):**
     - Adds support for **Dual Payment Entry**: native payment on the agent (`bale_wallet`, `card_ocr`, `payment_link`) **plus** `credit_from_agency` so an Agency can also collect or attribute payments[cite: 1, 4].
3. **In `/tools` (`commands/tools.md`):**
   - Automatically includes `codo_core.admin_mcp` (always), `codo_core.hiring_mcp` (when `is_rented = True`), and `codo_core.work_mcp` (when `/role` selected end-user agent-to-agent access)[cite: 1, 4].

---

## Part 9 — Decisions to Lock for Round 5

| # | Decision | Options | Recommendation |
|---|---|---|---|
| **R5-1** | Wire protocol for the Hiring Plane (`/hiring/mcp`) and End-User Agent Plane (`/work/mcp`)[cite: 1] | (a) Streamable HTTP MCP + `/.well-known/agent.json` + `ask_presales_question` tool · (b) Pure A2A · (c) Separate MCP and A2A servers | **(a) Streamable HTTP MCP + `agent.json` + `ask_presales_question`** (§2.1) — 100% deterministic for wiring/money, conversational for presales, zero extra protocol stack. |
| **R5-2** | Agency Commission & Billing Model[cite: 1] | (a) Cafe Bazaar escrow split only · (b) Prepaid Owner Wallet charged on every raw hire click · (c) **Hybrid: Prepaid Owner Wallet (with Welcome Credit) charged only on paid conversion/activation + Dual Checkout** | **(c) Hybrid** (§3.1–3.2) — matches your Voice 5 model while preventing click-fraud from draining developer credit. |
| **R5-3** | Commission rate for `unverified` agents hired via the developer's own deep link[cite: 1] | (a) 0% (free until approved & promoted by Agency) · (b) Half commission · (c) Full commission | **(a) 0% on `unverified` deep links** — encourages every developer to bring their own users to the Agency right away. |
| **R5-4** | Default Hire-Time Wiring for Employers needing a dedicated bot[cite: 1] | (a) Guided `@BotFather` token paste (Mode W2) · (b) Automated `@BotFather` creation via temporary login (Mode W3) · (c) Offer both (W2 default, W3 optional) | **(c) Both** (W2 default, W3 available as a `tool-bank` helper when the employer wants hands-free setup) (§2.4). |
| **R5-5** | Rehearsal execution workspace & order[cite: 1] | (a) Inside `workshop/` · (b) In separate `/home/omid/projects/rehearsals/` folders with `kandoo /sync-rehearsal`, ordered: **1. Event Organizer → 2. Neda → 3. Hanieh → 4. Agency** | **(b)** (§7.1–7.3) — gets your V6.0 Workshop Registration Agent live first and ensures the 3 rented agents are live before the Agency tests hiring them! |