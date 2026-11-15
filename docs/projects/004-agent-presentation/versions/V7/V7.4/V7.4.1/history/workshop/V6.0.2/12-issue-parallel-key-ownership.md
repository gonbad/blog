# V6.0.2 — Issue #12: the Parallel key belongs to the agent creator, not the employer

> **Source:** organizer, 2026-10-19. «the search tool should be configured so that the agent creator brings parallel key not the employer.»
> **Fix:** single canonical key `PARALLEL_API_KEY` in `docs/secrets/model.local.md` (next to the LLM key — both are creator-provisioned deployment keys), collected once at `/wire` when `tools.md` lists runtime search, shipped to staging via `set_env`. Employers never need a Parallel account; cost folds into wholesale meter pricing. Verified live via `search_tool_bank`.

## What changed

- **Bank tool** (`tool-bank/parallel-search`, pushed to Gitea, live): README + client rewritten — creator brings the key; the old «rename on vendor to `WEB_SEARCH_API_KEY` to avoid clashing with the workshop fallback key» dance deleted (there is no clash: workshop key and agent key live in different processes/machines; the only rule is which *file* feeds `backend/.env`).
- **Kit:** `model.local.md.example` gains commented `# PARALLEL_API_KEY=`; `/wire` step 1 collects it alongside the LLM key *only if* the agent searches at runtime; `/plan` env-table rule — when one name appears in several secrets files, `model.local.md` wins.
- **Server** (`mcp-coolify`, redeployed): `get_research_key` now pins its key to `docs/secrets/secrets.local.md` and states it is laptop-use only, never `model.local.md` — the two same-named keys can no longer be confused.
- Sealed by construction: env-only, never chat/log/git (same envelope as the LLM key).

## Rehearsal note

The live event folder predates this and carries the old two-name scheme (`WEB_SEARCH_API_KEY` + rename note); on the next fresh start from the new kit it resolves itself — one name, one file, no rename step.
