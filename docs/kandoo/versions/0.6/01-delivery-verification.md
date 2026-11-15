# Shared 0.6 delivery verification

Date: 2026-11-15. Input: the submitted V9.8 rehearsal decisions in
`00-iteration-input.md`.

## Build and regression evidence

- Journal build and aggregate check passed: 7 Projects, 85 output files, and two
  selected offline archives. Ordinary Project 007 output contains no ZIP.
- Project 007 layout and web-only build checks passed.
- Publisher, publication-safety and deployment regression suite: 32 tests passed.
- Publication dry run passed for `https://blog.kiloapp.ir` and
  `https://blog.agent.kiloapp.ir`.
- The final release manifest SHA-256 is
  `f702d88f990b0ee997083ac5c483a11ca99ffd83f724efab487307a9a69a9339`.

The Project 007 record at
`docs/projects/007-islamic-astronomy/versions/0.1/09-shared-policy-verification.md`
holds its scoped check results and acceptance boundary.

## Live delivery

The verified release `0.1-f702d88f990b` is live at both supported hostnames. The deploy
adapter checked the 84 public artifacts on each origin and confirmed the two explicit
downloads. The Project 007 article archive now returns 404. The retained kit's earlier
403 was traced to server file permissions; the adapter now normalizes public files and
directories before switching. The first attempt restored the prior release, and the
second deployment completed successfully without changing service configuration.

Immutable receipt:
[`deployment-3237b82bb3e7148b30ba9834bb21700983338e91b5bac6315d17a6e8152270e6.json`](release/deployment-3237b82bb3e7148b30ba9834bb21700983338e91b5bac6315d17a6e8152270e6.json).

## Git backup

The public remote `https://github.com/gonbad/blog.git` exists and was confirmed empty
before the snapshot commit. The snapshot contains the independent Journal source and
public-safe working documentation. `.gitignore` excludes `docs/**/secrets/`, local
credential files, build outputs, previews, caches and rollback history. The current
Workshop origin commit that owned the moved tree is
`1023c9b62df555ac49504847519633fc3a0165ef`.

The initial Journal snapshot commit and remote verification will be recorded here after
the push completes. Public source backup is separate from website deployment.
