# Export a reusable job kit

Select the recipe revision and explain which helpers/examples are essential. Freeze it first if it is still only a mutable working draft. Run `python3 moom.py export --output exports/NAME.zip`.

The exporter includes the Moom engine, canonical commands/process, frozen job procedures and declared bundled helpers. It omits project inputs and recipient profile data and removes inherited approval. Inspect the archive and test import into a temporary empty workspace. Identify required external dependencies and setup. This is a reusable method export; a full project archive is a separate explicitly selected operation.
