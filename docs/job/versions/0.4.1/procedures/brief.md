# Blog brief

Read the selected project and its actual inputs in projects/ID/inputs/. Confirm audience, purpose, fresh facts, target capabilities and acceptable result. Reuse supplied information; do not ask it again.

Before implementation, create docs/projects/ID/versions/VVERSION/NNN-review.md as this round's owner review packet; allocate a fresh file with review-round and never overwrite submitted earlier rounds. Include the proposed page sequence, what the reader does on every page, all uncertain decisions and proposed overrides of the supplied brief. Separate confirmed instructions from recommendations. Separate Questions (2–3 options, exactly one Recommended, empty Answer field) from Uncertain decisions (one proposal, empty Confirmation / override field). Allow COMMENTs and preserve the submitted record.

Create research.md for assistant-owned verification and inputs.md for owner-supplied materials. Every missing material names its owner, required stage, exact destination path and blocking scope. Do the research yourself; do not ask the owner to look up facts you can verify.

Link NNN-review.md to the owner and wait for answers in that file. Do not ask project questions in chat or interactive question tools. Record pending_review in project state with state:waiting, file and before:blog-content. This is a cooperative procedure record, not a CLI enforcement boundary. Do not implement dependent content/sample/build or publish while required answers are pending. Reread submitted answers, preserve them, and write decisions.md before clearing pending_review. After submission, blank items are delegated to the assistant under the owner's policy; record their local default and do not promote it to a hard or reusable rule.

Write/update brief.md and a short review packet showing only new proposals, overrides and uncertain interpretations. Update project.json's title, source, intended public path and material requirements. A draft remains publish:false. The root index has an empty public path and hand-authored source. Record this brief with `moom.py record blog-brief --artifact docs/projects/ID/versions/VVERSION/brief.md`.
