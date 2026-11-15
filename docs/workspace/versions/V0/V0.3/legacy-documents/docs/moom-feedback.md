# Moom feedback from the publishing rehearsal

## Adopted from the owner's comments

- Review the delta: new ideas, overridden ideas, uncertain interpretations. Keep full documents available without forcing a reread of already supplied information.
- Do the actual first job and extract its method while working. A real complex need is a valid starting point.
- Treat improvement as a practical expectation; remove mandatory timing/benchmark ceremony.
- Make method improvement part of `/issue`: outcome defect, underlying cause, scoped correction, useful verification.
- Keep the handbook and promotional material as separate projects when their purposes differ.
- Scope a first release usefully: live/manual presentation and offline ZIP now; add audio/video through later real work.

## Concrete reusable boundaries in this first implementation

- Separate `site/` inputs from `dist/` outputs. This prevents old ZIPs from re-entering the next package.
- Make delivery differences explicit: offline hides its self-download; later video will hide download controls entirely.
- Store confirmed event facts in the project brief; do not copy fees, venue, prerequisites or registration state from a previous workshop.
- Let a small task-specific build helper own predictable packaging and checksums; no generic workflow engine is needed to publish a first post.

Observed problems and corrections now live under `docs/projects/ID/issues/`. The fifth workshop's actual core is `workshops/public-workflow/moom/`; its process/commands implement these rules and the blog installs that core. The specialized publishing method is still a candidate for owner review, with actual procedures, snapshots and selected helper execution.

First observed correction: [direct seeking and visited state](issues/001-seeking-and-visited.md). The same UI passed the reduced-motion route and failed normal-motion semantics. The recipe now checks both and awaits actual asynchronous outcomes.

The owner's follow-up exposed two additional gaps: [focus after clicks](projects/001-workshop-7/issues/003.md) and [missing workshop/workspace implementation](projects/001-workshop-7/issues/004.md). A progress claim must link actual source, state and executable procedures. A keyboard check must start with the focus state created by a real interaction, not only an unfocused slide.
