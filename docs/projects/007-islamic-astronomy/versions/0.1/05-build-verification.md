# 05-build-verification: Compilation, Packaging and Offline Verification

- Project: `007-islamic-astronomy`
- Version: `0.1`
- Compiled Target: `projects/007-islamic-astronomy/dist/`
- Local Preview URL: `http://127.0.0.1:8000/007-islamic-astronomy/`

---

## 1. Technical Build Receipts & Integrity
- **Builder Command:** `python3 kandoo/build.py --preview 007-islamic-astronomy --output .preview/007-islamic-astronomy`
- **Output Receipt:** `projects/007-islamic-astronomy/dist/.journal-output.json`
- **SHA-256 Hashes:**
  - `index.html`: `e30d989c727a69405e0115a539b2df056823916d6a6536528c2b0cddf24550f9`
  - `downloads/007-islamic-astronomy-v0.1.zip`: `0b34a247adae6de922eba64ab40b9ed79853f2eac405a2e3859ca24a5288e2da`

---

## 2. Standalone Offline Archive Verification
- **Archive File:** `projects/007-islamic-astronomy/dist/downloads/007-islamic-astronomy-v0.1.zip`
- **ZIP Inventory:**
  - `index.html` (with adapted `data-delivery="offline"`)
  - `offline-manifest.json` (SHA-256: `4fabe1c188eb5ccd1ac8d5612d82856e3be5c96acd08314415d0e9c5cf2ba518`)
- **Isolation Checks:**
  - The ZIP does not contain itself or any parent/sibling project artifacts.
  - Zero external CDN or remote network dependencies.
  - Successfully extracted into a test directory containing spaces and non-Latin characters (`مسیر تست با فاصله و حروف فارسی`) without errors.

---

## 3. Automated Check Results
- `python3 projects/007-islamic-astronomy/checks/check_layout.py`: **PASS** (all 6 widgets, Figure 1 map, and RTL/LTR rules verified).
- `python3 projects/007-islamic-astronomy/checks/check_build.py`: **PASS** (hashes, archive contents, and manifest verified).
- `python3 kandoo/check.py`: **PASS** (workspace integrity intact; 0 errors).

---

## 4. Local Preview Server
- Preview release staged at `.preview/007-islamic-astronomy/`.
- Served locally on `http://127.0.0.1:8000/007-islamic-astronomy/`.
- **Note:** Marked `preview_only: true`; technical build is complete, while human acceptance and public deployment remain separate pending states.
