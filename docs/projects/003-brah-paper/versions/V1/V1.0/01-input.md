# BRAH Paper — Milestone V1.0 (Threat Model & Reference Monitor)

Source: Extracted from Workshop V6.0.3 architecture reviews.

## Core Problem
In public multi-tenant AI systems, both the caller and the LLM planner are untrusted.
Prompt-level defenses fail against confused-deputy attacks and prompt injection.

## Decisions Made
1. Demote LLM planner to an advisory leaf node.
2. Introduce 3-layer deterministic harness (Ingress -> Reference Monitor -> Port State Machine).
3. Require deterministic fallback (LLM-Zero).
