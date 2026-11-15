# Public deployment

The owner requested publication at https://blog.agent.kiloapp.ir/ and confirmed that
only dist/ should be uploaded and served by Nginx or a similar static server.
The existing deploy phase was executed after correcting the workspace adapter to
allowlist only verified dist/ files. The handbook is publicly available at
https://blog.agent.kiloapp.ir/005-workshop-7-handbook/ and linked first on the index.

Caddy serves release 0.1.0-897fbe248837. The upload contains 85 dist files, including
the manifest and deliberate public downloads. Registration, routing and static-server
configuration are unchanged. The public page/download hashes and browser checks pass.
See verification/public-browser.json and the current workspace release/deployment.json.
This is a deployment receipt, not an editorial acceptance record.
