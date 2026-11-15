# Synchronize native command integrations

Run `python3 moom.py sync`. Canonical sources are docs/commands plus selected-project workflow procedures; generated files are adapters. Resolve local generated-file edits rather than overwriting them. `sync --check` verifies file content and ownership, not discovery in another host's UI.

Claude Code and OpenCode receive command files; Codex and Antigravity share .agents/skills, with a routing rule for Antigravity. Existing unrelated host files remain untouched. Explain an actual host reload requirement if observed; ordinary language always routes to the same canonical procedure.
