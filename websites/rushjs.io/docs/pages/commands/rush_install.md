---
title: rush install
---

```
usage: rush install [-h] [-p] [--bypass-policy] [--no-link]
                    [--network-concurrency COUNT] [--debug-package-manager]
                    [--max-install-attempts NUMBER] [--ignore-hooks]
                    [--variant VARIANT] [-t PROJECT] [-T PROJECT] [-f PROJECT]
                    [-o PROJECT] [-i PROJECT] [-I PROJECT]
                    [--to-version-policy VERSION_POLICY_NAME]
                    [--from-version-policy VERSION_POLICY_NAME]


The "rush install" command installs package dependencies for all your
projects, based on the shrinkwrap file that is created/updated using "rush
update". (This "shrinkwrap" file stores a central inventory of all
dependencies and versions for projects in your repo. It is found in the
"common/config/rush" folder.) If the shrinkwrap file is missing or outdated
(e.g. because project package.json files have changed), "rush install" will
fail and tell you to run "rush update" instead. This read-only nature is the
main feature: Continuous integration builds should use "rush install" instead
of "rush update" to catch developers who forgot to commit their shrinkwrap
changes. Cautious people can also use "rush install" if they want to avoid
accidentally updating their shrinkwrap file.

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
  -t PROJECT, --to PROJECT
                        Normally all projects in the monorepo will be
                        processed; adding this parameter will instead select
                        a subset of projects. Each "--to" parameter expands
                        this selection to include PROJECT and all its
                        dependencies. "." can be used as shorthand for the
                        project in the current working directory. For details,
                         refer to the website article "Selecting subsets of
                        projects".
  -T PROJECT, --to-except PROJECT
                        Normally all projects in the monorepo will be
                        processed; adding this parameter will instead select
                        a subset of projects. Each "--to-except" parameter
                        expands this selection to include all dependencies of
                        PROJECT, but not PROJECT itself. "." can be used as
                        shorthand for the project in the current working
                        directory. For details, refer to the website article
                        "Selecting subsets of projects".
  -f PROJECT, --from PROJECT
                        Normally all projects in the monorepo will be
                        processed; adding this parameter will instead select
                        a subset of projects. Each "--from" parameter expands
                        this selection to include PROJECT and all projects
                        that depend on it, plus all dependencies of this set.
                        "." can be used as shorthand for the project in the
                        current working directory. For details, refer to the
                        website article "Selecting subsets of projects".
  -o PROJECT, --only PROJECT
                        Normally all projects in the monorepo will be
                        processed; adding this parameter will instead select
                        a subset of projects. Each "--only" parameter expands
                        this selection to include PROJECT; its dependencies
                        are not added. "." can be used as shorthand for the
                        project in the current working directory. Note that
                        this parameter is "unsafe" as it may produce a
                        selection that excludes some dependencies. For
                        details, refer to the website article "Selecting
                        subsets of projects".
  -i PROJECT, --impacted-by PROJECT
                        Normally all projects in the monorepo will be
                        processed; adding this parameter will instead select
                        a subset of projects. Each "--impacted-by" parameter
                        expands this selection to include PROJECT and any
                        projects that depend on PROJECT (and thus might be
                        broken by changes to PROJECT). "." can be used as
                        shorthand for the project in the current working
                        directory. Note that this parameter is "unsafe" as it
                        may produce a selection that excludes some
                        dependencies. For details, refer to the website
                        article "Selecting subsets of projects".
  -I PROJECT, --impacted-by-except PROJECT
                        Normally all projects in the monorepo will be
                        processed; adding this parameter will instead select
                        a subset of projects. Each "--impacted-by-except"
                        parameter works the same as "--impacted-by" except
                        that PROJECT itself is not added to the selection. ".
                        " can be used as shorthand for the project in the
                        current working directory. Note that this parameter
                        is "unsafe" as it may produce a selection that
                        excludes some dependencies. For details, refer to the
                        website article "Selecting subsets of projects".
  --to-version-policy VERSION_POLICY_NAME
                        Normally all projects in the monorepo will be
                        processed; adding this parameter will instead select
                        a subset of projects. The "--to-version-policy"
                        parameter is equivalent to specifying "--to" for each
                        of the projects belonging to VERSION_POLICY_NAME. For
                        details, refer to the website article "Selecting
                        subsets of projects".
  --from-version-policy VERSION_POLICY_NAME
                        Normally all projects in the monorepo will be
                        processed; adding this parameter will instead select
                        a subset of projects. The "--from-version-policy"
                        parameter is equivalent to specifying "--from" for
                        each of the projects belonging to VERSION_POLICY_NAME.
                         For details, refer to the website article "Selecting
                        subsets of projects".
```

## See also

- [rush update](../../commands/rush_update)
