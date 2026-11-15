# Round 002 — remaining choices after your answers

Project: 002-claude-server · result V0.1 · publishing workflow 0.3
Status: **waiting for answers in this file before dependent implementation**.

Your submitted [round 001](001-review.md) is preserved. [decisions.md](decisions.md) records its answers and overrides; [story.md](story.md) applies the changed sequence. Do not answer already-settled items again: separate problem/solution slides, root only, AI-managed key setup, interactive password entry, validate the form, and put reconnect after cloning and editing CLAUDE.md.

Edit the fields below or add COMMENTs. Blank fields remain pending. Questions have options; uncertain decisions have confirmation/override fields.

## Questions — choose an option

### Q1 — Scope of the cheapest-server comparison

I checked VPS Market's international country offerings and captured real screenshots myself. Its lowest qualifying advertised monthly examples tie across Germany, France and Canada, at approximately 1.143 million toman. That is a bounded supplier comparison, not proof of the world's cheapest VPS. The detailed [comparison](research-vps.md) includes sources and exclusions.

- **A. Use the cheapest qualifying VPS Market example (Recommended).** Matches the supplier in your recording; include other suppliers as an option without a global cheapest claim.
- **B. Expand the comparison to other providers before selecting the example.** More research; compare actual payable terms, availability and requirements instead of headline promotional prices.

**Answer:** if cheapest are tie, then compare based on tax. I think Canada has less tax than europe.

## Uncertain decisions — confirm or override

### D1 — Git synchronization rule (unanswered in round 001)

**Proposed decision:** before a meaningful task, inspect status/branch, fetch, and pull with `--ff-only` when the working tree and branch permit it. After checks, commit only the task's changes and push. Report conflicts, divergence or missing permissions; never force-push or overwrite concurrent work. The local AI appends the rule to CLAUDE.md without replacing existing instructions.

This refines the recording's “pull before / push after every task.” It was left blank in the previous round, so it is still a proposal.

**Confirmation / override:** I dont see why it's better than “pull before / push after every task.”

### D2 — Claude controls and tmux recovery (unanswered in round 001)

**Proposed decision:** explain `/model`, `/effort` and permission controls offered by the installed Claude version. Do not hardcode a model/effort combination or assume auto mode is everyone's default. Show reconnect-or-create and separate new-session commands. Explain that tmux survives a lost SSH connection but does not survive a server reboot; restarting a session is different from restoring its running processes.

This corrects version-dependent assumptions in the recording. The earlier answer was blank.

**Confirmation / override:** confirmed

### D3 — Concrete supplier example and screenshot

**Proposed decision:** if Q1=A, use **VPS Market DE 4 (Germany)** as the example, tied at the lowest advertised qualifying price in the checked country offerings. It has 4 GB RAM, 2 vCPU and 30 GB SSD; its configuration screen explicitly offers Ubuntu 24.04 x86_64. The page rounds the price to 1,143 thousand toman; the configuration screen lists a monthly base of 11,434,880 rial (1,143,488 toman). Date the price and tell readers to check their final total.

I chose Germany among the tied examples; that tie-break is a proposed decision. Germany appears on Anthropic's supported-region list, which is not proof that the reader's physical location/account qualifies or a general legal assessment of sanctions. The post's ban-related benefit remains explicitly an unverified possibility, as you requested.

Actual images obtained by the assistant:

- [Plan screenshot](../../../../../projects/002-claude-server/inputs/vpsmarket-de4-2026-11-09.png)
- [Configuration / Ubuntu screenshot](../../../../../projects/002-claude-server/inputs/vpsmarket-de4-ubuntu-2026-11-09.png)

No order or payment was submitted. If Q1=B, this is a candidate until the wider comparison is complete.

**Confirmation / override:**

## Additional comments
