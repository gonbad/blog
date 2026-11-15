# V7.0 — Presentation Review Log: Every Issue Raised Against `presentation/index.html`

> **Scope:** All corrections the user issued while reviewing the root-level agent presentation (`/home/omid/projects/workshop/presentation/index.html`), grouped by round. Each entry records the complaint, the underlying principle, and the resolution that shipped.
> **Recurring meta-rule (raised 3 separate times):** our conversation is between the user and the assistant — **internal discussion artifacts must never appear as slide content**. The audience has not seen this chat.

---

## Round 1 — The برده/ارباب Metaphor & Anatomy

| # | Issue | Resolution |
|---|-------|-----------|
| 1 | **«برده» was used everywhere.** The metaphor was meant for exactly two slides (تشبیه + anatomy animation); the rest of the deck must say «ایجنت». | Swept every occurrence outside the metaphor slides → ایجنت/کاربر/مالک/دستیار/صاحب per context (act names, journey steps, harness diagram, threat models, delegation, closing). |
| 2 | **«تکرار عضو نیست» appeared on a slide.** That correction was operator guidance, not audience content — nobody saw the earlier draft that listed repetition as a member. | Line deleted entirely. |
| 3 | **Anatomy listed 5 members including «اعصاب» as a member.** The nervous system is the *wiring between* مغز and دست‌ها, not a member. | Four members only: گوش، مغز، دست و پا، دهان و زبان. Nervous system described as the connection (MCP · API standard). |
| 4 | **Diagram shape wrong.** Required: a three-spoke / Mercedes-star — ایجنت in the center; ارباب via واسط (گوش/دهان) on one spoke; مغز (LLM) via استانداردِ API on another; ابزارها via سیستمِ عصبی (MCP) on the third. | Rebuilt as `stard` SVG: center hub «ایجنت», three spokes, 8-phase glow cycle narrating ear→brain→hands→mouth. |
| 5 | **Deck needed more motion overall.** | Added: bar-sweep on reveals, injected-token strip with pulsing hostile token, warning pulse on «خیانت فقط یک تزریق فاصله دارد», plus the star/road/phone machinery below. |

*(Slide-26 title overflow was raised then retracted by the user — "I was wrong about full screen issue.")*

## Round 2 — Navigation & Slide-Level Motion

| # | Issue | Resolution |
|---|-------|-----------|
| 6 | No way to see/jump to all slides. | `O` toggles a full-screen overview grid (number, title, act per tile); click jumps; Esc/O/backdrop closes; nav suspended behind overlay; current tile highlighted + scrolled into view. |
| 7 | Slides 29–30 were two static chip lists for the travel journey. | Merged into one animated slide reusing the star diagram (`stard2`/`PH2`): the same agent loop performs train → hotel → payment live; punchline about tool permissions preserved. |
| 8 | Slide 61 only compared *where rules live*, not the deterministic-vs-probabilistic axis. | Rebuilt as a live showdown: same suspicious request hits a «پرامپتِ خوب» guard whose verdict dice-rolls (occasionally allows) vs a هارنس guard that always denies. Punchline: «پرامپتِ خوب شانس می‌آورد؛ کدِ خوب تضمین می‌دهد». |

## Round 3 — Act III Chronology Was Wrong

The user flagged that Act III opened with harness mechanics before ever naming the adversaries, and that slide 65's «دو مدلِ تهدید» carried the wrong concept (assistant-vs-service contexts, not adversaries). Correct opening order for Act III:

1. **First name the two threat models:**
   - **Threat 1 — the runtime LLM/provider itself may be hostile.** Defense ladder: prefer a model the builder developed → else open-weight hosted by the builder or domestically → else API only in friendly countries, never hostile ones. Applies to the **runtime** model, not the development-time model.
   - **Threat 2 — a caller injects malicious text** to make the agent misbehave. Defense: fewer and more precise tools; secrets kept out of the model entirely (intercepted in the harness).
2. **Then the injection mechanism + the XSS analogy:** attacker plants `<script>`, browser executes it; the classic fix was escaping `<`/`>` to `&lt;`/`&gt;` so the code skeleton never forms. In LLM-land instruction and data are one token stream — **no character exists to escape** — so the boundary must live in code, outside the text.
3. **Only then introduce the harness**, then the deterministic-vs-prompt-guard showdown.

**Resolution:** threat block rewritten and moved ahead of «هارنس چیست؟»; the wrong-concept slide deleted.

## Round 4 — Motion for the Mechanism Slides & Structural Cuts

| # | Issue | Resolution |
|---|-------|-----------|
| 9 | Slides 78–80 (split authority, system-built card, post-turn nonce) were static text. | Converted to live phone demos `c7`/`c8`/`c9`: direct vs approval-gated actions; model free-text struck-through/discarded while the system builds the card; nonce drawn only after the model's turn ends, wrong-attempt counter live. |
| 10 | Confidentiality pillar described the vault/handle scheme but never *showed* it. | Demos `c10`/`c11`: inbound raw secret → vault → opaque handle in prompt → tool call → resolve only for authorized destination; outbound tool secret → handle in model history forever, plaintext only on the user's output wire. |
| 11 | Slide 86 (attack/lock table) then the renumbered 86 (BRAH paper mention) should go. | Both deleted. |
| 12 | «پرده‌ی چهارم» (dedicated demo act) added no structural value. | Act IV dissolved; each demo relocated beside its concept — `c1` after the journey star, `c6` merged into the memory-file slide, `c4` after the XSS slide, `c5` after the model-free-path slide, cost-split after circuit-breaker, policy-dial after `c7`, interactive `c3` as Act III's capstone. Act V renumbered to چهار. |

## Round 5 — Conversation Artifacts & Interaction Bug

| # | Issue | Resolution |
|---|-------|-----------|
| 13 | Slide 3's roadmap chip narrated *our restructuring* («نه در یک پرده‌ی جدا»), then a second version mentioned «دموها» — both leaked the editing conversation. | Final: clean four-act list, no meta commentary. **Rule restated: never write our chat into the product.** |
| 14 | Click-anywhere-to-advance made text unselectable. | Click navigation removed entirely (keys + directional swipe only; swipe requires horizontal-dominant gesture so scrolling never flips slides). |

## Round 6 — Roadmap & Interface Slides

| # | Issue | Resolution |
|---|-------|-----------|
| 15 | Slide 3 was a static act list. | Rebuilt as a winding road (جاده‌ی خم‌دار) drawn near→far via masked stroke-dashoffset; stage markers placed *on* the road via `getPointAtLength`; stages ۱,۳ labeled right, ۲,۴ left; glowing traveler dot rides the road on `offset-path`. |
| 16 | Slide 92 (interactive demo) added no value in that spot. | Deleted; its demo moved into slide 95 (official bot — pressable buttons *are* the lesson). |
| 17 | Slides 95/96 needed real interface demos. | 95: interactive workshop-registration bot (رسمی · دکمه‌دار). 96: same task on ایتا's humanoid account (بدونِ دکمه) via numeric wizard + post-turn nonce — same journey on the degraded channel. |
| 18 | Slide 104 asserted «دکمه سفر نمی‌کند» — again a phrase from our research chat. | Replaced with the `dstar` animation: specialist emits typed decision-request over A2A → personal assistant renders its own native button → user signs locally → signed response returns. |

## Round 7 — Identity Semantics & Layout

| # | Issue | Resolution |
|---|-------|-----------|
| 19 | Interface-slide titles overflowed — the phone frame (~715px) pushed the h2 off-screen vertically. | Phone width capped by viewport height: `min(350px,32vw,30vh)`; chat area scrolls inside the frame. |
| 20 | Humanoid slide cited both ایتا and بله. | Only ایتا named — بله runs both official-bot and humanoid surfaces and doesn't belong pinned to one. |
| 21 | **Demos passed `name="علی رضا"` as a tool argument.** Identity must come from execution context, never model/user-supplied text: the harness substitutes `CURRENT_USER` with the authenticated `Γ.peer_id`. | All calls use `user=CURRENT_USER`; `orders.cancel(user=207)` retained deliberately as the *rejected* attack attempt. |
| 22 | The CURRENT_USER→peer_id swap animation was invisible — twice. First a class-name collision (`.tok` already styled the injection token-strip pills, corrupting both), then too subtle (opacity crossfade on a small code line read as static). | Rebuilt as an SVG pipeline: a packet chip travels مدل → هارنس → ابزار along the wires; at the gate the payload visibly swaps `user=CURRENT_USER` (gold) → `user=Γ.peer_id·«۵۵»` (cyan) while the gate glows; verified by headless screenshots at multiple animation phases. |

---

## Round 8 — The Swap Belongs Inside the Frame

| # | Issue | Resolution |
|---|-------|-----------|
| 23 | The `CURRENT_USER → Γ.peer_id` animation was built as a standalone box/diagram *outside* the phone — first in the chips column, then as an SVG pipeline. The user wanted it **inside the chat frame**, in every chat demo that swaps arguments or secrets. | New `.tsw` inline component inside `.bub.t` tool bubbles: the emitted value strikes through (gold→rose) and the resolved value rises in (cyan) on a loop. Applied to `register.direct(user=…)` in `c7`, `c12`, interactive `c3`; and to secrets in `c10`/`c11`: `vault(09123456789→[h_phone_u3b1])`, `resolve([h_phone_u3b1]→0912…)`, `parcel.code()→«TCK-4821→[h_code_9xf2]»`, `unveil([h_code_9xf2]→TCK-4821)`. The model-side `track.enable(num=[h_phone_u3b1])` deliberately stays static — the model only ever holds the handle. The SVG pipeline survives on «هویت از بیرون بسته می‌شود» — a diagram slide with no chat frame, where the diagram is the content. |

## Round 9 — The Ending Was Compressed Past Recognition

| # | Issue | Resolution |
|---|-------|-----------|
| 24 | The whole «پایانی» block (نساجی → closing) had been squeezed from ~12 p2 slides into 6 — and in the squeeze, the thesis **inverted**: slide «چه می‌ماند؟» claimed the rarest/valuable thing is «مُهرِ انسان», when the user had explicitly framed the stamp as **just a middle-term resistance**. In p2, what endures is emotional + collective/relational work («روابط بین افراد»); the stamp's price then falls and the last resistance collapses. | Replaced the entire compressed block with p2's faithful sequence (~25 slides): weaving→factory→soft transition→درسِ نساجی (with مهر flagged as مقاومتِ میان‌مدت from the start)→10/90% transition→which professions→**چه می‌ماند؟ with the punchline «باارزش‌ترین چیز: روابطِ میانِ افراد — نه «مُهر»»**→مُهر as legal barrier→stamp price falls (100→40→10)→collapse of last resistance→scenario-not-certainty→Jevons→opportunities→skill trap→five skills→30-day plan→closing. 135 slides total. |

## Process Lessons

1. **Never leak the chat.** Corrections given to the operator are not audience content — three separate violations (تکرار عضو نیست / پرده‌ی جدا / دکمه سفر نمی‌کند) before the rule stuck.
2. **Metaphors are scoped.** برده/ارباب lives only on its two metaphor slides; the deck's vocabulary elsewhere is ایجنت.
3. **Motion over assertion.** Wherever a claim could be *shown* (guard verdicts, nonce flow, handle swap, decision relay), animate it rather than state it.
4. **Check for CSS class collisions before adding new ones** — `.tok` was already taken; unique, prefixed names (`.swpack`, `.tsw`) prevent silent breakage.
5. **Verify animation phases with headless screenshots + negative `animation-delay`** — `--virtual-time-budget` does not advance CSS animations for captures.
6. **Mechanism demos live inside the simulated surface.** If the slide is a chat, the mechanism (swap, nonce, card) animates inside the phone's bubble stream — a diagram floating beside the frame reads as decoration, not as the mechanism.
7. **Deck internals are IIFE-scoped.** To drive a slide for screenshots, dispatch synthetic `KeyboardEvent`s on `window` with `bubbles:true` — DOM class surgery alone never fires `runDemos`.
8. **Compression can invert a thesis.** Summarizing a long source arc into a few slides lost the «مُهر = مقاومتِ میان‌مدت» framing and crowned it «the most valuable thing» — the opposite of the source. When condensing source material, preserve each beat's *verdict*, not just its topic.
