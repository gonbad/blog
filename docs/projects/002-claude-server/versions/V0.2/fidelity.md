# V0.2 source-to-result fidelity review

Primary input: [01-transcription.md](01-transcription.md). Mapping: [story.md](story.md). Machine-readable contract: [v0.2-contract.json](../../../../../projects/002-claude-server/inputs/v0.2-contract.json).

- The first scene now states the account-closure / 21 Aban problem only. The old close-your-computer headline and disclaimer block are removed.
- The second scene states the foreign-server solution and owns the existing terminal illustration. Continuing after closing the computer is a secondary benefit there.
- The purchase scene explicitly says buy, shows the required resources and a visible supplier URL.
- The server form collects IP, username, password and port. GitHub project/token preparation precedes a separate repository/token form.
- The reader is explicitly told to open a local AI with terminal execution access, grant full execution access and send the copied prompt. The complete prompt is English and includes the exact entered configuration and credentials.
- Local-key installation, installing tools, clone, tmux creation, CLAUDE.md edit and commit/push are delegated to that AI. The old separate handoff, clone and rule scenes are absent.
- The prompt has a short faded preview, full modal, complete-text copy and complete-text download. Actual clipboard/download equality was checked, not inferred from a button label.
- Same-session reconnect and independently named create-or-attach are separate scenes. The named command preserves the main session and uses -A.
- Claude login and CLI controls are two later scenes.
- Local editing has a main/master/custom selector and actual before-edit pull / after-edit commit-and-push commands. Bash commands were exercised with temporary real repositories on all three branch cases; PowerShell output/quoting was checked but was not executed on Windows.

Reviewed against the requested content before treating the functional result as ready. The selected visual style is preserved; desktop/phone screens were inspected. The browser test covers the exact scene order plus content/actor invariants, then controls and offline behavior. All credential fixtures are synthetic. No real reader-server provisioning or account login is claimed.

This records fidelity/readiness, not owner acceptance of the completed artifact. Process diagnosis remains in the workshop V8.0 analysis.
