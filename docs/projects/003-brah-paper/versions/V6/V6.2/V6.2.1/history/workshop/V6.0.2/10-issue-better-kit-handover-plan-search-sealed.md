# V6.0.2 — Issue #10: better kit for a fresh start (handover, full plan, runtime search, sealed+confirm)

> **Source:** organizer, 2026-10-19. «I think this rehearsal is useless. I want to start over again with a better kit» + 4 requirements: (1) `/idea-core` accepts an existing product (handover of the event project); (2) `/plan` writes a real architecture AND a detailed plan; (3) a bundled runtime search tool on Parallel, working like the workshop MCP does; (4) solid sealed-envelope + out-of-LLM-confirm tools.
> **Status:** all four shipped, verified, redistributed.

## 1. Handover (`existing_product/` restored)

The folder is back in the template with a `README.md` handover procedure: what to drop in (code snapshot, `docs-old/`, secret NAMES only, optional dump + `KNOWN-ISSUES.md`) and what the assistant does (inventory table, keep/adapt/rewrite mapping against the 1-job rule, old values never reused, fast-track verify-and-keep for kit-shaped docs, cuts + migration notes to `roadmap.md`). `/idea-core` now branches: empty folder → new build; non-empty → handover mode, then the pipeline re-derives everything and `/plan` builds on the existing code, not zero. Directly supports handing the event project over.

## 2. `/plan` writes architecture + plan in full

The «two pages max» cap is gone (replaced: complete, no padding). The template now mandates: `architecture.md` with end-to-end request flows per plane, component map, MCP surface table, billing + notification wiring, data + deployment topology; `plan.md` with full `Job` sketch, per-tool inventory (Ctx needs, approval, secrets, edge cases covered), env table with fill timing, numbered build order with checks, **test hooks for EVERY edge case**, risks/assumptions with no open questions allowed.

## 3. Runtime search bundled (`tool-bank/parallel-search`, live on the server)

New bank tool (14 total, pushed to Gitea, verified searchable via live `search_tool_bank`): `parallel_search(objective, queries)` spends the EMPLOYER's `PARALLEL_API_KEY` from the environment (secrets file locally, `set_env` on staging) — never in chat, never logged — mirroring how the workshop MCP's `web_search` spends the workshop key. README documents when to choose it over `web-reader`/`rss-fetch`, the 3-query cap, caching discipline, and the cost-ownership note for `/iterate`.

## 4. Sealed + out-of-LLM confirm: documented patterns, no new engine needed

Audit result: codo-core 0.2.0 already ships the primitives (`Field(kind="secret")`, `ctx.seal/unseal`, `sealed_tool`, `@tool(approval=True)` → numeric code outside any chat, `escalate_to_manager`, admin `confirm(token)` two-step) — what was missing was a discoverable recipe. New API.md §8b «Sealed values & confirmation outside the model» with copy-paste patterns + the three rules (secret args take refs; irreversible/money = approval or admin-confirm, never self-confirm; escalations via `escalate_to_manager`), linked from the `/tools` sealed section.

## Addendum — numbered questions files (organizer: «the question files are not numbered while they should be just like older versions»)

Convention restored and extended: `docs/versions/<ver>/NN-<step>-questions.md`, numbered in pipeline order (`01-idea-core-questions.md`, `02-prd-questions.md`, … `10-plan-questions.md`, `11-test-questions.md`; design/prototype take 08/09 only if that track runs; new versions restart their sequence, e.g. `01-iterate-questions.md`). All 12 asking commands updated; the 00-rules pattern carries the full mapping. Applied to the rehearsal: `questions-idea-core.md` → `01-idea-core-questions.md`.
Handover hygiene enforced after finding the organizer's copy carried a nested `.git` plus live secrets (`workshop.token`, push token, `SEAL_KEY`/`ADMIN_TOKEN`, model key): the copy was stripped (2.3M → 488K, secrets gone, gitlink removed, history amended) and the handover README gained an explicit never-copy list (`.git/`, real secrets, `backend/data/`, `.venv/`).
