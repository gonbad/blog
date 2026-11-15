# V6.0.1 — Complete Architecture Specification

> **Status:** Authoritative Architecture for V6.0.1 (supersedes where conflicting: `V6.0/06-analysis-round4.md`, `V6.0.1/10-analysis-round5.md`, `V6.0.1/12-analysis-round6.md`).
> **Inputs:**
> - Voice notes & analyses in `09-transcription.md`, `10-analysis-round5.md`, `11-transcription.md`, `12-analysis-round6.md`, and `13-transcription.md`.
> - Organizer inline `**COMMENT**` annotations in `10-analysis-round5.md` and `12-analysis-round6.md`.
> - Organizer decisions on the 4 architectural questions (2026-10-19).
> - Existing codebase in `/home/omid/projects/workshop/agent/` and live staging server `82.39.165.56` (`agent.kiloapp.ir`).

---

## 1. Executive Summary & Architectural Decisions Locked in V6.0.1

| # | Area | Locked V6.0.1 Architectural Decision |
|---|---|---|
| **D1** | **Unified 3-MCP Control Plane** | Every Codo agent — whether **In-House (`is_rented=False`)** or **Rented (`is_rented=True`)** — exposes the exact same three control MCP endpoints over Streamable HTTP: **`/admin/mcp`**, **`/broker/mcp`**, and **`/employer/mcp`**, plus `GET /.well-known/agent.json`. There are no separate "management bots" or "management humanoid channels" anymore. |
| **D2** | **Fixed vs. Extensible MCP Schemas** | **`/admin/mcp`** and **`/broker/mcp`** are **100% fixed, universal schemas** built into `codo-core`. They never contain project-specific tools. **`/employer/mcp`** exposes universal management tools (persona, avatar, fields, wiring, notifications, reports) **plus** any project-specific employer tools declared with `@employer_tool` in the agent's codebase (e.g., the Agency agent's `list_unverified_agents`, `approve_listed_agent`, `show_broker_payables`, `record_developer_payout`). |
| **D3** | **Elimination of `#0`, `/persona`, `/avatar`, and `/hiring`** | Build-time `/persona`, `/avatar`, and `/hiring` commands and the special "Employment `#0` front desk" are removed. Persona, avatar, temperament (`مزاج`), behavioral fields, and account/channel credentials are **runtime Employer settings** configured via `/employer/mcp`. |
| **D4** | **Restored `/prd` and `/data-model` in Pipeline** | Because participants are building full software products (even when messenger-first), **`/prd`** (`docs/living/prd.md`) and **`/data-model`** (`docs/living/data-model.md`) return to the pipeline. Order: `/start` → `/idea-core` → `/prd` → `/tools` → `/manage-spec` → `/sops` → `/data-model` → `/edge-cases` → (`/ux` → `/design` → `/prototype` if screen) → `/plan` → `/build` → `/wire` → `/test` → `/deploy`. |
| **D5** | **`/wire` in Pipeline + 3 Floating Persona Commands** | **`/wire`** is the linear pipeline step after `/build` that starts the local agent + relay tunnel, auto-bootstraps 1 `admin`, 1 default `broker` (`self`), and 1 `employer` (`self`) in `docs/secrets/environments.local.md`, and walks the participant through configuring their first Employer via `/employer/mcp`. **`/deploy`** replays that first Employer's configuration onto `staging` automatically. **`/admin`**, **`/broker`**, and **`/employer`** are floating commands usable at any time. |
| **D6** | **Wholesale Broker Ledger + Per-Employer Budget Cap** | For Rented agents, billing between the Agent Owner and Employers clears exclusively through **Brokers** on `/broker/mcp`. Each Broker has a wholesale `credit_limit_rials` (set via `/admin/mcp`) and each Employment has an optional `budget_cap_rials` (set via `/broker/mcp`). Ordinary rented agents do **not** need payment gateways; payment tools (`bale_wallet`, `card_ocr`, `payment_link`) are End-User Work-Plane tools used only by agents whose job collects money from end-users (e.g. Agency, Event Organizer). |
| **D7** | **Outbound Notifications (Agent → Employer)** | Configured per employment on `/employer/mcp` via `configure_notifications`: supports **Sink A (`webhook_url`)** (ideal for Agency relay) and **Sink B (`messenger_channel_id`)** (a Bale/Telegram/Eitaa/Rubika channel or group numeric ID where the agent's sender bot/account is added as Admin). For example, the Agency agent notifies its Employer (Omid) in his notification channel whenever a new `unverified` agent is submitted. |
| **D8** | **Auxiliary Docker Images & WhatsApp (`WAHA`)** | The workshop MCP (`mcp-coolify`) exposes **`deploy_image`**, **`set_image_env`**, **`list_images`**, **`image_logs`**, and **`remove_image`** using Coolify's `/api/v1/applications/dockerimage` API, capped at **`MAX_AUX_IMAGES = 2`** per team, each routed behind one of the team's 5 subdomains. `tool-bank` ships a **`whatsapp-waha`** tool and documentation explaining WAHA Core (free) vs. WAHA Plus (paid), single-container-per-agent sizing, and QR screenshot login (`GET /api/screenshot`). |

---

## 2. System Topology: The 3 Control Planes + The 4th Work Plane

Every agent built with Codo and `codo-core` has the exact same four-plane topology:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                       CODO AGENT ARCHITECTURE (V6.0.1 — codo-core 0.2.0)                │
└─────────────────────────────────────────────────────────────────────────────────────────┘

  CALLERS (ایجنـت‌های فراخواننده):
  • Codo CLI floating commands: `/admin`, `/broker`, `/employer` (reads `environments.local.md`)
  • The Agent Agency (calls `/broker/mcp` to rent & `/employer/mcp` to configure on Employer's behalf)
  • External MCP Clients (ChatGPT, Claude Desktop, Custom Orchestrators)
         │
         ├─────────────────────────────┬─────────────────────────────┐
         ▼                             ▼                             ▼
  ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
  │  PLANE 1 (FIXED)    │     │  PLANE 2 (FIXED)    │     │  PLANE 3 (EXTENSIBLE│
  │  POST /admin/mcp    │     │  POST /broker/mcp   │     │  POST /employer/mcp │
  │  (شخصیت ادمین)      │     │  (شخصیت بروکر)      │     │  (شخصیت کارفرما)    │
  ├─────────────────────┤     ├─────────────────────┤     ├─────────────────────┤
  │ Auth: ADMIN_TOKEN   │     │ Auth: brk_<token>   │     │ Auth: emp_<token>   │
  │ (1 per environment) │     │ (1 per Broker row)  │     │ (1 per Employment)  │
  │                     │     │                     │     │                     │
  │ • create_broker     │     │ • get_manifest      │     │ Universal Tools:    │
  │ • list_brokers      │     │ • ask_presales      │     │ • get_management_   │
  │ • credit_broker     │     │ • create_employer   │     │   status            │
  │ • set_broker_       │     │   -> mints emp_id & │     │ • update_persona_   │
  │   credit_limit      │     │   `emp_<token>`     │     │   and_avatar        │
  │ • suspend_broker /  │     │ • list_employers    │     │ • set_field /       │
  │   resume_broker     │     │ • set_employer_     │     │   update_settings   │
  │ • stats             │     │   budget_cap        │     │ • wire_token_slot   │
  │ • employments_list  │     │ • pause_employer /  │     │ • wire_session_     │
  │ • events_tail       │     │   resume_employer   │     │   start / verify    │
  │ • query_readonly    │     │ • get_broker_account│     │ • configure_        │
  │ • confirm(token)    │     │                     │     │   notifications     │
  │                     │     │                     │     │ • pending_approvals │
  │                     │     │                     │     │ • resolve_approval  │
  │                     │     │                     │     │ • audit_queue /     │
  │                     │     │                     │     │   approve_receipt   │
  │                     │     │                     │     │ • get_reports       │
  │                     │     │                     │     │ + @employer_tool    │
  │                     │     │                     │     │   (job-specific!)   │
  └──────────┬──────────┘     └──────────┬──────────┘     └──────────┬──────────┘
             └───────────────────────────┼───────────────────────────┘
                                         ▼
                        ┌─────────────────────────────────┐
                        │   AGENT RUNTIME (`codo-core`)   │
                        │ • Multi-Employment Isolation    │
                        │ • Wholesale Broker Ledger       │
                        │ • Outbound Notification Router  │
                        │ • Scheduler & Debounced Engine  │
                        └────────────────┬────────────────┘
                                         │
                                         ▼
                        ┌─────────────────────────────────┐
                        │  PLANE 4 (ROLE-SPECIFIC)        │
                        │  END-USER WORK PLANE            │
                        ├─────────────────────────────────┤
                        │ • 4A: Messenger Bots            │
                        │   (`bale_bot`, `telegram_bot`,  │
                        │    `rubika_bot`, `eitaayar`)    │
                        │ • 4B: Humanoid Accounts         │
                        │   (`bale_user`, `telegram_user`,│
                        │    `eitaa_user`, `rubika_user`, │
                        │    `whatsapp_waha`)             │
                        │ • 4C: Web / Companion Services  │
                        │   (FastAPI UI, WordPress REST)  │
                        │ • 4D: `POST /work/mcp`          │
                        │   (For End-Users' Personal AI   │
                        │    Assistants via `@work_tool`) │
                        └─────────────────────────────────┘
```

### 2.1 How In-House and Rented Share 100% of the Runtime
- **Under the hood, every agent is multi-employment.**
- An **In-House (`is_rented = False`)** agent is simply an agent where:
  1. `Job.is_rented` is `False` (and `Job.meters` is empty).
  2. During `/wire` (for `local`) and `/deploy` (for `staging`), `codo-core bootstrap` automatically creates:
     - `admin` token (`ADMIN_TOKEN`),
     - 1 default Broker named `"self"` (`brk_...`, unlimited credit),
     - 1 default Employment (`emp_01`, named `"self"`) with its own `emp_...` token,
     and writes all three into `docs/secrets/environments.local.md`.
  3. Codo never bothers the participant of an In-House agent with Broker concepts; the participant uses `/employer` to configure their agent's persona, avatar, settings, notifications, and custom `@employer_tool` operations, and `/admin` for system-level DB/health checks.
- A **Rented (`is_rented = True`)** agent runs the exact same bootstrap for its first employment (`self`), **and** allows the Owner to mint additional Broker tokens (e.g., for `agency`) via `/admin` and create additional Employments via `/broker` (either from Codo or from the Agency Bot).

### 2.2 Why Agent-Specific Management Lives on `/employer/mcp` (Not `/admin/mcp`)
Per Organizer Decision #2 and the comments on `12-analysis-round6.md`:
- **`/admin/mcp`** is strictly infrastructure & wholesale-broker administration: managing Brokers, credit lines, global stats, and read-only SQL inspection. Its toolset is identical across every Codo agent.
- **`/employer/mcp`** is where an Employer operates and steers their hired instance of the agent. When an agent has domain-specific management actions — for example:
  - In **Agent Agency (`04-agent-agency`)**: listing unverified agents (`list_unverified_agents`), approving or suspending a listed agent (`approve_listed_agent`), checking how much the Agency owes each agent developer (`show_broker_payables`), or recording a payout (`record_developer_payout`);
  - In **Event Organizer (`01-event-organizer`)**: exporting the attendee list (`export_registrants`) or broadcasting a reminder to attendees (`broadcast_to_attendees`);
  - In **Neda Reporter (`02-neda-reporter`)**: ordering an off-schedule breaking-news article (`order_breaking_post`);
  these are declared in `backend/app/tools/` using the **`@employer_tool`** decorator and mounted automatically onto `/employer/mcp`!
- Consequently, when you (Omid) receive a notification in your Bale notification channel that a new `unverified` agent was submitted to the Agency, or when you want to check your Agency's payables to developers, you run **`/employer approve agent neda-reporter`** or **`/employer show broker payables`**.

---

## 3. Detailed Specification of the MCP Endpoints & Discovery Card

### 3.1 Public Discovery Card: `GET /.well-known/agent.json`
Served by every Codo agent (unauthenticated GET) so any Broker/Agency or directory can inspect public metadata:
```json
{
  "protocol_version": "codo-agent/6.0.1",
  "slug": "event-organizer",
  "title": "مسئول ثبت‌نام و هماهنگی رویداد",
  "is_rented": true,
  "endpoints": {
    "admin_mcp": "/admin/mcp",
    "broker_mcp": "/broker/mcp",
    "employer_mcp": "/employer/mcp",
    "work_mcp": "/work/mcp"
  },
  "capabilities": {
    "summary": "...",
    "boundaries": "...",
    "referral": "https://ble.ir/workshop_ai"
  },
  "management_schema": {
    "persona_editable": ["name", "age", "bio", "temperament", "voice", "avatar", "signature"],
    "fields": [
      {"key": "event_title", "kind": "text", "label": "عنوان رویداد", "required": true},
      {"key": "ticket_price_toman", "kind": "number", "label": "هزینه ثبت‌نام (تومان)", "required": true}
    ],
    "wiring_slots": [
      {
        "slot": "customer_bot",
        "kind": "bale_bot",
        "mechanism": "bot",
        "required": true,
        "instructions_fa": "در بله به @BotFather پیام دهید، ربات بسازید و توکن آن را بدهید."
      }
    ],
    "notification_modes": ["webhook", "channel"]
  },
  "wholesale_catalog": {
    "currency": "IRR",
    "meters": [
      {"name": "paid_registration", "label": "ثبت‌نام قطعی", "price_toman": 50000, "price_rials": 500000, "free": 2}
    ]
  }
}
```

### 3.2 Plane 1: `POST /admin/mcp` (100% Fixed Schema in `codo_core.admin`)
Authenticated via header `Authorization: Bearer <ADMIN_TOKEN>`. Write tools require `confirm(confirm_token)` unless called with `auto_confirm=True` by `codo-core bootstrap`.

| Tool Name | Signature | Description |
|---|---|---|
| `stats()` | `() -> dict` | Returns counts of brokers, employments (by status), customers, pending approvals, scheduled jobs, and total wholesale revenue/debt. |
| `create_broker` | `(name: str, credit_limit_toman: int | None = None, confirm_ immediately: bool = False) -> dict` | Creates a new Broker row, mints a fresh `brk_<token>`, stores its SHA-256 hash in `brokers.token_hash`, and returns `{"broker_id", "name", "broker_mcp_url", "broker_token", "credit_limit_toman"}`. (`credit_limit_toman=None` means unlimited credit, used for `"self"`). |
| `list_brokers` | `() -> list[dict]` | Lists all Brokers: `id`, `name`, `status` (`active`/`suspended`), `balance_toman` (can be negative up to `-credit_limit_toman`), `credit_limit_toman`, `remaining_credit_toman`, `employments_count`. |
| `credit_broker` | `(broker_id_or_name: str, amount_toman: int, note: str = "") -> dict` | Records an out-of-band settlement payment received from a Broker (`+amount_toman` in `broker_ledger`). If the Broker was `suspended` due to hitting `-credit_limit` and its new balance is above `-credit_limit`, automatically restores Broker to `active` and resumesemployments that were paused for `broker_credit_exhausted`. Requires `confirm`. |
| `set_broker_credit_limit` | `(broker_id_or_name: str, credit_limit_toman: int | None) -> dict` | Updates a Broker's credit limit (`0` = prepaid only, `>0` = postpaid credit line, `None` = unlimited). Requires `confirm`. |
| `set_broker_status` | `(broker_id_or_name: str, status: Literal["active", "suspended"], reason: str = "") -> dict` | Suspends or resumes a Broker and cascades pause/resume to all its employments. Requires `confirm`. |
| `employments_list` | `(broker_id_or_name: str = "") -> list[dict]` | Lists all employments across the agent (optionally filtered by broker): `id`, `no`, `label`, `broker_name`, `status`, `spent_toman`, `budget_cap_toman`, `created_at`. |
| `events_tail` | `(employment_id: str = "", limit: int = 30) -> list[dict]` | Recent audit events across the agent. |
| `query_readonly` | `(sql: str) -> list[dict]` | Runs a read-only `SELECT` query (row-capped at 100, masks any column containing `token`, `secret`, `hash`, `cipher`). |
| `confirm` | `(token: str) -> dict` | Confirms and executes a pending write action within 10 minutes. |

### 3.3 Plane 2: `POST /broker/mcp` (100% Fixed Schema in `codo_core.broker`)
Authenticated via header `Authorization: Bearer <brk_token>`. The middleware resolves the `Broker` row from `sha256(brk_token)` and injects `current_broker` into the request context. Every tool is strictly scoped to `current_broker.id`.

| Tool Name | Signature | Description |
|---|---|---|
| `get_manifest` | `() -> dict` | Returns the full agent manifest (same payload as `/.well-known/agent.json`). |
| `ask_presales_question` | `(question: str, prospect_context: str = "") -> dict` | Wakes the agent's LLM in a read-only `PRESALES` stance using `idea-core.md` + `prd.md` + `management.md` to answer nuanced presales questions ("Can she translate English RSS feeds?") without mutating state. |
| `create_employer` | `(label: str, initial_budget_cap_toman: int | None = None) -> dict` | **The Hiring Act:** Verifies `current_broker.status == "active"`. Creates a new `Employment` row bound to `current_broker.id` in `draft` (onboarding) status, mints a fresh `emp_<token>`, and returns `{"employment_id", "no", "label", "employer_mcp_url", "employer_token", "budget_cap_toman"}`. |
| `list_employers` | `() -> list[dict]` | Lists all employments created by `current_broker`: `employment_id`, `no`, `label`, `status`, `spent_toman`, `budget_cap_toman`, `ready_to_activate`, `created_at`. |
| `set_employer_budget_cap` | `(employment_id: str, budget_cap_toman: int | None) -> dict` | Sets or updates the maximum cumulative wholesale spend (`budget_cap_rials`) this employment is allowed to charge to `current_broker`. If the employment was `paused_budget_cap` and the new cap exceeds `spent_rials`, automatically restores it to `active`. |
| `pause_employer` | `(employment_id: str, reason: str = "paused_by_broker") -> dict` | Pauses an employment owned by `current_broker` (e.g. when the Employer's retail balance at the Agency runs out). |
| `resume_employer` | `(employment_id: str) -> dict` | Resumes a paused employment owned by `current_broker` (provided the Broker itself is not `suspended` and the employment is below its `budget_cap`). |
| `rotate_employer_token` | `(employment_id: str) -> dict` | Mints and returns a new `emp_<token>` for an employment owned by `current_broker` if the Employer lost or compromised their token. |
| `get_broker_account` | `(limit_ledger: int = 30) -> dict` | Returns `current_broker`'s wholesale financial statement with this Agent Owner: `balance_toman` (negative = Broker owes Owner), `credit_limit_toman`, `remaining_credit_toman`, `status`, per-employer spend breakdown, and recent `broker_ledger` entries. |

### 3.4 Plane 3: `POST /employer/mcp` (Universal Schema + `@employer_tool` Extensions in `codo_core.employer`)
Authenticated via header `Authorization: Bearer <emp_token>`. The middleware resolves the `Employment` row from `sha256(emp_token)` and injects `current_employment` into the request context. Every call is strictly isolated to `current_employment.id`.

#### A. Universal Employer Tools (Present on Every Agent)

| Tool Name | Signature | Description |
|---|---|---|
| `get_management_status` | `() -> dict` | Returns the complete configuration state of `current_employment`: `employment_id`, `status` (`draft`/`active`/`paused`), `persona`, `editable_persona_fields`, `fields_schema`, `current_fields` (secrets masked as `(sealed)`), `wiring_slots` (each with `slot`, `kind`, `mechanism`, `required`, `status`: `unwired`/`connected`/`login_pending`, `instructions_fa`), `notifications` config, `missing_requirements: list[str]`, and `ready_to_activate: bool`. |
| `suggest_persona_and_avatar_prompt` | `(employer_brand_hint: str = "", preferred_gender: str = "") -> dict` | Returns HR-grounded suggested persona values (`name`, `age`, `temperament`, `voice`, `bio`, `signature`) fitting the job role and an image-generation prompt for the avatar. |
| `update_persona_and_avatar` | `(name: str = "", age: int | None = None, temperament: str = "", voice: str = "", bio: str = "", signature: str = "", avatar_url_or_path: str = "") -> dict` | Updates editable persona fields (enforcing `PersonaSlot.editable` and preserving locked honesty/boundary rules). If a bot or humanoid account is already wired and supports profile updates, syncs display name/photo. |
| `update_management_settings` | `(settings: dict[str, Any]) -> dict` | Bulk-validates and updates behavioral fields defined in `Job.fields` (e.g. `schedule`, `topics`, `rss_sources`, `ticket_price_toman`). Secret fields (`kind="secret"`) are automatically encrypted into `SealedBlob` (`env_...`). If all required fields and wiring slots are now satisfied, transitions status from `draft` to `active`. |
| `set_field` | `(key: str, value: Any) -> dict` | Single-field alias of `update_management_settings({key: value})`. |
| `add_knowledge_entry` | `(key: str, content: str) -> dict` | Adds or updates a business fact / FAQ entry in `Fact(scope="employment", scope_id=emp.id)` so the employer can teach the employee at runtime. |
| `list_knowledge_entries` | `() -> list[dict]` | Lists all knowledge/FAQ entries taught to this employment. |
| `delete_knowledge_entry` | `(key: str) -> dict` | Deletes a knowledge/FAQ entry from this employment. |
| `wire_token_slot` | `(slot: str, token_value: str, extra_config: dict[str, Any] | None = None) -> dict` | Connects a token-based account or companion slot (`bale_bot`, `telegram_bot`, `rubika_bot`, `eitaayar`, `wordpress`, etc.). Encrypts `token_value` into `SealedBlob`, verifies connectivity (`getMe` / API ping), registers the employment-scoped webhook (`/hook/{slot}/{emp_id}/{secret}`) if it is a bot, updates `emp.accounts[slot]`, and auto-activates the employment if ready. |
| `wire_session_start` | `(slot: str, phone: str = "") -> dict` | Starts an interactive login for a humanoid account slot (`bale_user`, `telegram_user`, `eitaa_user`, `rubika_user`, or `whatsapp_waha`). Returns `{"ticket", "step": "otp_required" | "captcha_required" | "qr_required", "hint", "image_b64"}` (for WAHA QR code or Eitaa/Bale captcha). |
| `wire_session_verify` | `(slot: str, ticket: str = "", code: str = "", password: str = "") -> dict` | Completes the humanoid login (or checks WAHA QR scan completion), persists the encrypted session under `data/sessions/{emp_id}/{slot}/`, starts the employment's poller/webhook for that slot, and marks `emp.accounts[slot]` as `connected`. |
| `configure_notifications` | `(mode: Literal["webhook", "channel", "none"], webhook_url: str = "", webhook_secret: str = "", account_slot: str = "", channel_or_group_id: str = "") -> dict` | Configures Reverse Notifications (Agent → Employer). In `"webhook"` mode, registers `webhook_url` (+ optional `webhook_secret` for HMAC-SHA256). In `"channel"` mode, records the numeric `channel_or_group_id` and `account_slot`, and sends a test ping message `"🔔 اتصال کانال اعلان کارفرما برقرار شد."` to verify the bot/account has admin post rights in that group/channel! |
| `test_notification` | `(message: str = "پیام آزمایشی اعلان کارفرما") -> dict` | Sends a test notification through the configured notification sink (`webhook` or `channel`) and returns delivery status. |
| `pending_approvals` | `() -> list[dict]` | Lists pending deferred-tool approval requests (`code`, `conversation_id`, `tools`, `expires_at`) for this employment. |
| `resolve_approval` | `(code: str, approved: bool = True, note: str = "") -> dict` | Approves or rejects a pending approval request via `/employer/mcp` (in addition to numeric code reply on notifications), resuming the paused Pydantic AI run. |
| `escalations_list` | `() -> list[dict]` | Lists customer conversations currently escalated to the employer (`conversation_id`, `customer_name`, `chat_id`, `question`, `last_message_at`). |
| `reply_to_escalation` | `(conversation_id: str, reply_text: str) -> dict` | Sends `reply_text` to the escalated customer through the employment's customer transport and resolves the escalation. |
| `audit_queue` | `() -> list[dict]` | Lists pending receipt OCR items (`audit_items`) for this employment (used when the employment's Work Plane collects `card_ocr` payments from end-users). |
| `approve_receipt` | `(audit_id: str) -> dict` | Marks an end-user receipt in `audit_items` as `approved`. |
| `reject_receipt` | `(audit_id: str, reason: str = "") -> dict` | Rejects a fraudulent end-user receipt in `audit_items` and reverses provisional credit. |
| `get_employer_reports` | `(period_days: int = 7) -> dict` | Returns operational metrics for this employment: conversations handled, messages sent, SOP runs completed, meter units consumed, current `spent_toman` vs `budget_cap_toman`, and recent events. |

#### B. Project-Specific Employer Tools (`@employer_tool`)
Any function in `backend/app/tools/` decorated with `@employer_tool` is automatically registered as an MCP tool on `/employer/mcp` with `emp: Employment` injected as its first argument (`ctx: EmployerCtx`):
```python
from codo_core import employer_tool, EmployerCtx

@employer_tool
async def approve_listed_agent(ctx: EmployerCtx, slug: str, welcome_credit_toman: int = 500_000) -> dict:
    """(Agency-specific) Approve an unverified agent so it is promoted in the public catalog."""
    ...
```
This keeps `/admin/mcp` and `/broker/mcp` 100% uniform while giving `/employer/mcp` unlimited expressive power for job-specific employer workflows.

### 3.5 Plane 4D (Optional): `POST /work/mcp` (`codo_core.work`)
When `/idea-core` / `/tools` specifies that End-Users' **personal general-purpose AI assistants** can interact with this employee programmatically (`enable_work_mcp = True` on `Job`), `codo-core` mounts `POST /work/mcp`:
- **Authentication:** `Authorization: Bearer <work_token>` (or `X-Employment-Id` if public presales/registration is allowed by `Job.work_mcp_public = True`). Each Employer can mint/view their `work_token` via `/employer/mcp` (`get_work_mcp_info()`).
- **Tools Exposed:**
  1. `ask_employee(question_or_request: str, end_user_id: str = "assistant_user", end_user_name: str = "") -> dict`: Runs the customer message SOP for that `end_user_id` and returns the employee's response.
  2. Any deterministic end-user tool decorated with **`@work_tool`** in `backend/app/tools/` (e.g., `list_event_details()`, `register_attendee(full_name, phone)` in Event Organizer).
- Zero admin, broker, or employer tools are ever exposed on `/work/mcp`.

---

## 4. The Git-Ignored Environments File & Bootstrap / Replay Lifecycle

### 4.1 `docs/secrets/environments.local.md`
Every Codo project has `docs/secrets/environments.local.md` (git-ignored, with committed template `docs/secrets/environments.local.md.example`). It holds a fenced `yaml` block managed by `codo-core` and read by Codo's `/wire`, `/deploy`, `/migrate`, `/admin`, `/broker`, and `/employer` commands:

```markdown
# محیط‌ها و توکن‌های دسترسی (محرمانه — هرگز در گیت ذخیره نشود)

این فایل نشانی‌ها و توکن‌های سه شخصیت (`admin`، `broker`، `employer`) را در هر محیط (`local`، `staging`، `prod`) نگه می‌دارد.

```yaml
default_environment: local
is_rented: true

environments:
  local:
    base_url: "https://p01-dev.agent.kiloapp.ir"
    local_url: "http://127.0.0.1:8000"
    admin:
      mcp_url: "http://127.0.0.1:8000/admin/mcp"
      token: "adm_loc_..."
    brokers:
      - name: "self"
        broker_id: "brk_01"
        mcp_url: "http://127.0.0.1:8000/broker/mcp"
        token: "brk_loc_self_..."
        credit_limit_toman: null
    employers:
      - name: "self"
        employment_id: "emp_01"
        mcp_url: "http://127.0.0.1:8000/employer/mcp"
        token: "emp_loc_01_..."

  staging:
    base_url: "https://neda.agent.kiloapp.ir"
    admin:
      mcp_url: "https://neda.agent.kiloapp.ir/admin/mcp"
      token: "adm_stg_..."
    brokers:
      - name: "self"
        broker_id: "brk_01"
        mcp_url: "https://neda.agent.kiloapp.ir/broker/mcp"
        token: "brk_stg_self_..."
        credit_limit_toman: null
    employers:
      - name: "self"
        employment_id: "emp_01"
        mcp_url: "https://neda.agent.kiloapp.ir/employer/mcp"
        token: "emp_stg_01_..."
```
```

### 4.2 Local Bootstrap During `/wire` (`codo-core bootstrap --env local`)
1. `/wire` starts the local agent + WSS tunnel (`./run.sh start`).
2. `/wire` runs `codo-core bootstrap --env local`:
   - Reads or generates `SEAL_KEY` and `ADMIN_TOKEN` in `docs/secrets/agent.local.md` and `backend/.env`.
   - Calls the running local agent (`http://127.0.0.1:8000`) to ensure default Broker `"self"` (`credit_limit_rials=None`) and default Employer `"self"` (`emp_01`) exist, and writes their URLs and tokens into `docs/secrets/environments.local.md` under `environments.local`.
3. `/wire` then connects to `environments.local.employers["self"].mcp_url` (`/employer/mcp`) and walks the participant through configuring their first employment (`self`):
   - Setting Persona & Avatar (`update_persona_and_avatar`, saving `assets/avatar.png`),
   - Setting behavioral fields (`update_management_settings`),
   - Wiring tokens/sessions (`wire_token_slot` / `wire_session_start` & `wire_session_verify`),
   - Configuring notifications (`configure_notifications`).
4. Every setting and sealed credential reference configured on `local` Employer `"self"` is also saved as a local snapshot in `docs/secrets/first-employer-snapshot.local.json` (git-ignored) so `/deploy` can replay it onto `staging` with zero re-typing!

### 4.3 Automatic Replay onto `staging` During `/deploy` (`codo-core replay-employer --from local --to staging`)
When the participant runs `/deploy`:
1. Codo pushes the code, sets the staging environment variables (`SEAL_KEY`, `ADMIN_TOKEN`, `LLM_*`, `PIP_INDEX_URL`, `APP_URL`), and deploys the app on Coolify at `https://<subdomain>.<base_domain>`.
2. Once `https://<subdomain>.<base_domain>/health` returns `200 OK`, Codo runs `codo-core replay-employer --from local --to staging`:
   - Connects to `https://<subdomain>.<base_domain>/admin/mcp` with the staging `ADMIN_TOKEN`,
   - Mints the staging `"self"` Broker token and staging `"self"` Employer token, saving them under `environments.staging` in `docs/secrets/environments.local.md`,
   - Replays `update_persona_and_avatar`, `update_management_settings`, `add_knowledge_entry`, `wire_token_slot`, and `configure_notifications` from the `local` `"self"` Employer onto the `staging` `"self"` Employer automatically!
   - flips `default_environment: staging` in `docs/secrets/environments.local.md`.
   - If `is_rented == True`, asks the participant if they also want to create a Broker token for `agency` right now.

### 4.4 How the 3 Floating Persona Commands Work (`/admin`, `/broker`, `/employer`)
- Instead of requiring the user to restart their IDE/OpenCode every time a new Employer or Broker token is minted, `codo-core` provides a universal CLI bridge:
  **`codo-core mcp-call <persona> <tool_name> '<json_args>' [--env local|staging|prod] [--name self|agency|...]`**
  which reads `docs/secrets/environments.local.md`, selects the target environment (`default_environment` unless specified in the user's request), picks the right `mcp_url` and `token` for `admin`, `broker[name]`, or `employer[name]`, and invokes the Streamable HTTP MCP endpoint directly!
- If multiple Employers (or Brokers) exist in that environment and the user didn't specify which one in `/employer <request>` (or `/broker <request>`), the command lists the available names from `environments.local.md` and asks which one to use. If only `"self"` exists, it uses `"self"` automatically without asking.

---

## 5. Wholesale Broker Accounting & Per-Employer Budget Cap

### 5.1 Financial Flows in V6.0.1
1. **In-House Agents (`is_rented = False`):**
   - `Admin == Broker ("self") == Employer ("self")`.
   - No meters are charged; billing gates are no-ops.
2. **Rented Agents (`is_rented = True`):**
   - The Agent Owner keeps financial accounts **only with Brokers** (`brokers` and `broker_ledger` tables), never with individual Employers.
   - The Owner's own `"self"` Broker has `credit_limit_rials = None` (unlimited), so the Owner can create free employments for themselves or friends via `/broker` in Codo.
   - External Brokers (such as the **Agent Agency**) are created via `/admin` with a specific `credit_limit_toman` (e.g., `100,000,000 Toman` = `1,000,000,000 Rials` postpaid credit line, or `0` for a prepaid-only Broker that must top up first).
   - When an Employment created by Broker $B$ completes a metered SOP step (charging $C$ Rials after any free units in `Meter.free`):
     - **Gate 1 (Per-Employer Budget Cap):** If `emp.budget_cap_rials is not None` and `emp.spent_rials + C > emp.budget_cap_rials`:
       - The charge is refused, `emp.status` flips to `"paused_budget_cap"`, and both the Employer (via notification sink) and Broker are notified.
     - **Gate 2 (Broker Wholesale Credit Limit):** If `broker.credit_limit_rials is not None` and `broker.balance_rials - C < -broker.credit_limit_rials`:
       - The charge is refused, `broker.status` flips to `"suspended"`, **all active employments under that Broker flip to `"paused_broker_credit"`**, and the Agent Owner + Employer are notified.
     - **Commit:** If both gates pass, `emp.spent_rials += C`, `broker.balance_rials -= C`, and an immutable `BrokerLedgerEntry(kind="charge", broker_id=B.id, employment_id=emp.id, amount_rials=C, balance_after_rials=broker.balance_rials)` is inserted inside a serializable lock.
3. **Why Ordinary Rented Agents Never Need Payment Gateways:**
   - Because retail collection from Employers happens inside the **Broker** (e.g., the Agency Bot collects money from Employers via `bale_wallet` or `card_ocr`, takes its retail margin, and calls `set_employer_budget_cap` / `pause_employer` on the Rented Agent's `/broker/mcp`), a workshop participant building Neda or Hanieh does **not** need a Bale Wallet merchant token or Card OCR setup!
   - Payment tools (`bale_wallet`, `card_ocr`, `payment_link`) are used **only** when the agent's own **End-User Work Plane** collects money from End-Users (such as the **Agent Agency** collecting from Employers/Developers, or the **Event Organizer** collecting ticket fees from event registrants).

---

## 6. Credential Wiring, Automated Provisioners & Reverse Notifications

### 6.1 Three-Tier Credential & Session Wiring on `/employer/mcp`
When an Employer configures an unwired slot in `get_management_status()` (either from Codo via `/employer` or inside the Agency Bot):
1. **Tier 1 — Direct Token Paste (`wire_token_slot`):**
   - For `bale_bot`, `telegram_bot`, `rubika_bot`, `eitaayar`, `wordpress`, GitLab PAT, etc.
   - If called from Codo `/employer`, the participant writes the token in `docs/secrets/accounts.local.md` and Codo passes it to `wire_token_slot`.
   - If called through the Agency Bot, the Agency's ingress interceptor seals the token (`inp_...`), passes it to the target agent's `wire_token_slot`, and never exposes it to the Agency's LLM history.
2. **Tier 2 — Calling-Agent Automated Provisioning (Optional Convenience via `botfather-provisioner`):**
   - If the Employer needs a `bale_bot` or `telegram_bot` token and does not know how to use `@BotFather`, **and** the Calling Agent (Codo or the Agency Agent) has the `botfather-provisioner` tool from `workshop/tool-bank`, the Calling Agent asks:
     > *«می‌خواهی راهنمای گام‌به‌گام بفرستم تا خودت در @BotFather توکن بگیری، یا شماره موبایل و کد تأیید را بدهی تا من به نیابت از تو وارد شوم، ربات را بسازم و توکنش را وصل کنم؟»*
   - If the Employer chooses automated creation, the Calling Agent logs in temporarily with Phone + OTP, messages `@BotFather` to create the bot and set its name/avatar, passes the minted token to `wire_token_slot` on the target agent's `/employer/mcp`, and **immediately logs out and deletes the temporary user session**.
   - If the Calling Agent does **not** have an automated provisioner for a platform (e.g. GitLab or Eitaayar), it never offers automated login; it teaches the user step-by-step using `instructions_fa` (and web search if needed).
3. **Tier 3 — Target-Agent Persistent Humanoid Login (`wire_session_start` / `wire_session_verify`):**
   - For persistent humanoid accounts (`bale_user`, `telegram_user`, `eitaa_user`, `rubika_user`, `whatsapp_waha`).
   - Here the Calling Agent (Agency or Codo) does **not** log in itself; it relays `phone` → `wire_session_start` and `otp_code` (or returns the WAHA QR screenshot image) → `wire_session_verify` directly to the **target agent's `/employer/mcp`**, which creates and stores the encrypted session in its own `data/sessions/{emp_id}/{slot}/`.

### 6.2 Reverse Notifications (`codo_core.notifications`)
Whenever the target agent needs to notify an Employer (e.g. a customer escalation, a pending approval code, a new event registration, a budget-cap warning, or — in the Agency agent — a newly submitted `unverified` agent):
`Engine._notify_manager(emp, text, kind="alert", payload=None)` dispatches to `emp.notifications`:
- **Sink A — Webhook Push (`mode == "webhook"`):**
  - Sends an HTTP `POST` to `emp.notifications["webhook_url"]` with JSON body:
    ```json
    {
      "event": "employer.notification",
      "agent_slug": "event-organizer",
      "employment_id": "emp_42",
      "kind": "escalation | approval | alert | custom",
      "message": "...",
      "approval_code": "4821",
      "payload": {},
      "timestamp": "2026-10-19T12:00:00Z"
    }
    ```
  - Includes header `X-Codo-Signature: sha256=<hmac>` if `webhook_secret` is set.
  - When an Employer rents an agent through the **Agency Bot**, the Agency automatically registers its own webhook endpoint (`https://<agency-domain>/webhooks/agency-notify/{emp_id}`) on the target agent's `/employer/mcp` so the Employer receives all alerts and approval codes right inside their Agency Bot chat!
- **Sink B — Messenger Group / Channel (`mode == "channel"`):**
  - Uses the specified `account_slot` driver (or the employment's default bot/humanoid driver) to send `text` to `emp.notifications["channel_or_group_id"]` (where the Employer has added the agent's bot/account as an Admin).
  - If the Employer Replies to that message in the group with the 4-digit approval code (or sends the code via `/employer`), `codo-core` resolves the pending approval!

---

## 7. Auxiliary Docker Images via Workshop MCP & WhatsApp (`WAHA`) Architecture

### 7.1 Why Auxiliary Docker Images Are Needed on the Workshop Server
Per `13-transcription.md` and Organizer Decision #3:
- Participants do **not** run Docker on their laptops (`00-rules.md`).
- Yet some agents require a companion container with an HTTP API during `/wire`, `/test`, and `/deploy` — most notably:
  1. **WAHA (`devlikeapro/waha`)** — WhatsApp HTTP API (for WhatsApp humanoid accounts via QR scan).
  2. **WordPress (`wordpress:6.7-apache` or similar)** — for Neda's blog companion.
  3. Any other API-drivable Docker Hub image a participant's product needs.
- Each team already has up to **`MAX_SUBDOMAINS = 5`** subdomains (`<name>.agent.kiloapp.ir`).
- By adding **Auxiliary Image Tools** to `mcp-coolify` backed by Coolify v4.3.16's verified `POST /api/v1/applications/dockerimage` endpoint, a participant's Codo assistant can deploy up to **`MAX_AUX_IMAGES = 2`** pre-built Docker images on the staging server, attach one of the team's claimed subdomains to each, configure environment variables and persistent volumes, and immediately talk to `https://<aux-subdomain>.agent.kiloapp.ir` from both the laptop (during `/wire` and `/test`) and staging (during `/deploy`)!

### 7.2 Workshop MCP (`mcp-coolify`) Auxiliary Image Tools & Database Schema
We add table `auxiliary_images` to `agent/kandoo/services/mcp-coolify/server/app/db.py`:
```python
class AuxiliaryImage(Base):
    """A pre-built Docker image (e.g. WAHA, WordPress) deployed inside the team's
    Coolify project and routed to one of the team's claimed subdomains.
    Capped at MAX_AUX_IMAGES (2) per project."""
    __tablename__ = "auxiliary_images"
    __table_args__ = (UniqueConstraint("project_id", "name"),)
    id               = Column(Integer, primary_key=True)
    project_id       = Column(Integer, ForeignKey("projects.id"), index=True, nullable=False)
    name             = Column(String, nullable=False)          # short slug, e.g. "waha" or "blog"
    image            = Column(String, nullable=False)          # e.g. "devlikeapro/waha"
    tag              = Column(String, default="latest")        # e.g. "latest"
    port             = Column(String, default="3000")          # container exposed port
    subdomain        = Column(String, unique=True, nullable=False)  # must be a Subdomain owned by project_id (not primary)
    application_uuid = Column(String, unique=True, nullable=False)  # Coolify application uuid
    created_at       = Column(DateTime, default=now)
```

And we expose 5 new tools in `agent/kandoo/services/mcp-coolify/server/app/tools.py`:

| MCP Tool on `workshop` | Signature | Behavior & Safeguards |
|---|---|---|
| `deploy_image` | `(name: str, image: str, subdomain: str, port: str = "3000", tag: str = "latest", env: dict[str, str] | None = None, volume_path: str = "") -> dict` | 1. Checks `len(aux_images) < MAX_AUX_IMAGES (2)` (or updates existing if `name` already exists).<br/>2. Claims `subdomain` for this team if not yet claimed (cannot be the primary app's subdomain).<br/>3. Calls Coolify `POST /api/v1/applications/dockerimage` inside the team's `project_uuid` with `limits_memory="512m"`, `limits_cpus="0.5"`, `domains="https://{subdomain}.{BASE_DOMAIN}"`, `ports_exposes=port`.<br/>4. Sets `env` vars via `coolify.set_env` and optional `volume_path` via `coolify.add_storage`.<br/>5. Submits the deploy via `coolify.deploy(app_uuid)` and returns `{"ok": True, "name": name, "url": f"https://{subdomain}.{BASE_DOMAIN}", "deployment_uuid": ...}`. |
| `set_image_env` | `(name: str, key: str, value: str) -> dict` | Sets or updates an environment variable on auxiliary image `name` (takes effect on `restart_image` or `deploy_image`). |
| `list_images` | `() -> dict` | Lists the team's auxiliary images (`name`, `image:tag`, `url`, `port`, `remaining_slots`). |
| `image_logs` | `(name: str, lines: int = 80) -> dict` | Returns container runtime logs (and latest deployment status/logs) for auxiliary image `name`. |
| `remove_image` | `(name: str) -> dict` | Deletes the auxiliary image application from Coolify and frees the slot (keeping or releasing the subdomain). |

*(Note: `_sync_domains` in `tools.py` is updated so subdomains attached to an `AuxiliaryImage` are excluded from the main agent application's `domains` list, preventing Traefik domain conflicts!)*

### 7.3 WhatsApp Humanoid Architecture (`WAHA` — `devlikeapro/waha`)
Per `13-transcription.md`, we document and support **WAHA (WhatsApp HTTP API)** in `tool-bank/tools/whatsapp-waha/` and `codo-core`:
1. **WAHA Core (Free) vs. WAHA Plus (Paid) Decision Guide (Built into `whatsapp-waha/README.md` & `/tools`):**
   - **WAHA Core (`devlikeapro/waha:latest` — Free, MIT):**
     - Supports **1 WhatsApp session per container** (must be named `"default"`).
     - Supports receiving text/media webhooks, sending text messages, seen/typing indicators, and QR authentication (`GET /api/screenshot` or `GET /api/default/auth/qr`).
     - **Limitation:** Does **not** support multiple WhatsApp numbers inside one container, and sending media files/voice from the free API has restrictions.
   - **WAHA Plus (`devlikeapro/waha-plus` — Paid license key required):**
     - Supports **unlimited multiple sessions** in a single container (essential if a **Rented** agent needs each Employer to connect their own WhatsApp number!), plus full media sending, channels, and status updates.
   - **Codo Rule in `/tools`:**
     - If a participant asks for a WhatsApp humanoid bot:
       - If the agent is **In-House** (1 WhatsApp number) and only sends text replies, **WAHA Core (Free)** is sufficient!
       - If the agent is **Rented** (where each Employer brings their own WhatsApp SIM) or needs rich outbound media on WhatsApp, Codo explicitly informs the participant that **WAHA Core only supports a single `"default"` session** and that we **never spin up a separate container per Employer/End-User**, so they either need a **WAHA Plus** license or should use Bale/Telegram/Eitaa for multi-employer rented mode.
2. **One Container Per Agent (Server Resource Protection):**
   - An agent may deploy at most **1 WAHA container** via `workshop.deploy_image(name="waha", image="devlikeapro/waha", subdomain="<team>-waha", port="3000", env={"WHATSAPP_API_KEY": "<secret>", "WHATSAPP_DEFAULT_ENGINE": "GOWS"})` (using the lightweight Go engine `GOWS` or `NOWEB` so RAM stays under ~250 MB instead of Chromium's 800 MB!).
   - As you noted in `13-transcription.md`, you also screen participant ideas before the workshop so not every team runs heavy containers simultaneously on the 8 GB staging box (`82.39.165.56`).
3. **QR Screenshot Login Flow via `/employer/mcp` (`wire_session_start` / `wire_session_verify`):**
   - `codo-core` includes account kind `"whatsapp_waha"` (`codo_core/accounts/whatsapp_waha.py`).
   - When the Employer calls `wire_session_start(slot="whatsapp")` via `/employer` (or via the Agency Bot):
     - The driver starts session `"default"` (or `emp.id` on WAHA Plus) on `WAHA_API_URL`, waits until status is `SCAN_QR_CODE`, fetches the QR screenshot (`GET /api/screenshot?session=...` with `X-Api-Key`), saves it to `data/waha_qr_{emp.id}.png` (and returns `image_b64` + local path), and tells the user:
       > *«تصویر QR واتساپ در `data/waha_qr_...png` ذخیره شد (یا در چت ارسال شد). در گوشی خود واتساپ ← دستگاه‌های متصل (Linked Devices) را باز کنید، کد را اسکن کنید و سپس بگویید ‹اسکن کردم›.»*
   - When the user says they scanned it, `wire_session_verify(slot="whatsapp")` queries `GET /api/sessions/{session}` on WAHA, verifies `status == "WORKING"`, configures WAHA's webhook to point to the agent's `/hook/{slot}/{secret}`, and marks the slot `connected`!

---

## 8. The Complete V6.0.1 Codo Pipeline (13 Linear Steps + Optional Design Track + 6 Floating Commands)

### 8.1 Step-by-Step Pipeline Table

| Step | Command | Persian Label | Output File(s) | Key Responsibilities in V6.0.1 |
|---|---|---|---|---|
| **01** | `/start` | `شروع` | `docs/profile.md`, `docs/status.md`, `docs/secrets/workshop.local.md`, `docs/secrets/model.local.md` | Checks OS/Git/Python, sets conversation & document languages, connects `workshop` MCP, runs `whoami`, `create_repo`, `get_proxy`, collects employee `LLM_*` key. |
| **02** | `/idea-core` | `هستهٔ ایده` | `docs/versions/0.1/01-idea-core.md`, `docs/living/idea-core.md`, `docs/living/roadmap.md` | Reads `00-idea-input.md` (and `existing_product/` if any). Defines **1 Job Title**, core mission, **In-House vs. Rented** (using the internal-system boundary rule), **End-User interface** (messengers, web screen, `/work/mcp`, or none), competitor benchmarks (`web_search`), scope cuts to `roadmap.md`, boundaries & referral link. |
| **03** | `/prd` | `سند محصول` | `docs/living/prd.md` | **Restored (`13-transcription.md`):** Product Requirements Document via file-based questions loop. Defines what the product does, for whom (End-Users, Employers, Brokers), core business rules, target form (if it has a screen), and strict v0.1 scope. |
| **04** | `/tools` | `ابزارها` | `docs/living/tools.md`, `docs/secrets/accounts.local.md` | Searches `workshop/tool-bank` (`search_tool_bank`, `fetch_tool`). Selects End-User messenger accounts (with bridge ladder & Humanoid/WAHA Core vs. Plus checks), auxiliary Docker images (`deploy_image` for WAHA/WordPress), sealed inputs/outputs, approval modes, rate limits, and writes «کارهای تو» sign-up guide so the user starts getting tokens in parallel. |
| **05** | `/manage-spec` | `قابلیت‌های مدیریتی` | `docs/living/management.md` | Knowing both `/prd` and `/tools`, defines everything `/employer/mcp` (and `/broker/mcp` if rented) will expose: (1) Persona & Avatar slot rules (editable vs. locked rules), (2) Behavioral fields (`Field` definitions: schedules, topics, prices), (3) Tool wiring slots (derived from `/tools`), (4) Reverse notification sink options (`webhook` vs. `channel`), (5) Custom `@employer_tool` operations, and (6) **If Rented:** wholesale meters (`Meter`) and Broker credit rules. |
| **06** | `/sops` | `رویه‌ها` | `docs/living/sops.md` | Turns the PRD & management spec into 3–6 concrete `Sop(...)` definitions: triggers (`message`, `schedule`, `cron`, `webhook`), state machines, second-person instructions, tools, meter emitted on completion, debounce window, media fallback, and approval requirements. |
| **07** | `/data-model` | `مدل داده` | `docs/living/data-model.md` | **Restored (`13-transcription.md`, placed after `/sops` per Decision #1):** Business-language data model («چیز», «فیلد», «یک به چند» — no SQL jargon). Captures all domain entities implied by `/prd`, `/manage-spec`, and `/sops` (e.g. Events & Registrations, Listed Agents & Payables, Articles & Sources), uniqueness rules, and invariants. |
| **08** | `/edge-cases` | `مواردِ لبه` | `docs/living/edge-cases.md` | **Hard Gate before `/plan`:** Pressure test + 3 quality lenses (Adversarial, Operational/Edge-Case Hunter, Verification Gap). Every case must be `resolved` or `accepted` in `docs/decisions.md` and mapped to a test scenario. |
| **08b** | `/ux` → `/design` → `/prototype` | `تجربه · طراحی · پیش‌نمایش` | `docs/living/ux.md`, `design-system.md`, `prototype.md` | **Conditional:** Runs **only** if `/idea-core` & `/prd` decided the product has its own web screen or companion theme (otherwise drawn as `⊘` and skipped). |
| **09** | `/plan` | `نقشه` | `docs/versions/0.1/plan.md`, `docs/living/architecture.md` | **Fresh session.** Refuses if any edge case is `open`. Maps `data-model.md` (custom SQLAlchemy tables if needed + `Fact` store), `job.py` declaration, `@tool`, `@employer_tool`, `@work_tool` functions, auxiliary images, env table, and build order. |
| **10** | `/build` | `ساخت` | `backend/app/job.py`, `backend/app/tools/*.py`, `backend/app/sops/*.md`, `backend/tests/*.py`, `Dockerfile`, `run.sh` | **Fresh session.** Fetches `codo-core-api` and chosen tool-bank files, writes the application code against `codo-core==0.2.0`, runs `codo-core check` and unit tests (`pytest`). If auxiliary Docker images (WAHA/WP) were chosen in `/tools`, deploys them on staging now via `workshop.deploy_image` so they are reachable during `/wire`! |
| **11** | `/wire` | `راه‌اندازی` | `docs/secrets/environments.local.md`, `docs/secrets/first-employer-snapshot.local.json` | Starts `./run.sh` (local agent + WSS relay tunnel `<seat>-dev.<base>`). Runs `codo-core bootstrap --env local` to create `admin`, default `broker` (`self`), and first `employer` (`self`) in `environments.local.md`. Walks the participant through configuring Employer `self` via `/employer/mcp` (Persona, Avatar, fields, token/OTP/QR wiring, notification sink) and saves the snapshot for `/deploy`. |
| **12** | `/test` | `تست` | `docs/versions/0.1/test.md` | Runs automated pytest scenarios (`codo_core.testing`) + interactive real-messenger test script through the relay, verifies `/admin/mcp`, `/broker/mcp`, `/employer/mcp` (and `/work/mcp` if enabled), measures real LLM token cost per unit, and records acceptance (`full`/`partial`). Never blocks. |
| **13** | `/deploy` | `انتشار` | Live at `https://<subdomain>.<base>` + `environments.staging` in `environments.local.md` | Claims subdomain, sets staging envs via `set_env`, pushes & deploys on Coolify, flips bot webhooks to staging URL, and runs **`codo-core replay-employer --from local --to staging`** so the first Employer's Persona, Avatar, settings, and wired tokens are immediately live on staging without re-entry! |

### 8.2 Floating Commands (Available Anytime, Never Move the Progress Bar)
- **`/admin <request>`**: Operates the agent as **Admin** via `/admin/mcp` (using `environments.local.md`): create/list/credit/suspend Brokers, view global stats, run read-only SQL queries.
- **`/broker <request>`**: Operates the agent as **Broker** via `/broker/mcp` (using `environments.local.md`): inspect manifest, ask presales questions, hire/create a new Employer (`create_employer` → saves the new employer's token into `environments.local.md`), set employer budget caps, pause/resume employers, check broker debt/balance.
- **`/employer <request>`**: Operates the agent as **Employer** via `/employer/mcp` (using `environments.local.md`): change persona or avatar, update schedules/settings, teach FAQ/knowledge, wire tokens or humanoid OTP/QR sessions, configure notifications, approve pending requests, check reports, and invoke any custom **`@employer_tool`** of that agent!
- **`/iterate`**: Opens version `0.2+` (switches progress bar to the 5-step version bar, revisits wholesale meter pricing using measured cost from `test.md`).
- **`/migrate`**: Packages `migration/` with vendored `codo-core` wheel, DB dump, session files, and `docs/handover.md`, and updates `environments.prod` in `environments.local.md`.
- **`/add-idea`**: Appends a new feature idea to `docs/living/roadmap.md`.

### 8.3 Progress Bar Strings (`templates/codo/AGENTS.md`)
- **Day Map (v0.1):**
  `پیشرفت: ✅ شروع · ➡️ هستهٔ ایده · ⬜ سند محصول · ⬜ ابزارها · ⬜ قابلیت‌های مدیریتی · ⬜ رویه‌ها · ⬜ مدل داده · ⬜ مواردِ لبه · ⬜ نقشه · ⬜ ساخت · ⬜ راه‌اندازی · ⬜ تست · ⬜ انتشار · ⬜ نسخهٔ بعد · ⬜ مهاجرت`
  *(If `/idea-core` enables the design track, `⬜ تجربه · ⬜ طراحی · ⬜ پیش‌نمایش` appear between `مواردِ لبه` and `نقشه`; otherwise they are omitted or drawn as `⊘`.)*
- **Version Bar (v0.2+ after `/iterate`):**
  `نسخهٔ ۰.۲: ✅ تغییرات و نقشه · ➡️ ساخت · ⬜ تست · ⬜ انتشار · ⬜ مهاجرت`

---

## 9. `codo-core` v0.2.0 Complete Technical Specification

### 9.1 Declarative API (`codo_core/declare.py`)
```python
@dataclass(slots=True)
class WiringSlot:
    """Declares an external credential or session an Employer must wire via /employer/mcp."""
    slot: str                                # matches Account.key or companion key (e.g. "customer_bot", "wp")
    kind: str                                # e.g. "bale_bot", "telegram_user", "whatsapp_waha", "wordpress", "custom_token"
    label: str = ""
    required: bool = True
    instructions_fa: str = ""                # step-by-step manual guide for non-technical employers
    env_keys: tuple[str, ...] = ()           # e.g. ("WP_URL", "WP_USER", "WP_APP_PASSWORD")

@dataclass(slots=True)
class ManagementSpec:
    """Replaces Hiring: defines everything configurable on /employer/mcp and billed on /broker/mcp."""
    is_rented: bool = False
    persona_editable: tuple[str, ...] = ("name", "age", "bio", "temperament", "voice", "avatar", "signature")
    default_persona: Persona = dc_field(default_factory=Persona)
    fields: list[Field] = dc_field(default_factory=list)
    wiring_slots: list[WiringSlot] = dc_field(default_factory=list)
    meters: list[Meter] = dc_field(default_factory=list)   # wholesale meters charged to Broker when is_rented=True
    notification_modes: tuple[str, ...] = ("webhook", "channel")
    warnings: tuple[str, ...] = ()

@dataclass(slots=True)
class Job:
    slug: str = ""
    title: str = ""
    description: str = ""
    role: Any = ""                           # Path("docs/living/idea-core.md") or text
    prd: Any = ""                            # Path("docs/living/prd.md") or text
    boundaries: str = ""
    referral: str = ""
    management: ManagementSpec = dc_field(default_factory=ManagementSpec)
    hiring: Hiring | None = None             # backward-compatibility alias mapped onto `management`
    persona: Persona = dc_field(default_factory=Persona)
    persona_slot: PersonaSlot | None = None
    accounts: list[Account] = dc_field(default_factory=list)
    sops: list[Sop] = dc_field(default_factory=list)
    tools: tuple = ()                        # @tool functions for SOPs
    employer_tools: tuple = ()               # @employer_tool functions mounted on /employer/mcp
    work_tools: tuple = ()                   # @work_tool functions mounted on /work/mcp
    enable_work_mcp: bool = False
    work_mcp_public: bool = False
    models: tuple = ()                       # custom SQLAlchemy models from data-model.md to create in init_db()
    rules: tuple[str, ...] = ()
    knowledge: tuple[str, ...] = ()
    avatar: str = ""
```
*(Backward-compatibility guarantee: `Hiring`, `Band`, `BalancePolicy`, `Persona`, `PersonaSlot` remain importable from `codo_core` so all existing tests and imports continue to work while `ManagementSpec` is the primary V6.0.1 spelling!)*

### 9.2 Database Schema (`codo_core/models.py`)
In addition to existing tables (`Customer`, `Conversation`, `Message`, `LedgerEntry`, `SealedBlob`, `Fact`, `Approval`, `IdempotencyKey`, `ScheduledJob`, `AuditItem`, `Event`), `models.py` adds `Broker` and `BrokerLedgerEntry`, and extends `Employment`:

```python
class Broker(Base):
    """A wholesale broker (e.g. 'self' or 'agency') authorized to create and manage Employments."""
    __tablename__ = "brokers"
    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: new_id("brk"))
    name: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    token_hash: Mapped[str] = mapped_column(String(64), unique=True, index=True)  # sha256 of brk_... token
    status: Mapped[str] = mapped_column(String(20), default="active")             # active | suspended
    balance_rials: Mapped[int] = mapped_column(BigInteger, default=0)             # negative = Broker owes Owner
    credit_limit_rials: Mapped[int | None] = mapped_column(BigInteger, nullable=True, default=None)  # None = unlimited ('self')
    meta: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)


class BrokerLedgerEntry(Base):
    """Append-only wholesale ledger between the Agent Owner and each Broker."""
    __tablename__ = "broker_ledger"
    __table_args__ = (UniqueConstraint("idempotency_key"),)
    id: Mapped[int] = mapped_column(AutoID, primary_key=True, autoincrement=True)
    broker_id: Mapped[str] = mapped_column(ForeignKey("brokers.id"), index=True)
    employment_id: Mapped[str | None] = mapped_column(ForeignKey("employments.id"), index=True, nullable=True)
    kind: Mapped[str] = mapped_column(String(16))             # charge | credit | adjust
    amount_rials: Mapped[int] = mapped_column(BigInteger)     # positive rials
    balance_after_rials: Mapped[int] = mapped_column(BigInteger)
    reason: Mapped[str] = mapped_column(String(300), default="")
    idempotency_key: Mapped[str] = mapped_column(String(80))
    meta: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
```

And on `Employment`:
```python
class Employment(Base):
    __tablename__ = "employments"
    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=lambda: new_id("emp"))
    no: Mapped[int] = mapped_column(Integer, default=0)
    label: Mapped[str] = mapped_column(String(120), default="self")
    broker_id: Mapped[str | None] = mapped_column(ForeignKey("brokers.id"), index=True, nullable=True)
    token_hash: Mapped[str | None] = mapped_column(String(64), unique=True, index=True, nullable=True)  # sha256 of emp_... token
    work_token_hash: Mapped[str | None] = mapped_column(String(64), unique=True, index=True, nullable=True)  # sha256 of wrk_... token
    status: Mapped[str] = mapped_column(String(28), default="draft")
    # statuses: draft | active | paused | paused_budget_cap | paused_broker_credit | closed
    spent_rials: Mapped[int] = mapped_column(BigInteger, default=0)
    budget_cap_rials: Mapped[int | None] = mapped_column(BigInteger, nullable=True, default=None)
    employer_customer_id: Mapped[str | None] = mapped_column(ForeignKey("customers.id"), nullable=True)
    fields: Mapped[dict] = mapped_column(JSON, default=dict)
    persona: Mapped[dict] = mapped_column(JSON, default=dict)
    accounts: Mapped[dict] = mapped_column(JSON, default=dict)
    notifications: Mapped[dict] = mapped_column(JSON, default=dict)
    # notifications shape: {"mode": "webhook"|"channel"|"none", "webhook_url": "...", "webhook_secret": "...", "account_slot": "...", "channel_or_group_id": "..."}
    pricing: Mapped[dict] = mapped_column(JSON, default=dict)
    knowledge: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
```

### 9.3 Authentication & Token Routing for `/broker/mcp` and `/employer/mcp`
How does FastMCP know which Broker or which Employment is calling `/broker/mcp` or `/employer/mcp` when all Brokers share the URL `POST /broker/mcp` and all Employers share `POST /employer/mcp`?
Using Python `contextvars.ContextVar` inside a Starlette `BaseHTTPMiddleware` wrapping the FastMCP sub-app:
1. When a request hits `/broker/mcp`:
   - `_BrokerAuthMiddleware` extracts `Authorization: Bearer <brk_token>`, computes `th = sha256(brk_token)`, queries `select(Broker).where(Broker.token_hash == th)`, returns `401 Unauthorized` if not found, sets `_current_broker_id.set(broker.id)` in a `ContextVar`, and calls `await call_next(request)`.
   - Every `@mcp.tool` inside `codo_core/broker.py` calls `current_broker()` which reads `_current_broker_id.get()`.
2. When a request hits `/employer/mcp`:
   - `_EmployerAuthMiddleware` extracts `Authorization: Bearer <emp_token>`, computes `th = sha256(emp_token)`, queries `select(Employment).where(Employment.token_hash == th)`, returns `401 Unauthorized` if not found, sets `_current_employment_id.set(emp.id)` in a `ContextVar`, and calls `await call_next(request)`.
   - Every `@mcp.tool` inside `codo_core/employer.py` (including dynamically registered `@employer_tool` functions) calls `current_employment()` which reads `_current_employment_id.get()`.
3. This design is 100% stateless across HTTP requests, concurrency-safe under `asyncio`, requires only a single FastMCP mount per plane (`/admin`, `/broker`, `/employer`, `/work`), and enforces cryptographic tenant isolation in middleware before any tool code runs!

---

## 10. The 4 Rehearsal Projects & Dual-Workspace Feedback Loop

### 10.1 The 4 Rehearsal Projects (Unpacked in `/home/omid/projects/rehearsals/`)

| # | Folder Name | Job Title | Mode | End-User Work Plane | Key V6.0.1 Features Exercised |
|---|---|---|---|---|---|
| **1** | `01-event-organizer` | مسئول ثبت‌نام و هماهنگی رویداد (مهتاب) | **Rented** (`is_rented=True`) | `bale_bot` + **`/work/mcp`** + `bale_wallet` & `card_ocr` (for attendee tickets) | Rented pipeline, `/prd`, `/data-model` (`EventConfig`, `AttendeeRegistration`), `@employer_tool` (`export_registrants`), `@work_tool` (`register_attendee`), registers real V6.0 workshop participants! |
| **2** | `02-neda-reporter` | خبرنگار و تولیدکنندهٔ محتوا (ندا) | **Rented** (`is_rented=True`) | WordPress blog (via `workshop.deploy_image`) + `bale_bot`, `telegram_bot`, `eitaayar`, `rubika_bot` | Auxiliary Docker image (`wordpress` via `deploy_image`), scheduled SOPs, optional design track, multi-channel publishing, `@employer_tool` (`order_breaking_post`), zero payment gateway needed inside Neda! |
| **3** | `03-hanieh-support` | پشتیبانِ فروش و مشتریان (هانیه) | **Rented** (`is_rented=True`) | Humanoid accounts (`bale_user` / `telegram_user` / `whatsapp_waha`) | Humanoid session wiring (`wire_session_start/verify`) over `/employer/mcp`, inbound debounce, escalations + approval codes via Reverse Notifications (`webhook` & `channel`). |
| **4** | `04-agent-agency` | آژانس استخدام ایجنت‌ها (کارگشا) | **In-House** (`is_rented=False`) | `bale_bot` serving Supply-Side (Developers) & Demand-Side (Employers) + `bale_wallet` / `card_ocr` | In-House pipeline, consumes `#1`, `#2`, and `#3`'s `/broker/mcp` and `/employer/mcp` via `agency-mcp-client`, sends alert to Omid's notification channel when a new `unverified` agent is submitted, and exposes `@employer_tool`s (`list_unverified_agents`, `approve_listed_agent`, `show_broker_payables`, `record_developer_payout`) invoked by Omid via `/employer`! |

### 10.2 Detailed Specification of Rehearsal #4 (`04-agent-agency`) per Your Comments
1. **Supply-Side Flow (Agent Developer submits an agent to the Agency Bot):**
   - The developer creates a Broker token on their rented agent via `/admin create broker agency with 100M Toman credit limit` and pastes `broker_mcp_url` + `broker_token` into the Agency's Bale Bot.
   - The Agency Bot calls `get_manifest()` and `get_broker_account()` on `broker_mcp_url`, saves the agent in `listed_agents` with `status = "unverified"`, and returns a deep link (`https://ble.ir/<agency_bot>?start=hire_<slug>`) to the developer.
   - **Immediate Notification to Omid (Comment on `12-analysis-round6.md` line 452):** The Agency SOP immediately calls `ctx.notify_employer(...)` which posts to Omid's configured Bale notification channel/group (`configure_notifications(mode="channel", ...)`):
     > *«🔔 ایجنت جدید در وضعیت تأییدنشده ثبت شد: **{title}** (`{slug}`) توسط `{developer_name}`. برای تأیید، در کدو دستور `/employer approve agent {slug}` را بزنید.»*
2. **Agency Employer Management via `/employer` (Comment on `12-analysis-round6.md` line 467):**
   - Because `04-agent-agency` is an In-House agent where Omid is Employer `"self"`, all Agency-specific management tools are decorated with `@employer_tool` on `/employer/mcp` and called via **`/employer`**:
     - `/employer list unverified agents` → calls `list_unverified_agents()`
     - `/employer approve agent <slug>` → calls `approve_listed_agent(slug, retail_markup_pct=20)`
     - `/employer suspend agent <slug>` → calls `suspend_listed_agent(slug, reason)`
     - `/employer show broker payables` → calls `show_broker_payables()` (iterates over all `listed_agents`, calls `get_broker_account()` on each agent's `/broker/mcp`, and returns a clean table of how much the Agency owes each developer and remaining credit line!)
     - `/employer record developer payout <slug> <amount_toman>` → calls `record_developer_payout(slug, amount_toman, reference)`
3. **Demand-Side Flow (Employer rents & configures an agent in the Agency Bot):**
   - An Employer browses `approved` agents (or opens a deep link to an `unverified` agent), asks presales questions (Agency calls `ask_presales_question` on `/broker/mcp`), tops up their retail wallet in the Agency (`bale_wallet` or `card_ocr`), and rents the agent.
   - The Agency calls `create_employer(label=..., initial_budget_cap_toman=...)` on the target agent's `/broker/mcp`, receives `{employment_id, employer_mcp_url, employer_token}`, gives them to the Employer, and offers to walk the Employer through configuring Persona, Avatar, behavioral settings, BotFather/humanoid wiring, and Notifications right inside the Agency Bot (calling the target agent's `/employer/mcp` on the Employer's behalf and registering the Agency's notification webhook if the Employer wants notifications inside the Agency Bot).

### 10.3 The `kandoo /sync-rehearsal` Feedback Loop
- Located at `agent/kandoo/.opencode/commands/sync-rehearsal.md`.
- Whenever a flaw is spotted while running a rehearsal in `/home/omid/projects/rehearsals/<name>/`:
  1. Fix the root cause upstream in `/home/omid/projects/workshop/agent/kandoo/` (`packages/codo-core`, `tool-bank`, `templates/codo`, or `services/mcp-coolify`).
  2. Run `/sync-rehearsal /home/omid/projects/rehearsals/<name>` in the Kandoo session:
     - Re-runs `compile/compile.py`,
     - Syncs updated command files (`.opencode/commands/*.md`) and `docs/constitution/*.md` into the rehearsal folder,
     - Rebuilds and reinstalls `codo_core-0.2.0-py3-none-any.whl` into the rehearsal's `.venv` (and publishes to Gitea PyPI on staging),
     - Leaves the rehearsal's `docs/living/`, `docs/versions/`, `docs/secrets/`, `.env`, and `data/` completely untouched!
  3. Resume the rehearsal step immediately.
