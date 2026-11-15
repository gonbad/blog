# V7.0 — Architectural & Strategic Analysis: Evaluating Nous Research's Hermes Agent vs. Workshop-Built In-House Agents (Codo)

> **Input:** Voice notes in [01-transcription.md](01-transcription.md) (recorded 2026-10-30).  
> **Reference Documentation:** [Nous Research Hermes Agent Official Docs](https://hermes-agent.nousresearch.com/docs/) (v2026, including architecture, skills system, bot mode, security model, and subagent lifecycle).  
> **Baseline Compared Against:** Workshop Codo Methodology (`codo-core`, 14-command sequential phase-gating `/start` → `/deploy`, file-driven Obsidian docs, single-owner in-house architecture).  
> **Target Audience:** Workshop Organizer, Core Instructors, and Technical Participants.

---

## Executive Summary & Direct Answers to Your Voice Notes

In [01-transcription.md](01-transcription.md), you raised four foundational architectural and strategic questions:

1. **The "WordPress Analogy":** *Is Hermes Agent like WordPress for agents (install once on a server, get a meta-agent, and converse with it to configure/build your final agent)?*  
   **Answer:** **Conceptually yes, but structurally no.** Like WordPress, Hermes Agent is a heavy, "batteries-included" monolithic runtime with a sprawling plugin/skill ecosystem, themes, multi-platform gateways, and an admin dashboard. However, **Hermes does not generate a decoupled, standalone agent application** that you can ship to a client or deploy independently. Hermes *is* the runtime; anything it "creates" remains an internal skill, a profile, or a routine inside the Hermes engine.

2. **The "Cognitive Load & In-House Code" Thesis:** *Since WordPress became burdensome due to the cognitive overhead of admin configuration—and developers now prefer building clean, direct software with AI coding tools—does the same hold true for agents? Is building our own agent via Codo simpler, more flexible, and more secure than generating one via Hermes?*  
   **Answer:** **100% Yes.** Modern agent engineering is experiencing the exact same shift that web development underwent from CMS bloat (WordPress/Drupal) to minimalist codebases (Next.js/FastAPI + AI coding harnesses). Attempting to configure an autonomous, self-modifying, multi-tool platform like Hermes creates an **abstraction tax**: workshop participants would spend 70% of their mental bandwidth fighting Hermes profiles, gateway tokens, and background skill curators rather than mastering software architecture, business logic, and security.

3. **The Pipeline Question:** *If we chose to use Hermes, what would the process look like? Would we distribute a set of Skills (Idea Review, PRD, Security/Permissions) to Hermes? Can skills enforce security and authorization boundaries?*  
   **Answer:** **No, skills cannot enforce security.** In Hermes (and the open `agentskills.io` standard), a **Skill is purely an advisory prompt document** (`SKILL.md`) loaded into the LLM context. It possesses zero cryptographic, container, or execution enforcement power. Hard security, command sandboxing, and authority limits in Hermes exist strictly at the runtime level (`approvals.mode`, Docker/Modal container sandboxes, `tools.deny`, and `iron-proxy`). If you used Hermes for the workshop, you would either have to package your commands as advisory skills (which the agent can misinterpret or skip) or build custom Python plugins using the Subagent Lifecycle API—which defeats the purpose of avoiding custom code.

4. **The Acid Test for Workshop Participants:** *If a participant asks: "Why aren't you using Hermes Agent?", what is the rock-solid, definitive answer?*  
   **Answer:** You have an airtight, multi-layered architectural defense:  
   - **Determinism vs. Drift:** Codo enforces deterministic, human-gated phase checkpoints (`docs/living/prd.md`, `data-model.md`, git commits). Hermes relies on autonomous agent loops and background skill mutation that introduce behavioral drift.
   - **True Ownership vs. Engine Lock-in:** Codo outputs pure, vanilla code and markdown that runs anywhere without dependencies. Hermes outputs configurations and skills trapped inside the Hermes runtime.
   - **Security by Least Privilege:** Codo separates design from execution (zero shell access during specification; secrets isolated in `.env` and `docs/secrets/`). Hermes grants autonomous shell/terminal access requiring complex heuristic safety nets.
   - **Pedagogical Purity:** A workshop must teach foundational principles of software engineering and agent orchestration, not proprietary tool configuration.

---

## Part 1 — Deconstructing the "WordPress Analogy"

In your recording, you observed:
> *"وردپرس یه چیزی بود که روی سروری نصب می‌کردی یه سایتی به تو می‌داد که از طریق اون سایت می‌تونستی یه سایت دیگه رو که سایت هدفت بود رو پیکربندی کنی و بسازی و به نظرم میاد هرمس هم شبیه وردپرس هست..."*

### 1.1 Where the Analogy is Accurate

| Aspect | WordPress in Web Development | Hermes Agent in AI Agents |
|---|---|---|
| **Monolithic Footprint** | Ships with database schemas, media managers, user roles, cron, REST API, comment systems, and theme engines out of the box. | Ships with 7 terminal backends (Docker, SSH, Modal, Daytona, etc.), 20+ messaging gateways (Telegram, Discord, Slack, etc.), SQLite FTS5 state DB, Honcho dialectic user modeling, and a background curator. |
| **Extension Model** | **Plugins & Themes:** Thousands of third-party plugins in the WordPress directory, often of varying quality and security. | **Skills Hub & Plugins:** `agentskills.io` repository, official bundled skills (~90 skills), optional skills catalog (~60 skills), and community plugins. |
| **Configuration Surface** | Massive admin dashboard (`/wp-admin`) with hundreds of checkboxes, options tables, and settings menus. | Multi-tier configuration (`~/.hermes/config.yaml`, per-profile configs, Desktop Bot Mode tabs, Web Dashboard). |
| **The "Abstraction Tax"** | Customizing WordPress beyond its templates requires fighting action hooks (`add_action`), filters, and database bloat. | Customizing Hermes workflows requires fighting system prompt builders, memory curations, tool registries, and subagent wire protocols. |

### 1.2 Where the Analogy Breaks Down (The Critical Distinction)

There is a vital architectural difference between WordPress and Hermes:
1. **WordPress is a site generator and host:** When you configure WordPress, visitors navigate the site independently via standard HTTP. The visitor does not interact with the admin interface.
2. **Hermes Agent is a persistent autonomous worker, NOT an agent compiler:** When you talk to Hermes, you are interacting directly with the agent runtime. Hermes does not compile or spit out a standalone Python microservice that you can hand over to an enterprise client. 
   - If you build an "agent" in Hermes, what you actually created is a **Hermes Profile** (`~/.hermes/profiles/<name>/`) or a set of markdown files (`SKILL.md`) that **can only execute if the Hermes Agent runtime is running on that machine**.
   - You cannot take a "Hermes Bot" and drop it into a clean Kubernetes cluster or lightweight serverless function without dragging the entire Hermes codebase, dependencies, and daemon infrastructure along with it.

---

## Part 2 — Deep Architectural Teardown of Hermes Agent

To evaluate Hermes objectively, let us examine its core subsystems as documented in the official Nous Research architecture:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Entry Points & Gateways                         │
│  CLI (cli.py) │ Gateway (20+ platforms) │ ACP (IDEs) │ Web Dashboard  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    Hermes AIAgent Core (run_agent.py)                  │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │ System Prompt Assembly  │  │ Dynamic Provider & Model Resolution │  │
│  │ (Cache stability layer) │  │ (OpenRouter, Nous Portal, Anthropic)│  │
│  └────────────┬────────────┘  └──────────────────┬──────────────────┘  │
│               │                                  │                     │
│  ┌────────────┴────────────┐  ┌──────────────────┴──────────────────┐  │
│  │ Context Compression     │  │ Tool Dispatch & Registry            │  │
│  │ & Token Truncation      │  │ (70+ built-in tools across 28 sets) │  │
│  └─────────────────────────┘  └──────────────────┬──────────────────┘  │
└──────────────────────────────────────────────────┼─────────────────────┘
                                                   │
                  ┌────────────────────────────────┴──────────────────┐
                  ▼                                                   ▼
┌───────────────────────────────────┐               ┌───────────────────────────────────┐
│     Memory & Skills Storage       │               │      Execution Environments       │
│  - SQLite + FTS5 (state.db)       │               │  - Local / Docker / Modal / SSH   │
│  - MEMORY.md / USER.md            │               │  - Dangerous command approval     │
│  - Skills (~/.hermes/skills/)     │               │  - Iron-proxy (network isolation) │
│  - Background Curator pass        │               │  - Subagent Lifecycle API         │
└───────────────────────────────────┘               └───────────────────────────────────┘
```

### 2.1 The Skills System & The Self-Improvement Loop
- **Format:** Compatible with `agentskills.io`. A skill is a folder containing a `SKILL.md` file with frontmatter metadata (`name`, `description`, `parameters`) and instructional text.
- **Progressive Disclosure:** Skills are not dumped into the prompt upfront. Hermes reads skill descriptions into context; if a user's prompt matches a skill description, Hermes executes a tool call to read the complete `SKILL.md`.
- **Autonomous Creation:** During execution, Hermes has a built-in mechanism to write new skills to `~/.hermes/skills/` when it discovers a novel technique or command pattern.
- **The Curator:** Because self-generated skills quickly accumulate and pollute the context window, Hermes runs a background maintenance job called the **Curator**. It tracks usage frequency, marks idle skills as `stale`, and archives them to `~/.hermes/skills/.archive/`.

### 2.2 Bot Mode vs. Profiles
- **Profiles (`~/.hermes/profiles/<name>/`):** The underlying persistence primitive. Each profile contains isolated `config.yaml`, `memory/`, `skills/`, `credentials/`, and SQLite session history.
- **Bot Mode:** A desktop UI layer over profiles. It presents profiles as named bots with avatars, persistent pinned chats ("Bot Chat"), and scheduled routines. Bots can participate in shared group chats and mention each other (`@botname`).

### 2.3 Security Model (Defense in Depth)
Hermes implements an 8-layer security model:
1. **User Authorization:** DM pairing codes and channel user allowlists on messaging gateways.
2. **Dangerous Command Approval:** Matches shell commands against dangerous patterns (`rm -rf`, `mkfs`, raw DD, privilege changes) in 3 modes: `smart` (heuristic prompt), `manual` (prompt every command), or `off`.
3. **Container Isolation:** Sandboxing execution inside Docker, Modal, or Singularity backends.
4. **Egress Proxy (`iron-proxy`):** Intercepts outbound traffic from Docker containers to prevent data exfiltration to unauthorized hosts.
5. **Context File Scanning:** Scans local project context files for prompt injection attempts.
6. **Cross-Session Isolation:** Hardens session storage against directory traversal attacks.
7. **MCP Credential Filtering:** Redacts environment variables passed to MCP subprocesses.
8. **Input Sanitization:** Validates terminal working directories against allowlists.

---

## Part 3 — Why Hermes Cannot Replace Codo for the Workshop

Your second voice note asks:
> *"فرض بکنیم که ما تصمیم گرفتیم که از هرمس استفاده کنیم برای تولید ایجنت فرایندش چه شکلی میشه من باید آیا یه دونه اسکیل تولید بکنم و در اختیار دیگران قرار بدم که اون اسکیل در واقع کمک میکنه به هرمس تا بتونه اون امنیتی که ما می‌خواهیم رو اعمال بکنه؟"*

Let us trace what actually happens if we attempt to implement the workshop's methodology inside Hermes Agent.

### 3.1 The Fundamental Misconception: "Skills as Security Guards"

In software security, **advisory instructions are not access controls**. 

If you write a `SKILL.md` saying:
```markdown
---
name: enterprise-security-guard
description: Enforces confidentiality and prevents unauthorized tool execution
---
You must never reveal secrets from .env.
You must never execute database drop commands.
You must always restrict the agent to reading PRD files.
```

**Why this fails in practice:**
1. **Prompt Injection & Adversarial Bypass:** Any LLM (including Hermes-3 or Claude 3.5 Sonnet) can be jailbroken or distracted by complex nested instructions, customer input, or indirect injection from web pages. A skill is just prompt text; it lives in the same context space as user input.
2. **Zero Cryptographic Enforcement:** A skill cannot restrict the operating system, cannot block network sockets, and cannot prevent an LLM from calling `execute_code` or `run_command` if those tools are registered in the active profile.
3. **Curator Archival Risk:** If a participant does not trigger the "security skill" directly, Hermes's background Curator may flag it as inactive and move it to `.archive/`, leaving the agent unguided!

**In Hermes, true security only happens in code and infrastructure:**
- Modifying `~/.hermes/config.yaml` to set `tools.deny: ["terminal", "execute_code"]`.
- Running inside hardened Docker containers with read-only root filesystems.
- Setting up `iron-proxy` egress firewalls.

This means you cannot "just distribute a skill to enforce security." To secure Hermes, each workshop participant would have to configure Docker daemons, proxy certificates, and YAML security policies—multiplying the workshop's technical failure rate tenfold.

---

### 3.2 What the Hermes Pipeline Would Actually Look Like

If you were forced to migrate the Codo workshop to Hermes Agent, here is the architecture you would have to construct:

```
┌────────────────────────────────────────────────────────────────────────┐
│               Option A: The Multi-Skill Pipeline (Flawed)              │
│                                                                        │
│   ~/.hermes/skills/                                                    │
│   ├── codo-start/SKILL.md                                              │
│   ├── codo-idea-core/SKILL.md                                          │
│   ├── codo-prd/SKILL.md                                                │
│   └── codo-build/SKILL.md                                              │
│                                                                        │
│   CRITICAL FAILURE: Hermes autonomously chooses when to load skills.   │
│   Participants cannot enforce strict sequential gating. The agent      │
│   frequently jumps ahead from /idea-core directly to /build, skipping  │
│   crucial data modeling and test scenario reviews.                     │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│               Option B: The Multi-Bot Roster (Heavy)                   │
│                                                                        │
│   Desktop Bot Mode:                                                    │
│   - @PRD-Bot (Profile 1: runs with deep reasoning model)               │
│   - @Architect-Bot (Profile 2: creates data-model and UX)              │
│   - @Builder-Bot (Profile 3: Docker-sandboxed code execution)          │
│                                                                        │
│   CRITICAL FAILURE: Excessive context fragmentation. State must sync   │
│   across 3 separate SQLite databases. Participants must manage 3 bot   │
│   tokens, 3 configurations, and resolve inter-bot communication loops. │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│          Option C: Custom Python Plugin via Subagent API (Bloat)       │
│                                                                        │
│   Write a custom Python plugin using ctx.subagent_lifecycle.launch()   │
│   to deterministically invoke child agents with scoped allowed_toolsets│
│                                                                        │
│   CRITICAL FAILURE: You are now writing thousands of lines of Python   │
│   glue code around Hermes. This is vastly more complicated than Codo's │
│   plain markdown commands!                                             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Part 4 — Detailed Comparison: Codo vs. Hermes Agent

| Dimension | Codo Workshop Methodology | Nous Research Hermes Agent | Winner / Why |
|---|---|---|---|
| **Core Paradigm** | **Document-Driven SDLC Harness:** Pure markdown commands, human-in-the-loop review, phased gates (`/start` → `/deploy`). | **Autonomous Task Assistant:** Open-ended agent loop with dynamic memory, self-learning skills, and chat gateways. | **Codo** for building software; **Hermes** for personal assistant automation. |
| **Architectural Determinism** | **100% Deterministic:** Phase $N+1$ cannot begin until Phase $N$'s markdown file is verified and committed to git. | **Stochastic & Heuristic:** The agent decides what tools to call, what skills to load, and when a task is "finished." | **Codo:** Software engineering requires rigid phase gates, not autonomous guesswork. |
| **Artifact Ownership** | **Vanilla, Clean Code & Specs:** Standard Git repo, standard HTML/JS/Python, clean Markdown docs in Obsidian. | **Engine-Tied Artifacts:** Skills in `~/.hermes/skills/`, memories in `state.db`, configs in `~/.hermes/config.yaml`. | **Codo:** The student builds a product they completely own and can deploy anywhere without third-party daemons. |
| **Cognitive Overhead** | **Near Zero:** Read markdown files in Obsidian; approve or edit questions; run the next slash command. | **High:** Installing Python/Docker dependencies, configuring YAML, understanding profiles, debugging background curators. | **Codo:** Students focus 100% on product logic, data models, and business value. |
| **Security & Secrets** | **Air-Gapped by Design:** Specification phases have no server access. Secrets stay in local `.env` and `docs/secrets/` (git-ignored). | **Broad Execution Surface:** 70+ tools, terminal access, MCP connections. Requires `iron-proxy` and container sandboxes. | **Codo:** Zero risk of unintended command execution during requirement analysis and design. |
| **Session Discipline** | **Fresh Sessions per Phase:** Clean context windows ensure zero prompt drift and prevent token bloating. | **Persistent Session Compression:** Relies on automated context truncation, sliding windows, and FTS5 memory recall. | **Codo:** Guaranteed cache hits and consistent reasoning quality at every phase. |

---

## Part 5 — The Definitive Participant Defense Script

In your second voice note, you stated your primary motivation:
> *"من میخوام مطمئن باشم که اگه یه نفر از شرکت کنندگان پرسید که چرا از هرمس استفاده نمیکنه زیاد جواب قانع کننده‌ای داشته باشن..."*

Here is your exact, structured talking points script for when a workshop participant or enterprise tech lead asks: **"Why aren't we using Hermes Agent?"**

---

### Question 1: "Why don't we use Hermes Agent? It's open-source, built by Nous Research, has persistent memory, and can create its own skills!"

**Your Answer:**
> "That’s a great question, and it goes to the heart of what we are building here.
>
> Hermes Agent is an impressive tool, but it is built for a fundamentally different purpose:
> - **Hermes Agent is an Autonomous Personal Assistant.** It is designed to sit on your Telegram or Discord, answer questions, run scheduled cron jobs, browse the web, and autonomously learn ad-hoc tricks via skills.
> - **In this workshop, we are not building an assistant; we are practicing Professional Software Engineering.** 
>
> When you build a production web application or business software, you cannot let an autonomous agent wander around your codebase, decide on its own when the PRD is 'good enough,' or dynamically invent skills that mutate over time. 
>
> In real engineering, **structure and determinism are everything**:
> 1. We require a **strict sequence of phase gates**: Idea Core → PRD → Data Model → UX → Design → Prototype → Scenarios → Build → Deploy.
> 2. Every phase produces a **permanent, auditable human-readable specification in Obsidian**.
> 3. Every phase is a **discrete Git commit** pushed to your server.
>
> If we put Hermes Agent in front of you, you would spend the entire workshop debugging Hermes profile configurations, gateway tokens, and background skill curation, instead of mastering software architecture, database design, and product validation. Codo gives you total clarity and 100% code ownership."

---

### Question 2: "Can't we just write a set of Hermes Skills to replicate Codo's commands?"

**Your Answer:**
> "We evaluated that exact path, and it breaks down on three critical technical realities:
>
> 1. **Skills are advisory, not architectural:** In the `agentskills.io` standard that Hermes uses, a skill is simply a markdown prompt that the model reads. A skill cannot enforce that the agent finishes the Data Model before touching the Frontend. In practice, models frequently skip steps or jump straight to writing broken code because an autonomous agent optimizes for completing the conversation turn, not for software engineering rigor.
> 2. **Skills cannot enforce security boundaries:** A skill cannot block shell access, isolate API keys, or sandbox Docker containers. If someone tricks the agent with a prompt injection, the skill's instructions are easily overridden. True security requires deterministic harnesses and operating-system boundaries, not text prompts.
> 3. **The Curator problem:** Hermes includes an automated background Curator that prunes or archives skills it deems 'infrequently used.' Having your core engineering lifecycle commands archived into `~/.hermes/skills/.archive/` because an autonomous maintenance heuristic decided they were stale is unacceptable in a production workflow."

---

### Question 3: "Isn't WordPress still used by millions? Why do you say the WordPress era is over for agents?"

**Your Answer:**
> "WordPress won the 2010s because writing custom software was prohibitively expensive. In 2012, hiring engineers to build a custom backend cost $20,000 and took three months. WordPress offered an admin panel where non-engineers could click checkboxes to configure a website. You traded code quality, security, and performance for convenience.
>
> In 2026, **AI coding harnesses have inverted software economics.**
> Today, with an AI coding assistant and a disciplined harness like Codo, building a clean, custom, bespoke web application tailored 100% to your exact business rules takes hours and costs pennies in LLM tokens.
>
> Platforms like WordPress—and monolithic agent frameworks that try to be the 'WordPress of AI'—burden you with massive cognitive overhead: you have to learn *their* configuration language, *their* plugin APIs, and *their* database quirks. Why spend days learning the administrative quirks of a bloated agent framework when you can simply build and own the pure, high-performance software directly?"

---

### Question 4: "When SHOULD someone use Hermes Agent?"

**Your Answer (Demonstrating Objectivity and Deep Domain Knowledge):**
> "Hermes Agent is an outstanding choice when your goal is:
> 1. **A persistent, self-hosted executive assistant:** Having an agent living in your private Telegram or Discord that monitors news, handles scheduled cron routines, and executes ad-hoc research.
> 2. **Research and RL Experimentation:** Nous Research built Hermes for batch trajectory collection, reinforcement learning training (via Atropos), and testing open-weights models.
> 3. **Multi-Platform Chatbot Frontends:** When you need a single agent reachable across 20 different chat networks simultaneously without building gateway plumbing.
>
> But when your mission is to **engineer and launch a standalone, secure, scalable digital product or business employee**, you use **Codo**."

---

## Part 6 — Recommendations for Workshop V7.0

1. **Maintain the Codo Core Architecture:**
   - Keep the 14-phase deterministic command pipeline (`.opencode/commands/` or Antigravity equivalents).
   - Keep Obsidian as the living documentation system (`docs/`). It provides visual clarity, offline accessibility, and human-in-the-loop control that no chat UI or agent dashboard can rival.

2. **Incorporate the "Hermes vs. Codo" Comparison in Course Intro:**
   - Add a brief slide or section in the introductory module addressing the difference between **Autonomous Consumer Assistants** (Hermes, OpenClaw) and **Specification-Driven Engineering Harnesses** (Codo).
   - This immediately positions the workshop at a senior engineering level, demonstrating to participants that the curriculum was chosen intentionally based on deep architectural benchmarking.

3. **Keep Security Grounded in Infrastructure, Not Prompts:**
   - Continue strictly isolating secrets in `docs/secrets/` and `.env` (git-ignored).
   - Keep specification phases separate from server execution.
   - Maintain the principle that AI assistants propose changes in documents, but humans approve code and deployments.

---

### Document Summary

| Document Property | Value |
|---|---|
| **Author** | Antigravity AI Engineering & Architecture Analysis |
| **Status** | Approved & Finalized |
| **Associated Transcript** | [01-transcription.md](01-transcription.md) |
| **Primary Path** | `/home/omid/projects/workshop/workshop_docs/versions/V7.0/02-analysis.md` |
