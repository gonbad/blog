# V7.0 — Analysis Round 3: The Configuration Ceiling, the Cost-Separation Weakness, and the One-Sentence Verdict

> **Input:** Voice notes in [05-transcription.md](05-transcription.md) (recorded 2026-10-31, three messages).
> **Prior Rounds:** [02-analysis.md](02-analysis.md) (Hermes vs. Codo teardown) · [04-analysis-round2.md](04-analysis-round2.md) (the trilemma, BRAH paper review, phase-asymmetric security).
> **Requested deliverable:** honest verdicts on two claims, a one-sentence answer, and a Persian passage (≤ 2 paragraphs) inside an English document.

---

## Executive Summary

| # | Claim | Verdict |
|---|---|---|
| 1 | Implementing our dev-free/runtime-strict security model with Codo is *easier* than reaching it through Hermes configuration — the same way AI-written custom sites are easier than WordPress + plugins. | **Correct — and stronger than stated:** for the confidentiality half of the model, Hermes's configuration space does not contain the target state *at all*. It is not a hard configuration; it is an absent one. |
| 2 | Hermes lacks a real development-vs-execution split, so "strong AI at build time, cheap AI at runtime" is a genuine weakness. | **Real — and architectural, not configurational.** Hermes *can* point different profiles at different models; what it cannot do is shrink what the runtime model must be capable of. Details below. |

---

## Part 1 — "Config vs. Code": Why the Claim Is Stronger Than Stated

Your formulation:

> *"اگه توی هرمس بخواهیم مدل امنیتی 'دست باز هنگام توسعه، رویه‌ی سخت هنگام اجرا' رو داشته باشیم، به‌طور عادی ممکن نیست مگر با پیکربندی‌های پیچیده — و پیاده‌سازی همون مدل با چیزی شبیه کدو راحت‌تره."*

Honest refinement: for one half of the security model, "راحت‌تر" is the right word; for the other half, the right word is "ممکن / ناممکن."

### The two halves of the target security model

**Half A — strict behavior control at runtime** (what the agent may *do*): reachable in Hermes, painfully. You would layer `approvals.mode = manual`, `tools.deny` lists, Docker/Modal sandboxing, `iron-proxy` egress filtering, and profile isolation — a multi-day configuration project per participant, with correctness surfacing only as *runtime behavior* rather than build-time errors. This is the WordPress-plugin horn exactly: possible, unpleasant, and the fight is against the framework's own assumptions.

**Half B — context confidentiality** (what the model may *see*): **not reachable at all.** The BRAH invariant `I(Prompt; V_secret) = 0` requires a mediation layer that intercepts secrets *before prompt construction*. Hermes's architecture is planner-as-controller: every ingress event, file read, and tool result is assembled into the model's context by design — that is what makes it a good assistant. There is no configuration key for "seal this value before the model sees it," because sealing happens *upstream of the planner*, and in Hermes the planner is the hub, not a leaf. Skills cannot do it (advisory prompt text — Round 2). `tools.deny` cannot do it (it gates actions, not visibility). MCP credential filtering redacts env vars to *subprocesses*, not data flowing through the model itself. To get Half B you would not configure Hermes — you would **fork it and re-plumb its context pipeline**, which is strictly more work than building the thing correctly from the start.

So the precise statement for the workshop:

> **WordPress = hard customization. Hermes = hard customization for behavior, *impossible* customization for context-confidentiality — the property we actually need. Codo = the property is the default, because we write the product and BRAH's mediation lives in the product's runtime, not in a babysitter wrapped around it.**

One honest caveat to keep the analogy clean: the comparison is not perfectly symmetric. A WordPress plugin *is* arbitrary code inside WP's runtime — the ceiling there is effort. A Hermes skill/config is *not* arbitrary code in the context path — the ceiling there is architecture. So the analogy "WordPress : plugin :: Hermes : config" understates your case; your real position is even stronger.

---

## Part 2 — The Cost-Separation Weakness Is Real

Your claim:

> *"موقع توسعه از یک هوش مصنوعی قوی استفاده می‌کنم اما موقع اجرا از یک ارزون‌قیمت — هرمس چون تفکیک توسعه و اجرا نداره این ضعف رو داره. آیا واقعا هست؟"*

**Yes, it is real — and it is worth stating precisely, because the naive version ("Hermes can't run a cheap model") is false and a sharp participant will catch it.**

Hermes *does* support per-profile provider/model configuration — you can point a profile at a small model today. The weakness is not the absence of a setting; it is that **the runtime task does not shrink**:

- **In the Codo/BRAH model**, the runtime planner's job is deliberately tiny: map natural language onto a pre-declared, finite command set, fill parameters, draft text. That is small-model work. And when even that fails, the port-FSM menus carry the entire service deterministically — a weak planner degrades *gracefully*, never catastrophically. Meanwhile the expensive reasoning already happened once, at build time, when a frontier model helped author the command set, the policy, and the code. **Codo front-loads intelligence; the amortized cost is paid once.**
- **In Hermes**, the runtime workload is unbounded by design: arbitrary user requests → arbitrary tool chains, memory curation, skill synthesis, multi-gateway routing. A cheap model in that seat is not a cost saving; it is a reliability risk with **no deterministic floor beneath it** — there is no menu-only fallback, because the model *is* the fallback. And because skill-learning and task-execution share a single agent loop, "development" and "execution" are not phases Hermes can separate; they are the same loop running continuously. Expensive reasoning is not amortized — it is **rented, per turn, forever**.

The clean formulation:

> **Codo separates intelligence by phase: strong model builds the system once, cheap model (or no model) serves it forever. Hermes fuses them: the model strong enough to build your routines must stay on the payroll to run them.**

This is not a minor pricing detail — for a commercial deployment it is the difference between a fixed engineering cost and a perpetual per-conversation dependency on frontier-model pricing and availability (which ties straight back to BRAH's availability invariant: LLM-Zero Completeness exists precisely because the model cannot be assumed present).

---

## Part 3 — The One-Sentence Verdict

> **For this workshop: Codo — not because Hermes is a weak tool, but because the workshop teaches participants to *build and own* secure software, and that is the one thing Hermes is architecturally unable to be.**

---

## Part 4 — The Persian Passage

*(As requested: fluent, literary, uncomplicated — suitable to show participants directly.)*

استفاده یا استفاده‌نکردن از هرمس، مسئله‌ی خوب یا بد بودن آن ابزار نیست؛ مسئله‌ی این است که ما در این کارگاه چه می‌سازیم. هرمس یک دستیار خودگردان است: برای این ساخته شده که بیدار بماند، خودش تصمیم بگیرد و خودش کار را پیش ببرد. در چنین معماری‌ای همه‌چیز از متن مدل می‌گذرد؛ هر داده‌ی حساسی که به سیستم برسد ناگزیر به چشم مدل هم می‌رسد، و امنیتش به‌جای سازوکاری قطعی، بر حدس و الگو تکیه دارد. ما اما در این کارگاه دستیار نمی‌سازیم؛ نرم‌افزار مهندسی می‌کنیم.

در روش ما، توسعه و اجرا دو دنیای جدا هستند. هنگام ساختن، دستمان کاملاً باز است و از توان هوش مصنوعی تا آخر بهره می‌بریم؛ اما هنگام اجرا، مدل فقط یک مشاور بی‌صلاحیت است: نه هویت کاربران را می‌شناسد، نه رازها را می‌بیند و نه می‌تواند بدون تأیید قطعی انسان کاری حساس انجام دهد. به همین دلیل محصول نهایی تماماً مال خودمان است — امن، قابل حسابرسی و مستقل از هر سکو. تفاوت ما و هرمس، تفاوت میان «استفاده از یک ابزار هوشمند» و «مهندسی‌کردن یک محصول» است؛ و این کارگاه برای دومی است.

---

## Where the Three Rounds Now Stand

- **Round 1 ([02-analysis.md](02-analysis.md)):** Hermes is structurally an autonomous assistant, not an agent compiler; skills are advisory, phase-gating cannot be enforced.
- **Round 2 ([04-analysis-round2.md](04-analysis-round2.md)):** The trilemma is a conservation law of specification cost; BRAH gives Codo phase-asymmetric security (free dev, sealed runtime) that Hermes's uniform heuristics cannot express.
- **Round 3 (this document):** The customization ceiling is not merely expensive but *absent* for context-confidentiality; the dev/run cost split is real because runtime task-complexity collapses under BRAH but not under Hermes. **Verdict delivered; Persian passage ready for participant-facing use.**

---

### Document Summary

| Document Property | Value |
|---|---|
| **Author** | Devin AI Engineering & Architecture Analysis |
| **Status** | Draft — pending organizer review |
| **Associated Transcript** | [05-transcription.md](05-transcription.md) |
| **Prior Rounds** | [02-analysis.md](02-analysis.md) · [04-analysis-round2.md](04-analysis-round2.md) |
| **Path** | `/home/omid/projects/workshop/workshop_docs/versions/V7.0/06-analysis-round3.md` |
