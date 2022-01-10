---
layout: page
title: rush version
navigation_source: docs_nav
---

```
usage: rush version [-h] [-b BRANCH] [--ensure-version-policy]
                    [--override-version NEW_VERSION] [--bump]
                    [--bypass-policy] [--version-policy POLICY]
                    [--override-bump BUMPTYPE] [--override-prerelease-id ID]


use this "rush version" command to ensure version policies and bump versions.

Optional arguments:
  -h, --help            Show this help message and exit.
  -b BRANCH, --target-branch BRANCH
                        If this flag is specified, changes will be committed
                        and merged into the target branch.
  --ensure-version-policy
                        Updates package versions if needed to satisfy version
                        policies.
  --override-version NEW_VERSION
                        Override the version in the specified
                        --version-policy. This setting only works for
                        lock-step version policy and when
                        --ensure-version-policy is specified.
  --bump                Bumps package version based on version policies.
  --bypass-policy       Overrides "gitPolicy" enforcement (use honorably!)
  --version-policy POLICY
                        The name of the version policy
  --override-bump BUMPTYPE
                        Overrides the bump type in the version-policy.json
                        for the specified version policy. Valid BUMPTYPE
                        values include: prerelease, patch, preminor, minor,
                        major. This setting only works for lock-step version
                        policy in bump action.
  --override-prerelease-id ID
                        Overrides the prerelease identifier in the version
                        value of version-policy.json for the specified
                        version policy. This setting only works for lock-step
                        version policy. This setting increases to new
                        prerelease id when "--bump" is provided but only
                        replaces the prerelease name when
                        "--ensure-version-policy" is provided.
```

## See also

- [Publishing packages]({% link pages/maintainer/publishing.md %})
- [rush change]({% link pages/commands/rush_change.md %})
- [rush publish]({% link pages/commands/rush_publish.md %})
