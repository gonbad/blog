# V6.1 — Analysis Round 3: Deep Audit of All Unmentioned Flaws, Dead/Deprecated Code Layers, and Runtime Showstoppers Across `codo-core`, `mcp-coolify`, and `templates/codo/`

> **Why You Were Right to Call Me Out:**
> You asked: *"If I did not tell you `03-transcription.md`, you would not mention it!! why!? what other flaws there are that you did not mention!!??"*
> And in `04-analysis-round2.md` you added:
> **`COMMENT: there is no need for backward compatibility because there is no agent based on codo yet. I dont want dead or deprecated code anywhere.`**
>
> **Honest Admission:** In Round 1 (`02-analysis.md`), I only audited the multi-tenant rental layer you asked about in `01-transcription.md`, and I lazily treated the rest of V6.0.3 (`codo-core` + `templates/codo/`) as "already working and untouchable." I also kept suggesting backward-compatibility shims (`@principal_command` / `@llm_tool` aliases, `Hiring` $\leftrightarrow$ `ManagementSpec` sync) as if there were legacy agents in production.
>
> To answer your question honestly, I just read **every single Python file in `codo_core/` (31 files)**, **every server file in `mcp-coolify/`**, and **every command and template in `templates/codo/`** line by line with zero sacred cows. Below is the complete, unfiltered audit of **15 real flaws (5 layers of dead/deprecated code + 10 runtime/pipeline showstoppers)** that were hiding in the codebase and that we must fix in V6.1.

---

## Part 1 — The 5 Layers of Dead, Duplicate & Deprecated Code in `codo-core` (Zero Backward Compatibility)

Because V6.0.0, V6.0.1, and V6.0.3 were layered on top of each other without deleting the older generations, `codo-core` currently carries **two or three competing implementations of almost every concept**. Since there are **zero** existing agents in production, we should ruthlessly delete all legacy/duplicate layers:

### Flaw 1.1 — Five Separate Tool Lists & Three Decorators on `Job` (`declare.py`, `tools.py`)
- **What is in the code right now (`declare.py` L579–590):**
  `Job` has **5 separate tool fields**: `tools`, `llm_tools`, `principal_commands`, `employer_tools`, `work_tools`, and **4 decorators**: `@tool(approval=...)` (V6.0.0), `@llm_tool` (V6.0.3), `@principal_command` (V6.0.3), `@employer_tool` (V6.0.1), `@work_tool` (V6.0.1).
- **What V6.1 should have (Zero Legacy):**
  - **ONE decorator: `@action`** (and **one list: `Job.actions`**) for all capabilities of the agent!
  - Each `@action` declares its mode explicitly:
    - `mode="read"` (read-only helper for the LLM),
    - `mode="direct"` (state mutation the LLM can call directly for `CURRENT_USER`, plus optional menu button),
    - `mode="user_confirm"` (LLM only gets `propose_<slug>`, sends WYSIWYS button / 4-digit nonce to `CURRENT_USER`),
    - `mode="owner_confirm"` (sends `[✅ تأیید]` / `[❌ رد]` inline buttons to `OWNER_CHAT_ID`),
    - `mode="menu_only"` (only on the deterministic `LLM-Zero` menu, not exposed to the LLM).
  - Delete `@tool`, `@llm_tool`, `@principal_command`, `@employer_tool`, `Job.tools`, `Job.llm_tools`, `Job.principal_commands`, `Job.employer_tools` completely.

### Flaw 1.2 — Two Competing Approval Engines (`Approval` + `DeferredToolRequests` + `manager.py` vs. `ActionProposal` + `layer1_fsm.py`)
- **What is in the code right now (`engine.py` L640–721, L847–874, `manager.py`, `models.py` L168–178):**
  - V6.0.0 built `Approval` + `manager.py` around `pydantic_ai.DeferredToolRequests` (which pauses the LLM mid-turn, base64-pickles `pydantic_messages`, and asks the manager to type a 6-digit code on a separate `management` account).
  - V6.0.3 built `ActionProposal` + `layer1_fsm.py` (deterministic proposals outside the LLM turn).
  - **Both systems are still running inside `engine.py` at the same time!**
- **What V6.1 should have:**
  - Delete `Approval` table, `DeferredToolRequests`, `_pause_for_approval`, `resume_approval`, and the entire `codo_core/manager.py` (102 lines) completely!
  - Use `ActionProposal` uniformly for both `user_confirm` and `owner_confirm`.

### Flaw 1.3 — Two Competing Secret Vaults (`SealedBlob` / `sealed.py` vs. `HandleEntry` / `handles.py`) and Duplicate Regexes (`guard.py` vs. `handles.py`)
- **What is in the code right now:**
  - `models.py` has **both** `SealedBlob` (`sealed_blobs` table, `inp_...` / `env_...` refs in `sealed.py`) **and** `HandleEntry` (`handle_vault` table, `h_...` refs in `handles.py`).
  - `guard.py` (L27–32) and `handles.py` (L29–32) define the **exact same 4 regexes** (`PHONE_RE`, `NATIONAL_ID_RE`, `CARD_RE`, `SHEBA_RE`) and two separate redaction functions (`guard.redact` and `handles.redact_pii`)!
- **What V6.1 should have:**
  - Delete `SealedBlob`, `codo_core/sealed.py`, `ctx.seal()`, `ctx.unseal()`, `seal_value`, and `list_sealed` completely.
  - Keep **one** unified vault: `HandleEntry` (`handles.py`) for all inbound and outbound envelopes (`پاکت‌ها`), and one set of normalizer/regex functions.

### Flaw 1.4 — Two Competing Configuration Models on `Job` (`Hiring` + `PersonaSlot` + `BalancePolicy` vs. `ManagementSpec` + `WiringSlot` + `Meter`)
- **What is in the code right now (`declare.py` L46–158, L591–620):**
  `declare.py` still carries V6.0.0's `Hiring`, `BalancePolicy`, `PersonaSlot` alongside V6.0.1's `ManagementSpec`, `WiringSlot`, `Meter`, `Field`, plus a 30-line `__post_init__` syncing `self.hiring` $\leftrightarrow$ `self.management` back and forth!
- **What V6.1 should have:**
  - Delete `Hiring`, `ManagementSpec`, `PersonaSlot`, `WiringSlot`, `Meter`, `BalancePolicy`, and `Field` completely!
  - An In-House `Job` simply declares `slug`, `title`, `persona`, `accounts`, `sops`, `actions`, `envelopes`, `models`, `band` (optional haggling band), and `settings` (a plain dict of initial key-value settings seeded into the DB).

### Flaw 1.5 — 16 Hardcoded Built-in LLM Tools Mounted on Every Turn (`tools.py` L231–446)
- **What is in the code right now (`codo_core/tools.py`):**
  Every time the LLM runs on *any* agent, `build_toolset()` injects **16 built-in tools** into the prompt schema—including **exact duplicates** from different versions:
  1. `escalate_to_manager` (V6.0.0) **AND** `escalate_customer_question_to_employer` (V6.0.3)!
  2. `make_offer` (V6.0.0) **AND** `make_haggle_offer` (V6.0.3)!
  3. `quote`, `accept_offer`, `request_payment`, `get_balance_and_usage` (injected even when the agent has zero payments or haggling!).
  4. `seal_value` and `list_sealed` (legacy V6.0.0).
  5. `reply_text_to_current_user` (which causes the Double-Reply Bug—see Flaw 2.5 below!).
- **Impact:** Burns ~1,200 extra input tokens on every single turn and causes the LLM to call the wrong duplicate tool.
- **What V6.1 should have:**
  - Delete all legacy duplicates.
  - Mount `make_haggle_offer` **only** if `job.band is not None`.
  - Mount `request_envelope_input` **only** if `job.envelopes` has prompted inbound envelopes.
  - Keep only the lean core built-in tools (`search_kb`, `escalate_to_owner`).

---

## Part 2 — 10 Runtime & Pipeline Showstoppers Hiding in the Codebase

Here are the **10 concrete bugs** I found in the existing code that would break rehearsals or workshop participants if left unfixed:

### Flaw 2.1 (SHOWSTOPPER) — The Local Webhook Relay (`codo_core/tunnel.py` $\leftrightarrow$ `mcp-coolify/relay.py`) Has 4 Broken Protocol Mismatches!
Look at `packages/codo-core/codo_core/tunnel.py` alongside `services/mcp-coolify/server/app/relay.py`. Evidently they were written at different times and never tested together:
1. **Auth Mismatch (`4401 Unauthorized`):**
   - Server (`relay.py` L79–87) reads `ws.headers.get("authorization")` (`Bearer <token>`) and ignores query params.
   - Client (`tunnel.py` L54) connects to `wss://.../tunnel?token={tok}` with **no `Authorization` header**! Server immediately closes with `4401`!
2. **Request Frame Crash (`AttributeError`):**
   - Server (`relay.py` L139–140) sends `"headers": [[k, v], ...]` (a `list` of pairs) and `"body": "<b64>"`.
   - Client (`tunnel.py` L25–26) reads `msg.get("body_b64")` (getting `b""`!) and calls `(msg.get("headers") or {}).items()` on the `list`, crashing with `AttributeError: 'list' object has no attribute 'items'`!
3. **Response Frame Timeout (`504 Gateway Timeout`):**
   - Server (`relay.py` L104, L147–148) waits for `frame.get("type") == "response"`, `answer.get("body")`, and `headers` as a `list` of `[k, v]` pairs.
   - Client (`tunnel.py` L32–34) sends a dict **without `"type": "response"`**, with `"body_b64"` instead of `"body"`, and `headers` as a `dict`! So the server ignores the reply and times out with `504`!
4. **Dual-Process Reconnect Fight (`run.sh` L6 & L9 vs. `app.py` L95):**
   - `codo-core serve` (`app.py` L93–95) already spawns `asyncio.create_task(tunnel.run())` when `WORKSHOP_RELAY_URL` is set.
   - Yet `templates/codo/run.sh` (L9) *also* runs `codo-core tunnel &` as a second background process! Both processes connect with the same seat token and kick each other off `relay.py` (L94–99) every 2 seconds in an infinite loop!
   - And `deploy.md` (L10) instructs Codo to set `WORKSHOP_RELAY_URL` on the **staging** container too—which would make the staging container steal the laptop's dev tunnel!

---

### Flaw 2.2 (SHOWSTOPPER) — Scheduled SOPs (`02-neda-reporter` / `app.py:run_sop`) Cannot Function Under V6.0.3!
Look at `codo_core/app.py` L165–206 (`run_sop`) and `codo_core/security.py`:
1. When a scheduled SOP wakes up (e.g., Neda fetching RSS news and publishing to WordPress/Bale), `run_sop` creates a dummy conversation with `platform="web"` and `chat_id="system:<sop_name>"`.
2. In `security.py` (`AST-03`, L199–205), any LLM-callable tool is **banned from making HTTP requests (`post`, `request`, `http`)** and **banned from calling `ctx.send` (`AST-06`)**! So an LLM running a scheduled SOP cannot call an RSS fetcher tool, cannot call a WordPress REST API tool, and cannot post to a channel!
3. Even if the scheduled SOP uses a proposal tool (`propose_publish_post`) to ask the Owner for approval first, `tools.py` (L616) sends the confirmation card to `self.conversation.chat_id`, which in `run_sop` is `"system:daily_news"` (a non-existent dummy chat with `driver=None`), instead of sending it to `OWNER_CHAT_ID`!
- **The Fix for V6.1:**
  - In `run_sop`, bind the scheduled turn's notification/approval target to `OWNER_CHAT_ID` (on the owner's bot/account driver) and configured `publish` accounts.
  - In `security.py` (`AST-03`), allow outbound `ctx.http` inside tools that call declared external APIs (RSS, WordPress, web search) while keeping `ctx.send` restricted to declared channels/current user!

---

### Flaw 2.3 (SHOWSTOPPER) — `AST-02` in `security.py` Accidentally Bans Read-Only SQLAlchemy `SELECT` Queries (`await s.execute(select(...))`)!
Look at `codo_core/security.py` L39–43 and L181–191:
```python
MUTATION_CALLS = {
    "add", "add_all", "delete", "delete_all", "execute", "executemany", ...
}
```
In async SQLAlchemy (`AsyncSession`), **every read-only `SELECT` query is run via `await s.execute(select(MyModel).where(...))`!**
Because `"execute"` is unconditionally flagged in `security.py` L187 (and `"add"` flags `my_set.add(...)`, and `"values"` in `MUTATION_BARE` flags `my_dict.values()`), **any read-only tool that queries a custom table from `data-model.md` using `await s.execute(select(...))` fails `codo-core check` with `AST-02: direct state mutation execute()`!**
- **The Fix for V6.1:**
  - In `security.py`, only flag `s.execute(...)` when its argument contains `insert`, `update`, `delete`, or raw SQL write keywords—never when its argument is `select(...)`! And do not flag `.values()` on dicts or `.add()` when not on a DB session (moreover, for `@action(mode="direct")`, DB writes scoped to `ctx.customer_id` are explicitly permitted!).

---

### Flaw 2.4 (SHOWSTOPPER) — Two Out-of-Sync Conversation History Stores (`Message` Table vs. `Conversation.pydantic_messages`) Cause an Infinite Contact-Share Loop!
Look at `codo_core/engine.py` L217, L805, and L938–942:
1. `Conversation` has **two separate history mechanisms**:
   - The `messages` table (`Message` rows written by `memory.record(...)`), and
   - `Conversation.pydantic_messages` (a base64 JSON dump of PydanticAI's `result.all_messages()`, written only when an LLM turn completes).
2. Now trace what happens when a user shares their verified phone number (`engine.py` L217) or interacts with a Layer 1 button/wizard:
   - Layer 1 vaults the phone as `h_phone_verified_8a9f...` and calls:
     `await memory.record(conv.id, "in", "[System: CURRENT_USER shared verified phone handle h_phone_verified_8a9f...]", role="system")`
   - That writes the handle into the **`messages` table**, **NOT into `conv.pydantic_messages`!**
   - And `memory.memory_block()` (`memory.py` L109–116) only puts `facts`, `narrative`, and `plan` into the system prompt—it **never** includes recent rows from the `messages` table!
   - Therefore, on the very next turn when the user says *"حالا ثبت‌نامم کن"*, **the LLM never sees `[System: CURRENT_USER shared verified phone handle h_phone_verified_8a9f...]`**! It has no idea the user shared their contact and asks them to share it again in an infinite loop!
3. Furthermore, `conv.pydantic_messages` grows forever without truncation (`needs_summary` and `save_narrative` in `memory.py` L87–100 are **never called anywhere in the codebase**!).
- **The Fix for V6.1:**
  - Inject any Layer 1 system events (`[System: CURRENT_USER shared ...]`, wizard completions, payment confirmations) into the prompt context (or build the message window directly from the last `WINDOW=20` rows of `messages`!), and wire up rolling summarization when `messages` exceeds the window!

---

### Flaw 2.5 (SHOWSTOPPER) — Double Reply on Every Turn (`reply_text_to_current_user` + `result.output`) and Unchecked Handle Leakage in `result.output`
Look at `codo_core/tools.py` L232 and `codo_core/engine.py` L824–833:
- `tools.py` gives the LLM a tool `reply_text_to_current_user(text)` which immediately sends `text` to the user via `ctx.deps.send(safe)`.
- Then, when `agent.run()` finishes and returns its final response string `result.output` (`out`), `engine.py` L831–832 executes:
  ```python
  if not getattr(ctx, "_proposal_sent", False):
      await self._reply_to_conversation(conv, out)
  ```
- **What happens?**
  1. If the LLM calls `reply_text_to_current_user("سلام!")` AND then ends its turn by returning `"سلام!"` (or `"پاسخ ارسال شد"`), **the user receives TWO messages on every turn**—and calling `reply_text_to_current_user` wastes an extra LLM round-trip on every single message!
  2. Even worse: why does `reply_text_to_current_user` exist as a tool at all? In PydanticAI, the LLM's normal text output (`result.output`) **is** the reply to `CURRENT_USER`!
  3. And notice: `reply_text_to_current_user` checked `extract_handles(safe)` to block foreign handles, whereas `_reply_to_conversation(conv, out)` (`engine.py` L1022) **forgot to check `extract_handles(out)`**!
- **The Fix for V6.1:**
  - **Delete `reply_text_to_current_user` from `build_toolset`!** The LLM simply replies in natural text (`result.output`), saving 50% of LLM round-trips on normal chat turns!
  - Put the handle-ownership check and **Outbound Envelope Unveiling (`user_egress`)** directly inside `_reply_to_conversation()` in `engine.py` so every outbound message is mediated in one place!

---

### Flaw 2.6 (SHOWSTOPPER) — Bot Drivers (`bale_bot.py`, `telegram_bot.py`, `rubika_bot.py`) Cannot Actually Request Contacts, Never Answer Callback Queries, and Drop Payment Webhooks!
Look at `codo_core/accounts/base.py`, `bale_bot.py`, and `rubika_bot.py`:
1. **No `request_contact` Keyboard Button Exists in `HttpBot.send` (`base.py` L89–99):**
   - `propose_share_contact_button` (`tools.py` L312) and `engine.py` (L368) only send the text `"📱 لطفاً شماره تماس تاییدشده خود را با دکمهٔ اشتراک‌گذاری ارسال کنید."` with **zero keyboard markup**!
   - In Bale and Telegram, sharing a verified contact requires sending a `ReplyKeyboardMarkup` (`{"keyboard": [[{"text": "📱 اشتراک‌گذاری شماره تماس", "request_contact": True}]], "resize_keyboard": True, "one_time_keyboard": True}`). Without that, **no user on Bale or Telegram can ever share a verified phone number!**
2. **Missing `answerCallbackQuery` (`bale_bot.py` L17–28):**
   - When a user clicks any inline button (`callback_query`), `BaleBot` never calls `answerCallbackQuery(callback_query_id=cb["id"])`, so the button on the user's phone spins with a loading indicator until it times out!
3. **Dropped `pre_checkout_query` & Unwired Payment Handlers (`bale_bot.py` L28, `engine.py` L912):**
   - When a user pays a `bale_wallet` invoice, Bale sends `pre_checkout_query` (with no `message` field). `BaleBot.parse_update` returns `None` (`if not msg: return None`), so the payment fails on the user's phone!
   - Even if `successful_payment` arrives, `Engine._payment_update` (`engine.py` L912) only writes an `Event` log row—it never marks the order/registration as paid or notifies the user/owner!
   - Similarly, when a user sends a `card2card` receipt photo (`ev.media["type"] == "photo"`), `engine.py` never calls `Card2CardAdapter` or sends `[✅ تأیید رسید]` / `[❌ رد رسید]` inline buttons to `OWNER_CHAT_ID`!
4. **`RubikaBot.send` (`rubika_bot.py` L26–31) Ignores `out.buttons` Completely:**
   - Any confirmation button sent on `rubika_bot` is silently dropped, leaving the user unable to confirm any proposal!

---

### Flaw 2.7 — `WahaDriver` (`whatsapp_waha.py`) Never Registers Its Webhook, and `EitaaUser` (`sidecar/eitaa/server.js`) Has Broken Paths
1. **`whatsapp_waha.py` (L35–50 & L119–120):**
   - `WahaDriver.start_poller` is a no-op (`return None`), so it relies on webhooks (`parse_update`).
   - Yet `WahaDriver.begin_login` creates/starts the WAHA session (`POST /api/sessions`) **without passing `config: {"webhooks": [{"url": webhook_url, "events": ["message"]}]}`**! So WAHA never forwards incoming WhatsApp messages to the agent!
2. **`sidecar/eitaa/server.js` (L20–21 & L26):**
   - Line 20 hardcodes `path.resolve(__dirname, '../../../../../eBot')` (a path that does not exist when `codo-core` is installed via `pip` in a virtualenv or Docker container!).
   - Line 26 saves `state-${ACCOUNT}.json` in `__dirname` (inside `.venv/lib/.../site-packages/`) instead of `DATA_DIR/sessions/`, so every container redeploy wipes the Eitaa login session!

---

### Flaw 2.8 — `Message.tokens` Is Always `0` (`abuse.py` Token Caps Are Dead) & `search_knowledge` Searches Chat History Instead of Knowledge Files!
1. **`Message.tokens` is never populated (`engine.py` L154, L1051):**
   - `engine.py` never reads `result.usage().total_tokens` from PydanticAI, so `Message.tokens` is `0` on every row in the DB.
   - As a result, `tokens_today()` and `check_budget()` in `abuse.py` (L77–102) always compute `0` and **never enforce `customer_daily_token_cap` or `employment_daily_token_cap`**, and `/test` cannot measure token cost per conversation!
2. **`search_knowledge` bug (`tools.py` L327–330):**
   - The built-in tool `search_knowledge(query)` says *"Search the employment's knowledge files and this chat's history"*, but its implementation is literally one line: `return await memory.search_history(ctx.deps.conversation.id, query)`! It **never searches `job.knowledge` files or `Fact` rows**!

---

### Flaw 2.9 — `templates/codo/Dockerfile` Never Copies `docs/living/`, Breaking `job.role` and `job.prd` at Runtime!
- Look at `templates/codo/Dockerfile`:
  ```dockerfile
  WORKDIR /app
  ...
  COPY backend/ .
  CMD ["codo-core", "serve", "app/job.py"]
  ```
  And look at `templates/codo/run.sh`:
  ```bash
  cd "$(dirname "$0")/backend"
  codo-core serve app/job.py &
  ```
- In both local runs (`cd backend`) and Docker runs (`/app` containing only `backend/`), **`docs/living/idea-core.md` and `docs/living/prd.md` do not exist relative to `/app`!**
- So when `job.py` sets `role="docs/living/idea-core.md"` (as shown in `templates/codo/backend/app/job.py` L6–7!), `job.role_text()` checks `Path("docs/living/idea-core.md").exists()` $\to$ `False`, and passes the literal filename `"docs/living/idea-core.md"` as the LLM's system prompt!
- **The Fix for V6.1:** Either `/build` copies `idea-core.md`, `prd.md`, and `sops/*.md` into `backend/app/sops/` (or `job.py` constants), OR `run.sh` and `Dockerfile` run from the repo root with `docs/living/` included (while `codo-core check` scans `git ls-files` to ensure no secrets ever enter `docs/living/`).

---

### Flaw 2.10 — Secrets File Sprawl (`7` `.local.md` Files) & Contradiction Between `tools.md` and `build.md` + English Variable Names in Layer 1 Wizard
1. **Secrets File Contradiction (`templates/codo/docs/secrets/`):**
   - Currently `templates/codo/docs/secrets/` has **7 different `.local.md` templates** (`workshop.local.md`, `model.local.md`, `accounts.local.md`, `agent.local.md`, `proxy.local.md`, `secrets.local.md`, `environments.local.md`).
   - Worse: `/tools` (`tools.md` L70) tells the participant to write `<ACCOUNT>_TOKEN` into **`secrets.local.md`**, whereas `00-rules.md` (L39) and `/build` (`build.md` L22) tell the AI to read `<ACCOUNT>_TOKEN` from **`accounts.local.md`**!
   - **The Fix for V6.1:** Collapse `docs/secrets/` to just **2 human-readable files**:
     1. `docs/secrets/workshop.local.md` (written automatically by `/start`: `WORKSHOP_TOKEN`, `WORKSHOP_RELAY_URL`, `PROXY_URL`), and
     2. `docs/secrets/env.local.md` (**one single file** where the participant puts `LLM_*`, `<ACCOUNT>_TOKEN`, `OWNER_CHAT_ID`, `CARD_NUMBER`, etc., which copies straight to `backend/.env`!).
2. **English Parameter Names Shown to End-Users in the Layer 1 Deterministic Wizard (`engine.py` L423, L507):**
   - When a user clicks a button in `LLM-Zero` mode (or when the LLM is offline), Layer 1's wizard asks the user:
     `لطفاً مقدار «full_name» را ارسال کنید:`
     `لطفاً مقدار «laptop_ready» را ارسال کنید:`
   - Showing raw Python variable names (`full_name`, `laptop_ready`) to a Persian end-user is terrible UX.
   - **The Fix for V6.1:** Allow `@action` parameters to carry Persian labels (e.g. `labels_fa={"full_name": "نام و نام خانوادگی", "phone": "شماره تماس"}`) and require `codo-core check` (`AST-04`) to verify that every user-facing `@action` parameter has a Persian label for the `LLM-Zero` wizard!

---

## Part 3 — Summary Checklist: The Complete V6.1 Clean-Slate Plan

With Round 1 (`02-analysis.md`), Round 2 (`04-analysis-round2.md`), and this Round 3 deep audit (`05-analysis-round3.md`), we now have the **complete picture** with nothing hidden:

| Area | What We Delete (Zero Dead/Deprecated Code) | What We Fix / Build Cleanly in V6.1 |
|---|---|---|
| **1. Multi-Tenancy & MCPs** *(Round 1)* | Delete `broker.py`, `admin.py`, `employer.py`, `employments.py`, `ledger.py`, `Broker`, `BrokerLedgerEntry`, `Employment`, `LedgerEntry`, `/admin/mcp`, `/broker/mcp`, `/employer/mcp`, `/manage-spec`, `/admin`, `/broker`, `/employer`. | Single-owner In-House agent (`1 Agent = 1 Owner`). Managed directly via **Codo** (`sqlite3` locally, `workshop.db_query`/`db_exec`/`sync_data_file` on staging, `ssh` on VPS). |
| **2. Legacy V6.0.0 Shims** *(Round 3 — Your Comment)* | Delete `Hiring`, `ManagementSpec`, `PersonaSlot`, `WiringSlot`, `Meter`, `BalancePolicy`, `Field`, `Approval`, `DeferredToolRequests`, `manager.py`, `SealedBlob`, `sealed.py`, duplicate regexes in `guard.py`, and duplicate built-in tools in `tools.py`. | **One decorator (`@action`)** on `Job.actions`, **one proposal table (`ActionProposal`)**, **one vault (`HandleEntry` in `handles.py`)**, and **one secrets file (`docs/secrets/env.local.md`)**! |
| **3. Configurable Action Authority & Envelopes** *(Round 2)* | Remove the rigid ban that forced every mutation to send a button and only scrubbed 4 hardcoded regexes. | Per-action `mode="read" \| "direct" \| "user_confirm" \| "owner_confirm" \| "menu_only"` + Bidirectional Envelopes (`پاکت ورودی` via contact/regex/FSM box for addresses, and `پاکت خروجی` via `user_egress`). Master table reviewed by creator in `/sops` (or `/tools` after `/data-model`). |
| **4. Runtime & Transport Showstoppers** *(Round 3)* | Delete `reply_text_to_current_user` tool (fixes double-reply bug and saves 1 LLM call per turn); remove duplicate `codo-core tunnel` from `run.sh`. | • Fix all 4 protocol bugs between `tunnel.py` and `relay.py`.<br/>• Fix `AST-02` so `await s.execute(select(...))` is allowed in read tools.<br/>• Fix `run_sop` so scheduled SOPs (`02-neda-reporter`) can fetch external APIs and send drafts/posts to `OWNER_CHAT_ID` / channels.<br/>• Sync Layer 1 events (contact shares, wizard steps) into LLM message history and record `Message.tokens`.<br/>• Add real `request_contact` keyboard, `answerCallbackQuery`, and `pre_checkout_query` to `BaleBot`/`TelegramBot`, button support to `RubikaBot`, and webhook registration to `WahaDriver`.<br/>• Add `labels_fa` to `@action` params for the `LLM-Zero` wizard. |
