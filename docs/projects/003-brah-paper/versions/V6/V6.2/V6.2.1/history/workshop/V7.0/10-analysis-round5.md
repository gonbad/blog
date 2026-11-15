# V7.0 — Analysis Round 5: Pre-Production Analysis for the New "Agents" Presentation

> **Input:** Voice notes in [09-transcription.md](09-transcription.md) (recorded 2026-10-31, nine messages — instructions for the new presentation product).
> **Source material reviewed:** [presentation1/](presentation1/) (deck + assets), [presentation2.html](presentation2.html) (the primary structural model), [presentation3/index.html](presentation3/index.html) ("ویستا" super-app deck — source of the interactive-chat idea).
> **Deliverable of this round:** analysis only — the exact content decisions, terminology answers, the A2A/delegation research you asked for, the deletion list, and the proposed structure. Per your instruction: *no `presentation/` folder is created until you approve.*
> **Standing constraints from the recording:** general audience; about *agents*, not Codo and not the workshop; built from scratch (p2 is the structural base, not a file to edit); images embedded inline like p1 (not links like p2); master/slave («ارباب/برده») literary register.

---

## 0. What the three source decks contribute

| Source | Role in the new deck |
|---|---|
| **presentation2.html** | Structural base. ~80 slides: AI history → neural nets → LLM → tools → agent anatomy ("سه دست") → loop → memory/skills/hooks (all text) → cost → multi-agent → benchmarks → demos → security (two threat models, injection, lethal trifecta, guard model, permission levels, "unsolved") → weaver/industrial-revolution close |
| **presentation1/** | Import the *habit*, not the arc: benchmark images **embedded as assets** (`arena-code.png`, `aa-index.png`) — fix p2's link-only weakness. Its "فرمانده و سرباز" anatomy is superseded by your ارباب/برده register |
| **presentation3/** | Import the *mechanism*: in-slide interactive chat + phone-frame demos. Conceptually it also supports the A2A chapter (its "کاربر می‌گوید چه می‌خواهد، قرارداد می‌آید" is exactly the specialist-agent world) |

---

## 1. Terminology answer — what is the "one-size-fits-all" software called?

Your instinct «عام‌منظوره → خاص‌منظوره» is already the correct standard vocabulary. The established English pairs:

| Pole | Standard terms |
|---|---|
| The platform you configure | **general-purpose software**, *general-purpose platform*, *off-the-shelf / COTS* (procurement), *one-size-fits-all* (informal), *horizontal software* |
| The thing you build for yourself | **purpose-built / special-purpose software**, *bespoke software*, *custom software* |
| The decision being inverted | the classic **buy-vs-build** tradeoff — historically "buy/configure" won because building well was expensive; AI generation inverts it |

Recommended Persian for the deck: «نرم‌افزار عام‌منظوره» (WordPress, PowerPoint, Hermes) vs «سامانه‌ی خاص‌منظوره» (the AI-generated site/agent/presentation built exactly to need). Your own example is perfect and self-demonstrating: *this very deck is purpose-built HTML — no PowerPoint was configured to make it.*

---

## 2. Where "harness" goes — three placements, one definition

**Definition to teach (one line):** the harness is the deterministic code *around* the model — it runs the loop, hands the model its tools, and inspects everything the model tries to do. In the ارباب/برده register: the agent is the برده; the harness is the **مهار** — the reins the master holds. (Etymology gift: English "harness" literally means horse's straps — the metaphor is native.)

| Placement | Where | Why |
|---|---|---|
| **First contact — anatomy** | Immediately after the agent loop / «سه دست» definition | The loop needs an answer to "who drives it? who supplies the tools?" — that answer is the harness. Introduce it here as a *named component*, one or two slides, no security weight yet |
| **Load-bearing — security chapter** | The "where do rules live?" section | Prompt/skill-file rules = *inside the prompt* → injectable; harness = *outside the prompt* → enforceable. This is exactly your نقطة: rules the producer applies in files can be overridden at runtime; rules applied by limiting the toolset cannot. Your word choice was correct — it **is** the harness; the only refinement is that harness is the whole frame, and *tool-scoping* is the enforcement mechanism it provides |
| **Payoff — dev/run chapter** | The separation section | The harness is the *physical artifact* the separation produces: built freely at dev time, enforcing strictly at runtime. This ties the two changes into one object |

So harness is introduced early as vocabulary, exercised in security as mechanism, and resolved in dev/run as the thing that makes the separation real.

---

## 3. Where dev/run separation goes — **after** the general→specific transition, and why

You asked whether it precedes or follows the transition arc. **After.** The ordering logic:

1. The transition arc answers *"why generate bespoke software at all?"* — macro economics (configuring platforms vs generating systems).
2. Dev/run answers *"how must the generated agent be built so its runtime is cheap and safe?"* — a design principle *inside* the bespoke choice. It cannot land before the audience accepts that we're building software now.
3. It is also the bridge into security: "free hands at dev, strict at runtime" sets up "and where do the runtime rules live? → the harness" → BRAH.

**Precision fix needed for your language analogy** (before a technical listener spots it): Python *does* compile to bytecode — the real axis is not "separates compile from run" but **"where checking happens"**: statically-typed languages pay verification cost at build time so runtime is faster and bugs are fewer; dynamic languages defer checks to runtime so development is lighter. That maps *exactly* onto agents: prompt-file rules are the "dynamic typing" of agent security (discovered at runtime, by the attacker too); harness gates are the "static typing" (checked at build, enforced always). And your counterpoint stands and should be kept — it is the honest slide: *AI's familiarity with a language partially offsets this, which is why Python still wins for AI-written code; but in the agent-architecture question both options are equally new to the model, so the separated design wins on cost and security.* Keep the analogy — just frame it as "where the checking lives," not "compiled vs interpreted."

---

## 4. The BRAH content for a general audience

Translate the three pillars to one sentence each, no paper mention required:

- **Availability:** the model going down must never mean the service goes down — every customer action also exists as a deterministic path (menus, numbered wizards, API) that needs no model at all.
- **Integrity (authority):** the agent's producer decides per action what the agent may do directly and what must come back to a human as a confirmation — and the model can never address another customer or mutate another record, because it never holds identity parameters.
- **Confidentiality:** sensitive values are captured *before* the prompt is built and travel as opaque handles — the model sees `[h_phone_…]`, never the number; secrets minted for the user are unveiled only on the wire to that user.

Framing per your instruction: "a good architecture can enforce these at runtime without constraining development" — no Codo/workshop reference in the deck (you may say it live).

---

## 5. The demo specification

Combine p3's mechanism with your msg-8 spec:

- **The frame:** a phone mockup embedded in the slide; narration about the producer's dial lives *outside* the frame.
- **The interactive chat inside the frame:** an in-slide runnable chat (borrowing p3's component approach) — user writes «برام غذا سفارش بگیر» → agent executes silently through several memory-read round-trips, no buttons → user asks to cancel → agent sends a **«لغو سفارش» button** → the *user* presses it.
- **The teaching beat outside the frame:** the producer chose *order = direct, cancel = confirmation*. A different producer flips either bit. The dial is the producer's — that is the flexibility that must survive into runtime.
- Optionally a second demo beat: injection attempt inside the same chat → the constrained agent cannot execute it (the toolset simply lacks the capability).

---

## 6. Interfaces — "the ear and the mouth of the slave"

Your four states map cleanly onto a typology that already exists in our model (BRAH's port classes — a nice structural coincidence worth exploiting silently):

| Interface state («واسط صحبت ارباب با برده») | Port class | Notes |
|---|---|---|
| Official messenger bot (بله bot, Telegram bot) | **Bot port** — structured buttons, verified contacts, callbacks | Richest interaction surface |
| Humanoid personal-account bot (ربات انسان‌نما در ایتا) | **Personal-account port** — text-only, numbered wizards | No buttons → nonce confirmations |
| Website with embedded chat | **API port** — structured | Programmatic + human |
| Agent-to-agent protocol (A2A) | **API port, machine caller** | The caller is itself an agent — leads into the next chapter |

---

## 7. The A2A chapter — research results and corrections to your model

You flagged a knowledge gap and asked me to research. Your model is **fundamentally right**; here is the refined version plus the answer to the button question.

### 7.1 The two worlds — correct, with a sharpening you will like

Your split — specialist agents («ایجنت متخصص»: salesperson, accountant, registrar, reporter — employed by businesses, facing the public) vs. personal assistant («ایجنت شخصی»: knows me, holds my memory and data) — matches the industry direction. The sharpening:

> **The two worlds are the two threat models from the paper.** The specialist agent lives in the *public-service* threat model: anonymous untrusted callers, secrets must never reach the model, availability is a business requirement — that is BRAH's world. The personal assistant lives in the *personal-assistant* threat model: one trusted owner, untrusted third-party data — that is CaMeL/FIDES's world. Two worlds, two security architectures — and the A2A boundary is exactly where they meet.

One caution to add: **trust runs both ways.** The specialist can't trust the caller — but the personal agent can't trust the specialist's replies either (indirect injection is inbound for *its* planner). The personal agent should treat specialist output as untrusted data, and should hand over my personal info as *scoped disclosures* (verified contacts, handles), not plaintext dumps.

### 7.2 The protocol layer — what exists today

| Layer | Protocol | Job |
|---|---|---|
| Agent ↔ tools/data | **MCP** | Standard tool connection (vertical) |
| Agent ↔ agent | **A2A** (Google → Linux Foundation) | Discovery via `AgentCard` at `/.well-known/agent-card.json`; work units called **Tasks** with lifecycle states including `input-required`; content in typed Parts (text / structured `data` / file) |
| Agent ↔ your app | **AG-UI** | Event channel between agent backend and your frontend |
| UI *payload* | **A2UI** (Google) / MCP Apps | Agent emits declarative UI blueprints (cards, **buttons**, forms) *as data*; the host renders them natively |

For a general audience, teach the concept not the acronyms — but the mechanism below is now standard-shaped, not speculative.

### 7.3 Your question: how does a "button" travel specialist → personal agent → master?

**The button is never forwarded. Buttons are UI; what travels between agents is a *typed request for a decision*, rendered natively at each hop.** Concretely:

```
Specialist agent                    Personal agent                    Master (you)
───────────────                     ────────────────                  ────────────
Cancel needs confirmation  ──A2A──▶  Task → "input-required"    ──▶   Renders its OWN
(proposal Π stored,               + DataPart{action, price,        native button on
deterministic card)                  id}  (no buttons in A2A)      YOUR channel
                                        │                              │
        who is the principal here? ──────┴── two policies ─────────────┘
        (a) Delegated: personal agent holds a scoped credential
            from you ("confirm cancels under X") → answers the
            input-required itself, inside the same A2A task.
        (b) Relayed: no delegation → personal agent mints its own
            confirmation control for YOU → you press → decision
            returns through the same taskId → specialist executes.
```

Key points:

- **A2A has no button primitive** — `input-required` + structured `data` is the confirmation-request. The *receiver* decides how to render it. This preserves BRAH's WYSIWYS at every hop: each principal signs only what its own trusted channel shows — a button that crossed agent boundaries would carry the foreign agent's framing, which is exactly the phishing hole turn-preemption exists to close.
- **Auto-pressing requires delegation as a real credential**, not politeness. From the specialist's side, the confirming principal is *your personal agent* — a distinct identity. If you haven't issued it scoped authority (an attenuated token: "may confirm cancellations, amount ≤ X, service = registrar"), its confirmation isn't yours — a personal agent that presses buttons it was never granted is just the confused deputy wearing your face.
- **The messenger-mediated fallback you described works** (two humanoid bots chatting in Eitaa) but degrades: no structured decision-requests (buttons become "reply 9" — the very attack post-turn nonces solve), token cost per hop, both agents must share a messenger namespace. A2A is better precisely because it carries *typed* state, not just text.

This is the model to put in the deck: **two worlds, one typed boundary, decisions rendered locally at each hop, delegation as explicit scoped authority.**

---

## 8. Deletion/compression list for p2 (as requested — before anything is dropped)

| p2 section | Recommendation | Reason |
|---|---|---|
| Backprop / neural-net internals, attention, temperature | **Compress to 3–4 slides** | Keep "old AI = one model one task" and "LLM = next-word guesser"; internals don't serve the agent arc |
| Token pricing / context window / cache | **Keep, tighten** | Feeds the cheap-model-at-runtime argument later — the cost slide is load-bearing |
| "مدل‌های استدلالگر" | Keep 1 slide | Needed so "cheap model" vs "reasoning model" is legible |
| Programmer / devops agent walk-throughs | **Compress to 1–2 slides** | Partially replaced by your new phone demos |
| Benchmarks / two leaderboards | **Compress to 1–2 slides, embed images from p1 assets** | The p1 fix you asked for |
| "جنگ آینده بر سر MCP" (p1 heritage) | Drop | Superseded by the A2A chapter |
| Security chapter (two threat models, injection, lethal trifecta, guard model, permission levels) | **Keep all — it is the spine** | Harness + BRAH extend it, don't replace it; "هنوز حل نشده" becomes "this is how it gets solved" |
| Weaver / industrial-revolution close | **Keep** | Strong ending; now it also rhymes with the general→specific transition |

---

## 9. Proposed structure for the new deck (for your approval)

```
Act I — What is this thing?
 1. Hook (p1's «یک جمله به ایجنتت بگو» or equivalent)
 2. Old AI: one model, one task → LLM: next-word guesser (compressed)
 3. Tools → the agent (برده) definition → the loop — ALL TEXT FILES beat
 4. THE HARNESS — first contact: the frame around the model (مهار)
 5. Cost & context (why cheap-model thinking matters later)

Act II — The macro shift
 6. General-purpose → purpose-built (WordPress/PowerPoint/Hermes →
    AI-generated site/agent/deck — the deck itself as exhibit A)
 7. Dev-time vs run-time separation (language analogy, AI-familiarity
    caveat, "free hands at build / strict at run")
 8. Where rules live: prompt-files (injectable) vs harness (enforced)

Act III — Security that doesn't cost development
 9. Two threat models → injection, lethal trifecta (from p2)
10. The three pillars: availability / integrity / confidentiality
    (BRAH content, no paper mention) **COMMENT**: you can mention the BRAH paper but dont mention codo or workshop
11. DEMOS: phone frame + live interactive chat — order direct,
    cancel via button; producer's dial; injection attempt fails

Act IV — The world of agents
12. The ear and the mouth: interface states (bot, humanoid, web, A2A)
13. Two worlds: specialist agents vs personal assistants —
    two threat models, one typed boundary; the button-forwarding model
14. Close: the weaver / what remains human
```

Net: ~50–60 slides, leaner than p2, every new element you requested has a fixed home. **COMMENT**: it's too compact. there should be around 100-120 slides. you dropped many items.

---

## 10. Open items for your approval before production

1. Structure in §9 — approve or reorder.
2. The «مهار» rendering of harness inside the ارباب/برده register — approve or prefer keeping «هارنس» as a loanword. **COMMENT**: هارنس
3. A2A depth: concept-only (recommended for general audience) or name the protocols (A2A/MCP/A2UI) on-slide?  **COMMENT**: name the protocol
4. Demo scope: one interactive chat or two (second = injection attempt)? **COMMENT**: I think there should be much more!!
5. Whether the registrar/workshop example may appear as a *generic* example (no workshop advertisement, per your rule). **COMMENT**: yes, they can be. the no workshop advertisement rule is not so strict.

---

### Document Summary

| Document Property | Value |
|---|---|
| **Author** | Devin AI Engineering & Architecture Analysis |
| **Status** | Draft — **awaiting organizer approval before any `presentation/` folder is created** |
| **Associated Transcript** | [09-transcription.md](09-transcription.md) |
| **Sources reviewed** | [presentation1/](presentation1/) · [presentation2.html](presentation2.html) · [presentation3/index.html](presentation3/index.html) |
| **Path** | `/home/omid/projects/workshop/workshop_docs/versions/V7.0/10-analysis-round5.md` |
