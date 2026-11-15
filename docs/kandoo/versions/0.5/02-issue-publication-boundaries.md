# V9.5 round-two publisher and migration repairs

Owner instruction on 2026-11-14: “now fix what you found”, referring to Workshop
V9.5 findings F13–F17. This authorizes the local implementation and verification.
It does not infer answers in previously blank review slots, new editorial acceptance
or a live deployment request. The root Workshop V9.5 record owns the complete review,
dispositions and durable validation evidence.

## Scope and expected behavior

- F13: reject protected/unowned write destinations before any output replacement;
  preserve custom previews and verify legacy generated output before adoption.
- F14: reject designated private paths in sources, material rows and checked artifacts.
- F15: leave unrelated explicitly unpublished partial contracts outside build validation.
- F16: restore six living Project scope summaries using current sources and selected
  dossiers while retaining their versions, answers and acceptance states.
- F17: retain exact previous generated trees for local rollback without recompilation.

## Implementation decisions

### 1. Safe custom output destinations

Kind: AI decision.
Context: fixed destinations would simplify protection but remove useful preview paths.
Options: A. Check ownership and protected paths for custom outputs; B. fixed outputs only.
AI Recommendation: A, as proposed in the adversarial review.
Your answer:

Working implementation: A under the owner's direct repair instruction. New/empty output
is allowed; an existing nonempty tree needs verifiable generated ownership. Every
destination is preflighted before activation. Local Project output gets a private
artifact receipt; published runtime filenames remain intact. These technical choices
are recorded for review and are not described as an explicitly confirmed file answer.

### 2. Local rollback retention

Kind: AI decision.
Context: the method promises the previous delivered artifact; unlimited full copies
would grow without a bound.
Options: A. Keep three distinct previous snapshots per destination; B. keep one previous snapshot.
AI Recommendation: A, allowing recovery across several local edits with bounded storage.
Your answer:

Working implementation: three content-addressed snapshots under the destination's
parent `.publication-history/`. Exact duplicates reuse a snapshot. Unknown/modified
history folders are preserved. This default remains revisable by the owner; no blank
file submission or editorial approval is inferred.

## Ownership and handoff

The shared publisher and tests own the code repair. The installed method's distribution
reference and Journal README document the operational policy; short command procedures
and Job revision 0.3 retain their existing pipeline. Six Project living idea documents
repair the migration contract. Project selection/progress stays with
006-independent-journal; no old Project output is accepted or published by this repair.
The generic template already requires protected boundaries and retained artifacts;
these implementation defects require no public-template reinstall or source change.

Original defect reproductions remain in the root V9.5 evidence folder as before-state
records. The new regression suite checks corrected behavior; original failure-asserting
reproducers are not product acceptance tests. The final Workshop disposition records
actual test/build results and any remaining verification limits.
