# Project versions and review rounds

Each actual project has README.md as its version index and roadmap.md for current scope/future versions:

- [000 index](projects/000-index/README.md) · [roadmap](projects/000-index/roadmap.md)
- [001 workshop](projects/001-workshop-7/README.md) · [roadmap](projects/001-workshop-7/roadmap.md)
- [002 Claude server](projects/002-claude-server/README.md) · [roadmap](projects/002-claude-server/roadmap.md)

The [blog roadmap](roadmap.md) tracks the whole publication/workflow. Project roadmaps track individual results. A planned version is not an instruction to start it.

## Example: start V0.2 of the first post

From the repository root:

```sh
python3 blog/moom.py switch 001-workshop-7
python3 blog/moom.py migrate 0.5 --note "Use version-aware publishing and numbered review rounds"
python3 blog/moom.py iterate --version V0.2 --note "Describe the requested V0.2 change here"
python3 blog/moom.py versions
python3 blog/moom.py review-round --title "V0.2 scope" --before blog-content
```

This is an example, **not executed on post 001**. Its current version remains V0.1.1. The migration is explicit because that project retains the older workflow 0.1; workflow 0.5's build helper understands archived publications.

After iteration, the locations are:

| Material | Location |
| --- | --- |
| Previous source/inputs/metadata | projects/001-workshop-7/versions/V0.1.1/ |
| Previous specs, answers and receipts | docs/projects/001-workshop-7/versions/V0.1.1/ |
| New working source | projects/001-workshop-7/site/ |
| New specs/change note/review rounds | docs/projects/001-workshop-7/versions/V0.2/ |
| First V0.2 review round | docs/projects/001-workshop-7/versions/V0.2/001-review.md |
| Project roadmap | projects/001-workshop-7/roadmap.md |

The next round is 002-review.md. It does not replace 001-review.md. Questions use options with exactly one recommendation; uncertain decisions use confirmation/override fields in a separate section of the same numbered file.

Starting a version snapshots the old source, makes the new version a draft, and resets readiness/acceptance. With workflow 0.5, normal builds keep the published old snapshot; preview builds show the draft. Changes to later source do not rewrite the archived source. Earlier historical versions from before this layout remain in Git; no fictitious historical dossiers were created.

Project version V0.2, publishing workflow 0.3, and review round 002 are different identifiers. The selected state's docs field and project README locate the right documents.


## The two supported version-entry routes

**Agent-assisted:** ask /iterate with a change or an authorized roadmap idea. The helper creates the version directory and 01-request.md; this file is the primary change input, not merely a changed version label.

**Owner-prepared:** create the version directory and its primary file yourself, then ask the assistant to apply it. The actual post-002 example is docs/projects/002-claude-server/versions/V0.2/01-transcription.md. The assistant reads it and runs:

```sh
python3 blog/moom.py iterate --version V0.2 --note "Apply the owner’s change input" --input docs/projects/002-claude-server/versions/V0.2/01-transcription.md
```

That example was actually used for post 002. The owner file is preserved and its SHA-256 recorded in version.json. Existing owner documents win over inherited baselines. An already initialized version is never overwritten. These are the only two entry routes; a metadata-only version relabel is invalid and check detects inconsistent records.

For the reusable job, the corresponding forms are `freeze REVISION --note CHANGE` and `freeze REVISION --input docs/job/versions/REVISION/01-transcription.md --note CHANGE`. Both produce a primary 01-*.md record. Workflow 0.5 was created through the agent-assisted route; its version folder contains 01-request.md.

Process/deviation analysis for this workspace belongs in the repository’s workshop_docs/versions/V8.0/. The post version’s own changes, content decisions, fidelity mapping and receipts remain with that version.
