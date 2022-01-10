---
layout: page
title: rush write-build-cache (experimental)
navigation_source: docs_nav
---

```
usage: rush write-build-cache [-h] -c COMMAND [-v]

(EXPERIMENTAL) If the build cache is configured, when this command is run in
the folder of a project, write the current state of the project to the cache.

Optional arguments:
  -h, --help            Show this help message and exit.
  -c COMMAND, --command COMMAND
                        (Required) The command run in the current project
                        that produced the current project state.
  -v, --verbose         Display verbose log information.
```

## See also

- [Enabling the build cache]({% link pages/maintainer/build_cache.md %})
