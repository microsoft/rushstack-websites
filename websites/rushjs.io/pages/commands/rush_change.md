---
layout: page
title: rush change
navigation_source: docs_nav
---

```
usage: rush change [-h] [-v] [--no-fetch] [-b BRANCH] [--overwrite]
                   [--email EMAIL] [--bulk] [--message MESSAGE]
                   [--bump-type {major,minor,patch,none}]


Asks a series of questions and then generates a <branchname>-<timestamp>.json
file in the common folder. The `publish` command will consume these files and
perform the proper version bumps. Note these changes will eventually be
published in a changelog.md file in each package. The possible types of
changes are: MAJOR - these are breaking changes that are not backwards
compatible. Examples are: renaming a public class, adding/removing a
non-optional parameter from a public API, or renaming an variable or function
that is exported. MINOR - these are changes that are backwards compatible
(but not forwards compatible). Examples are: adding a new public API or
adding an optional parameter to a public API PATCH - these are changes that
are backwards and forwards compatible. Examples are: Modifying a private API
or fixing a bug in the logic of how an existing API works. HOTFIX
(EXPERIMENTAL) - these are changes that are hotfixes targeting a specific
older version of the package. When a hotfix change is added, other changes
will not be able to increment the version number. Enable this feature by
setting 'hotfixChangeEnabled' in your rush.json.

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --verify          Verify the change file has been generated and that it
                        is a valid JSON file
  --no-fetch            Skips fetching the baseline branch before running
                        "git diff" to detect changes.
  -b BRANCH, --target-branch BRANCH
                        If this parameter is specified, compare the checked
                        out branch with the specified branch to determine
                        which projects were changed. If this parameter is not
                        specified, the checked out branch is compared against
                        the "master" branch.
  --overwrite           If a changefile already exists, overwrite without
                        prompting (or erroring in --bulk mode).
  --email EMAIL         The email address to use in changefiles. If this
                        parameter is not provided, the email address will be
                        detected or prompted for in interactive mode.
  --bulk                If this flag is specified, apply the same change
                        message and bump type to all changed projects. The
                        --message and the --bump-type parameters must be
                        specified if the --bulk parameter is specified
  --message MESSAGE     The message to apply to all changed projects if the
                        --bulk flag is provided.
  --bump-type {major,minor,patch,none}
                        The bump type to apply to all changed projects if the
                        --bulk flag is provided.
```

## See also

- [Authoring change logs]({% link pages/best_practices/change_logs.md %})
- [rush version]({% link pages/commands/rush_version.md %})
