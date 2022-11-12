---
title: Modifying package.json
---

## rush add

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

## rush remove

There is also a corresponding [rush remove](../commands/rush_remove.md) command for deleting entries from **package.json**:

```bash
~/my-repo$ cd apps/my-app

# Remove the "example-lib" dependency from package.json and then automatically run "rush update":
~/my-repo/apps/my-app$ rush remove --package example-lib
```

## Manually modifying package.json

Of course, you can also simply edit the **package.json** file directly. Remember to run `rush update`
afterwards to update the shrinkwrap file.

> **Tip: A cool VS Code feature**
>
> By the way, if you use Visual Studio Code as your editor, the
> [Version Lens extension](https://marketplace.visualstudio.com/items?itemName=pflannery.vscode-versionlens)
> can display a tool tip showing the latest version of each dependency in your **package.json**.
> This is helpful for finding and fixing outdated versions.

## rush upgrade-interactive

The `rush add` and `rush remove` commands operate on a single dependency at a time.
To upgrade many packages and projects across your repo, you can use the
[rush upgrade-interactive](../commands/rush_upgrade-interactive.md) command.
It will walk you through selecting projects and choosing which versions to upgrade:

<img src="/images/docs/upgrade-interactive-0.png" alt="rush upgrade-interactive screenshot" /><br/>

_Choosing the project_

<img src="/images/docs/upgrade-interactive-1.png" alt="rush upgrade-interactive screenshot" /><br/>

_Choosing the dependencies to upgrade_

## pnpm outdated

To create a report about outdated dependencies, you can also use the [pnpm outdated](https://pnpm.io/cli/outdated)
command. Note that when invoking PNPM commands in a Rush monorepo, you must use the `rush-pnpm` CLI helper.

<img src="/images/docs/pnpm-outdated.png" alt="rush-pnpm outdated screenshot" /><br/>

_Invoking rush-pnpm outdated_
