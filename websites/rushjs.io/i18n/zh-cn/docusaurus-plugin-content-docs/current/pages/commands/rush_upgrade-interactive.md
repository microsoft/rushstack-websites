---
title: rush upgrade-interactive
---

```
usage: rush upgrade-interactive [-h] [--make-consistent] [-s]

Provide an interactive way to upgrade your dependencies. Running the command
will open an interactive prompt that will ask you which projects and which
dependencies you would like to upgrade. It will then update your package.json
files, and run "rush update" for you. If you are using
ensureConsistentVersions policy, upgrade-interactive will update all packages
which use the dependencies that you are upgrading and match their SemVer
range if provided. If ensureConsistentVersions is not enabled,
upgrade-interactive will only update the dependency in the package you
specify. This can be overriden by using the --make-consistent flag.

Optional arguments:
  -h, --help         Show this help message and exit.
  --make-consistent  When upgrading dependencies from a single project, also
                     upgrade dependencies from other projects.
  -s, --skip-update  If specified, the "rush update" command will not be run
                     after updating the package.json files.
```

## See also

- [Modifying package.json](../developer/modifying_package_json.md)
- [rush install](../commands/rush_install.md)
