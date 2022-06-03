---
title: rush build
---

```
usage: rush build [-h] [-p COUNT] [--timeline] [-t PROJECT] [-T PROJECT]
                  [-f PROJECT] [-o PROJECT] [-i PROJECT] [-I PROJECT]
                  [--to-version-policy VERSION_POLICY_NAME]
                  [--from-version-policy VERSION_POLICY_NAME] [-v] [-c]
                  [--ignore-hooks]


This command is similar to "rush rebuild", except that "rush build" performs
an incremental build. In other words, it only builds projects whose source
files have changed since the last successful build. The analysis requires a
Git working tree, and only considers source files that are tracked by Git and
whose path is under the project folder. (For more details about this
algorithm, see the documentation for the "package-deps-hash" NPM package.)
The incremental build state is tracked in a per-project folder called ".
rush/temp" which should NOT be added to Git. The build command is tracked by
the "arguments" field in the "package-deps_build.json" file contained
therein; a full rebuild is forced whenever the command has changed (e.g.
"--production" or not).

Optional arguments:
  -h, --help            Show this help message and exit.
  -p COUNT, --parallelism COUNT
                        Specifies the maximum number of concurrent processes
                        to launch during a build. The COUNT should be a
                        positive integer, a percentage value (eg. "50%") or
                        the word "max" to specify a count that is equal to
                        the number of CPU cores. If this parameter is omitted,
                         then the default value depends on the operating
                        system and number of CPU cores. This parameter may
                        alternatively be specified via the RUSH_PARALLELISM
                        environment variable.
  --timeline            After the build is complete, print additional
                        statistics and CPU usage information, including an
                        ASCII chart of the start and stop times for each
                        operation.
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
  -v, --verbose         Display the logs during the build, rather than just
                        displaying the build status summary
  -c, --changed-projects-only
                        Normally the incremental build logic will rebuild
                        changed projects as well as any projects that
                        directly or indirectly depend on a changed project.
                        Specify "--changed-projects-only" to ignore dependent
                        projects, only rebuilding those projects whose files
                        were changed. Note that this parameter is "unsafe";
                        it is up to the developer to ensure that the ignored
                        projects are okay to ignore.
  --ignore-hooks        Skips execution of the "eventHooks" scripts defined
                        in rush.json. Make sure you know what you are
                        skipping.
```

## See also

- [Selecting subsets of projects](../../developer/selecting_subsets)
- [rush rebuild](../../commands/rush_rebuild)
