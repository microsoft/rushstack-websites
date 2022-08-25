---
title: rush scan
---

```
usage: rush scan [-h] [--json] [--all]

The Node.js module system allows a project to import NPM packages without
explicitly declaring them as dependencies in the package.json file. Such
"phantom dependencies" can cause problems. Rush and PNPM use symlinks
specifically to protect against phantom dependencies. These protections may
cause runtime errors for existing projects when they are first migrated into
a Rush monorepo. The "rush scan" command is a handy tool for fixing these
errors. It scans the "./src" and "./lib" folders for import syntaxes such as
"import __ from '__'", "require('__')", and "System.import('__'). It prints a
report of the referenced packages. This heuristic is not perfect, but it can
save a lot of time when migrating projects.

Optional arguments:
  -h, --help  Show this help message and exit.
  --json      If this flag is specified, output will be in JSON format.
  --all       If this flag is specified, output will list all detected
              dependencies.
```

## See also

- [Phantom dependencies](../advanced/phantom_deps.md)
