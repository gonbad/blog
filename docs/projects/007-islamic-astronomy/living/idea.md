# 007-islamic-astronomy idea and scope: Interactive Practical Islamic Astronomy

- Project: `007-islamic-astronomy`
- Selected version: `0.1`
- Job revision: `0.4`
- Status: Idea and scope confirmed; completed editorial execution recorded in status.md.

## 1. Intended Reader & Core Problem
- **Reader:** Persian-speaking general readers, students, worshipers, and curious learners who want to understand the foundational astronomy governing daily life and Islamic worship.
- **Problem:** Astronomical concepts (celestial coordinates, solstices, Tropic of Cancer, latitude variations in daylight, prayer times, solar Qibla alignment, lunar phases and crescent sighting) are either omitted from school curricula or taught abstractly. Readers lack an intuitive, interactive lesson that combines clear prose with hands-on widgets.
- **Desired Outcome:** The reader gains an intuitive mental model and practical calculation ability for the movements of the Sun and Moon, verified through embedded interactive tools in a guided lesson plan.

## 2. Authentic Curriculum & Interactive Visualizations (طرح درس)
1. **The Earth, Sun, and Geographical Zones:**
   - Three zones of the Earth: North of the Tropic of Cancer (Iran, Iraq — Sun is always south at solar noon); Between the Tropics (Mecca, Yemen — Sun passes zenith twice a year); South of the Tropic of Capricorn (Sun is always north at noon).
   - *Interactive Widget 1:* World/regional interactive map showing the Tropic of Cancer, Tropic of Capricorn, and Iran's position, illustrating why shadows never point south at noon in Iran.
2. **The Sun's Daily Journey & Prayer Times:**
   - Solar noon (ظهر شرعی / زوال: moment of minimum shadow), sunrise, and sunset.
   - The seasonal shift of sunrise/sunset azimuths (due East/West only on equinoxes; NE to NW in summer; SE to SW in winter).
   - *Interactive Widget 2:* Daily solar tracker showing the Sun's path, shadow direction, and exact prayer times (sunrise, noon, sunset) for any chosen location and date. *(Note: Makruh times explicitly excluded per user decision).*
3. **Seasonal Day Length Variations (طول روز و نوسان فصلی):**
   - How daylight duration varies by latitude (e.g. Tehran 35°N varying 10h to 14h; Helsinki 60°N varying 6h to 18h; Polar regions 0h to 24h).
   - *Interactive Widget 3:* Annual day length curve where adjusting latitude interactively demonstrates how the oscillation amplitude increases from equator to pole.
4. **Direction Finding & Solar Qibla Hour (جهت‌یابی و ساعت قبله):**
   - The special dates when the Sun is at zenith directly above the Kaaba (7 Khordad / 28 May and 24 Tir / 15 July at Mecca's solar noon).
   - The universal principle: finding the exact daily time when the Sun's azimuth aligns with the local Qibla direction.
   - *Interactive Widget 4:* Interactive Qibla hour calculator allowing any location and date to determine the exact minute when facing the Sun points directly towards the Qibla.
5. **The Moon, Lunar Phases, and the Islamic Calendar:**
   - The fundamental concept of "elongation / distance" (angle $\theta$ between Sun and Moon from Earth).
   - Conjunction (مقارنه) vs. Opposition (مقابله), and thresholds for solar/lunar eclipses.
   - Crescent sighting (رؤیت هلال) vs. astronomical new moon: why the crescent can only be seen briefly after sunset in the early days.
   - Moonrise and moonset shifting later each night throughout the lunar month (~50 min/day).
   - Moon crescent shapes in the northern hemisphere (waxing 'p' shape in early evening vs. waning 'q' shape at dawn).
   - *Interactive Widget 5:* Interactive lunar phase and elongation explorer demonstrating why the moon appears in specific shapes and sky positions relative to sunset/sunrise.

## 3. Boundaries, Sources & Source Contract
- **Primary Authentic Sources:**
  - Creator's channel notes in `docs/projects/007-islamic-astronomy/versions/0.1/channel-notes.md`.
  - Creator's voice intake in `docs/projects/007-islamic-astronomy/versions/0.1/00-idea-input.md`.
  - Confirmed decisions in `docs/projects/007-islamic-astronomy/versions/0.1/01-questions.md`.
- **Private Input Boundaries:** Source notes in dossier (`docs/projects/007-islamic-astronomy/versions/0.1/`).
- **Public Output Folder:** `projects/007-islamic-astronomy/src/`.
- **Exclusions:**
  - "Makruh" times (ساعات کراهت) are explicitly excluded per user instruction in round 01.
  - Complex astrophysics or stellar mechanics not related to practical observational astronomy.
  - Remote CDN dependencies or online map tile APIs.
- **Interactive Architecture:**
  - Lightweight vendored local JS libraries where suitable, falling back to clean vanilla JavaScript astronomical calculations.
  - 100% offline, zero network requests, self-contained SVG/Canvas visualizations.
- **Delivery Mode:**
  - Interactive HTML/JS article with local preview and a public web URL; no automatic article ZIP.
  - Target public blog deployment upon completion.

## Current shared delivery policy — 2026-11-15

Shared version 0.6 removes this article's automatically generated ZIP and makes the
web URL the delivery target. The earlier Job 0.4 build/acceptance records are historical
evidence, not a requirement to keep generating that archive. Content source, widgets
and submitted decisions are preserved; source inventory is in `sources.md`. Preferred
URL: https://blog.kiloapp.ir/007-islamic-astronomy/; the old hostname remains supported.
