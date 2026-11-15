# V7.0 — Analysis Round 6: Delegated Authority for the Personal Agent (a Paper-Edit Proposal) + Comment Resolutions

> **Input (1):** Organizer's inline **COMMENT**s on [10-analysis-round5.md](10-analysis-round5.md) — six resolutions applied in Part A.
> **Input (2):** Research request — *"the matter is a separate authentication mechanism that a specialist agent's LLM can't access but a personal agent may or may not have access (its master decides)"* — with three example patterns: humanoid-bot principal, delegated private key, tiered certificates. *"We may edit the paper based on it."*
> **Prior Rounds:** [02-analysis.md](02-analysis.md) → [10-analysis-round5.md](10-analysis-round5.md).

---

## Part A — Comment Resolutions Applied

| # | Your comment | Resolution |
|---|---|---|
| 1 | BRAH paper *can* be mentioned; Codo/workshop cannot | Deck cites "the BRAH paper (Baharloo, V6.1)" as a public artifact; no Codo/workshop references |
| 2 | ~50–60 slides too compact; **100–120 slides**, dropped items restored | Revised outline in Part C — all p2 sections restored (compressed ≠ deleted), plus the new chapters |
| 3 | «هارنس» not «مهار» | Loanword «هارنس» throughout; the master/slave register stays elsewhere |
| 4 | Name the protocols | A2A, MCP, AG-UI/A2UI named on-slide in the interop chapter |
| 5 | "much more" demos | Demo chapter expanded to a full demo suite (Part C, Act IV) |
| 6 | Generic examples allowed; advertisement rule relaxed | Real-flavored examples permitted; still no Codo/workshop branding |

---

## Part B — The Delegated-Authority Research (your actual question)

You reframed the button question correctly: the button is a *surface*; the real question is **what credential proves which principal is acting** — a credential the specialist's LLM can never see, that the personal agent may or may not hold, per the master's decision. Here is the full design space as it exists in 2026, then how it maps onto — and extends — the paper.

### B.1 The landscape of mechanisms

| Mechanism | What the agent holds | Scoping | Weakness |
|---|---|---|---|
| **Channel-level principal** (humanoid bot identity) | Its *own* authenticated session (peer_id) — **not** the master's credential | The delegate is simply a different principal; specialist gates by identity, not by "acting-for" | None for the channel — but authority is all-or-nothing at that identity |
| **OAuth2 bearer token** (A2A `securitySchemes`: apiKey, AuthCode+PKCE, ClientCredentials, DeviceCode, OIDC, **mTLS**) | A scoped access token | scopes, expiry | Bearer theft = replayable; no "acting-on-behalf-of" proof |
| **OAuth2 Token Exchange** (RFC 8693, `act` claim) | Exchanged token recording the actor chain | Delegation/impersonation recorded | `act` claim is *informational only* — no enforced attenuation past depth 2; needs the auth server per hop |
| **Attenuating capability chains** — macaroons (HMAC caveats), Biscuit (Datalog), UCAN, and the new IETF agent drafts (Agent Delegation Chain, AATs, AAP delegation.depth, SPT-Txn CAT→CT→TXN) | A signed token the agent can **narrow offline** before passing on | **Monotonic attenuation**: each hop ⊆ parent — scope, arguments, value ceiling, depth, expiry; offline-verifiable | Young standards; macaroons need shared-secret verifiers |
| **Policy-guarded signer** (remote signer / KMS / WebAuthn-bound key / MPC threshold) | **Not the key** — only the right to *request* a signature | Policy engine decides per-request (doc types, amounts, counterparties); key never leaves HSM/device | Infrastructure cost; request channel must be authenticated |
| **Tiered credentials** (your two-certificate idea) | Two keys/certs at different assurance levels | Per-command required tier | Standard and sound — this is NIST AAL1/2/3 and eIDAS low/substantial/high |

### B.2 Your three patterns, judged honestly

**Pattern A — personal agent as humanoid bot pressing the button on the specialist's bot.**
Sound, and already works today with zero new machinery. The personal agent is a *distinct transport principal*: its own `peer_id`, its own authenticated session — Layer 1 binds it like any caller. The specialist's design question becomes "does this command accept delegate principals?" not "can the button be forwarded." This is the baseline pattern and the one to teach first.

**Pattern B — granting your private key to the agent.**
As literally stated, this is the **anti-pattern** — and the honest slide should say so: a copied key destroys non-repudiation (every signature is indistinguishable from yours), leaks irreversibly, and carries zero scoping. **But the intent behind it is right, and the mature forms exist:** the agent should hold a *right-to-request-signature*, not the key — a policy-guarded signer (KMS/remote signer/WebAuthn-bound key, or MPC for the paranoid) where a deterministic policy engine decides what it may sign (contract types, value ceilings, counterparty allowlists). The delegate never holds raw key material — which is precisely your own rule ("sensitive things reach it only as handles") applied to *keys*.

**Pattern C — two certificates by sensitivity.**
Correct and standard — this is **assurance tiering** (NIST 800-63 AAL, eIDAS). Low-risk commands accept the delegate-tier credential; sensitive commands demand the master-tier credential, and the personal agent must *relay* — mint its own request to the master rather than answer itself.

### B.3 The unifying insight for the deck

> **Delegation is not "the agent borrows my identity." It is: the delegate becomes a principal of its own, holding an attenuated credential whose ceiling the master set — and every gate the specialist enforces is a question about the *class* of the principal, not the class of the UI.**

The button, the chat channel, the contract signature — all are the same question wearing different clothes: *which assurance tier does this command require, and does the caller's credential prove it?*

### B.4 Proposed paper edit — "assurance-tiered split authority" (BRAH §6.3 generalizes cleanly)

The paper's current model needs three additions, all conservative extensions:

1. **Delegate principals.** Extend `S = S_user ∪ S_owner` with `S_del` — delegates bound to a master `s*` by an issued, attenuated credential. `Γ` gains two fields: `Γ.cred_tier ∈ {delegate, master}` and `Γ.delegate_of ∈ S ∪ {⊥}`. Effective authority is computed by the reference monitor — `min(own_tier, grant_scope)` — enforcing **monotonic attenuation**: a delegate can never exceed its grant, verified offline via the capability chain (AAT/Agent-Delegation-Chain style byte-commitment; the IETF drafts make this citeable prior art rather than invention).

2. **From binary partition to assurance-indexed partition.** `C_mutate = C_direct ∪ C_confirm` generalizes to a per-command required assurance class:
   - `C^{direct}` — delegate-tier credential suffices (order food: let my agent act);
   - `C^{delegate-confirm}` — confirmation required, delegate-tier may satisfy it (my agent presses);
   - `C^{master-confirm}` — only master-tier satisfies; the delegate's valid move is to *relay* the proposal to its master's channel (specialist emits `input-required`, delegate renders the confirmation to the master on *its* trusted channel — WYSIWYS preserved hop-by-hop).
   The `mode=` declaration gains an optional `assurance=` field; Table 2 gains one static rule: every `confirm` mode declares its minimum principal tier.

3. **New threat paragraph.** Delegated-credential theft is a new attack class — mitigated by the standard toolkit (DPoP sender-binding RFC 9449, short expiry, status-list revocation, and attenuation ensuring a stolen delegate token never exceeds its scope). Also honest: the delegate's own provider becomes a passive observer of master-side data — the personal-assistant threat model rides on the delegate hop.

This is a real contribution beyond the current text: the published literature splits the two threat models; almost nobody specifies how a *delegate principal* satisfies a confirmation gate *without* collapsing it — your three patterns are exactly the three cells of the answer.

---

## Part C — Revised Deck Plan (100–120 slides)

Restoring all compressed p2 material, adding the new chapters and the expanded demo suite:

```
Act I — Foundations (~32)
  Hook · old AI (one model, one task) → neural net → LLM → tokens,
  attention-lite, temperature, reasoning models → chatbot limits →
  tools → agent definition (برده؛ سه دست) → the loop → history/roles,
  reads-from-scratch → failure modes → memory/skills/hooks (all text)
  → cost/context/cache → why agents are expensive → multi-agent
  preview → agent categories today → benchmarks (embedded images,
  p1 habit) → reading a leaderboard

Act II — The macro shift (~16)
  general-purpose vs purpose-built → why platforms existed (secure
  software was hard) → buy-vs-build inversion → PowerPoint→this deck
  (exhibit A) → WordPress→custom site → Hermes→specialist agent →
  dev/run separation → language analogy (checking location, not
  compilation) → AI-familiarity caveat → free-at-build/strict-at-run →
  cost model (front-loaded intelligence)

Act III — هارنس & security (~28)
  the harness (frame around the model, supplies tools, inspects calls)
  → where rules live: prompt-files (injectable) vs harness (enforced)
  → injection anatomy → lethal trifecta → two threat models →
  pillar I availability (menus/FSM/circuit breaker) → pillar II
  integrity (context binding, split authority, WYSIWYS, nonces) →
  pillar III confidentiality (envelopes, handles, unveil-on-wire) →
  "a good model can do this" → cite BRAH paper → permission-level
  dial belongs to the producer

Act IV — Demo suite (~18)
  phone-frame demos: order-direct/cancel-gated · injection attempt
  fails · memory-read round-trip · model-down → menu fallback ·
  producer-dial variants (order needs confirm too / cancel is free)
  · delegate-agent demo (personal agent relays master-confirm) ·
  interactive runnable chat in-slide (p3 mechanism)

Act V — The agent world (~20)
  ear & mouth: four interface states (bot / humanoid / web / A2A) →
  two worlds: specialist vs personal assistant → two threat models
  meet → protocols named: MCP (tools), A2A (agents), AG-UI/A2UI (UI)
  → delegation patterns A/B/C + assurance tiers → KYA/agent identity
  → honest limits

Close (~6)
  the weaver · which jobs move first · what stays human · «مُهر انسان»
```

**≈ 120 slides.**

---

## Open items now

All six comments are resolved. Remaining before production sign-off:

1. Approve/reorder the Part-C outline. **COMMENT**: OK
2. Approve the **paper edit** in B.4 (delegates + assurance tiers + threat paragraph) — flagged for V6.2 of the paper. **COMMENT**: OK. let the paper be another live product living in project root like the presentation, etc
3. Delegate-agent demo (Act IV) is new — confirm it belongs in the suite. **COMMENT**: write the model in the paper but in the deck, mention the delegation as unsolved state of the art concept. in our codo, we dont create a A2A endpoint. if there is a boss agent, the boss contacts the employee agent via chat. the employee knows that boss as master. and the boss talk to the human master(s)

---

### Document Summary

| Document Property | Value |
|---|---|
| **Author** | Devin AI Engineering & Architecture Analysis |
| **Status** | Draft — awaiting organizer approval on outline + paper edit |
| **Inputs** | Comments on [10-analysis-round5.md](10-analysis-round5.md) + delegation research request |
| **Research basis** | A2A v1.0 spec · RFC 8693/9396/9449 · IETF WIMSE agent-delegation drafts · NIST AAL / eIDAS |
| **Path** | `/home/omid/projects/workshop/workshop_docs/versions/V7.0/11-analysis-round6.md` |
