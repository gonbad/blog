# V7.0 — Analysis Round 4: Consolidating the Strengths List — "Free to Build, Strict at Runtime"

> **Input:** Voice notes in [07-transcription.md](07-transcription.md) (recorded 2026-10-31, three messages — the organizer's own synthesis of our advantages over Hermes).
> **Prior Rounds:** [02-analysis.md](02-analysis.md) · [04-analysis-round2.md](04-analysis-round2.md) · [06-analysis-round3.md](06-analysis-round3.md).
> **Purpose of this round:** the organizer is now *formulating* the strengths catalogue. This analysis validates each formulation, sharpens the two places where precision still matters, and fixes the canonical headline.

---

## Executive Summary

All three formulations in the recording are **correct and internally consistent** with the findings of Rounds 2 and 3. One of them — "enforced by the code that talks to the LLM, outside the prompt" — is actually the single sharpest technical sentence in this entire discussion and deserves to be the load-bearing claim. Two standing qualifications (from Round 3) still apply and are folded into the canonical wording below so the headline stays defensible under expert questioning.

| Your formulation | Status | Precision note |
|---|---|---|
| Dev/run separation: docs → build/install vs. execution with pre-stated rules | ✅ Correct | In Hermes the two are not just blurred — they are *the same loop* (skill-learning happens at runtime), so the boundary cannot be drawn at all |
| Producer specifies what the agent sees (handles), what it does, what it can't — enforced outside the prompt | ✅ Correct — **strongest claim you have** | One sharpening: the dial is not only *in the producer's hands*, it is *finer-grained* than anything Hermes's config surface can express |
| Headline: "free at dev, strict at run; strictness dial belongs to the producer, not to painful configuration" | ✅ Defensible | Keep the Round-3 footnote attached: "free" = free inside deterministic build gates, not constraint-free |

---

## Part 1 — The Dev/Run Separation, As You Stated It

> *"توی مدل ما یه فاز توسعه داریم که متشکل از مستندات و کدزدن و نصب هست، و یه فاز اجرا که قواعدش رو از قبل گفتیم. توی هرمس این تفکیک درست انجام نمیشه — یه چیزی درست می‌کنه که توش هم توسعه میدی هم اجرا می‌کنی."*

Correct — and the detail you added this round matters: **the development phase is document-first.** The phase pipeline (`/start` → `/prd` → `/data-model` → … → `/deploy`) produces auditable specs *before* any execution surface exists, which means there is a physical moment in the lifecycle where security policy can be *reviewed before it can be run*. 

The Hermes contrast is stronger than "تفکیک خوب نیست": in Hermes, development and execution are **the same agent loop**. Skills are authored *by* the agent *at* runtime; memory is curated *during* execution; there is no phase boundary to put a security review on. You cannot draw a line where "building" ends and "serving" begins, which is why you cannot make one side permissive and the other strict — the very separation your model is built on is absent there, not merely done poorly.

---

## Part 2 — "The Producer Draws the Boundary, Outside the Prompt"

> *"تولیدکننده‌ی ایجنت مشخص می‌کنه ایجنت چه اطلاعاتی رو میتونه ببینه (فقط به صورت هندل)، چه کاری رو میتونه انجام بده و چه کاری رو اصلاً نمیتونه — و این کار خارج از ایجنت انجام میشه، توسط کدی که با LLM صحبت می‌کنه."*

This is the most technically precise formulation in your three messages, and it is exactly right. Unpacked:

1. **The boundary has two axes — visibility and authority — and the producer sets both.** In `codo-core`/BRAH terms: envelope policy decides what the planner may *see* (`HandleRef[kind]` — the model holds opaque handles, never plaintext); the `mode` parameter decides what it may *do* (`read` / `direct` / `user_confirm` / `owner_confirm` / `menu_only` — what it absolutely cannot do is simply absent from its toolset).
2. **Enforcement lives outside the prompt.** The policy is not a paragraph the model is asked to respect — it is executable code in the layers *surrounding* the model call (ingress interception, context binding, sink-checked dereferencing). Text inside the prompt can be argued with, injected, or socially engineered; code around the prompt cannot. This is the clean dividing line between *advisory* and *enforced* — and it is the sentence that ends the "can't skills do this?" debate permanently.
3. **"We're effectively building a runtime" — yes, literally.** The participant does not ship a configured assistant; they ship a product that *contains* a small deterministic runtime (the reference monitor) whose policy surface they authored. That is a categorically different deliverable from "a Hermes profile."

### The one sharpening worth adding: the dial's granularity

You said the strictness dial sits with the producer rather than in painful configuration — true. But there is a second, deeper difference worth stating: **the dial itself is finer-grained.**

- In **Codo/BRAH**, strictness is set *per capability and per data kind*: this command executes directly, that command requires user confirmation, that one requires the owner; phone numbers are enveloped, names are not. A two-dimensional, per-action dial declared in code next to the capability it governs.
- In **Hermes**, strictness is *global and behavioral*: `approvals.mode` applies one posture to every command in every context; `tools.deny` switches whole tool classes on or off. Even with unlimited configuration effort, you cannot express "this action yes-direct, that action confirm-gated, this datum sealed" — that dimensionality does not exist in the config surface.

So it is not merely that Hermes's dial is *harder to turn* — **it turns less.** The producer-in-control advantage is therefore twofold: the dial is yours, and it has more notches.

---

## Part 3 — The Headline, Evaluated and Finalized

Your proposed headline:

> *"ما موقع توسعه آزاد هستیم و موقع اجرا سخت‌گیر — هرمس یک رویه‌ی یکسان را در هر دو زمان اعمال می‌کند. و میزان سختگیری دست تولیدکننده‌ی ایجنت است، نه پیکربندی‌های سخت سکو."*

**Defensible — provided the Round-3 footnote travels with it.** "آزاد" means free *over the code, inside deterministic build gates* — a participant who pushes it to "no constraints at all" will hit AST gates and phase gates on day one. With that attached, the headline is not just defensible; it is the crispest possible expression of phase-asymmetric security.

### Canonical versions

**Persian (headline):**
> «آزاد در ساختن، سخت‌گیر در اجرا — و مرز امنیت را سازنده‌ی ایجنت می‌کشد، نه سکو.»

**Persian (expanded, one breath):**
> «در روش ما توسعه و اجرا دو دنیای جدا هستند: هنگام ساختن دستمان باز است، هنگام اجرا سخت‌گیریم — و اینکه این سختگیر بودن چقدر باشد و کجا اعمال شود را خودِ سازنده‌ی ایجنت تعیین می‌کند، نه پیکربندی‌های پیچیده‌ی یک سکوی خارجی.»

**English:**
> *"Free to build, strict at runtime — and the security boundary is drawn by the agent's builder, in code, not negotiated through platform configuration."*

---

## Canonical Strengths Catalogue — Codo vs. Hermes (Final Form)

| # | Strength | The one-line version | Established in |
|---|---|---|---|
| 1 | **Phase separation** | Development (docs → code → install) and execution are two different worlds with a reviewable boundary; Hermes runs one fused loop where they cannot be told apart | Round 3 → this round |
| 2 | **Producer-drawn boundary, outside the prompt** | What the agent sees (handles), does, and cannot do is declared by the builder and enforced by code around the model — not by instructions inside it | This round |
| 3 | **Fine-grained strictness dial** | Per-capability, per-data-kind authority declared next to the capability; Hermes offers one global posture dial with fewer notches | This round |
| 4 | **Context confidentiality by construction** | `I(Prompt; V_secret) = 0` is unreachable in Hermes's planner-as-controller architecture at any configuration cost | Round 3 |
| 5 | **Front-loaded intelligence** | Strong model builds once; cheap model (or none) serves forever; Hermes rents frontier reasoning per turn | Round 3 |
| 6 | **Ownership & determinism** | Vanilla code + auditable docs + gated phases vs. engine-tied skills + stochastic autonomous loop | Rounds 1–2 |

---

### Document Summary

| Document Property | Value |
|---|---|
| **Author** | Devin AI Engineering & Architecture Analysis |
| **Status** | Draft — pending organizer review |
| **Associated Transcript** | [07-transcription.md](07-transcription.md) |
| **Prior Rounds** | [02-analysis.md](02-analysis.md) · [04-analysis-round2.md](04-analysis-round2.md) · [06-analysis-round3.md](06-analysis-round3.md) |
| **Path** | `/home/omid/projects/workshop/workshop_docs/versions/V7.0/08-analysis-round4.md` |
