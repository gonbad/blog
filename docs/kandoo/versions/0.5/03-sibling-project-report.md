# Report: move the Journal into a sibling project

Date: 14 November 2026. Status: pre-migration report. The Journal has not been moved.

**Recommendation:** move the configured Workshop Journal to
`/home/omid/projects/workshop-journal/` as an independent project and Git repository.
That destination does not currently exist. Its installed method is already up to date
with the current local `moom/` source. The remaining work is relocation, Git ownership,
and updating Workshop's maintainer integrations.

Your current request supersedes the earlier decision to defer physical relocation.
This report stops before implementation, as requested. It is stored in the Journal's
own `docs/` vault so it will travel with the project.

## Current alignment with Moom

The comparison baseline is the current local Moom working tree, including the latest
uncommitted improvements. Its kit version is **0.6.0 candidate**; its source HEAD is
`f37cf52325ba601223e64d22963f78ed83a755e9`. No published 0.6.0 release is assumed.

| Component | Inspection result |
| --- | --- |
| `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` | Identical to current Moom. |
| Four constitutions | Identical to current Moom, including the amended Windows fallback, Markdown review boundary, current-version input routing, and prototype baseline rules. |
| Six permanent `kandoo-*` commands | Identical to current Moom. |
| Seven `job-*` commands | Current Moom starter instructions are preserved in full. Each installed command adds a Journal-specific operation section. |
| Job definition | Revision 0.4 with the same seven-stage sequence. The Journal adds its implementation instructions and uses a shorter layout label. |
| Installed references | Workflow, infrastructure, and quality are identical. Distribution preserves the current reference and adds the Journal's verified output ownership, private-path, and rollback policy. |
| Host copies | All thirteen canonical commands match their copies in the three host locations serving four hosts. Bootstrap entries remain local recovery commands for the configured workspace. |
| Imported Moom kit | All 128 archive members and their bytes match the current local Moom source. |

The Journal's useful adaptations should be retained. Copying a fresh template over
it would replace configured state and publishing instructions unnecessarily. There is
no missing Moom update to install before relocation, and no ongoing upstream sync is
needed after it becomes a sibling.

Exact current kit:

```text
moom-0.6.0.zip
SHA-256: 511f00242facf5df8f5a4983889acfe3ca66425ab36024e069913ebfa5781bbf
```

The versioned 0.5.0 download remains pinned to its original bytes. The legacy
`moom-0.1.zip` compatibility name follows the current kit. These imported materials
remain Journal-owned editorial downloads; ordinary post creation/building does not
read the Workshop repository or Moom source.

## What already works outside Workshop

I reran the template audit and the maintained detached-Journal verification for this
report. The latter builds an isolated Journal without sibling Moom source or parent
maintainer tools, starting without generated announcement materials.

- Template audit passed: 128 allowed files, eight template workspace/bootstrap
  commands, four host surfaces, five starters.
- Thirteen installed Journal commands passed host-copy equality checks.
- The detached public build/check passed: **87 files, six public Projects, five
  offline archives**, with current and retained kit downloads verified.
- Private Project 006 built as a separate preview without a machine manifest or
  publication contract. It remained excluded from the public selection.
- Runtime and host files inspected contain no reference to the former absolute
  `/home/omid/projects/workshop/blog` root. No symlink was found escaping the Journal.
- Generated Project receipts bind Project IDs and file hashes rather than absolute
  local directory names. Their validity will be checked again at the destination.

The earlier 45 passing regression tests and handbook browser/offline results remain
documented in the V9.7 verification record. Those suites were not all repeated merely
to write this report. No actual owner rehearsal or live deployment was performed.

## Work required during the move

### 1. Preserve the complete working state

`blog/` currently belongs to the Workshop Git repository and has no `.git` of its own.
There are 1,031 tracked Journal files, plus local modifications and untracked files.
A checkout of committed HEAD would omit part of the method you just prepared.

The local tree contains approximately **199 MiB** of regular-file data, including
dependencies, compiled outputs, private previews, and rollback history. Preserve the
complete local tree, including hidden files and ignored local data, in a recoverable
backup and destination copy. Preserve permissions and verify the transfer before
removing the original working directory. Git tracking remains a separate decision:
review source/docs and pinned materials; keep secrets, caches, dependencies, generated
outputs, and local rollback storage ignored.

Preserve Workshop's existing history. Create the Journal's own local repository,
preferably with Journal-only history derived in a disposable checkout, then overlay
the complete current working state. Do not copy Workshop's `.git` directory into the
Journal or rewrite Workshop's existing branch. Record the origin commit for historical
traceability. A new remote and its backup verification can be configured separately;
the current parent backup does not automatically cover future sibling edits.

### 2. Update the Journal's location and Git facts

The following active documents still describe the in-repository arrangement:

| File inside the Journal | Required change |
| --- | --- |
| `README.md` | Identify the independent project and its root; replace the statement that it is waiting to move. |
| `docs/kandoo/living/profile.md` | Replace parent-repository Git/backup facts with the actual standalone repository and any pending remote backup. |
| `docs/kandoo/living/rehearsal.md` | Use the new workspace root and its `docs/` vault. |
| `docs/kandoo/living/status.md` | Record the relocation evidence while preserving the selected Project, its saved pipeline, and acceptance/deployment states. |

Keep the configured lifecycle and current Job. The move does not require running
`moom-start` or `moom-job`, resetting Project 006, or reopening old posts as new work.
Host command contents already use workspace-relative paths. Reopen the host on the
new root so it uses that root's instructions and commands.

### 3. Repair Workshop's maintained integrations

The publication runtime is portable, but these maintainer tools still assume an
internal `Workshop/blog/` checkout:

| Workshop file | Current dependency and proposed repair |
| --- | --- |
| `tools/export_moom.py` | Writes the kit and imported-material contract under internal `blog/`. Give this maintainer operation an explicit destination, such as `--journal-root /home/omid/projects/workshop-journal`. Continue validating/pinning the exported bytes. |
| `tools/test_workshop_materials.py` | Imports the packaging helper and copies fixtures from internal `blog/`. Make the integration fixture location explicit; keep standalone Journal tests in the Journal. |
| `scripts/verify_v95.py` | Copies internal `blog/`. Accept an explicit Journal root for detached verification. Its V9.1/V9.2 Python compatibility entries delegate to it and should continue to work. |
| `tools/README.md` | Update test/export examples to the independent root and explain the explicit maintainer import step. |
| `workshop_docs/CONSTITUTION.md` and current navigation/rehearsal pointers | Replace the old physical-location/deferred-move statements with the new ownership and paths. Preserve historical version records as evidence. |

Workshop continues to own Moom source, release metadata, and Moom maintainer tools.
The Journal owns its publisher, posts, project checks, and pinned editorial downloads.
An explicitly requested maintainer export may update the Journal's local material;
an ordinary Journal build must remain independent of Workshop. A submodule or a
symlink from the former `blog/` location is unnecessary for this arrangement.

### 4. Retain editorial sources and useful checks

Two post-002 input README records refer to an owner transcript under Workshop's
`workshop_docs/versions/V8.0/`. The current-input link works in the existing location;
the version-copy link is already broken. These references are not publisher runtime
dependencies, but their source should remain available for future editorial work.
Import the needed source into Project-owned documentation with provenance, update
current references, and preserve the historical record with a relocation note.

Several Project 004 presentation checks still live in Workshop's `scripts/` and
default to `../blog/projects/004-agent-presentation/site`. Colocate maintained checks
with that Journal Project and its dependencies, or give them an explicit target path.
Keep historical migration scripts as historical tools. Existing Project-owned checks
for posts 001, 002, and 005 already resolve their Journal root locally.

### 5. Verify the actual sibling before removing the original

The implementation order should be:

1. Back up and inventory the current Journal, including uncommitted and ignored work.
2. Prepare the independent repository and copy at the proposed destination.
3. Apply the profile/path/tooling changes above; preserve Project IDs and all existing
   publication selections, source, pending reviews, compiled artifacts, and rollback data.
4. From the destination, run the publisher regression suite, public build/check, and a
   private preview. Verify imported kit hashes, output ownership, host copies, and that
   Git resolves to the new root. Run the affected Workshop integration tests against
   the explicit new root.
5. Compare the selected public payloads and downloads with the pre-move results;
   explain any intended provenance/path-only change. Exercise relevant local browser
   checks if their code or paths changed. Do not infer editorial acceptance from them.
6. After transfer and destination checks pass, complete the physical cutover and
   retain a recoverable backup. Update the live Workshop navigation and record the
   exact new location. The local move needs no DNS or production-server change.

No new post should be pre-generated as evidence of your rehearsal. That is your next
real use of the relocated system.

## Rehearsal after relocation

Open `/home/omid/projects/workshop-journal/` in the AI host and its `docs/` directory
in Obsidian. Invoke `kandoo-new-project` and supply a real topic. With the current
inventory the next numeric ID is **007**; the command must still allocate against
both Project trees at execution time.

Keep the first new post private and deliver it locally through:

```text
idea → brief → story → content → layout → build → deploy/local delivery
```

This exercises the installed Moom-derived method, new-Project creation, file review,
resume, and delivery. A fresh Moom bootstrap rehearsal uses a separate extraction of
the verified kit; the configured Journal retains its existing setup and published work.

**Readiness conclusion:** the current method and publisher are ready for this
relocation. Complete the Git/path/maintainer integration work and destination checks
before treating the sibling as the authoritative workspace. This report adds no
publication, remote push, or completed-rehearsal claim.
