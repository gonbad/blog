# Package web and offline deliveries

Confirm actual materials. Workshop materials are prepared with `python3 workshops/public-workflow/tools/package.py` from the repository root; their real outputs are staged in the workshop post's materials/ folder. Other post types declare only their own needed materials.

After the owner's publication instruction and resolved content decisions, mark the selected project publish:true. Run `python3 moom.py run build`. This assembles published projects without generating root links. It packages the post from a separate tree before creating its own presentation ZIP; distinct material ZIPs remain available offline. Versioned current bundles and declared compatibility aliases are explicit in project.json.

Extract and open the actual post ZIP in a path with spaces and Persian text, with networking disabled. Check included materials, fonts, controls and offline-only differences. Record the release manifest and readiness. Do not mistake a preview build for a publishable release.
