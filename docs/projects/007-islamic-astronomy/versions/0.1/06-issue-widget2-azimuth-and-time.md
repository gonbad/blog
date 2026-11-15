# 06-issue: Widget 2 Sunrise Azimuth Orientation & Early Morning Time Range

- Project: `007-islamic-astronomy`
- Version: `0.1`
- Scope: Active Project (`projects/007-islamic-astronomy/src/index.html`)
- Date: 2026-11-15
- Reporter: Project Owner

---

## 1. Observed Defects & Reproduction
1. **Defect A (Sunrise Azimuth in Summer):**
   - *Report:* «interactive tool #2 is wrong. it does not show that dawn is in northeast in summer.»
   - *Reproduction:* In Widget 2, the Sun's daily trajectory was rendered as an elevation arc between fixed labels labeled East (مشرق) on the right and West (مغرب) on the left. It failed to visualize the horizontal compass direction (Azimuth), concealing the critical phenomenon emphasized by the author: that in summer (e.g., 11 Khordad in Tehran), sunrise occurs in the **North-East** (شمال شرقی / $\approx 62^\circ$) and sunset in the **North-West** (شمال غربی / $\approx 298^\circ$).
2. **Defect B (Time Range Restricted Above 05:00):**
   - *Report:* «and the time has now time below 5:00 while sun is rising before it.»
   - *Reproduction:* The time slider had `<input type="range" id="w2-time" min="300" max="1200" step="5">` where `min="300"` corresponds to 05:00 AM. In Tehran on 11 Khordad (May 31), sunrise occurs at 04:48 AM (minute 288). Because the slider could not be dragged below 05:00 AM, the user was unable to observe the actual moment of sunrise or early morning positions.

---

## 2. Technical Diagnosis & Fix Plan
1. **Compass Horizon & True Azimuth Rendering in Widget 2:**
   - Integrate a top-down / 3D-perspective ground horizon compass into Widget 2 showing all 8 cardinal/intercardinal directions (North, North-East, East, South-East, South, South-West, West, North-West).
   - Dynamically compute and plot:
     - Sunrise point with exact azimuth (e.g., $62.0^\circ$ شمال شرقی in summer vs $118.6^\circ$ جنوب شرقی in winter).
     - Solar noon point ($180.0^\circ$ جنوب).
     - Sunset point with exact azimuth (e.g., $298.0^\circ$ شمال غربی in summer vs $241.4^\circ$ جنوب غربی in winter).
   - Plot the Sun's actual ground trajectory connecting sunrise $\to$ south $\to$ sunset, and render the Sun moving along this real trajectory with height/elevation visualization.
   - Ground gnomon shadow accurately directed opposite to the Sun's azimuth ($A + 180^\circ$).
2. **Expand Time Range & Add Precision Jump Controls:**
   - Change slider range to span 03:00 AM (180 min) to 21:30 PM (1290 min), fully encompassing the earliest summer sunrises (04:48 AM) and latest sunsets.
   - Add one-click jump buttons: `[پرش به طلوع]`, `[پرش به ظهر شرعی]`, and `[پرش به غروب]`.
   - Update readouts to explicitly display the sunrise/sunset azimuth angles and cardinal directions (شمال شرقی / شمال غربی).

---

## 3. Verification Plan
- Verify slider allows selecting 04:48 AM and earlier.
- Verify that on 11 Khordad in Tehran, the visual and numeric readout shows sunrise at $\approx 62^\circ$ in **شمال شرقی** and sunset at $\approx 298^\circ$ in **شمال غربی**.
- Verify that on 1 Dey (Winter solstice), sunrise shifts to $\approx 119^\circ$ in **جنوب شرقی** and sunset to $\approx 241^\circ$ in **جنوب غربی**.
- Verify that on equinoxes (1 Farvardin / 1 Mehr), sunrise is at $90^\circ$ (**دقیقاً شرق**) and sunset at $270^\circ$ (**دقیقاً غرب**).
- Update automated checks in `projects/007-islamic-astronomy/checks/check_layout.py` and re-run build and preview.

---

## 4. Resolution & Verification Evidence

1. **Compass Projection & Real Azimuths Implemented:**
   - Replaced fixed 2D arc with true horizon compass projection centered at $(190, 190)$ with radius $R = 140$.
   - Azimuth calculations implemented in `calcSolarAltAz()` and projected via `compassCoord(az, alt)`.
   - Verified that on 11 Khordad (May 31) in Tehran:
     - Sunrise Azimuth: $62.0^\circ$ (**شمال شرقی / North-East**).
     - Solar Noon Azimuth: $180.0^\circ$ (**جنوب / South**).
     - Sunset Azimuth: $298.0^\circ$ (**شمال غربی / North-West**).
   - Verified that on 1 Dey in Tehran:
     - Sunrise Azimuth: $118.6^\circ$ (**جنوب شرقی / South-East**).
     - Sunset Azimuth: $241.4^\circ$ (**جنوب غربی / South-West**).
   - Verified that on 1 Farvardin:
     - Sunrise Azimuth: $89.9^\circ \approx 90.0^\circ$ (**مشرق / Due East**).
     - Sunset Azimuth: $270.1^\circ \approx 270.0^\circ$ (**مغرب / Due West**).
2. **Expanded Time Slider & Jump Controls:**
   - Slider range updated: `min="180"` (03:00 AM) to `max="1320"` (22:00 PM) step 2.
   - Wired 3 jump buttons (`w2-btn-sunrise`, `w2-btn-noon`, `w2-btn-sunset`) to jump directly to exact sunrise, noon, and sunset minutes.
   - Added preset date buttons (`[📅 امروز]`, `[☀️ ۱۱ خرداد]`, `[❄️ ۱ دی]`, `[🌱 ۱ فروردین]`).
3. **Automated Verification:**
   - `projects/007-islamic-astronomy/checks/check_layout.py` passed with 0 errors.
   - Rebuild via `python3 kandoo/build.py --preview 007-islamic-astronomy --output .preview/007-islamic-astronomy` passed.
   - Tested live preview at `http://127.0.0.1:8000/007-islamic-astronomy/`.

