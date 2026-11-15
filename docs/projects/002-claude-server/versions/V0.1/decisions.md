# Decisions from round 001

Source: [001-review.md](001-review.md), including saved Answer fields and COMMENTs. The submitted round is preserved. A blank answer is not confirmation. The latest chat instruction authorizes the corrected review/versioning/roadmap conventions, not blanket approval of the post.

| Item | Owner response | Adopted result |
| --- | --- | --- |
| Page opening | Split problem and solution into two slides | Separate opening slides |
| Return to work | Move after Git clone and CLAUDE.md editing, with those as two slides | Clone → edit project instructions → reconnect |
| Password | Q1's earlier COMMENT adds password; Q3's explicit answer accepts keeping it out, but rejects manual ssh-copy-id | Use the later specific answer: no browser/prompt password. Local AI initiates key setup; reader only enters the password interactively. No step asking the reader to execute ssh-copy-id themselves. |
| Form completion | “after user filled all fields, they can proceed.” | Validate required fields before enabling prompt creation; supplied defaults still need valid values |
| Root vs normal user | “no. one user (root) is sufficient.” | Root only. Remove the proposed normal-user creation and its form field. Do not silently reintroduce it. |
| Intro | “do not promise it. just suggest it as possibly prevents ban.” | Present the possible benefit as an unverified hypothesis, not an established reduction in bans. Retain the researched physical-location context. |
| Supplier screenshot | Asked the assistant to obtain it and find the cheapest qualifying server in a non-sanctioned country | Research and screenshot are assistant-owned. Actual screenshot captured; comparison scope and exact example are exposed in round 002. |
| Git rule | Blank | Still unresolved; D1 in round 002 |
| Models/effort/permissions/persistence | Blank | Still unresolved; D2 in round 002 |
| Earlier title / complete design | No blanket confirmation supplied | Working baseline only; do not mark the full post accepted |

The next round separates option-based questions from uncertain decisions that need confirmation/override. Do not reopen the root/password/key-setup choices already answered.


## Round 002 and the owner's later chat clarifications

The owner submitted round 002 and explicitly said blanks mean they do not care: proceed with a reasonable default, but never make it a hard rule. Previous rounds are preserved as submitted; their historical “blank pending” text is superseded by this explicit policy.

- **Confirmed:** D2's model/effort/permissions and tmux-recovery scope.
- **Clarified:** Q1 compares tax on the Claude subscription, not VPS Market tax. The owner specifically repeated that subscription tax should break a VPS-price tie. Use Canada as the example; record provincial-rate and billing-address assumptions in research-claude-tax.md. A VPS cannot establish a billing address or a 5% invoice.
- **Git explanation:** D1 questioned why the refinement was better. The high-level rule is unchanged: pull before every task, push afterward. Status checks, --ff-only and reporting failures specify what to do if that operation cannot safely succeed; they do not redefine the task boundary. The page uses the owner's simple wording; the generated prompt includes the concrete failure handling as a local implementation default.
- **Delegated:** D3 was left blank. The previous German tie-break was therefore not confirmed as a hard rule; the later explicit Canada/VAT instruction supersedes that candidate. No repeat confirmation is needed.
- **Local defaults:** headline, colors, safe input grammar, prompt download and OS-specific terminal list are reversible V0.1 choices, not a universal publishing template.

No material owner question remains. Continue through the workflow, verify the real result and publish on the existing authorized host. Human acceptance of the completed artifact is not invented; readiness and actual deployment evidence remain separate.
