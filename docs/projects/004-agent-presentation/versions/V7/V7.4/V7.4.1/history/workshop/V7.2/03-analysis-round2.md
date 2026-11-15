# V7.2 — Analysis Round 2: A Simpler Workflow and Explicit Behavior Rules

> **Input:** The seven **COMMENT** annotations in [02-analysis.md](02-analysis.md).  
> **Date:** 2026-11-02.  
> **Status:** Revised recommendations; implementation remains the next stage. This round supersedes the corresponding recommendations in Round 1.

## 1. Your compile-time packaging proposal is sufficient

**Yes: prepare integrations for all four tools when compiling the ZIP.** My previous wording gave the invocation detail too much prominence and made it sound like an objection to your proposal. It is an adapter detail within that proposal.

Keep one canonical command source and generate these files into the **same delivered kit**:

| Tool | Generated project files | Native invocation |
|---|---|---|
| Claude Code | `.claude/commands/<name>.md` | `/start` |
| OpenCode | `.opencode/commands/<name>.md` | `/start` |
| Codex | `.agents/skills/<name>/SKILL.md` | `$start` |
| Antigravity | `.agents/skills/<name>/SKILL.md` | `/start` |

Codex and Antigravity share a directory, so four integrations need only three generated directory trees. The formats and invocation spellings follow the official documentation reviewed in Round 1: [Claude](https://code.claude.com/docs/en/slash-commands), [OpenCode](https://opencode.ai/docs/commands/), [Codex](https://learn.chatgpt.com/docs/build-skills), and [Antigravity](https://antigravity.google/docs/migration/workflows-to-skills).

The participant opens the extracted kit and starts immediately using their tool's spelling. Remove greeting-time copying and repeated installation checks. This accepts your proposal without adding a setup step.

## 2. Remove the separate `/screen` phase

For this messenger-agent workshop, a dedicated phase adds little. Merge its necessary outputs into `/sops`: message wording, contact controls, confirmation/payment cards, callbacks, and fallback presentation. They can live beside the workflow they serve in `docs/living/sops.md`.

The current [screen procedure](../../../workshops/public-agent/codo/docs/commands/screen.md) explicitly prescribes a welcome keyboard and consultation buttons. When merging it, remove those generic defaults and apply the agreed rule: navigation menus appear only during harness-selected fallback; necessary contact, confirmation, and payment controls remain available during normal conversation.

Update the command chain, status template, book, and generated integrations together. Existing registration screen details can be migrated into its SOPs while preserving the old version records.

## 3. Let creators test the deployed agent and report issues naturally

I agree with removing `/test` as a mandatory **creator-facing phase**. The creator should reach a working server deployment, try the agent in the real messenger, and describe what needs correction.

Keep proportionate automated checks inside `/build`, plus service/webhook smoke checks inside `/deploy`. Codo runs those checks itself. The creator evaluates the actual conversation after deployment; scripted replies cannot establish whether Sahar sounds right.

The release loop becomes:

```text
/plan → /build → /deploy → try the real agent
                              ↓
                /issue or an ordinary chat report
                              ↓
           investigate → update docs/code → check → redeploy
```

Use `/issue` as the explicit entry point, replacing the current user-facing `/iterate` entry. An ordinary message such as «هنوز اول گفتگو منو می‌فرسته» should enter the same workflow without requiring command syntax or a formal bug template.

Codo should record expected versus observed behavior, inspect relevant logs/code, and place the issue in the next version folder. Related reports can share `docs/versions/0.2/`; a later release uses the next version rather than hard-coding `0.2` as the current [iteration procedure](../../../workshops/public-agent/codo/docs/commands/iterate.md) does. Update the affected living documents, implement the targeted fix, verify it, and carry it through deployment. A bug fix should not force the creator through the entire specification chain again.
**COMMENT**: I think we should have both /iterate (for picking a feature from roadmap.md and start a new minor version (like V0.2) folder) and /issue (to write down the bug in the chat and open a patch version (like V0.2.1) subfolder in the minor subfolder (V0.2)) what do you say?
## 4. Put “must not do” rules in the PRD

Add an explicit **Behavioral boundaries / Must not do** section to `docs/living/prd.md`, beside the persona. During `/prd`, ask the creator what feels wrong as well as what they want, then record concrete examples.

For Sahar, that section should include:

| Must not do | Expected behavior | Enforcement |
|---|---|---|
| Use formal, bookish Persian in ordinary replies | Approved conversational register: «می‌خواین»، «رو»، «نشون» | Persona, dialogue examples, and deterministic templates |
| Show general navigation while AI is available | Continue conversationally | Harness rendering policy |
| Ask for all registration fields in one message | Ask the next unresolved question and retain volunteered information | SOP, prompt, and saved field state |
| Ask again for already confirmed information | Reuse the confirmed profile/registration state | Context assembly and SOP |
| Invent prices, payment completion, or eligibility | Use authoritative system results | Engine and capability boundaries |

`/sops` turns these boundaries into examples and workflow details; `/build` carries them into prompts and code. Style is a creator-selected product requirement, so Sahar's conversational Persian should not become a compulsory voice for every agent produced by Codo. **COMMENT**: do we need to write the system prmpt early? e.g. after /sops, we could have a /prompts step to write down the actual system prompt. what do you say? I'm not about step position.

Your approval of preserving FAQ facts while allowing natural wording carries forward. Facts remain authoritative; phrasing follows the approved persona.

## 5. Use «مستمع آزاد» consistently

Use **«مستمع آزاد»** in the registration agent's customer-facing examples, prompts, templates, and documentation. Replace «شنونده» in the sample dialogue:

- Sahar: «دوست دارین توی کارگاه محصول بسازین یا به‌عنوان مستمع آزاد شرکت کنین؟»
- Customer: «می‌خوام مستمع آزاد باشم.»

The existing internal `listener` identifier can stay; this is a terminology correction.

## 6. Separate registrant verification from companion information

Your comment settles the earlier open choice:

| Person | Accepted phone input | Verification meaning |
|---|---|---|
| Main registrant | Their own contact-sharing event, with contact user ID matching authenticated sender | Verified self-contact; typed or third-party numbers do not satisfy registration |
| Companion | Registrant types companion's full name, phone, and national ID | Information reported by the registrant; no claim of verified phone ownership |

Enforce the main registrant's verified-contact requirement in the registration capability/engine, including the fallback path. The current implementation distinguishes verified and unverified handles but still accepts both in registration, so this requires a behavioral change beyond prompt wording.

For companions, ask progressively for the three fields, capture phone and national ID into the vault before model input, and associate their handles with the companion record under the caller's registration. They must not overwrite the registrant's own fields or establish caller identity. Validate input format without presenting it as ownership verification.

This also expands the current implementation: [the companion capability](../../../registration/app/capabilities.py), [engine](../../../registration/app/engine/companions.py), and [schema](../../../registration/app/schema.sql) currently collect/store only the companion name. Registration 0.2 needs corresponding fields, migration, collection steps, and owner-card updates.

## 7. Scope carried into implementation

Carry forward the earlier fixes for the initial idea scaffold, bounded recent context and history retrieval, profile visibility, persona/example loading, and the model-callable contact request. Apply this round's simpler phase structure and explicit phone policy to those fixes.

The work should update **Codo and its book**, then **registration's 0.2 records, living specification, and runtime**, followed by deployment and real conversation review. This round adds no new mandatory creator commands beyond the proposed `/issue` feedback entry.
