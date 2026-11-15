# V6.0.3 — Adversarial Review, Round 3

> **Date:** 2026-10-21  
> **Scope:** Current workspace architecture (`20-architecture.md`) and `agent/kandoo/packages/codo-core/codo_core/` at 0.3.1, with emphasis on whether the Round-2 (doc 22) fixes actually hold under a hostile LLM, customer, and rented employer — plus transport-layer integration the earlier reviews did not exercise. This is a local static review plus code-path tracing; no live-server state was checked.
>
> **Verdict:** **NO-GO.** Round-2 closed the named findings on paper, but three of its own fixes are bypassable (`BoundCtx` holds the full-power context and the gate only checks direct `ctx.<attr>`; `propose_<slug>` exposes unchecked principal-command params; the claim wildcards admit empty-scope rows). Worse, a wire-format mismatch means **no real platform callback ever reaches the deterministic router** — `act:`/`cancel:`/`cmd:`/`menu:` clicks arrive as `[button:<data>]` text and fall through to the LLM, so WYSIWYS confirmation and LLM-Zero are dead on the production bot transports that this system actually runs on.

## Findings

### B-1 — CRITICAL: Real drivers wrap callback data as `[button:<data>]` — the deterministic router never matches

- **Location:** `agent/kandoo/packages/codo-core/codo_core/accounts/bale_bot.py:16-20` vs `agent/kandoo/packages/codo-core/codo_core/layer1_fsm.py:36-46`.
- **Attack / failure:** `BaleBot.parse_update` converts a `callback_query` into `text = "[button:act:prop_…]"`. `is_button_callback` requires the payload at position 0 (`act:`, `cmd:`, `cancel:`, `menu:`). The `[button:` prefix never matches, so every real button click falls through to the LLM turn path. Telegram inherits `BaleBot`, so both bot transports are affected.
- **Impact:** On the transports that actually run, `act:`/`cancel:`/`cmd:`/`menu:` callbacks are dead — WYSIWYS proposals can never be confirmed or cancelled by button, the self-service menu buttons do nothing, and the raw callback payload (including proposal ids) is persisted to model-readable history and handed to the model as a user message. This silently nullifies A-6, A-7, I-1, and D5 in production even though all tests pass — the test harness injects raw `act:prop_x` text that no real driver ever produces.
- **Fix:** Put the callback payload in a dedicated `InboundEvent` field (e.g. `callback_data`) instead of smuggling it through `text`, and match on that field; or at minimum unwrap a `[button:…]` prefix inside `is_button_callback`. Add a driver-level test that feeds a `callback_query` update through `BaleBot.parse_update` into the router.

### B-2 — HIGH: `BoundCtx._ctx` hands every LLM tool the full-power context — attenuation is a façade and the gate cannot see it

- **Location:** `agent/kandoo/packages/codo-core/codo_core/declare.py:423-424` (`self._ctx = ctx`); `agent/kandoo/packages/codo-core/codo_core/tools.py:196-215`; `agent/kandoo/packages/codo-core/codo_core/security.py:34-46,93-123`.
- **Attack:** The attenuated context stores the entire `Ctx` as an attribute. A model-invoked tool can write `ctx._ctx.http` → an unfiltered `httpx.AsyncClient` (SSRF to `169.254.169.254`), `ctx._ctx.drivers[slot].send(...)` → arbitrary outbound, `ctx._ctx.send("…", dest=...)` → direct egress, `ctx._ctx.peer_id` / `ctx._ctx.employment` / `ctx._ctx.customer` → raw identifiers and ORM objects, `ctx._ctx._as_principal_ctx()` → a freshly minted principal context. The gate misses all of it: `FORBIDDEN_CTX_ATTRS` only fires when the receiver is a bare `Name` equal to the first parameter — `ctx._ctx.<attr>` has an `ast.Attribute` receiver. `FORBIDDEN_CALL_NAMES` does not include `send`, `http`, `drivers`, `open_ref`, `unseal_text`, `vault_lookup`, or `_as_principal_ctx`. `getattr(ctx, "_ctx")`, `vars(ctx)`, `ctx.__dict__`, `method.__self__`, `fn.__closure__` are unchecked too.
- **Impact:** The Round-2 A-4 fix is bypassable in both directions — runtime (the capability is one attribute away) and statically (the gate only models direct `ctx.` access). Any of these reaches plaintext dereference, arbitrary egress, or SSRF from model-invoked code.
- **Fix:** (a) Do not store the `Ctx` on the object — capture only the needed bound callables/values inside `__init__` locals so `bctx._ctx` does not exist (document that Python cannot sandbox introspection fully; the gate is the barrier). (b) Gate: for every `ast.Attribute`, walk the receiver chain to its root `Name`; flag forbidden attrs anywhere in a chain rooted at the ctx parameter. Forbid `getattr`/`setattr`/`delattr`/`vars`/`eval`/`exec`/`compile`/`__import__`/`globals`/`locals` calls and all dunder/private (`_`-prefixed) attribute access in LLM-tool bodies. Add `send`, `send_message`, `http`, `drivers`, `peer`, `peer_id`, `employment`, `conversation`, `customer`, `_ctx`, `_driver`, `_send`, `_as_principal_ctx`, `open_ref`, `unseal_text`, `vault_lookup` to the forbidden surface.

### B-3 — HIGH: `@principal_command` parameters are never AST-01-checked — `propose_<slug>` exposes identity and PII params to the model

- **Location:** `agent/kandoo/packages/codo-core/codo_core/security.py:127-158` (principal commands skip signature checks entirely); `agent/kandoo/packages/codo-core/codo_core/tools.py:492-505` (every non-ctx param enters the synthesized schema).
- **Attack:** `check_job_security` applies AST-01 only to `@llm_tool` and legacy `@tool`. A principal command declared as `confirm_registration(ctx, peer_id: str)` or `(ctx, phone: str)` (plain `str`, not `HandleRef`) passes the gate, and the synthesized `propose_<slug>` JSON schema hands those parameters to the model. The model can therefore supply an arbitrary `peer_id`, `employment_id`, `dest`, or raw `phone` string into the trusted Layer 3 surface — exactly what Γ-binding and `HandleRef` provenance exist to prevent.
- **Impact:** One mis-declared parameter re-opens model control over principal identity and injects raw PII into the trusted execution path; the Round-1/Round-2 work on handle provenance is bypassed by declaration.
- **Fix:** Run `check_llm_tool_signature` on every `@principal_command` (excluding `ctx` and params annotated `HandleRef[...]`/`QuoteRef`). Belt-and-suspenders at runtime: when synthesizing `propose_<slug>`, drop schema params whose names are in `FORBIDDEN_LLM_PARAMS` (or refuse to mount the wrapper and surface it at `check`).

### B-4 — HIGH: `_employment_for` routes every unbound shared-account event to the first employment — cross-tenant mixing

- **Location:** `agent/kandoo/packages/codo-core/codo_core/engine.py:904-922`.
- **Attack / failure:** For an account with `per_employment=False` and no entry in `emp.accounts`, **every** active/paused/draft employment matches and `matched[0]` wins — order of the unfiltered select. Two rented employments sharing one bot account send all customers to the first row. The victim's messages, wizard FSM, handles, and proposals are then created under the wrong `employment_id`; `check_handle_ownership` binds to that same wrong id so the corruption is consistent and silent.
- **Impact:** Cross-tenant data mixing and command execution under the wrong employer context — a customer of employer B registers (and is billed) inside employer A's employment. Confidentiality and integrity both break for the multi-tenant rented case that is the product's core model.
- **Fix:** Resolve `(platform, platform_user_id) → Customer → employment_id` before falling back; a customer who already exists must always route to their own employment. For new users on a shared account, require an explicit binding claim (employment-scoped entry point or broker token in the update), and refuse/queue when multiple employments match ambiguously instead of picking `matched[0]`.

### B-5 — HIGH: `phone_verified` is unreachable on real transports and reachable only where identity is caller-supplied

- **Location:** `agent/kandoo/packages/codo-core/codo_core/accounts/` — no driver populates `media.contact` (`bale_bot.py` drops it; humanoid drivers never set it); `accounts/web.py:22-29` passes `media` straight from POST JSON; `engine.py:196-232`.
- **Attack:** The Round-2 A-1 check compares `contact.user_id == ev.user_id` — but on `web` (and any bridge that trusts its JSON body) **both fields are attacker-chosen in the same request**, so the equality is vacuous. The only channel that can mint `phone_verified` today is the one where the sender picks both ids. Meanwhile genuine bot contact shares never reach the verifier because no real parser emits `media.contact`.
- **Impact:** `HandleRef["phone_verified"]` is satisfiable only through a forgeable path — verified-tier provenance is effectively unenforced, and legit platforms can't use it at all (a hidden LLM-Zero gap: verified-phone commands can never complete on production ports).
- **Fix:** Add a driver capability (`supports_verified_contact`/`identity_proof`) that is true only where the platform authenticates both `user_id` and `contact.user_id` (bot webhooks where the platform injects `contact.user_id`); `web`/api-kind and sidecar JSON must always take the unverified path. Parse `message.contact` in `bale_bot`/`telegram_bot` so the real path exists.

### B-6 — HIGH: Principal-command result text bypasses PII masking — unveiled values re-enter model-readable history

- **Location:** `agent/kandoo/packages/codo-core/codo_core/engine.py:604-609,954-978`; `agent/kandoo/packages/codo-core/codo_core/guard.py:35` (default `kinds=("card","sheba")`).
- **Attack:** A Layer-3 command legitimately unveils a handle (`sink="db"`) and returns a result string — `message_fa` containing the real phone or national id is natural (e.g. "ثبت شد با 0912…"). `_reply_to_conversation` redacts with the default kinds only — **phone and national_id are not masked** — so the plaintext lands in `messages` and in `get_my_chat_history`/`search_knowledge` results.
- **Impact:** The handle vault is bypassed at the trusted-egress boundary: one command that echoes its own unveiled input re-exposes plaintext to the model on the next turn — precisely the flow the architecture exists to prevent. The same applies to `Ctx.send` paths used by proposals/escalations.
- **Fix:** Send the user's copy as-is if needed, but persist `persist_text=redact(text, kinds=all)` (or re-scrub via `scrub_text` so the value re-vaults to a handle). Apply the same policy to every `_reply_to_conversation` caller that can carry Layer-3 output.

### B-7 — MEDIUM: Manager "reply to customer" relay is not employment-scoped — cross-tenant injection

- **Location:** `agent/kandoo/packages/codo-core/codo_core/manager.py:49-61`; `agent/kandoo/packages/codo-core/codo_core/engine.py:643-649`.
- **Attack:** `CUSTOMER_REF_RE` accepts any `cus_…`/`cnv_…` id from manager text. `mark_manager_handled` and the relay load the conversation with no employment check. A manager of employment A who learns a `cnv_` id belonging to employment B flips its lifecycle to `manager` and injects text into another tenant's customer conversation. The same handler also emits `Event` rows with no `employment_id`.
- **Impact:** Cross-tenant message injection and lifecycle tampering; unattributed audit events.
- **Fix:** Join `Conversation → Customer` and require `customer.employment_id == current employment` before marking or relaying; record `employment_id` on all events; reject `cus_` refs (they are customer ids, not conversation ids).

### B-8 — MEDIUM: Approval resume is non-atomic and code-collidable; a wrong request can be approved

- **Location:** `agent/kandoo/packages/codo-core/codo_core/engine.py:652-683`; `agent/kandoo/packages/codo-core/codo_core/manager.py:36-48`.
- **Attack / failure:** `resume_approval` SELECTs a pending approval by 4-digit code then UPDATEs status — two concurrent resumes both pass the check and replay the paused run twice (duplicate tool effects, double replies, double metering). `classify` picks `desc(Approval.id)` on collision, so a manager approving "1234" can resume a *different* pending request than the one displayed. `Approval.code` has no uniqueness or conversation binding in the lookup.
- **Impact:** Duplicate side-effects under race; wrong-request approval under collision — both are the same class of bug A-6 fixed for proposals, still open here.
- **Fix:** Atomically claim `pending → approved/rejected` scoped to (employment, code); enlarge/namespace the code (e.g. include conversation suffix or 6 digits with uniqueness retry); show the tool names in the manager's prompt and bind resolution to that approval row only.

### B-9 — MEDIUM: Webhook SSRF residual — DNS rebinding TOCTOU and mapped-literal gaps

- **Location:** `agent/kandoo/packages/codo-core/codo_core/notifications.py:23-60,117-118`.
- **Attack:** `webhook_url_allowed` resolves DNS at check time, but `httpx` re-resolves the hostname at connect time — attacker-controlled DNS can return a public A record for validation and `10.0.0.1`/`169.254.169.254` for the connect (rebinding). `is_global` handling of IPv4-mapped IPv6 literals (`https://[::ffff:7f00:1]/`, `::ffff:a9fe:a9fe`) is Python-version-dependent and can report global for private/metadata targets. Redirects are correctly unfollowed.
- **Impact:** The A-5 guard still leaves a rebinding window and a mapped-literal edge — the runtime network's internal surface remains reachable by a tenant who controls a domain's DNS.
- **Fix:** Resolve once and connect to the *validated* address with explicit `Host`/SNI pinning (or an allow-listed egress proxy); reject any literal that `ipv4_mapped`/`sixtofour`/`teredo` unwraps to a non-global address; re-validate on every send (already done) and consider caching the validated IP only per-request.

### B-10 — MEDIUM: Channel notification sink accepts an arbitrary chat id — employer-directed spam/leak

- **Location:** `agent/kandoo/packages/codo-core/codo_core/employer.py:313-342`; `agent/kandoo/packages/codo-core/codo_core/notifications.py:123-140`.
- **Attack:** `configure_notifications(mode="channel")` stores any `channel_or_group_id` and immediately sends a confirmation to it through a shared driver. A rented employer can aim the agent at any reachable chat/group — including a channel it does not own — and all subsequent notification text (which can carry employment data) goes there.
- **Impact:** The agent becomes an arbitrary-destination sender for the tenant; notification content can be exfiltrated to a sink the employment never proved ownership of. Unlike the webhook sink, this path has no destination validation at all.
- **Fix:** Restrict channel targets to ids provably bound to this employment (e.g. the employer's own wired account/binding, or a round-trip confirmation code posted to the channel); at minimum require the configured `account_slot` to exist and belong to the employment.

### B-11 — MEDIUM: Static gate remains porous beyond the BoundCtx chain (helpers, aliases, mutations, kw-only params)

- **Location:** `agent/kandoo/packages/codo-core/codo_core/security.py`.
- **Attack / failure:** (a) `check_llm_tool_body` inspects only the tool's own source — a call to a module-level `_helper(ctx)` that performs `unveil`/`send`/DB writes is never scanned (`check_backend_dir` looks only at decorator-bearing signatures, not bodies). (b) `check_backend_dir` misses `posonlyargs`/`kwonlyargs` for AST-01 and decorator aliases (`from codo_core import tool as t` → `@t`). (c) `MUTATION_CALLS={"add","delete","execute"}` misses `commit`, `merge`, `flush`, `bulk_*`, `query(...).update()`, and plain attribute assignment (`emp.fields["x"]=…`); the `PROTECTED_TABLE_HINTS` are lowercase plural table names while code writes `update(Registration)`/`Employment`, so `s.execute(update(Registration))` is not flagged.
- **Impact:** `codo-core check` can still certify tools that mutate protected state, take forbidden params via kw-only position, or launder capabilities through helpers.
- **Fix:** Scan call-graph one hop into same-module helpers for LLM tools; check `posonlyargs`/`args`/`kwonlyargs`; resolve simple import aliases for decorators; broaden mutation detection to writes on ORM objects and any `execute(`/`commit(`/`merge(`/`flush(`/`update(`/`delete(` call regardless of receiver; treat table-name matching case-insensitively on both class and table names.

### B-12 — MEDIUM: Scheduled-job claim has the pre-A-6 race pattern; humanoid nonce minting can collide

- **Location:** `agent/kandoo/packages/codo-core/codo_core/scheduler.py:89-104`; `agent/kandoo/packages/codo-core/codo_core/layer1_fsm.py:207-215,253-267`; `agent/kandoo/packages/codo-core/codo_core/models.py:252`.
- **Attack / failure:** `run_due` SELECTs `status="pending"` due rows then sets `"running"` — two workers double-execute a scheduled SOP (duplicate posts/charges). Separately, `mint_humanoid_nonce` draws blindly from 9000 values; two pending proposals for the same peer can share a nonce, and `claim_nonce`'s `scalar_one_or_none` then either crashes (`MultipleResultsFound` → swallowed → unusable card) or resolves the wrong proposal — the user confirms A and B executes.
- **Impact:** Duplicate scheduled effects under multi-replica deployment; nonce collision breaks WYSIWYS binding (wrong command executed on the user's code).
- **Fix:** Claim scheduled rows with the same conditional-UPDATE pattern as `claim_proposal`. Mint nonces excluding values currently pending for that peer; make `claim_nonce` deterministic on collision (e.g. newest pending proposal wins by explicit `ORDER BY`, or prefer row scoped to the active wizard/slot).

### B-13 — LOW: Fallback menu advertises actions that do not exist; deterministic path bypasses abuse checks

- **Location:** `agent/kandoo/packages/codo-core/codo_core/layer1_fsm.py:112-120`; `agent/kandoo/packages/codo-core/codo_core/engine.py:118-181`.
- **Attack / failure:** When a job declares no principal commands, `menu_for_port` still prints `[📝 ثبت‌نام] [💳 پرداخت] …` while `menu_buttons` returns `None` — labels promise actions with no backing command (A-7's "labels match actions" is only half-fixed). Separately, `_dispatch` runs the deterministic router before `abuse.check_inbound`, so callback/nonce/numeric spam is unbounded (nonce guesses are peer-scoped so this is self-DoS, not theft).
- **Fix:** Only render labels for commands that exist; rate-limit deterministic handlers per peer (they share the FSM row, so a counter there is cheap).

### B-14 — LOW: `get_fsm`/`check_llm_quota`/`db.once` are select-then-insert under unique constraints

- **Location:** `agent/kandoo/packages/codo-core/codo_core/layer1_fsm.py:129-204`; `agent/kandoo/packages/codo-core/codo_core/db.py:93-105`.
- **Failure:** Two concurrent first-touch events for the same `(employment, slot, peer)` both miss the SELECT and both INSERT — one crashes on the `PeerDialogFSM` unique key; `db.once` has the same shape. Harmless under the current single-worker debouncer but a latent IntegrityError source.
- **Fix:** Catch `IntegrityError` and re-select, or use `INSERT … ON CONFLICT`/upsert.

## Disposition

B-1 alone keeps the Round-2 claims false in production: the confirmation and menu callbacks that A-6/A-7 hardened never arrive at the code that handles them. B-2 through B-4 re-open the CIA boundary in ways the previous fixes were believed to close; B-5/B-6 make verified provenance and Layer-3 egress porous. **NO-GO until B-1..B-6 are closed with regression tests that exercise the real `BaleBot.parse_update` wire format and adversarial tool code (introspection, chained attributes, helper indirection) against the static gate.** B-7..B-14 should be addressed before relying on notifications, approvals, or scheduling in multi-tenant rehearsal.

Note: all 74 tests pass at 0.3.1 — every finding above is in code that the current suite does not cover (real driver parsing, chained-attribute evasion, cross-employment routing, or races). That gap is itself part of B-1/B-2/B-4's fix.
