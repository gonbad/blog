# Post 002 — questions and decisions for your review

Status: **WAITING FOR YOUR ANSWERS IN THIS FILE.** The post has not been built or published.

Edit the Answer fields, or add COMMENTs next to the proposals. You may confirm all proposals together and list exceptions in the final field. Empty fields and silence mean pending, not confirmation. Once you tell the assistant the file is ready, it must reread the saved answers before continuing. Questions belong here, not in chat or an interactive question widget.

## Already supplied by you — no repeat questions

Your final direction in the [transcription](../../../../../../workshop_docs/versions/V8.0/09-second-post-transcription.md) replaces the manual script-by-script tutorial with **one generated prompt for the AI already installed on the reader's computer**. The tutorial targets an Ubuntu 24.04 server with at least 4 GB RAM, 2 vCPU and 20 GB disk. Browser inputs stay in temporary memory. Setup covers SSH keys, tmux, Claude, Git, login and returning to work. This is project 002, although you said it may become the first post in your intended publication order.

## Q1 — Page sequence, before building

This is my proposed sequence, not an approved design:

| Scene                                                                                                            | Reader sees                                                                                | Reader does                                      | Result                                                     |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------ | ---------------------------------------------------------- |
| 1. Continue on a server **COMMENT**: split in two: problem and the solution in two slides.                       | Computer → SSH → Ubuntu/tmux/Claude; Git carries files                                     | Read a brief introduction                        | Understand what moves and what stays local                 |
| 2. Obtain the server                                                                                             | Resource/OS checklist; VPS Market link and your plan screenshot when supplied              | Buy a server and obtain its IP and initial login | Has the required server details                            |
| 3. Describe your setup                                                                                           | OS, terminal, IP, login user/port, repository and session fields **COMMENT**: and password | Enter details locally                            | Validated configuration for the prompt                     |
| 4. Give the task to your AI                                                                                      | One complete generated setup prompt                                                        | Copy it into the local coding assistant          | Assistant prepares access, tools, repository and session   |
| 5. Complete human handoffs                                                                                       | Host fingerprint, SSH login, public Git key and Claude browser login                       | Perform interactive/account actions              | Setup can finish without pretending the AI completed login |
| 6. Return to work **COMMENT**: move it after git clone and claude.md edit (by local AI)(two slides move forward) | Personalized reconnect/new-session commands and Claude controls                            | Copy a command and connect                       | Work in a persistent tmux session                          |
| 7. Keep work synchronized                                                                                        | A short project rule for CLAUDE.md and troubleshooting                                     | Save the rule; use it for later tasks            | Changes travel through Git with failures reported          |

Proposed delivery: the same manual vertical navigation and reading mode as post 001, plus a usable offline ZIP. The form and generated prompt replace the first post's example widgets. Audio/video/auto-advance remain deferred under your previous direction.

**Question:** Confirm this sequence and delivery, or specify what to add, remove or combine.

**Answer:**

## Q2 — Introduction and the account-suspension claim

The official [supported-regions policy](https://www.anthropic.com/legal/supported-regions), checked 9 November, does state an effective date of **12 November 2026 / 21 Aban 1405**. It explicitly includes the user's physical location. That source does not establish that moving to a foreign server prevents account suspension, nor does it measure how often accounts are suspended.

**My proposed change to the recording:** introduce this as a remote-work tutorial, with a short accurate paragraph about the upcoming policy. Avoid promising ban prevention. Working title: «محیط کارت را روی سرور ادامه بده». **COMMENT**: do not promise it. just suggest it as "possibly" prevents ban.

**Question:** Confirm that framing/title, or give your preferred introduction and title. This is an editorial choice for your review; the researched facts remain documented in research.md.

**Answer:**

## Q3 — Password handling

The recording suggests putting the server password in the form and generated prompt.

**My proposed override:** no password field and no password inside the prompt. The reader enters it directly in their local terminal when needed. The local assistant configures and tests key-based login. The post explains two separate connections: computer → server and server → Git provider. Each uses its own key pair; only public keys are shared.

**Question:** Confirm this change, or describe the password experience you want.

**Answer:** it's OK. but it's not OK that user does a ssh-copy-id themselves.

## Q4 — Extra fields and supported repository URLs

Your recording explicitly supplies OS, terminal, IP and repository. I additionally propose an SSH port (default 22), initial login user (default root, editable), normal working user (default workshop, editable), and tmux session name (default work, editable). Show advanced fields in an expandable group. Start with SSH repository URLs for GitHub/GitLab and explain converting an HTTPS clone URL; do not silently assume a private repository is public.

**Question:** Confirm these additional fields and initial repository support, or simplify/change them.

**Answer:** after user filled all fields, they can proceed.

## Q5 — Root for setup, normal user for daily work

**My proposed addition:** the AI first inspects the server. It may use the provider's initial root account to create/configure a normal user, but Claude and tmux run as that normal user. Preserve existing access; do not change SSH/firewall policy blindly. This adds a setup step compared with using root throughout.

**Question:** Confirm this design, or specify your preferred account setup.

**Answer:** no. one user (root) is sufficient.

## Q6 — Pull/push rule

The recording says to pull before and push after every task.

**My proposed refinement:** at task boundaries inspect status/branch and fetch; use `git pull --ff-only` when the working tree and branch permit it. After checks, commit only the task's changes and push. Stop and report conflicts/divergence/permission errors; do not force-push or overwrite concurrent work. Append a scoped rule to CLAUDE.md without replacing the project's existing instructions.

**Question:** Confirm this refinement, or change the intended synchronization rule.

**Answer:**

## Q7 — Models, effort, permission controls, and tmux persistence

**My proposed correction:** show `/model`, `/effort` and the installed version's permission controls, without promising that Haiku supports every effort level or that auto mode is always the default. Explain that tmux survives an SSH disconnect but not a server reboot; offer a reconnect-or-create command and a distinct command for a new session. Version-dependent details will be checked against current official docs before final copy.

**Question:** Confirm this scope, or specify models/settings or reboot recovery you want demonstrated.

**Answer:**

## Q8 — Your VPS Market screenshot and the purchase scene

I verified the supplier's [website](https://vpsmarket.org/) and [Germany offerings](https://vpsmarket.org/vps-germany/). I have not selected your intended plan. I will not assert that this supplier is cheapest, promise a provisioning duration, or invent a checkout price.

You mentioned supplying a screenshot of the intended plan. It is needed during content/style work, before including that image in scene 2. Put the image at `blog/projects/002-claude-server/inputs/vpsmarket-plan.png`, or write another existing local path below. Please use an image without credentials or personal billing details.

**Question:** Supply the screenshot/path and plan choice, or confirm that the first draft should use the provider-neutral resource checklist while the screenshot waits.

**Answer:** can you supply the screenshot yourself? I want the cheapest VPS with those requirements in a non sanctioned country

## Overall confirmation or additional comments

You can write “Confirm Q1–Q8 except …” here instead of filling every field. No option is selected for you.

**Answer:**

## What happens after submission

The assistant preserves your answers, records confirmed/overridden decisions in decisions.md, completes research it owns, and follows the revised blog workflow. If your answer creates another material uncertainty, it updates this file and waits again. It does not duplicate questions in chat. Setup/login on a real reader's server remains distinct from testing this post's generator and commands.
