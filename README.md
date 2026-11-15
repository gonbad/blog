# Workshop Journal

An independent Kandoo with one evolving [blog-publisher Job](docs/kandoo/living/job.md)
and independent articles, guides and papers, with retained earlier presentations.
This is the independent sibling Journal repository at https://github.com/gonbad/blog. Open this directory in the AI host and docs/ in Obsidian.
[Status](docs/kandoo/living/status.md) selects the active Project; each Project keeps its
own living status/version and explicit publication contract.

Use `/kandoo-new-project`, `/kandoo-switch`, `/kandoo-add-idea`, `/kandoo-iterate`,
`/kandoo-issue` and `/kandoo-server`. The Job uses `/job-idea`, `/job-brief`,
`/job-story`, `/job-content`, `/job-layout`, `/job-build` and `/job-deploy`.
Codex CLI invokes `$NAME`; Codex desktop uses slash/dollar selection. Claude Code and
OpenCode use `/NAME`; Antigravity selects or mentions the shared skill. Close/reopen the
host after command updates so it discovers the new command files. Installed bootstrap
recovery entries route to saved local status; their canonical docs sources are absent.

The assistant runs these checks from this directory:

```sh
python3 kandoo/build.py
python3 kandoo/check.py
python3 kandoo/publish.py --dry-run
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

A new Project is a private draft without a machine manifest. To inspect a draft with
src/index.html use `python3 kandoo/build.py --preview ID --output preview-dist`.
Only explicitly selected public sources/materials enter dist/. A standalone archive
is produced only when its publication contract explicitly names one; ordinary posts
have no ZIP. Preview output cannot deploy. Public hosting uses the known origin recorded in
[publication settings](docs/kandoo/living/publication.md).

An output destination must be new, empty or a verified previous generated output.
Source, docs, command, Git and rollback-history directories are protected. Existing
unowned or changed output is preserved with an instruction to move it aside. Every
destination is checked before any compiled output is replaced. Private local files,
including `*.local.md` and credential/key patterns, are rejected from sources,
material rows, offline archives and upload inventories. Unselected draft contracts
can remain incomplete; a requested preview validates its own contract.

Successful builds retain three distinct previous outputs per destination under
its parent's `.publication-history/DESTINATION/HASH/`. This includes each Project's
dist/ and aggregate public/preview builds. Snapshots retain exact files and archives;
identical builds reuse the same snapshot. Verify an aggregate snapshot with
`python3 kandoo/check.py --output SNAPSHOT_PATH`, then copy it to a fresh viewing or
restore directory without recompiling. Changed or unknown history folders are preserved.
Project dist/ contains a local `.journal-output.json` ownership/hash receipt; it is
generated artifact metadata and does not enter the aggregate publication.

Shared publishing implementation lives in kandoo/. Post-specific tools, browser checks
and dependencies live in their Project; the handbook documents its pinned browser
setup under projects/005-workshop-7-handbook/checks/. Its committed workshop ZIP is an
editorial download, checksum-pinned in the Project living materials document. Building
this Journal requires neither a sibling template, parent maintainer tools nor network
access. Historical inputs, version dossiers and prior deployment receipts are retained;
none is workflow configuration. Technical checks do not grant editorial acceptance.

The default article is read independently, scrolls vertically and is shared by URL.
[Workspace maintenance](docs/kandoo/maintenance.md) explains naming and source intake,
Git remotes, domains, unlisting, unpublishing and deletion. The preferred site is
https://blog.kiloapp.ir; https://blog.agent.kiloapp.ir remains a supported alias.
Close and reopen the AI host after this command update.
