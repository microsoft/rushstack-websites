---
layout: page
title: rush scan
navigation_source: docs_nav
---

```
usage: rush scan [-h]

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
```

## See also

- [Phantom dependencies]({% link pages/advanced/phantom_deps.md %})
