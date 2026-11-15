# Apply a selected workflow revision to an existing project

Name the project and target revision. Explain the changed stages and affected outputs. Run `python3 moom.py migrate REVISION --project ID --note REASON`. Read the returned affected list and project state. Reopen stale artifacts, checks and approvals; preserve unaffected work for a stated reason. A released post gets a new release when changed. Do not infer a migration from merely editing the current method file.
