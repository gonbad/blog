---
name: kandoo-server
description: Add, verify or change the Kandoo-wide server, HTTPS and authenticated forward proxy.
---

# /kandoo-server

Read `AGENTS.md`, all of `docs/constitution/`, profile, shared status/server and current
Job. Use workspace-root paths. Before configuration, route through the pending setup
procedure; after configuration this command manages shared infrastructure independently
of the active Project. Preserve the selected Project and its progress.

Read the existing port/deployment ledger and ignored secret references. Ask only for
missing or changed facts. `none` remains a valid choice for local-only work; do not
remove a live server or its data just because a new Project has no hosting need.
For initial infrastructure, perform the complete sequence in
`docs/constitution/03-infrastructure-and-secrets.md`. For a later change, reuse verified
facts and execute only the affected checks; do not replace keys, reprovision a proxy
or move unrelated services for a domain-only request. The full checklist is:
verify SSH/fingerprint, provision/reuse the dedicated key, inventory services, ask
about a domain, verify/correct its IPv4 DNS or choose a free `nip.io` hostname,
obtain publicly trusted TLS and verify renewal, and provision/reuse the authenticated
HTTP forward proxy with protected ignored credentials and native SSH forwarding.
Check authenticated HTTP/HTTPS downloads, anonymous denial and service restart.

Use the shared open version in `docs/kandoo/versions/` for numbered decisions/reviews;
if it is closed, open a new shared version without changing Project versions. Keep
confirmed choices and delegated recommendations distinct. Do not invent access or
verification evidence. Pending provider/account/DNS work remains explicitly pending.

Record shared non-secret facts and port allocations in `docs/kandoo/living/server.md`;
participant-entered or participant-read credentials stay in gitignored
`docs/kandoo/secrets/credentials.md`, never in chat, question files or non-`.md` files
referred to the participant. Generate root `kandoo/` code/configuration only if useful
for shared repeatable operations. Assess effects on the Job, shared docs/code, active
Project and inert feedback. Individual Projects inherit the shared server and record
only their own allocations or explicit overrides.

When replacing a live server, preserve old services/data and verify backups, migration,
routes and rollback before any authorized cutover. Do not redeploy existing Projects
just to finish this command. Persist shared state and restore the saved Project next
action. End with localized progress and one exact pending infrastructure action or
resumed Project action.

For an added domain, record the publication origin and all supported aliases in the
shared publication/server docs. Verify DNS, the actual public reverse-proxy route,
certificate hostname coverage/renewal and HTTPS pages/assets for every supported name.
A DNS record alone is not completion. Preserve old routes unless removal was requested;
adding an alias does not imply redirecting it. Inspect the actual TLS termination layer
before editing an internal application server. The next Project inherits these facts.
