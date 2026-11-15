# Workflow 0.3 — numbered rounds and real project versions

Observed in post 002: the prior workflow reused an unnumbered review file, mixed questions with confirm/override decisions, and failed to make project versions or per-project roadmaps discoverable. iterate previously changed a label without preserving source/specifications.

Owner-requested corrections:

- Each round has a fresh numbered file in the selected version's docs folder. Submitted answers and COMMENTs remain in earlier rounds.
- Questions have concrete options with exactly one recommendation. Uncertain decisions have one proposal and a Confirmation / override field in a separate section of the same file.
- state.docs selects version documents. Each actual project has README.md as a version index and roadmap.md for scope/future versions; blog/roadmap.md tracks shared work.
- iterate archives the old source/inputs/metadata with checksums, preserves old version documents/receipts, creates new version documents and a change note, and resets readiness/acceptance. Duplicate/backward versions fail.
- The updated build helper uses published_snapshot while a successor is a draft. A local preview can show the draft without replacing the prior publication.
- The assistant owns obtainable research/screenshots. Record bounded comparisons and actual evidence rather than treating an example as globally cheapest.

Scope: Moom mechanics and protocols apply workspace-wide. Publishing workflow 0.3 is a candidate for current post 002 and future posts; projects 000/001 remain pinned to 0.1. Before starting a later version of either legacy project, explicitly migrate it to 0.3 so its publishing helper understands snapshots. The first post remains V0.1.1; no V0.2 work was started.

Verification: temporary workspace tests cover preservation of source/docs/answers, numbered rounds, duplicate/backward rejection, roadmap updates, retained old-round links and public-old/preview-new builds. File/host generation checks are not claims of native host UI discovery or real reader-server provisioning.
