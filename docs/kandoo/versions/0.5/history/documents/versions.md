# Project versions

Resolve each Project's current version and docs path from workspace.json. Engine
procedures live in .moom/core/commands/; older flat version folders are preserved as
history. New versions use versions/VMAJOR/VMAJOR.MINOR/VMAJOR.MINOR.PATCH/.
Project versions, Job revisions, Moom versions and numbered review rounds are independent.

For an authorized Project change, the assistant uses:

```sh
python3 moom.py iterate --target project --project ID --version MAJOR.MINOR.PATCH --note "Requested change"
```

An owner-prepared primary input can be adopted with --input when it is in the target
version directory. Both routes preserve the source snapshot and prior discussion.
The current input and later creator comments govern the change. Historical versions
are read only on request; submitted reviews are preserved and acceptance requires
approval of the actual current revision. See docs/moom/review.md for the full protocol.
