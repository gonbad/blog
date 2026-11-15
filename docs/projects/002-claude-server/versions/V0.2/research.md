# Research ledger — checked 9 November 2026

Research is the assistant's task. Primary sources below support precise claims; the transcription is intent, not evidence of current product behavior.

| Claim | Result and effect on the post | Primary source |
| --- | --- | --- |
| A policy starts 21 Aban | Confirmed: the official supported-regions page states effective 12 November 2026. It explicitly includes physical location of users. Iran is absent from the supported list. A foreign server does not establish eligibility; no ban-prevention claim. No evidence here of a measured increase in suspension rates. | https://www.anthropic.com/legal/supported-regions |
| Ubuntu / hardware | Official setup supports Ubuntu 20.04+ and 4 GB+ RAM. This tutorial chooses Ubuntu 24.04 and the owner's 2 vCPU / 20 GB baseline; those are not all official Claude minimums. | https://code.claude.com/docs/en/setup |
| Claude installer | Official native Linux command is `curl -fsSL https://claude.ai/install.sh \| bash`; verify installed version and PATH under the normal user. | https://code.claude.com/docs/en/setup |
| Existing subscription / headless login | Eligible subscription login is supported. If browser doesn't open, copy URL to local browser; paste a login code only if the terminal asks. Do not copy authentication tokens to the prompt generator. | https://code.claude.com/docs/en/authentication |
| Model and effort | `/model` selects available models; `/effort` exists in current docs. Available levels depend on model/version/account; use installed UI rather than hardcoding Haiku+xhigh. | https://code.claude.com/docs/en/model-config |
| Permission control | Inspect current permission modes before describing Shift+Tab; never assume every account starts in auto mode. | https://code.claude.com/docs/en/permissions |
| Git SSH setup | Add the **public** server key to GitHub as an authentication key, test access, clone an SSH remote; credentials on the laptop are not automatically present on the server. | https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account |
| Persistent work | tmux sessions can be detached/reattached. They survive a dropped SSH connection, not a server reboot. | https://github.com/tmux/tmux/wiki/Getting-Started |
| Supplier | VPS Market's own website is vpsmarket.org and lists international Linux offerings. An exact qualifying plan, checkout price or provisioning time has not yet been selected/verified. | https://vpsmarket.org/ |

No paid provisioning, real account login, credential transfer or reader-server setup has been performed. Browser/prompt tests will be reported separately from end-to-end operational testing.
