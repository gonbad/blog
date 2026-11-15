# V7.1 — Analysis Round 4: Structural Reorganization, The `registration` Dogfooding Rehearsal, and Full Integration of the Event PRD into the Book

> **Input:** Voice notes & transcription in `registration/existing_product/event/docs/versions/0.1/03-prd-transcription.md` + Organizer instructions in Round 4 (2026-11-01).  
> **Prior Documents:** [02-analysis.md](02-analysis.md) · [03-analysis-round2.md](03-analysis-round2.md) · [04-analysis-round3.md](04-analysis-round3.md).  
> **Status:** Finalized Repository Restructuring & Syllabus Synchronization.  
> **Deliverable Path:** `/home/omid/projects/workshop/workshop_docs/versions/V7.1/05-analysis-round4.md`.

---

## 1. Audit of the New Repository Layout

The workspace has been restructured cleanly:

```
/home/omid/projects/workshop/
├── scripts/                          # Centralized build scripts
│   ├── build_codo.py                 # Packages Codo (defaulting to v7.1)
│   └── make_book_pdf.py              # Compiles Persian Markdown books to PDF
├── workshops/                        # The 4 workshop distribution products
│   ├── public-agent/                 # [Core V7.1 Deliverable] Book + Codo + Dist
│   │   ├── book/                     # 8 Persian chapters (strictly adhering to «به واقع» rule)
│   │   ├── codo/                     # Pure Markdown Codo scaffolding
│   │   └── dist/                     # book.pdf (277K) & codo-agent-7.1.zip (35K)
│   ├── private-agent/                # Cookbook + Agent Kandoo
│   ├── public-web/                   # Book + Web Codo
│   └── private-web/                  # Cookbook + Kandoo
├── registration/                     # The live dogfooding rehearsal workspace
│   ├── existing_product/event/       # Imported previous Event Agent codebase
│   └── docs/                         # Codo lifecycle documents for registration agent
├── workshop_docs/                    # Repository documentation and version logs
│   ├── CONSTITUTION.md               # The 7 Products Ecosystem Constitution
│   └── versions/V7.1/                # Analysis records (00 through 05)
├── paper/                            # BRAH Security Paper (v6.2)
└── presentation/                     # "What is an Agent?" 135-slide deck
```

### Corrections Applied:
1. **`codo.zip` Versioning:** Corrected package naming and default version in `scripts/build_codo.py` to produce `codo-agent-7.1.zip`.
2. **`scripts/` Path Resolution:** Updated `scripts/build_codo.py` and `scripts/make_book_pdf.py` to resolve project root via `parent.parent`, and gracefully handle standalone compilation without requiring legacy `models.json`.
3. **Constitution Path:** Linked root governance to `workshop_docs/CONSTITUTION.md` with explicit mapping of the rehearsal to `registration/`.

---

## 2. Full Integration of `03-prd-transcription.md` into the Participant Book

All real-world operational rules from `03-prd-transcription.md` have been authored directly into `workshops/public-agent/book/`:

### 2.1 Hardware, VPS & Model Prerequisites (Chapter 2)
- **VPS Hardware Floor:**
  - OS: **Ubuntu 24.04 LTS** (strictly version 24).
  - CPU: Minimum **2 cores**.
  - RAM: Minimum **4 GB**.
  - Disk: Minimum **24 GB**.
  - Location: Non-sanctioned locations (USA, Germany, Netherlands).
- **Approved AI Subscriptions:**
  - Claude Pro+ (Pro, Team, Enterprise).
  - ChatGPT Codex Plus+ (Plus, Team, Enterprise).
  - Antigravity Paid (leveraging Gemini Argon; Gemini 4 Carbon not yet publicly released).
- **Mandatory Workshop Gear:**
  - Laptop and charger.
  - **Power strip (سه‌راهی برق)** — mandatory.
  - **High-speed mobile internet from 2 distinct carriers (همراه اول و ایرانسل)** — mandatory.
  - **Anti-sanction tool (شکن طلایی)**.

### 2.2 Venue, Arrival & Thursday Schedule (Chapter 4)
- **Venue:** **Bagh-e Lark (باغ لارک)**, northeast Tehran.
- **Punctuality Rule:** Due to the pedestrian distance from the entrance of Bagh-e Lark to the hall, participants must arrive by **13:30**. Doors lock at 14:00 sharp; late arrivals forfeit their seat without refund.
- **Thursday Schedule:**
  - 14:00–17:00: Presentation («ایجنت چیست؟» و مبانی نظری).
  - 17:00–17:30: Maghrib prayer, break & afternoon snack (عصرانه).
  - 17:30–20:00: Setup & troubleshooting session. Mandatory for full participants; failing to have VPS, AI, or tools ready on Thursday downgrades the participant to listener on Friday.

### 2.3 Friday Build Marathon & Commitment (Chapter 8)
- **Friday Schedule:**
  - 07:30: Breakfast (صبحانه).
  - 08:00–20:00: The Build Sprint (`/plan` $\to$ `/build` $\to$ `/test` $\to$ `/deploy`).
  - Catering provided: Breakfast, lunch, and afternoon snack (صبحانه، ناهار و عصرانه).
  - **Commitment:** Participants stay until their agent is live on their VPS.

### 2.4 The Registration Case Study (Chapter 5)
The Workshop Registration Agent (`registration`) is featured as the canonical reference design:
- **Scope & Persona:** Independent desk secretary (refers to Omid as "استاد").
- **Tiers:** Full participant with product (4.5M Toman, idea/AI/VPS approved by instructor before payment); Listener (4M Toman, instant payment); Companion (2M Toman, contingent on Thursday morning seat availability); Presentation only (1.5M Toman, unlimited capacity).
- **Capacity:** Hard cap of **16 seats**. Subsequent registrants enter the reserve queue.
- **Cancellation Policy:** 100% refund until Wednesday 20:00; 20% refund between Wednesday 20:00 and Thursday 14:00; 0% after start.
- **Envelopes:** Contact-card mobile capture and national ID pattern scrubbing mapped to `[h_*]` handles; plaintext strictly isolated from LLM context.

---

## 3. Verification & Build Artifacts

1. **Book Compilation:**
   ```bash
   python3 scripts/make_book_pdf.py --book-dir workshops/public-agent/book --output workshops/public-agent/dist/book.pdf
   ```
   - Status: Clean PDF generated at `workshops/public-agent/dist/book.pdf` (277 KB). Passed RTL check.
2. **Codo Package Compilation:**
   ```bash
   python3 scripts/build_codo.py --src workshops/public-agent/codo --name codo-agent --out workshops/public-agent/dist/
   ```
   - Status: Clean zip generated at `workshops/public-agent/dist/codo-agent-7.1.zip` (35 KB, 38 files).
