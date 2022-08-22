---
title: rush check
---

```
usage: rush check [-h] [--variant VARIANT] [--json] [--verbose]

Checks each project's package.json files and ensures that all dependencies
are of the same version throughout the repository.

Optional arguments:
  -h, --help         Show this help message and exit.
  --variant VARIANT  Run command using a variant installation configuration.
                     This parameter may alternatively be specified via the
                     RUSH_VARIANT environment variable.
  --json             If this flag is specified, output will be in JSON format.
  --verbose          If this flag is specified, long lists of package names
                     will not be truncated. This has no effect if the --json
                     flag is also specified.
```
