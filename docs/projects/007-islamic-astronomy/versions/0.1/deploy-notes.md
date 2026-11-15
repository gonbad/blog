# Deployment notes: 007-islamic-astronomy

- Project: `007-islamic-astronomy`
- Version: `0.1`
- Publication date: 2026-11-15
- Origin: `https://blog.agent.kiloapp.ir`
- Live URL: `https://blog.agent.kiloapp.ir/007-islamic-astronomy/`
- Offline package URL: `https://blog.agent.kiloapp.ir/007-islamic-astronomy/downloads/007-islamic-astronomy-v0.1.zip`
- Local preview URL: `http://127.0.0.1:8000/007-islamic-astronomy/`

---

## 1. Release Inventory & Checksums

- Compiled release ID: `0.1-d95b61e9bf7a`
- Release manifest SHA-256: `d95b61e9bf7a16592736c7cae91e669cb0ef92c35e5bedbe531c5ae4c9ddaad8`
- Total published projects: 7 (`000-index`, `001-workshop-7`, `002-claude-server`, `003-brah-paper`, `004-agent-presentation`, `005-workshop-7-handbook`, `007-islamic-astronomy`)
- Total uploaded files: 89
- Total verified public artifacts: 88
- Standalone offline ZIP SHA-256: `ba0b9c816092ad953ea17534980eb66fa5e1ec5816e3cede18ad9c3db18bc120`

---

## 2. Server & Infrastructure Evidence

- Remote host: `vm10709-13184.vpsmarket.org` (`root@agent.kiloapp.ir`)
- Web server: Caddy (behind reverse proxy)
- Static service: `workshop-blog.service` (active and unchanged)
- Symlink switch: Atomic pointer swap from `current` to `releases/0.1-d95b61e9bf7a`
- Shared deployment receipt: `docs/kandoo/versions/0.5/release/deployment-dd47f91d761e3c3817053e55559bd3531f59ff2d1220f59b5b4ec7c827f3c4d0.json`

---

## 3. Live Verification Checks

1. `curl -I https://blog.agent.kiloapp.ir/007-islamic-astronomy/` returned `HTTP/2 200` with `content-type: text/html; charset=utf-8`.
2. `curl -I https://blog.agent.kiloapp.ir/007-islamic-astronomy/downloads/007-islamic-astronomy-v0.1.zip` returned `HTTP/2 200` with `content-type: application/zip`.
3. All interactive tools (1 through 6), SVG maps, compass azimuth projections, and offline scripts confirmed operating without external runtime dependencies.
