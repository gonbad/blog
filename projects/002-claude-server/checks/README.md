# 002-claude-server browser checks

From this checks/ directory the assistant runs:

```sh
npm ci
npm run check
```

First build/check the Journal using `python3 kandoo/build.py` and
`python3 kandoo/check.py` from its root, then serve dist/ at http://127.0.0.1:4173.
The lockfile pins Playwright. The verifier uses /usr/bin/google-chrome by default;
set CHROME_BIN to the actual Chrome/Chromium executable on another OS. BLOG_URL may
select another local preview. KANDOO_WORKSPACE may select a copied Journal.
Results/screenshots default to this Project's current verification dossier, not /tmp/;
REVIEW_DIR can select another durable location. Temporary extracted ZIPs are disposable;
they are not official evidence. Browser checks do not evaluate an AI host.
