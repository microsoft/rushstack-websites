---
layout: page
title: rush update
navigation_source: docs_nav
---

```
usage: rush update [-h] [-p] [--bypass-policy] [--no-link]
                   [--network-concurrency COUNT] [--debug-package-manager]
                   [--max-install-attempts NUMBER] [--ignore-hooks]
                   [--variant VARIANT] [--full] [--recheck]


The "rush update" command installs the dependencies described in your package.
json files, and updates the shrinkwrap file as needed. (This "shrinkwrap"
file stores a central inventory of all dependencies and versions for projects
in your repo. It is found in the "common/config/rush" folder.) Note that Rush
always performs a single install for all projects in your repo. You should
run "rush update" whenever you start working in a Rush repo, after you pull
from Git, and after you modify a package.json file. If there is nothing to do,
 "rush update" is instantaneous. NOTE: In certain cases "rush install" should
be used instead of "rush update" -- for details, see the command help for
"rush install".

Optional arguments:
  -h, --help            Show this help message and exit.
  -p, --purge           Perform "rush purge" before starting the installation
  --bypass-policy       Overrides enforcement of the "gitPolicy" rules from
                        rush.json (use honorably!)
  --no-link             If "--no-link" is specified, then project symlinks
                        will NOT be created after the installation completes.
                        You will need to run "rush link" manually. This flag
                        is useful for automated builds that want to report
                        stages individually or perform extra operations in
                        between the two stages. This flag is not supported
                        when using workspaces.
  --network-concurrency COUNT
                        If specified, limits the maximum number of concurrent
                        network requests. This is useful when troubleshooting
                        network failures.
  --debug-package-manager
                        Activates verbose logging for the package manager.
                        You will probably want to pipe the output of Rush to
                        a file when using this command.
  --max-install-attempts NUMBER
                        Overrides the default maximum number of install
                        attempts. The default value is 3.
  --ignore-hooks        Skips execution of the "eventHooks" scripts defined
                        in rush.json. Make sure you know what you are
                        skipping.
  --variant VARIANT     Run command using a variant installation
                        configuration. This parameter may alternatively be
                        specified via the RUSH_VARIANT environment variable.
  --full                Normally "rush update" tries to preserve your
                        existing installed versions and only makes the
                        minimum updates needed to satisfy the package.json
                        files. This conservative approach prevents your PR
                        from getting involved with package updates that are
                        unrelated to your work. Use "--full" when you really
                        want to update all dependencies to the latest
                        SemVer-compatible version. This should be done
                        periodically by a person or robot whose role is to
                        deal with potential upgrade regressions.
  --recheck             If the shrinkwrap file appears to already satisfy the
                        package.json files, then "rush update" will skip
                        invoking the package manager at all. In certain
                        situations this heuristic may be inaccurate. Use the
                        "--recheck" flag to force the package manager to
                        process the shrinkwrap file. This will also update
                        your shrinkwrap file with Rush's fixups. (To minimize
                        shrinkwrap churn, these fixups are normally performed
                        only in the temporary folder.)
```

## See also

- [rush install]({% link pages/commands/rush_install.md %})
