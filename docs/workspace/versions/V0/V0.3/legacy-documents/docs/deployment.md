# Blog status

Current project: `001-workshop-7` — introduction to the repeated-task workshop.
Dates: 19–20 November 2026 / 28–29 Aban 1405.
Content/build version: 0.1.1. Workspace progress now lives in the generated docs/status.md.

- First journal and eight-section post implemented.
- Build and offline ZIP produced from the actual projects through `moom.py run build` and the selected workflow revision's helper.
- Browser acceptance: passed locally and against the public HTTPS origin in Chrome, at 1440×960, 1366×768, 390×844 and 320×640. Normal/reduced-motion navigation, examples, reading mode, calendar and extracted offline interactions passed with no browser errors or failed requests. These are browser viewport checks, not claims about every physical device/browser.
- Offline delivery: ZIP extracted into a Persian path with spaces and opened with networking disabled; local fonts, examples, navigation and copy fallback passed.
- VPS hosting: published on the existing workshop server through a dedicated Traefik route and a Caddy backend bound to `10.0.1.1:8014`.
- Live journal: **https://blog.agent.kiloapp.ir/**
- Live post: **https://blog.agent.kiloapp.ir/001-workshop-7/**
- Deployment: `0.1.1-1c43ab914ef6`; 20 runtime artifacts matched the manifest, public ZIP checksum matched, registration health remained OK and other ingress routes were unchanged. HTTP redirects to HTTPS. The public frontend, Moom ZIP and handbook hashes were independently checked against the final build.
- Patch verification includes Up/Down after navigation/example/decision/download/copy controls, native Space/tab/text-editing behavior and actual offline materials. Six temporary-workspace lifecycle tests passed; the participant ZIP bootstrapped successfully, and the actual exported publishing method imported and built a different-input project without this repository.
- The actual fifth workshop is `workshops/public-workflow/`. This blog has projects 000-index and 001-workshop-7, a nine-stage specialized workflow, selected helper/resource snapshots and generated native command integrations. File checks do not assert discovery in every host UI.
- Preferred domain: `blog.kiloapp.ir` still resolves to a different IP. DNS access and a matching certificate are needed before changing the origin; the already valid `*.agent.kiloapp.ir` route provides the working first deployment.
- Owner review: short packet at [review-001.md](review-001.md); do not infer acceptance from implementation.

Audio, MP4 and auto-advance are deferred. The post contains no unconfirmed venue/hours/fees or link to an old event's registration flow.

Corrections returned to the method/Moom: [direct seeking](projects/001-workshop-7/issues/001.md), [hosting preflight](projects/001-workshop-7/issues/002.md), [focus after clicks](projects/001-workshop-7/issues/003.md), and [missing implementation](projects/001-workshop-7/issues/004.md). [Patch verification](projects/001-workshop-7/versions/V0.1.1/releases/0.1.1/verification.json) and [deployment](projects/001-workshop-7/versions/V0.1.1/releases/0.1.1/deployment.json) are retained. Source checkpoint: branch `codex/workshop-journal-v8`.
