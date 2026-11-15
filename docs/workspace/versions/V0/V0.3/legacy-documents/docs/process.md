# Moom working procedure

## Resume from files

Read profile, workspace/project state and the selected workflow. Keep one writing session per workspace. Resolve the project at the start of an operation; switching the workspace selection must not change the target halfway through it. Load the current stage and its inputs instead of every project's history.

## Ask, build, review

Before implementing a change, read its primary version input, identify superseded instructions, and write a source-to-result contract. Preserve the owner's central problem and distinguish reader actions from work delegated to an AI or another actor. Record requested sequence, artifact-specific language, required inputs and removed content. Inherited documents and attractive prior output do not outrank the new source. Check actual copy against that contract before layout/functionality checks. Keep sourced facts, owner-supplied claims and delegated implementation choices distinct; do not turn a secondary benefit into the primary message or silently replace the requested story with editorial caveats.

Process/deviation analysis follows the configured workspace location. Here it is the repository's workshop_docs/versions/V8.0/. Project version docs hold project changes, content decisions and release evidence, not another copy of the process analysis. Correct actual methods/code where they live after diagnosing the failure.

Only /start collects missing universal facts in chat. For project review, resolve the version's document directory from the selected state's docs field: docs/projects/ID/versions/VVERSION/. Every review round gets a new numbered file there: 001-review.md, 002-review.md, etc. Use review-round to allocate the next file; never reuse a submitted round. Preserve answers and COMMENTs, record decisions and overrides in decisions.md, and carry forward resolved items instead of asking them again.

Keep two separate sections in each round. **Questions** need 2–3 concrete options with exactly one labelled Recommended and an empty Answer field. **Uncertain decisions** state the assistant's proposed decision and why it is uncertain, followed by an empty Confirmation / override field. They are not option-based questions. Include the planned result/page sequence and reader actions where relevant.

Link the numbered file and wait for saved answers. Do not ask project questions in chat, polls or question tools. Reread submitted answers; before submission, silence and elapsed time are not answers. Once the owner submits the round, blank question/decision fields mean they do not care: choose a reasonable project-local default, record it as delegated (not confirmed), and continue. Never turn such a choice into a hard requirement, inferred preference, or reusable method rule. Do not repeatedly ask about delegated blanks. Before submission, continue to wait. Ask a new numbered round only for a material unresolved choice that cannot reasonably be decided. Preserve previous rounds.

Research is assistant-owned: record primary sources and check dates in research.md. Owner-supplied inputs specify the owner, required stage, exact destination and blocking scope in inputs.md. Do not delegate a lookup or screenshot to the owner when the assistant can obtain it. Independent research and requested workflow corrections may proceed; dependent implementation waits.

Use pending_review in project state to show the numbered file, state:waiting and dependent milestone. The review-round helper creates it. After reading answers, mark the old round answered (not blanket approved), preserve it in review_history, and record the resolved decisions before opening another round. This is a cooperative procedure record; the CLI does not interpret free-text approval.

Present a short decision packet: new proposals, overridden ideas, uncertain interpretations and the artifact to inspect. Carry forward what the owner already supplied. Full documents remain available; do not require a complete PRD reread. Apply COMMENT/نظر feedback; ask again only when it introduces a material unresolved choice. Existing task authorization covers routine reversible implementation and fixes.

Record artifact readiness with `moom.py record STEP --artifact PATH`. Record acceptance only with `--state accepted --evidence` naming the actual user approval of that revision. A passing test, a comment or an approval of an earlier revision is not new approval. These are cooperative workflow records, not an independent security boundary.

## First real work, then reuse

/job starts Project 001 immediately, captures its brief, produces a representative real result and extracts the first specialized recipe. Reuse /job on resumption without duplicating that project. /project creates later instances using the selected approved method; a candidate method is explicitly identified as such. There is no required timing benchmark.

## Project versions and roadmaps

Keep a workspace roadmap.md and a roadmap.md in every actual project. Shared method/tool work goes in the workspace roadmap; result scope and future versions go in the project roadmap. A roadmap entry is not authorization to start a version.

The project README.md indexes its versions. state.json selects the working version, versioned docs path and pinned workflow. /iterate snapshots the previous source under projects/ID/versions/VOLD/, preserves its documents and receipts, creates VNEW documents with a change note, and resets readiness/acceptance. Working source stays in projects/ID/. Use /versions to locate documents. Do not confuse result versions, method revisions and review-round numbers.

## Changes and releases

Fixes enter /issue; feature work enters /iterate. Record whether a correction belongs to this result, a helper, the job method, or Moom itself. Preserve current inputs and user edits. A method change names its scope: project-only, future projects, or current plus future. Freeze a distinct workflow revision, synchronize commands and explicitly migrate affected projects. The migration compares procedure/helper revisions and reopens changed stages and their dependants.

Frozen workflows retain their actual procedures and declared helper code. Use `moom.py procedure STEP` and `moom.py run HELPER` so an older project reads its own revision. Do not substitute today's global helper merely because its name is unchanged. A pinned helper receives `MOOM_WORKSPACE` and `MOOM_PROJECT` so its code can operate on the selected workspace rather than its snapshot directory.

Declared reusable resources are bundled too. `MOOM_BUNDLE` identifies the selected revision's resource directory; a helper must use it for reusable templates/configuration, while current project inputs remain in the workspace. Source changes in a global template must not silently change an old project's method.

Commit and attempt a push at meaningful completed milestones, scoped to relevant changes. Record unsynchronized work accurately. Do not force-push, switch remotes or change repository visibility to resolve a failed push. Retain separately any required artifacts that Git ignores.

## External tools and imports

For a web agent or another external tool, record the approved input revision, tool, returned artifact and actual checks. Review the result as a candidate output. A skill/helper is selected and reviewed once per meaningful revision/scope change, rather than reapproved on every project.

Reusable exports contain the specialized recipe and necessary helper code, not personal project inputs, credentials or account sessions. Imports require the recipient's review and environment checks. Source-package format compatibility is not proof of native host discovery or runtime behavior.
