# Publishing job setup and external dependencies

The Moom core uses Python 3.10+ standard library only. This specialized job also needs:

- **Build:** publication.json with the selected HTTPS origin, an explicitly authored index project and the actual selected post source. Project metadata declares publication state and any real material files. No Node framework is needed for the first HTML post.
- **Browser checks:** Node, Playwright and installed Chrome. Set PLAYWRIGHT_MODULE if the package is outside normal module lookup; BLOG_URL selects the actual preview/live site. The current acceptance helper targets workshop 7 and must be adapted for a materially different post.
- **Workshop materials:** only when the project declares them. This repository prepares the book and Moom kit with workshops/public-workflow/tools/package.py. A recipient publishing an unrelated tutorial should omit these material declarations rather than inherit a dependency on the instructor's workshop repository.
- **Deployment:** this job currently uses the owner's authorized VPS through unattended SSH, a private-bridge Caddy backend and existing Traefik ingress. Frozen revisions include the adapter code and public configuration templates. Importing the method transfers no credentials or server authority. A recipient selects/adapts their own hosting route and publication origin before using this helper.

Input/source files are intentionally project-specific and omitted from reusable exports. Start a real first instance and author its source using the procedures; the export is an assisted production method, not a prepopulated copy of another person's published site.
