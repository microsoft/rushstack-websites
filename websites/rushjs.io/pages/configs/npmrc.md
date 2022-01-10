---
layout: page
title: .npmrc
navigation_source: docs_nav
---

This is the template that [rush init]({% link pages/commands/rush_init.md %})
generates for the monorepo **.npmrc** file:

**common/config/rush/.npmrc**

```shell
# Rush uses this file to configure the NPM package registry during installation.  It is applicable
# to PNPM, NPM, and Yarn package managers.  It is used by operations such as "rush install",
# "rush update", and the "install-run.js" scripts.
#
# NOTE: The "rush publish" command uses .npmrc-publish instead.
#
# Before invoking the package manager, Rush will copy this file to the folder where installation
# is performed.  The copied file will omit any config lines that reference environment variables
# that are undefined in that session; this avoids problems that would otherwise result due to
# a missing variable being replaced by an empty string.
#
# * * * SECURITY WARNING * * *
#
# It is NOT recommended to store authentication tokens in a text file on a lab machine, because
# other unrelated processes may be able to read the file.  Also, the file may persist indefinitely,
# for example if the machine loses power.  A safer practice is to pass the token via an
# environment variable, which can be referenced from .npmrc using ${} expansion.  For example:
#
#   //registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}
#
registry=https://registry.npmjs.org/
always-auth=false
```

## .npmrc file precedence

Regular Rush operations perform the following lookup:

1. To support unusual situations, NPM config environment variables take precedence over any **.npmrc** settings.
   The environment variable name is prefixed by `npm_config_`. For example, setting the `npm_config_registry`
   variable will override the `registry` setting in **.npmrc**. Nonstandard name patterns like
   `npm_config_@example:registry` are also accepted by NPM's design.
2. Typically settings come from a temporary **.npmrc** file that Rush copies into the working directory
   for the operation. The file is copied from **common/config/rush/.npmrc**, but omitting any lines that
   reference undefined environment variables (as explained above). For most operations, the working directory
   will be **common/temp**.
3. If the package manager cannot find a setting via 1 or 2, then the user's **~/.npmrc** is
   consulted. Individual users typically store their authentication tokens in this file.

The above rules also apply for helpers scripts such as **install-run.js**.

The `rush publish` command uses a different file **.npmrc-publish** with its own rules.
See [this documentation]({% link pages/configs/npmrc-publish.md %}) for details.

The above rules do not apply if the package manager is invoked directly (instead of via Rush).
For example, `npm publish` is invoked from the shell, then the
[package manager's usual precedence](https://docs.npmjs.com/cli/v7/using-npm/config#npmrc-files) will
apply instead. Generally this practice is discouraged in a Rush repo, but if used, you may need to create
additional **.npmrc** files.

## See also

- [NPM registry authentication]({% link pages/maintainer/npm_registry_auth.md %})
- [.npmrc-publish]({% link pages/configs/npmrc-publish.md %}) config file
