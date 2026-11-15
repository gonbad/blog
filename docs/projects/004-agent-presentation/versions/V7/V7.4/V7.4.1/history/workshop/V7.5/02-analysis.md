# V7.5 — Service boundaries, complete integrations and presentation terminology

Source: [01-transcription.md](01-transcription.md), 5 November 2026. Compared with the active [presentation](../../../presentation/README.md) and [public-agent Codo](../../../workshops/public-agent/codo/README.md). Approved analysis; implementation and verification are recorded in [03-implementation.md](03-implementation.md).

The central change is to treat a specialist service agent as an intelligent client of an independently usable business service. When an integration needs a new backend or API bridge, that component belongs to the workshop's build and deployment scope. Merely documenting its endpoint cannot satisfy the requirement.

**Codo: current behavior and required changes**

| Area | Current instructions | Required change |
|---|---|---|
| Discovery and contracts | `/tools` discovers integrations; `tools-guide.md` already describes Eitaa personal-account automation, OTP and persistent sessions. | Classify every dependency as an existing API, a new owned backend, or an API bridge over an existing system. Record who builds it. Identify these components in `/tools`; refine their operations in later specifications and produce `openapi.yaml` contracts before `/build`. |
| Architecture and build | `/plan` places a domain engine inside the agent; `/build` scaffolds its engine and database together. | Explicitly separate business backend, integration bridges and agent harness. Put domain data, transactions and final business validation in the backend; keep conversation, model orchestration and agent-specific state in the harness. Build every required component and consume business operations through the reviewed API. Preserve authorization at both boundaries. |
| Login and deployment | `/wire` already verifies application connections; `/deploy` transfers credentials and rechecks the server. Personal-account login is not an explicit completion checklist. | Add guided phone/OTP login through protected local input, session persistence, and a real adapter check in `/wire`. In `/deploy`, transfer the required session artifacts over SSH, install browser/runtime dependencies, and verify authentication after restart under the actual service account. Scope deployment evidence to every required component. |
| Business errors | Prompts already require natural language and truthful tool outcomes, but lack an explicit backend-error translation contract. | Return structured, sanitized business outcomes to the model; express failures in the agent's reviewed tone. Example: `capacity_full` → «ظرفیت این کارگاه تکمیل شده؛ می‌توانم گزینه‌های دیگر را بررسی کنم.» A preliminary capacity check is optional; the backend must still validate the actual mutation. Retain safe technical diagnostics separately. |

Primary edit points: [commands](../../../workshops/public-agent/codo/docs/commands/), [living templates](../../../workshops/public-agent/codo/docs/living/), and [integration guide](../../../workshops/public-agent/codo/docs/references/tools-guide.md). Carry the revised workflow into the public-agent book and packaged command copies when implemented. Codo itself remains a Markdown distribution; generated participant projects contain the runtime code.

**Confirmation on personal-account channels**

Recommend direct or soft confirmation for eligible actions and explain the interaction cost of code-based hard approval when buttons are unavailable. Check the selected account transport's actual capabilities; the existing guide distinguishes Eitaayar broadcasting from personal-account chat.

There is a policy conflict to resolve explicitly: the transcript requests direct/soft defaults, while the current [confirmation policy](../../../workshops/public-agent/codo/docs/references/confirmation-policy.md) requires independent approval for financial, destructive and sensitive actions. Soft consent retains direct execution authority. Missing buttons alone must not silently downgrade an action; the current hard path supports a trusted, parameter-bound nonce on text-only channels.

**Presentation: a focused revision**

Section 4.2 already compares three approaches. Content page 116 renders «ایجنتِ عمومی / محیطِ تخصصیِ آماده / هارنسِ مخصوصِ کار»; pages 117–119 expand them. Update both [slide content](../../../presentation/deck-data.js) and the visible interactive labels in [journeys.js](../../../presentation/journeys.js):

- Name the middle category **«ایجنت‌های تخصصی کدنویسی»**, with Claude Code, Codex and Antigravity as examples.
- Explain their use for text-file products: website/agent code, research, books, translation and authorship. The present workbench demonstrates only software work.
- Expand the Hermes example beyond translation to general assistance, including shopping. Include the transcript's requested progression from repeated tasks to reusable code as an illustrated workflow; keep its distinction from a purpose-built producer clear.

**Acceptance and scope**

A representative exercise must demonstrate a built bridge, completed login, and working server-side session after restart; an API failure must become an accurate, natural reply. The business API must remain usable by a future web or mini-app client. Refactoring the existing registration agent is explicitly deferred by the transcript. These are proposed acceptance checks, not completed verification of the reported exercise.
