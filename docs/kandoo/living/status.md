# Journal status

- Lifecycle: configured
- Bootstrap start: done (existing workspace migrated in place)
- Bootstrap Job definition: done
- Active scope: Shared Kandoo rehearsal repairs version 0.6
- Shared open version: 0.6
- Installed Job revision: 0.5 (seven stages: idea, brief, story, content, layout, build, deploy)
- Active Project: 007-islamic-astronomy
- Active Project version: 0.1
- Active Project Job revision: 0.4 (seven stages: idea, brief, story, content, layout, build, deploy)
- Current step: Complete (all 7 stages done)
- Review state: build, layout, and issues 06, 07, 08 resolved and verified
- Technical readiness: shared 0.6 web publication verified; 7 Projects, 84 public artifacts, 2 explicit downloads
- Human acceptance: narrative confirmed; visual/interactive widgets verified by author
- Deployment: release 0.1-f702d88f990b live on both supported hostnames; immutable receipt in docs/kandoo/versions/0.6/release/
- Next action: Read docs/kandoo/versions/0.6/01-delivery-verification.md for release and Git backup evidence.

## Active Project 007-islamic-astronomy pipeline (Job revision 0.4)

| Step | Persian label | Command | State | Notes |
| --- | --- | --- | --- | --- |
| Idea and scope | ایده و دامنه | [job-idea](commands/job-idea.md) | done | Scope and authentic sources resolved; makruh excluded |
| Editorial brief | بریف و زاویه دید | [job-brief](commands/job-brief.md) | done | Audience, outcomes, SVG map and formula depth confirmed |
| Story structure | ساختار روایت و رئوس | [job-story](commands/job-story.md) | done | Complete narrative arc, 6 sections, and 6 interactive tools mapped |
| Content authoring | نگارش متن و محتوا | [job-content](commands/job-content.md) | done | Narrative reviewed by owner; 5 comments resolved in `03-content-review.md` |
| Layout | صفحه‌آرایی | [job-layout](commands/job-layout.md) | done | Full HTML/CSS/JS source, Figure 1 & 2 maps/diagrams, and 6 interactive widgets built in `src/` |
| Build and package | ساخت و بسته‌بندی پکیج | [job-build](commands/job-build.md) | done | Historical Job 0.4 evidence; current shared 0.6 web-only build verified |
| Publish or deliver | انتشار یا تحویل | [job-deploy](commands/job-deploy.md) | done | Published live to https://blog.agent.kiloapp.ir/007-islamic-astronomy/ and verified |

All preexisting Projects retain their own version/status. New Projects select themselves;
switching restores their saved state without rebuilding or republishing old output.

## Shared publisher repairs — 2026-11-14

The owner authorized F13–F17 repairs. Protected/unowned destinations and private
export paths are rejected, unpublished incomplete contracts are isolated, six migrated
Project scope documents are restored, and three previous compiled editions are retained
per output destination. See the [shared issue](../versions/0.5/02-issue-publication-boundaries.md)
and the current distribution reference. Publisher/deployment tests (27) and maintainer
tests (14) pass. Isolated existing-output rebuilds preserve the selected public files
byte-for-byte; a deployment dry run succeeds. Human acceptance and live publication
remain separate from these technical results. The active Project's saved pipeline,
version and local-delivery state remain as shown above.

## Shared 0.6 work

Current input: `docs/kandoo/versions/0.6/00-iteration-input.md`.
Job revision 0.5 is installed; the table above preserves Project 007's completed
0.4 execution. No article ZIP is selected under the new shared policy. Both hostnames,
TLS, the revised content release and all 84 artifact hashes are verified. The initial
public Git snapshot push is the remaining backup step. Source inspection, browser
verification, human acceptance and public deployment remain separate evidence. The
owner must reopen the AI host to load revised commands.

See `docs/kandoo/versions/0.6/01-delivery-verification.md` for deployment evidence.
