# V9.1 — Architectural Analysis (Round 3): The Four Document Classes & Final Archival Policy

**Source Document:** [03-analysis-round-2.md](file:///home/omid/projects/workshop/workshop_docs/versions/V9.1/03-analysis-round-2.md) with Creator Comments  
**Scope:** Strictly addresses the two remaining topics: the archival disposal of `presentation-archive/` and the formalization of Moom's four document classes.

---

## 1. Executive Status: Consensus Matrix

All previous topics are finalized and frozen:

| Topic | Status | Finalized Decision |
|---|---|---|
| **Sunset of Agent Era** | **Closed** | Update `CONSTITUTION.md` to V9.1. Repeal Synchronization Law. Demote BRAH and Agent Presentation to historical blog case studies. |
| **Blog Kandoo Migration** | **Closed** | Upgrade `blog/` to modern Moom engine (`.moom/core/`, `workspace.json`, `job/blog-publisher/`). |
| **Poly-Format Blog** | **Closed** | No visual unification. Each post defines its own layout, scripts, and styles in its `/layout` step. |
| **Presentation Engine** | **Closed** | Replace flawed starter with a zero-CORS horizontal deck engine (16:9, Left/Right arrows, `G` overview grid, `N` speaker notes, mobile swipe, rotation hint). |
| **Build & Deploy** | **Closed** | Each post compiles to minimized `dist/`. Only the aggregated `dist/` is deployed to VPS. |

---

## 2. Topic 1: Archival Policy — Complete Pruning of `presentation-archive/`

### The Dilemma & Creator Feedback
Round 2 proposed turning all 8 historical presentation drafts into individual archived blog posts to satisfy keeping the entire history.  
**Creator Comment:**
> *"if we dont want to keep archived presentations as blog posts, then simply delete them all. they are in git history and it's sufficient."* (Line 76)

### Resolution: Prune from Working Tree
We accept the creator's pragmatic decision completely:
1. **No Historical Blog Clutter:** We will **not** create 8 redundant blog posts for intermediate presentation drafts. The blog remains a curated journal of distinct, high-value experiences.
2. **Delete `presentation-archive/` Entirely:** The entire `presentation-archive/` directory and root `presentation.zip` are deleted from the working tree. Git history preserves every byte and commit indefinitely.
3. **Two Clean Blog Migrations:**
   - `paper/` → `blog/projects/003-brah-paper/` (the formal academic paper).
   - `presentation/` → `blog/projects/004-agent-presentation/` (the complete, active 167-slide deck).
4. **Clean Root:** Root `paper/` and `presentation/` are removed after migration.

---

## 3. Topic 2: Document Typology & Taxonomy in Moom

### The Dilemma & Creator Feedback
Round 2 introduced the "Historical Version Isolation" rule to prevent AI context pollution from old version dossiers.  
**Creator Comment:**
> *"true and we should say about the difference between version docs, living docs, constitutions and code-like docs we discuss in V9"* (Line 101)

### The Four Document Classes of Moom
To establish clear architectural boundaries and guide both human authors and AI assistants, Moom defines **Four Distinct Document Classes**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   MOOM DOCUMENT TAXONOMY & ACCESS RULES                │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Constitutions     │ Inviolable laws & supreme invariants             │
│                      │ Path: docs/constitution/ (Read on start)        │
├──────────────────────┼──────────────────────────────────────────────────┤
│ 2. Living Docs       │ Authoritative description of CURRENT state       │
│                      │ Path: docs/**/living/ (Always read current truth)│
├──────────────────────┼──────────────────────────────────────────────────┤
│ 3. Version Docs      │ Historical decision log (Requests & reviews)    │
│                      │ Path: docs/**/versions/ (ISOLATED from AI context)│
├──────────────────────┼──────────────────────────────────────────────────┤
│ 4. Code-Like Docs    │ Executable SOPs, Agent Skills & CLI commands    │
│                      │ Path: job/<name>/, .moom/ (Executed as bytecode) │
└────────────────────────────────────────────────────────────────────────┘
```

#### Detailed Contract for Each Class:

1. **Constitutions (`docs/constitution/`, `CONSTITUTION.md`):**
   - **Purpose:** Supreme invariants, ethical guardrails, and non-negotiable architectural boundaries.
   - **Lifecycle:** Rare amendments; supreme over all other documents.
   - **AI Rule:** Read at session initialization; binding on all operations.

2. **Living Docs (`docs/**/living/`, `docs/index.md`):**
   - **Purpose:** Explains *what the product or workspace currently is*. Single source of truth for the active deliverable, operational guidelines, and system status.
   - **Lifecycle:** Mutated in-place with every completed iteration.
   - **AI Rule:** Ambient context. AI reads this to understand the current reality without needing to reconstruct it from history.

3. **Version Docs (`docs/**/versions/V*/`):**
   - **Purpose:** Explains *why it became like this*. Preserves immutable decision records: intake requests (`01-input.md`), review questionnaires (`001-review.md`), and owner feedback.
   - **Lifecycle:** Append-only. Once a version milestone is finalized, it is frozen forever.
   - **AI Rule (The Historical Isolation Invariant):** **Strictly invisible to AI assistants by default.** AI must NEVER crawl, inspect, or load historical version dossiers into context unless explicitly instructed by the user, or when actively authoring the current open version. Past version existence is tracked via one-line ledger entries in `living/status.md`.

4. **Code-Like Docs (`job/<name>/SKILL.md`, `procedures/*.md`, `.moom/core/`):**
   - **Purpose:** Executable procedural specifications, Agent Skills, and stage instructions.
   - **Lifecycle:** Versioned as functional code.
   - **Location:** Strictly outside `docs/` (kept out of the Obsidian human knowledge vault).
   - **AI Rule:** Step-by-step execution guides. AI opens only the specific procedure file required for the active production step.

---

## 4. Finalized V9.1 Execution Scope

All architectural debates are closed. The implementation steps are:

1. **Amend Constitution:** Update [CONSTITUTION.md](../../CONSTITUTION.md) to V9.1 (sunset agent mandate, establish Moom & Blog as core).
2. **Enforce Moom Document Taxonomy:** Update Moom rules (`CLAUDE.md`, `AGENTS.md`, and `moom/docs/`) with the Four Document Classes and the Historical Version Isolation Invariant.
3. **Upgrade Blog Kandoo:** Deploy `.moom/core/`, `workspace.json`, and `job/blog-publisher/` to `blog/`.
4. **Build Next-Gen Presentation Engine:** Implement the 16:9, zero-CORS horizontal deck engine in `moom/registry/presentation-maker/`.
5. **Migrate Products & Purge Clutter:**
   - Ingest `paper/` into `blog/projects/003-brah-paper/`.
   - Ingest `presentation/` into `blog/projects/004-agent-presentation/`.
   - Delete root `presentation-archive/`, `paper/`, `presentation/`, and `presentation.zip`.
6. **Release & Verify:** Run Moom lifecycle test suite, commit submodule `v0.3.0`, and verify blog build.
