# Open the next numbered review round

Resolve the selected project's state and its docs field. Keep reviews in that version's document directory. After actually reading and preserving submitted answers/COMMENTs, mark the preceding pending_review answered; that does not mean every item was confirmed. Record the confirmed decisions, overrides and still-open items in decisions.md.

Create the next file with `python3 moom.py review-round --title TITLE --before STEP`. It numbers files 001-review.md, 002-review.md, etc., refuses to replace an unanswered waiting round, and updates the visible pending review. Replace the generated skeleton with useful content before linking it to the owner.

Use two distinct sections in the same file. **Questions:** concrete choices, 2–3 meaningful options with exactly one labelled Recommended, and an empty Answer field. **Uncertain decisions:** one proposed decision with its reason and an empty Confirmation / override field. Do not present a proposed decision as a multiple-choice question. Carry forward answered items; include only unresolved or materially changed items. Never rewrite a submitted round into the next round.

Link the actual numbered file and wait for saved answers. Do not ask in chat or a question widget. After submission, apply the owner's blank-answer policy; delegated blanks are soft defaults, not confirmed rules. A COMMENT can resolve a specific item; blanks elsewhere do not inherit that answer.

A delegated blank does not justify marking an artifact accepted. Record confirmed, overridden and delegated decisions separately; applying an owner-requested review policy is different from imposing a delegated content choice on future projects.
