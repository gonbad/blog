# Source-to-result scene and actor mapping — V0.2

Source: [01-transcription.md](01-transcription.md). These requirements come from the new input, not from the old ten-scene result.

| Scene / ID | Source passage | Reader sees / does | Delegated work |
| --- | --- | --- | --- |
| 1 problem | 18:51 | Account closures / 21 Aban problem only | None |
| 2 solution | 18:53 | Run Claude on a server outside Iran; terminal visual moved here | No setup instructions here |
| 3 server | 18:54–18:55 | Explicitly buy a server, resource checklist and visible supplier URL | None |
| 4 server-details | 18:55 | Enter IP, username, password and port | None |
| 5 github | 18:57 | Create/reuse GitHub repository, then create a suitable token | None |
| 6 repository-details | 18:57 | Enter repository URL and token | None |
| 7 prompt | 19:01 | Open a local AI with terminal execution access, choose full access, copy the English prompt; preview/modal/download | Install SSH key, Git/tmux/Claude, clone, create session, edit CLAUDE.md, commit/push |
| 8 reconnect | 19:03 | Open local terminal and copy/run the same-session SSH command | None |
| 9 new-session | 19:03 | Enter a session name and run create-or-attach command; previous session stays intact | None |
| 10 login | 19:06 | Run claude on server, open login URL in local browser, finish requested code entry | None |
| 11 controls | 19:06 | Use /model, /effort and permission controls inside Claude CLI | None |
| 12 local-edit | 19:08 | Select main/master/custom, local directory and shell; copy before-edit pull and after-edit commit/push commands | The server Claude follows its recorded sync rule |

Removed: the old handoffs, clone and project-rule scenes. Their implementation content belongs in the English prompt. The opening has no continuity sales pitch or disclaimer block. GitHub-token instructions precede token collection. The two login/CLI lessons follow reconnect/session selection.
