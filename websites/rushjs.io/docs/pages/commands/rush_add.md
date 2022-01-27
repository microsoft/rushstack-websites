---
title: rush add
---

```
usage: rush add [-h] -p PACKAGE [--exact] [--caret] [--dev] [-m] [-s] [--all]

Adds a specified package as a dependency of the current project (as
determined by the current working directory) and then runs "rush update". If
no version is specified, a version will be automatically detected (typically
either the latest version or a version that won't break the
"ensureConsistentVersions" policy). If a version range (or a workspace range)
is specified, the latest version in the range will be used. The version will
be automatically prepended with a tilde, unless the "--exact" or "--caret"
flags are used. The "--make-consistent" flag can be used to update all
packages with the dependency.

Optional arguments:
  -h, --help            Show this help message and exit.
  -p PACKAGE, --package PACKAGE
                        (Required) The name of the package which should be
                        added as a dependency. A SemVer version specifier can
                        be appended after an "@" sign. WARNING: Symbol
                        characters are usually interpreted by your shell, so
                        it's recommended to use quotes. For example, write
                        "rush add --package "example@^1.2.3"" instead of
                        "rush add --package example@^1.2.3".
  --exact               If specified, the SemVer specifier added to the
                        package.json will be an exact version (e.g. without
                        tilde or caret).
  --caret               If specified, the SemVer specifier added to the
                        package.json will be a prepended with a "caret"
                        specifier ("^").
  --dev                 If specified, the package will be added to the
                        "devDependencies" section of the package.json
  -m, --make-consistent
                        If specified, other packages with this dependency
                        will have their package.json files updated to use the
                        same version of the dependency.
  -s, --skip-update     If specified, the "rush update" command will not be
                        run after updating the package.json files.
  --all                 If specified, the dependency will be added to all
                        projects.
```
