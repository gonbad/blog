# V6.0.3 — Adversarial Review, Round 2

> **Date:** 2026-10-21  
> **Scope:** Current workspace architecture (`20-architecture.md`) and `agent/kandoo/packages/codo-core/codo_core/`, with emphasis on whether the CIA invariants survive a hostile LLM, customer, and rented employer. This is a local static review; it does not cover the live workshop server or published artifacts.
>
> **Verdict:** **NO-GO for claiming CIA-by-design is enforced by the current runtime.** The previous review's major implementation work is visible in the current source, including deterministic routing, pre-persist scrubbing, tool-call limits, proposal nonces, and real CLI handlers. The findings below identify remaining paths that bypass or contradict those controls.

## Findings

### A-1 — HIGH: Missing contact identity is treated as verified

- **Location:** `agent/kandoo/packages/codo-core/codo_core/engine.py:188-196`.
- **Attack:** The contact verifier accepts a missing `contact.user_id`: `sender_ok` is true when the field is empty. Any contact payload with a phone number but no identity is stored as `phone_verified=True` and can satisfy a `HandleRef["phone_verified"]` command.
- **Impact:** A forwarded or otherwise unbound phone number can cross the verified-contact boundary. Downstream registration or employer notification treats the value as belonging to the authenticated sender.
- **Fix:** Require an explicit platform-authenticated contact owner equal to the sender. If a channel cannot provide that proof, keep the value unverified and require OTP or another deterministic ownership check.

### A-2 — HIGH: Humanoid confirmation nonces are written to LLM-readable history

- **Location:** `agent/kandoo/packages/codo-core/codo_core/engine.py:495-501,890-904`; `agent/kandoo/packages/codo-core/codo_core/tools.py:103-115,291-298`.
- **Attack:** The harness mints the nonce after the model turn, but sends it through the normal reply path, which persists outbound messages. On a later turn, `get_my_chat_history` and `search_knowledge` expose that stored message to the LLM. The nonce is not redacted by `guard.redact`.
- **Impact:** A later prompt injection can ask the model to retrieve the previous confirmation code and persuade the user to send it, defeating the egress-only nonce defense in `20-architecture.md` §2.3/I-1.
- **Fix:** Treat nonce delivery as a secret-bearing system event. Do not store it in customer-visible history, serialized model history, search indexes, or any tool result; consume it atomically and expire it after one use.

### A-3 — HIGH: PII scrubbing fails open and excludes employer messages

- **Location:** `agent/kandoo/packages/codo-core/codo_core/engine.py:138-151,572-588`.
- **Attack:** When `scrub_text` raises (for example, if vault persistence fails), `_dispatch` swallows the exception and keeps the original text. That raw text is persisted and later sent to the model. The same scrub step is skipped entirely for `is_mgmt` messages; ordinary employer turns are passed to the LLM from `_manager_turn`.
- **Impact:** A transient storage error or an employer sharing a phone number, token, or other secret can expose plaintext to the external model and message store, contrary to D8 and Defense C-2.
- **Fix:** Fail closed: redact sensitive spans without requiring vault persistence, or reject/defer the message if safe tokenization cannot complete. Apply the same confidentiality policy to employer messages before persistence and model dispatch.

### A-4 — HIGH: LLM tools receive the full-power `Ctx`, including secret and trusted sinks

- **Location:** `agent/kandoo/packages/codo-core/codo_core/tools.py:81-100,103-164,171-178`; `agent/kandoo/packages/codo-core/codo_core/declare.py:297-303,395-398`; `agent/kandoo/packages/codo-core/codo_core/security.py:54-82`.
- **Attack:** `_wrap_job_tool` passes `ctx.deps` directly to job tools and returns their output without filtering. That object is the full `Ctx`, which carries raw peer/employment/customer identifiers and exposes `unveil_for_db`, `notify_employer_system_fact`, and `send(..., dest=...)`. A generated `@llm_tool` can dereference a handle and return plaintext to the model, emit a forged “system fact” notification, or send to a configured channel. The static checker does not prohibit these context calls or inspect returned data.
- **Impact:** The runtime's reference-monitor boundary depends on every generated tool author behaving correctly. A compromised model can invoke any unsafe helper that a generated tool exposes, violating the confidentiality and unforgeable-notification claims in D7-D9.
- **Fix:** Pass a genuinely attenuated LLM context with no plaintext dereference, raw identifiers, system-notification, or arbitrary-destination methods. Keep those capabilities on a separate principal-only context. Add an output policy that prevents sensitive values from crossing back to the model, and make the checker reject unsafe context access.

### A-5 — HIGH: Employer webhook configuration enables server-side request forgery

- **Location:** `agent/kandoo/packages/codo-core/codo_core/employer.py:314-326`; `agent/kandoo/packages/codo-core/codo_core/notifications.py:39-70`.
- **Attack:** An authenticated employer can set any `webhook_url`. When an event is sent, the service posts to that URL without scheme, address, DNS, or redirect restrictions. In a rented multi-tenant deployment, a tenant can target loopback, private services, or cloud metadata reachable from the agent's network.
- **Impact:** The notification sink becomes a blind SSRF primitive from the runtime network. Requests include event details and employment identifiers.
- **Fix:** Restrict to HTTPS and approved public destinations; resolve and reject private, loopback, link-local, and metadata addresses at connection time; revalidate redirects and enforce an egress policy outside the application.

### A-6 — HIGH: Proposal confirmation is not an atomic one-use operation

- **Location:** `agent/kandoo/packages/codo-core/codo_core/engine.py:296-312,505-552`; `agent/kandoo/packages/codo-core/codo_core/layer1_fsm.py:191-212`.
- **Attack:** Button callbacks select a proposal while `status == "pending"`, run the command, then mark it executed in a later operation. Nonce consumption also selects and returns a pending row without claiming it. Two duplicate updates processed concurrently can both observe `pending` and execute the same state-changing command.
- **Impact:** A double callback or retry race can create duplicate registrations, charges, or other principal-command effects. The callback path also loads by proposal ID and checks the peer, but does not verify the stored `employment_id` and `account_slot` against the current ingress context before executing under the current employment.
- **Fix:** Atomically claim a proposal with a conditional update (`pending` → `executing`) that includes proposal ID, employment, account slot, peer, and expiry. Execute idempotently and transition to a terminal state; reject every callback that fails the scoped claim.

### A-7 — HIGH: The bot self-service menu is text, not executable controls

- **Location:** `agent/kandoo/packages/codo-core/codo_core/layer1_fsm.py:70-94`; `agent/kandoo/packages/codo-core/codo_core/engine.py:890-904`.
- **Attack / failure:** `menu_for_port` renders labels such as `[ثبت‌نام]` as plain text. `_reply_to_conversation` sends text without inline buttons or callback data. Bot routing can execute `cmd:<slug>` callbacks, but the menu never creates those callbacks; unlike humanoid numeric choices, normal users have no deterministic way to invoke arbitrary declared commands while the LLM is offline.
- **Impact:** D5's LLM-Zero completeness claim fails on bot ports. Users can see a menu while being unable to perform the listed actions without the model.
- **Fix:** Render actual platform buttons with deterministic callback payloads for every principal command and route them through the scoped proposal/command handler. Keep labels and available actions consistent with the active employment and channel.

### A-8 — HIGH: The static security gate can skip checks and silently pass

- **Location:** `agent/kandoo/packages/codo-core/codo_core/app.py:219-298`; `agent/kandoo/packages/codo-core/codo_core/security.py:116-145`.
- **Attack / failure:** `check_backend_dir` only recognizes `ast.FunctionDef`, so it skips `async def` tools, which are the common tool shape. Read/parse failures are silently continued, and `app.check` swallows exceptions from loading or running the security checks.
- **Impact:** A project can pass `codo-core check` without its async tools being inspected, or with the security scanner unavailable, contradicting D9's fail-the-build guarantee.
- **Fix:** Inspect both `FunctionDef` and `AsyncFunctionDef`; report unreadable or unparsable files as failures; and fail closed if the security checker cannot load or complete.

### A-9 — MEDIUM: WYSIWYS cards allow payload text to imitate system UI

- **Location:** `agent/kandoo/packages/codo-core/codo_core/layer1_fsm.py:216-224`; proposal payload formatting in `agent/kandoo/packages/codo-core/codo_core/tools.py:516-550`.
- **Attack:** Field values are inserted into the confirmation card without escaping or control-character filtering. A model-controlled string can contain newlines and text resembling the fixed system banner, another field, or a second action.
- **Impact:** The actual proposal remains bound to its stored payload, but the user may be misled about what the confirmation approves, weakening the WYSIWYS defense.
- **Fix:** Render each value as an escaped field in a platform-supported structured card, strip control characters and line breaks, and reject or safely truncate overlong values before proposal creation.

## Disposition

Do not describe V6.0.3 as enforcing the full CIA model until A-1 through A-8 are closed. A-9 should also be addressed before relying on proposal cards for high-consequence consent. No tests were run and no live-server state was checked in this review.
