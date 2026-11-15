# V7.2 — Analysis Round 3: Feature Versions, Bug Patches, and Prompt Authoring

> **Input:** The two new **COMMENT** annotations in [03-analysis-round2.md](03-analysis-round2.md).  
> **Date:** 2026-11-02.  
> **Status:** Revised recommendations for implementation.

## 1. Keep both `/iterate` and `/issue`

Your distinction is useful. It supersedes my recommendation to replace `/iterate` with `/issue`: planned development and correcting existing behavior deserve separate entry points.

| Entry | Purpose | Version result |
|---|---|---|
| `/iterate` | Select a feature from `docs/living/roadmap.md` and develop the next increment | New minor folder, such as `0.2/` |
| `/issue` | Record and investigate a bug in existing behavior | Patch folder inside its minor folder, such as `0.2/0.2.1/` |
| Ordinary chat | Recognize a clear feature request or bug report and follow the corresponding procedure | Same records and workflow, without requiring command syntax |

Use the project's existing numeric directory naming; these versions can be displayed as V0.2 and V0.2.1:

```text
docs/
  living/
    roadmap.md
  versions/
    0.2/
      scope.md
      release.md
      0.2.1/
        issues.md
        release.md
```

`/prd` records deferred features in the roadmap. `/iterate` selects from it, records the new scope, updates the affected living specifications, and carries the feature through build and deployment. Link the roadmap item to its release and update its status.

`/issue` records observed versus expected behavior, diagnosis, correction, and verification. Related bugs may share an unreleased patch. After deployment, subsequent fixes open the next patch folder. Patch records describe changes; Git identifies the exact released code. Living documents remain the current specification.

Target the release that actually has the bug. If 0.1 is deployed while 0.2 is being prepared, the fix belongs under `0.1/0.1.1/`; carry it into 0.2 where applicable. Record both the deployed version and the version being developed in `docs/status.md`. **COMMENT**: no. I think it's better to just append the bug folder to latest minor folder.

## 2. Add `/prompts` before implementation

**Yes: write and review the actual system prompt before `/build`.** This provides a concrete deliverable that the previous workflow left to the implementation assistant's interpretation. That missing handoff contributed to the persona and dialogue problems.

Draft it once the persona and SOPs exist, and finalize it when tool names, capability rules, and failure behavior are settled. The precise position matters less than having reviewed prompt text available before coding.

Proposed outputs:

- `docs/prompts/system.md`: the actual runtime instructions, including persona, preferred language, “must not do” rules, collection order, tool-use guidance, and handling of missing information.
- `docs/prompts/examples.md`: reviewed dialogues showing the voice and expected tool actions.

These files contain deployable prompt content. `/prompts` should also show an assembled example with synthetic profile/state data so the creator can understand what the model will receive.

During `/build`, make the runtime load the approved files directly rather than authoring another independent copy. Add fresh profile, business state, and bounded conversation context at runtime. Keep user-controlled profile/history content clearly identified as data, and obtain tool schemas from the implemented capabilities.

PRD and SOPs retain the product decisions; the prompt expresses those decisions to the model. A later feature or bug fix updates the affected specifications and prompt files together. Harness rules still enforce identity, verification, authorization, and menu visibility.

The resulting workflow retains `/iterate`, adds `/issue` and `/prompts`, and carries forward Round 2's removal of separate `/screen` and creator-facing `/test` phases. Automated checks stay inside build/deployment; creators review behavior in the deployed agent.
