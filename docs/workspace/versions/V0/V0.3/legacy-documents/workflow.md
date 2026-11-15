# Blog workflow — a configured Moom job

This workspace uses the fifth workshop's [Moom kit](../workshops/public-workflow/moom/README.md). The actual method is [docs/job/workflow.json](docs/job/workflow.json); complete step instructions are [docs/job/procedures/](docs/job/procedures/). It was extracted from the real first post and is a candidate for the owner's review.

Resolve version documents from state.docs. Each round has a new numbered file; preserve submitted rounds. Separate option-based questions (exactly one Recommended) from uncertain decisions (Confirmation / override). Before implementing a new post, put its page plan, reader actions, questions, uncertain decisions and proposed overrides in **docs/projects/ID/versions/VVERSION/NNN-review.md**, with empty Answer fields. Link the file and wait for submission. Do not ask project questions in chat or interactive question tools. Reread the submitted file, preserve answers/COMMENTs, then record decisions.md. After submission, the owner's policy delegates blank fields as soft project-local choices: proceed, record the default, and do not make it a hard or reusable rule. Do not ask again about delegated blanks. New material choices that cannot reasonably be decided get a new numbered round.

The assistant owns research.md (verified claims, primary sources, check dates). Owner-supplied assets are tracked in inputs.md with owner, required stage, exact path and blocking scope. These are explicit parts of brief/content rather than tasks silently left to the owner. Workflow 0.5 adds primary-input/source-fidelity checks and both version-entry routes, alongside numbered rounds, delegated blanks and selected-project verification. Post 001 retains its pinned 0.1 method and V0.1.1 content.

Actual source projects:

- [000-index](projects/000-index/): authored root page and literal newest-first links.
- [001-workshop-7](projects/001-workshop-7/): workshop inputs, site source, declared downloads and patch version.
- [002-claude-server](projects/002-claude-server/): V0.2, applied from the owner-created [primary input](docs/projects/002-claude-server/versions/V0.2/01-transcription.md); see its [source/actor mapping](docs/projects/002-claude-server/versions/V0.2/story.md).

From the repository root, use `python3 blog/moom.py status`. From inside blog/, the commands are:

| Stage / native command | Real procedure | Main artifact |
|---|---|---|
| `/blog-brief` | [brief](docs/job/procedures/brief.md) | Project brief, confirmed inputs and source metadata |
| `/blog-story` | [story](docs/job/procedures/story.md) | A useful scene and reading structure |
| `/blog-content` | [content](docs/job/procedures/content.md) | Actual copy, claims and resources |
| `/blog-fidelity` | [fidelity](docs/job/procedures/fidelity.md) | Actual result matched to the primary source and actor assignments |
| `/blog-style` | [style](docs/job/procedures/style.md) | Visual and interaction decisions |
| `/blog-sample` | [sample](docs/job/procedures/sample.md) | A representative functioning sequence |
| `/blog-build` | [build](docs/job/procedures/build.md) | Complete source in projects/ID/site/ |
| `/blog-check` | [check](docs/job/procedures/check.md) | Browser/content review, including focus after clicks |
| `/blog-package` | [package](docs/job/procedures/package.md) | Actual offline ZIP and material downloads |
| `/blog-publish` | [publish](docs/job/procedures/publish.md) | Verified VPS release and hand-edited root link |

Codex invokes the same names with `$`, for example `$blog-build`. Plain-language requests route equivalently. A stage has a question/review loop only for unresolved decisions; existing instructions and authorization carry forward.

```sh
python3 moom.py procedure blog-build
python3 moom.py run preview
python3 moom.py run build
PLAYWRIGHT_MODULE=/tmp/workshop-blog-qa/node_modules/playwright python3 moom.py run verify
python3 moom.py run deploy
```

Prepare this workshop post's real participant materials first with `python3 workshops/public-workflow/tools/package.py` from the repository root. Draft previews are flagged and rejected by the deployment helper. Index content is never generated from the project registry. Frozen method revisions bundle the selected helper code and deployment templates; later projects can select a different hosting adapter instead of inheriting authorization to this owner's VPS.

See [versions.md](versions.md) for source snapshots, version documents, project roadmaps, and the exact V0.2 example for post 001.

New versions have two entry routes: /iterate or /workflow creates a version folder with 01-request.md from an authorized change/roadmap idea; alternatively, the owner creates that folder and a primary 01-*.md file and the assistant adopts it with --input. Both preserve source history and owner input. Read that primary input before inherited specifications and check source-to-result fidelity separately from appearance/functionality.

Process/deviation analysis for this workspace: [workshop V8.0 diagnosis](../workshop_docs/versions/V8.0/10-post-002-v02-deviation-analysis.md). Read the current primary input before inherited project documents. Both /iterate-created 01-request.md and owner-created 01-*.md folders are supported; see [versions.md](versions.md).
