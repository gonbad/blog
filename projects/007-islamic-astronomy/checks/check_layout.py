#!/usr/bin/env python3
"""Inspect static structure, expected controls, and bundled-asset constraints for 007-islamic-astronomy."""
from pathlib import Path
import re
import sys

def verify_layout():
    src_file = Path(__file__).resolve().parent.parent / "src" / "index.html"
    if not src_file.is_file():
        print(f"FAIL: {src_file} does not exist", file=sys.stderr)
        return False
    
    html = src_file.read_text(encoding="utf-8")
    errors = []

    # 1. RTL and language
    if 'dir="rtl"' not in html or 'lang="fa"' not in html:
        errors.append("Missing dir='rtl' or lang='fa' on html root")

    # 2. Key sections
    sections = [
        "intro", "section-zones", "section-sunpath",
        "section-daylength", "section-qibla", "section-moon", "conclusion"
    ]
    for s in sections:
        if f'id="{s}"' not in html:
            errors.append(f"Missing section ID: {s}")

    # 3. Figures
    if 'id="fig-lunar-elongation"' not in html:
        errors.append("Missing Figure 2: fig-lunar-elongation (Earth-Sun-Moon elongation angle diagram)")

    # 4. Widgets 1 to 6
    for i in range(1, 7):
        if f'id="widget-{i}"' not in html:
            errors.append(f"Missing widget ID: widget-{i}")

    # 5. Check for remote runtime scripts or stylesheets (CDNs)
    if re.search(r'<(script|link)[^>]+(src|href)=["\']https?://', html):
        errors.append("Detected external CDN or remote runtime script/link dependency")

    # 6. Home link
    if 'data-home-link' not in html:
        errors.append("Missing data-home-link attribute on navigation back link")

    # 7. Widget 2 azimuth, time range, jump buttons and defaults
    if 'value="tehran" selected' not in html:
        errors.append("Widget 2 missing default city Tehran")
    if 'min="180"' not in html or 'max="1320"' not in html:
        errors.append("Widget 2 time slider must allow early morning (min=180 / 03:00) to night (max=1320 / 22:00)")
    for btn_id in ['w2-btn-sunrise', 'w2-btn-noon', 'w2-btn-sunset']:
        if f'id="{btn_id}"' not in html:
            errors.append(f"Widget 2 missing jump button: {btn_id}")
    for el_id in ['w2-path-ground', 'w2-rise-marker', 'w2-set-marker', 'w2-shadow', 'w2-hour-hand', 'w2-min-hand']:
        if f'id="{el_id}"' not in html:
            errors.append(f"Widget 2 missing compass element: {el_id}")
    if 'w2-date-today' not in html or 'initTodayAndNow' not in html:
        errors.append("Widget 2 missing today/now default initialization and preset controls")

    # 8. Widget 4 today preset and qibla calculation
    if 'w4-date-today' not in html:
        errors.append("Widget 4 missing today date preset button")

    # 9. Widget 6 circle alignment, angle visualization, and mid-month full moon
    if '<circle cx="0" cy="0" r="22" fill="#1f2937"/>' not in html:
        errors.append("Widget 6 Earth-view circle must be centered at cy='0' to prevent vertical misalignment with crescent")
    for el_id in ['w6-moon-line', 'w6-angle-arc', 'w6-angle-text']:
        if f'id="{el_id}"' not in html:
            errors.append(f"Widget 6 missing dynamic angle element: {el_id}")
    if 'در تمام طول شب در آسمان' not in html:
        errors.append("Widget 6 missing mid-month (full moon) entire-night observation description")

    # 10. Taqwim Ebrahimi links
    if 'cafebazaar.ir/app/?id=info.alqiblah.taqwim' not in html:
        errors.append("Missing Taqwim app Cafe Bazaar link")
    if 'play.google.com/store/apps/details?id=info.alqiblah.taqwim' not in html:
        errors.append("Missing Taqwim app Play Store link")

    if errors:
        for err in errors:
            print(f"FAIL: {err}", file=sys.stderr)
        return False

    print("OK: Static HTML structure and required controls found; browser behavior and calculations need separate checks.")
    return True

if __name__ == "__main__":
    if not verify_layout():
        sys.exit(1)
