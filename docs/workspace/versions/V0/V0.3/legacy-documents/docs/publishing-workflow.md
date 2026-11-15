# Publishing recipe — first working draft

This recipe is extracted from the first real post. It can change through `/issue` and `/iterate`; it is not a prerequisite framework that the first post had to obey.

The executable workspace contract is [job/workflow.json](job/workflow.json), with [actual stage procedures](job/procedures/). The [workflow entry point](../workflow.md) links each native stage command and its real artifact. This document is the readable overview.

## 1. Brief and a small decision packet

Record confirmed inputs in `docs/projects/<id>/brief.md`. Identify a few authored decisions the owner may disagree with: new ideas, overrides and uncertain interpretations. Show those in the review packet. Keep complete content/source available. Carry forward already answered questions; no full-document reread or benchmark is required.

## 2. Build the first real result

Give the post a numbered project with `moom.py new`; build its narrative and interactions in `projects/ID/site/`. Keep the root in `projects/000-index/site/`. Choose a suitable stack; shared tools do not require identical layouts. Keep runtime assets local with their licenses. Do not advertise imaginary downloads or unconfirmed event details.

The manual first release has vertical scrolling, Up/Down navigation, direct slide seeking, and a reading mode. Narration/video/timed progression belong to later selected work. A future video target hides download controls and uses a declared interaction path.

## 3. Package and check the actual deliveries

Run the selected method's `moom.py run build`. It reads actual project metadata/source/materials; its output is `dist/`. The presentation ZIP is created from a separate tree before its own archive exists. A distinct material ZIP, such as the real Moom kit, can be included offline. The offline edition hides the presentation's self-download and labels the online archive link. Source stays editable.

Check real interaction, narrow screens, keyboard behavior, the actual ZIP after extraction to a Persian path with spaces, missing requests, calendar dates and working downloads. Use `tools/verify.cjs` with an available Playwright installation and a running local preview. Screenshots are review evidence, not a substitute for the content review.

Exercise both normal and reduced-motion navigation: direct seeking must not mark intermediate sections as read merely because smooth scrolling passed them. Await observable outcomes for asynchronous actions such as clipboard writes; a completed click is not proof that the operation has finished.

## 4. Correct both result and method

For `/issue`, record the observed defect, cause, corrected files and verification. Classify its scope: this post, shared helper, publishing recipe, or Moom's general procedure. Fix the actual output and update the relevant method when the lesson generalizes. Do not promote a one-post visual preference into a universal rule.

Use `/iterate` for a new feature or content expansion. Posts and the root index stay editable. Retaining a previous deployed copy is an operational convenience, not an owner-imposed immutability policy.

## 5. Publish and edit the root explicitly

Preserve the desired path and publish to the selected existing VPS. Inspect its actual ingress before changing configuration; retain existing applications. Check desired DNS and TLS. Build and test before any final permission/missing-information request is needed.

Update `projects/000-index/site/index.html` explicitly: add the new literal link above older links. Never generate cards from the project registry. Verify the public page/downloads and record deployment evidence separately from generated project status.

## 6. Save the useful experience

Keep source, documents and a release checksum manifest. Back up generated delivery artifacts separately from ordinary Git when needed. Commit/push relevant milestone changes through the selected repository route. Capture concise Moom feedback in `moom-feedback.md`; use the next real post to refine the recipe.
