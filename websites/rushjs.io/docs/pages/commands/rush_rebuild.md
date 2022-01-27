---
title: rush rebuild
---

```
usage: rush rebuild [-h] [-p COUNT] [-t PROJECT] [-T PROJECT] [-f PROJECT]
                    [-o PROJECT] [-i PROJECT] [-I PROJECT]
                    [--to-version-policy VERSION_POLICY_NAME]
                    [--from-version-policy VERSION_POLICY_NAME] [-v]
                    [--ignore-hooks]


This command assumes that the package.json file for each project contains a
"scripts" entry for "npm run build" that performs a full clean build. Rush
invokes this script to build each project that is registered in rush.json.
Projects are built in parallel where possible, but always respecting the
dependency graph for locally linked projects. The number of simultaneous
processes will be based on the number of machine cores unless overridden by
the --parallelism flag. (For an incremental build, see "rush build" instead
of "rush rebuild".)

Optional arguments:
  -h, --help            Show this help message and exit.
  -p COUNT, --parallelism COUNT
                        Specifies the maximum number of concurrent processes
                        to launch during a build. The COUNT should be a
                        positive integer or else the word "max" to specify a
                        count that is equal to the number of CPU cores. If
                        this parameter is omitted, then the default value
                        depends on the operating system and number of CPU
                        cores. This parameter may alternatively be specified
                        via the RUSH_PARALLELISM environment variable.
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
  --ignore-hooks        Skips execution of the "eventHooks" scripts defined
                        in rush.json. Make sure you know what you are
                        skipping.
```

## See also

- [Selecting subsets of projects](../../developer/selecting_subsets)
- [rush build](../../commands/rush_build)
