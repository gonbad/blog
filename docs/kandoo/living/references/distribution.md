# Public web sources and detached builds

## Publication contract

Keep a Project-owned public source directory (`projects/ID/src/`, `projects/ID/site/`
or an adapted path) separate from inputs, version records, secrets and editorial
notes. Record source, public URL path, version and release selection in living Markdown.
A new Project is private by default and needs no machine manifest. Skip incomplete
unselected drafts; an explicit draft preview must remain undeployable.

A blog's default deliverable is a web page that explains itself, uses vertical scrolling
and is shared by URL. Do not create a standalone post ZIP or a download procedure by
default. An explicit request may add one later. Intentional editorial materials, such
as a workshop kit, remain independently selected content.

Generate shared publishing helpers under `kandoo/` only for real needs; Project
renderers/checks belong to their Project. Build without fetching the source template
or reading sibling maintainer tools. Keep source and runtime assets explicit. Bundled
assets and license notices are useful for reliable web delivery; removing article ZIPs
is not a request to introduce external runtime dependencies.

## Build and verify

1. Stage only the declared public source and intentional materials. Reject private
   files, symlinks and traversal before copying; never copy the entire Project root.
2. Verify HTML/CSS/JS references, RTL/mobile reading, actual interactions, the authored
   index and every provided material link. Separate external citations from runtime assets.
3. Record the exact file inventory and SHA-256 values. Static structure checks, browser
   interaction, source fidelity and human acceptance are separate evidence.
4. Replace compiled output only after verification, retaining known rollback output.
   Deployment uploads only the verified release inventory.

## Intentional workshop downloads

A post may distribute a reviewed template or other editorial material. Import it into
the owning Project and record version, checksum and provenance in living Markdown.
Commit the required public artifact or another durable local copy. Ordinary builds
verify and consume that copy without locating the template source or fetching a moving
branch. Retained versioned kits keep their original bytes and checksum pins; only an
explicitly rolling compatibility alias follows the current kit. Missing or tampered
material is an actionable failure, not permission to rebuild it from upstream.

## Publication and rollback

Use the shared authorized origin and supported aliases, service identity and paths.
Verify public HTTPS pages, assets, release hashes and intentional downloads at every
supported hostname; preserve an immutable receipt in the shared version dossier.
Record DNS, routing and TLS changes in shared settings. Do not treat a preview or
local check as live deployment or human acceptance. An explicit hosting deferral is
valid and retains the working local preview. Unlisting, unpublishing and deleting
source are distinct operations described in the workspace maintenance guide.

## Journal archive contract

`Archive: filename.zip` is an explicit request for a standalone artifact. Omitting
or leaving `Archive` empty produces web output only; no filename is inferred. Archive
aliases require a named archive. Generated release records contain `targets.web` and
only contain `targets.offline` when that artifact was selected. Materials are copied
and checked independently of archive selection. Existing deck downloads remain explicit.

### Current Journal output policy
Preflight all aggregate and Project destinations before replacing any compiled output.
Protect source/material paths, the docs vault, shared code, host commands, Git and
rollback history. A custom output must be new, empty or verifiably generated. Preserve
unowned or changed nonempty directories and give the exact move-aside recovery action.
Legacy Project dist/ is adopted only when its bytes match the new public payload or
that Project's inventory in an independently verified previous aggregate release.

The same private-path policy applies to public source, material source/target, final
output, offline ZIP entries and upload validation. `*.local.md`, `.env*`, key/certificate
containers and identity/credential files are private even beneath downloads/. Ordinary
intentional Markdown downloads remain supported. A file hash proves integrity; it
cannot make a private path suitable for publication.

An explicit `Publish: no` contract may have unfinished version/kind/build settings.
Only public selections and the requested preview need full metadata validation;
invalid or duplicate publication selectors still fail closed.

The publisher keeps three distinct previous trees per destination in its parent's
`.publication-history/DESTINATION/HASH/`, retaining exact web files, offline ZIPs and
inventories. Identical snapshots are reused; prune only intact generated snapshots.
Unknown or modified history folders remain untouched. Verify and copy a selected
snapshot for rollback without rebuilding source. Project dist/ has a local
`.journal-output.json` receipt for output ownership; it is separate from public runtime
files and from the aggregate release.json. These are generated artifact receipts,
not assistant workflow state. Preserve an interrupted `.previous` tree for explicit
recovery rather than silently deleting it.
