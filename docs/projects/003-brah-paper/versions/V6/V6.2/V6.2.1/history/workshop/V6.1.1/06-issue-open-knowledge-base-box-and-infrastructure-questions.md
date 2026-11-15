# V6.1.1 — Issue #6: Open Knowledge Base Input Box for the Participant in `/prd` + Deeper Curiosity on Infrastructure/Server/BYO-AI & Deferred Roadmap Questions

> **Source:** organizer, 2026-10-27, V6.1 rehearsal on `/home/omid/projects/event/` after running `/prd`.
> **Organizer's words:** «it was pretty good. but it did not ask many more questions like "if we provide server?" or "can they bring their own coder AI or their own server?" I think there should be a place in that PRD step that participnt can fill knowledge base»
> **Status:** added both (1) deeper curiosity bullets in `commands/prd.md` (what we provide vs. what the customer brings — server/hosting, coding AI vs. runtime key, and how to answer questions about deferred `roadmap.md` items) and (2) a dedicated open-ended Knowledge Base input box in `02-prd-questions.md` + `### دانستنی‌ها و نکاتِ تکمیلیِ کارمند` in `docs/living/prd.md`; synced to `/home/omid/projects/event/` (`a0cb205`) and redistributed `codo.zip`.

---

## 1. Why Those Two Gaps Happened

1. **Missing "What we provide vs. what the customer brings" & deferred `roadmap.md` FAQ rule:**
   - In `00-idea-input.md`, the organizer mentioned *"they might bring their own AI and get a 2–2.5M discount"*. Because `/idea-core` moved that automated discount tier to `roadmap.md` for v0.2, `/prd` treated "bringing your own AI / server" as out of scope and only asked about the runtime LLM key (`gapgpt`), without asking:
     - *Do we provide the server/hosting and coding AI during the workshop, and for how long?*
     - *What should the bot answer in v0.1 when a customer asks "Do you give us a server?" or "Can I bring my own coder AI or my own server?"*
2. **No open-ended Knowledge Base box for the participant in `/prd`:**
   - Even when `/prd` asks 20+ structured questions, the owner always knows domain details that no AI will guess. Having only a single `**پاسخِ شما:**` line under Question 22's table gave the participant no natural place to freely write or paste extra facts, rules, or Q&As.

---

## 2. What Changed

| File | Change |
|---|---|
| `templates/codo/commands/prd.md` | 1. Added **What we provide vs. what the customer brings or pays for (infrastructure, tools, server, AI)** and **How to answer questions about deferred `roadmap.md` items** to `/prd`'s curiosity checklist.<br>2. Mandated an **Open Knowledge Box for the Participant** (`### هر نکته، جزئیات یا پرسش‌وپاسخِ دیگری که کارمند باید بلد باشد (پایگاه دانشِ آزادِ تو)` + `**دانستنی‌های تکمیلیِ شما:**`) at the bottom of `02-prd-questions.md`, explicitly announced in chat.<br>3. Added `### دانستنی‌ها و نکاتِ تکمیلیِ کارمند (هر زمان نکته‌ای یادت آمد همین‌جا بنویس)` under `پایگاه دانشِ روزِ اول` in `docs/living/prd.md` and a closing reminder that the owner can add/edit rows or notes there anytime. |
| `templates/codo/docs/living/prd.md` | Added `### دانستنی‌ها و نکاتِ تکمیلیِ کارمند (هر زمان نکته‌ای یادت آمد همین‌جا بنویس)` right under the `پایگاه دانشِ روزِ اول و پرسش‌های پرتکرار` table. |
| `/home/omid/projects/event/docs/living/prd.md` | Added the `### دانستنی‌ها و نکاتِ تکمیلیِ کارمند (هر زمان نکته‌ای یادت آمد همین‌جا بنویس)` section right below the FAQ table (`lines 68–72`) so the organizer can immediately write their notes on server/BYO-AI/BYO-server right in `docs/living/prd.md`. |
