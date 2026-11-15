# Maintain your Kandoo

Describe the desired change in conversation; you do not need to locate configuration
files or run terminal commands. The assistant resolves the owner and preserves the
selected Project. These commands also accept a short description of the desired work.

| Intent and example | Route | Result and evidence |
| --- | --- | --- |
| Start another work item: `kandoo-new-project — an astronomy article` | `kandoo-new-project` | A new numeric ID, meaningful/provisional slug, idea and source intake; earlier Projects preserved. |
| Change this workspace's Git remote | `kandoo-iterate`, shared scope | Inspect ownership/history, configure the intended remote, verify authenticated backup and update `living/profile.md`; never force-push unrelated history. |
| Add a domain, retaining the old one | `kandoo-server` | Shared origin/aliases, DNS, proxy routing and trusted TLS checked for both; no reset of unrelated infrastructure. |
| Change future output or workflow | `kandoo-iterate`, Job/shared scope | Revise the living method and affected commands; preserve old Project evidence. |
| Fix a concrete fault | `kandoo-issue` | Reproduce, repair and verify the affected scope. |
| Save an idea for later | `kandoo-add-idea` | Record it in the correct roadmap without interrupting the current step. |

## Publication removal, when the Job publishes Projects

Describe exactly which effect you want:

- **Remove from the index:** edit the authored index, keeping the post published and
  accessible by direct URL. This does not make it private.
- **Unpublish:** remove the post from release selection and remove/update incoming
  links; verify and publish the new release. Preserve local source and documentation.
- **Delete the local Project too:** identify the exact docs/artifacts and backup policy
  in the owning review record before deletion. Do not infer local deletion from an
  unpublish request. Git history and copies already held elsewhere are separate.

Use ordinary conversation or `kandoo-iterate` with the target Project and shared/index
scope. The assistant operates code/configuration and provides a Markdown summary inside
`docs/`. It verifies the index and direct URL after publication. Changing a Job never
automatically removes or republishes existing Projects.

## Bringing existing work

The initial idea input links a Markdown source note and source inventory inside the
Project docs. Paste notes and links there, or point out a file you already created.
For an existing application or binary bundle, the assistant provides the exact
`projects/ID/existing/` drop location. Raw inputs remain separate from public source.
If the name is provisional, the first handoff explains when it will be resolved.

## What counts as completion

The assistant records the specific changed setting, checks actually performed and any
remaining dependency in the owning shared/Project version. Local checks, human review,
public deployment and Git backup are separate evidence. A public source repository
also exposes its committed docs/history, even when the website excludes those files;
review the intended public contents before publishing it.
