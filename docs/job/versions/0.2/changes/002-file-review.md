# Workflow 0.2 — file-based decisions before implementation

Observed in project 002: the assistant used a chat question widget even though the existing process already called for a question file. It also split the page plan and proposed overrides across review.md and questions.md, and allowed chat answers. The owner corrected this explicitly before implementation.

Correction: one questions.md includes the page plan, all uncertain/proposed decisions and owner input requests. Empty answer fields support confirmation or overrides/COMMENTs. The assistant links that file and waits for saved answers; no chat questions or question widgets. After submission it rereads and preserves the answers, then records decisions.md. A pending_review state record makes the wait visible. This is a procedure followed by the assistant, not a new CLI security/approval mechanism.

Research remains assistant-owned. Missing owner assets have a required stage, destination and blocking scope. The workflow now describes those responsibilities explicitly in brief/content and carries the file-review requirement through story/style/sample.

Scope: current project 002 plus future projects; published projects 000 and 001 retain workflow 0.1. Freeze 0.2 as a candidate and explicitly migrate 002. This records the owner's requested process correction; it does not claim approval of the post's proposed content or every aspect of the full recipe.
