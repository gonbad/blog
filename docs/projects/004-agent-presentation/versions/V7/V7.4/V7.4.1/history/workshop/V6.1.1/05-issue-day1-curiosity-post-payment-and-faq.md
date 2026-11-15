# V6.1.1 — Issue #5: Day-1 Employee Curiosity, Post-Action/Payment Follow-Through (Group Invite & Plan-Change Notifications), and Initial FAQ / Knowledge Base in `/prd`

> **Source:** organizer, 2026-10-27, V6.1 rehearsal on `/home/omid/projects/event/`.
> **Organizer's words:** «next issue: I think we lack a step: the codo/ should know enough about details. for example in my workshop registration agent, the agent should know about previous workshops, the location, how we notify participants in case of change in plan (they should join a bale group after payment so I can broadcast them), and a FAQ to answer the final users based on it.. it needs curosity in codo/ . is there already a step that does this?»
> **Status:** audited the full pipeline (`prd.md`, `sops.md`, `build.md`, `wire.md`, `01-workflow.md`, `docs/living/prd.md`), added Day-1 Employee Curiosity + Post-Action Follow-Through + Day-1 FAQ/Knowledge Base directly into `/prd` (and wired through `/sops`, `/build`, `/wire`), recompiled `codo.zip` (RTL check clean), synced into `event/`, committed (`920db09`), and pushed.

---

## 1. Diagnosis: Did a Step Already Do This?

**No — it was falling through a gap between `/prd` and `/wire`:**
- `/wire` step 4 said: *"Seed the knowledge base the owner gave (`data-model.md`, `prd.md`, or answers they paste now): one row per answer in `facts` with `scope='knowledge'`"* — assuming `/prd` had already collected the employee's knowledge base and FAQ.
- However, `templates/codo/commands/prd.md` and `templates/codo/docs/living/prd.md` only covered high-level rules (prices, capacity, deadlines), persona/avatar, settings, and the LLM-Zero table. Neither `/prd` nor `/sops` instructed Codo to act with **Day-1 Employee Curiosity** — interviewing the owner like a sharp new hire on Day 1 about:
  1. **Operational logistics & track record** (where/how it's held, exact hours, prerequisites, previous workshops/cohorts/credibility so she can answer hesitant customers).
  2. **Post-action / post-payment follow-through & plan-change notifications** (what happens the moment a customer pays/registers, how they get their ticket/link, and how the owner notifies all participants if the plan, time, or venue changes — e.g. handing paid participants a Bale group invite link right after payment).
  3. **Day-1 Knowledge Base & Customer FAQ (`پایگاه دانشِ روزِ اول و پرسش‌های پرتکرار`)** (the 8–15 concrete questions real customers ask on Day 1 and their approved answers).

### Why `/prd` (Wired Into `/sops` → `/build` → `/wire`) Is the Exact Right Place
Putting this into `/prd` (rather than adding a separate 16th slash command) ensures those facts are discovered **before** `/tools` and `/sops`:
- Discovering in `/prd` that paid participants receive a Bale group invite link for plan-change broadcasts means:
  - `/prd` adds `participants_group_link` and `workshop_location` to **Owner-editable settings (`Job.settings`)** so the owner can update them anytime;
  - `/sops` wires `Job.on_paid` and puts `participants_group_link` into an **outbound envelope (`پاکت خروجی`)** so only paid customers receive the group link;
  - `/build` sets `knowledge=("docs/living/prd.md",)` on `Job` and `/wire` seeds every row of `prd.md`'s FAQ table into `facts` (`scope='knowledge'`).

---

## 2. What Changed

| File | Change |
|---|---|
| `templates/codo/commands/prd.md` | Added `## Day-1 employee curiosity — interview the owner like a sharp new hire`: mandates asking in `02-prd-questions.md` about (1) operational logistics & prerequisites (city/venue vs. online, hours, what to bring), (2) track record & credibility (previous workshops/cohorts, instructor, outcomes), (3) post-action/payment follow-through & plan-change notifications (e.g. post-payment Bale group invite link so the owner can broadcast changes), and (4) drafting 8–15 Day-1 FAQ entries for owner confirmation. Added items 2 & 3 (`Post-action follow-through & customer notifications` and `Day-1 Knowledge Base & FAQ` table) to `What prd.md covers`. |
| `templates/codo/docs/living/prd.md` | Added three concrete Persian sections to the living template:<br>• `## جزئیاتِ کار، پیشینه و قواعدِ کسب‌وکار`<br>• `## پس از انجامِ کار و راهِ خبررسانیِ بعدی`<br>• `## پایگاه دانشِ روزِ اول و پرسش‌های پرتکرار` (`کلید \| پرسشِ مشتری \| پاسخِ دقیقِ کارمند`)<br>and cleaned all headings to pass `rtl_check`. |
| `templates/codo/commands/sops.md` | Part 1 now explicitly pulls post-action / post-payment follow-through from `prd.md` (such as owner approval before payment, or handing out a post-payment Bale group invite link via `Job.on_paid` and an outbound envelope). |
| `templates/codo/commands/build.md` | Wires `knowledge=("docs/living/prd.md",)` on `Job` and includes post-payment delivery from `prd.md` in `on_paid`. |
| `templates/codo/commands/wire.md` | Step 4 explicitly seeds every row of `docs/living/prd.md`'s Day-1 FAQ table into `facts` (`scope='knowledge'`). |
| `templates/codo/docs/constitution/01-workflow.md` | Updated the `/prd` row in the Phases table to include operational details, track record, post-payment follow-through/notifications, and the Day-1 FAQ gate. |
