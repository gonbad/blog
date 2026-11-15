# Journal shared infrastructure

- Server choice: existing Workshop VPS
- SSH host: root@agent.kiloapp.ir (existing verified authenticated identity)
- Public HTTPS origin: https://blog.kiloapp.ir
- Supported alias: https://blog.agent.kiloapp.ir
- Public IPv4: 82.39.165.56 (both names; no AAAA observed on 2026-11-15)
- Static service: workshop-blog.service; Caddy on internal 10.0.1.1:8014
- Public TLS and routing: existing Coolify Traefik v3.6, ports 80/443
- Route configuration: /data/coolify/proxy/dynamic/workshop-blog.yaml
- Release base: /srv/workshop-blog; current symlink and prior releases provide rollback
- Caddy configuration: /etc/workshop-blog/Caddyfile
- Service unit: /etc/systemd/system/workshop-blog.service
- Forward proxy: preserve existing ignored configuration when needed
- Authorization: owner confirmed adding the shorter domain while retaining the old one
- Domain verification: both HTTPS homes and Project 007 returned 200 on 2026-11-15

## TLS and renewal

The new name uses the existing Traefik `letsencrypt` HTTP-01 resolver, with persistent
ACME storage and resolver-managed renewal. Its certificate covers `blog.kiloapp.ir`
and is valid through 2027-02-13. The old name retains its existing wildcard certificate,
valid through 2027-01-16. Certificate validity and configured renewal are verified;
a future renewal event has not been observed. Private ACME data remains server-side.
HTTP redirects to HTTPS with the same hostname; no cross-host redirect was introduced.
Caddy's internal listener does not terminate public TLS. No unrelated service moved.

## Deployment and port ledger

| Owner | Deployment ID | Allocation | Evidence |
| --- | --- | --- | --- |
| Journal | workshop-blog | Existing Caddy 10.0.1.1:8014 behind public Traefik | Shared version 0.6 domain and deployment records |

The prior proxy route was backed up outside the watched dynamic directory at
`/data/coolify/proxy/backups/workshop-blog.yaml.20261115T0720Z.bak`. The service remained
active; no restart was required. See the shared version's delivery record for the
exact content release, separate from this infrastructure verification.
