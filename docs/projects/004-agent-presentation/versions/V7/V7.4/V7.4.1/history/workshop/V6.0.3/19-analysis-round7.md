# V6.0.3 — Round 7: Formalizing the Adversarial-LLM Harness Model (CIA Triad, Literature Review, Subtle Flaws & Fixes, and Pipeline Diagnosis)

> **Inputs:**
> - Your 9 voice notes in `18-transcription.md` (recorded 2026-10-19, 18:29 to 19:17).
> - Current architecture baseline in `14-architecture.md` and rehearsal inputs `16-idea-input-event-organizer.md` & `17-idea-input-agency.md`.
> - Frontier academic literature survey (2025–2026): **CaMeL** (Google DeepMind & ETH Zurich, IEEE SaTML 2026), **FIDES** (Microsoft Research, 2025), **IsolateGPT / SecGPT** (NDSS 2025), **CapAgent** (2026), plus classic **Reference Monitor** (Anderson, 1972), **Confused Deputy** (Hardy, 1988), and **Object-Capability (OCap)** security (Miller et al., 2003).

> **Role of This Document (Step 1 of 3):**
> Per your instructions at `19:17`, this document acts as your **Research Advisor & Security Architect («استاد راهنما»)** review:
> 1. **Part 1** standardizes your terminology and formalizes your **3-Layer Harness + CIA Triad** model into publication-grade computer security language.
> 2. **Part 2** compares your model against the latest 2025–2026 research papers (**CaMeL**, **FIDES**, **IsolateGPT**, **CapAgent**) and highlights the **three areas where your design actually advances beyond the published state of the art**.
> 3. **Part 3** acts as a red-team advisor on your proposed **Availability, Integrity, and Confidentiality** mechanisms — identifying **10 subtle security flaws / edge-case loopholes («نقاط خلل»)** in the raw formulation and providing the exact deterministic fix for each.
> 4. **Part 4** diagnoses why Rehearsal #1 (`01-event-organizer`) failed your security bar under `14-architecture.md` and specifies the concrete changes required in `codo-core`, `tool-bank`, and Codo's commands (`/prd`, `/tools`, `/sops`, `/edge-cases`, `/plan`, `/build`).
> 5. **Part 5** proposes the blueprint for our **Reference Paper** (Step 2) and the **Architecture Rewrite** (Step 3).

---

## Part 1 — Standardizing Terminology & Formalizing Your Mental Model (`18:31`–`18:48`)

In Voice 2 (`18:31`), Voice 3 (`18:38`), and Voice 5 (`18:48`), you described your mental model of the system and asked whether your terminology aligns with standard computer science and security literature, or what the exact canonical terms are.

### 1.1 Mapping Your Terms to Canonical Security & Systems Literature

Your intuitions map onto four foundational concepts in computer security (**Reference Monitors**, **Object-Capability Security**, **Hexagonal Architecture**, and **Information-Flow Control**):

| Your Term in `18-transcription.md` | Canonical CS / Security Term | Formal Symbol | Precise Definition in Our Paper & Architecture |
|---|---|---|---|
| **هارنس (Harness / کد بیرونی)** | **Trusted Computing Base (TCB) & Reference Monitor** *(Anderson, 1972)* | $\mathcal{H}$ | The deterministic Python runtime (`codo-core`) that mediates 100% of interactions between external interfaces, the untrusted LLM, the database, and external tools. It is non-bypassable, small enough to verify, and enforces all security invariants in code. |
| **مدل زبانی (LLM — با فرض دشمن بودن)** | **Untrusted / Byzantine Planner** | $\mathcal{M}$ | A stateless, untrusted stochastic oracle. In our threat model, $\mathcal{M}$ is simultaneously treated as **(a) an Eavesdropper** (curious about confidential PII/secrets) and **(b) an Active Byzantine Adversary** (fully controlled by prompt injection or model weakness to issue malicious tool calls). |
| **واسط / سطح / پورت / سرفیس (Surface / Port / Interface)** | **Ingress Port / Trust Boundary Surface** *(Hexagonal Architecture)* | $\mathcal{P}_k$ | A distinct channel through which requests enter $\mathcal{H}$: e.g., $\mathcal{P}_{\text{bale}}$ (Bale Bot Webhook), $\mathcal{P}_{\text{humanoid}}$ (Humanoid Messenger Update Stream), $\mathcal{P}_{\text{api}}$ (REST/Web UI), $\mathcal{P}_{\text{mcp}}$ (`/admin`, `/broker`, `/employer`, `/work`), or $\mathcal{P}_{\text{llm}}$ (the LLM's tool-call output channel). |
| **موجودیت فراخواننده (Caller / Entity)** | **Authenticated Principal (Subject)** | $s \in \mathcal{S}$ | The cryptographically or transport-authenticated identity behind a request on port $\mathcal{P}_k$, bound to an immutable **Execution Context** $\Gamma = (\text{emp\_id}, \text{port}, \text{peer\_id}, \text{role}, \text{session\_id})$. **Crucial rule:** $\mathcal{M}$ is *not* a trusted principal; $\mathcal{M}$ runs inside a sandboxed shadow of $s$'s context with strictly lesser authority ($A(\mathcal{M} \mid \Gamma) \subsetneq A(s \mid \Gamma)$). |
| **تابع / متد / قابلیت / اندپوینت (Capability / Endpoint)** | **Domain Command / System Operation** | $c \in \mathcal{C}$ | A state-changing or data-reading operation in the core application layer (e.g., `ConfirmRegistration`, `InitiatePayment`, `SearchEventKB`), guarded by an **Authorization Predicate** $\text{Authz}(s, \Gamma, c, \text{args}) \in \{\text{true}, \text{false}\}$. |
| **لایهٔ واسط روی ابزارهای ایجنت (Wrapper that fills hidden args)** | **Context-Bound Capability Proxy (Attenuated Tool Wrapper)** *(Hardy, 1988; Miller, 2003)* | $\tilde{t} \in \mathcal{T}_{\mathcal{M}}$ | The severely restricted function signature exposed to $\mathcal{M}$. It omits security-critical parameters (such as `recipient_chat_id`, `employment_id`, `event_id`, or `button_callback_action`); the Harness $\mathcal{H}$ deterministically binds those parameters from the immutable Execution Context $\Gamma$ before calling the underlying capability $c$. |
| **ارسال دکمه / پیشنهاد عمل به کاربر (Sending a Button / Code / API suggestion)** | **UI-Mediated Action Proposal (Out-of-Band User Confirmation / Intent Elicitation)** | $\Pi(c, \text{args})$ | Instead of granting $\mathcal{M}$ the authority to execute a high-consequence capability $c$, $\mathcal{H}$ only grants $\mathcal{M}$ a proposal tool $\text{Propose}_c(\text{args}_{\text{safe}})$ which renders a deterministic UI element (an inline button on a bot, a numbered state-machine code on a humanoid account, or a signed request template on an API) to the authenticated human principal $s$. Execution of $c$ occurs **only** when $s$ triggers that button/code directly over their authenticated port $\mathcal{P}_k$. |
| **هندل / رفرنس شبه‌تصادفی (Handle / Reference for PII)** | **Opaque Capability Handle (Cryptographic Tokenization)** | $h \in \mathcal{R}$ | A randomly generated, unguessable symbolic token (e.g., `ref_phone_8f3a`) mapped in a Harness-only table $\Sigma: \mathcal{R} \to \mathcal{V}_{\text{secret}} \times \text{Type} \times \text{Owner}$ that $\mathcal{M}$ can reference and pass into authorized proxy tools, and which $\mathcal{H}$ dereferences at the egress boundary without $\mathcal{M}$ ever seeing the plaintext value $v \in \mathcal{V}_{\text{secret}}$. |

---

### 1.2 Your 3-Layer Architectural Stack (Voice 5, `18:48`)

Your 3-layer decomposition in Voice 5 (`18:48`) is rock-solid. When expressed formally, it improves on standard MVC/Hexagonal architectures by treating **the LLM ($\mathcal{M}$) not as the controller, but as an untrusted advisor sitting on a side-port**:

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                     THE 3-LAYER ADVERSARIAL-LLM HARNESS ARCHITECTURE                     │
└──────────────────────────────────────────────────────────────────────────────────────────┘

  LAYER 1: INGRESS & AUTHENTICATION PORTS (لایهٔ واسط و احراز هویت)
  ┌───────────────────────┬────────────────────────┬──────────────────────┬────────────────┐
  │ P1: Bot Webhook       │ P2: Humanoid Stream    │ P3: REST / MCP API   │ P4: LLM Output │
  │ (Bale / Telegram)     │ (Eitaa / WAHA / User)  │ (/admin, /employer)  │ (Untrusted M)  │
  ├───────────────────────┼────────────────────────┼──────────────────────┼────────────────┤
  │ Verifies webhook      │ Verifies platform      │ Verifies Bearer      │ Bound to Run   │
  │ secret -> extracts    │ peer_id -> steps       │ token hash ->        │ ID -> looks up │
  │ (emp_id, chat_id,     │ Deterministic Dialog   │ resolves Broker or   │ immutable      │
  │ callback_data / text) │ FSM (menus / codes)    │ Employment context   │ RunContext Γ   │
  └───────────┬───────────┴───────────┬────────────┴──────────┬───────────┴────────┬───────┘
              │                       │                       │                    │
              ▼                       ▼                       ▼                    ▼
  ══════════════════════════════════════════════════════════════════════════════════════════
  LAYER 2: REFERENCE MONITOR, CONTEXT BINDER & HANDLE RESOLVER (لایهٔ کنترل دسترسی و ترجمه)
  • Immutable Context Binding: Injects `emp_id`, `peer_id`, `event_id` from Γ (never from M).
  • Authority Separation:
    - Direct Principal Actions (from P1 Button / P2 FSM Code / P3 API) -> Full Principal Authz
    - LLM Proxy Calls (from P4) -> Strictly Low-Impact Read/Text or UI Action Proposals Π(c)
  • Handle Dereferencing (Confidentiality): Replaces `ref_...` handles with plaintext ONLY
    after verifying `(handle.emp_id == Γ.emp_id) AND (target_tool in handle.allowed_sinks)`.
  ══════════════════════════════════════════════════════════════════════════════════════════
              │                                                       │
              ▼ (Deterministic Execution)                             ▼ (Only if NL help needed)
  LAYER 3: CORE DOMAIN ENGINE (لایهٔ اجرای قطعی)             UNTRUSTED LLM ADVISOR (M)
  • Executes Domain Capabilities (Register, Pay,             • Sees ONLY public/metadata +
    Query KB, Send Bound Message/Button).                      opaque handles (`ref_...`).
  • 100% functional even when LLM (M) is offline!            • Cannot forge Principal auth.
```

---

## Part 2 — Frontier Literature Survey (2025–2026) & Where Your Model Advances the State of the Art (`18:29`, `19:17`)

You asked me to check the latest academic literature on this exact problem: *designing an agent harness assuming the LLM is an adversary/compromised, enforcing confidentiality, integrity, and availability by design.*

### 2.1 The Four Key Papers on the Scientific Frontier (2025–2026)

| Paper / System | Authors & Venue | Core Mechanism | What It Solves Well | What It Misses Compared to Your Model |
|---|---|---|---|---|
| **1. CaMeL** (*"Defeating Prompt Injections by Design"*) | Debenedetti, Shumailov, Carlini, Tramèr et al. (**Google DeepMind & ETH Zurich**, arXiv:2503.18813 / **IEEE SaTML 2026**) | Uses a **Privileged LLM** (which turns the user's initial prompt into a custom Python subset plan) and a **Quarantined LLM** (no tools, parses untrusted data into variables). A custom interpreter tracks **data provenance / capabilities** on every variable and blocks tool calls if untrusted data flows into sensitive sinks (like email recipient). | Provably blocks data-flow hijacking in multi-step plans (solves $77\%$ of AgentDojo with $0$ policy violations). | **1.** Assumes the initial user prompt is **trusted**! (In customer-facing bots like Event Organizer or Hanieh, **the user chatting with the bot IS the potential attacker**!)<br/>**2.** Sends plaintext PII/secrets to the LLM (does not treat the LLM provider as an eavesdropper).<br/>**3.** Fails completely ($0\%$ availability) if the LLM is down. |
| **2. FIDES** (*"Securing AI Agents with Information-Flow Control"*) | Costa, Köpf, Russinovich et al. (**Microsoft Research**, arXiv:2505.23643, **2025**) | Attaches **Confidentiality ($C$) and Integrity ($I$) lattice labels** to every message, variable, and tool result. Introduces **`hide` / variable references** so confidential data can be stored in planner variables and passed between tools without the LLM seeing the content unless explicitly declassified. | Formalizes **opaque variable references** (`hide`) + deterministic policy checks (`PolicyEngine`) on tool calls. | **1.** No concept of **LLM-Zero Availability** (deterministic fallback menus/FSMs when the LLM is down).<br/>**2.** No distinction between **Text-Only Reply tools** and **Typed UI Action-Proposal (Button) tools** where the human user's authenticated click executes the mutation. |
| **3. IsolateGPT / SecGPT** (*"An Execution Isolation Architecture for LLM-Based Agentic Systems"*) | Wu, Iqbal, Kohno et al. (**Washington Univ. & UW**, **NDSS 2025**) | Isolates each third-party skill/app into a separate **Spoke** environment with its own context and mediates cross-spoke data sharing through a central **Hub** with user confirmation. | Prevents one untrusted plugin/tool from reading another tool's memory or calling its APIs silently. | Focuses on multi-app plugin isolation for a single trusted user, not multi-tenant/multi-customer isolation where external peers attack the agent. |
| **4. CapAgent** (*"Semantic Data-Flow Governance for LLM Agents"*) | **2026** (MDPI / arXiv) | Issues **HMAC-signed capability tokens** (`AuthSet(cap)`) scoped to the user's session and task; a Reference Monitor verifies the capability before any tool executes. | Formalizes HMAC capability tokens (`K_mon`) and reference monitoring outside the LLM. | Still relies on an LLM "Policy Compiler" to translate the user's natural-language request into a policy, which is vulnerable when the user themselves is the adversary. |

---

### 2.2 Why Your Model Is Publishable: Three Contributions Beyond `CaMeL` and `FIDES`

When we look at the table above, a major academic insight jumps out:
- **CaMeL (Google DeepMind)** and **FIDES (Microsoft Research)** were both designed for the **"Personal Assistant Threat Model"** (where *Alice* is the trusted owner asking her assistant to read untrusted emails). In that model, Alice's prompt is trusted ($I = \text{High}$), and the attacker is hiding inside a third-party email or web page.
- **Our Workshop Agents (Event Organizer, Hanieh Support, Agency Bot)** operate in a **much harder, more general threat model: the "Public/Multi-Role Service Agent Threat Model"**, where:
  1. **Direct Users Can Be Attackers:** An anonymous customer chatting with the Event Organizer bot can directly type prompt injections to steal other attendees' phone numbers, spam other users, or register for free.
  2. **The LLM Provider Itself Is Untrusted for PII (Confidentiality):** Even without prompt injection, we do not want the external LLM API to see raw phone numbers, national IDs, or platform numeric user IDs.
  3. **The Service Must Survive Total LLM Outage (Availability):** Neither CaMeL nor FIDES addresses the **Availability ($A$)** leg of the CIA triad.

Your formulation in `18-transcription.md` introduces **Three Novel Architectural Primitives** that unify the **CIA Triad** for Service Agents:
1. **Primitive 1 — The LLM-Zero Completeness Principle (Availability / $A$):** Every business state transition reachable with the LLM must be reachable without the LLM via deterministic Port State Machines (Bot Menus/Buttons, Humanoid Numeric Codes, or REST/MCP Endpoints). The LLM is strictly a **Natural-Language-to-Action-Proposal Router**, never the sole gatekeeper of business continuity.
2. **Primitive 2 — Split-Authority UI Action Proposals vs. Context-Bound Proxies (Integrity / $I$):**
   - For **low-sensitivity actions** (text replies, scoped read queries), the LLM calls **Context-Bound Proxy Tools** where all security boundary parameters (`recipient_id`, `employment_id`, `event_id`) are omitted from the tool schema and injected by the Harness from the cryptographic ingress context $\Gamma$.
   - For **high-sensitivity / state-mutating actions** (finalizing registration, sharing verified phone contact, paying, approving), the LLM has **zero execution tools**. Instead, it only has **Typed UI Proposal Tools** (e.g., `propose_confirm_registration_button(event_id)`), which cause the Harness to render a deterministic button or state-machine code to the current user. The actual state mutation is triggered **only** when the user's authenticated client sends the button callback or code directly to Layer 1!
3. **Primitive 3 — Bidirectional Opaque Handle Tokenization (Confidentiality / $C$):** Sensitive values (phone numbers, platform user IDs, secrets) are vaulted at Layer 1 ingress into unguessable handles (`h_...`), passed as typed symbolic references through the LLM, and dereferenced by Layer 2 only into explicitly permitted downstream sinks/queries belonging to the same context $\Gamma$.

**Advisor Verdict:** Yes — this synthesis of **CIA-Triad Completeness + Context-Bound Capability Proxies + UI-Mediated Split Authority + Opaque Handle Tokenization** for multi-party service agents is genuinely novel and forms a strong, clean foundation for both a scientific paper and our V6.0.1 reference architecture.

---

## Part 3 — Red-Team Advisor Analysis: 10 Subtle Flaws in the Raw Proposal & How to Fix Them (`18:29`, `19:00`–`19:17`)

You explicitly asked me (`18:29`, `19:00`, `19:17`):
> *"این ایده که دارم میگم خوب پردازش کن هر نقطه خللی که توش وجود داره پیدا کن... اگر ضعفی وجود داره تو باید این رو بفهمی و به من پیشنهاد بهتر رو بدی"*

Acting as a red-team reviewer and academic advisor, I tried to break your proposed design under the assumption that **the LLM ($\mathcal{M}$) is 100% controlled by an attacker**. Below are **10 subtle vulnerabilities («نقاط خلل»)** that would still succeed in a naive implementation of your voice notes, along with the **exact deterministic fix** we must add to the model.

---

### 3.1 Flaws in the **Integrity ($I$)** Dimension

#### Flaw I-1: The "Spoofed Text vs. Real Button" Phishing / Social Engineering Attack
- **Your Proposal (`19:00`):** Strip buttons from `send_text_to_current_user(text)` and give the LLM dedicated tools like `send_confirm_registration_button(event_id)` where the Harness writes both the button callback and the message text.
- **The Subtle Attack:** Even though the Harness writes the text inside `send_confirm_registration_button(event_id)`, the LLM **still has** `send_text_to_current_user(text)`! A compromised LLM can call **both** tools in sequence:
  1. First, call `send_text_to_current_user("توجه: دکمهٔ زیر فقط برای دریافت فایل سرفصل رایگان است، روی آن کلیک کنید:")`.
  2. Immediately call `send_confirm_registration_button(event_id=99)` (or a destructive button).
  Or worse, on a **Humanoid account** (where there are no inline buttons, only numeric codes like `"برای لغو ثبت‌نام عدد ۹ را بفرستید"`), a compromised LLM can use `send_text_to_current_user` to lie: *"برای دریافت هدیه عدد ۹ را بفرستید!"* When the user types `9`, the deterministic state machine in Layer 1 thinks the user intentionally sent code `9` and cancels their registration!
- **The Deterministic Fix (2-Part Rule):**
  1. **Self-Contained Visual Cards for Buttons:** Whenever the Harness sends a Button Proposal via `send_<action>_button(...)`, the Harness wraps the message in a visually unmistakable, fixed system header (`🔒 [فرم رسمی سامانه — این دکمه عمل زیر را انجام می‌دهد: نهایی‌سازی ثبت‌نام در رویداد X]`) and **suppresses any free-text LLM message in the same turn** (or sends the button card last with a mandatory self-describing label on the button itself, e.g., `[✅ تأیید قطعی ثبت‌نام در کارگاه هوش مصنوعی — مبلغ ۲ میلیون تومان]`, never a generic `[تأیید]`!).
  2. **Dynamic Nonce Codes on Humanoid Channels (Never Fixed Numbers like `1` or `2` for Sensitive Actions!):** On humanoid accounts, if code `9` always means "cancel registration", the LLM can trick the user into typing `9`. Instead, when `propose_confirm_registration` is called on a humanoid channel, the **Harness** generates a fresh 4-digit random code `c = 4829` bound to that specific action, and the **Harness itself** sends the fixed template message:
     `🔒 [سامانه]: برای تأیید نهایی ثبت‌نام در «کارگاه ایجنت»، کد ۴۸۲۹ را ارسال کنید.`
     Crucially, **the LLM never sees the code `4829`** (it is generated at egress after the LLM's turn ends)! Because the LLM does not know the number `4829`, the LLM **cannot** write a deceptive text message telling the user *"Type 4829 to get free gold!"* This completely closes the humanoid code-phishing hole!

---

#### Flaw I-2: The "Employer Group Flooding / False Notification" Attack (`send_text_to_employer`)
- **Your Proposal (`19:07`, `19:15`):** Give the LLM a tool `send_message_to_employer_group(text)` (where the destination group ID is hidden and filled by the Harness from the current employment's config, and handles like `ref_phone_...` are dereferenced into the text).
- **The Subtle Attack:** Suppose an attacker is chatting with the bot as an anonymous customer. They prompt-inject the LLM during their customer chat. Now the compromised LLM calls `send_message_to_employer_group(text="✅ شرکت‌کننده ref_phone_attacker مبلغ ۵,۰۰۰,۰۰۰ تومان را پرداخت کرد و ثبت‌نامش قطعی شد!")` — or calls it 50 times in a loop to spam the Employer's notification channel with fake payment confirmations or abusive text!
- **Why this happens:** Even though the *destination* (`employer_group_id`) is safely bound by the Harness, **allowing the LLM to compose arbitrary free-text notifications to the Employer about system state (like "X registered" or "X paid") violates Integrity!** The Employer trusts messages coming from their bot in the notification channel as ground truth!
- **The Deterministic Fix (Separate System-Fact Notifications from Customer Escalations):**
  1. **State-Transition Notifications (Registrations, Payments, New Unverified Agents) are 100% Harness-Driven (Zero LLM Tool!):** When a user actually completes registration or payment in Layer 3, **the deterministic Python code in Layer 3** formats and sends the notification to the Employer channel using a fixed, unforgeable template (`✅ [ثبت سیستمی قطعی]: نام: ... | موبایل: ... | وضعیت پرداخت: تاییدشده`). The LLM has **no tool** to send fake registration/payment notifications!
  2. **The LLM's Only Tool Toward the Employer is `escalate_customer_question_to_employer(question_summary)`:**
     - It is rate-limited (e.g., max **1 escalation per customer conversation** until the employer replies).
     - The Harness prefixes the message with an explicit untrusted-origin banner:
       `❓ [سؤال ارجاع‌شده از کاربر ناشناس — اطلاعات زیر ادعای کاربر است و تایید سیستمی نیست]: ...`
     - And as shown in Flaw C-1 below, the LLM **cannot** arbitrarily dereference another user's handle into this text!

---

#### Flaw I-3: Pre-Confirmation Draft Poisoning (Parameter Tampering Before the Button Click)
- **Your Proposal (`19:00`):** During natural-language chat, the user gives their preliminary info (e.g., name, dietary preference, discount request) to the LLM, and at the end the LLM calls `send_confirm_registration_button(event_id)`.
- **The Subtle Attack:** Where is that preliminary draft data stored before the user clicks `[Confirm Registration]`, and what does clicking `[Confirm Registration]` actually commit to the database?
  - If the LLM calls `save_registration_draft(full_name="...", ticket_tier="VIP_FREE")` and then calls `send_confirm_registration_button(event_id)`, a compromised LLM could silently set `full_name="HACKED"` or `agreed_price=0` in the draft, and if the button card only says *"Click to confirm registration in Event X"*, the user clicks Confirm and commits corrupted data!
- **The Deterministic Fix (The "What-You-See-Is-What-You-Sign" Draft Binding Rule):**
  - Any draft parameters proposed by the LLM (`full_name`, `selected_tier`, `quoted_price`) are stored in an immutable `ActionProposal(proposal_id, emp_id, peer_id, action="confirm_registration", payload={...})`.
  - When the Harness renders the confirmation button `callback_data="act:prop_8812"`, **the Harness deterministically renders EVERY field of `payload` into the visible confirmation card** (Name, Phone from verified contact, Event, Exact Price from the deterministic calculator) so the human sees the exact values that `prop_8812` will commit.
  - Furthermore, sensitive fields in `payload` (like `price` or `verified_phone`) **cannot** be supplied as raw values by the LLM — `price` comes only from a `QuoteId` minted by the deterministic pricing engine, and `phone` comes only from a `Handle` (`ref_phone_...`) owned by the current `peer_id`!

---

#### Flaw I-4: Cross-Event / Cross-Resource ID Tampering on visible arguments (`event_id`)
- **Your Proposal (`19:00`, `19:07`):** `send_confirm_registration_button(event_id)` takes only one argument: `event_id`. Later (`19:07`), you noted that since the bot webhook itself belongs to a specific Employment (and therefore a specific Event), even the event can be inferred from the webhook's Employment!
- **The Subtle Attack:**
  - Case A: If an Employment has only 1 active Event, giving `event_id` as an argument to the LLM is unnecessary surface area — a compromised LLM could pass `event_id=2` (belonging to **another Employer** on the same multi-employment agent!) and trick the user or leak Employer 2's event title in the button card!
  - Case B: If one Employer can host multiple events (`event_1`, `event_2`) under the same Employment, the LLM still shouldn't be able to pass an `event_id` belonging to a *different* Employment!
- **The Deterministic Fix (Tenant-Scoped Capability Enumeration):**
  - If an Employment is 1-to-1 with an Event, `send_confirm_registration_button()` takes **zero arguments (`()`)** — the Harness binds `event_id` directly from `Γ.emp_id`!
  - Whenever an Employment legitimately has multiple child entities (e.g., 3 events owned by this Employer), the Harness validates `SELECT id FROM events WHERE id = :event_id AND employment_id = :ctx_emp_id AND status = 'open'` **before** rendering the button. Even better, dynamically constrain the tool's JSON Schema enum at the start of the turn to `Literal["evt_1", "evt_2"]` (only the IDs belonging to `Γ.emp_id`).

---

### 3.2 Flaws in the **Confidentiality ($C$)** Dimension (Opaque Handles `ref_...`)

#### Flaw C-1: The "Confused Handle / Cross-User Handle Injection" Attack (CRITICAL)
- **Your Proposal (`19:15`):** Store sensitive values (like phone numbers) in a secret table mapping `handle <-> plaintext`. Give the LLM tools that accept `handle` (e.g., `check_registration_by_phone(phone_handle)` or `send_message_to_employer(text_with_handles)`), and have the Harness replace `handle` with `plaintext` before running the DB query or sending the message.
- **The Subtle Attack:**
  1. **Handle Guessing / Brute Force:** If handles look like `ref_1`, `ref_2`, or short random strings, a prompt-injected LLM in User B's chat can call `check_registration_by_phone("ref_1")` and learn whether User A is registered, what User A's registration status is, or pass `"ref_1"` into a message sent to User B (`send_text_to_current_user("Your phone is ref_1")`) — if the egress filter naively dereferences handles in outbound messages, User B receives User A's plaintext phone number!
  2. **Cross-Sink Dereferencing (Exfiltrating a Handle to the Wrong Recipient):** Even if a handle belongs to the current employment, if the Harness dereferences handles inside `send_text_to_current_user`, or if the LLM learns a handle belonging to the Employer or another entity, the LLM can bounce that handle back out to the attacker!
- **The Deterministic Fix (Principal-Owned, Sink-Typed Capability Handles):**
  Every Handle $h$ in the Harness Vault $\Sigma$ must be a **4-tuple capability**, not just a key-value pair:
  $$\Sigma(h) = \langle v_{\text{plaintext}}, \text{kind}, \text{emp\_id}, \text{owner\_peer\_id}, \text{allowed\_sinks} \rangle$$
  And the Harness enforces **three hard rules** on every handle operation:
  1. **Session-Scoped Visibility (Handle Isolation):** In a turn triggered by principal $(\text{emp\_id}, \text{peer\_id})$, the Harness **only accepts handles where $h.\text{emp\_id} = \Gamma.\text{emp\_id}$ AND $h.\text{owner\_peer\_id} = \Gamma.\text{peer\_id}$**! User B's LLM session literally **cannot** pass a handle belonging to User A — the Reference Monitor rejects it with `PermissionError("Handle does not belong to current principal")` before touching the database!
  2. **Never Dereference Handles into LLM-Returned Tool Results:** When the LLM calls `check_registration_by_phone(phone_handle=h_1)`, the Harness dereferences `h_1` into the SQL `WHERE phone = :v` parameter, executes the query, and **re-tokenizes** any sensitive fields in the returned row back into handles (`h_1`) before returning the tool result to the LLM!
  3. **Sink-Restricted Dereferencing on Outbound Messages:**
     - `send_text_to_current_user(text)` **NEVER dereferences any handles** (or only dereferences handles where `owner_peer_id == current_peer_id`).
     - Only **deterministic Harness notifications** to the Employer (or explicitly marked Employer Sink tools) may dereference a customer's `phone_handle` into the Employer's private notification channel!

---

#### Flaw C-2: Free-Text PII Bypass (When the User Types Their Phone Number in Chat Instead of Clicking the Button)
- **Your Proposal (`19:15`):** Send a `Share Phone Number` button (`request_contact` on Bale/Telegram); when the user clicks it, the Harness intercepts the contact update outside the LLM, stores the phone number in the Handle Vault, and only passes `ref_phone_...` to the LLM.
- **The Subtle Flaw:** What if a user ignores the button and simply **types** `"سلام، شماره من ۰۹۱۲۱۲۳۴۵۶۷ است"` as a normal text message in chat?
  - If that raw text goes straight into the LLM's message history, the LLM (and the external LLM provider) just saw the plaintext phone number!
  - Furthermore, an attacker could type *someone else's* phone number in chat (`"شماره من ۰۹۱۲۹۹۹۹۹۹۹ است"`), and if the ingress tokenizer turns typed phone numbers into handles with the same trust level as a button-shared contact, the attacker just forged another person's phone number!
- **The Deterministic Fix (2-Tier Ingress Tokenization: `unverified_typed` vs. `platform_verified`):**
  1. **Pre-LLM Ingress Scrubber & Tokenizer (`codo_core/ingress_vault.py`):** Before any incoming text message is saved to the LLM's conversation history or sent to the LLM API, a deterministic regex/normalizer (supporting Persian `۰-۹`, Arabic `٠-٩`, and Latin `0-9` digits) scans for phone numbers, national IDs, 16-digit card numbers, and Sheba (`IR...`) numbers.
  2. Any match is **immediately replaced in the message text with an Opaque Handle** (e.g., `"سلام، شماره من [handle:phone_unverified:h_7a2c] است"`). Thus **the LLM never sees plaintext PII even when the user types it in free text!**
  3. **Provenance Tag on the Handle (`verified: bool`):**
     - A phone number typed in free text gets `kind="phone_unverified"`, `verified=False`.
     - A phone number received from Bale/Telegram's cryptographic `message.contact` (`contact.user_id == sender.id`) or an OTP check gets `kind="phone_verified"`, `verified=True`.
     - If the Event Organizer's policy requires a verified phone number, the Reference Monitor refuses `phone_unverified` handles for final registration and tells the LLM: *"Handle `h_7a2c` is unverified; call `send_share_contact_button()` so the user shares their verified account phone number."*

---

#### Flaw C-3: Platform Numeric ID Leakage & Metadata Correlation
- **Your Proposal (`19:15`):** *"همونطور که نمی‌خواهم شناسه عددی کاربر ثبت نام کننده و برگزارکننده توی بله رو بدونه"* (The LLM must not even see the numeric Bale/Telegram `user_id` or `chat_id` of the attendee or the organizer).
- **The Subtle Flaw:** Many frameworks (and `codo-core` v0.2.0 in `14-architecture.md`!) inject `chat_id` or `customer.external_id` into the system prompt or tool outputs, or let the LLM see webhook payloads.
- **The Deterministic Fix:**
  - The LLM's `RunContext` and prompt **never** include `external_id`, `chat_id`, `channel_id`, or `employment_id`.
  - To the LLM, the current user is always the constant symbol `"CURRENT_USER"` (or a session-local pseudonym `peer_self`), the current employer is `"CURRENT_EMPLOYER"`, and the current event is `"CURRENT_EVENT"`.
  - The mapping `RunId -> (employment_id, account_slot, external_chat_id, customer_db_id)` lives exclusively in the Harness's in-memory `ContextVar` / DB table.

---

#### Flaw C-4: Side-Channel / Oracle Inference on Scoped Database Queries
- **Your Proposal (`19:07`, `19:15`):** Give the LLM a tool `check_registration(phone_handle)` that checks if that phone handle is registered in the current event.
- **The Subtle Flaw:** As noted in C-1 and C-2, what if a user types *another person's* phone number in chat (`"آیا شماره ۰۹۱۲۱۱۱۱۱۱۱ ثبت‌نام کرده؟"`), the ingress scrubber turns it into `h_typed_99`, and the LLM passes `h_typed_99` to `check_registration(h_typed_99)`? Even though the LLM never saw the digits `09121111111`, the attacker who typed those digits gets a Yes/No answer (an **Existence Oracle** leaking whether that victim is attending the event)!
- **The Deterministic Fix:**
  - `check_my_registration_status()` takes **ZERO arguments (`()`)**! It queries the database using `WHERE employment_id = :ctx_emp_id AND customer_id = :ctx_customer_id` (or the `phone_verified` handle bound to `:ctx_customer_id`).
  - Why should a customer ever be able to query registration status by an arbitrary phone handle? They shouldn't! A customer only ever has the right to query **their own** registration status (`check_my_registration_status()`), while the **Employer** (authenticated on `/employer/mcp`) has `search_registrants(query)`. Eliminating the `phone_handle` parameter from the customer-facing lookup tool kills the Existence Oracle 100%!

---

### 3.3 Flaws in the **Availability ($A$)** Dimension ("LLM-Zero Continuity")

#### Flaw A-1: The "Dead-End Fallback" When the LLM API Is Down or Times Out (`18:45`–`18:50`)
- **Your Proposal (`18:45`, `18:50`):** Every capability reachable via the LLM must also be reachable deterministically without the LLM (via Bot Buttons/Menus on Bale/Telegram, Numeric State-Machine Codes on Humanoid accounts, and REST/MCP endpoints).
- **The Subtle Flaw:** In standard bot implementations (including `codo-core` v0.2.0), when a user sends a text message like `"سلام"` or `"می‌خوام ثبت‌نام کنم"` and the LLM gateway returns HTTP 502 / Timeout / Quota Exceeded, the engine catches the exception and replies `"خطایی رخ داد، بعداً تلاش کنید"` — **never showing the deterministic menu or state-machine codes!** Worse, if the developer writes the deterministic menu handler and the LLM tool handlers separately, the two paths drift out of sync!
- **The Deterministic Fix (Unified Command Bus + Automatic Deterministic Menu Fallback):**
  1. **Single Underlying Command Bus (Layer 3):** Both the **Deterministic UI Port** (Buttons / Numeric FSM / `/work/mcp`) and the **LLM Proposal Tools** route to the **exact same Layer 3 Command Handlers** (`cmd_show_event_info`, `cmd_show_faq`, `cmd_start_registration`, `cmd_share_contact`, `cmd_initiate_payment`, `cmd_check_my_status`).
  2. **Deterministic Ingress Interceptor (Runs BEFORE the LLM):**
     - On every incoming message on a Bot or Humanoid account, Layer 1 **first** checks if the input is:
       - An inline button `callback_query` (e.g. `cmd:faq`, `cmd:status`, `cmd:register`, `act:prop_8812`),
       - A slash command (`/start`, `/menu`, `/help`, `/status`, `/register`),
       - Or a valid numeric code (`0` for main menu, `1`..`9` or a 4-digit action nonce `4829`) in the current thread's Deterministic Dialog FSM!
     - If it matches **any** of those, Layer 1 executes the Layer 3 Command **directly in 5 milliseconds with ZERO LLM calls**!
  3. **Automatic Graceful Degradation on LLM Failure (or Free-Text Greeting):**
     - When `/start` or `0` (`منو`) is sent — **or whenever the LLM call fails, times out, or is disabled (`LLM_ENABLED=false`)** — the Harness automatically renders the **Deterministic Self-Service Menu**:
       - On **Bot Ports** (`bale_bot`, `telegram_bot`): Inline keyboard buttons (`[📋 معرفی و ظرفیت رویداد]`, `[❓ سؤالات متداول]`, `[📝 شروع ثبت‌نام قطعی]`, `[💳 پرداخت و وضعیت من]`).
       - On **Humanoid Ports** (`bale_user`, `telegram_user`, `eitaa_user`, `whatsapp_waha`): Numbered text menu (`"برای استفاده سریع بدون نیاز به تایپ، عدد گزینه را بفرستید: ۱. معرفی و ظرفیت رویداد | ۲. سؤالات متداول | ۳. شروع ثبت‌نام | ۴. وضعیت ثبت‌نام من | ۰. نمایش دوبارهٔ این منو"`).
     - **Verification Gate in `/test`:** Codo's `/test` command will literally run the entire end-to-end registration and payment test suite **twice**: once with the LLM active, and **once with `LLM_MODE=offline` (LLM completely unplugged)** to prove 100% Availability compliance!

---

#### Flaw A-2: Resource Exhaustion / Wallet Denial-of-Service via LLM Loops
- **The Subtle Attack:** Even if the LLM cannot corrupt integrity or leak confidentiality, an attacker can send messages that trigger the LLM to call allowed read-only tools 20 times per turn, burning the Employer's LLM token budget and causing a financial Denial of Service (Availability failure for legitimate users).
- **The Deterministic Fix:**
  - Hard per-turn cap in the Harness Reference Monitor: max $K_{\text{tools}} = 4$ tool calls per turn, max $N_{\text{turns}} = 15$ LLM calls per peer per hour (configurable in `/manage-spec`), after which the peer is gracefully switched to **Deterministic Menu-Only Mode** (`LLM_MODE=offline` for that peer) so they can still complete registration via buttons/codes without burning a single extra LLM token!

---

## Part 4 — Diagnosis: Why `14-architecture.md` & Rehearsal #1 Failed Your Security Bar (`18:29`)

In Voice 1 (`18:29`), you explained how disappointed you were when inspecting Rehearsal #1 (`01-event-organizer`):
> *"یه مستند نوشته توی همین پروژه تمرینی ثبت نام رویداد برای حالت‌های لبه بعد من می‌بینم تو این حالت‌های لبه مثلاً یه حالت رو گفته که یه دونه کاربری که اومده پیش این ایجنت تقاضا میکنه که یه پیام بزنه به کاربر دیگه و کل چیزی که داره جلوی این حرکت اشتباه رو میگیره هوشمندی خود ایجنت هست و دستورالعمل های که بهش میدیم در صورتی که من گفته بودم این نباید باشه بلکه اصلا نباید اون ایجنت اختیارات لازم رو برای کارهای بد داشته باشه"*

Let's diagnose **exactly why** that happened under `14-architecture.md` so we eradicate the root cause permanently:

| # | Root Cause in `14-architecture.md` / `codo-core` / Commands | Why It Led to the Rehearsal #1 Failure | The Mandatory Fix for V6.0.2 |
|---|---|---|---|
| **1** | **Raw Transport Send Tools Exposed to the LLM** | In `tool-bank` and `codo-core`, account drivers exposed general methods like `send_message(chat_id, text, buttons)` or allowed `@tool` functions written in `/build` to take `chat_id` / `phone` / `user_id` as LLM parameters. | **Ban `chat_id` / `recipient` parameters in all LLM-visible tools.** `codo-core` provides built-in Context-Bound Egress primitives (`reply_text_to_current_user(text)` and typed `propose_button_to_current_user(action_slug)`) that read the recipient exclusively from the hidden `ContextVar` $\Gamma$. Custom `@tool` functions are **statically checked by `codo-core check`** and rejected if they accept `chat_id`, `peer_id`, `user_id`, or `employment_id` from the LLM! |
| **2** | **`/edge-cases` Allowed `"Enforced by: prompt"`** | In Round 4 (`06-analysis-round4.md` §2.5), `/edge-cases` said: *"where it is enforced (code / configuration / prompt — prompt-only enforcement must be justified)"*. The coding assistant took the lazy path and wrote *"Enforced by prompt / system instructions"*! | **Absolute Ban on Prompt-Based Security in `/edge-cases` and `00-rules.md`.** In V6.0.2, `Enforced by: prompt` is **illegal** for any Confidentiality, Integrity, or Availability requirement. Every security edge case in `edge-cases.md` MUST be enforced by **Architecture / Harness Code** (Omitted Parameter, Context-Bound Proxy, UI Action Proposal Button/Nonce, or Opaque Handle Vault). If a participant explicitly demands giving the LLM raw unguarded authority, Codo must issue a **Severe Security Warning Box (`⚠️ هشدار جدی امنیتی`)** and require explicit risk sign-off in `docs/decisions.md`. |
| **3** | **No "LLM-Zero (Availability)" Requirement in `/prd`, `/tools`, or `/sops`** | `14-architecture.md` treated the agent as an LLM-first chatbot where every incoming message goes straight to `Engine.handle_message -> LLM`. Deterministic menus/buttons/FSM codes were never designed in `/prd` or `/sops`. | **Every `/prd` and `/sops` now defines the Deterministic Surface First ("LLM-Zero Mode")**, and then defines how the LLM assists as a Natural-Language Router & Proposal Generator on top of that deterministic surface! |
| **4** | **One-Way Sealing (`SealedBlob`) Instead of Bidirectional Opaque Handles (`HandleVault`)** | `14-architecture.md` only sealed *admin/employer tokens* (`wire_token_slot`), not **end-user PII** (phone numbers, platform IDs, national IDs). So attendee phone numbers and Bale `chat_id`s were visible in plain text to the LLM! | Build the **Bidirectional Handle Vault (`codo_core/handles.py`)** into Layer 1 & Layer 2 of `codo-core`: auto-tokenizes `chat_id`, `contact.phone`, and regex-matched PII in incoming text into Principal-Owned Opaque Handles (`h_...`), and dereferences them only inside authorized Layer 3 queries and deterministic Employer notifications. |
| **5** | **Direct State-Mutating `@tool`s Given to the LLM** | In `16-idea-input-event-organizer.md`, `register_attendee` was treated as a tool the LLM could call directly during chat. | Separate **`@command` (Principal-Executed Layer 3 Capability)** from **`@llm_tool` (Low-Sensitivity Read / Proposal Proxy)**. For any state-mutating `@command(requires_user_action=True)` (like `confirm_registration` or `start_payment`), `codo-core` **automatically generates** the deterministic Button / Nonce handler for Layer 1 **AND** gives the LLM only the corresponding `propose_<command>_button()` tool! |

---

## Part 5 — Concrete Blueprint for `codo-core` v0.3.0: How the Developer Writes Code & How the Harness Enforces CIA Automatically

Look at how clean and foolproof this becomes in `codo-core` when we combine **Availability (LLM-Zero Menus/Codes)**, **Integrity (Split-Authority `@command` vs `@llm_tool`)**, and **Confidentiality (`HandleRef`)** into a single declarative Python API:

### 5.1 The Two Decorators in `codo-core`: `@principal_command` vs. `@llm_tool`

Instead of letting `/build` give arbitrary tools to the LLM, `codo-core` splits capabilities into two distinct decorators:

1. **`@principal_command` (Layer 3 Deterministic Capability — Executed by the User via Button, FSM Code, or API, NEVER Directly by the LLM):**
   ```python
   from codo_core import principal_command, PrincipalCtx, HandleRef

   @principal_command(
       slug="confirm_registration",
       title_fa="نهایی‌سازی ثبت‌نام در رویداد",
       menu_button_fa="📝 ثبت‌نام در رویداد",
       humanoid_menu_key="3",          # Reachable without LLM by typing '3'!
       allow_llm_proposal=True,        # Generates `propose_confirm_registration_button` for the LLM!
   )
   async def confirm_registration(
       ctx: PrincipalCtx,              # Injected by Harness from cryptographic port auth (NEVER from LLM)
       full_name: str,
       phone: HandleRef["phone_verified"],  # Validated & dereferenced by Harness ONLY if owned by ctx.peer_id!
   ) -> dict:
       # Deterministic Python execution in Layer 3:
       # 1. ctx.emp_id and ctx.peer_id are guaranteed authentic.
       # 2. `phone.unveil_for_db()` gives the real phone ONLY to the DB layer, never to LLM.
       # 3. Sends an unforgeable system notification to the Employer channel.
       ...
   ```
   **What `codo-core` does automatically from this single declaration:**
   - **For Availability ($A$):** Registers `confirm_registration` in the Bot's Deterministic Inline Menu (`cmd:confirm_registration`), in the Humanoid Account's Numeric State Machine (option `3` + 4-digit confirmation nonce), and on `/work/mcp`! Even if the LLM is 100% offline, a user can complete the entire flow via buttons or numeric codes.
   - **For Integrity ($I$):** **Does NOT give `confirm_registration` to the LLM!** Instead, it automatically registers a safe proposal tool for the LLM:
     `propose_confirm_registration(full_name: str, phone_handle: str)`
     When the LLM calls `propose_confirm_registration`, the Harness verifies that `phone_handle` belongs to `ctx.peer_id`, stores an `ActionProposal`, and sends a **Deterministic Confirmation Button** (or a **secret 4-digit Nonce Code** on a humanoid account) to `ctx.peer_id`. The actual `confirm_registration` function runs **only** when the user clicks that button or sends that 4-digit code!
   - **For Confidentiality ($C$):** `PrincipalCtx` hides the user's numeric `chat_id`, and `HandleRef["phone_verified"]` guarantees the LLM only ever manipulates `h_phone_...` tokens while Layer 3 receives the verified number safely.

2. **`@llm_tool` (Low-Sensitivity Context-Bound Read / Helper Tool for the LLM):**
   ```python
   from codo_core import llm_tool, BoundCtx

   @llm_tool
   async def search_event_faq(ctx: BoundCtx, query: str) -> list[str]:
       """Searches the FAQ of the CURRENT employment/event only."""
       # ctx.emp_id is injected by the Harness from the RunId -> Employment mapping.
       # The LLM cannot pass emp_id or event_id, so cross-tenant search is impossible by construction.
       return await db.search_faq(employment_id=ctx.emp_id, query=query)
   ```
   And `codo-core check` runs an AST/signature inspection during `/build` that **fails the build** if any `@llm_tool`:
   - Accepts forbidden parameter names (`chat_id`, `user_id`, `peer_id`, `recipient`, `employment_id`, `broker_id`, `phone_number`, `card_number`, `token`),
   - Mutates protected database tables (`employments`, `brokers`, `broker_ledger`, `registrations`, `payments`) directly instead of going through a `@principal_command`,
   - Or calls an outbound messaging API with an unbound recipient!

---

## Part 6 — Roadmap for Our Next Two Steps (`19:17`)

Per your plan at the end of `18-transcription.md`:
1. **Step 1 (This Document — `19-analysis-round7.md`):**
   - Review the terminology mapping (Part 1), the comparison with `CaMeL` / `FIDES` / `IsolateGPT` (Part 2), the **10 subtle red-team flaws and their deterministic fixes** (Part 3), and the **`@principal_command` vs. `@llm_tool` + `HandleVault` + LLM-Zero Menu** design (Parts 4–5).
   - Tell me if you agree with these 10 fixes or want any adjustments.
2. **Step 2 (Next — Writing the Reference Paper `20-security-paper.md`):**
   - Once you approve this analysis, I will write the complete, self-contained **Academic & Engineering Reference Paper** (in both formal structure and practical clarity so it can be published *and* embedded inside `codo/docs/constitution/` as the foundational security law of every workshop project).
   - Suggested Paper Title:
     - **English:** *"Byzantine-Resilient Agent Harnesses: Enforcing Availability, Integrity, and Confidentiality When Both the User and the LLM Are Untrusted"*
     - **Persian:** *«مهارِ مدل زبانیِ دشمن: معماری هارنسِ مقاوم در برابر نفوذ با تضمین دسترس‌پذیری، صحت و محرمانگی (سه‌گانهٔ CIA) در ایجنت‌های هوش مصنوعی»*
3. **Step 3 (After the Paper — Rewriting the Complete Architecture Document `21-architecture-v6.0.2.md`):**
   - We will rewrite `14-architecture.md` end-to-end to incorporate the Reference Paper's formal model, the 3-Layer Harness (`codo-core` v0.3.0), LLM-Zero deterministic surfaces, `@principal_command` / `@llm_tool`, the Bidirectional `HandleVault`, and the strict `/edge-cases` & `codo-core check` gates.