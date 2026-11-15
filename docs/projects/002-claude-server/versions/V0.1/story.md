# Revised scene plan after round 001

Working version: V0.1. Read [decisions.md](decisions.md) and the [submitted second review](002-review.md). Confirmed corrections are applied to this plan; the full result is not yet accepted.

1. **Problem:** disruption of the current working setup and the upcoming policy context; possible ban-related benefit is explicitly unverified.
2. **Solution:** local AI prepares the server; the reader later works through SSH/tmux/Claude; Git carries project changes.
3. **Obtain a server:** resource/Ubuntu checklist and a real provider screenshot/example, with dated prices and bounded comparison scope.
4. **Describe the setup:** local OS/terminal, IP, port, repository and session. Root only; no normal-user field; no password collection. Validate before proceeding.
5. **Give the generated prompt to the local AI:** one complete setup task; root environment, official install, idempotent inspection and actual verification.
6. **Key and account handoffs:** AI handles SSH-key installation; the user enters a password only interactively, registers a public Git key and completes browser login when needed.
7. **Clone the project:** local AI clones the chosen SSH repository on the server and verifies the branch/path/access.
8. **Edit CLAUDE.md:** local AI appends the agreed synchronization rule, preserving existing project instructions. The owner’s pull-before/push-after rule is retained, with failure handling in the prompt.
9. **Return to work:** personalized one-line reconnect-or-create and separate new-session commands, after clone and instruction editing as requested.
10. **Claude controls and recovery:** model/effort/permissions as the installed version offers them; detach, disconnect and reboot differences. D2 was explicitly confirmed.

The actual ten-section site and functioning generator are now implemented. Round 002 was submitted; later clarification delegates blanks and specifies Claude subscription tax as the server-price tie-break. No additional question round is required.
