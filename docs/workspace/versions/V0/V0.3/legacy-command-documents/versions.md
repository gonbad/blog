# Locate project versions

Run `python3 moom.py versions` for the selected project's working version, documents, source history and roadmap. The actual project has README.md as its version index and roadmap.md for current scope and future candidates. The version's documents are in docs/projects/ID/versions/VVERSION/; state.json at docs/projects/ID/ selects the current version, docs path and frozen workflow.

Project version, workflow revision and question-round number are independent. To start another version of the same result, follow /iterate. To create a different result, use /project. To change the reusable method, use /workflow and explicitly /migrate.
