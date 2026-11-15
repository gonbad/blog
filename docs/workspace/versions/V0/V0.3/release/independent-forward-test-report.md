# Independent forward-test result

The requested small offline journal was produced without changing the source skills, contacting a host, installing dependencies, or deploying. All generated artifacts and temporary Moom copies are under `/tmp/workshop-journal-forward-2QvwL1`.

## Deliverables

- `journal/dist/index.html`: explicitly authored journal index linking a short article, a five-slide presentation, and both post ZIPs.
- `journal/dist/002-workshop-plan/index.html`: original article, “Plan the outcome before the agenda,” with a 90-minute example and a Python code block.
- `journal/dist/003-workshop-slides/index.html`: five independently authored slide fragments with a hero, a preparation split, an SVG chart, a code layout, and closing action cards. Every slide has speaker notes.
- `journal/dist/002-workshop-plan/downloads/workshop-plan-offline.zip`: standalone article with local CSS and an offline checksum manifest.
- `journal/dist/003-workshop-slides/downloads/workshop-slides-offline.zip`: standalone deck with local CSS, local SVG, and an offline checksum manifest.
- `deliverables/workshop-notebook-offline.zip`: the whole journal, including its authored index, both posts, both downloads, and release manifest. A sibling `.sha256` records its checksum.
- Editable presentation: `presentation/projects/001-workshop-slides/src/slides.json`, separate fragments under `src/slides/`, and assets under `src/assets/`.

The publication declares `https://example.invalid`. `publish:true` metadata only selects the local production input. No deployment adapter or deployment command was used.

## Checks actually run

The isolated copies installed presentation-maker and blog-publisher as separate Jobs and created their actual Projects using Moom. The initial source-skill versions were 0.2.0. The presentation copied Job hash was `3f66ed6530eb2cfd7cf8ecc6fe9fd7d063f8c9d407b95d830005f3a30e1af619`; the publisher copied Job hash was `6aca59dd44daa9c5d2c992aa693809de5ad616d9784542722a04639de77650e2`.

Representative commands (run from the corresponding temporary Moom copy):

```sh
python3 moom.py install presentation-maker
python3 moom.py new workshop-slides --first --title "Plan a Workshop"
python3 moom.py run scripts/render.py --input projects/001-workshop-slides/src/slides.json --output projects/001-workshop-slides/dist/index.html
python3 moom.py verify-job --smoke scripts/check.py
python3 moom.py finish-job
python3 projects/001-workshop-slides/src/agenda-example.py

python3 moom.py install blog-publisher
python3 moom.py new journal-index --first --title "The Workshop Notebook"
python3 moom.py new workshop-plan --title "Plan the outcome before the agenda"
python3 moom.py new workshop-slides --title "Plan a Workshop: five slides"
python3 moom.py verify-job --smoke scripts/smoke.py
python3 moom.py finish-job
python3 moom.py run scripts/build.py
python3 moom.py run scripts/check.py
```

The real publication build/check passed: 10 aggregate output files, exactly one index and two posts, and two standalone offline archives. Package hashes and local dependencies passed. The code printed `Ready: 90 minutes`. Both ZIPs were extracted into new directories and their manifest hashes verified. The additional whole-journal ZIP passed `ZipFile.testzip()` and the same real-output checker after extraction.

`browser-check.cjs` used the existing Playwright library with `/usr/bin/google-chrome`, offline browser contexts, file URLs, and aborting HTTP/HTTPS routes. The default Playwright launch failed because its cached Chromium/headless-shell binaries were absent; using installed Chrome resolved this without a download. Initial chart checks used an unjustified fixed intrinsic-size assertion for a viewBox-only SVG. Those assertions were corrected to test completed decoding, positive intrinsic size, and visible rendered width; the images loaded successfully.

After re-rendering the same realistic sample with the corrected renderer, the final browser report contains **53 passing checks and 0 failing checks**. Passing checks cover the explicit index links; desktop and 390×844 phone layouts; all five slides; the 16:9 canvas; preserved code whitespace after minification; loaded local chart; speaker notes; G, Tab, Left/Right, Space/Enter and Escape overview operation; focus containment; fullscreen; browser back/forward; a separately rendered RTL diagnostic; real CDP touch scrolling and swipes; phone overview tap selection; and the extracted article and deck ZIPs. No remote requests, failed local asset loads, or browser script errors were observed.

At 390×844, the landscape deck canvas remains small and centered. Each slide has a roughly 151-pixel-tall reading area with 16-pixel body text and vertical scrolling; all slide bottoms were reachable, and a vertical touch gesture kept the current slide while scrolling it. This is phone emulation, not a physical-device acceptance test.

## Corrected overview row-navigation defect

The earlier report found that Up and Down did not move focus between overview rows. The source maintainer corrected the renderer and requested a re-test. The updated `render.py` was copied into the existing isolated presentation Job; the article, index, slide fragments, SVG, CSS, code, notes, and browser assertions were retained. No source skill was modified by this evaluating agent.

Updated renderer SHA-256: `1629e8238dcce115cbe0e2ca6e261bb52f8917276570883114f20a28301bce4c`.
Updated isolated presentation Job digest: `10e116da4b00fd5016f891dea2ece75bd32bac30e57ed836a59b9b3bceb44e10`.

The same 900×700 geometry was reproduced: slides 1–4 on the first row and slide 5 immediately below slide 1. Down from slide 1 now focuses slide 5 (`data-goto=4`), and Up from slide 5 now focuses slide 1 (`data-goto=0`). Both previously failing checks pass. The prior 51 passing checks also pass.

Re-test commands were `python3 retest-row-fix.py` and `TMPDIR=/tmp/workshop-journal-forward-2QvwL1/scratch node browser-check.cjs`. The Python re-test script adopted the renderer copy, re-ran its representative smoke check, rendered the unchanged presentation, executed the Python example, rebuilt the actual journal, refreshed both extracted offline bundles and the RTL diagnostic, verified real output and package hashes, and regenerated/verified the whole-journal ZIP. Its console output is retained in `row-fix-build-console.txt`; copied-renderer provenance is in `row-fix-provenance.json`.

The refreshed presentation ZIP is 8,217 bytes; the refreshed whole-journal ZIP is 24,037 bytes. They retain the same artifact paths. The original report, failing browser result, screenshots, and previous renderer are preserved separately under `../reports-before-row-fix/`.

The supplementary phone-measurement JSON previously reused `width` and `scroll` keys for page and slide measurements. The re-test harness now nests page measurements so both sets remain visible; the original assertions and the current product artifacts were unaffected by that reporting correction.

## Review evidence and limits

`browser-report.json` and `browser-console.txt` preserve the corrected-renderer checks and reproduction geometry. `browser-report-initial.json` retains the first run, including the corrected SVG-test assumption. `phone-measurements.json`, desktop/phone screenshots, `publication-check.txt`, and `full-journal-zip-check.txt` are alongside this report. Reproduction scripts are at the temporary root: `author.py`, `verify-files.py`, `browser-check.cjs`, `package-journal.py`, and `retest-row-fix.py`.

Content fidelity was reviewed against the request and the saved source-to-result outline. The chart and code use the same five labels and minute values, totaling 90; that agenda is explicitly illustrative, with no empirical claim. The index links and per-post presentation styles were authored deliberately. Human editorial acceptance and native host command discovery have not been exercised or claimed.
