# V7.1 — Analysis Round 3: The Tool Discovery Framework & The Humanoid Messenger Architecture
## Curated Recipes, Runtime Web Search (Parallel API), and Browser Automation for Humanoid Bale/Eitaa Accounts

> **Input:** Organizer's instructions in Round 3 (recorded 2026-11-01):  
> 1. *"yes, put them"* (Approve inclusion of `docs/references/tools-guide.md` and the Web Search Protocol in Public Agent Codo).  
> 2. *"and also note that for humanoid eitaa/bale, we need to use browser/scraping"* (Architectural mandate for Humanoid accounts).  
> **Prior Documents:** [02-analysis.md](02-analysis.md) · [03-analysis-round2.md](03-analysis-round2.md).  
> **Status:** Final Architectural Decision for Tooling & Humanoid Connectors.  
> **Deliverable Path:** `/home/omid/projects/workshop/workshop_docs/versions/V7.1/04-analysis-round3.md`.

---

## 1. The Core Architecture: Official Bots vs. Humanoid Accounts

In agent deployments across Iranian platforms (Bale and Eitaa), there are two fundamentally distinct persona modes:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                      TWO MODES OF MESSENGER INTEGRATION                                │
├─────────────────────────────────────────────────┬──────────────────────────────────────┤
│ 1. OFFICIAL BOT ACCOUNT                         │ 2. HUMANOID PRINCIPAL ACCOUNT        │
│    (حساب رسمی بات)                               │    (حساب شبه‌انسانی / اکانت واقعی کاربر)│
├─────────────────────────────────────────────────┼──────────────────────────────────────┤
│ • Connected via Official API Token              │ • Operates on a regular SIM / Phone  │
│ • Handled via Webhook or Long-Polling           │ • Acts as a real user in private DMs │
│ • Explicit Bot UI (Keyboards, /start, Commands) │ • Behaves like a human secretary     │
│ • Free of CAPTCHA / Rate-limited by API quotas  │ • Requires session persistence       │
└─────────────────────────────────────────────────┴──────────────────────────────────────┘
```

### The Humanoid Reality on Bale & Eitaa: Why Browser / Scraping Is Mandatory

Unlike Telegram—which provides the open **MTProto protocol** and mature client libraries (`Telethon`, `Pyrogram`) allowing an agent to log in as a regular user via API keys—**neither Bale nor Eitaa provides an open MTProto/user-client SDK for third-party developers**:
- **Bale:** Official API (`tapi.bale.ai`) is strictly for `@BotFather` bot accounts. User-to-user DMs have no open REST API.
- **Eitaa:** Provides **Eitaayar** (`eitaayar.ir`) for broadcast channels and groups, but has no official API for personal account DMs.

#### The Architectural Directive:
> [!IMPORTANT]
> **For any agent designed to operate as a Humanoid User on Bale or Eitaa (answering direct personal DMs or participating in normal groups as an employee with a personal phone number), the harness MUST utilize Headless Browser Automation / Web Scraping (Playwright / Chromium).**

---

## 2. The 4-Tier Integration Rungs (مراتب اتصال ابزارها)

To prevent the AI assistant from guessing or writing brittle connectors, `docs/references/tools-guide.md` classifies all connectors into four deterministic rungs:

```
Rung 0: Official REST / Webhook API (Standard, Zero Scraping)
  │      Examples: Bale Bot API (tapi.bale.ai), Telegram Bot API, Parallel Search API
  ▼
Rung 1: Official Python SDK (Typed Client Libraries)
  │      Examples: sqlite-vec, pydantic-ai, stripe-python
  ▼
Rung 2: Semi-Official / Managed Gateways (Token-Based Middleware)
  │      Examples: Eitaayar API (eitaayar.ir) for channel broadcasts
  ▼
Rung 3: Headless Browser Automation & Web Scraping (Playwright)
         Mandatory for: Humanoid Bale accounts, Humanoid Eitaa personal DMs
```

### Technical Blueprint for Rung 3 (Humanoid Bale/Eitaa):
1. **Engine:** **Playwright for Python** (headless Chromium).
2. **Session Persistence:** Store the browser storage state (`state.json` / cookies / localStorage) in `docs/secrets/browser_session.json` (strictly git-ignored).
3. **Onboarding Flow:**
   - On the participant VPS or local machine, the user runs an onboarding script (`python -m tools.bale_login`).
   - A browser window opens (or prints a QR code / OTP prompt in terminal).
   - The user inputs the SMS OTP once.
   - The session tokens are saved; headless Chromium resumes without re-authenticating.
4. **DOM Monitoring:** A lightweight background worker monitors DOM changes (incoming messages) and dispatches them into FastAPI loop as standard `user_msg` events.

---

## 3. The Curated Tool Directory (`docs/references/tools-guide.md`)

This living guide is shipped inside `workshops/public-agent/codo/` as the single source of truth for the `/tools` command:

### 3.1 Runtime Web Search
- **Primary Tool:** **`parallel-search`** ([Parallel API](https://parallel.ai))
  - Purpose: Runtime research during agent dialogue (e.g., verifying user ideas, competitor discovery, knowledge base augmentation).
  - Implementation: Simple async HTTP POST with JSON output.
  - Secret: `PARALLEL_API_KEY`.
- **Free/Local Fallback:** **DuckDuckGo Search (`duckduckgo-search`)**
  - Purpose: Local development without API keys.

### 3.2 Messenger Platforms & Humanoid Matrix

| Platform | Official Bot Path (Rung 0/2) | Humanoid Path (Rung 3) | Phone / Envelope Capture |
|---|---|---|---|
| **Bale** | `tapi.bale.ai` (BotFather token, Webhook, Inline Keyboards, Wallet Invoice) | **Playwright Web Scraping** (`web.bale.ai` automation) | Contact card button (`request_contact: true`) on Bot; pattern regex on Humanoid. |
| **Eitaa** | `eitaayar.ir` (Token, REST API for channels & alerts) | **Playwright Web Scraping** (`web.eitaa.com` automation) | Regex pattern envelope (`09[0-9]{9}`). |
| **Telegram** | `api.telegram.org` (Hosted on VPS to bypass domestic censorship) | `Telethon` / `Pyrogram` (MTProto client) or Playwright | Contact button on Bot; direct MTProto user object on Humanoid. |
| **Rubika** | Official Rubika Bot API | Playwright Web Scraping (`web.rubika.ir`) | Pattern envelope. |

### 3.3 Payments & Storage
- **Payments (The Three Pillars):**
  1. **Bale In-Bot Wallet:** `sendInvoice` + `answerPreCheckoutQuery` with `provider_token` (Bale Wallet official payment).
  2. **Payment Link / Web Redirect:** Zarinpal / Payping / IDPay REST API for generating external payment URLs with return callback verification.
  3. **Bank Receipt OCR (`card_ocr`):** Card-to-card receipt and bank transaction slip parser. Uses LLM vision or local OCR to extract `amount`, `tracking_code`, `date_time`, `destination_card`, and `origin_card` from customer-uploaded receipt images, verifies amount against the invoice, and performs replay-prevention on `tracking_code`.
- **RAG & Vector Storage:**
  - `sqlite-vec` directly in `db.sqlite3`. Zero Docker, native Windows/Linux.

---

## 4. The Web Search & Verification Protocol in `/tools.md`

When an agent needs an unlisted service (e.g., custom flight API, accounting system, SMS gateway):

```markdown
### Web Search & Verification Protocol:
1. Conduct targeted web search:
   - Query: `"<service name> official python api" site:github.com OR site:pypi.org`
   - Inspect API docs, authentication mechanisms, and rate limits.
2. Evaluate Bridge Rung:
   - Does an official REST API exist? -> Rung 0.
   - Does it require a human SIM / web login? -> Rung 3 (Playwright).
3. Document in `docs/external-docs/<tool-name>.md`:
   - Record base URLs, headers, required env variables, and error codes.
4. Update `docs/living/tools.md` and `docs/secrets/env.local.md.example`.
```

---

### Document Summary

| Property | Value |
|---|---|
| **Author** | Antigravity AI Architecture Team |
| **Status** | Finalized & Approved |
| **Associated Path** | `/home/omid/projects/workshop/workshop_docs/versions/V7.1/04-analysis-round3.md` |
