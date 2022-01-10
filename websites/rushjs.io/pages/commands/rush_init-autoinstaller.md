---
layout: page
title: rush init-autoinstaller
navigation_source: docs_nav
---

```
usage: rush init-autoinstaller [-h] --name AUTOINSTALLER_NAME

Use this command to initialize a new autoinstaller folder. Autoinstallers
provide a way to manage a set of related dependencies that are used for
scripting scenarios outside of the usual "rush install" context. See the
command-line.json documentation for an example.

Optional arguments:
  -h, --help            Show this help message and exit.
  --name AUTOINSTALLER_NAME
                        Specifies the name of the autoinstaller folder, which
                        must conform to the naming rules for NPM packages.
```

## See also

- [rush init]({% link pages/commands/rush_init.md %})
- [rush update-autoinstaller]({% link pages/commands/rush_update-autoinstaller.md %})
