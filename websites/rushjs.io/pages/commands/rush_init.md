---
layout: page
title: rush init
navigation_source: docs_nav
---

```
usage: rush init [-h] [--overwrite-existing] [--rush-example-repo]

When invoked in an empty folder, this command provisions a standard set of
config file templates to start managing projects using Rush.

Optional arguments:
  -h, --help            Show this help message and exit.
  --overwrite-existing  By default "rush init" will not overwrite existing
                        config files. Specify this switch to override that.
                        This can be useful when upgrading your repo to a
                        newer release of Rush. WARNING: USE WITH CARE!
  --rush-example-repo   When copying the template config files, this
                        uncomments fragments that are used by the
                        "rush-example" GitHub repo, which is a sample
                        monorepo that illustrates many Rush features. This
                        option is primarily intended for maintaining that
                        example.
```

## See also

- [Setting up a new repo]({% link pages/maintainer/setup_new_repo.md %})
- The [rush-example](https://github.com/microsoft/rush-example) repo on GitHub
- [rush init-deploy]({% link pages/commands/rush_init-deploy.md %})
