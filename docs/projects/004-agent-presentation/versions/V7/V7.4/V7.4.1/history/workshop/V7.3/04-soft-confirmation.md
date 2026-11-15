# Issue 4 — conversational soft confirmation

The subsequent [issue 5 simplification](05-simplify-capabilities.md) removes the approval-tier taxonomy described in this historical checkpoint. Direct, soft and hard confirmation remain; current product documents describe hard approval simply as authenticated human confirmation.

Date: 2026-11-03. Input: the owner's fourth report in [01-transcription.md](01-transcription.md).

The requested behavior has three action approval policies: direct execution, soft confirmation in ordinary conversation, and hard confirmation through an independent human control. In the soft case the LLM still has the execution capability and is instructed to wait for the user's textual confirmation. In the hard case the LLM has proposal authority only and cannot execute the protected action itself.

## Accepted representation

Represent soft confirmation as a conversational policy on existing direct authority. Keep the security partition (`read`, `direct`, `confirm`) and declare a separate confirmation field (`none`, `soft`, `hard`). The three action policies are `direct + none`, `direct + soft` (displayed as `soft_confirm`) and `confirm + hard`. Pure reads remain a separate effect category. This keeps the distinction between user experience and deterministic authorization visible in the capability declaration.

Soft confirmation is suitable only where bypassing the conversational check is within the designer's accepted direct-authority risk. It does not establish the paper's hard-confirmation integrity guarantee. Caller binding, envelopes, validation and other deterministic authorization checks remain mandatory. Existing nonce-protected, financial or irreversible actions must not be silently downgraded.

The independent design review accepted this representation and required: a complete soft-consent lifecycle; a preserved proposal-only hard boundary including parameter-bound controls and text preemption; separate assurance tiers; explicit fallback; and a distinction between preparing checkout and committing/settling payment. The source changes implement those requirements. Scope is Codo instructions/templates, the book, packages and synchronized rehearsal instructions; no application code, existing participant capability decisions or production state is changed by this issue.

## Changes

- Added `docs/references/confirmation-policy.md` as the shared contract for declarations, soft conversation, hard authority, assurance, fallback and verification.
- Updated `/capabilities` and the living capability template with a `Confirmation` column and exactly four valid mode/confirmation combinations. `soft_confirm` is the user-facing name of `direct + soft`; read-only access remains separate.
- Updated security invariants and AST-05 to require executor absence, independent principal/parameter-bound approval, expiry and one-use validity for hard actions. Soft is never credited as AST-05.
- Updated SOP, prompt, build and edge-case instructions and the prompt templates so the approved policy reaches the generated runtime rather than remaining only in a capability table.
- Replaced ambiguous payment examples with explicitly draft-only registration, checkout preparation and receipt evidence; none implies an LLM-authorized charge or settlement. Existing participant tables are preserved.
- Updated book chapter 7 and qualified the workshop constitution's enforcement claim: the harness enforces hard authorization; soft consent remains behavior over existing direct authority.

Final independent adjudicator review is clean. It checked declaration validity/migration, retained direct authority for soft, the full conversation lifecycle, independent assurance, fallback and hard-executor bypass prevention. This is a bounded review of documents/templates, not a claim about runtime enforcement. No live model conversation or application security regression has been executed for this documentation-only change.

## Concurrent rehearsal activity

The initial 23-file participant-state snapshot changed during the audit: `docs/status.md`, `docs/living/capabilities.md` and `docs/versions/0.1/06-capabilities-questions.md` were updated while the rehearsal continued. None is in the synchronization write set. The snapshot-equality check therefore failed; those live edits are preserved, never restored to the earlier snapshot or replaced with kit templates. Final preservation checks must compare immediately before/after instruction synchronization rather than claim that an actively used rehearsal stayed frozen for the whole review.

## Verification and delivery

- Rebuilt both packages using `python3 scripts/build_codo.py --name codo` and `python3 scripts/build_codo.py --name codo-agent`. Each contains 84 entries: 42 authored Markdown/template files and 42 generated wrappers for 14 canonical commands. Exact archive membership, authored bytes and wrapper bodies match the source; no runtime code or local credentials are shipped.
- Synchronized the affected canonical commands, generated wrappers, security constitution and new confirmation guide into `../konkooria/mentoraAgent/`. All 58 selected instruction files match both packages. The initial synchronization changed 22 instruction files; final synchronization required no additional writes.
- The immediate before/after check confirms that all 23 current participant-state files are unchanged by final synchronization. Earlier concurrent rehearsal edits are retained. Participant living specifications, real runtime prompts, profile/status, answers, tunnel and credentials are not synchronization targets.
- Scoped `git diff --check`, Markdown code-fence checks and the Persian book direction-prefix check pass. Independent design and final artifact reviews report no remaining defects.
- The Paper is unchanged: soft confirmation remains inside its existing direct-authority partition and claims no hard-confirmation guarantee. Product code will implement and test the reviewed policy during `/build`; this issue changes instructions and templates only.
