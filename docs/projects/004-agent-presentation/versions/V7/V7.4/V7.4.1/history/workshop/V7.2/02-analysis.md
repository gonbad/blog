# V7.2 — Analysis: Codo Packaging, Conversation Memory, and Registration Agent Behavior

> **Input:** [01-transcription.md](01-transcription.md), eight voice notes recorded on 2026-11-02, 11:20–11:47.  
> **Reviewed:** 2026-11-02.  
> **Scope:** Public Agent Codo, its package builder and participant book, relevant private-agent compiler adapters, and the local `registration` implementation.  
> **Status:** Findings and recommended decisions for discussion. Application changes, a registration 0.2 release, and server deployment are future implementation work.

## 1. Main finding and recommended decisions

The reported problems are substantial, and several are directly confirmed in the repository. Their causes span the Codo instructions, the generated registration specification, and the runtime. Adding stronger personality instructions alone would leave important failures in place.

Two assumptions in the recording need correction: the registration agent **already loads a persona into its system prompt**, and it **already has recent-message loading and a caller-scoped history search tool**. Those mechanisms are incomplete for the requested experience. Conversely, the missing initial scaffold, menus during successful AI conversations, and missing model-visible profile context are supported by local evidence.

| Topic | Assessment | Recommended decision |
|---|---|---|
| Greeting-triggered command installation | Confirmed packaging weakness; the existing routine also omits an explicit Codex adapter | Generate tool integrations during packaging and remove the separate installation conversation |
| Constitution / README | Keeping project guidance remains useful | Keep short automatically loaded entry files, with stable rules and workflow guidance in `docs/`; remove command-copying duties |
| Initial `0.1` folder and idea input | Confirmed missing from the public source and both inspected ZIPs | Ship `docs/versions/0.1/00-idea-input.md` as a real Markdown template |
| History retrieval | Present, but limited to a single substring query and result limit | Add optional recent-message, time-range, and any-keyword retrieval with enforced conversation scope |
| Automatically supplied history | Present, but only the last three serialized model runs | Build bounded recent context from the conversation, including relevant deterministic events and current business state |
| Menus while AI is available | Confirmed in both specification and runtime | Enforce a harness-owned presentation policy: conversational when AI is usable; navigation menus on fallback |
| Persona and conversational Persian | Persona exists; guidance and examples are insufficient and sometimes contradictory | Strengthen `/prd`, add reviewed dialogues to `/sops`, and carry both into runtime prompts and evaluations |
| Profile name and username | Names reach execution context; they are absent from the initial model prompt; username is not captured there | Supply a small profile snapshot, treat it as untrusted data, and confirm plausible names conversationally |
| Contact-sharing button | Implemented in the deterministic wizard; no dedicated model-callable request tool | Expose a scoped contact-request action and return a verified/unverified handle event to the conversational path |
| Question order and collecting everything at once | The runtime registration prompt explicitly permits collection “in any order” | Define ordered progressive collection, reuse supplied information, and ask one unresolved question per turn |

The proposed direction is sound. The main refinements are tool-specific command packaging, bounded context instead of an unlimited 30-minute dump, and enforceable presentation rules alongside persona prompting.

## 2. Evidence and limits of this review

This analysis uses the local working tree and the contents of the two existing public-agent archives. It does not establish which revision is running on the server, reproduce the reported live chat, or independently inspect Mohsen's separate exercise. Runtime findings below describe the local implementation. The live conversation and deployed revision should be compared during implementation before claiming a production fix.

The main evidence is:

| Evidence | What it establishes |
|---|---|
| [Package builder](../../../scripts/build_codo.py), `build()` | Copies Git-tracked source files into staging, substitutes placeholders, and writes the ZIP; the public path does not generate native command integrations or the initial idea scaffold |
| [Bootstrapping article](../../../workshops/public-agent/codo/docs/constitution/00-bootstrapping.md), [entry file](../../../workshops/public-agent/codo/AGENTS.md), and [README](../../../workshops/public-agent/codo/README.md) | Require greeting-time detection, copying, and a new session |
| `workshops/public-agent/dist/codo-7.1.zip` and `codo-agent-7.1.zip` | Each contains 38 files; neither contains native tool integration files or `docs/versions/0.1/00-idea-input.md` |
| [Codo rules](../../../workshops/public-agent/codo/docs/constitution/01-rules.md), [PRD command](../../../workshops/public-agent/codo/docs/commands/prd.md), and [SOP command](../../../workshops/public-agent/codo/docs/commands/sops.md) | Require scoped history and basic persona/SOP design, but lack the detailed contracts requested in the recording |
| [Agent runtime](../../../registration/app/agent.py), `_prompt_parts()`, `_load_history()`, and `run_turn()` | Loads persona and procedures; loads three previous model runs; attaches the main keyboard even after successful model output |
| [History implementation](../../../registration/app/history.py) | Offers `search_my_history(query, limit)`, scoped by `ctx.peer_id`, with substring matching and a maximum of 20 results |
| [Transport](../../../registration/app/transport.py) and [execution context](../../../registration/app/context.py) | Capture first and last name, omit username, and route deterministic text before the model-availability check |
| [Menu implementation](../../../registration/app/menus.py), [text templates](../../../registration/app/texts.py), and [capabilities](../../../registration/app/capabilities.py) | Implement a contact button and ownership classification in the wizard, but expose no model-callable contact-request action |
| [Registration PRD](../../../registration/docs/living/prd.md) and [screen specification](../../../registration/docs/living/screen.md) | Explicitly prescribe menu handoffs, persistent keyboards, and fixed knowledge wording |
| [Agent tests](../../../registration/tests/test_agent.py) and [LLM-Zero tests](../../../registration/tests/test_llmzero.py) | Exercise useful structural and business properties; the inspected checks do not establish the requested natural conversation quality |

These are source and archive inspections. Application tests and live model evaluations were not executed for this documentation task.

## 3. Command packaging and the role of the constitution

### 3.1 Move installation into the package build

**Voice notes: 11:23 and 11:27.**

The suggested change removes a fragile runtime responsibility from the coding assistant. Installation does not require model judgment: the builder knows the source commands and supported output formats. Preparing them before zipping makes the delivered workspace inspectable and repeatable.

The current bootstrapping article asks the assistant to detect its environment, copy 14 command files, and ask the participant to restart. Its detection table lacks an explicit Codex row and treats Antigravity/Gemini directories too loosely. Those are concrete reasons to retire this routine.

Keep `docs/commands/*.md` as the canonical authored procedures. During packaging, generate the native wrappers from those files, then validate the staged result before creating the archive. Generated copies should identify their canonical source and should never become separately maintained versions of the procedure.

### 3.2 Four supported tools need adapters

The four-tool target is reasonable, but identical file copying cannot guarantee identical invocation behavior. Official documentation checked for this analysis gives the following formats:

| Tool | Project integration | Participant invocation | Consequence for Codo |
|---|---|---|---|
| Claude Code | `.claude/commands/<name>.md` remains supported; `.claude/skills/<name>/SKILL.md` is another option | `/start` | Generate one supported form and avoid duplicate same-name definitions. [Claude Code documentation](https://code.claude.com/docs/en/slash-commands) |
| OpenCode | `.opencode/commands/<name>.md` | `/start` | Generate project command files with suitable metadata. [OpenCode documentation](https://opencode.ai/docs/commands/) |
| Codex | `.agents/skills/<name>/SKILL.md` | `$start` for explicit skill invocation | Document the native spelling. Legacy custom prompts use a local Codex home and `/prompts:<name>`; they are deprecated and unsuitable for the proposed self-contained ZIP. [Skills documentation](https://learn.chatgpt.com/docs/build-skills), [custom prompts documentation](https://learn.chatgpt.com/docs/custom-prompts) |
| Antigravity | `.agents/skills/<name>/SKILL.md` | `/start` | Use the current skill layout. Its migration documentation says legacy workflows stopped being indexed/executable after October 19, 2026. [Antigravity migration documentation](https://antigravity.google/docs/migration/workflows-to-skills) |

Codex and Antigravity share a project skill directory. The compiler can generate one common instruction body there, with any necessary tool-specific metadata handled explicitly. It should not write competing files to the same destination. These wrappers remain Markdown; they do not add application runtime code to the Codo distribution.

The repository already contains a useful precedent: private-agent Kandoo's [command adapter implementation](../../../workshops/private-agent/kandoo/compile/compile.py), plus its [Codex adapter](../../../workshops/private-agent/kandoo/compile/adapters/codex/adapter.json) and [Antigravity adapter](../../../workshops/private-agent/kandoo/compile/adapters/antigravity/adapter.json), already generate skill layouts and describe the different invocation syntax. Reuse or extract that packaging approach rather than maintaining another unrelated directory table. Its source-command format differs from public Codo, so it needs adaptation rather than a blind function call.

**Recommended participant promise:** open the delivered project and invoke the tool's native start procedure immediately. A literal `/start` in all four tools should not be promised without proving support in the workshop's installed versions. Document `$start` for Codex and provide a plain-language fallback such as “read `docs/commands/start.md` and follow it.”

### 3.3 Keep useful project guidance

A README is useful for humans but is not automatically loaded in every coding tool. Retain short entry files such as `AGENTS.md`, `CLAUDE.md`, and the applicable Google entry/rule file. Their responsibilities should be limited to explaining Codo, locating the rules and current status, and routing an explicitly requested procedure to its canonical document.

Keep stable operating rules and the phase sequence in `docs/constitution/`, with a concise overview in `README.md`. Remove greeting-triggered installation, repeated directory checks, and the “close this session to finish copying” step. Ordinary status checks and reading the project rules remain useful.

This requires synchronized edits to the [repository constitution](../../CONSTITUTION.md), public Codo entry files and bootstrapping article, and the participant book's [bootstrap chapter](../../../workshops/public-agent/book/03-bootstrap.md) and [start chapter](../../../workshops/public-agent/book/04-start.md). Renaming the article is optional; eliminating its obsolete behavior is essential.

## 4. Initial version scaffold

**Voice note: 11:28.**

Mohsen's observation is confirmed for the inspected public-agent kit. `docs/` exists, but `docs/versions/0.1/` and its idea-input file do not. Meanwhile, the [idea-core procedure](../../../workshops/public-agent/codo/docs/commands/idea-core.md) expects `docs/versions/0.1/00-idea-input.md`, and later procedures write their questionnaires beneath the same version directory.

Ship this minimum structure:

```text
docs/
  versions/
    0.1/
      00-idea-input.md
```

The file should contain a short Persian invitation to describe the idea, target user, intended job, and any existing product. It should be ready for participant input without invented answers. The existing `docs/living/` documents remain the current specification; `docs/versions/0.1/` retains input and decision history.

Because the builder selects Git-tracked files, the template must be included in the tracked source or generated deliberately in staging. Merely creating an empty local folder will not make it into the current ZIP. Add an artifact check that verifies the actual archive entry and readable template content.

## 5. Conversation memory

**Voice notes: 11:30 and 11:31.**

### 5.1 What already works, and what is missing

The current Codo constitution requires interaction history and a `CURRENT_USER`-scoped search tool. Registration implements both. `search_my_history()` binds `peer_id` from execution context and uses a parameterized query. The model cannot choose a different user through this tool's arguments.

Its retrieval interface is limited: one `query` string, `LIKE '%query%'`, newest-first ordering, and a clamped result limit. An empty query can incidentally retrieve recent rows, but this is not an explicit, well-described retrieval contract. There are no time bounds or any-keyword filters.

Automatic context also exists: `_load_history()` reads serialized messages from the last **three model runs**, in chronological run order. That is different from the last three chat messages or the last 30 minutes. Deterministic welcome messages, wizard interactions, contact events, and other events without `model_messages` are not automatically reconstructed through that path.

Therefore, the appropriate diagnosis is incomplete retrieval and context assembly. A specific instance of “forgetting” still needs the relevant live trace to show whether the missing information was stored, selected, serialized correctly, and actually sent to the model.

### 5.2 Recommended retrieval contract

Extend the existing tool rather than introducing many overlapping history tools. A proposed model-facing interface is:

```text
search_my_history(
    query?: string,
    terms_any?: string[],
    since?: timestamp,
    until?: timestamp,
    limit: integer = 20,
    cursor?: string
)
```

This is a proposed contract, not the current signature. Define its semantics before implementation:

- No text filters: return the most recent `limit` authorized conversation events.
- `query`: literal substring search; `terms_any`: match at least one supplied term. If both are provided, apply both filters, or reject the combination explicitly; document one behavior.
- Time bounds: combine with the text filters; use a clear inclusive/exclusive convention, such as `since <= timestamp < until`.
- Use a stable ordering and cursor so equal timestamps do not lose or duplicate results. Return timestamps, event kinds, a bounded excerpt, and an indication that more results exist.
- Clamp result count and total returned text. Normalize common Persian/Arabic character variants consistently for searching. Escape SQL wildcard characters when the requested semantics are literal substring matching.
- Derive authorization and conversation scope from the transport context. Expose no `peer_id`, `chat_id`, or target-user argument to the model. For this private-chat product, enforce that scope; do not accidentally merge a person's group messages into the private conversation.
- Keep sensitive values as handles in search results. Treat retrieved user text as conversation data with its original trust level.

The tool description should give concrete examples: “last ten messages,” “messages from yesterday afternoon,” and “messages mentioning either the server or payment.” `/test` should verify those behaviors, including attempts to retrieve another person's history.

### 5.3 Recommended automatic context

The proposed half-hour window is a useful starting policy, provided it has a size limit. An active half hour can exceed the model's context budget, and a customer returning after a long pause may have no messages in that window.

For each turn, assemble:

1. The approved persona, behavioral rules, and a compact set of relevant dialogue examples.
2. A fresh profile and business-state snapshot: confirmed name, selected participation type, collected-field flags/handles, pending confirmation, and payment/approval state.
3. Recent scrubbed conversation within a configurable horizon, initially 30 minutes, bounded by a token budget and with a small recent-turn minimum for quiet conversations.
4. The current message and the history-retrieval tool for older details.

Preserve coherent tool-call/result pairs when selecting context. Include relevant deterministic events, such as a verified contact capture, so the model knows what happened outside its previous runs. Durable registration and payment state must come from the engine/database rather than an inferred chat summary.

Also check the serialized-message path while making this change: `history.append()` scrubs `content`, but stores `model_messages` separately without scrubbing it there. This inspection alone does not demonstrate a leak. It does identify a path that must retain the same envelope guarantees before becoming a larger source of model context.

## 6. Conversational operation and fallback menus

**Voice note: 11:38.**

### 6.1 The menu problem is directly confirmed

Three local paths explain the reported behavior:

- `menus.dispatch_text()` handles `/start` by sending `WELCOME` with `MAIN_KEYBOARD`, before checking model availability.
- `agent.run_turn()` attaches `MAIN_KEYBOARD` to a successful AI reply.
- `texts.MAIN_KEYBOARD` declares a persistent keyboard. The screen specification also explicitly calls for a constant navigation drawer.

This behavior follows the generated specification. It cannot be corrected reliably by telling the model to avoid menus: the harness attaches them after the model has produced its reply.

The Codo requirement that every core action have a deterministic fallback remains useful. It does not require showing every fallback trigger during normal conversation. The [build procedure's](../../../workshops/public-agent/codo/docs/commands/build.md) button/menu wording should be aligned with the broader constitution, which also permits deterministic typed commands.

### 6.2 Put presentation policy in the harness

Use a harness-owned conversation mode:

| Mode / event | Presentation policy |
|---|---|
| AI usable | Natural conversation; generic navigation keyboard hidden |
| AI unavailable under the configured availability policy | Short explanation plus deterministic navigation and workflows |
| Contact capture | A real contact-sharing button may appear in either mode |
| Required confirmation or payment | The specific system-built confirmation/invoice control may appear in either mode |
| AI recovery | Remove fallback navigation and continue from saved workflow state |

Model timeout, provider failure, or an enforced model budget can make AI unusable for a turn. Record the actual reason. A failed business tool or a programming exception should not automatically be classified as a provider outage; the present broad exception handler needs that distinction. Existing account-blocking/rate-limit policy should also retain its own reason and behavior.

Enforce the navigation policy at outbound rendering so a successful tool response cannot reintroduce the main menu accidentally. Separate navigation controls from contact capture, payment, and authorization controls. An online contact keyboard should contain the needed contact action without adding a main-menu row.

Simply omitting `reply_markup` may leave an older reply keyboard on the client. Implement explicit keyboard removal where supported by Bale and verify it in the actual client. During recovery, preserve collected fields and pending confirmations instead of restarting registration.

Retain deterministic processing for payment notifications, authorization callbacks, and contact events in all modes. For `/start`, check known fallback state or attempt the ordinary AI path before presenting fallback navigation. Handle stale menu callbacks without restoring a persistent menu during a healthy AI conversation.

## 7. Persona, natural Persian, and reviewed dialogues

### 7.1 Persona is present; its specification is too weak

`_prompt_parts()` loads [persona.md](../../../registration/app/prompts/persona.md), and the agent registers that assembled text as its system prompt. The persona names Sahar internally and specifies warmth, patience, polite Persian, and short sentences. The recording's hypothesis that no persona reaches the model is therefore contradicted by the local code.

However, there are several supported explanations for the unsatisfactory tone:

- Codo's `/prd` gives broad style adjectives without requiring a concrete interview about conversational register or approved examples.
- The runtime persona offers no substantial Persian dialogue demonstration.
- The registration PRD's own sample replies are formal, including wording such as «برگزار می‌شود» and «اگر می‌خواهید».
- The runtime knowledge section says “quote exactly,” and the PRD says to use the exact FAQ text. This constrains natural paraphrasing.
- Static greetings, wizard prompts, and tool-generated messages come from deterministic templates; changing only the model persona will not change them.
- The [registration prompt](../../../registration/app/prompts/register.md) says to collect fields “in any order,” which conflicts with the progressive interaction requested in the recording.

### 7.2 Keep persona in `/prd`; put dialogue rehearsals in `/sops`

A new mandatory `/persona` command would add a phase without addressing the missing handoff into code and tests. The recommended first change is to strengthen the existing phases:

| Phase                | Required output                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/prd`               | Explicit persona: role, warmth, patience, formality, pronouns, sentence length, emoji usage, naming/self-introduction policy, and examples of preferred/disliked wording                                                                                                                                                                                                                           |
| `/sops`              | Ordered dialogue behavior, required tool/UI actions, and creator-reviewed sample conversations                                                                                                                                                                                                                                                                                                     |
| `/screen`            | The same voice in deterministic prompts, contact controls, confirmation cards, and fallback messages **COMMENT**: I'm not sure we need this step actually                                                                                                                                                                                                                                          |
| `/plan` and `/build` | Explicit tasks to load the approved persona/examples and supply profile, business state, recent context, and tools                                                                                                                                                                                                                                                                                 |
| `/test`              | Conversation evaluations against approved examples, as well as business and authorization tests **COMMENT**: I think this step is wrong. the agent creator wants to deploy it and test it in real server. maybe they need only to specify the bugs they see after it's deployed. they can specify bugs as versions (with /issue) or just write the issue in the chat with codo/ . what do you say? |

Treat “warm and moist” as the creator's temperament description and translate it into observable behavior: patient replies, gentle clarification, limited pressure, and accommodating questions. The model needs concrete examples to apply those preferences consistently.

Prefer conversational forms such as «رو»، «نشون»، «می‌خواین»، and «می‌شه» where they fit the sentence. The observation that formal vocabulary feels wrong for this persona is useful; an absolute claim that humans never use «است» or «را» is too broad. Evaluate the whole reply, with allowances for quoted text, names, or precise business wording, rather than globally replacing words. **COMMENT**: we should fill what an agent should NOT do. for example it should not use formal wording. where to put them?

Define the role as a virtual registration assistant with a natural voice. Avoid instructions asserting that it is human or giving it a fabricated human biography. If asked whether it is automated, it should answer truthfully. Naturalness can be reviewed directly; guaranteed indistinguishability from a human is not a dependable acceptance criterion.

For FAQ answers, preserve approved facts while allowing the requested Persian style. Keep amounts, payment status, eligibility, and authorization in system-built results; changing conversational wording must not give the model authority to invent those facts. **COMMENT**: correct.

### 7.3 Review examples, then include them in the actual prompt

During `/sops`, the creator should rehearse representative conversations with Codo and revise the wording. Save the approved dialogues in the version records and a maintained dialogue section of the living SOP. `/build` must explicitly load a compact selection into the runtime prompt; a document sitting on disk will not influence the deployed model by itself.

Include an ordinary registration, an incomplete profile name, correction of a guessed name, a contact request, a follow-up requiring old history, an interruption/resumption, fallback/recovery, and a direct question about the assistant's identity. Include the expected tool actions so examples demonstrate working UI rather than merely saying a button exists. Use sanitized examples and keep them distinct from live conversation history.

The following ten-message listener example illustrates the requested register. It is a **draft for creator review**, with synthetic profile data and handles; it is not a recovered live chat or an approved golden transcript.

| # | Speaker | Message / event |
|---|---|---|
| 1 | Customer | `/start` |
| 2 | Sahar | «سلام، خوش اومدین 🌿 دوست دارین توی کارگاه محصول بسازین یا به‌عنوان شنونده شرکت کنین؟» |
| 3 | Customer | «می‌خوام شنونده باشم.» |
| 4 | Sahar | «حتماً. اسم پروفایلتون «امید بهارلو»ئه؛ با همین اسم ثبت کنم؟» |
| 5 | Customer | «بله.» |
| 6 | Sahar | «می‌شه شماره‌تون رو با دکمهٔ زیر بفرستین؟» — followed by the actual contact-sharing control |
| 7 | Customer event | Shares own contact; harness supplies a verified capture event with `[h_phone_verified_aaaaaaaa]` |
| 8 | Sahar | «ممنون، شماره‌تون رسید. حالا کد ملی‌تون رو می‌فرستین؟» |
| 9 | Customer event | Sends national ID; harness substitutes `[h_national_id_bbbbbbbb]` before model input |
| 10 | Sahar | After successful filing/invoice creation: «اطلاعاتتون کامل شد. برای نهایی شدن ثبت‌نام، پرداخت رو از دکمهٔ زیر انجام بدین.» |

At message 6, the proposed contact-request tool must actually succeed before the message claims there is a button. At message 10, the filing/payment capability must produce the valid invoice; the dialogue does not assert payment completion. Other participation types need their own examples, including the builder's idea, AI, server, and owner-approval requirements.
**COMMENT**: good. but use مستمع آزاد instead of شنونده
## 8. Profile context, contact sharing, and question order

**Voice note: 11:47.**

### 8.1 Make the known profile visible to the model

The transport reads `first_name` and `last_name`, places them in `ExecutionContext`, and persists them in the customer record. The deterministic wizard can therefore display a name candidate. But `_prompt_parts()` receives the harness, not the current user's profile, and `agent.run()` receives the scrubbed message plus selected history. Merely storing names in dependency context does not expose them to the model.

Username is absent from the reviewed context and ingestion path. Extend both ingestion and per-turn prompt assembly, with a small allowlisted snapshot containing available profile name and username, the confirmed registration name if one exists, and relevant collected-field status. Provide sensitive references as handles when needed, including a numeric messenger identifier if the model genuinely needs a reference to it. Keep raw numeric identity inside the harness.

Profile names and usernames are user-controlled text. Delimit them as data, cap their size, and never let instructions embedded in them alter system behavior or authorization. A display name is a candidate for conversational confirmation; it does not establish verified identity.

If the profile plausibly provides a full name, ask a short confirmation. If it is partial, a company name, an alias, emoji, or ambiguous, ask for the missing name information. Do not infer a surname from a username or treat two arbitrary words as proof of a complete personal name. Store the user's confirmation/correction so later turns do not repeat the question.

### 8.2 Bridge the existing contact implementation into conversation

The local code already has `CONTACT_KEYBOARD` with `request_contact: true`. `_reg_callback()` sends it after the wizard's name-confirmation callback, and `handle_contact()` processes the response. `monitor.scrub_contact()` marks the phone verified only when the contact's `user_id` matches the authenticated sender; other contacts are classified as unverified.

The missing bridge is in the AI path: the exposed capability list contains no contact-request action. Also, `handle_contact()` routes the contact through wizard state and deterministic responses; it does not automatically supply a fresh conversational model turn with the result.

Add a capability such as `request_my_contact()` with no recipient/identity argument. It should send the genuine contact keyboard and establish the pending phone-capture state. Because it sends UI, it belongs to an allowed outbound/direct action class rather than a read-only tool.

When a contact arrives, the harness should validate and vault it, persist the field and verification status, and supply the conversational layer with a structured event such as `phone_received`, its handle, and its verified/unverified status. When AI is unavailable, the deterministic workflow consumes the same capture result.

A third party's shared contact or a typed phone must never become a verified self-contact. Preserve the current distinction. If self-contact is required for this registration flow, request it again with a clear explanation. If a typed fallback remains permitted, label it unverified and apply the approved business policy explicitly. Plaintext phone values must stay outside model-visible messages and history. **COMMENT**: only verified. but for companion, let them write the companion phone, name and national ID.

### 8.3 Use progressive collection with durable state

Recommended registration sequence:

1. Clarify participation type or the customer's intended outcome; explain options conversationally when needed.
2. Confirm a plausible profile full name, or ask for the missing name information.
3. Send the contact-sharing control, then consume and validate the resulting event.
4. Ask for the remaining required identity field, with capture and validation in the harness.
5. For builders, complete the final idea, accepted AI, and server information; reuse details already gathered in advisory conversation.
6. Present any required system-built confirmation and follow the existing approval/payment rules.

Ask one unresolved question per turn. If the customer volunteers several fields in one message, retain the valid information and continue from the next missing field. Do not force them to repeat it. Ordinary name confirmation can be conversational; it must not substitute for a required nonce-based business authorization.

The deterministic wizard already starts with participation type, so that part can be retained. The conversational procedure needs the same ordered collection contract instead of “in any order.” Companion handling and existing pricing/eligibility rules should be carried through their own defined branch without being redesigned as part of this correction.

## 9. Attribution: where the failures originate

The evidence supports a layered diagnosis rather than assigning every problem to the implementation model:

| Layer | Supported finding | Required correction |
|---|---|---|
| Distribution | Missing native integrations and initial version input; greeting-driven installation | Build-time adapters and artifact validation |
| Generic Codo procedures | Broad persona/history requirements without detailed context, retrieval, dialogue, and presentation contracts | Strengthen the existing lifecycle procedures and their completion criteria |
| Registration specification | Persistent menu drawer, menu handoffs, formal samples, and fixed FAQ wording are explicitly documented | Update living documents and record the changed decisions in version 0.2 |
| Runtime | Successful AI replies attach navigation; profile data stays outside the prompt; history is narrow; contact action is not exposed to the model | Change context assembly, routing/rendering, retrieval, and capabilities |
| Verification | Inspected scripted tests prove useful mechanics but do not prove tone, progressive collection, or online menu absence | Add behavioral acceptance coverage and creator-reviewed model conversations |

The earlier [registration questionnaire](../../../registration/docs/versions/0.1/02-prd-questions.md), question 19, records default menu labels. That supports the existence of a fallback surface, but does not establish approval for a permanent keyboard during healthy AI conversations. The V7.2 recording supplies the explicit presentation requirement to carry forward.

Improving Codo helps future generated agents. Registration also needs direct corrections to its existing specification and code; editing the kit alone will not update an already built agent.

## 10. Acceptance criteria for the implementation

The following are proposed release checks. They have not been executed as part of this analysis.

| Area | Scenario | Expected result |
|---|---|---|
| Artifact | Inspect a newly built public-agent ZIP | Initial idea-input template and all selected native integrations are present; generated bodies match canonical procedures |
| Four-tool rehearsal | Open a fresh extracted kit in each supported tool/version | Native start procedure loads without a greeting/copy/restart installation step; Codex invocation is documented accurately |
| Starter scaffold | Open `docs/` as an Obsidian vault | `versions/0.1/00-idea-input.md` is visible and ready for input |
| Healthy AI | Start and complete ordinary conversational turns | No generic navigation menu appears, including on `/start` and after tool replies |
| Required UI | Request contact, required confirmation, or payment with AI available | The specific functional control appears and works |
| Fallback | Simulate provider timeout/outage or an applicable model budget limit | Harness records the reason and makes core workflows available without model calls |
| Recovery | Restore AI during a partly completed registration | Fallback keyboard is removed and collected state remains usable |
| Error classification | Fail a business tool while the provider remains available | Error is handled without falsely classifying it as provider unavailability |
| Recent context | Hold a conversation involving AI replies, contact capture, and deterministic events | Subsequent model input contains relevant recent events and current state within the context budget |
| Long pause | Return after the recent-time horizon | The agent retains a bounded recent minimum and can retrieve older details |
| History filters | Retrieve last N, a time interval, and any of several Persian keywords | Results obey documented filters, ordering, and pagination |
| Scope | Request another person's history or supply a foreign handle | No unauthorized history or secret resolution occurs |
| Profile | Supply a plausible full name and a username | Both appear as data in the model context; the agent asks for name confirmation rather than starting from scratch |
| Ambiguous profile | Supply a partial/alias name or instruction-like profile text | Agent asks the needed clarification and treats profile content as data |
| Contact delivery | Agent asks the customer to share a number | A real contact-sharing control is sent, rather than an unsupported textual claim |
| Contact ownership | Share own contact, another person's contact, and a typed number | Only authenticated own-contact match receives verified status; model sees handles and verification status |
| Progressive collection | Follow the ordinary path, then volunteer several fields at once | One unresolved question at a time; valid supplied fields are reused |
| Voice | Review real model dialogues across ordinary and awkward situations | Creator accepts the Persian register, warmth, patience, and phrasing; deterministic templates receive the same review |
| Truthfulness | Ask whether Sahar is automated | Truthful answer without fabricated human identity |
| Business regression | Exercise registration, approval, invoicing, payment notification, and cancellation | Existing authorization and engine-computed business rules remain effective |

Use deterministic tests for routing, UI policy, field state, scope, and tool behavior. Use actual configured-model rehearsals and human review for conversational quality; a scripted model returning a fixed string cannot establish that quality.

## 11. Implementation sequence and remaining choices

The recording ends with an explicit sequence: analyze and settle the approach, then apply the agreed changes together. The recommended implementation order is:

1. **Record the behavioral contract.** Agree the decisions below, revise shared Codo requirements, and create `registration/docs/versions/0.2/` with change rationale and acceptance scenarios. Preserve 0.1 records and update living documents to the new behavior.
2. **Repair the kit.** Add build-time adapters, the initial idea-input template, and package validation. Update the constitution, entry files, and participant book so the delivered instructions describe the new start experience.
3. **Repair registration.** Implement presentation policy and mode transitions, profile/state context, bounded history plus retrieval, the contact-request capability/event bridge, ordered collection, and reviewed persona/examples/templates.
4. **Verify the result.** Run targeted regression tests, inspect generated archives, rehearse the supported coding tools, and review actual Persian conversations. Compare local findings against the deployed revision and the reported chat trace.
5. **Release and observe.** Deploy the verified registration revision under the agreed release procedure, check healthy conversation and fallback/recovery in Bale, and record the deployed revision and results in the 0.2 documentation.

The remaining choices are narrow enough to resolve without another large redesign:

| Choice                                     | Recommended default                                                                        | Reason                                                                                                                                                                                                                           |
| ------------------------------------------ | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Separate `/persona` or dialogue command    | Keep `/prd` and `/sops`, with explicit required outputs and review checkpoints             | Addresses the missing specification and runtime handoff while preserving the current phase chain                                                                                                                                 |
| Universal literal `/start`                 | Use native invocation per tool, including Codex `$start`                                   | Matches the documented integration rather than depending on a nonexistent uniform command loader **COMMENT**: wasnt my proposal good enough? to fill .claude/commands/ and all other 3 command paths in codo to zip compile time |
| Recent context policy                      | Configurable 30-minute horizon, token budget, and small recent-turn minimum                | Covers both active chats and returning customers                                                                                                                                                                                 |
| Own-contact requirement and typed fallback | Require verified self-contact on the primary path; keep any fallback explicitly unverified | Preserves the distinction already represented by the harness                                                                                                                                                                     |
| Location of general guidance               | README overview plus short tool entry files and `docs/constitution/` rules                 | Supports human orientation and automatic instruction loading                                                                                                                                                                     |

The highest-impact correction is to make the intended conversation an explicit deliverable across specification, prompt, tools, deterministic UI, and acceptance review. That is the common thread connecting the reported failures.

