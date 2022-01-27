---
title: rush link
---

```
usage: rush link [-h] [-f]

Create node_modules symlinks for all projects. This operation is normally
performed automatically as part of "rush install" or "rush update". You
should only need to use "rush link" if you performed "rush unlink" for some
reason, or if you specified the "--no-link" option for "rush install" or
"rush update".

Optional arguments:
  -h, --help   Show this help message and exit.
  -f, --force  Deletes and recreates all links, even if the filesystem state
               seems to indicate that this is unnecessary.
```

## See also

- [rush unlink](../../commands/rush_unlink)
