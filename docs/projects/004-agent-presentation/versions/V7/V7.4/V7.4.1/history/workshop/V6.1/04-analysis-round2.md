# V6.1 — Analysis Round 2: Unified Agent Capabilities (`Direct` vs. `Button Confirmation`), Bidirectional Confidentiality Envelopes (`پاکت`), Pipeline Placement, and Purging Rental from the BRAH Paper

> **Input:** Your voice notes in [03-transcription.md](03-transcription.md) + your inline comment in [02-analysis.md](02-analysis.md) (line 194).
> **Standing from Round 1 ([02-analysis.md](02-analysis.md)):**
> - Dropping multi-tenant agent rental (`is_rented=True`), wholesale broker accounting (`Broker`, `Meter`, `BrokerLedgerEntry`), and the 3 on-agent control MCPs (`/admin/mcp`, `/broker/mcp`, `/employer/mcp`).
> - Every workshop agent is **In-House (Single-Owner: Developer = Employer)**, managed directly through **Codo** (via `workshop` MCP on staging, SQLite locally, or SSH on a personal VPS), with **non-frequent setup/login actions (like humanoid OTP login) performed strictly through Codo CLI/workflow** rather than any management bot.
> - Replacing `04-agent-agency` (`کارگشا`) with **Open-Source GitHub Forking (`existing_product/`) + The Kandoo Cloud PaaS Agent (`04-kandoo-cloud` / `کندو`)**.

---

## Executive Verdict ("Read of the Day")

Your two observations in `03-transcription.md` resolve the last remaining rigidity in the V6.0.3 security model:

1. **Unifying Tools & Commands into a Single Concept ("یک کار / قابلیت") with Creator-Chosen Confirmation Policy:**
   - In V6.0.3, we treated `@llm_tool` (direct call by LLM, forbidden from any DB write) and `@principal_command` (state mutation, **always** forced to send a confirmation button/nonce) as two separate worlds.
   - As you pointed out, **from the domain's perspective, both are simply an Action (`یه کار`) given to the agent**, and **whether an action executes directly (`مستقیم توسط مدل`) or sends a confirmation button (`نیازمند تأیید کاربر / کارفرما`) is a UX-vs-Security trade-off that the Agent Creator (workshop participant) must decide per action!**
   - For example, in an Event Organizer agent, Creator A may want **Course Registration (`ثبت‌نام در دوره`)** to execute **directly** when the user asks in chat (maximizing conversion and user convenience), while requiring a **Confirmation Button (`دکمهٔ تأیید`)** only for **Canceling Registration (`لغو ثبت‌نام`)** or **Finalizing Payment**. Creator B may want buttons for both.
   - Crucially, **allowing direct LLM execution for creator-approved actions does NOT break the Harness's Confused-Deputy defense**: even when `requires_confirmation=False`, Layer 2 still binds `customer_id` and `peer_id` from the immutable Execution Context $\Gamma$ (so the LLM can only ever register `CURRENT_USER`, never another user, and cannot message any other `chat_id`) and still enforces `HandleVault` ownership ($\Sigma$).

2. **Bidirectional, Creator-Configurable Confidentiality Envelopes (`پاکت‌های ورودی و خروجی`):**
   - Just like confirmation buttons, **which data fields travel inside an opaque Envelope (`پاکت` / `HandleRef`) invisible to the LLM—both Inbound (User $\to$ Agent) and Outbound (Agent $\to$ User)—depends on the business domain and the creator's choice**.
   - Even better: your example of a **Postal Address (`آدرس پستی`)** revealed a gap in V6.0.3's regex-only scrubber (since free-text street addresses cannot be reliably caught by regex). By adding a **Layer 1 Prompted Envelope Input (`پاکت متنیِ درخواست‌شده توسط هارنس`)** alongside the regex scrubber and native contact share, plus **Layer 2 Egress Envelope Unveiling (`پاکت خروجی به کاربر`)**, the Harness can now put *any* structured or unstructured data (addresses, passwords, medical notes, outbound voucher codes, license keys, destination card numbers) inside a `پاکت` with **zero exposure to the LLM**!

3. **Audit of the Security Paper (`BRAH_agent_security_paper (1).html`):**
   - I read the V6.0.3 paper line by line. **Yes—multi-tenant rental, wholesale brokers (`broker_id`, $S_{\text{brk}}$), the 4 administrative planes (Section 4.4), and the Brokerage Marketplace case study (Section 9.4) had all gone into the paper!**
   - Removing multi-tenancy/brokers and updating the formal model to reflect **(a) Policy-Configurable Split Authority (`Direct Context-Bound Execution` vs. `WYSIWYS Proposal Confirmation`)** and **(b) Bidirectional Capability Envelopes (solving the paper's own Section 11.2 limitation on unstructured PII like addresses)** makes the paper significantly cleaner, tighter, and more general. I have prepared the full cleaned V6.1 paper in [BRAH_agent_security_paper.html](BRAH_agent_security_paper.html) alongside this analysis.

---

## Part 0 — Proposal Register: What `03-transcription.md` (and Your `02-analysis.md` Note) Decided

| # | Topic | Your Requirement / Insight |
|---|---|---|
| **0.1** | **Non-Frequent Setup Actions Only via Codo** *(from `02-analysis.md` L194)* | Infrequent administrative/wiring actions (such as logging in a humanoid account via OTP/QR during `/wire`) must be done **exclusively through Codo** (CLI/files), never via a management bot. |
| **0.2** | **Action Confirmation Is a Per-Action Creator Choice, Not a Blanket Ban** | The Harness should not impose a blanket rule that the LLM can *never* execute state-changing tools directly and can *only* send buttons. Instead, for every action/tool exposed to the LLM, **the agent creator (workshop participant) decides** whether the LLM **(a) executes it directly (`اجرای مستقیم`)** for smoother end-user UX, or **(b) sends a confirmation button / 4-digit nonce (`ارسال دکمهٔ تأیید به کاربر` / `تأیید کارفرما`)** for higher safety. (Example: direct execution for course registration, button confirmation for registration cancellation). |
| **0.3** | **Unifying "Tools" and "Commands" as Actions (`همهٔ این‌ها بالاخره یه کاره`)** | Stop confusing the creator with artificial splits between "tools" and "commands". Everything the Harness gives the LLM is an **Action / Tool (`کار / ابزار`)**; each one simply has an execution mode: **Direct (`خودش انجام می‌دهد`)** vs. **Confirmation Button (`دکمهٔ تأیید می‌فرستد`)**. |
| **0.4** | **Bidirectional Confidentiality Envelopes (`پاکت ورودی و خروجی`) Are Also Creator-Configurable** | What data is received from the user in an Envelope (`پاکت ورودی`) or returned to the user in an Envelope (`پاکت خروجی`) without the LLM seeing it varies by project (e.g., a postal address `آدرس` might need an envelope in one agent and not in another; a voucher code or card number might be returned in an outbound envelope). |
| **0.5** | **Clear Visibility for the Agent Creator in Codo** | The participant must see a **single, clear inventory of all tools/actions provided to the LLM**, explicitly showing for each one: **(1) What the tool does, (2) Whether it executes directly or sends a confirmation button, and (3) What data moves inside an Inbound or Outbound Envelope (`پاکت`)**. Investigate where this belongs in the Codo slash-command pipeline (`/sops` vs. `/tools` vs. a new slash command). |
| **0.6** | **Rewrite the Security Paper (`BRAH_agent_security_paper`)** | Inspect the paper written in V6.0.3/V6.0.4; remove all multi-tenant rental, broker, and agency concepts that crept into it, and keep only the pure core of our idea: **enforcing the CIA Triad (Confidentiality, Integrity, Availability) in the Agent Harness**. |

---

## Part 1 — Technical Architecture: Unifying Actions (`Direct` vs. `Button Confirmation`) Without Losing CIA Security

### 1.1 Why V6.0.3 Was Too Rigid (and Confusing)

In V6.0.3, `codo-core` had three different decorators (`@principal_command`, `@llm_tool`, and legacy `@tool`), and `codo-core check` (`AST-02`) enforced a hard rule:
- Any function decorated with `@llm_tool` was **banned from writing to the database** (`session.add`, `insert`, `update`, `delete`).
- Any function decorated with `@principal_command` was **never** directly callable by the LLM; `build_toolset()` only gave the LLM `propose_<slug>`, which **always** sent a `🔒 [فرم رسمی سامانه]` confirmation button (or 4-digit nonce) to the user—even if `@principal_command(requires_confirmation=False)` was set!

As you noted in `03-transcription.md`, this created two problems:
1. **End-User Friction (UX Cost):** If a user chats with an agent and says *"اسم من امید بهارلو هست، لطفاً توی دورهٔ مقدماتی ثبت‌نامم کن"*, forcing a confirmation button for a free/low-risk registration adds unnecessary friction when the organizer explicitly prefers 1-step conversational registration—while still wanting a confirmation button for **canceling** a registration (`لغو ثبت‌نام`) or **paying**.
2. **Conceptual Confusion:** The participant (and the coding LLM) had to agonize over whether a capability was a "tool" or a "command", when in reality **every capability is a Task/Action (`یک کار`)** that has:
   - a **Deterministic Trigger (`مسیر بدون مدل / LLM-Zero`)** (if it is a user-facing business action), and
   - an **LLM Authority Mode (`نحوهٔ فراخوانی توسط مدل`)**: Direct vs. User Button Confirmation vs. Owner Button Confirmation!

---

### 1.2 The V6.1 Unified Action Model (`@action` / `@principal_command` with 4 Execution Modes)

In V6.1, every capability in `job.py` is a **Context-Bound Action** (we can support `@action` as the primary clean name and keep `@principal_command` / `@llm_tool` as aliases so existing code works seamlessly). **COMMENT**: there is no need for backward compatibility because there is no agent based on codo yet. I dont want dead or deprecated code anywhere.

Every action has a single explicit parameter **`llm_mode`** (or `confirmation`) chosen by the agent creator during specification:

| `llm_mode` (Persian Term in Codo Docs) | What Tool Does `codo-core` Give the LLM? | What Happens When the LLM Calls It? | What Security Guarantees Still Hold 100%? | Typical Examples |
|---|---|---|---|---|
| **1. `direct`**<br/>**«اجرای مستقیم توسط مدل (بدون دکمهٔ تأیید)»** | Gives the LLM `<slug>(...safe_args)` directly. | Layer 2 injects `ctx` (`peer_id`, `customer_id` from $\Gamma$), verifies any `HandleRef` envelopes in $\Sigma$, and **executes the function immediately in Layer 3** without asking the user to click a button. | • **Zero Cross-User Access:** `peer_id` & `customer_id` come from $\Gamma$, so the LLM can only read/write `CURRENT_USER`'s own row.<br/>• **Zero Cross-Chat Spam:** No `chat_id` param.<br/>• **Zero PII Leak:** `HandleRef` envelopes are unveiled only inside Layer 3 DB/sinks. | • `search_faq` (Read)<br/>• `check_my_status` (Read)<br/>• `register_in_course` *(if creator chooses convenience over button!)*<br/>• `save_my_note` |
| **2. `user_confirm`**<br/>**«ارسال دکمهٔ تأیید به کاربر (یا کد ۴ رقمی)»** | Gives the LLM `propose_<slug>(...safe_args)` (never direct execution). | Creates an `ActionProposal` row, suppresses deceptive LLM free text in that turn (`Defense I-1`), and sends a deterministic **WYSIWYS Confirmation Button** (on bots) or **Post-Turn 4-Digit Nonce** (on humanoid accounts) to `CURRENT_USER`. Runs only when `CURRENT_USER` clicks/confirms on Layer 1! | All of Mode 1 **PLUS** **100% Protection Against LLM Hallucination / Phishing:** the mutation cannot happen unless the human user explicitly confirms the exact parameters on the system card. | • `cancel_registration`<br/>• `confirm_paid_registration`<br/>• `submit_final_order` |
| **3. `owner_confirm`**<br/>**«ارسال دکمهٔ تأیید به کارفرما (صاحب ایجنت)»** | Gives the LLM `request_owner_approval_<slug>(...safe_args)`. | Creates a pending `Approval` row and sends a deterministic card with `[✅ تأیید]` and `[❌ رد]` inline buttons to the **Owner's chat (`OWNER_CHAT_ID`)**. Runs only when the Owner clicks `[✅ تأیید]`! | All of Mode 1 **PLUS** **Human-in-the-Loop Owner Gate:** external users or a prompt-injected LLM cannot trigger external publication or financial payout without the Owner's tap. | • `publish_news_post`<br/>• `issue_custom_discount_above_band`<br/>• `refund_payment` |
| **4. `menu_only`**<br/>**«فقط در منوی قطعی (بدون دسترسی مدل)»** | **Not exposed to the LLM at all** (`allow_llm=False`). | Only executable when the user clicks the deterministic menu button or slash command directly on Layer 1. | Complete isolation from the LLM. | • `export_my_receipt`<br/>• Administrative self-service commands |

#### Why This Makes `codo-core` and `codo-core check` Much Cleaner:
- Look at what happens in `codo_core/tools.py` (`build_toolset`):
  - If an action has `llm_mode="user_confirm"` (i.e. `requires_confirmation=True`), `build_toolset` mounts `propose_<slug>` (which sends the WYSIWYS button / 4-digit nonce).
  - If an action has `llm_mode="direct"` (i.e. `requires_confirmation=False`), `build_toolset` mounts `<slug>` directly! When called by the LLM, Layer 2 still validates all `HandleRef` arguments in $\Sigma$ (`check_handle_ownership`), constructs `PrincipalCtx` bound strictly to `Γ.peer_id` / `Γ.customer_id`, executes the function, and scrubs any returned output with `_scrub_tool_output`!
  - If an action has `llm_mode="owner_confirm"`, `build_toolset` mounts `propose_to_owner_<slug>`, which sends the `[✅ تأیید]` / `[❌ رد]` inline button to `OWNER_CHAT_ID`.
- And how does `codo-core check` (`security.py`) verify this?
  - **AST-01 (No Ambient Recipient / User ID Parameters):** Still enforced on **100% of tools** (`direct`, `user_confirm`, and `owner_confirm` alike)! Even if `register_in_course` is `direct`, it is **never** allowed to accept `chat_id`, `peer_id`, `user_id`, or `customer_id` from the LLM—those are always bound from $\Gamma$!
  - **AST-02 (Envelope Enforcement on Declared Confidential Fields):** Only parameters whose data kind is marked as **Envelope (`پاکت`)** in the job's envelope policy must be typed as `HandleRef[...]`. If the creator decided that `address` is plain text (not in an envelope), `address: str` is allowed; if the creator decided `address` must be in an envelope (`پاکت`), `codo-core check` enforces `address: HandleRef["address"]`!
  - **AST-03 (Mutations Match Declared `llm_mode`):** Read-only helper tools (`@llm_tool`) still cannot mutate the DB, whereas an action explicitly declared by the creator with `@principal_command(..., requires_confirmation=False)` (or `@action(llm_mode="direct")`) is permitted to write to `ctx`'s scoped domain tables for `ctx.customer_id`!

---

## Part 2 — Bidirectional Confidentiality Envelopes (`پاکت‌های ورودی و خروجی`)

In `03-transcription.md`, you highlighted a crucial point about Confidentiality:
> *"همین را در مورد محرمانگی هم داریم: اینکه چه چیزهایی رو ما می‌خوایم به صورت پاکت دریافت بکنیم از کاربر یا به صورت پاکت بهش برگردونیم، این هم باز می‌تونه متنوع باشه دیگه؛ یعنی برای جایی ممکنه آدرس مثلاً یه چیزی باشه که باید در واقع بره توی پاکت و ال‌ال‌ام نبینه، برای یه جای دیگه ممکنه که مشکلی نباشه بخواد ببینه."*

Let's examine how **Envelopes (`پاکت‌ها`)** work in both directions—and how we solve **unstructured confidential inputs like a Postal Address (`آدرس پستی`)**!

### 2.1 The Three Ways an Inbound Envelope (`پاکت ورودی`: User $\to$ Agent) Enters the Vault ($\Sigma$)

When the agent creator marks a user input field (e.g., `شماره موبایل`, `کد ملی`, `آدرس پستی`, `رمز عبور`, `شماره کارت`) as **`پاکت ورودی (محرمانه از مدل)`**, how does Layer 1 capture it without the LLM seeing the plaintext?

```
+--------------------------------------------------------------------------------------------+
|          THREE INBOUND ENVELOPE MECHANISMS (پاکت‌های ورودی — مخفی از مدل زبانی)           |
+--------------------------------------------------------------------------------------------+

  1. NATIVE PLATFORM ENVELOPE (پاکت رسمی پلتفرم — تاییدشده):
     • User clicks native [📱 اشتراک‌گذاری شماره تماس] button (`request_contact=True`).
     • Layer 1 verifies `contact.user_id == sender.id`, stores phone in Vault Σ, and
       gives LLM only: `[پاکت ورودی تاییدشده: h_phone_verified_8a9f...]`.

  2. PATTERN-SCRUBBED ENVELOPE (پاکت خودکار مبتنی بر الگو — در متن آزاد):
     • For structured data enabled in ` Job.envelopes` (`phone`, `national_id`, `card`,
       `iban`, `email`).
     • If the user types `"شماره من ۰۹۱۲۱۲۳۴۵۶۷ است"` in normal chat, Layer 1's regex
       scrubber catches it BEFORE the LLM and replaces it inline with:
       `"شماره من [h_phone_unverified_3c4d...] است"`.
     • (If the creator turned OFF the envelope for `phone` in this project, Layer 1
       does not scrub it!)

  3. PROMPTED BOX ENVELOPE (پاکت متنیِ درخواست‌شده — برای داده‌های بدون ساختار مثل «آدرس پستی»!):
     • What about free-text data that has NO fixed regex pattern, like a Postal Address
       (`آدرس منزل: تهران، خیابان آزادی، کوچه مهر، پلاک ۱۲`) or a Secret Password/Note?
     • The LLM has a built-in tool: `request_envelope_input(kind="address")` (or the user
       clicks `[📦 ثبت محرمانهٔ آدرس پستی]` on the menu).
     • Layer 1 sets `PeerDialogFSM.state = "AWAITING_ENVELOPE:address"` and sends:
       `🔒 [پاکت محرمانه]: لطفاً «آدرس پستی» خود را در پیام بعدی بنویسید (این پیام مستقیماً`
       `در گاوصندوق ذخیره می‌شود و به مدل هوش مصنوعی ارسال نخواهد شد).`
     • When the user sends their next message, Layer 1 intercepts the ENTIRE message
       before the LLM, seals it in Vault Σ as `h_address_9f1e...`, resets FSM to `IDLE`,
       and sends to the LLM ONLY:
       `[System: CURRENT_USER provided envelope h_address_9f1e... for 'address' (preview: تهران، ***)]`!
```

**Look at Mechanism #3 (`Prompted Box Envelope` / `پاکت متنیِ درخواست‌شده`):**
- It is 100% deterministic, requires zero machine-learning NER models, works on both Bots and Humanoid accounts, and lets the agent creator put **any field whatsoever** (`آدرس پستی`, `شماره نظام پزشکی`, `شماره پرونده`, `توضیحات خصوصی پزشکی`, `توکن/پسورد`) inside an unbreakable Envelope (`پاکت ورودی`)!
- Even better: if the user uses the deterministic wizard (`LLM-Zero` menu button) to fill out a form, any parameter typed as `HandleRef["address"]` automatically uses this exact envelope capture!

---

### 2.2 How Outbound Envelopes (`پاکت خروجی`: Agent/DB/Tool $\to$ User) Work

Now consider the reverse direction that you mentioned:
> *"یا به صورت پاکت بهش برگردونیم..."*

Suppose an agent needs to return a sensitive piece of information **from the database or a tool back to the user** without the LLM ever seeing it:
- **Example 1:** Returning a **purchased license key / discount voucher (`کد تخفیف اختصاصی یا لایسنس`)** or **private webinar entrance link (`لینک اختصاصی ورود`)** after payment.
- **Example 2:** Showing the user their own **saved postal address or phone number (`آدرس یا شمارهٔ ثبت‌شدهٔ قبلی کاربر`)** when they call `check_my_status()`.
- **Example 3:** Sending the organizer's **destination bank card number (`شماره کارت مقصد برای کارت‌به‌کارت`)** without putting it in the LLM prompt.

How does **Outbound Envelope (`پاکت خروجی`)** work in `codo-core`?
1. **Creation in Layer 3 (`ctx.envelope_for_user(value, kind=..., masked_preview=...)`):**
   - Inside a Layer 3 tool or command, instead of returning the raw string `"LIC-9988-7766"` to the LLM, the tool calls:
     ```python
     lic_handle = await ctx.envelope_for_user(
         plaintext=license_code,
         kind="license_key",
         masked_preview="LIC-****-7766",
     )
     return {"status": "paid", "license_envelope": lic_handle}
     ```
   - This stores the value in `HandleVault` ($\Sigma$) with `owner_peer_id = ctx.peer_id` and `allowed_sinks = ["user_egress"]`, and returns only the handle `"h_license_key_4a1b2c3d4e5f6071"` to the LLM!
2. **Delivery at Layer 2 Egress (`reply_text_to_current_user` / Outbound Card):**
   - The LLM sees `"h_license_key_4a1b2c3d4e5f6071"` and writes in its reply to the user:
     `"پرداخت شما ثبت شد. کد لایسنس شما: h_license_key_4a1b2c3d4e5f6071"` (or calls `send_envelope_to_current_user(handle)`).
   - At the Layer 2 egress boundary (right before the message is sent over Bale/Telegram/WhatsApp):
     - Layer 2 checks: **(a) Does `row.owner_peer_id == Γ.peer_id`? (b) Is `"user_egress"` in `row.allowed_sinks`?**
     - If **YES**: Layer 2 replaces `h_license_key_4a1b2c3d4e5f6071` with the real plaintext `"LIC-9988-7766"` **in the network packet sent to the user's messenger**, while writing `"[پاکت خروجی ارسال‌شده: LIC-****-7766]"` into the `messages` database table!
     - Because `messages` stores only the masked placeholder, **even on the next conversational turn when `messages` history is loaded back into the LLM prompt, the LLM NEVER sees the plaintext of the outbound envelope!**

---

## Part 3 — Where Does This Belong in the Codo Slash-Command Pipeline?

You asked:
> *"بعد به نظرم فهرست همه ابزارهایی که در اختیار قرار می‌گیره رو ببینه این شخص تولیدکننده: دقیقاً چه ابزارهایی در اختیار قرار می‌گیره، آیا خودشون کار انجام میدن یا دکمه می‌فرستن اون ابزارها، و اینکه چه چیزهایی هم درون پاکت رد و بدل میشه. برو یکم بررسی کن ببین جای این کجاست، چه شکلی باید این رو بگیریم، آیا این همون اسلش اس‌اوپی‌اس (`/sops`) هست یا یه چیز دیگه هستش."*

Let's diagnose why this felt out of place in V6.0.3, and then compare the three ways to structure it in V6.1.

### 3.1 The Diagnosis: Why Putting the LLM Tool Table in `/tools` (Step 4) Failed in V6.0.3

Look at the order of commands in V6.0.3 / V6.1 Round 1:
`[01] /start` $\to$ `[02] /idea-core` $\to$ `[03] /prd` $\to$ **`[04] /tools`** $\to$ **`[05] /sops`** $\to$ **`[06] /data-model`** $\to$ `[07] /edge-cases`

Notice the chronology problem:
1. In V6.0.3, `/tools` (Step 4) was actually doing **two completely different things**:
   - **Job A (External Integrations & Sign-ups):** Deciding which messenger accounts (`bale_bot`, `telegram_user`), which `tool-bank` packages (`bale-wallet`, `rss-reader`, `wordpress-publisher`), and which companion containers (`wordpress`, `waha`) the agent needs, so the participant can start registering bots/SIMs in parallel.
   - **Job B (Internal LLM Tool & Envelope Table):** Listing all the functions the Harness exposes to the LLM (`confirm_registration`, `cancel_registration`, `check_my_status`, etc.) and their `@principal_command` vs. `@llm_tool` and `HandleRef` status.
2. **Why Job B was in the wrong place at Step 4:**
   - At Step 4 (`/tools`), the participant **has NOT written `/sops` (the step-by-step operating procedures) or `/data-model` (the data fields) yet!**
   - How can the participant decide whether `لغو ثبت‌نام` needs a confirmation button, or whether `آدرس پستی` should be in an Envelope (`پاکت`), *before* they have defined the registration/cancellation procedures in `/sops` and the data fields in `/data-model`?! They can't!

---

### 3.2 Comparing the 3 Candidate Designs for V6.1

Here are the three clean ways to place this in the Codo pipeline:

| Option | Pipeline Order | Where Each Decision Happens | Pros | Cons |
|---|---|---|---|---|
| **Option A (Recommended #1):<br/>Keep External Accounts in `/tools`, and Put the Complete "LLM Action & Envelope Contract Table" at the Culmination of `/sops` (Synced with `/data-model`)** | `/start` $\to$ `/idea-core` $\to$ `/prd` $\to$ `/tools` *(External Accounts & Tool-Bank)* $\to$ **`/sops` *(Procedures + LLM Action & Envelope Table)*** $\to$ `/data-model` $\to$ `/edge-cases` | • **`/tools` (Step 4):** Only asks about **External Reach** (Messenger accounts, Tool-Bank plugins, Companion Docker services, and parallel sign-up guide).<br/>• **`/sops` (Step 5):** As we design each procedure (`رویه`), we identify every **Action (`کار / ابزار مدل`)** and every **Data Exchange (`پاکت ورودی / خروجی`)**. At the end of `/sops`, Codo presents the **Master Table of LLM Tools, Confirmation Modes & Envelopes** and asks the creator in `04-sops-questions.md` which actions run directly vs. send a confirmation button, and which data fields go into envelopes! | • **Zero new slash commands** (keeps the pipeline compact at 14 steps).<br/>• Decisions about confirmation buttons (`مستقیم` vs. `دکمهٔ تأیید`) happen **right inside `/sops`** where the participant is actively thinking about the step-by-step user flow (`رویهٔ ثبت‌نام`, `رویهٔ لغو ثبت‌نام`)!<br/>• Sign-ups in `/tools` still start early at Step 4. | `sops.md` holds both the narrative procedures and the summary table of LLM tools & envelopes (which actually fit together very naturally!). |
| **Option B (Recommended #2):<br/>Reorder Pipeline so `/sops` and `/data-model` Come BEFORE `/tools`!** | `/start` $\to$ `/idea-core` $\to$ `/prd` $\to$ **`/sops`** $\to$ **`/data-model`** $\to$ **`/tools`** $\to$ `/edge-cases` | • **`/sops` (Step 4):** Defines the behavioral procedures (`رویه‌ها`) in plain language.<br/>• **`/data-model` (Step 5):** Defines the data entities and fields (`نام، موبایل، آدرس، کد رهگیری`).<br/>• **`/tools` (Step 6):** Now that 100% of procedures and data fields are known, `/tools` defines **both** the external accounts/tool-bank packages **AND** the complete **LLM Tool Inventory, Confirmation Mode (`مستقیم` / `دکمهٔ تأیید`), and Envelopes (`پاکت ورودی/خروجی`)**! | • The word **`/tools` (`ابزارها`)** literally matches what the participant expects: *"Show me the complete list of tools the LLM gets, whether they execute directly or send a button, and what goes in an envelope!"*<br/>• By Step 6, every SOP and every data field from `/data-model` is already known! | BotFather / SIM sign-up instructions happen 2 steps later (at Step 6 instead of Step 4, roughly 15 minutes later—though `/idea-core` already names the messenger platforms). |
| **Option C:<br/>Add a Dedicated Slash Command `/harness` (or `/permissions` / `/actions`) After `/data-model`** | `/start` $\to$ `/idea-core` $\to$ `/prd` $\to$ `/tools` $\to$ `/sops` $\to$ `/data-model` $\to$ **`/permissions`** $\to$ `/edge-cases` | Dedicates a standalone stage right after `/sops` + `/data-model` exclusively to reviewing the table of LLM tools, choosing `مستقیم` vs. `دکمهٔ تأیید`, and choosing `پاکت ورودی/خروجی` for each data field. | • Gives the Harness security & UX contract its own dedicated spotlight command. | Adds +1 command and +1 questions loop back into the pipeline right after we just removed `/manage-spec` to save tokens and time. |

#### Advisor Recommendation on Placement:
- **Between Option A and Option B, both avoid adding a new command while solving the problem completely:**
  - If you want `/tools` to stay at Step 4 (so BotFather sign-ups start immediately after `/prd`), **Option A (putting the Master LLM Tool & Envelope Table inside `/sops`, with field-level envelope tags mirrored in `/data-model`)** is seamless: because while writing each SOP (`رویهٔ ثبت‌نام`, `رویهٔ لغو ثبت‌نام`), the participant is already thinking about *"How does this procedure happen? Should the bot register them right away or send a confirmation button? What inputs does it take?"*
  - Alternatively, if you feel `/sops` is already heavy and you want `/tools` (`ابزارها`) to be the place where the participant inspects the full list of LLM tools, **Option B (moving `/tools` right after `/sops` and `/data-model`: `/prd` $\to$ `/sops` $\to$ `/data-model` $\to$ `/tools` $\to$ `/edge-cases`)** is super clean because once you know the SOPs and Data Model, `/tools` has 100% of the information needed to list every single LLM tool, its confirmation mode, and its envelopes!

---

### 3.3 How Codo Presents and Collects This Decision from the Participant (Concrete Design)

Regardless of whether we place it in `/sops` (Option A) or `/tools` after `/data-model` (Option B), here is **the exact UX and document structure** that the participant sees.

#### Step 1: How Codo Asks the Participant in the Questions File (`*-questions.md`)
Instead of asking abstract security theory questions, Codo groups the agent's discovered capabilities and data fields into **two concrete, plain-Persian questions** with sensible defaults pre-recommended:

> **سؤال نمونه ۱ (نحوهٔ اجرای کارها توسط هوش مصنوعی — راحتی کاربر در برابر تأیید قطعی):**
> برای هر کدام از کارهایی که کارمند شما در گفت‌وگو انجام می‌دهد، مشخص کنید که آیا می‌خواهید هوش مصنوعی **مستقیماً خودش آن کار را انجام دهد** (راحت‌تر و سریع‌تر برای کاربر) یا **دکمهٔ تأیید برای کاربر/شما بفرستد** (امن‌تر در برابر اشتباهِ مدل)؟
> 1. **ثبت‌نام اولیه در دوره (`register_attendee`):**
>    - (الف) ارسال دکمهٔ تأیید رسمی به کاربر قبل از ثبت نهایی *(پیشنهاد ما اگر ثبت‌نام تعهد مالی دارد)*
>    - (ب) اجرای مستقیم توسط هوش مصنوعی به محض دریافت نام و شماره *(راحت‌تر برای کاربر اگر ثبت‌نام رایگان یا کم‌ریسک است)*
> 2. **لغو ثبت‌نام (`cancel_registration`):**
>    - (الف) ارسال دکمهٔ تأیید رسمی به کاربر قبل از حذف ثبت‌نام *(پیشنهاد ما — چون لغوِ ناخواسته باعث نارضایتی است)*
>    - (ب) اجرای مستقیم توسط هوش مصنوعی در گفت‌وگو
> 3. **انتشار پست در کانال / وبلاگ (`publish_post`):**
>    - (الف) ارسال پیش‌نویس با دکمهٔ `[✅ تأیید و انتشار]` برای خودِ شما (کارفرما)
>    - (ب) انتشار مستقیم و خودکار توسط کارمند بدون نیاز به تأیید هر پست

> **سؤال نمونه ۲ (پاکت‌های محرمانگی — چه اطلاعاتی از مدل هوش مصنوعی مخفی بماند؟):**
> اطلاعاتی که درون **«پاکت محرمانه»** قرار می‌گیرند، توسط هارنس رمزنگاری می‌شوند؛ یعنی در دیتابیس شما ذخیره می‌شوند و به دست شما یا کاربر می‌رسند، اما **مدل هوش مصنوعی (LLM) هرگز متن واقعی آن‌ها را نمی‌بیند**. برای هر مورد مشخص کنید کدام حالت را می‌خواهید:
> 1. **شماره موبایل شرکت‌کننده (`phone`):**
>    - (الف) درون پاکت ورودی با دکمهٔ رسمی اشتراک شماره (`phone_verified`) *(پیشنهاد ما)*
>    - (ب) درون پاکت ورودی حتی اگر در متن تایپ شود (`phone_any`)
>    - (ج) عادی (مدل هوش مصنوعی شماره را ببیند)
> 2. **آدرس پستی کاربر (`postal_address`):**
>    - (الف) درون پاکت ورودی (هارنس در یک پیامِ محرمانه آدرس را از کاربر می‌گیرد و به مدل نشان نمی‌دهد)
>    - (ب) عادی (مدل هوش مصنوعی آدرس را ببیند؛ مثلاً اگر می‌خواهید مدل خودش شهر یا منطقهٔ آدرس را بررسی کند)
> 3. **کد تخفیف / لینک اختصاصی وبینار که به کاربر تحویل داده می‌شود (`webinar_link`):**
>    - (الف) درون پاکت خروجی (مستقیماً به کاربر نمایش داده شود بدون اینکه وارد پرامپت مدل شود) *(پیشنهاد ما)*
>    - (ب) عادی (مدل بتواند متن لینک/کد را ببیند)

*(Note: If the participant picks `اجرای مستقیم توسط مدل` for a high-risk action that moves money or messages external channels without owner confirmation, Codo still emits the friendly `⚠️ هشدار امنیتی` box explaining the trade-off and records their choice in `docs/decisions.md`!)*

---

#### Step 2: The Unified Table Written into the Living Document (`sops.md` or `tools.md`)
So the participant can see **at a single glance** every tool the LLM has, what it does, whether it executes directly or sends a button, and what envelopes (`پاکت`) it uses, Codo generates two crystal-clear tables in the living doc:

##### جدول ۱: فهرست کامل همهٔ ابزارها و دستورهای در اختیار مدل هوش مصنوعی (`LLM Tool & Action Inventory`)
| # | نام ابزار / کار (`slug`) | در کدام رویه (`SOP`)؟ | این ابزار چه کاری انجام می‌دهد؟ | نحوهٔ اجرا توسط مدل (`اجرای مستقیم` / `دکمهٔ تأیید کاربر` / `دکمهٔ تأیید کارفرما`) | پاکت‌های ورودی/خروجی این ابزار (`HandleRef`) | معادل در منوی بدون مدل (`LLM-Zero`) |
|---|---|---|---|---|---|---|
| ۱ | `get_event_info` | همهٔ رویه‌ها | نمایش جزئیات، زمان و ظرفیت باقی‌ماندهٔ رویداد | **اجرای مستقیم** (فقط خواندنی) | — | دکمهٔ `[📅 معرفی و ظرفیت رویداد]` / کد `1` |
| ۲ | `search_faq` | پاسخ به سؤالات | جستجو در پایگاه دانش رویداد | **اجرای مستقیم** (فقط خواندنی) | — | دکمهٔ `[❓ سؤالات متداول]` / کد `2` |
| ۳ | `register_attendee` | ثبت‌نام | ثبت‌نام کاربر فعلی در رویداد | **اجرای مستقیم** *(به انتخاب سازنده برای راحتی کاربر)* | ورودی: `phone` (پاکت شماره)، `address` (پاکت آدرس) | دکمهٔ `[📝 ثبت‌نام در رویداد]` / کد `3` |
| ۴ | `cancel_registration` | لغو ثبت‌نام | لغو ثبت‌نام کاربر فعلی | **ارسال دکمهٔ تأیید به کاربر** (`propose_cancel_registration`) | — | دکمهٔ `[❌ لغو ثبت‌نام]` / کد `4` |
| ۵ | `issue_access_link` | تحویل لینک | صدور لینک اختصاصی ورود پس از پرداخت | **اجرای مستقیم** (پس از تأیید پرداخت) | خروجی: `access_link` (پاکت خروجی به کاربر) | دکمهٔ `[🔗 دریافت لینک ورود]` / کد `5` |
| ۶ | `escalate_question` | ارجاع به کارفرما | ارجاع سؤال بی‌پاسخ کاربر به کارفرما (محدود به ۱ بار) | **اجرای مستقیم** (با بنر هشدار سیستمی) | — | دکمهٔ `[💬 ارتباط با پشتیبان]` / کد `6` |

##### جدول ۲: فهرست پاکت‌های محرمانگی (`Confidentiality Envelopes — Inbound & Outbound`)
| نام داده (`key`) | جهت پاکت (`ورودی از کاربر` / `خروجی به کاربر`) | وضعیت محرمانگی | روش دریافت یا تحویل توسط هارنس | کدام ابزارها از آن استفاده می‌کنند؟ |
|---|---|---|---|---|
| `phone` (شماره موبایل) | **پاکت ورودی** | 🔒 مخفی از مدل (`HandleRef["phone_verified"]`) | دکمهٔ رسمی اشتراک شماره در بله/تلگرام (یا اسکرپ خودکار اعداد در متن) | `register_attendee` |
| `address` (آدرس پستی) | **پاکت ورودی** | 🔒 مخفی از مدل (`HandleRef["address"]`) | درخواست پاکت متنی در لایه ۱ (`request_envelope_input("address")`) | `register_attendee` |
| `access_link` (لینک اختصاصی) | **پاکت خروجی** | 🔒 مخفی از مدل (`EnvelopeOut["access_link"]`) | جایگذاری خودکار توسط لایه ۲ هنگام ارسال پیام به کاربر (`user_egress`) | `issue_access_link` |
| `full_name` (نام و نام خانوادگی) | عادی (بدون پاکت) | 👁️ قابل مشاهده برای مدل | دریافت عادی در گفت‌وگو (برای خطاب قرار دادن محترمانهٔ کاربر) | `register_attendee` |

Look how transparent that is:
1. The participant sees **100% of the tools** the LLM has access to (`جدول ۱`).
2. For every single tool, they see whether the LLM **executes it directly (`اجرای مستقیم`)** or **sends a confirmation button (`ارسال دکمهٔ تأیید`)**.
3. They see **100% of the data items** exchanged in **Envelopes (`پاکت ورودی / پاکت خروجی`)** vs. plain text (`جدول ۲`).

---

## Part 4 — Auditing & Rewriting the Security Paper (`BRAH_agent_security_paper.html`) for V6.1

In Paragraph 2 of `03-transcription.md`, you asked:
> *"ضمناً فکر می‌کنم مقاله‌ای که توی نسخه ۶.۰.۴ اگه اشتباه نکنم ساخته بودیم باید اون مقاله هم در واقع بازنویسی بشه به خاطر اینکه دیگه اون قضیه اجاره چیز رو نداریم البته اون هم قرار نبود توی مقاله بره شایدم نرفته باشه مقاله رو بخون اگر رفته اون مفاهیم رو حذف کنه و فقط اون هسته اصلی ایده ما رو نگهدار که همون در واقع سی آی ای باشه"*

### 4.1 Audit of What Went Into `V6.0.3/BRAH_agent_security_paper (1).html`

I read `V6.0.3/BRAH_agent_security_paper (1).html` completely. Even though the paper's core thesis is the CIA Triad, **the V6.0.3 multi-tenant rental and broker architecture had pervaded 9 different sections of the paper**:

| Location in V6.0.3 Paper                                                 | Multi-Tenant / Rental / Broker Content Found in the Paper                                                                                                                                                                                                                                 | Action Taken in the V6.1 Rewrite                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Abstract & Keywords** (L83–84)                                         | Framed around *"multi-tenant services"*, *"In public, multi-tenant deployments"*, *"tenant parameter"*, keyword *"multi-tenant security"*.                                                                                                                                                | Reframed around **public-facing commercial and organizational service agents** (*"public service-agent threat model"*). Replaced *"multi-tenant security"* with *"capability-based security"*.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Section 1.2** (L96)                                                    | Cited *"multi-tenant brokerage platforms"* and named the model *"the public multi-tenant service-agent threat model"*.                                                                                                                                                                    | Renamed to the **public service-agent threat model** (serving external customers, registrants, and subscribers over messaging platforms and APIs).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Section 3.1 Notation** (L138–145)                                      | Defined 4 principal classes $S = S_{\text{user}} \cup S_{\text{op}} \cup S_{\text{brk}} \cup S_{\text{adm}}$ including **wholesale brokers ($S_{\text{brk}}$)** who *"create tenant instances and settle wholesale usage"*; put `tenant_id` inside $\Gamma$ (Eq. 1) and $\Sigma$ (Eq. 2). | Simplified principals to **$S = S_{\text{user}} \cup S_{\text{owner}}$** (external end-users/callers and the service owner/operator). Simplified $\Gamma = \langle \text{run\_id}, \text{port}, \text{peer\_id}, \text{role}, \sigma_{\text{db}} \rangle$ and $\Sigma : R \to V_{\text{secret}} \times \text{Kind} \times \text{OwnerPeer} \times 2^T$.                                                                                                                                                                                                                                                                                                                                                    |
| **Section 4.4 Administrative planes and delegated authority** (L209–211) | Entire subsection describing the **4 planes** (`administration plane`, `broker plane`, `operator plane`, `end-user plane`), broker credit limits, wholesale payables, and per-tenant spending ceilings on the broker ledger.                                                              | **Deleted the broker/admin rental planes entirely!** Replaced Section 4.4 with **Owner Supervision and Out-of-Band Operator Approvals** (how the service owner configures the agent and approves high-consequence actions via deterministic owner buttons without depending on the LLM).                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Section 6.2 & 6.3 (Integrity)** (L242–251)                             | Claimed that **100% of state-mutating commands $C_{\text{mutate}}$ are strictly prohibited from direct execution by $M$** (Table 1: *"Prohibited for state-mutating commands"*).                                                                                                          | Updated to match your V6.1 insight: **Policy-Partitioned Mutation Authority ($C_{\text{mutate}} = C_{\text{mutate}}^{\text{direct}} \cup C_{\text{mutate}}^{\text{confirm}}$)**! Explains that the service designer partitions mutations into **(a) Direct Context-Bound Mutations ($C_{\text{mutate}}^{\text{direct}}$)**—where $M$ can execute low-risk actions directly for user convenience, while Layer 2 still binds `peer_id` from $\Gamma$ so $M$ can never affect another user's state—and **(b) Confirmation-Gated Mutations ($C_{\text{mutate}}^{\text{confirm}}$)**—where $M$ can only emit a WYSIWYS proposal $\Pi(c, \text{args})$ confirmed via button, post-turn nonce, or owner approval! |
| **Section 7 (Confidentiality)** (L270–296)                               | Focused only on inbound regex scrubbing (`phone_unverified`) and native contact shares (`phone_verified`); listed unstructured PII (like addresses) as an unsolved limitation in Section 11.2!                                                                                            | Upgraded to **Bidirectional Policy-Driven Capability Envelopes ($\Sigma$)**:<br/>1. **Inbound Envelopes:** (i) Verified platform contact cards, (ii) Configurable regex scrubbing, and **(iii) FSM-Prompted Box Envelopes (`request_envelope_input`)** for unstructured confidential fields like postal addresses or secrets!<br/>2. **Outbound Envelopes (`user_egress` sink):** Allowing tools/DB queries to return sensitive values (voucher codes, license keys, card numbers, stored addresses) as handles that Layer 2 unveils exclusively on the outbound wire to `Γ.peer_id` while redacting them from LLM history!                                                                                |
| **Section 8 (Code & Static Verification Gates)** (L301–354)              | Code example used `tenant_id=ctx.tenant_id`; Table 2 (`AST-01`–`AST-04`) referenced `broker_id` and banned all mutations unconditionally.                                                                                                                                                 | Updated code example to clean single-owner `codo-core` showing `requires_confirmation=True/False` and `HandleRef`; updated `AST-01`–`AST-04` to check the declared confirmation policy and envelope annotations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Section 9.4 Case Study 4 (`Brokerage marketplace`)** (L379–380)        | Described the two-sided **Agent Agency / Brokerage Marketplace** with wholesale spending caps and broker endpoints.                                                                                                                                                                       | Replaced with **Case Study 9.4: Automated Cloud Credential Provisioning (`Kandoo Cloud`)** — an agent that sells cloud deployment tokens, verifies payment deterministically, mints an isolated cloud token, and delivers it to the buyer inside an **Outbound Envelope (`user_egress`)** so the LLM planner never sees the minted secret token!                                                                                                                                                                                                                                                                                                                                                           |
| **Section 10 Table 4 (`I-4`)** (L392)                                    | `I-4`: *"Cross-tenant identifier tampering"*.                                                                                                                                                                                                                                             | Updated `I-4` to **Cross-peer state tampering & unauthorized mutation** (preventing $M$ from mutating another user's record even on `direct` tools via $\Gamma.\text{peer\_id}$ binding, and preventing unconfirmed execution on `confirm` tools).                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

### 4.2 Where the Rewritten V6.1 Paper Is Saved
- I have written the complete, publication-ready V6.1 paper to:
  `/home/omid/projects/workshop/workshop_docs/versions/V6.1/BRAH_agent_security_paper.html`
- It preserves 100% of the IEEE/ACM academic typesetting, SVG architecture diagram, formal definitions, theorems, proofs, and references from V6.0.3, while stripping every trace of multi-tenant rental/brokers and upgrading the CIA model with **Policy-Partitioned Mutations (`direct` vs. `confirm`)** and **Bidirectional Envelopes (`Inbound` & `Outbound`)**.

---

## Part 5 — Summary of Decisions to Lock Before Implementing V6.1 in Code & Templates

Here is the complete checklist of questions across Round 1 and Round 2 so you can confirm or adjust any point before we apply V6.1 to `codo-core`, `mcp-coolify`, and `templates/codo/`:

| # | Decision Area | Recommended Lock for V6.1 |
|---|---|---|
| **1** | **Where in the Codo pipeline should the Creator review the Master Table of LLM Tools (`مستقیم` vs. `دکمهٔ تأیید`) and Envelopes (`پاکت ورودی / خروجی`)?** | **Two great options (pick A or B):**<br/>• **Option A:** Keep `/tools` at Step 4 (for external accounts & tool-bank sign-ups) and place the **Master LLM Tool & Envelope Table** inside **`/sops` (Step 5)** (mirrored in `/data-model`).<br/>• **Option B:** Reorder the pipeline to `/prd` $\to$ **`/sops`** $\to$ **`/data-model`** $\to$ **`/tools`** $\to$ `/edge-cases`, so `/tools` comes *after* SOPs and Data Model and presents the complete inventory of external accounts + internal LLM tools + confirmation modes + envelopes in one place! |
| **2** | **How should `codo-core` express `Direct` vs. `Confirmation Button` in code?** | Use `@principal_command(..., requires_confirmation=True | False)` (or `confirmation="user" | "direct" | "owner" | "none"`):<br/>• `requires_confirmation=True` ("user") $\to$ LLM gets `propose_<slug>` (sends WYSIWYS button / 4-digit egress nonce).<br/>• `requires_confirmation=False` ("direct") $\to$ LLM gets `<slug>` directly (still 100% bound to `Γ.peer_id` / `Γ.customer_id` and `HandleVault`!).<br/>• `confirmation="owner"` $\to$ LLM gets `propose_to_owner_<slug>` (sends `[✅ تأیید]` / `[❌ رد]` inline buttons to `OWNER_CHAT_ID`). |
| **3** | **How should Inbound Envelopes (`پاکت ورودی`) work for unstructured fields like Postal Address (`آدرس`)?** | Add `request_envelope_input(kind, label_fa)` to Layer 1/2 (`PeerDialogFSM` state `AWAITING_ENVELOPE:<kind>`): Layer 1 asks the user for that field, intercepts their next message *before* the LLM, stores it in `HandleVault` ($\Sigma$), and passes only `h_<kind>_<16hex>` to the LLM. |
| **4** | **How should Outbound Envelopes (`پاکت خروجی`) work when returning sensitive data (like a license key, private link, or card number) to the user?** | Add `ctx.envelope_for_user(plaintext, kind, masked_preview)` in Layer 3 (creates a handle with `"user_egress"` in `allowed_sinks`). When the handle appears in an outbound message to `CURRENT_USER`, Layer 2 unveils it on the wire to the user while storing only the masked preview in LLM-visible chat history. |
| **5** | **Non-Frequent Setup Actions (Humanoid OTP Login, DB Queries, Settings Updates)** | Per your note on `02-analysis.md` L194: done **exclusively via Codo** (local CLI / `workshop` MCP `db_query`/`db_exec`/`sync_data_file` / VPS `ssh`), with zero management bots and zero on-agent control MCPs. Real-time day-to-day approvals (receipt approval, customer escalation reply) happen via **Owner Chat Inline Buttons & Direct Reply** in Bale/Telegram. |
