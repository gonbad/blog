# 04-layout-review: Layout and Interactive Visual Verification

- Project: `007-islamic-astronomy`
- Version: `0.1`
- Public Source: `projects/007-islamic-astronomy/src/index.html`
- Checks Script: `projects/007-islamic-astronomy/checks/check_layout.py`

---

## 1. Verification Evidence
- **Structure & Narrative:** Full Persian text from `living/content.md` implemented across 7 major sections (`#intro`, `#section-zones`, `#section-sunpath`, `#section-daylength`, `#section-qibla`, `#section-moon`, `#conclusion`).
- **Figure 1:** Inline SVG map dividing the globe into 3 latitudinal zones with marked Tropics ($23.44^\circ$N & $23.44^\circ$S).
- **All 6 Interactive Widgets Implemented:**
  1. `widget-1`: 3-Zone World Map & Noon Shadow Simulator.
  2. `widget-2`: Solar Daily Path, Gnomon Shadow & Analog Clock (defaults to Tehran, 11 Khordad; prominent solar noon / زوال marker).
  3. `widget-3`: Annual Day Length vs Latitude sinusoidal chart ($0^\circ$ to $68^\circ$).
  4. `widget-4`: Solar Qibla Hour Calculator with interactive compass and exact minute readout.
  5. `widget-5`: Lunar Daily Calendar (Day 1 to 30) with elongation angle $\theta$, sunrise/sunset vs moonrise/moonset timelines (~50-min daily shift), and visible phase rendering.
  6. `widget-6`: 3D Lunar Orbital Phase Simulator with northern hemisphere 'p' vs 'q' badge.
- **Offline & Network Independence:** Zero remote runtime scripts, CDNs, or external stylesheets. 100% self-contained local SVG, Canvas, and vanilla JavaScript.
- **Accessibility & Typography:** Proper RTL shaping (`dir="rtl" lang="fa"`), LTR isolation for numbers and math symbols, responsive breakpoints, high contrast, and print stylesheets.
- **Automated Check:** `python3 projects/007-islamic-astronomy/checks/check_layout.py` passed with code 0.
