---
title: rush list
---

```
usage: rush list [-h] [-v] [-p] [--full-path] [--json] [-t PROJECT]
                 [-T PROJECT] [-f PROJECT] [-o PROJECT] [-i PROJECT]
                 [-I PROJECT] [--to-version-policy VERSION_POLICY_NAME]
                 [--from-version-policy VERSION_POLICY_NAME]


List package names, and optionally version (--version) and path (--path) or
full path (--full-path), for projects in the current rush config.

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         If this flag is specified, the project version will
                        be displayed in a column along with the package name.
  -p, --path            If this flag is specified, the project path will be
                        displayed in a column along with the package name.
  --full-path           If this flag is specified, the project full path will
                        be displayed in a column along with the package name.
  --json                If this flag is specified, output will be in JSON
                        format.
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
