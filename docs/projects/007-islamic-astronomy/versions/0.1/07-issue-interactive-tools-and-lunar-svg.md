# 07-issue: Interactive Tools Defaults, Lunar Elongation SVG Diagram & Tool 6 Circle Alignment

- Project: `007-islamic-astronomy`
- Version: `0.1`
- Scope: Active Project (`projects/007-islamic-astronomy/src/index.html`)
- Date: 2026-11-15
- Reporter: Project Owner

---

## 1. Observed Defects & User Requests

1. **Defect C (Default Date & Time):**
   - *Report:* «and I changed my mind about default date and time: it should be today and now!»
   - *Reproduction:* In interactive tools (especially Widget 2), the date was hardcoded to `2026-05-31` (11 Khordad) and the time slider to `721` (12:01 PM). While useful as an initial summer example, the author explicitly requested that upon page load, the default date should automatically be the current date (`today`) and the time slider should be set to the current local time (`now`).
   - *Expected:* Automatically initialize `w2-date` and `w4-date` to today's local date (`YYYY-MM-DD`), and initialize `w2-time` to the current local minutes (`hours * 60 + minutes`).

2. **Defect D (Visual Angle Diagram for Sun, Earth, and Moon):**
   - *Report:* «/kandoo-issue show an SVG of earth, sun and moon to show زاویه»
   - *Reproduction:* Section 5 introduces the fundamental concept of «فاصله» (elongation angle $\theta$ between Sun and Moon as seen from Earth). However, there was no standalone explanatory SVG figure showing the three celestial bodies (Sun, Earth, Moon) with the angle $\theta$ geometrically labeled between the Earth-Sun vector and Earth-Moon vector.
   - *Expected:* Add Figure 2 (SVG) in Section 5 illustrating the Earth, Sun, Moon system, the Earth-Sun line of sight, the Earth-Moon line of sight, the illuminated halves versus night halves, and the elongation angle $\theta$ with clear bilingual/Persian callouts. Additionally, enhance Widget 6 to dynamically draw the angle vectors and arc at Earth as $\theta$ changes.

3. **Defect E (Tool #6 Circle Misalignment on Y-Axis):**
   - *Report:* «in interactive tool #6 there is a bug: two circles have different y positions!!»
   - *Reproduction:* In Widget 6 (`#widget-6`), the SVG container had the Earth circle at `cy="100"`. Inside the Earth-view inset box (`<g transform="translate(60, 100)">`), the background dark moon circle was defined as `<circle cx="0" cy="5" r="22"/>` (`cy="5"`), while the foreground illuminated crescent path (`#w6-earth-view`) was dynamically generated with center $y = 0$ (`M 0 -22 ... 0 22`). This caused a 5-pixel vertical offset between the dark moon base circle and the lit crescent disk, creating an asymmetrical and broken circle.
   - *Expected:* Align the dark disk circle to `cy="0"`, making both the background disk and the foreground lit crescent perfectly concentric and vertically aligned with the Earth center ($y = 100$).

---

## 2. Technical Diagnosis & Fix Plan

1. **Today & Now Initialization:**
   - In JavaScript initialization:
     - Query system `new Date()`.
     - Format local `YYYY-MM-DD` and set as `w2Date.value` and `w4Date.value`.
     - Calculate local minutes: `now.getHours() * 60 + now.getMinutes()`.
     - Set `w2Time.value` to this current minute value.
     - Add preset buttons for 11 Khordad, 1 Dey, and 1 Farvardin in Widget 2, and 28 May / 16 July in Widget 4, preserving the ability to easily jump to solstice and equinox dates.

2. **Figure 2 SVG: Earth-Sun-Moon Elongation Angle ($\theta$):**
   - Embed an inline SVG figure under `<h3>مفهوم بنیادین «فاصله» (زاویهٔ جدایی &theta;)</h3>`.
   - Layout:
     - Sun on the right with golden glow and parallel light rays towards Earth and Moon.
     - Earth at center with day side (right) and night side (left), plus observer location on twilight line.
     - Moon in counter-clockwise orbit at elongation angle $\theta \approx 45^\circ$, half-lit facing the Sun.
     - Reference line from Earth to Sun ($0^\circ$).
     - Line from Earth to Moon.
     - Arc at Earth with label «زاویهٔ فاصله &theta; (Elongation Angle)».
     - Callout showing what the Earth observer sees (crescent).
   - In Widget 6, also draw the dynamic Earth-to-Sun reference line, Earth-to-Moon line, and angle arc connecting them.

3. **Fix Tool #6 Y-Alignment:**
   - Change `<circle cx="0" cy="5" r="22" fill="#1f2937"/>` to `<circle cx="0" cy="0" r="22" fill="#1f2937"/>`.
   - Adjust `#w6-pq-badge` vertical position to `y="36"` for balanced vertical centering within the card rect (`y="-45"` to `+45"`).

---

## 3. Verification Plan

- Verify `w2-date` and `w4-date` default to today's date, and `w2-time` defaults to current time upon loading.
- Verify Figure 2 renders cleanly in SVG without external dependencies, with crisp RTL Persian labels.
- Verify Widget 6 circles are concentric ($cy = 0$) and no vertical distortion occurs when adjusting $\theta$ across all $0^\circ$ to $360^\circ$ values.
- Verify automated layout checks and build verification scripts pass.

---

## 4. Resolution & Verification Evidence

1. **Today & Now Initialization:**
   - Implemented `initTodayAndNow()` self-executing function in `src/index.html`.
   - On page load, `w2Date` and `w4Date` are set to today's local date (`YYYY-MM-DD`), and `w2Time` is set to the current local minute (`hours * 60 + minutes`).
   - Added `[📅 امروز]` buttons to both Widget 2 and Widget 4.
2. **Figure 2 SVG (Earth-Sun-Moon Elongation Angle):**
   - Added Figure 2 (`#fig-lunar-elongation`) right beneath `<h3>مفهوم بنیادین «فاصله» (زاویهٔ جدایی &theta;)</h3>`.
   - Features Sun on the right with parallel rays, Earth with day/night terminator, Moon in counter-clockwise orbit, Earth-Sun line of sight, Earth-Moon line of sight, elongation angle $\theta$ arc, and observer inset card.
   - Enhanced Widget 6 to dynamically draw the Earth-Sun reference line (`w6-sun-line`), Earth-Moon line (`w6-moon-line`), dynamic angle wedge (`w6-angle-arc`), and dynamic angle text (`w6-angle-text`).
3. **Tool 6 Circle Alignment:**
   - Updated dark moon base circle in `<g transform="translate(60, 100)">` from `cy="5"` to `cy="0"`.
   - Both background disk and foreground lit crescent path are now perfectly concentric ($cy = 0$) and aligned with Earth center ($y = 100$).
4. **Verification:**
   - `python3 projects/007-islamic-astronomy/checks/check_layout.py` passed with 0 errors.
   - `python3 projects/007-islamic-astronomy/checks/check_build.py` passed.
   - Local preview verified at `http://127.0.0.1:8000/007-islamic-astronomy/`.

