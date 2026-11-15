# V7.5 — Applied changes and verification

Implemented the approved [analysis](02-analysis.md) on 5 November 2026 across public-agent Codo, its Persian book and the active presentation.

**Codo and book**

The canonical [service-boundaries guide](../../../workshops/public-agent/codo/docs/references/service-boundaries.md) now connects the whole workflow: `/tools` inventories existing APIs, owned backends and API bridges; later specifications refine their operations; reviewed OpenAPI contracts precede `/build`. Planning and build instructions cover every required component and separate business state from agent state.

The revised `/wire` requires protected account/OTP login and restored-session evidence. `/deploy` covers all owned components, browser dependencies, secure session transfer and verification after restart under the actual service identity. Templates, entry files, privacy guidance, prompt/error examples and book chapters 6–8 match these requirements. Backend outcomes receive natural, accurate replies; final business validation stays in the backend.

Personal-account channels recommend direct/soft confirmation for eligible actions and explain code-based hard approval before selection. Protected financial, destructive and sensitive actions retain independent approval. The existing registration agent's architectural refactor remains deferred as requested.

**Presentation**

Content pages **116–118** now distinguish general agents, **«ایجنت‌های تخصصی کدنویسی»** and purpose-built producer agents. Page 118 switches among five assistants and five products: site, agent, research, translation and authorship, showing the relevant files and review criteria. Page 117 has four stages showing shopping assistance and reuse through skills/scripts. Titles, visible controls, speaker notes and source links are synchronized. The deck retains 167 content pages and 25 route maps.

The Hermes explanation was checked against its [official skills documentation](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills/). Its shopping sequence is an educational example, without promising automatic coding after a fixed number of repetitions. The shared `.agents/skills` packaging also matches Antigravity's [current skills path](https://antigravity.google/docs/migration/workflows-to-skills/).

**Verification**

- All four existing Node suites pass; the journeys suite also checks independent assistant/product selection across all 25 combinations.
- The offline browser regression passed **439 interaction states**, with no script errors, network requests or clipping. [Evidence](assets/presentation-interactions.json).
- The new [production-page browser check](../../../scripts/verify_presentation_production.cjs) passed **60 states** at 1600×960 and 1366×768, including every assistant/product combination. It also passed against the extracted ZIP from a directory containing spaces. [Evidence](assets/portable-production-checks.json).
- The extracted deck passed **108 retained interaction states**, including all **six PDF downloads**, loaded fonts/images and numeric slide search. [Evidence](assets/portable-retained-checks.json).
- Both Codo archives contain **98 Markdown/template files**, including 16 canonical commands and 48 generated copies. Source parity, shared entry-file parity, reference paths and exclusion of local/session artifacts were checked. [Evidence](assets/package-checks.json).
- The book rebuilt with the Persian RTL gate enabled; the PDF contains **22 pages**. The new contracts page was visually inspected. `git diff --check` passes.

For browser checks, provide Playwright through `PLAYWRIGHT_MODULE` if it is not installed locally; `CHROME_BIN`, `DECK_DIR` and `REVIEW_DIR` select the browser, input folder and evidence destination.

**Deliverables**

- [Codo Agent 7.5](../../../workshops/public-agent/dist/codo-agent-7.5.zip), with [codo-7.5.zip](../../../workshops/public-agent/dist/codo-7.5.zip) as the alternate package name.
- [Updated book PDF](../../../workshops/public-agent/dist/book.pdf).
- [Portable presentation ZIP](presentation-v7.5.zip), with all 39 files checked byte-for-byte against the active folder. [Manifest](assets/presentation-package.json).
- Visual previews: [comparison](assets/comparison.png), [text-product workbench](assets/authorship.png), [Hermes reuse](assets/hermes-reuse.png).

Live personal-account login and server acceptance remain checks to perform in a generated participant project. The checks above verify the workshop materials, packages and presentation; they do not claim a live Eitaa connection or deployment.
