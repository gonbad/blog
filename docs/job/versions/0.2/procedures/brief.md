# Blog brief

Read the selected project and its actual inputs in projects/ID/inputs/. Confirm audience, purpose, fresh facts, target capabilities and acceptable result. Reuse supplied information; do not ask it again.

Before implementation, create docs/projects/ID/questions.md as the single owner review packet. Include the proposed page sequence, what the reader does on every page, all uncertain decisions and proposed overrides of the supplied brief. Separate confirmed instructions from recommendations. Give each question an empty Answer field and allow COMMENTs or a combined confirmation with exceptions.

Create research.md for assistant-owned verification and inputs.md for owner-supplied materials. Every missing material names its owner, required stage, exact destination path and blocking scope. Do the research yourself; do not ask the owner to look up facts you can verify.

Link questions.md to the owner and wait for answers in that file. Do not ask project questions in chat or interactive question tools. Record pending_review in project state with state:waiting, file and before:blog-content. This is a cooperative procedure record, not a CLI enforcement boundary. Do not implement dependent content/sample/build or publish while required answers are pending. Reread submitted answers, preserve them, and write decisions.md before clearing pending_review. Unanswered items remain pending.

Write/update brief.md and a short review packet showing only new proposals, overrides and uncertain interpretations. Update project.json's title, source, intended public path and material requirements. A draft remains publish:false. The root index has an empty public path and hand-authored source. Record this brief with `moom.py record blog-brief --artifact docs/projects/ID/brief.md`.
