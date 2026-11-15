# V0.2 content and implementation decisions

Primary authority: [01-transcription.md](01-transcription.md). Earlier answers remain in V0.1; the new direct instructions supersede them where they differ.

## Explicit owner choices applied

- Keep the visual style; replace the problem/solution content and move the terminal illustration to the solution.
- Make buying and every reader action explicit. Show supplier URLs as URLs.
- Collect username/password/port/IP and GitHub URL/token in separate steps. Include the actual values in the generated prompt.
- English automation prompt, short faded preview, complete-view modal, copy and text download.
- The local AI performs all setup and CLAUDE.md edit/push. Remove the old three setup-explanation scenes.
- Separate same-session reconnect, named create-or-attach session, Claude login, CLI controls, and local editing.

## Necessary technical decisions

**GitHub transport:** a PAT authenticates HTTPS Git operations, not SSH. The form accepts the requested copied SSH URL (also HTTPS); the English prompt carries the original URL plus its normalized HTTPS form. The local AI configures token-backed Git credentials and uses that form for clone/pull/push. No separate Git SSH-key setup is imposed on the reader. [GitHub token documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

**Credential handling:** the password and token are intentionally inside the full prompt, as now requested. Browser values stay in memory until explicitly copied/downloaded. No website backend receives them; there are no storage APIs or analytics. The preview shows initial task lines, and the complete modal contains the whole prompt. Tests use synthetic credentials. This does not impose the earlier no-secret-prompt preference on V0.2.

**Language:** the entire generated prompt is English. Non-ASCII characters in a credential are JSON-escaped, preserving the credential after decoding without introducing Persian into the automation artifact. The teaching UI remains Persian.

**Sessions:** main session work; the other-session input defaults to work-2. Both commands use tmux new-session -A, so a matching name attaches instead of deleting/replacing existing work. The main session command does not change when the other name is edited.

**Local editing:** main/master/custom is a simple selector, not a branch-management lesson. The generated commands select that branch, pull before editing, and stage/commit/push after saving. Shell-specific quoting supports Bash/Zsh and PowerShell; these are local defaults. The push command also works when there is no new commit to make.

**Copy wording and claims:** the account-closure framing is the owner’s supplied editorial position. The internal claims ledger distinguishes it from independently verified product facts. The reader-facing problem/solution is not replaced by the earlier continuity story or caveat block.

No unresolved owner choice requires a new question round. These implementation defaults are local to V0.2, not new hard content rules for future posts.
