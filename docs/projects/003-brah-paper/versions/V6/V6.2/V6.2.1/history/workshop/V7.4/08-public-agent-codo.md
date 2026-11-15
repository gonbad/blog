# V7.4 — Public-agent Codo update

Date: 2026-11-04
Scope: public-agent Codo, its packager, and affected participant-book guidance.
Status: implemented; packages and book rebuilt and checked.

The owner's current request authorizes Codo work alongside the presentation repair. The presentation, archives,
paper, registration agent and existing rehearsal projects were not edited by this task. The V7.4 availability
qualification already present in the repository constitution governs this update.

## Implemented decisions

| V7.4 requirement | Implementation |
|---|---|
| Separate protected-data review | `/privacy` after `/data-model`; living privacy inventory and capture/recipient reference. Review sources, private capture, storage/retention, external processors, model exposure and allowed sinks. |
| Practical runtime wiring | `/wire` after `/build`, before `/deploy`; living connections document, provider/model roles, authentication, resource scope, evidence and rerun behavior. |
| Existing subscription as an inference option | `/wire` explicitly offers the builder's subscription alongside API and applicable self-hosting. Record provider conditions, suspension/quota/login risks, the creator's choice and API alternative. No provider or model is preselected in the environment template. |
| Recipient eligibility for secrets | Harness-owned grants bind a secret to a verified recipient/service, operation, purpose and validity. Owner-only is the default; the model cannot mint grants or choose arbitrary destinations. Resolution and final delivery recheck grants and business eligibility. |
| Optional conventional client | AST-04, capabilities, confirmation guidance, build and book now require explicit outage handling and verify the alternate coverage actually promised. Complete model-free feature coverage is optional. Hard approval, caller isolation and data protection remain required. |
| Sessions without a universal `/sessions` | Existing idea/PRD/SOP/data/model/prompt/plan steps distinguish conversation boundaries, authentication, history and durable business state. Scheduled products use trusted principal/resource scope, run IDs, checkpoints, overlap/retry/idempotency rules and job traces. |
| Real tool contracts and limited downstream authority | `/tools` separates model-visible business inputs from context-injected caller fields and downstream API arguments. `/wire` records actual account identity, token scope and permitted/denied checks through the application. |
| Reviewed prompts and natural product language | Exact prompt/dialogue artifacts include concrete outcomes, correction, refusal, disclosure and outage examples. Internal validation checklists and authoring commentary stay out of caller replies; Persian receives a language review. Mechanical checks supplement code and behavior review. |

The initial workflow now has 14 phases:

`/start → /idea-core → /prd → /tools → /sops → /data-model → /privacy → /capabilities → /edge-cases → /prompts → /plan → /build → /wire → /deploy`

`/iterate` and `/issue` remain the two incremental-release procedures. They reopen only affected privacy or
connection decisions and invalidate affected evidence. Entry files, status, phase numbering, questionnaires and
next-command handoffs agree. Existing one-question `/start` and later Markdown question/COMMENT review are preserved.

Build can finish its local structural checks before provider selection. Configured-model behavior checks remain
explicitly pending until `/wire` completes them. Adapter changes rerun affected build/security checks; `/deploy`
verifies the installed application and connections again under the actual selected server's service identity.
No local SDK probe or health endpoint substitutes for that evidence.

The build guidance also restores the missing AST-06 isolation check and replaces unchecked string envelopes
with validated `HandleRef[Kind]` plus ownership/recipient checks. Product templates no longer require chat and
payment subsystems for every agent.

## Verification and deliverables

Commands run successfully:

- `python3 scripts/build_codo.py --name codo`
- `python3 scripts/build_codo.py --name codo-agent`
- `python3 scripts/make_book_pdf.py --html build/public-agent-book-v7.4.html`
- `git diff --check -- scripts/build_codo.py workshops/public-agent`

Archive checks passed for both packages: exactly 96 entries, 16 canonical procedures, 48 generated wrappers,
exact source bytes and wrapper bodies, safe unique relative paths, no unresolved placeholders, and only Markdown
or safe Markdown examples. Local credential files and application runtime files are absent. A staged negative
check confirms packaging rejects a missing `/wire` procedure. Workflow order/phase numbering, next-command
references and equality of the three AI entry files passed.

The SQL examples execute in SQLite with foreign keys enabled; invalid grant references and recipient types
are rejected. This checks the template schema, not future generated authorization implementations.

The Persian RTL gate and PDF build passed. The rebuilt PDF has 21 A4 pages; extracted text includes the new
commands, and a rendered chapter-six page was inspected for Persian layout and the new wiring paragraph.

Artifacts:

- [Codo 7.4](../../../workshops/public-agent/dist/codo-7.4.zip)
- [Codo Agent 7.4](../../../workshops/public-agent/dist/codo-agent-7.4.zip)
- [Updated book PDF](../../../workshops/public-agent/dist/book.pdf)

These checks validate the instruction/template distribution and its packaging. Each participant's generated
application still completes its own build, wiring and server-deployment evidence under these procedures.
