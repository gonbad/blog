# V7.1 — Analysis Round 2: Resolving Organizer Comments
## The Thursday Ingress Lock, Cloudflare Fallback, Docker-Free RAG, the True Agent Pipeline (/tools & /sops), Obsidian, and the «به واقع» Law

> **Input:** Organizer's inline **COMMENT**s on [02-analysis.md](02-analysis.md) + directions in Round 2 prompt (recorded 2026-11-01).  
> **Prior Document:** [02-analysis.md](02-analysis.md) (The Core V7.1 Architectural Teardown).  
> **Status:** Finalized Resolutions & Execution Blueprint.  
> **Deliverable Path:** `/home/omid/projects/workshop/workshop_docs/versions/V7.1/03-analysis-round2.md`.

---

## 1. Resolution Matrix: The 6 Comments & Directives

| # | Organizer Comment / Directive | Resolution & Concrete Decision |
|---|---|---|
| **1** | *"let's do option A because they do it until the last of /start in day 1 (Thursday) and start with /idea-core in day 2 (Friday)..."* | **Option A locked as standard:** Server SSH, DNS (`nip.io`), Caddy HTTPS, and reverse tunnel run on **Thursday (Day 1, 14:00+)**. Friday morning (Day 2, 07:30+) starts with zero devops friction directly at `/idea-core`. |
| **2** | *"it's good to have a fallback (cloudflare)"* | **Cloudflare Tunnel integrated:** If local firewall or VPS SSH reverse port binding fails, `/start` provides a 1-click `cloudflared tunnel --url http://localhost:8000` fallback URL. |
| **3** | *"what about RAG?"* | **In-Process, Docker-Free RAG:** Use `sqlite-vec` (native SQLite vector extension via `pip install sqlite-vec`) or persistent `lancedb` / in-memory cosine similarity. 100% Windows-native, single-file DB, zero external services. |
| **4** | *"why you skipped /tools, /sops, etc? did you merge them in /capabilities?"* | **Agent Pipeline Restored:** Agents have `/tools` and `/sops`! `/capabilities` does not replace them; `capabilities.md` is the security synthesis generated from `/tools` and `/sops`. The full 14-command agent sequence is formalized below. |
| **5** | *"we still need Obsidian. we should tell them to install it and open the docs/ subfolder of codo/ with Obsidian."* | **Obsidian Vault Rule:** Instructed in Book Ch 2/3 and `/start`. Critical specification: open **`codo/docs/`** as the Obsidian Vault (not the repo root), keeping Obsidian clean of code, `.venv`, and node modules. |
| **6** | *"dont forget the به واقع rule"* | **The «به واقع» RTL Invariant:** Every line, bullet, or heading in the Persian Book starting with a Latin/English token must be prefixed with `به واقع ` to prevent bidirectional RTL/LTR layout flipping in PDF compilation. |
| **7** | *"there would be no separate git/github configuration"* (for `event`) | **Rehearsal Dogfooding Mode:** When running Codo inside the internal `event/` folder, `/start` detects that it is already inside a tracked git workspace and bypasses repo re-initialization. |
| **8** | *"2. yes"* (Repository Reorganization Approval) | Approved to restructure workspace into `workshops/{public-agent, private-agent, public-web, private-web}`. |

---

## 2. Ingress & Schedule: Why Option A Fits the Workshop Format

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          THE TWO-DAY WORKSHOP SCHEDULE                                 │
└────────────────────────────────────────────────────────────────────────────────────────┘

  DAY 1 — THURSDAY (14:00 → 19:00)              DAY 2 — FRIDAY (07:30 → 18:00)
  "The Infrastructure & Ingress Lock"           "The Pure Product Engineering Sprint"

  [Step 0 / بسم‌الله] Harness Bootstrap         [/idea-core]  Core Business Value
          │                                            │
          ▼                                            ▼
  [Obsidian Vault] Open codo/docs/              [/prd]        Requirements & Persona
          │                                            │
          ▼                                            ▼
  [/start: Git & Private GitHub]                [/tools]      API Sinks & Connectors
          │                                            │
          ▼                                            ▼
  [/start: VPS SSH & DNS (nip.io)]              [/sops]       Multi-Step Dialog Flows
          │                                            │
          ▼                                            ▼
  [/start: SSL (Caddy) & Reverse Tunnel]        [/data-model] History & Secret Vault
          │                                            │
          ▼                                            ▼
  [Cloudflare Fallback if needed]               [/edge-cases] Nonces & Fallbacks
          │                                            │
          ▼                                            ▼
  [Thursday Milestone Acceptance]               [/plan] → [/build] → [/test] → [/deploy]
  -> Every team has working ingress!            -> Production AI Agent live on VPS!
```

### The Cloudflare Fallback Script in `/start`
If a participant's SSH connection drops or their VPS firewall blocks reverse ports:
```bash
# Fallback command generated automatically by /start:
cloudflared tunnel --url http://localhost:8000
```
This produces an instant `https://<hash>.trycloudflare.com` endpoint that can be pasted directly into the Bale/Telegram webhook configuration, ensuring zero downtime during Day 1.

---

## 3. RAG Architecture: Vector Search Without Docker on Windows

To answer your question: ***«what about RAG?»***

In 2026, building RAG inside a lightweight single-owner agent does **not** require PostgreSQL + pgvector, Qdrant containers, or Milvus. For workshop agents whose knowledge base typically spans 20 to 500 documents (FAQ, product lists, SOP guidelines), we enforce **in-process vector storage**:

### The 3 Zero-Docker RAG Tiers

| Tier | Engine | Installation | Storage | Best For |
|---|---|---|---|---|
| **Tier 1 (Recommended)** | **`sqlite-vec`** | `pip install sqlite-vec` | Inside existing `db.sqlite3` file! | True SQL hybrid queries (`SELECT ... WHERE distance < 0.3`). Zero extra processes. |
| **Tier 2 (High Volume)** | **`lancedb`** | `pip install lancedb` | Serverless local folder (`./data/lance`) | Fast columnar vector search; native Windows binary wheels. |
| **Tier 3 (Ultra-Lightweight)** | **Numpy Cosine + FTS5** | Standard Python / SQLite | `db.sqlite3` text chunks | Datasets $< 100$ chunks; 100% dependency-free. |

### How `sqlite-vec` Operates in Pydantic AI:
```python
import sqlite_vec
import sqlite3
from pydantic_ai import RunContext

def search_knowledge_base(ctx: RunContext, query_embedding: list[float], limit: int = 3):
    # Vector search runs directly inside the same SQLite connection!
    rows = ctx.deps.db.execute("""
        SELECT chunk_text, distance 
        FROM vec_knowledge 
        WHERE embedding MATCH ? 
        ORDER BY distance LIMIT ?
    """, [sqlite_vec.serialize_float32(query_embedding), limit]).fetchall()
    return [r[0] for r in rows]
```
- **Windows status:** Flawless. Pre-compiled wheels exist for Windows `x86_64`, macOS `arm64`, and Linux `x86_64`.
- **Server status:** Identical code runs on the Ubuntu VPS.

---

## 4. The Agent Command Pipeline: Restoring `/tools` & `/sops`

You correctly observed:
> *«why you skipped /tools, /sops, etc? did you merge them in /capabilities?»*

In a web application, the flow is `/ux` $\to$ `/design` $\to$ `/prototype`.  
In an **AI Agent application**, user interfaces are primarily conversational turns and messenger cards; the core business engine consists of **external integrations (`/tools`)**, **procedural workflows (`/sops`)**, and **failure boundaries (`/edge-cases`)**.

### The Definitive 14-Command Public Agent Pipeline

```
Phase 1: Setup & Infrastructure (Day 1 - Thursday)
  1. Step 0 (بسم‌الله)   Bootstrap harness & copy commands
  2. /start              Obsidian vault, Git, GitHub, SSH, nip.io, SSL, Reverse Tunnel

Phase 2: Product & Capabilities Design (Day 2 - Friday Morning)
  3. /idea-core          Agent scope, single-job thesis, competitors
  4. /prd                Persona, customer journeys, knowledge base
  5. /tools              External connectors (Bale API, search, payment)
  6. /sops               Step-by-step procedures (Register, Cancel, Inquire)
  7. /data-model         Living schema: chat_history + secret_vault
  8. /capabilities       Security synthesis: {read, direct, confirm} + envelopes

Phase 3: Robustness & Planning (Day 2 - Friday Midday)
  9. /edge-cases         LLM timeout, budget exhaustion, confirmation nonces
 10. /screen             Messenger card templates & button menus
 11. /plan               4-layer architecture & AST static verification gates

Phase 4: Implementation, Verification & Release (Day 2 - Friday Afternoon)
 12. /build              FastAPI + Pydantic AI + SQLite implementation
 13. /test               Positive business scenarios + negative adversarial walks
 14. /deploy             Production deployment on participant VPS via SSH
```

### Where `capabilities.md` Fits:
`/capabilities` does **not** replace `/tools` or `/sops`. Instead, **`/capabilities` is the security compiler of `/tools` and `/sops`**:
- `/tools` defines *what connections exist*.
- `/sops` defines *what sequences of actions occur*.
- `/capabilities` reviews every action resulting from tools and SOPs, creates `docs/living/capabilities.md`, tags each with its security mode (`read`, `direct`, `confirm`), sets the confirmation tier (`delegate` vs `master`), and identifies all sensitive parameters that must travel as `[h_*]` envelopes.

---

## 5. Tooling & Book Writing Standards

### 5.1 The Obsidian Vault Rule
Workshop participants must not open the root project directory in Obsidian. Opening the root exposes `.venv`, `node_modules`, `.git`, and Python build caches, causing indexing bloat and confusion.

```
Participant Laptop
  ├── Open in AI Coding Tool (Claude Code / OpenCode / Antigravity):
  │     └── /home/user/projects/my-agent/             <-- Full project root
  └── Open in Obsidian:
        └── /home/user/projects/my-agent/docs/        <-- ONLY the docs/ subfolder!
```
By opening `docs/` as the Obsidian Vault:
- The participant sees only clean, beautifully rendered Markdown files (`prd.md`, `capabilities.md`, `status.md`, `questions.md`).
- Reviewing and editing living documents is instantaneous and distraction-free.

### 5.2 The «به واقع» Law for Persian Book Authoring

When rendering Persian Markdown into PDF via WeasyPrint or Pandoc, any line, bullet point, or heading that begins with a Latin/English character triggers an unwanted LTR flip or right-alignment collapse in the typesetting engine.

**The Mandatory Rule:**
Any paragraph, list item, or heading that begins with a Latin/English word or symbol must start with the non-intrusive prefix **`به واقع `**:

```markdown
<!-- INCORRECT (Triggers layout flip in PDF) -->
- **Python** نسخهٔ ۳.۱۲ به بالا الزامی است.
- `/start` دستور برپایی زیرساخت است.
## 2. **Obsidian** چیست؟

<!-- CORRECT (Guarantees right-aligned RTL rendering) -->
- به واقع **Python** نسخهٔ ۳.۱۲ به بالا الزامی است.
- به واقع `/start` دستور برپایی زیرساخت است.
## ۲. به واقع **Obsidian** چیست؟
```

This invariant will be strictly applied across all chapters in `workshops/public-agent/book/`.

---

## 6. Dogfooding the Rehearsal Agent (`event`)

For the Event Registration Agent ([`event/docs/status.md`](file:///home/omid/projects/event/docs/status.md)):
- Since `event` is an internal rehearsal case located inside the workshop workspace, **it skips separate Git repository creation and GitHub push** during `/start`.
- It executes:
  1. Step 0 command check.
  2. Local server SSH connection + `nip.io` + reverse tunnel testing.
  3. Seamless transition through `/idea-core` $\to$ `/prd` $\to$ `/tools` $\to$ `/sops` $\to$ `/data-model` $\to$ `/capabilities` $\to$ `/build`.
- Any edge-case discovered while running `event` directly updates the Codo command definitions and the Persian Book chapters.

---

### Document Summary

| Property | Value |
|---|---|
| **Author** | Antigravity AI Architecture Team |
| **Status** | Approved & Actionable |
| **Input Reference** | Comments on [02-analysis.md](02-analysis.md) |
| **Primary Path** | `/home/omid/projects/workshop/workshop_docs/versions/V7.1/03-analysis-round2.md` |
