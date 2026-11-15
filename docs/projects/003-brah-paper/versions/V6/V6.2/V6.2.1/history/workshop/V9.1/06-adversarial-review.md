# V9.1 — Adversarial implementation review

Reviewed on **2026-11-11** against Workshop commit `a9020c7b64aab51965cc7bf062fef7edcf3b5638` and Moom submodule commit `ada418d52e02e0b7efaa4a11ad3e15ee85f81c40` (`v0.3.0`). The implementation diff is `a6332cd..a9020c7`.

**Verdict: V9.1 is incomplete.** The product files were preserved, but the blog cannot perform ordinary Moom project operations, the reusable publisher does not build a deployable release, and the migrated publications are absent from the live site. There are **13 confirmed findings: six P1 and seven P2**. P1 means a release blocker or a failure of a central requirement; P2 means a concrete functional regression or requirement gap.

The review follows the transcription, analysis, creator comments, and subsequent rounds in order. In particular, deleting the rendered `presentation-archive/` drafts was explicitly authorized in round 3; that deletion is **not** a finding. The separate requirement to preserve the products' decision history inside their blog projects still applies.

## Findings at a glance

| ID | Priority | Finding |
| --- | --- | --- |
| F1 | P1 | The migrated workspace omits state required by the new engine. |
| F2 | P1 | The public blog still serves the previous release; both migrated posts return 404. |
| F3 | P1 | The reusable build omits release metadata, offline packages, participant downloads, and minification. |
| F4 | P1 | The builder publishes drafts and can copy private project inputs and secrets into `dist/`. |
| F5 | P1 | The advertised check validates hard-coded sample HTML and never examines the publication. |
| F6 | P1 | Complete historical dossiers were replaced with a few short summaries and inconsistent version records. |
| F7 | P2 | Legacy host commands and executable documents remain active with incompatible instructions. |
| F8 | P2 | The documented build command reports success while building nothing from the repository root. |
| F9 | P2 | The presentation job still cannot produce independently authored HTML slides or rich slide content. |
| F10 | P2 | Ordinary slide content is clipped on portrait phones. |
| F11 | P2 | Rebuilding retains withdrawn files and removed publications. |
| F12 | P2 | Presentation shortcuts intercept keyboard activation of overview buttons. |
| F13 | P2 | Relocation breaks the existing presentation verification scripts. |

### F1 — P1: Complete the workspace state migration

**Locations:** [blog/workspace.json](../../../blog/workspace.json), especially the Job object and all five Project objects; [engine state consumers](../../../blog/.moom/core/moom.py), lines 300–343, 639–654, 763–781, 817–820, and 1173–1185.

The new state is accepted by `status` and `check`, but it is not a valid working state for the installed engine. The Job lacks `status`; every Project lacks `id`, `milestones`, and `job_observed`. Existing milestone records remain in the legacy `docs/projects/*/state.json` files instead of being migrated into authoritative state. The engine's managed release baseline, `.moom/managed.json`, is also missing.

Reproduced in a temporary copy of the migrated blog:

| Command | Result |
| --- | --- |
| `python3 moom.py switch 001-workshop-7` | Exit 1: `Moom: 'status'` |
| `python3 moom.py record build --artifact projects/004-agent-presentation/site/index.html` | Exit 1: `Moom: 'milestones'` |
| `python3 moom.py iterate --target project --project 004-agent-presentation --version 7.5 --note 'Review probe'` | Exit 1: `Moom: 'id'` |

The read-only update preview, `python3 blog/moom.py update --source moom`, also fails because `blog/.moom/managed.json` does not exist. The failed switch is particularly misleading: `save()` writes `workspace.json` before the dashboard raises the missing-`status` error, so the active project changes despite the failed command.

**Required correction:** Migrate the full engine schema and legacy progress records, install the release ownership baseline and current engine documents, and regenerate living views. Verify switching, recording, iteration, adaptation, and update preview on the migrated workspace. Passing the pristine-template tests does not exercise this imported state.

### F2 — P1: Publish and verify the consolidated release

**Locations:** [source index](../../../blog/projects/000-index/site/index.html), lines 27–34; the new [paper status](../../../blog/docs/projects/003-brah-paper/living/status.md) and [presentation status](../../../blog/docs/projects/004-agent-presentation/living/status.md), which both say `Published: Yes`.

The owner's observation is confirmed. The source index contains all four post cards, while the configured public origin serves the previous publication. Direct public HTTPS GETs on 2026-11-11 returned:

| Public resource | Observed result |
| --- | --- |
| [Blog index](https://blog.agent.kiloapp.ir/) | HTTP 200; two post cards, linking only to `001-workshop-7/` and `002-claude-server/`. |
| [Migrated paper](https://blog.agent.kiloapp.ir/003-brah-paper/) | HTTP 404. |
| [Migrated presentation](https://blog.agent.kiloapp.ir/004-agent-presentation/) | HTTP 404. |
| [Public release manifest](https://blog.agent.kiloapp.ir/release.json) | HTTP 200; only projects `000-index`, `001-workshop-7`, and `002-claude-server`. |

The manifest's index hash matches the index actually served: `e14847517773274d3996ee32d8bdcc0aed0723260e59d0409ad678bcdfcef1e5`. This establishes that the public origin serves the old release; it is not merely a missing local index card. The pre-existing local, ignored `blog/dist/release.json` was also byte-identical to that public manifest.

**Required correction:** After repairing the build, deploy a complete release to the configured origin and verify the index, both post URLs, their downloads, and the public release hashes. Record actual publication evidence before marking the migrated posts published. This review performed public reads only and did not deploy anything.

### F3 — P1: Make the extracted publisher build a complete release

**Locations:** [installed build helper](../../../blog/job/blog-publisher/scripts/build.py), lines 10–24 and 43–49; [catalog copy](../../../moom/registry/blog-publisher/scripts/build.py); [build procedure](../../../blog/job/blog-publisher/commands/build.md); [deployment preconditions](../../../blog/tools/deploy.py), lines 134–143.

The helper only copies directories. It does not execute project builds, generate per-project distributions, copy declared participant materials, package offline ZIPs, or write `release.json`. Its files are byte-identical in the installed Job and the public Moom catalog, so the incomplete behavior ships to future Kandoos too.

A clean build from a temporary copy reports success but lacks every one of these required outputs:

```text
001-workshop-7/downloads/moom-0.1.zip
001-workshop-7/downloads/handbook-0.1.html
001-workshop-7/downloads/workshop-7-v0.1.1.zip
002-claude-server/downloads/claude-server-v0.2.zip
003-brah-paper/downloads/brah-paper-v6.2.zip
004-agent-presentation/downloads/agent-presentation-v7.4.zip
release.json
```

The first post's materials are explicitly declared in its [project metadata](../../../blog/projects/001-workshop-7/project.json). The existing deployment helper rejects the fresh result with `FileNotFoundError` for `dist/release.json`, before any network operation. Building over an existing distribution does not refresh that manifest either.

Minification is also absent: the generated paper HTML and its source are identical at **96,052 bytes**. The `/build` procedure promises a minimized `projects/ID/dist/`, but the helper copies all projects into workspace `dist/` and creates no such project output. The `/package` and `/deploy` documents give general instructions without integrating the existing production helpers that implement those operations.

**Required correction:** Extract the real publication behavior into the reusable Job: project output, declared materials, offline packaging, minimized assets, and consistent release metadata consumed by deployment. Verify a complete build from a clean checkout, without relying on ignored ZIPs or a previous `dist/` tree.

### F4 — P1: Restrict distribution to explicitly public artifacts

**Locations:** [build helper](../../../blog/job/blog-publisher/scripts/build.py), lines 11–24 and 43–48; [native Project creation](../../../blog/.moom/core/moom.py), lines 595–609.

The builder ignores project metadata, including `publish: false`. More seriously, if `site/` is absent it treats the entire Project directory as public output. A native Moom Project starts with `inputs/`, `src/`, and `dist/`, so this fallback is on the normal path for new users of the extracted Job.

A synthetic fixture containing an unpublished post and a native-layout project produced these public files:

```text
005-unpublished/index.html
006-native/inputs/private-notes.txt
006-native/secrets/dummy.txt
006-native/src/index.html
006-native/versions/V0.1/notes.md
```

The unpublished post had `publish: false`. The private-input and secret files contained review markers only; no real credentials were used. The builder returned exit 0. It also left the native Project without an `index.html` at its public root. Skipping dotfiles at the top level does not make copying whole nested directories safe.

**Required correction:** Require an explicit public artifact boundary and a valid entry point. Honor publication state and reject missing public output instead of falling back to the Project root. Keep inputs, secrets, source history, and working documents out of deployment and offline packages.

### F5 — P1: Check the actual publication

**Locations:** [installed check helper](../../../blog/job/blog-publisher/scripts/check.py), lines 17–22 and 33–49; [catalog copy](../../../moom/registry/blog-publisher/scripts/check.py); [README verification claim](../../../blog/README.md), lines 25–26.

Executing the Job's check always parses its hard-coded `sample_html`. It does not inspect a selected Project, `dist/`, any asset file, or any link. Running it in a fixture whose only post contains an external script plus missing CSS and images still exits 0 with:

```text
Blog publisher smoke check: zero remote asset leaks verified.
```

Even if `check_html()` is called directly, a protocol-relative script (`<script src="//invalid.example/code.js"></script>`) passes because line 19 expressly excludes `//` values. External CSS font URLs and missing local assets also pass. The README's `python3 blog/moom.py check` validates engine records and generated adapters; it is not a publication asset check.

**Required correction:** Keep a smoke test clearly labeled as such, and provide a separate real-artifact check that traverses the selected output, validates local references, and catches remote dependencies in HTML and CSS. Corrupting a built post must cause the check to fail. Neither current check supports the implementation document's offline verification claim.

### F6 — P1: Preserve the requested decision history faithfully

**Locations:** The [paper version dossiers](../../../blog/docs/projects/003-brah-paper/versions/) and [presentation version dossiers](../../../blog/docs/projects/004-agent-presentation/versions/); [round 2 archival decision](03-analysis-round-2.md); [original request](01-transcription.md).

The creator explicitly rejected compressing the products' history into three milestones: “no. keep entire history.” The new paper dossier contains only four short `01-input.md` files totaling **36 lines**; the presentation contains four totaling **34 lines**. Neither dossier contains the original transcripts, analyses, review rounds, or creator comments. The source descriptions are generic text such as “Workshop V7.4 comprehensive structural revision,” without precise source-file links or a decision-by-decision provenance map.

The record is also internally inconsistent. Both living ledgers call the active version `V2.1`, whereas authoritative state calls them `6.2` and `7.4`. The `V6/V6.2/01-input.md` and `V7/V7.4/01-input.md` files are duplicates of the `V2.1` ingestion notes and still have `Milestone V2.1` headings. Their version records label these generated summaries `owner-prepared` and `published`.

The permission to remove intermediate rendered presentation archives does not replace the distinct requirement to retain the products' decision history inside their projects.

**Required correction:** Import or precisely preserve the relevant original decision records, retain their creator feedback and provenance, and map the original releases to the Project timeline honestly. Reconcile living ledgers, version metadata, and authoritative state. Clearly distinguish reconstructed migration notes from actual owner inputs and historical approvals.

### F7 — P2: Finish migrating host adapters and executable documents

**Locations:** [legacy Claude build command](../../../blog/.claude/commands/blog-build.md), lines 5–7; [legacy Codex skill](../../../blog/.agents/skills/blog-build/SKILL.md); [workflow entry document](../../../blog/workflow.md); `blog/docs/commands/` and `blog/docs/job/procedures/`.

Each host now has 43 command/skill files, of which **24 still contain legacy dispatch instructions**. Those adapters call `status --json`, `procedure blog-build`, and helpers such as `run build` or `run preview`. The new engine rejects those forms:

```text
status --json          -> unrecognized arguments: --json
procedure blog-build  -> Moom: Unknown Job procedure
run build             -> Choose a reviewed active Job Python helper under scripts/
```

The new names coexist with broken `/start`, `/blog-build`, and other familiar commands. `workflow.md` still routes readers to the old engine and pinned workflow model. Fourteen executable command documents and ten current procedure documents remain under `docs/`, contradicting the claimed separation of code-like documents from the human vault.

**Required correction:** Migrate or explicitly retire the old command surfaces and update entry documents. Preserve historical procedures as history while routing active commands to the current Job and engine.

### F8 — P2: Resolve the workspace independently of the caller's directory

**Locations:** [README build command](../../../blog/README.md), line 29; [build helper](../../../blog/job/blog-publisher/scripts/build.py), lines 33 and 43–49.

The README's command is expressed for the repository root:

```sh
python3 blog/job/blog-publisher/scripts/build.py --output blog/dist
```

The helper uses `Path.cwd()` to locate `projects/`. From that directory there is no root-level `projects/`, so it exits 0 and prints `Built blog to ...` without processing any Project. Reproduced with a fresh temporary output directory: **zero files**, successful exit. With an existing output, old content simply remains available.

**Required correction:** Resolve the workspace from the Job/Moom context or require it explicitly, and fail when the input publication is missing. Verify both the documented repository-root invocation and normal Moom dispatch.

### F9 — P2: Provide the required per-slide HTML authoring path

**Locations:** [presentation renderer](../../../moom/registry/presentation-maker/scripts/render.py), lines 35–50; [draft procedure](../../../moom/registry/presentation-maker/commands/draft.md).

The presentation job still requires title and body strings, with the body always HTML-escaped into one fixed `<div>`. Its new Markdown parser also turns slide content into those same plain strings. There is no supported slide-HTML input, independent slide layout, or asset-packaging path.

A slide body containing `<img src="assets/chart.svg">` and `<pre><code>...</code></pre>` produces **zero image, pre, or code elements**; the markup appears as literal text. A separate `html` field is ignored. This retains the constrained content model criticized in round 1 and does not satisfy the transcription's independently authorable HTML-slide requirement. Adding navigation chrome has not supplied that authoring capability.

**Required correction:** Support deliberate, authored slide HTML/layouts and local assets while retaining appropriate escaping for plain source text. Verify a representative deck containing an image, formatted code, and distinct slide compositions.

### F10 — P2: Keep slide content accessible on portrait phones

**Locations:** [presentation CSS](../../../moom/registry/presentation-maker/scripts/render.py), lines 83–108 and 135–154.

Browser reproduction: render a slide with a normal heading and five short points, then open it via `file://` at **390 × 844**. The 16:9 canvas measures approximately **366.6 × 206.2 px**. The last character's bottom is **623.0 px**, while the canvas ends at **525.1 px**. Its scroll height is 307 px for a 204 px client height, with `overflow: hidden`; document scrolling is disabled too.

The same content fits at desktop and landscape-phone sizes. In portrait orientation, part of the slide is inaccessible. A rotation hint does not recover the hidden text or implement responsive content handling.

**Required correction:** Adapt content sizing/layout or provide an accessible overflow mechanism within the landscape-first presentation design. Verify readable, reachable content at phone portrait and landscape sizes.

### F11 — P2: Remove withdrawn content from rebuilt distributions

**Location:** [build helper](../../../blog/job/blog-publisher/scripts/build.py), lines 14–24 and 35–48.

The helper creates output directories but never removes obsolete files from them. It replaces copied subdirectories, yet old top-level files remain. Entire removed Projects also remain in workspace output.

Reproduction: build a post containing `index.html` and `withdrawn.html`; delete `withdrawn.html` from source; rebuild into the same output. `dist/001-test/withdrawn.html` still exists. Since deployment transfers `dist/`, withdrawn material stays public even though it is absent from the source publication.

**Required correction:** Assemble each release from its current public inputs into a clean staging tree and replace the previous output after successful validation. Check file removal and Project removal as well as additions.

### F12 — P2: Let keyboard users activate overview controls

**Location:** [presentation keyboard handler](../../../moom/registry/presentation-maker/scripts/render.py), lines 380–417.

The document-level handler exempts inputs and textareas but intercepts Space on buttons and while the overview is open. Reproduced in the browser: open the overview, focus the third slide card, press Space. The renderer advances the background presentation to `slide-2` and leaves the overview open, instead of activating the focused third-card button. The handler prevents the button's native keyboard click.

**Required correction:** Give focused controls and the open overview their keyboard behavior before applying presentation-wide shortcuts. Verify overview selection and navigation after clicking or tabbing to controls.

### F13 — P2: Update verification consumers of the relocated presentation

**Locations:** [learning checks](../../../scripts/verify_presentation_learning.cjs), line 8; [journey checks](../../../scripts/verify_presentation_journeys.cjs), lines 4 and 55; [lesson checks](../../../scripts/verify_presentation_lessons.cjs), lines 4–5 and 50; [scene checks](../../../scripts/verify_presentation_scenes.cjs), lines 9–13.

All four existing checks still import or read `../presentation/...`. Running each from the repository root now exits 1 immediately:

```text
node scripts/verify_presentation_learning.cjs  -> MODULE_NOT_FOUND: ../presentation/learning.js
node scripts/verify_presentation_journeys.cjs  -> MODULE_NOT_FOUND: ../presentation/journeys.js
node scripts/verify_presentation_lessons.cjs   -> MODULE_NOT_FOUND: ../presentation/lessons.js
node scripts/verify_presentation_scenes.cjs    -> ENOENT: .../presentation/story.js
```

The production browser script also defaults to the removed directory, although it can accept `DECK_DIR`. This is a verification regression caused by relocation; it does not establish that the copied deck's numerical models are broken.

**Required correction:** Update the verification paths or make the checks resolve the selected publication, then run them against the migrated source and packaged output.

## Verification performed and limits

- Compared the old products at `a6332cd` with their new source locations: the paper's one tracked file and the presentation's **33 tracked files** are byte-for-byte identical. The core content migration succeeded.
- Ran `python3 -m unittest discover -s tests -v` in `moom/`: **15 tests passed**. Ran `python3 tools/release.py --check`: passed. These exercise the template lifecycle and release consistency, not the migrated blog schema or complete publishing behavior.
- Ran the blog's `status`, engine `check`, procedure lookup, and update preview. The first two pass despite the missing fields documented in F1.
- Reproduced state-changing failures in temporary workspace copies. Built into fresh temporary outputs, checked synthetic unpublished/private fixtures, tested stale-file removal, and inspected real renderer output in Chrome through Playwright at desktop and phone sizes.
- Queried the public index, both migrated post URLs, and public release manifest using unauthenticated HTTPS reads. The default proxy could not reach these hosts; direct HTTPS requests succeeded at the configured origin and supplied the F2 evidence.
- Ran the four existing presentation checks and recorded their relocation failures.

No implementation fixes or deployment were performed. Temporary fixtures used synthetic private markers. The review's repository change is this document; unrelated work was left untouched.

## Completion evidence needed after fixes

1. A migrated blog that can switch Projects, record a result, open the next version, and preview a Moom update without missing-field or missing-baseline errors.
2. A clean build that includes all intended publications, participant materials, standalone offline packages, minimized assets, and a current release manifest, while excluding drafts/private inputs and removing withdrawn files.
3. Artifact checks that fail on broken local assets and remote dependencies, plus restored presentation verification and browser checks for rich slides, phone layouts, and overview keyboard selection.
4. Full, traceable historical dossiers with consistent Project versions and living state.
5. Public verification showing the four-card index, HTTP 200 for both migrated publications and their downloads, and release hashes matching the actual deployed files.
