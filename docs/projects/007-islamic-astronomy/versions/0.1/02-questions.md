# 02-questions: Editorial Brief Tradeoffs

- Project: `007-islamic-astronomy`
- Version: `0.1`
- Reference: `docs/projects/007-islamic-astronomy/living/brief.md`

Please review the two editorial tradeoffs below in Obsidian. You can write your preference under `Your answer:`, confirm the recommendations, or leave blank to accept the AI recommendation as provisional. When finished, save the file and say `done` (یا «نوشتم»).

---

## 1. Visual map presentation for interactive widgets (نمایش نقشه در ابزارهای تعاملی)
Kind: AI decision
Context: The tutorial includes interactive widgets requiring geographic context: showing the Tropic of Cancer/Capricorn relative to Iran, and selecting coordinates for prayer times and Qibla hour.
Options:
A. Clean, high-performance inline SVG vector map of the world and Middle East with clickable regions/latitudes and coordinate presets (Tehran, Mashhad, Isfahan, Tabriz, Mecca, Helsinki, etc.). 100% offline, lightweight (<50KB), fast on mobile.
B. Embedded offline raster tile map. Provides street/city-level detail, but requires several megabytes of bundled map image tiles.
AI Recommendation: A, because an interactive educational article focuses on astronomical concepts (latitudes, tropics, great circles) where a crisp vector map with key city presets is far more legible, responsive, and lightweight.
Your answer: A

## 2. Mathematical formulas and technical depth (سطح نمایش فرمول‌های ریاضی و نجومی)
Kind: AI decision
Context: The article explains solar declination, day length variations, and spherical Qibla trigonometry. The tone is intuitive and conversational, inspired by your channel notes.
Options:
A. Keep the narrative conversational and intuitive for everyone, but include an optional collapsible/accordion section «جزئیات محاسباتی و فرمول‌ها» (Calculation details & formulas) under each widget for mathematically curious readers or students.
B. Do not show any trigonometric formulas in the text; keep all mathematics entirely hidden behind the visual interactive sliders and buttons.
AI Recommendation: A, because it satisfies both casual readers seeking intuitive understanding and students/teachers who want to see the exact trigonometric equations behind the simulation.
Your answer: A

---

## Resolution

Submitted by user on 2026-11-15.

| Item | User response | Certainty | Behavior & Decision |
| --- | --- | --- | --- |
| 1. Visual map presentation | Explicit answer: A | Confirmed (`قطعی`) | Use lightweight, clean inline SVG vector maps with clickable latitude lines, zones, and key city coordinate presets. Zero remote tile dependencies, fully offline. |
| 2. Mathematical formulas depth | Explicit answer: A | Confirmed (`قطعی`) | Keep main narrative intuitive and conversational; provide optional collapsible/accordion sections («جزئیات محاسباتی و فرمول‌ها») under widgets for exact formulas and spherical trigonometry. |
