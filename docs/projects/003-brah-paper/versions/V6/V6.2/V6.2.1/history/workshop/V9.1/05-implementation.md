# V9.1 — Architectural Implementation: Ecosystem Pivot, Moom v0.3.0, and Blog Consolidation

**Scope:** Sunset autonomous agent supremacy, repeal the Synchronization Law, upgrade Moom to v0.3.0 with two verified starter recipes (`presentation-maker` and `blog-publisher`), migrate `blog/` to the modern Moom engine layout, consolidate the BRAH Paper and Agent Presentation into the blog, and prune root legacy clutter.

---

## 1. Source Order & Resulting Decisions

1. [01-transcription.md](01-transcription.md): Creator instructions directing product consolidation, blog migration, and job extraction.
2. [02-analysis.md](02-analysis.md): Round 1 architectural analysis and critique of existing flawed presentation job.
3. [03-analysis-round-2.md](03-analysis-round-2.md): Round 2 resolving constitutional shift, poly-format blog, and historical isolation.
4. [04-analysis-round-3.md](04-analysis-round-3.md): Round 3 resolving the total pruning of `presentation-archive/` and formalizing the Four Document Classes.

---

## 2. Constitutional Amendment & Paradigm Shift

- **Version:** Updated [CONSTITUTION.md](../../CONSTITUTION.md) to **V9.1**.
- **Sunset of the Agent Era:** Autonomous agent harness development (`workshops/public-agent/`, `registration/`, and the theoretical BRAH model) is retired to historical archive status.
- **Repeal of the Synchronization Law:** Section 3 (*The Synchronization Law*) is repealed. The BRAH Paper and Agent Presentation are no longer binding architectural ground truth for the repository.
- **Primary Active Products:**
  1. **Moom (`moom/`):** Reusable workflow generation and repeated-task skills (Kandoo engine).
  2. **Workshop Journal (`blog/`):** Poly-format publication Kandoo operated via Moom's `blog-publisher` Job.

---

## 3. Moom Submodule Release v0.3.0

- **Submodule Path:** `moom/` (tracking `https://github.com/gonbad/moom` on branch `main`).
- **Release Version:** `0.3.0` (commit `ada418d`).
- **Document Taxonomy Law Formally Enforced:**
  - *Constitutions (`docs/constitution/`, `CONSTITUTION.md`):* Supreme invariants; read at session start.
  - *Living Docs (`docs/**/living/`, `docs/index.md`):* Mutated in-place; authoritative CURRENT truth.
  - *Version Docs (`docs/**/versions/V*/`):* Immutable historical decision records. Governed by the **Historical Version Isolation Invariant**: AI assistants must NEVER inspect historical version folders unless explicitly instructed by the user or when actively authoring the designated open version.
  - *Code-Like Docs (`job/<name>/`, `.moom/core/`):* Machine-executable SOPs, Agent Skills, and commands kept strictly outside the Obsidian human vault (`docs/`).
- **Starter Catalog (`registry/`):**
  - **`presentation-maker` (v0.1.0):** Completely overhauled from the flawed vertical scroller into a zero-CORS, landscape-first (16:9) presentation engine with Left/Right navigation (supporting both LTR and RTL), touch swipe, aspect-ratio container with portrait rotation hint, slide overview grid modal (`G`), speaker notes drawer (`N`), and fullscreen toggle (`F`). Operates cleanly offline via `file://index.html`.
  - **`blog-publisher` (v0.1.0):** Extracted reusable Agent Skill for multi-post publishing with an index page (`000-index`), autonomous per-post visual layouts (`/layout`), minified static HTML compilation to `dist/`, standalone offline ZIP packaging, and static server deployment.

---

## 4. Blog Kandoo Upgrade (Moom Engine Adoption)

- **Engine Modernization:**
  - Replaced the legacy 47 KB monolithic `blog/moom.py` with the clean 10-line trampoline pointing to `blog/.moom/core/moom.py`.
  - Installed active Job in `blog/job/blog-publisher/`.
  - Generated native host adapters: 19 commands and 57 adapter files across `.claude/commands/`, `.opencode/commands/`, and `.agents/skills/`.
- **State Authority:**
  - Authoritative workspace state formalized in `blog/workspace.json`.
  - 5 active projects registered:
    - `000-index` (v0.1.2): Curated publication index and masthead.
    - `001-workshop-7` (v0.1.1): Workshop 7 announcement and interactive vertical slides.
    - `002-claude-server` (v0.2): Remote server tutorial and prompt generator.
    - `003-brah-paper` (v6.2): Byzantine-Resilient Agent Harnesses Paper v6.2 (A4 format).
    - `004-agent-presentation` (v7.4): Complete 167-slide Agent Presentation deck with interactive widgets.

---

## 5. Consolidated Deliverables & Root Pruning

- **`paper/` Consolidation:**
  - Migrated to `blog/projects/003-brah-paper/site/index.html`.
  - Documented in `blog/docs/projects/003-brah-paper/` (living docs + historical versions V1.0, V2.0, V6.2).
  - Packaged into `blog/dist/brah-paper-v6.2.zip`.
- **`presentation/` Consolidation:**
  - Migrated to `blog/projects/004-agent-presentation/site/`.
  - Documented in `blog/docs/projects/004-agent-presentation/` (living docs + historical versions V1.0, V2.0, V7.4).
  - Packaged into `blog/dist/agent-presentation-v7.4.zip`.
- **Root Cleanup:**
  - Deleted `presentation-archive/` entirely (preserved in Git history).
  - Deleted root `presentation.zip` (7.5 MB).
  - Deleted root standalone `paper/` and `presentation/` directories.
- **Index Update:**
  - Updated `blog/projects/000-index/site/index.html` with explicit post cards for 003 and 004.
  - Rebuilt `blog/dist/` containing all 5 projects.

---

## 6. Verification Evidence

1. **Moom Unit Test Suite:**
   - Ran `python3 -m unittest discover -s tests -v` in `moom/`.
   - **All 15 isolated lifecycle tests passed** (setup, resumption, adaptation, job export, atomic placement, semantic conflicts, rollback, secrets ignore).
2. **Moom Release Compilation:**
   - Ran `python3 tools/release.py --check` in `moom/`.
   - Manifest checksums, commands, and pristine state verified cleanly.
3. **Blog Workspace Integrity:**
   - Ran `python3 blog/moom.py check`.
   - Output: `{"ok": true, "projects": 5, "job": {"name": "blog-publisher", "version": "0.1.0"}}`.
4. **Air-Gapped / Zero-Remote-Leak Linter:**
   - Verified all HTML files in `blog/dist/`.
   - Zero remote script, stylesheet, or font leaks detected. All assets resolve locally for 100% offline `file://` execution.
5. **Standalone Offline Archives:**
   - Generated `blog/dist/brah-paper-v6.2.zip` (30.7 KB).
   - Generated `blog/dist/agent-presentation-v7.4.zip` (7.5 MB).
