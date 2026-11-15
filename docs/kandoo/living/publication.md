# Journal publication settings

- Origin: https://blog.kiloapp.ir
- Aliases: https://blog.agent.kiloapp.ir
- Deployment adapter: kandoo/deploy.py
- Deployment SSH host: root@agent.kiloapp.ir
- Deployment service: workshop-blog.service
- Deployment base: /srv/workshop-blog
- Deployment config: /etc/workshop-blog/Caddyfile
- Deployment unit: /etc/systemd/system/workshop-blog.service

Both HTTPS names serve the same release; HTTP redirects retain the requested hostname.
The shorter origin is used for new publication links. The builder records the aliases
in the release, and deployment verifies each origin. Rebuild if these settings change.

A new Project is private unless its living publication contract selects `Publish: yes`.
The authored index is separate from selection. No `Archive` means web output only;
a named archive explicitly requests a downloadable artifact. Materials are independent.
Preview output cannot deploy. Public-source selection does not expose raw input docs.
