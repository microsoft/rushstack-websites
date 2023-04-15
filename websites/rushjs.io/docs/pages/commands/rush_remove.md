---
title: rush remove
---

```
usage: rush remove [-h] [-s] -p PACKAGE [--all]

Removes specified package(s) from the dependencies of the current project (as
determined by the current working directory) and then runs "rush update".

Optional arguments:
  -h, --help            Show this help message and exit.
  -s, --skip-update     If specified, the "rush update" command will not be
                        run after updating the package.json files.
  -p PACKAGE, --package PACKAGE
                        The name of the package which should be removed. To
                        remove multiple packages, run "rush remove --package
                        foo --package bar".
  --all                 If specified, the dependency will be removed from all
                        projects that declare it.
```

## See also

- [Modifying package.json](../developer/modifying_package_json.md)
- [rush add](../commands/rush_add.md)
