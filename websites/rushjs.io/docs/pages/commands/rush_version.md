---
title: rush version
---

```
usage: rush version [-h] [-b BRANCH] [--ensure-version-policy]
                    [--override-version NEW_VERSION] [--bump]
                    [--bypass-policy] [--version-policy POLICY]
                    [--override-bump BUMPTYPE] [--override-prerelease-id ID]
                    [--ignore-git-hooks]


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
  --ignore-git-hooks    Skips execution of all git hooks. Make sure you know
                        what you are skipping.
```

## See also

- [Publishing packages](../../maintainer/publishing)
- [rush change](../../commands/rush_change)
- [rush publish](../../commands/rush_publish)
