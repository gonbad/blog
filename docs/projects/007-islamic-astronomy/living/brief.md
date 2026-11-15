# 007-islamic-astronomy editorial brief: Interactive Practical Islamic Astronomy

- Project: `007-islamic-astronomy`
- Version: `0.1`
- Job revision: `0.4`
- Status: Brief confirmed; question round 02 resolved. Ready for `/job-story`.

---

## 1. Target Reader & Tone
- **Primary Audience:** Persian-speaking readers, students, worshipers, and curious learners who want to understand everyday practical astronomy connected to seasonal changes, solar cycles, Islamic prayer times, and lunar calendars.
- **Starting Context:** The reader does not need advanced physics or calculus. They know basic geography (continents, equator) and common religious practices (daily prayers, fasting, Qibla), but usually lack an intuitive geometric mental model of how the Earth's spherical geometry and axial tilt produce these everyday phenomena.
- **Tone & Voice:** Grounded, conversational, intellectually honest, and pedagogical. It reflects the creator's original stance: an observant, analytical thinker who noticed gaps in standard school education, reached insights through intuitive mental calculations, and presents concepts modestly and clearly without pedantry or religious dogmatism.
- **Language & Typography:** High-quality Persian typography with proper RTL shaping, clear headings, callouts, and clean LTR isolation for numbers, astronomical symbols, and code/formulas.

---

## 2. Agreed Reader Outcome & Thesis
- **Central Thesis:** The apparent motions of the Sun and Moon are not mysterious or disconnected formulas; they are direct consequences of simple spherical geometry and Earth's 23.4° axial tilt. With intuitive mental models and interactive exploration, any reader can understand, predict, and calculate the astronomical foundations of seasons, day lengths, prayer times, Qibla alignment, and lunar months.
- **Agreed Reader Outcomes:**
  1. Visualize the 3 Earth zones relative to the Tropics of Cancer and Capricorn, understanding why solar noon shadows in Iran and Iraq always point north and never disappear.
  2. Demystify the Sun's daily trajectory: know why sunrise is due East only on equinoxes, and how seasonal sunrise/sunset azimuths shift.
  3. Understand seasonal day length variations: see how day length amplitude oscillates gently near the equator but wildly toward the poles.
  4. Master Qibla determination using the Sun: recognize the two annual dates of solar zenith over the Kaaba (7 Khordad / 28 May and 24 Tir / 15 July), and calculate the daily "Qibla hour" when the Sun's azimuth indicates the exact direction of Mecca.
  5. Understand the lunar cycle: grasp "elongation" (angle $\theta$), explain why the new crescent is only visible briefly after sunset, trace the daily ~50-minute moonrise delay, and recognize the 'p' (waxing) vs. 'q' (waning) crescent shapes in the northern hemisphere.

---

## 3. Key Arguments & Differentiation
- **Pedagogical Structure (طرح درس تعاملی):** Rather than presenting dry text followed by an appendix of tools, each major concept is introduced through an authentic narrative and immediately followed by an interactive widget ("Explorable Explanation" style) where the reader tests and verifies the concept.
- **Pillars of the Exposition:**
  1. *Zone Geometry:* Earth's axial tilt (23.44°) defines the Tropics. North of Cancer, the Sun never reaches the zenith.
  2. *Solar Prayer Times:* Solar noon (زوال / ظهر شرعی) is the astronomical moment of minimum shadow length. Sunrise and sunset azimuths shift by season. *(Makruh times are omitted).*
  3. *Day Length Amplitude:* The difference between summer and winter day lengths is a trigonometric function of latitude $\phi$ and solar declination $\delta$.
  4. *The Solar Qibla Compass:* Spherical trigonometry dictates both the great-circle azimuth to Mecca and the exact solar transit time through that azimuth.
  5. *Lunar Elongation & Phases:* Half the Moon is always illuminated; the visible fraction depends strictly on the elongation angle $\theta$. Moonrise lags by $\sim 50$ minutes per day due to the Moon's eastward orbital motion.
- **Technical & Formula Depth (Confirmed):**
  - Main text remains conversational and intuitive.
  - Optional collapsible accordions («جزئیات محاسباتی و فرمول‌ها») are placed under widgets for readers who want to see exact spherical trigonometry and solar position equations.
- **Faithful Actor/Action Boundary:** The narrative addresses the human reader exploring celestial phenomena and verifying them with widgets; it does not lapse into AI meta-commentary or automated instructions.

---

## 4. Deliverable Constraints & Acceptance Expectations
- **Format:** Standalone interactive HTML/CSS/JS article.
- **Interactivity:** Five lightweight embedded interactive SVG/Canvas widgets:
  1. *Zonal World Map (Confirmed SVG):* High-performance inline SVG vector map with clickable latitude zones and coordinate presets.
  2. *Solar Noon & Prayer Tracker:* Interactive location/date solar trajectory calculator.
  3. *Day Length Curve:* Annual daylight oscillation chart by latitude slider.
  4. *Solar Qibla Hour Calculator:* Location/date input calculating exact Qibla solar alignment time.
  5. *Lunar Daily Calendar & Rise/Set Tracker:* Slider through lunar month days (1–30) showing elongation angle $\theta$, sunrise/sunset and moonrise/moonset timings, and visible phase.
  6. *Lunar Orbital Phase & p/q Simulator:* Interactive slider linking angle $\theta$ to crescent appearance, 3D orbit geometry, and northern hemisphere p/q shapes.
- **Offline & Self-Contained:** Zero external network calls or CDNs; all styling, fonts, and scripts bundled locally.
- **Quality Acceptance:**
  - Content fidelity: 100% of claims match creator's channel notes.
  - Mathematical correctness: Solar coordinates, declination, day length, and Qibla formulas accurate within standard observational tolerances ( $\pm 1$ minute).
  - Clean responsive layout on both desktop and mobile viewports.
  - Standalone ZIP package verification without internet access.
