# 007-islamic-astronomy layout decisions

- Project: `007-islamic-astronomy`
- Version: `0.1`
- Job revision: `0.4`
- Status: Layout implemented and verified in `projects/007-islamic-astronomy/src/index.html`

---

## 1. Visual Design & Typography
- **Format:** Standalone interactive explorable article with embedded inline SVG/Canvas educational widgets.
- **Color Palette:** Warm reading theme inspired by scientific journal aesthetics:
  - Background: Natural parchment warm white (`#f8f6f0`)
  - Primary text: Deep charcoal (`#22252a`)
  - Headings & Primary Accents: Deep forest teal (`#125b50`) and soft teal tint (`#e8f3f1`)
  - Solar & Compass Accent: Warm amber gold (`#d48b28` / `#f59e0b`)
  - Border and Dividers: Soft warm gray (`#dcd7cc`)
- **Typography & Direction:**
  - Root: `dir="rtl" lang="fa"`, line-height `1.9`, max-width `52rem`.
  - Fonts: Native system stack (`-apple-system`, `BlinkMacSystemFont`, `Vazirmatn`, `Tahoma`, `sans-serif`).
  - LTR Isolation: Formulas, astronomical symbols, clock digits, package IDs, and code blocks strictly isolated with `direction: ltr; unicode-bidi: isolate;`.
- **Mathematical Accordions:**
  - `<details>` / `<summary>` accordions placed beneath each interactive widget containing exact spherical trigonometry and solar equations for curious students and educators.

---

## 2. Graphic Figures & Interactive Widgets
1. **Figure 1 (تصویر ۱: نقشهٔ مناطق سه‌گانهٔ جهان):**
   - High-contrast responsive SVG world map showing Zone 1 (North of Cancer), Zone 2 (Between Tropics), and Zone 3 (South of Capricorn), marking Iran, Mecca, and Australia.
2. **Widget 1 (ابزار ۱: نقشهٔ مناطق سه‌گانه و موقعیت خورشید و سایه در ظهر):**
   - City presets (Tehran, Mashhad, Ahvaz, Chabahar, Mecca, Equator, Sydney) and seasonal solstice/equinox presets.
   - Interactive ray-tracing showing noon solar altitude and shadow direction (North vs South vs Zero).
3. **Widget 2 (ابزار ۲: شبیه‌ساز مسیر روزانهٔ خورشید، انیمیشن سایهٔ شاخص و ساعت عقربه‌ای):**
   - **Defaults:** Tehran, 11 Khordad (per owner's confirmed feedback).
   - Time-of-day slider animating the solar arc from sunrise through solar noon to sunset.
   - Real-time rotating and resizing gnomon shadow accompanied by an analog clock.
   - Prominently highlighted solar noon (لحظهٔ زوال آفتاب).
4. **Widget 3 (ابزار ۳: نمودار نوسان سالانهٔ طول روز بر حسب عرض جغرافیایی):**
   - Latitude slider ($0^\circ$ to $68^\circ$).
   - Dynamic SVG sine-wave rendering day length across all 12 months, displaying max/min day lengths and annual amplitude.
5. **Widget 4 (ابزار ۴: محاسبه‌گر دقیق ساعت قبله):**
   - City presets across Iran and international locations, plus custom date picker.
   - Exact Qibla azimuth calculation from Mecca coordinates.
   - Dynamic 1-minute solar azimuth simulation computing the exact clock time («ساعت قبله») when facing the Sun aligns with the Kaaba.
   - Visual compass indicating Qibla needle and Sun marker.
6. **Widget 5 (ابزار ۵: کاوشگر روزانهٔ ماه قمری: فاصلهٔ زاویه‌ای، زمان‌های طلوع/غروب و شکل ماه):**
   - Added per owner's review feedback.
   - Lunar day slider (Day 1 to 30) displaying elongation angle $\theta$, comparative sunrise/sunset vs moonrise/moonset timings with ~50-min daily shift, rendered phase shape, and visibility criteria.
7. **Widget 6 (ابزار ۶: شبیه‌ساز فازهای ماه، زاویهٔ فاصله و قاعدهٔ p و q):**
   - Orbital $\theta$ slider showing top-down orbit, solar parallel rays, and Earth-view rendering demonstrating why waxing crescent is 'p' (dusk) and waning crescent is 'q' (dawn) in the northern hemisphere.

---

## 3. Boundaries & Offline Integrity
- **Public Source Root:** `projects/007-islamic-astronomy/src/` (entry: `index.html`).
- **Compiled Output Root:** `projects/007-islamic-astronomy/dist/`.
- **Browser Checks:** `projects/007-islamic-astronomy/checks/`.
- **Private Documentation Vault:** `docs/projects/007-islamic-astronomy/`.
- **Network Independence:** Zero remote runtime calls, zero external CDNs, 100% self-contained JavaScript and SVG assets.
- **Home Navigation:** Local back link `data-home-link` pointing to `../`.

## Current shared delivery policy — 2026-11-15

Shared version 0.6 removes this article's automatically generated ZIP and makes the
web URL the delivery target. The earlier Job 0.4 build/acceptance records are historical
evidence, not a requirement to keep generating that archive. Content source, widgets
and submitted decisions are preserved; source inventory is in `sources.md`. Preferred
URL: https://blog.kiloapp.ir/007-islamic-astronomy/; the old hostname remains supported.
