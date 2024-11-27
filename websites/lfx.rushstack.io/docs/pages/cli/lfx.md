---
title: lockfile-explorer
---

> You can use `lfx` as a shorthand for the `lockfile-explorer` shell command. In CI scripts, it is recommended to include the full name for readability.

```
usage: lockfile-explorer [-h] [-d] [--subspace SUBSPACE_NAME]

Lockfile Explorer is a desktop app for investigating and solving version
conflicts in a PNPM workspace.

Optional arguments:
  -h, --help            Show this help message and exit.
  -d, --debug           Show the full call stack if an error occurs while
                        executing the tool
  --subspace SUBSPACE_NAME
                        Specifies an individual Rush subspace to check. The
                        default value is "default".
```
