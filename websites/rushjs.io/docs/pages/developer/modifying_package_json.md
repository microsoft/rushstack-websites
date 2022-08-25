---
title: Modifying package.json
---

Let's say you need to add a new dependency on a library "**example-lib**". Without Rush, you would do something like this:

```bash
# DON'T DO THIS IN A RUSH REPO:
~/my-repo$ cd apps/my-app
~/my-repo/apps/my-app$ npm install --save example-lib
```

In a Rush repo, you should instead use the [rush add](../commands/rush_add.md) command:

```bash
~/my-repo$ cd apps/my-app

# Add "example-lib" as a dependency of "my-app", and then automatically run "rush update":
~/my-repo/apps/my-app$ rush add --package example-lib
```

The `rush add` command can also be used to update the version of an existing dependency:

```bash
# Update "my-app" to use "example-lib" version "~1.2.3":
~/my-repo/apps/my-app$ rush add --package example-lib@1.2.3

# Or if you want the version specifier "^1.2.3":
~/my-repo/apps/my-app$ rush add --package example-lib@1.2.3 --caret

# A more advanced example, where we query the NPM registry to find latest version that is
# compatible with the SemVer specifier "^1.2.0" and then add it as a tilde dependency
# such as "~1.5.3".
#
# IMPORTANT: When specifying symbol characters on the command line, use quotes so they
# don't get misinterpreted by your shell.
~/my-repo/apps/my-app$ rush add --package "example-lib@^1.2.0"

# If any other projects in the repo are using "example-lib", you can update them all
# to "1.2.3" in bulk:
~/my-repo/apps/my-app$ rush add --package example-lib@1.2.3 --make-consistent

```

The [command-line help](../commands/rush_add.md) for `rush add` describes other options that you can use to customize the behavior.

> **Tip: A cool VS Code feature**
>
> By the way, if you use Visual Studio Code as your editor, another option is to simply edit the **package.json** file directly. If you start typing `"example-lib":`, VS Code will automatically query the NPM registry and show autocomplete suggestions for the latest published version. For simple additions, this can be even quicker than `rush add`.
>
> If you modify **package.json** manually, don't forget to run `rush update` afterwards.

## Upgrading to newer versions of your NPM packages

The `rush update --full` can install newer versions that satisfy your existing **package.json** files; however, if you want to upgrade the **package.json** files to specify newer version ranges, today Rush does not yet provide a command for doing that in bulk.

The [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) tool will work to upgrade individual projects in a Rush repo, as long as you remember to run `rush update` afterwards (instead of `npm install`).

_NOTE: Support for PNPM workspaces is [already available](https://github.com/microsoft/rushstack/pull/1938); with this feature enabled, the [pnpm update](https://pnpm.js.org/en/cli/update) command can be used for bulk upgrades._
