# V6.0 — Round 6: The Unified 3-MCP Architecture (`/admin`, `/broker`, `/employer`), Elimination of Build-Time Persona & `#0`, and the Wholesale Broker Ledger

> **Inputs:**
> - Your 8 new voice notes in [11-transcription.md](11-transcription.md) (recorded 2026-10-18, 17:05 → 18:45)[cite: 10].
> - Prior architecture and rehearsal docs: [09-transcription.md](09-transcription.md)[cite: 1], [08-idea-input-hanieh.md](08-idea-input-hanieh.md)[cite: 2], [07-idea-input-neda.md](07-idea-input-neda.md)[cite: 3], [06-analysis-round4.md](06-analysis-round4.md)[cite: 4], [05-analysis-round3.md](05-analysis-round3.md)[cite: 5], and [03-analysis-round2.md](03-analysis-round2.md)[cite: 7].

> **Read of the day.**
> 1. **Radical Unification via the 3-MCP Standard:** Your insight in [11-transcription.md](11-transcription.md) eliminates the biggest source of architectural branching in V6.0[cite: 10]. Apart from the End-User interface (which is completely role-specific and optional), **every Codo agent — whether In-House or Rented — exposes the exact same three control interfaces, and all three are pure MCP endpoints**: **`/admin/mcp`**, **`/broker/mcp`**, and **`/employer/mcp`**[cite: 10].
> 2. **No More Management Bots, No More Employment `#0`, No Build-Time `/persona` or `/avatar`:** An agent no longer hard-wires a special "Management Bale Bot" or a "Front-Desk Employment `#0`"[cite: 10]. Instead, **Persona, Avatar, and tool/channel wiring are runtime Employer Management settings** applied through `/employer/mcp` after `/build`[cite: 10].
> 3. **Caller-Agnostic Design:** The agent does not care *who* calls its three MCPs[cite: 10]. In an **In-House** project (or during local testing), **Codo itself** calls all three via the floating commands **`/admin`**, **`/broker`**, and **`/employer`** using credentials stored in a git-ignored environments file[cite: 10]. In a **Rented** project, an **Agency Agent** (or ChatGPT, or Codo) calls `/broker/mcp` to create an employment and `/employer/mcp` to configure and manage it[cite: 10].
> 4. **The Agency Duality:** The **Agent Agency** is simply an **In-House Codo agent** whose End-User interface is a Bale Bot[cite: 10]. Both **Agent Developers (supply side)** and **Employers (demand side)** are End-Users of the Agency's Bale Bot, while the Agency acts as a **Broker** (and delegated Employer manager) toward the rented agents listed inside it[cite: 10].
> 5. **Wholesale Broker Accounting + Per-Employer Spend Caps:** Billing between a Rented Agent and its Employers is cleared through the **Broker** (`credit_limit` wholesale ledger on the agent)[cite: 10]. This means Rented Agents don't even need to embed payment gateways to get paid by Employers — the Broker (e.g., the Agency) handles retail checkout and pauses unpaid employments, while a **Per-Employer Authorized Budget Cap** protects the Broker from runaway agent charges.

---

## Part 0 — Master Reconciliation of `11-transcription.md`

| # | Timestamp in `11` | Your Decision / Proposal | Architectural Resolution in Round 6 | Section |
|---|---|---|---|---|
| **M1** | 17:05 | Set aside the End-User interface (which varies per project) and unify In-House and Rented around **3 pure MCP interfaces**: Admin, Hiring (Broker), and Management (Employer) — called by Codo, an external MCP client (like ChatGPT), or the Agency[cite: 10]. | Adopted as the **Core 3-MCP Architecture** (`/admin/mcp`, `/broker/mcp`, `/employer/mcp`) built into `codo-core`[cite: 10]. | **Part 1** |
| **M2** | 17:15 | In-House uses all 3 MCPs from Codo (1 employment); Rented can also be hired/managed directly from Codo (for friends/clients) or via an Agency; Hiring returns an **Employer MCP URL + Employer Token**[cite: 10]. | `broker.create_employer()` mints an isolated `employment_id` and returns `{ employer_mcp_url, employer_token }`[cite: 10]. | **Part 1.2, Part 2** |
| **M3** | 17:20 | The Agency itself is an **In-House agent** managed via Codo; its Bale Bot is its **End-User interface** serving both Supply-side (Developers) and Demand-side (Employers) end-users[cite: 10]. | Formalized in the Agency rehearsal spec; the Agency is a `Broker` to rented agents, and Developers/Employers are `End-Users` of the Agency[cite: 10]. | **Part 1.3, Part 6** |
| **M4** | 17:20 & 18:28 | **Remove `/persona` and `/avatar` from build steps** and **remove Employment `#0`**; move Persona, Avatar, and temperament (`طبع و مزاج`) out of Hiring and into **Employer Management**[cite: 10]. | `/persona` and `/avatar` commands are removed; persona & avatar become standard fields in `/employer/mcp` configured during `/wire` (and changeable anytime via `/employer`)[cite: 10]. | **Part 4** |
| **M5** | 17:26 | Over `/employer/mcp`, the calling agent (Agency or Codo) either passes ready tokens (e.g. Bot token, GitLab token), **or** (if it has the tool) offers to log in on the Employer's behalf (e.g. via `@BotFather` or web login) to mint the token, **or** teaches the Employer step-by-step; for humanoid sessions on the target agent, it relays Phone + OTP over `/employer/mcp`[cite: 10]. | Standardized as the **3-Tier Credential & Session Wiring Protocol** on `/employer/mcp`[cite: 10]. | **Part 2.3** |
| **M6** | 17:33 | **Reverse Notifications (Target Agent → Employer):** Configured via `/employer/mcp` using either (a) a **Webhook URL** or (b) a **Notification Channel/Group numeric ID** where the target agent's sender bot is added as admin (either manually by the user or auto-provisioned by the Agency/Codo via humanoid login)[cite: 10]. | Both notification sinks (`webhook_url` and `messenger_channel_id`) are built into `codo-core` and configured via `/employer/mcp`[cite: 10]. | **Part 2.4** |
| **M7** | 18:28 | Rename `/role` back to **`/idea-core` («هستهٔ ایده»)** (processing the job role inside it); follow with **Management Capabilities («قابلیت‌های مدیریتی»)** and **Tools (`/tools`)** (recommend best order), then **`/sops`**, **`/plan`**, **`/build`**, first hire/manage in local dev, **`/test`**, and **`/deploy`** (which auto-replicates the first hire/management to staging)[cite: 10]. | Adopted; full pipeline and recommended step order (`Tools` vs. `Management Capabilities`) detailed in **Part 4**. | **Part 4** |
| **M8** | 18:36 | Define **3 Personas (`Admin`, `Broker`, `Employer`)**, a **git-ignored file** storing MCP URLs and tokens per environment (`local`, `staging`, `prod`), and **3 floating commands (`/admin`, `/broker`, `/employer`)**; auto-create 1 Admin, 1 Broker, and 1 Employer in `/wire` and `/deploy` (hiding Broker details if In-House)[cite: 10]. | Specified in `docs/secrets/environments.local.md` (with structured YAML/JSON block) and the 3 floating commands[cite: 10]. | **Part 1.4, Part 4.3** |
| **M9** | 18:45 | **Wholesale Broker Accounting:** Admin assigns a **`credit_limit`** to each Broker; the Agent charges the Broker for all usage by that Broker's Employers; Broker collects from Employers and tells Agent to pause unpaid Employers; hitting `-credit_limit` pauses the Broker and all its Employers; Admin settles out-of-band and tops up Broker via `/admin`; Broker can query its debt per Agent[cite: 10]. | Full wholesale-retail ledger specification + honest BD critique and the **Per-Employer Budget Cap** safeguard in **Part 3**. | **Part 3** |

---

## Part 1 — Honest Evaluation of Your 3-MCP Model & Why It Is a Breakthrough (`M1`, `M2`, `M3`, `M8`)

### 1.1 Candid Architectural Verdict

In Voice 1 (`17:05`) and Voice 8 (`18:45`), you asked for an honest critique of this new 3-MCP model and whether an even better refinement exists[cite: 10].

**Verdict: This is the cleanest, most orthogonal architecture we have reached across all six rounds.** Here is why it solves four subtle problems that plagued Rounds 3–5:

1. **In-House and Rented now share 100% of their codebase and runtime lifecycle:**
   - Previously, In-House agents were single-tenant apps with static build-time personas, while Rented agents were multi-tenant apps with dynamic personas and a special `#0` front desk[cite: 4, 5].
   - Now, **every agent is multi-employment-capable under the hood**[cite: 10]. An In-House agent is simply an agent where `/wire` and `/deploy` automatically create **1 Admin (`self`), 1 Broker (`self`), and 1 Employer (`self`)** with billing disabled (`is_rented = False`)[cite: 10].
2. **The Target Agent is Freed from Management UI & Payment Plumbing:**
   - Previously, every agent had to implement a conversational "Management Channel" (handling approval buttons on Bale bots vs. numeric codes on humanoid accounts, plus `/admin login` relays, plus Employer billing invoices)[cite: 4].
   - By making **Admin (`/admin/mcp`)**, **Broker (`/broker/mcp`)**, and **Employer (`/employer/mcp`)** pure MCP interfaces, the target agent only implements **its actual job ( the End-User Work Plane)** plus structured MCP tools for configuration[cite: 10]!
3. **Zero Re-Entry on `/deploy`:**
   - Because the participant configures their first Employer (persona, avatar, tokens, schedules) in `local` during `/wire` through `/employer/mcp`, Codo stores that structured Employer state and **automatically replays the exact same `/broker/mcp` and `/employer/mcp` calls against `staging` at the end of `/deploy`**[cite: 10].
4. **Universal Interoperability:**
   - Because `/employer/mcp` is a standard Streamable HTTP MCP authenticated by a Bearer token, an Employer can manage their rented employee from **Codo (`/employer`)**, from **your Agency Bale Bot**, from **ChatGPT / Claude Desktop**, or from **their own company's internal AI assistant** without changing a single line of code in the employee agent[cite: 10]!

---

### 1.2 The 3 Standard Personas + The 4th Variable End-User Plane (`M1`, `M8`)

Every Codo agent has the exact same three control planes (MCPs) and one role-specific work plane[cite: 10]:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                     THE UNIFIED 3-MCP + WORK-PLANE AGENT ARCHITECTURE                   │
└─────────────────────────────────────────────────────────────────────────────────────────┘

  CALLING AGENTS (ایجنـت‌های فراخواننده):
  • Codo CLI (`/admin`, `/broker`, `/employer`)
  • The Agent Agency Bot (acting as Broker & delegated Employer interface)
  • Any MCP Client (ChatGPT, Claude, Personal Assistant)
         │
         ├─────────────────────────────┬─────────────────────────────┐
         ▼                             ▼                             ▼
  ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
  │  1. /admin/mcp      │     │  2. /broker/mcp     │     │  3. /employer/mcp   │
  │  (شخصیت ادمین)      │     │  (شخصیت بروکر)      │     │  (شخصیت کارفرما)    │
  ├─────────────────────┤     ├─────────────────────┤     ├─────────────────────┤
  │ • 1 token per env   │     │ • 1 token per broker│     │ • 1 token per       │
  │ • Create/manage     │     │   (`self`, `agency`)│     │   employment        │
  │   Brokers & credit  │     │ • `get_manifest()`  │     │ • Set Persona &     │
  │   limits            │     │ • `create_employer` │     │   Avatar            │
  │ • `credit_broker`   │     │   -> returns        │     │ • Wire tokens/OTPs  │
  │ • Global stats, DB  │     │   `employer_token`  │     │ • Set schedule, FAQ,│
  │   read, health      │     │ • Pause/resume      │     │   business rules    │
  │                     │     │   employers         │     │ • Set notification  │
  │                     │     │ • Check broker debt │     │   webhook / channel │
  └──────────┬──────────┘     └──────────┬──────────┘     └──────────┬──────────┘
             └───────────────────────────┼───────────────────────────┘
                                         ▼
                        ┌─────────────────────────────────┐
                        │     AGENT RUNTIME (`codo-core`) │
                        └────────────────┬────────────────┘
                                         │
                                         ▼
                        ┌─────────────────────────────────┐
                        │  4. END-USER WORK PLANE         │
                        │  (رابط کاربر انتهایی — متغیر)   │
                        ├─────────────────────────────────┤
                        │ • Role-specific (0, 1, or many):│
                        │   - Bale / Telegram / Rubika Bot│
                        │   - Humanoid SIM (`eitaa`, etc.)│
                        │   - Companion Web (WordPress)   │
                        │   - `/work/mcp` (for End-Users' │
                        │     personal AI assistants)     │
                        └─────────────────────────────────┘
```

---

### 1.3 How the Agency Duality Works Without Any Special Case (`M3`, `M8`)

In Voice 3 (`17:20`) and Voice 8 (`18:45`), you nailed the relationship between the **Agent Agency** and a rented agent like **Neda (Reporter)**[cite: 10]:

| Question | In the **Agent Agency** Project (`In-House`) | In **Neda the Reporter** Project (`Rented`) |
|---|---|---|
| **Who is the `Admin` (`/admin/mcp`)?** | **You (Omid)** — managing the Agency from Codo[cite: 10]. | **Neda's Developer** — managing Neda from Codo[cite: 10]. |
| **Who is the `Broker` (`/broker/mcp`)?** | Only 1 default broker (`self` = Omid, hidden because In-House)[cite: 10]. | 1 default broker (`self` = Neda's Developer) **+ `agency` (Your Agency Bot)** added via Neda's `/admin`[cite: 10]! |
| **Who is the `Employer` (`/employer/mcp`)?** | Only 1 employer (`self` = Omid), configuring the Agency's persona, avatar, and Bale Bot token[cite: 10]. | **Every business owner who rents Neda** (each gets their own `employer_token` on Neda's `/employer/mcp`)[cite: 10]. |
| **Who are the `End-Users` (Work Plane)?** | **Two groups chatting with the Agency's Bale Bot**[cite: 10]:<br/>1. **Supply-side End-Users:** Agent Developers (like Neda's developer) submitting their `/broker/mcp` URL & token[cite: 10].<br/>2. **Demand-side End-Users:** Business owners browsing, renting, and managing agents through the Agency Bot[cite: 10]. | **Readers of the Employer's channels and WordPress blog**[cite: 3, 5]. |

---

### 1.4 The Git-Ignored Environments & Credentials File (`M8`)

Per Voice 7 (`18:36`), every Codo project has a single git-ignored file **`docs/secrets/environments.local.md`** (readable and editable in Obsidian, with a fenced YAML block parsed by Codo) that tracks the three personas across every environment[cite: 10]:

```yaml
# docs/secrets/environments.local.md (git-ignored)
default_environment: local
is_rented: true

environments:
  local:
    base_url: "[https://p01-dev.workshop.ir](https://p01-dev.workshop.ir)"   # or [http://127.0.0.1:8000](http://127.0.0.1:8000)
    admin:
      mcp_url: "[https://p01-dev.workshop.ir/admin/mcp](https://p01-dev.workshop.ir/admin/mcp)"
      token: "adm_loc_9f8a7b6c..."
    brokers:
      - name: "self"
        mcp_url: "[https://p01-dev.workshop.ir/broker/mcp](https://p01-dev.workshop.ir/broker/mcp)"
        token: "brk_loc_self_1122..."
        credit_limit_toman: null              # unlimited for owner's own broker
    employers:
      - name: "self"
        employment_id: "emp_01"
        mcp_url: "[https://p01-dev.workshop.ir/employer/mcp](https://p01-dev.workshop.ir/employer/mcp)"
        token: "emp_loc_01_aabb..."

  staging:
    base_url: "[https://neda-p01.workshop.ir](https://neda-p01.workshop.ir)"
    admin:
      mcp_url: "[https://neda-p01.workshop.ir/admin/mcp](https://neda-p01.workshop.ir/admin/mcp)"
      token: "adm_stg_55443322..."
    brokers:
      - name: "self"
        mcp_url: "[https://neda-p01.workshop.ir/broker/mcp](https://neda-p01.workshop.ir/broker/mcp)"
        token: "brk_stg_self_7788..."
        credit_limit_toman: null
      - name: "agency"
        mcp_url: "[https://neda-p01.workshop.ir/broker/mcp](https://neda-p01.workshop.ir/broker/mcp)"
        token: "brk_stg_agency_9900..."
        credit_limit_toman: 100000000
    employers:
      - name: "self"
        employment_id: "emp_01"
        mcp_url: "[https://neda-p01.workshop.ir/employer/mcp](https://neda-p01.workshop.ir/employer/mcp)"
        token: "emp_stg_01_ccdd..."
      - name: "ali-gold-shop"
        employment_id: "emp_02"
        mcp_url: "[https://neda-p01.workshop.ir/employer/mcp](https://neda-p01.workshop.ir/employer/mcp)"
        token: "emp_stg_02_eeff..."
```

**How the 3 Floating Slash Commands Use This File (`M8`):**
- **`/admin <request>`**: Connects to `environments[env].admin.mcp_url` with `admin.token`[cite: 10].
- **`/broker <request>`**: Connects to `environments[env].brokers[name].mcp_url` with that broker's `token` (defaults to `self` if only one broker is specified)[cite: 10].
- **`/employer <request>`** (or `/ کارفرما`): Connects to `environments[env].employers[name].mcp_url` with that employer's `token`[cite: 10]. If only one employer (`self`) exists, it uses it automatically; if multiple employers exist in that environment, it either matches the name in the user's prompt or asks which employer they want to manage[cite: 10].

---

## Part 2 — Detailed Specification of the 3 MCP Interfaces (`M1`, `M2`, `M5`, `M6`)

### 2.1 Plane 1: `/admin/mcp` (For the Agent Owner)

Authenticated by `Authorization: Bearer <admin_token>`[cite: 4, 10]:

| Tool | Purpose |
|---|---|
| `create_broker(name, credit_limit_rials)` | Creates a new Broker (e.g., `agency`), sets how far negative its balance may go (`credit_limit_rials`), and returns `{ broker_id, broker_mcp_url, broker_token }`[cite: 10]. |
| `list_brokers()` | Returns all Brokers with their current `balance_rials`, `credit_limit_rials`, `remaining_credit_rials`, `status` (`active` / `suspended`), and active employer count[cite: 10]. |
| `credit_broker(broker_id, amount_rials, note)` | Records an out-of-band payment received from a Broker (e.g., `+50,000,000 Toman` paid by the Agency to the Owner) and automatically unsuspends the Broker and its paused employments if `balance > -credit_limit`[cite: 10]. |
| `set_broker_credit_limit(broker_id, credit_limit_rials)` | Updates the credit line of a Broker[cite: 10]. |
| `stats_overview(period)` | Returns total employments, usage by meter, wholesale revenue accrued per broker, and LLM token spend per model[cite: 4, 10]. |
| `query_readonly(sql)` | Executes a read-only SQL query against the agent's database (row-capped, with secret/PII redaction)[cite: 4]. |

---

### 2.2 Plane 2: `/broker/mcp` (For Creating Employments & Managing Broker Billing)

Authenticated by `Authorization: Bearer <broker_token>`[cite: 10]:

| Tool | Purpose |
|---|---|
| `get_manifest()` | Returns the agent's Role description, capabilities, out-of-scope boundaries, required Employer Management/Wiring schema (`management_schema`), and wholesale meter pricing (`wholesale_catalog`)[cite: 1, 10]. |
| `ask_presales_question(question, context?)` | Answers a prospective Employer's question about what the agent can/cannot do using a read-only presales prompt[cite: 1, 10]. |
| `create_employer(label, initial_budget_cap_rials?)` | **The Hiring Act:** Creates a new `employment_id` under this Broker and returns `{ employment_id, employer_mcp_url, employer_token }`[cite: 10]. *(Note: No persona or avatar is asked here — that happens on `/employer/mcp`!)*[cite: 10] |
| `set_employer_budget_cap(employment_id, max_cumulative_rials)` | Sets or increases the maximum cumulative wholesale spend this Employment is allowed to charge the Broker's account (see §3.2)[cite: 10]. |
| `pause_employer(employment_id, reason)` / `resume_employer(employment_id)` | Allows the Broker to cut off or restore service to one of its Employers (e.g., when the Employer's retail balance at the Agency runs out)[cite: 10]. |
| `get_broker_account()` | Returns this Broker's current balance/debt with the Agent Owner (`balance_rials`, `credit_limit_rials`, `remaining_credit_rials`) plus a per-employer usage breakdown so the Broker knows exactly how much it owes the Agent Owner[cite: 10]! |

---

### 2.3 Plane 3: `/employer/mcp` (For Configuring Persona, Avatar, Behavior & Wiring)

Authenticated by `Authorization: Bearer <employer_token>` (each token is strictly bound to one `employment_id`)[cite: 10]:

| Tool | Purpose |
|---|---|
| `get_management_status()` | Returns the full schema of configurable management fields, which fields are currently filled, which tool connections (`wiring_slots`) are still `unwired` vs `connected`, and current readiness (`ready_to_activate: bool`)[cite: 10]. |
| `update_persona_and_avatar(persona_fields, avatar_url_or_b64?)` | Sets or updates the employee's name, age, temperament (`مزاج`), tone, signature, and profile image (`avatar`) for this employment[cite: 10]. If the caller needs help designing a persona or generating an image prompt, `suggest_persona_and_avatar_prompt()` provides HR-grounded defaults for the role[cite: 8, 10]! |
| `update_management_settings(settings_json)` | Updates role-specific behavioral fields defined in `docs/living/management.md` (e.g., schedules, news beat/RSS sources, business facts, FAQ entries, peer directives)[cite: 4, 10]. |
| `wire_token_slot(slot_name, secret_value, config_json?)` | Connects a token-based integration (e.g., `bale_bot_token`, `eitaayar_token`, `gitlab_token`, `wordpress_app_password`), validates it immediately with a live API ping, and stores the secret in the Agent's **Sealed Store** (never visible in plain text again)[cite: 7, 10]. |
| `wire_session_start(slot_name, phone_or_username)` | Starts an interactive login on the target agent for a persistent humanoid session (e.g., `eitaa_client`, `telegram_user`, `bale_user`) and returns `{ ticket, status: "OTP_REQUIRED" | "CAPTCHA_REQUIRED", captcha_image_b64? }`[cite: 7, 10]. |
| `wire_session_verify(ticket, otp_code?, captcha_solution?)` | Completes the humanoid login on the target agent and persists the session inside the target agent's isolated employment storage[cite: 7, 10]. |
| `configure_notifications(mode, webhook_url?, messenger_platform?, channel_or_group_id?)` | Configures how the agent sends outbound notifications/escalations to the Employer (see §2.4 below)[cite: 10]. |
| `get_employer_reports(period)` | Returns operational reports for this Employer (posts published, conversations handled, open escalations, usage count)[cite: 4, 5, 10]. |

#### How Token Creation on Behalf of Non-Technical Employers Works (`M5`)
In Voice 4 (`17:26`), you described a critical UX capability for non-technical Employers who don't know how to create a bot in `@BotFather` or generate an API token in a third-party platform[cite: 10]:
1. Each `wiring_slot` in `get_management_status()` declares a `slot_type` (e.g., `bale_bot_token`, `telegram_bot_token`, `gitlab_pat`) and step-by-step `manual_instructions_fa`[cite: 10].
2. When the **Calling Agent** (either **Codo** during `/employer` or the **Agency Agent** in chat) sees an unwired `slot_type`, it checks whether *it* (the Calling Agent) has an automated **Provisioner Tool** in its own toolset for that `slot_type` (such as `provision_bale_bot_via_botfather` or `provision_telegram_bot_via_botfather` from `workshop/tool-bank`)[cite: 7, 10]:
   - **If the Calling Agent HAS the Provisioner Tool:** It always asks the Employer first:
     > *«برای اتصال ربات بله، دو راه داری: (۱) راهنمای گام‌به‌گام بفرستم تا خودت در @BotFather توکن بگیری و بدهی، یا (۲) شماره موبایل و کد تأیید بله‌ات را بدهی تا من به نیابت از تو وارد شوم، ربات را در BotFather بسازم و توکنش را وصل کنم. کدام را ترجیح می‌دهی؟»*[cite: 10]
     If the Employer chooses (2), the Calling Agent logs in temporarily, creates the bot, passes the minted token into `wire_token_slot()` on `/employer/mcp`, and immediately discards the temporary login session[cite: 10]!
   - **If the Calling Agent DOES NOT have a Provisioner Tool for that platform:** It does not offer automated login; it guides the Employer using `manual_instructions_fa` (and web search if needed) until the Employer pastes the token[cite: 10].

---

### 2.4 Reverse Notifications: Target Agent → Employer (`M6`)

Because the target agent no longer has a dedicated management bot per employer, how does it push urgent alerts or escalations (e.g., *"A new person registered for your event!"* or *"Customer @ali asked a question I can't answer!"*) back to the Employer[cite: 10]?

Per Voice 5 (`17:33`), `codo-core` supports **two standard outbound notification sinks** on `/employer/mcp` via `configure_notifications()`[cite: 10]:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│              OUTBOUND NOTIFICATIONS (TARGET AGENT ──► EMPLOYER)                        │
├───────────────────────────────────────────┬────────────────────────────────────────────┤
│ Sink A: Webhook Push (`webhook_url`)      │ Sink B: Messenger Group/Channel (`chat_id`)│
├───────────────────────────────────────────┼────────────────────────────────────────────┤
│ • `/employer/mcp` receives a              │ • `/employer/mcp` tells the caller:        │
│   `webhook_url` + `webhook_secret`.       │   "Add my sender account/bot `@agent_bot`  │
│ • Whenever the agent emits an alert or    │   as Admin to a private group/channel and  │
│   escalation, it POSTs `{employment_id,   │   give me its numeric `channel_id`."       │
│   kind, message_fa, action_options}` to   │ • The Calling Agent (Agency or Codo) asks  │
│   `webhook_url`.                          │   the Employer:                            │
│ • **Best for Agency Hires:** The Agency   │   - **Option 1 (Manual):** Guides user to  │
│   automatically registers its own webhook │     create the group/channel, add the bot, │
│   URL when setting up the Employer! When  │     and get the numeric ID.                │
│   the target agent fires an alert, the    │   - **Option 2 (Auto-Provisioned):** Logs  │
│   Agency receives the webhook and sends   │     into the user's messenger via OTP,     │
│   the message straight to the Employer    │     creates the private group, adds the    │
│   inside the Agency's Bale Bot!           │     agent's bot as Admin, and passes the   │
│                                           │     numeric `channel_id` to `/employer/mcp`│
└───────────────────────────────────────────┴────────────────────────────────────────────┘
```

**Why supporting BOTH Sink A and Sink B is a huge win:**
- If an Employer rented the agent through the **Agency** and wants everything in one place, **Sink A (Webhook to Agency)** works with **zero group setup** — notifications appear right inside their existing Agency chat[cite: 10]!
- If the Employer wants notifications posted into their own private Bale/Telegram/Eitaa channel or team group (or is using Codo without an Agency), **Sink B (Numeric Channel/Group ID + Bot as Admin)** works natively on every messenger[cite: 10]!

---

## Part 3 — The Wholesale-Retail Broker Accounting Model & Safety Rails (`M9`)

### 3.1 How Your Broker Accounting Model Works (`18:45`)

In Voice 8 (`18:45`), you replaced direct Employer-to-Agent billing with a **Wholesale Broker Clearing Model**[cite: 10]:

1. **In-House Agents (`is_rented = False`):**
   - `Admin == Broker == Employer` (all three are the participant)[cite: 10].
   - Billing is completely inactive[cite: 10].
2. **Rented Agents (`is_rented = True`):**
   - **The Agent Owner only keeps accounts with Brokers, never with individual Employers!**[cite: 10]
   - When the Agent Owner creates a Broker via `/admin` (`create_broker(name="agency", credit_limit_toman=100_000_000)`), the Owner grants that Broker a **Wholesale Credit Line (`حد اعتباری`)**[cite: 10].
   - Whenever any Employer created by that Broker consumes a billable meter on the Agent (e.g., Neda publishes a post, or Hanieh handles a customer conversation), the Agent deducts the wholesale meter price from **the Broker's balance (`broker_balance`)**[cite: 10].
   - **Retail Collection is the Broker's Responsibility:** The Broker (e.g., the Agency) collects money from the Employer (using whatever pricing, bundles, haggling, or payment methods the Broker wants)[cite: 10].
   - **Cutting Off an Unpaid Employer:** If an Employer's retail balance with the Broker runs out, the Broker calls `pause_employer(employment_id)` on the Agent's `/broker/mcp`, so the Agent immediately stops serving that Employer and stops charging the Broker for them[cite: 10].
   - **Cutting Off an Unpaid Broker:** If a Broker's wholesale balance on the Agent drops to `-credit_limit` (e.g., `-100,000,000 Toman`), the Agent automatically **suspends the Broker AND pauses all Employers belonging to that Broker**[cite: 10].
   - **Out-of-Band Settlement:** The Broker checks how much it owes each Agent via `get_broker_account()` on `/broker/mcp`, pays the Agent Owner outside the platform, and the Agent Owner runs `/admin` → `credit_broker(broker_id, amount)` to restore the Broker's balance[cite: 10].

---

### 3.2 Honest Critique & Two Essential Safeguards for the Broker Model

You asked in Voice 8: *"All of these things came to me impromptu — if you know a better way or an improvement, suggest it."*[cite: 10]

**First, what is brilliant about your Broker model:**
It **completely removes Employer payment plumbing from participant-built Rented Agents**! Think about what this means for the workshop: a participant building a Reporter agent or a Support agent no longer has to apply for a Bale Wallet merchant token or build a Card-to-Card OCR audit queue just to rent their agent out. They simply define their **wholesale meter price** (e.g. `100,000 Toman per post`), register the **Agency** as a Broker, and let the **Agency** handle all retail payments from Employers[cite: 10]! (Payment tools like `bale_wallet` and `card_ocr` are now only needed inside agents whose *End-User Work Plane* collects money — such as the **Agency Agent** and the **Event Registration Agent**!)

**Second, two edge-case vulnerabilities in the raw Broker model — and how we fix them with two simple fields:**

#### Safeguard 1: The "Runaway / Buggy Agent" Problem → Fix with `employer_budget_cap`
- **The Risk:** Suppose a workshop participant builds an agent, gives your Agency a `100,000,000 Toman` credit line, and an Employer pays your Agency `500,000 Toman` to hire that agent. What if the participant's agent has a bug (or is malicious) and triggers 1,000 billable meter events in 10 minutes before the Agency realizes the Employer's `500,000 Toman` is gone? The Agent would claim your Agency now owes the developer `100,000,000 Toman`!
- **The Fix (Built into `/broker/mcp`):** When the Broker (the Agency) creates an Employer or when the Employer tops up at the Agency, the Agency passes **`set_employer_budget_cap(employment_id, max_cumulative_rials)`** to the Agent's `/broker/mcp`.
  - If the Employer paid the Agency `500,000 Toman` (and the Agency's wholesale share for the developer is `400,000 Toman`), the Agency sets `max_cumulative_rials = 4,000,000` on that `employment_id`.
  - The Agent's `codo-core` ledger automatically pauses that `employment_id` the exact instant its usage reaches `400,000 Toman`!
  - **Result:** Neither the Broker nor the Agent ever has to poll each other in real time to cut off an empty Employer, and a buggy agent can **never** charge your Agency a single Rial more than the Employer actually deposited!

#### Safeguard 2: The "Untrusted Broker" Option → `credit_limit = 0` (Prepaid Broker)
- **The Risk:** Workshop participants trust *you* (Omid's Agency), so they will happily set `credit_limit = 100,000,000 Toman` (postpaid credit line) for your Agency[cite: 10]. But what if a third-party stranger wants to become a Broker for an agent?
- **The Fix:** Using the exact same formula (`balance - usage >= -credit_limit`), if the Agent Owner sets **`credit_limit = 0`** for an unknown Broker and credits them `+5,000,000 Toman` upfront via `credit_broker()`, the exact same ledger acts as a **Prepaid Wallet** without a single extra line of code!
  - `credit_limit > 0` = **Postpaid Credit Line** (for trusted Brokers like your Agency)[cite: 10].
  - `credit_limit = 0` = **Prepaid Wallet** (for untrusted Brokers).

---

## Part 4 — The Revised Codo Pipeline & Answering Your Step-Order Question (`M4`, `M7`, `M8`)

### 4.1 Answering Your Question: Should "Management Capabilities" or "Tools" Come First After `/idea-core`? (`M7`)

In Voice 6 (`18:28`), you asked:
> *"After `/idea-core`, we go to Management Capabilities («قابلیت‌های مدیریتی») and Tools («ابزارها»). We need to decide the order of these two commands — one specifies what settings an employer/manager can change in the agent's behavior, and the other specifies what tools the agent connects to and how. Recommend which of these two should come first."*[cite: 10]

Let's look at the dependency between the two:
- Every Employer Management interface (`/employer/mcp`) has **two kinds of fields**[cite: 10]:
  1. **Behavioral & Identity Fields:** Persona (name, age, `مزاج`, tone), Avatar, Schedule times, Domain/Beat, Business Facts & FAQ, Wholesale meter prices (if rented)[cite: 10].
  2. **Tool & Notification Wiring Slots:** Which Bot Token (`bale_bot`), Humanoid SIM Login (`eitaa_client`, `telegram_user`), Companion API (`wordpress`), or Notification Channel/Webhook the Employer must wire up[cite: 10].
- Notice that **you cannot know the complete list of Employer Wiring Slots until you know which Tools the agent uses!** (For example, you only know the Employer needs to pass an Eitaa phone+OTP or a WordPress URL *after* `/tools` selects `eitaa_client` or `wordpress`!)

**Therefore, putting `/tools` («ابزارها») BEFORE `/manage-spec` (or `/employer-spec` — «قابلیت‌های مدیریتی») gives a 100% linear, zero-backtracking flow:**

```
[02] /idea-core    ──► Defines the Employee's single job title, duties, end-user interface,
                       and whether she is In-House or Rented.
         │
         ▼
[03] /tools        ──► Picks the external tools from `workshop/tool-bank` for the End-User
                       Work Plane (e.g. `bale_bot`, `eitaa_client`, `wordpress`, `rss_fetch`)
                       and security/sealed/approval rules.
         │
         ▼
[04] /employer-spec ──► («قابلیت‌های مدیریتی» — writes `docs/living/management.md`)
     (or `/manage-spec`) Knowing BOTH the role (`/idea-core`) and the tools (`/tools`), this step
                       cleanly defines everything `/employer/mcp` will expose:
                       1. Persona & Avatar slot rules (locked honesty/boundary rules vs editable traits)
                       2. Behavioral settings (schedules, topics, FAQ/RAG, peer directives)
                       3. Tool wiring slots (derived automatically from `/tools`!)
                       4. Notification sink options (Webhook vs Messenger Group/Channel)
                       5. Wholesale meters (only if Rented in `/idea-core`)
```

*(Note on naming: Using **`/manage-spec`** or **`/employer-spec`** — Persian label: **«قابلیت‌های مدیریتی»** — for step `[04]` completely avoids any confusion with the runtime floating command **`/employer`** «اسلش کارفرما»!)*[cite: 10]

---

### 4.2 The Complete V6.0 Pipeline (11 Linear Steps + 4 Floating Commands) (`M4`, `M7`, `M8`)

With `/persona` and `/avatar` removed from the build phase and moved into runtime Employer Management[cite: 10], the pipeline is tighter, faster, and uniform for both In-House and Rented agents:

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                     V6.0 UNIFIED AGENT PIPELINE (11 STEPS + FLOATING)                    │
└──────────────────────────────────────────────────────────────────────────────────────────┘

  [01] /start          ──► V4.1 setup: OS/Git/Python check, languages, workshop MCP, repo, proxy
         │
  [02] /idea-core      ──► Multi-round Q&A -> `docs/living/idea-core.md`
         │                 (1 job title, core duties, out-of-scope, End-User interface,
         │                  In-House vs Rented, own web screen?)
         │
  [03] /tools          ──► Search Tool Bank via MCP -> `docs/living/tools.md`
         │                 (End-user transports, bridges, companion services, sealed inputs,
         │                  approvals, rate limits; auto-adds `/admin/mcp`, `/broker/mcp`,
         │                  `/employer/mcp`, and optional `/work/mcp`)
         │
  [04] /manage-spec    ──► «قابلیت‌های مدیریتی» -> `docs/living/management.md`
         │                 (What an Employer configures via `/employer/mcp`: persona/avatar
         │                  rules, behavioral fields, tool wiring slots, notifications, and
         │                  — if Rented — wholesale meters & broker rules)
         │
  [05] /sops           ──► «رویه‌ها» -> `docs/living/sops.md` + `test-scenarios.md`
         │                 (3–5 SOPs, triggers, meter-emitting steps, debounce, media fallback)
         │
  [06] /edge-cases     ──► «موارد مرزی» -> `docs/living/edge-cases.md`
         │                 (Pressure test + 3 quality lenses: adversarial, edge cases, verification)
         │
  [06b] /ux → /design → /prototype   (ONLY if `/idea-core` said the End-User has a web screen/blog)
         │
  [07] /plan           ──► Fresh session: writes `docs/living/architecture.md`, `checklist.md`, `handoff.md`
         │
  [08] /build          ──► Fresh session: implements code on `codo-core`, migrations, unit tests
         │
  [09] /wire           ──► «راه‌اندازی و استخدام اول (محیط توسعه)»:
         │                 1. Starts local agent + WSS webhook relay (`<team>-dev.<domain>`)
         │                 2. Auto-creates `admin`, default `broker` (`self`), and first
         │                    `employer` (`self`) via `/broker/mcp`, saving tokens in
         │                    `docs/secrets/environments.local.md`
         │                 3. Connects to `/employer/mcp` to walk the participant through
         │                    setting Persona, Avatar (`assets/avatar.png`), behavioral fields,
         │                    and wiring tokens/OTPs for their first employment!
         │
  [10] /test           ──► Interactive evaluation of the SOPs against `test-scenarios.md` (soft gate)
         │
  [11] /deploy         ──► «انتشار روی سرور استیج»:
                           1. Pushes & deploys container on Coolify (`https://<name>.<domain>`)
                           2. Auto-provisions `staging` Admin, default Broker (`self`), and
                              first Employer (`self`) in `environments.local.md`
                           3. **Auto-replays the first Employer's Persona, Avatar, and management
                              settings from `local` onto `staging` via `/employer/mcp`!**
                           (If Rented, asks if the Owner also wants to mint a Broker token for
                            `agency` right now.)

  ─────────────────────────────────────────────────────────────────────────────────────────
  FLOATING COMMANDS (Available anytime after `/wire` / `/deploy`):
  • `/admin <request>`     ──► Calls `/admin/mcp` (manage brokers, broker credit, stats, DB)
  • `/broker <request>`    ──► Calls `/broker/mcp` (hire new employer, set budget cap, pause)
  • `/employer <request>`  ──► Calls `/employer/mcp` (change persona/avatar, wire tools, reports)
  • `/iterate`             ──► Version 0.2+ cycle
  • `/migrate`             ──► Post-workshop migration to personal VPS (updates `prod` in
                               `environments.local.md`)
  • `/add-idea`            ──► Captures future ideas for this employee into `roadmap.md`
```

---

### 4.3 Updated Progress Bar (`AGENTS.md`)

`پیشرفت: ✅ شروع · ➡️ هستهٔ ایده · ⬜ ابزار · ⬜ قابلیت‌های مدیریتی · ⬜ رویه‌ها · ⬜ موارد مرزی · ⬜ نقشه · ⬜ ساخت · ⬜ راه‌اندازی · ⬜ تست · ⬜ انتشار · ⬜ نسخهٔ بعد · ⬜ مهاجرت`

*(And the 3 persona commands `/admin`, `/broker`, and `/employer` are always available as floating commands without moving the progress bar)*[cite: 10].

---

## Part 5 — How the 4 Rehearsals Map onto the Unified 3-MCP Architecture

Let's verify that all 4 rehearsal projects work cleanly under this new model[cite: 1, 2, 3, 10]:

| Dimension | #1 Event Organizer (`event-organizer`) | #2 Neda Reporter (`neda-reporter`) | #3 Hanieh Support (`hanieh-support`) | #4 Agent Agency (`agent-agency`) |
|---|---|---|---|---|
| **In-House vs. Rented (`/idea-core`)** | **Rented** (`is_rented=True`)[cite: 1] | **Rented** (`is_rented=True`)[cite: 1, 3] | **Rented** (`is_rented=True`)[cite: 1, 2] | **In-House** (`is_rented=False`)[cite: 1, 10] |
| **Control Planes (Always the Same 3 MCPs!)** | `/admin/mcp`<br/>`/broker/mcp`<br/>`/employer/mcp`[cite: 10] | `/admin/mcp`<br/>`/broker/mcp`<br/>`/employer/mcp`[cite: 10] | `/admin/mcp`<br/>`/broker/mcp`<br/>`/employer/mcp`[cite: 10] | `/admin/mcp`<br/>`/broker/mcp` (`self` only)<br/>`/employer/mcp` (`self` only)[cite: 10] |
| **End-User Work Plane (Role-Specific)** | • `bale_bot` / `telegram_bot` (attendees chatting to register)<br/>• `/work/mcp` (personal AI assistants registering attendees)<br/>• `bale_wallet` & `card_ocr` (collecting ticket fees from attendees)[cite: 1] | • WordPress Blog companion (REST API)<br/>• `bale`, `telegram`, `eitaayar`, `rubika` channel publishers[cite: 3, 5] | • Humanoid 1-to-1 accounts (`bale_user` / `telegram_user`) answering customer DMs with debounce[cite: 2, 4] | • **`bale_bot`** serving two End-User groups:<br/>  1. **Developers** (listing their agents' `/broker/mcp` URL & token)<br/>  2. **Employers** (renting, paying via `bale_wallet`/`card_ocr`, and managing agents)[cite: 10] |
| **What `/employer/mcp` Configures (`management.md`)** | • Persona & Avatar<br/>• Event title, syllabus, date, capacity, ticket price, haggling band<br/>• Bot token (`wire_token_slot`)<br/>• Payment wallet/card for tickets<br/>• Notification webhook/group[cite: 1, 10] | • Persona & Avatar (e.g. Neda Navidi)<br/>• News beat, RSS feeds, schedule times<br/>• Channel admin/tokens (`wire_token_slot`)<br/>• Notification webhook/group[cite: 3, 10] | • Persona & Avatar (e.g. Hanieh Yavari)<br/>• Business facts, FAQ, peer directives<br/>• Humanoid SIM login (`wire_session_start/verify`)<br/>• Notification webhook/group (for escalations & receipt audits)[cite: 2, 10] | • Agency Persona & Avatar<br/>• Agency Bale Bot token (`wire_token_slot`)<br/>• Default retail commission % & welcome credit rules<br/>• Agency payment wallet/card[cite: 1, 10] |
| **Wholesale Meter on `/broker/mcp`** | Per confirmed paid registrant (or per active event day)[cite: 1, 10] | Per scheduled news run (`scheduled_run`) + monthly subscription[cite: 3, 10] | Per active customer conversation (`conversation`)[cite: 2, 10] | *None (In-House)*[cite: 10] |

---

### Trace: What Happens End-to-End When an Employer Rents & Manages "Event Organizer" via the Agency (`M3`, `M5`, `M6`, `M9`)

To confirm that every piece of `11-transcription.md` fits together without a single gap, here is the exact runtime lifecycle[cite: 10]:

1. **Developer Lists the Agent in the Agency:**
   - In `01-event-organizer`, the developer runs `/admin create a broker token for agency with 100M Toman credit limit`[cite: 10].
   - `event-organizer`'s `/admin/mcp` returns `{ broker_mcp_url: "https://event.workshop.ir/broker/mcp", broker_token: "brk_stg_agency_..." }`[cite: 10].
   - The developer opens the **Agency Bale Bot** (as a Supply-Side End-User of the Agency) and sends `broker_mcp_url` + `broker_token`[cite: 10].
   - The Agency calls `get_manifest()` on `event-organizer`'s `/broker/mcp`, saves the agent as `unverified`, and gives the developer a deep link[cite: 1, 10]. You (Omid) approve it via `/admin` in the Agency's Codo terminal[cite: 1, 10]. **COMMENT**: there is a notification channel where i'm notified of a new unverified agent.
1. **Employer Discovers & Rents the Agent in the Agency:**
   - An Employer (a course creator) chats with the **Agency Bale Bot** (as a Demand-Side End-User of the Agency), asks what the Event Organizer agent can do, and decides to rent it, topping up their retail balance in the Agency[cite: 1, 10].
   - The Agency calls `create_employer(label="course_creator_42", initial_budget_cap_rials=...)` on `event-organizer`'s `/broker/mcp`[cite: 10].
   - `event-organizer` returns `{ employment_id: "emp_42", employer_mcp_url: "https://event.workshop.ir/employer/mcp", employer_token: "emp_42_secret..." }`[cite: 10].
   - The Agency stores `{ employer_mcp_url, employer_token }` in the Employer's profile inside the Agency database AND displays them to the Employer: *"استخدام انجام شد! این آدرس MCP مدیریت و توکن اختصاصی توست؛ می‌توانی همین‌جا در آژانس مدیریتش کنی یا توکن را در کدو / ابزار خودت بگذاری."*[cite: 10]
3. **Employer Configures Persona, Avatar, Wiring & Notifications (Inside the Agency or in Codo):**
   - Suppose the Employer chooses to configure it right inside the Agency chat[cite: 10].
   - The Agency calls `get_management_status()` on `event-organizer`'s `/employer/mcp` using `emp_42_secret`[cite: 10].
   - It sees that `persona`, `avatar`, `event_details`, `bale_bot_token`, and `notifications` need configuration[cite: 10].
   - The Agency interviews the Employer for the persona, avatar, and event details, and calls `update_persona_and_avatar()` and `update_management_settings()` on `/employer/mcp`[cite: 10].
   - For `bale_bot_token`, the Agency asks: *"Do you want me to teach you how to get a token from `@BotFather`, or should I log into your Bale account via OTP and create the bot for you?"*[cite: 10] It wires the token via `wire_token_slot()`[cite: 10].
   - For `notifications`, the Agency either registers its own webhook (`configure_notifications(mode="webhook", webhook_url="https://agency.../webhooks/emp_42")`) so the Employer receives alerts right inside the Agency bot, **or** helps the Employer set up a private notification group/channel (`configure_notifications(mode="channel", channel_or_group_id=...)`)[cite: 10]!
4. **Ongoing Operation & Wholesale Settlement:**
   - As registrants sign up for the Employer's event, `event-organizer` deducts the wholesale meter fee from the `agency` Broker balance (capped by `emp_42`'s `budget_cap`) and fires registration notifications to the Employer[cite: 10].
   - Whenever you want to check how much your Agency owes each developer, you run `/admin show broker payables` in the Agency's Codo terminal (which calls `get_broker_account()` across listed agents)[cite: 10]! **COMMENT**: I think I should use /employer because it's a agent specific use case

---

## Part 6 — Decisions to Lock for Round 6

| # | Decision | Options | Recommendation |
|---|---|---|---|
| **R6-1** | The 3-MCP Control Plane Architecture (`/admin/mcp`, `/broker/mcp`, `/employer/mcp`)[cite: 10] | (a) Adopt across all agents (In-House and Rented) · (b) Keep separate bot management channels | **(a) Adopt across all agents** (§1.1–1.2) — unifies In-House and Rented 100%. |
| **R6-2** | Step order after `/idea-core` (`M7`)[cite: 10] | (a) `/idea-core` → **`/tools`** → **`/manage-spec` («قابلیت‌های مدیریتی»)** → `/sops` · (b) `/idea-core` → `/manage-spec` → `/tools` → `/sops` | **(a) `/tools` then `/manage-spec`** (§4.1) — because tool choices determine which token/OTP wiring slots the Employer must configure in `management.md`. |
| **R6-3** | Safeguard on the Wholesale Broker Ledger (`M9`)[cite: 10] | (a) `credit_limit` per Broker + **`employer_budget_cap` per Employer** · (b) `credit_limit` per Broker only | **(a) Include `employer_budget_cap`** (§3.2) — prevents a buggy or runaway agent from charging a Broker (like the Agency) more than the Employer actually paid. |
| **R6-4** | Outbound Notifications from Target Agent to Employer (`M6`)[cite: 10] | (a) Support **both** `webhook_url` (great for Agency relay) and `messenger_channel_id` (private group/channel where agent's bot is admin) · (b) Only `messenger_channel_id` | **(a) Support both in `codo-core`** (§2.4) — `webhook_url` makes notifications inside the Agency zero-setup, while `messenger_channel_id` covers standalone Codo/channel use. |
| **R6-5** | Payment gateways (`bale_wallet`, `card_ocr`, `payment_link`) placement | (a) Optional End-User Work-Plane tools in `tool-bank` / `codo-core.payments` (used by agents whose job collects money, like Agency & Event Organizer) · (b) Mandatory in every agent | **(a) Optional Work-Plane tools** (§3.2) — since Rented Agents settle wholesale through their Broker, ordinary rented agents no longer need to embed payment gateways! |