# Shared 0.6 web delivery verification — Project 007

- Project: `007-islamic-astronomy`
- Project version: `0.1`
- Shared Kandoo version: `0.6`
- Date: 2026-11-15

This record documents the shared delivery-policy migration for the already accepted
Project. It does not reopen its narrative or retroactively change the earlier Job 0.4
acceptance evidence.

## Web-only build

- `python3 kandoo/build.py`: passed; 7 selected Projects, 85 output files, 2 explicit
  offline archives, and no archive for Project 007.
- `python3 kandoo/check.py`: passed; the compiled release inventory and declared
  downloads verified.
- `checks/check_layout.py`: passed its static structure and required-control checks.
- `checks/check_build.py`: passed the Project 007 web output, ownership receipt, exact
  file inventory, title and SHA-256 checks; no standalone article ZIP exists.
- Publisher, publication-safety and deployment regression suite: 32 tests passed.
- `python3 kandoo/publish.py --dry-run`: passed for the preferred origin and supported
  alias.

The static layout check does not run browser interactions or independently prove the
astronomical calculations. Earlier author verification remains the evidence for those
behaviors; no new browser run or human acceptance is claimed here.

## Live release

- Release: `0.1-f702d88f990b`
- Release manifest SHA-256:
  `f702d88f990b0ee997083ac5c483a11ca99ffd83f724efab487307a9a69a9339`
- Preferred article URL: <https://blog.kiloapp.ir/007-islamic-astronomy/>
- Supported alias: <https://blog.agent.kiloapp.ir/007-islamic-astronomy/>
- Both homepages and both article URLs returned HTTP 200.
- The retained Workshop 7 kit and presentation archive returned HTTP 200 on both
  origins. The Project 007 standalone ZIP URL returned HTTP 404 as expected.
- Deployment verified the manifest and all 84 public artifacts on both origins. The
  upload contained 85 files including `release.json`.
- The service remained active and its Caddy and systemd configuration hashes did not
  change.
- Immutable deployment evidence:
  [release receipt](../../../../kandoo/versions/0.6/release/deployment-3237b82bb3e7148b30ba9834bb21700983338e91b5bac6315d17a6e8152270e6.json).

The first upload attempt was rolled back after live verification found a retained kit
file with server mode `0600`, which made Caddy return HTTP 403. The deploy adapter now
normalizes verified release directories to `0755` and files to `0644` before switching.
The subsequent deployment reused the verified inventory, normalized permissions, and
passed every live hash check on both hostnames. This permission fix restores access to
the selected downloads without changing their bytes.

## Acceptance and next step

The article's previously recorded human acceptance remains in force. This shared change
only removes its automatically generated ZIP, uses the shorter canonical origin, and
retains the explicit presentation and Workshop material downloads. No post was unlisted,
unpublished or deleted.

Next: read the shared 0.6 delivery record for the repository backup evidence.
