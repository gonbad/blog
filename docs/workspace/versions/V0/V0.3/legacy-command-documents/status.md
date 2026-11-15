# Show project progress and resume

Run `python3 moom.py status` or `status --json`. Read the selected project's brief, state and current procedure. Show its ID, version, workflow revision, accepted/ready/stale stages and exact next action. Readiness is not human approval and completed stage count is not elapsed-work percentage. If artifacts changed, use `check` and reopen affected work instead of trusting old completion flags.
