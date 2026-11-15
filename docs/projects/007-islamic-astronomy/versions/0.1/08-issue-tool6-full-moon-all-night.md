# 08-issue: Tool 6 Full Moon (Mid-Month) Entire-Night Observation Visibility

- Project: `007-islamic-astronomy`
- Version: `0.1`
- Scope: Active Project (`projects/007-islamic-astronomy/src/index.html`)
- Date: 2026-11-15
- Reporter: Project Owner

---

## 1. Observed Defect & User Report

- *Report:* «in interactive tool #6 when in mid moon (شب ۱۳و ۱۴و ۱۵) we see full moon in entire night»
- *Reproduction:*
  In Widget 6 (`#widget-6`), the phase classification was partitioned simply with a binary condition `if (theta < 180)` vs `else`.
  Consequently:
  - At $\theta = 175^\circ$ (approaching full moon / night 14–15), the tool displayed `حالت p (اول شب)` and observation time: `اول شب در آسمان غرب`.
  - At $\theta = 180^\circ$ (exact full moon / opposition), the tool immediately switched to `حالت q (سحرگاه)` and observation time: `سحرگاه در آسمان شرق`.
- *Astronomical Reality & Expected Behavior:*
  In the middle of the lunar month (nights 13, 14, 15; $\theta \approx 180^\circ$):
  - The Moon is at **بدر کامل / ماه شب چهارده (Opposition / Full Moon)**.
  - The Moon rises at sunset in the East, traverses the entire night sky, and sets at sunrise in the West.
  - It is visible **در تمام طول شب (در تمام شب از غروب آفتاب تا طلوع صبح)**, not merely at dusk (اول شب) or dawn (سحرگاه).
  - The shape is neither a 'p' crescent nor a 'q' crescent, but a complete illuminated circular disk.
  - The badge and readouts should prominently reflect `🌕 بدر کامل (تمام طول شب)` and observation time: `در تمام طول شب در آسمان دیده می‌شود (طلوع در غروب آفتاب و غروب در طلوع آفتاب)`.

---

## 2. Technical Diagnosis & Fix Plan

1. **Refine Phase & Visibility Granularity in `updateWidget6()`:**
   - Detect mid-month opposition ($\theta$ between $165^\circ$ and $195^\circ$):
     - `w6PqBadge`: `🌕 بدر کامل (تمام طول شب)` with amber/gold styling (`#d97706`).
     - `w6PhaseTitle`: `بدر کامل (ماه شب چهارده - مقابله)`.
     - `w6ObsTime`: `در تمام طول شب در آسمان (هم‌زمان با غروب آفتاب طلوع و در طلوع آفتاب غروب می‌کند)`.
   - Distinguish waxing gibbous (کوژماه فزاینده, $100^\circ < \theta < 165^\circ$):
     - `w6PqBadge`: `کوژماه فزاینده (پیش از بدر)`.
     - `w6ObsTime`: `بیشتر ساعات شب (از عصر و سرشب تا نزدیکی سحر)`.
   - Distinguish waning gibbous (کوژماه کاهنده, $195^\circ < \theta < 260^\circ$):
     - `w6PqBadge`: `کوژماه کاهنده (پس از بدر)`.
     - `w6ObsTime`: `نیمهٔ دوم شب تا بعد از طلوع صبح`.
   - Distinguish First Quarter ($80^\circ \le \theta \le 100^\circ$):
     - `w6PqBadge`: `تربیع اول (نیم‌ماه)`.
     - `w6ObsTime`: `از ظهر تا نیمه‌شب در آسمان`.
   - Distinguish Third Quarter ($260^\circ \le \theta \le 280^\circ$):
     - `w6PqBadge`: `تربیع دوم (نیم‌ماه صبحگاهی)`.
     - `w6ObsTime`: `از نیمه‌شب تا ظهر در آسمان`.
   - Reserve `حالت p (اول شب)` strictly for waxing crescent ($10^\circ \le \theta < 80^\circ$) and `حالت q (سحرگاه)` strictly for waning crescent ($280^\circ < \theta \le 350^\circ$).
   - Detect New Moon conjunction ($\theta < 10^\circ$ or $\theta > 350^\circ$):
     - `w6PqBadge`: `🌑 مقارنه (ماه نو)`.
     - `w6ObsTime`: `غیرقابل رؤیت (محو در روشنایی روز)`.
2. **Synchronize Widget 5:**
   - Ensure Widget 5 for days 13, 14, 15 displays `بدر کامل (شب‌های ۱۳، ۱۴ و ۱۵)` and `رویت در تمام طول شب (غروب آفتاب تا طلوع خورشید)`.

---

## 3. Verification Plan

- Test `w6-theta` at $180^\circ$ (and $170^\circ$, $175^\circ$, $185^\circ$): verify readout displays `بدر کامل` and confirms visibility throughout the entire night (`تمام طول شب`).
- Verify `check_layout.py` and `check_build.py` pass.
- Re-run local preview verification.

---

## 4. Resolution & Verification Evidence

1. **Mid-Month Phase Discrimination Implemented in Widget 6:**
   - In `updateWidget6()`, added exact checks for $\theta \in [165^\circ, 195^\circ]$ corresponding to nights 13, 14, 15:
     - Badge: `🌕 بدر کامل (تمام طول شب)` styled in amber (`#d97706`).
     - Phase Title: `بدر کامل (ماه شب چهارده - مقابله / روشنایی ۱۰۰٪)`.
     - Visibility Observation: `در تمام طول شب در آسمان دیده می‌شود (هم‌زمان با غروب آفتاب در شرق طلوع و در طلوع آفتاب در غرب غروب می‌کند)`.
   - Also differentiated Waxing Gibbous ($100^\circ < \theta < 165^\circ$), Waning Gibbous ($195^\circ < \theta < 260^\circ$), First/Second Quarters, and New Moon conjunction, reserving `p` and `q` badges strictly to their true crescent phases.
2. **Synchronized Widget 5:**
   - In `updateWidget5()`, updated days 13 to 15 to classify as `بدر کامل (شب‌های ۱۳، ۱۴ و ۱۵)` with visibility: `در تمام طول شب در آسمان دیده می‌شود (غروب خورشید تا طلوع)`.
3. **Verification Evidence:**
   - Automated layout checks in `check_layout.py` passed.
   - Offline ZIP package rebuild and non-Latin extraction in `check_build.py` passed (SHA-256: `ba0b9c816092ad953ea17534980eb66fa5e1ec5816e3cede18ad9c3db18bc120`).
   - Verified live preview on `http://127.0.0.1:8000/007-islamic-astronomy/`.

