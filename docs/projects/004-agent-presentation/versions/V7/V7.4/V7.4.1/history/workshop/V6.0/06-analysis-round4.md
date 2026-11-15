# V6.0 — round 4: the pipeline only — `/hiring` after `/role`, `/edge-cases`, payments that follow the channel, and `/admin` over MCP

> Input: your 36 **COMMENT**s inside [05-analysis-round3.md](05-analysis-round3.md). Written 2026-10-18.
> Parts of round 3 you left uncommented stand as written: **Part 3** (Pydantic AI V2 + Harness, the thin `codo-core`), **Part 5** (the bridge ladder; the platform matrix except Eitaa, corrected here in §4.3) and **Part 10** (errata).

> **Read of the day.**
> 1. **Scope reset.** There is no agency. Neda and Hanieh are **two rehearsals of the Codo pipeline**, nothing more. Their details move into two idea-input documents to be written later (Part 10 parks everything already decided for them). **This round designs only the pipeline**, general enough that Codo can build both.
> 2. **Renting is a participant option, not an agency feature.** So `/hiring` runs for everyone, right after `/role`, and decides in-house vs. rented, the employer fields and the commercial model. `/persona` and `/avatar` then describe employment #0.
> 3. **"Management Bale Bot" is no longer a constant.** Hanieh has no bot at all; even on Bale she is a humanoid account. The **management channel is whatever transport the agent listens on**, a bot or a humanoid account. That one change ripples into approvals, the login-relay bootstrap and payments (Part 4).
> 4. **Payments are pluggable and follow the channel.** Bale wallet invoice (bot), card-to-card + receipt OCR (any transport), one-time payment link (a later version). One ledger underneath. The two rehearsals deliberately exercise the first two (Part 5).
> 5. **Every commercial and behavioural rule now has a home step** — your question at §4.2 and §4.6 (Part 3).
> 6. **No admin panel.** The agent serves its own admin MCP endpoint; Codo's `/admin` asks it questions in plain language (Part 7).
> 7. **Haggling is back**, as a negotiation band decided in `/hiring` and enforced in code (Part 6).

---

## Part 0 — Reconciliation of your 36 comments

| # | Where in round 3 | Your comment | Resolution | Section |
|---|---|---|---|---|
| **K1** | §0.2 V1 | *they are rehearsals* | Neda and Hanieh are rehearsals of the pipeline; no agency product. | **Part 1** |
| **K2** | §0.2 V2 | *times in a day is configurable* | Schedules are an **employment field** (any number of runs per day), set in `/hiring`, changed by the manager at runtime. | **§2.2-C**, **§8.1** |
| **K3** | §1.4 | *it was nice for an agent to haggle* | A **negotiation band** per price item, decided in `/hiring` and enforced by code. | **Part 6** |
| **K4** | §1.5 | *no. participants may like to rent their agents too* | Round 3's "v0.1 = employment #0 only" is withdrawn. Rented is a first-class participant path from v0.1. | **§2.1** |
| **K5** | §2.2 | *add `/hiring` just after `/role`: in-house vs rented, employer fields; then `/persona`, `/avatar` for employment #0* | Adopted exactly. | **§2.2** |
| **K6** | §2.3 | *OK. good.* (optional design track) | Kept. | **§2.6** |
| **K7** | §2.4 | *make it a dedicated step as `/edge-cases`* | **`/edge-cases`** («موارد مرزی») after `/sops`: pressure test + the three quality lenses, as its own living document and gate. | **§2.5** |
| **K8** | §4.1 | *Hanieh is paid via OCR, Neda via Bale bot payment; rehearse both. Hanieh has no Bale bot at all; even in Bale she's humanoid.* | Transport-neutral management channel; payment methods chosen per channel; both rehearsed. | **Parts 4–5** |
| **K9** | §4.1 | *they can change the payment method in later versions (e.g. V0.3) to a one-time payment link* | `PaymentMethod` is pluggable; switching is an `/iterate` change; the ledger is untouched. | **§5.4** |
| **K10** | §4.2 | *exactly in which step are these rules decided?* | Decision map. | **Part 3** |
| **K11** | §4.6 | *find the step where these rules are decided in the workshop* | Decision map + pricing guidance inside `/hiring`. | **Part 3**, **§2.2-D** |
| **K12** | §5.2 | *Eitaa doesn't receive users' messages in its app; it can only blindly send (text only)* | Eitaa row corrected: official paths are send-only; any inbound conversation on Eitaa needs a humanoid account. | **§4.3** |
| **K13–K16** | §6.5 | *you suggest; translation welcome · you suggest · you suggest · omit* | Parked for Neda's idea input, with suggestions. | **§10.1** |
| **K17, K21** | §6.5, §7.8 | *don't continue the rehearsals here; focus on pipelines, general enough to build both via codo/* | This document. | All |
| **K18** | §7.8 | *24/7 with debounce in case the customer is typing* | **Inbound debounce** becomes a chassis default; the window is decided in `/sops`. | **§8.2** |
| **K19** | §7.8 | *reply "please write it" until v0.3* | **Unsupported-media fallback** becomes a chassis default; the per-version media set is decided in `/sops`. | **§8.3** |
| **K20** | §7.8 | *one manager* | One manager per employment is the pipeline default. | **§2.2-B** |
| **K22** | §8.1 | *the blog is part of the reporter rehearsal project* | **Companion services**: an agent project may ship self-hosted services next to the agent. | **§9.1** |
| **K23** | §8.1 | *no agency at all; refer employers to https://ble.ir/workshop_ai* | Agency catalog, cross-referral and lead capture are removed. The referral is just a **referral target** in `/role`'s boundary responses; the rehearsals' target is that link. | **§1.2**, **§2.1** |
| **K24** | §8.1 | *(admin bot) no* | Removed. | **Part 7** |
| **K25** | §8.3 | *we'll write two docs as idea input for the two rehearsal projects; put the upsells there* | Upsells parked in Part 10. | **Part 10** |
| **K26** | §8.5 | *no admin panel; codo does admin jobs via MCP: "/admin how many employments so far"* | **`/admin`**, a floating Codo command, over an **admin MCP served by the agent itself**. | **Part 7** |
| **K27** | §8.6 | *they're just rehearsals; I'll migrate them to k8s after they prove themselves* | Hosting dropped from this round; a k8s target for `/migrate` goes to the roadmap. | **§9.3** |
| **K28** | §9.1 | *agreed* (human voice, honest identity) | Becomes a **locked persona rule** in every agent. | **§8.4** |
| **K29** | §9.2 | *"I'm just a worker trying to cover **my master's** rent"* | I misread it. The line points at the employer's costs ("prices are my boss's call"), which is true. It is a fine boundary line. | **§8.4** |
| **K30** | §9.3 | *OK* (illustrative, labelled images) | Parked for Neda. | **§10.1** |
| **K31** | §9.4 | *OK* («هانیه یاوری») | Parked for Hanieh. | **§10.2** |
| **K32** | §9.4 | *what alternative?* (to «سروشیان») | Suggestions in §10.1. | **§10.1** |
| **K33** | §9.4 | *agreed* (Neda 26–28) | Parked for Neda. | **§10.1** |
| **K34** | §9.5 | *agreed* (humanoid risk disclosure) | Becomes a mandatory question wherever a humanoid account is chosen (`/hiring` or `/tools`). | **§2.2-E**, **§2.3** |
| **K35** | D9 | *(WordPress) only if it has an API* | It does. The REST API (posts, media, users) is in core, and application passwords are in core. A rule follows for the pipeline: **a companion service qualifies only if the harness can drive it through an API.** | **§9.1** |
| **K36** | D15 | *codo/ is just a template; it may fetch the codo-core package from Gitea* | Adopted. Plus vendoring at `/migrate` so a project survives the workshop server. | **§9.2** |

---

## Part 1 — Scope reset (K1, K17, K21, K23–K25, K27)

### 1.1 Removed from round 3

The agency, its catalog and cross-referral between agents, lead capture into an admin bot, the agency-wide wallet (old D6), the agency aggregator channel (old D10), agency hosting (old D14) and the agency name (old D1). The ledger is **per agent project** again; each project is fully separate.

### 1.2 What survives as general pipeline concepts

| Concept | Where it lives now |
|---|---|
| **Job vs. Employment**; in-house vs. rented; the boundary rule ("touches the employer's own systems → in-house") | `/hiring` (§2.2) |
| Employment #0 | The **owner's** own employment (definition below) |
| Upsell at the capability boundary | A **referral target** inside `/role`'s boundary responses: "when asked for something outside the job, say X and point to Y". For the rehearsals, Y is `https://ble.ir/workshop_ai`. For a participant, Y might be their human team or website. |
| No discounts by the model | Replaced by the bounded negotiation band (Part 6) |

### 1.3 Two words to keep apart

- **Owner («صاحبِ کارمند»)**: whoever built and runs the agent (a participant, or you for the rehearsals). The owner configures the agent through Codo, including `/admin`.
- **Employer («کارفرما»)**: whoever an employment works for. Talks to the agent through the management channel.

For an **in-house** agent, owner = employer and there is only employment #0. For a **rented** agent, the owner is the employer of #0 (the "front desk" where prospects meet the agent), and every other employer gets their own employment.

---

## Part 2 — The revised pipeline (K4–K7, K34)

### 2.1 Command order

```
[01] /start        unchanged (V4.1 parity)
[02] /role         one job title, duties, scope cuts, boundary responses + referral target, own screen?
[03] /hiring       NEW, always: in-house/rented, manager & binding, employment fields, management channel,
                   commercial model (rented only), humanoid risk
[04] /persona      employment #0's persona (+ persona slot spec if rented)
[05] /avatar       employment #0's avatar (+ hire-time avatar flow if rented)
[06] /tools        transports, bridges, companion services, sealed inputs, approvals, rate limits
[07] /sops         SOPs + meters/holds/balance behaviour per SOP + inbound defaults (debounce, media)
[08] /edge-cases   NEW: pressure test + 3 quality lenses → edge-cases.md; gate for what follows
[08b] /ux → /design → /prototype     only if /role said "own screen" (V4.1 commands, unchanged)
[09] /plan  [10] /build  [11] /wire  [12] /test  [13] /deploy  [14] /iterate  [15] /migrate
Floating: /add-idea, /admin (NEW)
```

Withdrawn from round 3: §1.5's recommendation to build v0.1 as employment #0 only (K4). A participant may build a rented agent from v0.1. The extra work is mostly configuration and tests, because hiring, binding, the ledger and the payment methods are all pre-built in `codo-core`.

### 2.2 `/hiring` («استخدام») in detail (K5)

It runs the V4.1 questions loop on files and writes `docs/living/hiring.md`. Sections A–C always apply; D only for rented agents; E whenever a humanoid account is chosen.

**A. Employment model.**
- In-house or rented, explained with the boundary rule.
- If the role touches the employer's own systems, rented is not offered, and the reason is stated.

**B. Manager and binding.**
- **One manager per employment** (K20), identified by their platform user id on the management channel.
- **How someone becomes an employer** (rented only). One of:
  - (a) on explicit acceptance of terms in chat;
  - (b) on first payment;
  - (c) on owner approval, either through `/admin` or in the owner's #0 chat.
- Default: **(a)** when there is a free start, **(b)** otherwise.
- Binding is a harness action at the end of the hire SOP, never a model decision.

**C. Employment fields.** What each employer sets at hire time and may change later through the management channel.
- **Persona fields**, if the persona is per employment.
- **Job fields**, e.g. schedules — any number of runs per day (K2), sources, channels, business facts.
- For each field: type, validation, default, who may change it, and whether changing it costs anything.
- For an in-house agent this section is still written: it is the list of things the participant can change later from their phone without a new version.

**D. Commercial model (rented only).**
- **Meters**: the billable units, named from `/role`'s duties (e.g. "a published post", "a customer conversation"). `/sops` later binds each meter to the exact SOP step that emits it.
- **Price catalog**: unit prices, bundles, free allowances (welcome credit, free first channel or account).
- **Negotiation band** (Part 6).
- **Payment methods** available on the chosen management channel (Part 5).
- **Balance policy class**:
  - low-balance threshold;
  - what "zero" means for this job (pause scheduled work / grace overdraft + holding reply / refuse new conversations).
- **Price-setting guidance.** Codo explains two anchors:
  1. **Value**: a fraction of what a human doing the same work costs.
  2. **Cost floor**: at least a multiple of the measured LLM + infrastructure cost per unit.
- The cost can only be **measured** at `/test`, so the first prices are provisional, and `/iterate` revisits them with the measured numbers.

**E. Management channel and humanoid risk (K34).**
- Where employers talk to the agent: a bot (which messenger) or a humanoid account (which messenger). See Part 4.
- If humanoid: the ban risk is stated plainly, a dedicated SIM is recommended, and the owner's acceptance is recorded in `docs/decisions.md`.

### 2.3 `/persona`, `/avatar`, `/tools` — what changes

- **`/persona`**: writes employment #0's persona. If rented with per-employment personas, also the **persona slot spec**: editable fields and **locked rules**, which always include honest identity (§8.4) and the boundary voice.
- **`/avatar`**: #0's image. If rented, also how each employer's avatar is produced (upload, or generated from their persona with fixed style rules).
- **`/tools`**: wires the management channel decided in `/hiring` and the customer-facing transports, using round 3's bridge ladder. It also decides companion services (§9.1), sealed inputs, approval modes and opt-in rate limiting. Choosing a humanoid customer-facing account triggers the same risk question as §2.2-E.

### 2.4 `/sops` — three new fields per SOP

1. **Meter and hold**: which meter it emits, at which step, and whether a hold is placed before an expensive step.
2. **Balance behaviour**: what this SOP does at low or zero balance, chosen from the policy class in `/hiring` (§2.2-D).
3. **Inbound defaults** (message-triggered SOPs only): the debounce window (§8.2) and which media types are understood in this version, plus the fallback reply for the rest (§8.3).

### 2.5 `/edge-cases` («موارد مرزی») — the dedicated step (K7)

- **When:** after `/sops`, before the optional design track and `/plan`. By then role, hiring, tools and SOPs all exist, so every lens has something concrete to bite on.
- **What:** one living document, `docs/living/edge-cases.md`, built by the usual questions loop. It starts with the **pressure test** (the riskiest "what if" questions, one theme each, ordered by risk), then runs the **three lenses** (round 3 §2.4) over the SOPs and tools:
  1. **Adversarial**: injection inside untrusted text, extortion of discounts beyond the band, cross-customer and cross-employment extraction, impersonating the manager, misdirected publishing, **welcome-credit farming** (one person opening many employments for free credit), **receipt reuse or forgery**.
  2. **Edge-case hunter**: Persian/Latin digits, `Asia/Tehran` times, duplicates, outages, re-login mid-SOP, balance exactly at zero, a payment arriving twice, a customer typing in bursts.
  3. **Verification gap**: every SOP step has an observable result and a test scenario.
- **Each case records:** id, lens, scenario, expected behaviour, **where it is enforced** (code / configuration / prompt — prompt-only enforcement must be justified), and the `test-scenarios.md` id it adds.
- **Gate:** `/plan` starts only when every case is resolved or explicitly accepted in `docs/decisions.md`.
- **Going back:** an edge case may send the user back to `/role`, `/hiring` or `/tools` — living documents, as V4.1's "UX may change the PRD".

### 2.6 Optional design track (K6)

Kept as in round 3. One addition from K22: when the agent's own screen is a **companion service** (Neda's blog), the design track means **choosing and customising a theme**, not drawing pages from scratch. `/design` then shows three candidate themes or customisations of the chosen service, instead of three hand-drawn pages.

### 2.7 Progress bar

`پیشرفت: ✅ شروع · ➡️ شغل · ⬜ استخدام · ⬜ پرسونا · ⬜ تصویر · ⬜ ابزار · ⬜ رویه‌ها · ⬜ موارد مرزی · ⬜ نقشه · ⬜ ساخت · ⬜ اتصال · ⬜ تست · ⬜ انتشار · ⬜ نسخهٔ بعد · ⬜ مهاجرت`

When `/role` switches on the design track, V4.1's three labels appear between «موارد مرزی» and «نقشه».

---

## Part 3 — Decision map: where every rule is decided (K10, K11)

| Rule | Decided in | Refined in | Enforced by | Tested in |
|---|---|---|---|---|
| In-house vs. rented | `/hiring` A | — | Project config | — |
| One manager; binding procedure | `/hiring` B | `/edge-cases` | Harness hire SOP | `/test` |
| Employment fields (incl. schedules — K2) | `/hiring` C | `/sops` | Typed config + validated update tools | `/test` |
| Management channel | `/hiring` E | `/tools` (wiring) | Transport adapter | `/wire` |
| Meters | `/hiring` D (names) | `/sops` (emitting step) | Harness at SOP step completion | `/test` |
| Prices, bundles, free allowances | `/hiring` D | `/iterate` (after measured cost) | `price_catalog`, `entitlements` | `/test` |
| Negotiation band | `/hiring` D | `/edge-cases` | `make_offer` validator (Part 6) | `/test` |
| Payment methods | `/hiring` D + E | `/iterate` (e.g. payment link in v0.3 — K9) | `codo-core.payments` | `/test` (test token, sample receipts) |
| OCR credit policy (provisional / after audit), provisional cap | `/hiring` D | `/edge-cases` | Receipt matcher + audit queue | `/test` |
| Low-balance threshold, zero-balance class | `/hiring` D | `/sops` (per SOP) | Ledger + SOP pre-checks + holds | `/test` |
| Grace overdraft, holding reply | `/sops` | `/edge-cases` | Ledger + transport | `/test` |
| Discounts, credits, refunds beyond the band | — (owner only) | — | `/admin` mutating tools (Part 7) | `/test` |
| Humanoid risk acceptance | `/hiring` E / `/tools` | — | `decisions.md` record | — |
| Approval mode per sensitive action | `/tools` | `/edge-cases` | Deferred tools + channel confirmation (§4.2) | `/test` |
| Opt-in rate limiting / jitter | `/tools` | — | `codo-core.ratelimit` | `/test` |
| Debounce window; media set + fallback | `/sops` | `/iterate` | Transport ingress (§8.2–8.3) | `/test` |
| Honest identity, boundary voice, referral target | `/role` + `/persona` (locked rules) | — | Locked persona rules + eval set | `/test` |
| Companion services | `/tools` | design track (theme) | Compose services | `/deploy` |

**Rule of thumb Codo follows:**
- `/hiring` decides **what is sold and to whom**.
- `/sops` decides **when the meter ticks and what happens when money runs out**.
- `/edge-cases` decides **what breaks it**.
- `/test` measures **what it really costs**.

---

## Part 4 — The management channel, transport-neutral (K8, K12)

### 4.1 Bot vs. humanoid account as the management channel

| | Bot (e.g. Bale bot) | Humanoid account (any messenger) |
|---|---|---|
| Identity of employment #0 | Bot name and photo | A real account: name and photo can be set to #0's persona |
| Approval cards | Inline buttons | **No buttons** (user accounts can't send inline keyboards): **confirmation codes** (§4.2) |
| OTP / captcha relay for other accounts | Text and photo | Text and photo — same |
| Payments in-chat | Bale wallet invoice (Bale bots only) | Card-to-card + receipt OCR; payment link later |
| Ban risk | Low | Real (§2.2-E) |
| Bootstrap | Token from BotFather in `docs/secrets/` | **Its own first login can't be relayed through itself** (§4.4) |

Round 2's "Management Bale Bot" becomes the **default answer** to `/hiring` E, not a hard-wired part of `codo-core`. Everything that talked to "the bot" now talks to a `ManagementChannel` interface.

### 4.2 Approvals without buttons

On a humanoid channel the approval card is a text message ending in a short one-time code: «برای تأیید بنویس: ۴۸۲۷». It is valid only from the manager's user id, only for that request, and only until it expires. A bare «باشه» never approves anything. The deferred-tool mechanism is unchanged: the code reply resolves `DeferredToolResults`.

### 4.3 Eitaa corrected (K12)

Eitaa's official paths are **send-only**:
- Eitaayar for channels and groups;
- "app" messages to users who pressed start — text only, blind, no inbound.

So **any conversation that must receive messages on Eitaa needs a humanoid account** (rung 1, `eBot`), or an Eitaa mini-app if the agent has its own screen. Round 3's matrix row "DM customers who wrote first — Eitaa app messages" was wrong.

### 4.4 Bootstrap and recovery of a humanoid management account

The OTP for the management account's own login has nowhere to go. Two moments need covering:
- **First login (`/wire`):** the participant runs `/admin login <account>` in Codo. The agent's admin MCP (Part 7) starts the login, and the participant writes the OTP into `docs/secrets/otp.local.md` (never into the chat). The agent reads it once and then blanks the file.
- **Recovery (session expired on the server):** the agent cannot reach its manager, so it alerts the **owner** — over another management-capable transport if one exists, otherwise through the next `/admin` session, which shows "management account logged out" first. Re-login then uses the same `/admin login` path.

All other logins — customer-facing accounts and later employments' accounts — keep round 2's relay through the management channel.

---

## Part 5 — Payments: pluggable methods, one ledger (K8, K9)

### 5.1 The interface

`codo-core.payments.PaymentMethod`:
- `request(payer, amount_rials, purpose) → PaymentRequest`
- `confirm(evidence) → PaymentResult`

Every confirmed payment becomes one idempotent `topup` (or `order_paid`) ledger entry. The ledger, holds and meters from round 3 §4.2 are unchanged. The payer may be an **employer** (credit for a rented employment) or a **customer** (an agent whose job includes selling, e.g. an in-house shop agent). The methods are shared by both.

### 5.2 Method 1: Bale wallet invoice (bot on Bale — Neda's rehearsal)

As in round 3 §4.1:
- `sendInvoice` with the wallet `provider_token`;
- validate on `pre_checkout_query`;
- credit on the successful-payment update, idempotent on Bale's charge id.

The money lands in the bot owner's Bale wallet, and the test token drives `/test`.

### 5.3 Method 2: card-to-card + receipt OCR (any transport — Hanieh's rehearsal)

Revived from V5.0's archival spec.

**1. Unique amount.**
- `amount = base − 1000 + (request_id mod 1000)` Toman.
- Drawn from a sliding pool of open requests, so no two open requests share the last three digits.
- Expires after a TTL (V5.0's collision guard).

**2. Instruction.** The agent sends the destination card from the owner's secrets (a sealed `env_` output, never in model context), the exact amount and the expiry.

**3. Receipt.** The payer sends a screenshot. A **separate extraction call** — a vision model with structured output and no tools, outside the conversation — returns:
- amount;
- date/time;
- destination card's last 4 digits;
- tracking/reference number.

Persian and Arabic digits are normalised; Rial vs. Toman is detected.

**4. Deterministic matcher.** The receipt matches only if:
- the amount equals an open request;
- the time is inside the window;
- the destination matches;
- the tracking number has never been seen;
- the image hash has never been seen.

The conversational model **never** decides "paid".

**5. Credit policy** (`/hiring` D):
- **provisional credit up to a cap**, then owner audit (recommended);
- or credit only after audit;
- or immediate credit.

**6. Owner audit.** Each matched receipt goes to an audit queue, visible to the owner in their #0 management chat and in `/admin`. A rejected receipt reverses the provisional credit with a ledger entry, and the payer is told politely.

**Known limit:** an edited screenshot can fool OCR. The unique amount, the uniqueness checks, the provisional cap and the audit bound the damage. `/edge-cases` must list it, and the owner accepts it explicitly.

### 5.4 Method 3: one-time payment link (a later version — K9)

- The agent creates a one-time link through an IPG (the owner's merchant account; it requires e-Namad) and sends it to the employer or customer.
- The IPG callback is an ordinary webhook, so round 2's zero-drift relay delivers it to the laptop during `/wire` and `/test` exactly as on the server.
- Switching a project from method 2 to method 3 is an `/iterate` change to `hiring.md` and `tools.md`; ledger and SOPs don't change.

---

## Part 6 — Bounded haggling (K3)

Haggling is decided in `/hiring` D and enforced in code, so the persona can enjoy the bargaining without ever giving away what the owner didn't allow.

- **The band**, per price item or bundle:
  - list price;
  - floor price;
  - **allowed concessions** (price steps, bonus units, a free extra channel or account);
  - maximum number of concessions;
  - offer expiry.
- **Tools:**
  - `make_offer(items, price, concessions)`: the code validates it against the band, against what is already on the table for this person (never re-offers lower after a walk-away unless the band allows it) and against expiry. Valid offers are stored; invalid ones return a reason the persona can phrase in her own voice.
  - `accept_offer(offer_id)`: the harness writes the agreed price as this employment's price override.
- **Beyond the band:** either a deferred approval to the owner (if `/hiring` allows escalation), or a refusal in the boundary voice: "prices are my boss's call" — your K29 line, which is exactly right here.
- **`/edge-cases` must cover:**
  - anchoring and repeated asking;
  - the same person bargaining from two accounts;
  - welcome-credit farming;
  - an offer accepted after expiry.

---

## Part 7 — `/admin` over MCP: no admin panel (K24, K26)

### 7.1 Shape

Each agent serves an **admin MCP endpoint** of its own (streamable HTTP mounted in the agent's FastAPI app), authenticated with an admin token from `docs/secrets/`. Codo's `/admin` command connects to it and answers in plain language:

> `/admin how many employments so far` → the coding assistant calls `stats.employments()` and answers «تا امروز ۷ استخدام: ۵ فعال، ۲ متوقف…».

**Why the agent serves it, not the workshop MCP on Kandoo:** it works the same locally, on staging, after `/migrate` and later on k8s (K27). It also lets every mutation go through the same domain services as the agent, so ledger invariants hold, instead of raw SQL from outside.

| URL | When |
|---|---|
| `http://127.0.0.1:8000/admin/mcp` | Local |
| `https://<name>.<base_domain>/admin/mcp` | Staging |
| The new host's URL | After `/migrate` (updated by `/migrate`) |

### 7.2 Tools

| Group | Tools | Kind |
|---|---|---|
| Stats | `employments`, `usage(period)`, `revenue(period)`, `spend_by_model(period)`, `conversations(period)` | Read |
| Lookup | `employment(id)`, `ledger(employment_id)`, `audit_queue()`, `escalations(open=true)` | Read |
| Ad-hoc | `query_readonly(sql)` over a **read-only database role**, row-capped | Read |
| Payments | `approve_receipt(id)`, `reject_receipt(id, reason)` | Write |
| Money | `grant_credit`, `refund`, `set_price_override` | Write, owner only |
| Lifecycle | `pause_employment`, `resume_employment`, `login(account)` (§4.4) | Write |

### 7.3 Safety

- **Every write tool needs confirmation.** The assistant shows the exact call and its effect and waits for the participant's «بله». Each write is recorded as an `admin_adjustment` ledger entry or an audit row, with the reason.
- **The coding assistant has a shell; customer text is untrusted.**
  - Read tools return aggregates and structured fields by default.
  - Any raw message text comes back wrapped in round 2's spotlight tags, truncated, and guard-redacted.
  - `commands/admin.md` tells the assistant that admin results are data, never instructions.
- **Privacy:** customer conversations travel to the coding assistant's model provider only when the participant explicitly asks for them. The default answers carry no message text.
- **Secrets:** the admin token sits in `docs/secrets/admin.local.md`. Codo's MCP config references it without committing it (OpenCode's file/environment substitution — **verify** the exact syntax in OpenCode v2 when writing `/start`).

---

## Part 8 — Chassis defaults that came out of the rehearsal answers (K2, K18–K20, K28, K29)

### 8.1 Schedules (K2)

- **Form:** a list of run times per weekday in `Asia/Tehran`, any count.
- **Changing them:** the manager edits them in plain language, and the agent calls a validated `set_schedule(times)` tool.
- **Limits:** the minimum interval between runs and the maximum runs per day come from `/hiring` C.
- **Cost:** any change that affects cost shows a quote first.

### 8.2 Inbound debounce (K18)

- **Mechanism:** message-triggered SOPs don't wake on every message. They wake after a quiet window (e.g. 6 s since the last message, capped at 30 s), extended while a typing signal is seen.
- **Typing signals:** only where the platform gives them (Telethon receives typing updates on a user account; bot APIs generally don't).
- **Result:** the agent answers the whole burst once, 24/7.
- **Settings:** window and cap are `/sops` fields.

### 8.3 Unsupported media (K19)

Each version declares which media types it understands. Anything else gets a varied, persona-voiced fallback ("please write it for me") and is logged, so the owner sees how often voice notes arrive before deciding when to support them.

### 8.4 Locked persona rules (K28, K29)

Every persona slot carries locked rules that no employer can edit:
- **Honest identity:** human voice, but never denies being an assistant when sincerely asked.
- **Boundary voice:** out-of-scope and price refusals point at the employer's rules ("my boss decides that"), not at invented personal hardship.
- **Referral target**, from `/role`.

---

## Part 9 — Companion services, `codo-core` distribution, hosting (K22, K27, K35, K36)

### 9.1 Companion services

An agent project may ship self-hosted services next to the agent (Neda's blog; another agent might need a small CRM or a search index). Rules:
- **Decided in `/tools`.**
- **API-only (K35):** a service qualifies **only if the harness can drive it through an API**, because the agent acts through tools, not screens. WordPress qualifies: its REST API (posts, media, users) and application passwords are in core.
- **Deploy:** it ships as extra services in the project's compose file. Coolify deploys compose stacks, and `/migrate` carries their volumes.
- **Look:** the design track (§2.6) covers its theme.
- **Ownership:** a companion service belongs to the agent project. It is not shared infrastructure.

### 9.2 `codo-core` distribution (K36)

- `codo/` stays a template. Its `backend/requirements.txt` pins `codo-core==X.Y.Z`, fetched from the Gitea PyPI registry on the workshop server (`/prepare` publishes it there; pip reaches it through the workshop proxy).
- **Builds:** `/deploy`'s image build installs the package, so the running container never needs the registry.
- **`/migrate` vendors the pinned wheel** into the project (`vendor/`) and points requirements at it. Otherwise the project could no longer be rebuilt once the workshop server is gone.
- **Your rehearsals** use the same pinned package, so they test exactly what participants get.

### 9.3 Hosting (K27)

Rehearsals run like any participant project (`/deploy` to staging). A **k8s target for `/migrate`** goes to the pipeline roadmap for after the rehearsals prove themselves.

One pipeline-level risk remains: whether Iranian messengers accept connections from the staging server's foreign IP. That is a `/prepare` reachability check in Kandoo (per messenger, bot API and humanoid web endpoints), not an agent decision.

---

## Part 10 — Parking lot for the two idea-input documents

Everything already decided or suggested for the rehearsals, so nothing is lost before you write their idea inputs.

### 10.1 Neda (reporter)

**Already decided:**
- **Persona:** age 26–28 with 3–4 years of newsroom experience (K33).
- **Images:** illustrative, labelled «تصویر تزئینی» (K30).
- **Reports:** omit views where a platform doesn't expose them (K16); translation from foreign sources welcome (K13).
- **Schedule:** configurable number of runs per day (K2).
- **Payments:** Bale bot wallet payment (K8).
- **Blog:** inside her project, on WordPress (K22, K35).
- **Upsell:** for Twitter/Instagram/your own platform (e.g. Konkooria), refer to `https://ble.ir/workshop_ai` (K23, K25).

**Surname alternatives to «سروشیان» (K32):**
- «نویدی» (*navid* = good tidings; a common, natural surname) — **my pick**;
- «مژده‌ای» (*mozhdeh* = good news);
- «پیام‌نیا» (*payam* = message).

**Source suggestions for employment #0** (domain: AI and agents) (K13):
- **International** (translated): MIT Technology Review, The Verge AI, TechCrunch AI, Ars Technica; the official blogs of OpenAI, Google DeepMind, Anthropic, Meta AI and Hugging Face; arXiv cs.AI listings for depth.
- **Persian:** Zoomit, Digiato.
- Final RSS URLs to be checked when the idea input is written.

**Article format (K14):** 700–1,000 words, made up of:
- headline;
- a 2–3-sentence lead;
- context;
- what's new;
- why it matters for Persian readers;
- a source list with links.

**Channel summary (K15):**
- about 80–120 words, the image, the blog link, 2–3 hashtags;
- the same text everywhere, adjusted only where a messenger forces it (Eitaayar sends text and files).

### 10.2 Hanieh (support)

**Already decided:**
- **Persona:** «هانیه یاوری» (K31).
- **Availability:** 24/7 with debounce (K18).
- **Media:** "please write it" for voice and images until v0.3 (K19).
- **Management:** one manager (K20); **no bot at all** — humanoid on every messenger, including Bale (K8).
- **Payments:** card-to-card + receipt OCR (K8); a payment link possibly in v0.3 (K9).
- **Haggling:** allowed within a band (K3).
- **Boundary line:** "I'm just a worker covering my master's costs" (K29).
- **Upsell:** "to connect me to your own system, build your own agent" → `https://ble.ir/workshop_ai` (K23, K25).

### 10.3 Carried from round 3, for both

- Honest identity (K28).
- Humanoid risk disclosure (K34).
- Round 3's Parts 6–7 as raw material for the idea inputs. Parts 6–7 were otherwise left unanswered there — that was intended.

---

## Part 11 — Open decisions (pipeline only)

| # | Decision | Options | Recommendation |
|---|---|---|---|
| **P1** | Position of `/edge-cases` | After `/sops` / after `/tools` / both (light + full) | **After `/sops`** (§2.5) |
| **P2** | `/hiring` for in-house agents | Always run (short path) / skip | **Always** — sections A–C still matter (§2.2) |
| **P3** | Identity of a rented agent's management bot when personas differ per employment (round 3 D4) | Neutral product name, messages signed with the employment's persona name / employer brings his own bot / both | **Both**, neutral by default |
| **P4** | Approvals on humanoid channels | One-time numeric code / keyword | **Code** (§4.2) |
| **P5** | Bootstrap login of a humanoid management account | `/admin login` + OTP in a secrets file / a localhost login page | **`/admin login`** — one admin path for everything (§4.4) |
| **P6** | OCR credit policy default | Provisional up to a cap / after audit / immediate | **Provisional with cap** (§5.3) |
| **P7** | Where the admin MCP lives | Inside each agent / workshop MCP on Kandoo | **Inside each agent** (§7.1) |
| **P8** | Write tools in `/admin` | With confirmation / read-only | **With confirmation** (§7.3) |
| **P9** | Debounce default | 6 s quiet, 30 s cap / other | **6 s / 30 s**, tuned at `/test` |
| **P10** | Durable engine for SOP runs (round 3 D16, uncommented) | DBOS / pgtask / Temporal | **DBOS** |
| **P11** | Default binding procedure | Acceptance in chat / first payment / owner approval | **Acceptance** with a free start, otherwise **first payment** (§2.2-B) |
| **P12** | `codo-core` at `/migrate` | Vendor the wheel / keep pulling from the registry | **Vendor** (§9.2) |

