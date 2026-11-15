# Issue 5 — remove delegation and A2A from the teaching path

Date: 2026-11-03. Input: the owner's fifth report in [01-transcription.md](01-transcription.md). This is a scope and complexity decision; it does not require making a market-adoption claim.

Remove delegated-principal discovery, A2A references and the `Tier` / `assurance` / `delegate` / `master` approval taxonomy from public-agent Codo and its matching book. Do not add a prohibition, an unsupported-feature warning or a replacement discussion. Keep the three action policies introduced in issue 4: direct, soft confirmation and hard human confirmation. Read-only access, caller binding, scoped data and proposal-only execution for hard actions remain intact.

The paper's broader architecture is unchanged. The workshop teaches the human-approval case without presenting its optional delegation extension. Previous V7.3 reports remain historical evidence; this report supersedes their descriptions of the workshop's approval-tier schema.

Completed in source instructions/templates, the book, packages and rehearsal instructions. Existing participant answers, living documents, runtime prompts, credentials and phase progress are preserved.

## Changes

- Removed principal-class discovery from `/idea-core`.
- Removed the approval `Tier` column from the capability command and living template, and deleted the `delegate` / `master` / `assurance` explanations and checks.
- Simplified hard confirmation to authenticated human approval in the security constitution, shared confirmation guide, prompt/build/edge-case procedures and book chapter 7. Caller/action/parameter binding, executor absence, trusted rendering, expiry and replay checks remain explicit.
- Kept direct, soft and hard behavior and read-only access. No replacement restriction or unsupported-feature discussion was added to the product.
- The nine edited Codo/book files decrease from 461 to 454 lines and from 6,473 to 6,247 whitespace-separated words. The unrelated tool-integration “4-Tier” heading describes API integration choices, not approval roles, and is retained.

## Verification and delivery

- Independent adjudicator review is clean: the removed concepts are absent, no ban was introduced, and confirmation/isolation/fallback guarantees remain intact. This is a document review, not runtime verification.
- A full Codo/book content scan found no A2A, delegated-principal, approval-tier, assurance, master/delegate or equivalent delegation references. Historical workshop reports and the paper/presentation are outside this product-content scan.
- Rebuilt `codo-7.3.zip` and `codo-agent-7.3.zip`. Each contains 84 Markdown/template entries, including all 14 canonical procedures and 42 generated command wrappers. Exact archive membership, source bytes, wrapper bodies and the removed-concept scan pass.
- Synchronized 22 changed instruction files into `../konkooria/mentoraAgent/`; all selected instructions match both packages. The immediate before/after comparison confirms all 24 current participant-state files are unchanged by synchronization, including new rehearsal work created during this task. No participant documents were replaced by templates.
- Scoped `git diff --check`, Markdown code fences and the edited Persian book's direction-prefix check pass. No application, deployment or stored authorization data was changed.
