---
title: Autoinstallers
---

A monorepo will often need to install NPM packages that provide tools such as shell commands. In most cases,
these tooling dependencies can be declared as the `devDependencies` of some Rush project, and then they will be
installed by `rush install` using its centralized shrinkwrap file (package manager lock file). However, sometimes
such dependencies are needed in situations where `rush install` has not been invoked, or where `rush install` might
fail if a person's unfinished work includes some **package.json** modifications. For these situations, Rush's
**autoinstallers** feature provides an isolated mechanism for installing tooling dependencies.

An autoinstaller is defined as folder under **common/autoinstallers/** with a **package.json** file
and its own private shrinkwrap file. This folder is added to Git, but it is not a normal Rush project:
It is not installed by `rush install`, nor does it contain any buildable source code for `rush build`.
An autoinstaller is purely a container for installing NPM dependencies. Autoinstallers can be associated
with Rush features such as [custom commands](./custom_commands.md) or [Rush plugins](../extensibility/creating_plugins.md);
when the associated feature is invoked, Rush will automatically install the dependencies.

## When to use autoinstallers

If you're enabling a Rush plugin, you must configure an autoinstaller.

If you are creating a [Rush custom command](./custom_commands.md) whose script needs NPM dependences,
there are several possible approaches to consider:

- **rush install**: Typically most dependencies in a Rush monorepo will get installed all together by
  `rush install` using the centralized shrinkwrap file. For most needs, this is the simplest approach
  and easiest to maintain. If some dependencies are irrelevant to a particular task, you can skip
  installing them by using
  [project selection parameters](../developer/selecting_subsets.md) such as
  `rush install --to example-project`.

- **install-run.js**: The [install-run.js](./enabling_ci_builds.md#install-runjs-for-other-commands) script enables
  you to install NPM packages outside of `rush install`. This is useful for commands that run in contexts
  where `rush install` is not invoked at all, or where `rush install` may be broken. For example, a Git commit
  hook script gets run on branches where `rush install` might fail: developers often commit work in progress,
  or a Git rebase may introduce broken commits that get fixed up by a later commit.

- **autoinstallers**: A limitation of **install-run.js** is that it only installs one NPM package.
  For example, if your custom command needs multiple packages (for example the `pretty-quick` driver,
  the `prettier` engine, and some Prettier plugins), you could add them to the **package.json** file of
  an autoinstaller. Autoinstallers typically have a small dependency tree and thus install much faster
  than `rush install`.

  Some potential downsides of autoinstallers: In situations that require multiple autoinstallers and/or
  `rush install`, the package manager will be invoked multiple times and may need to install the same dependency
  from different shrinkwrap files. This can be significantly slower than if `rush install` could install
  everything together using the centralized shrinkwrap file. Also, autoinstallers are not validated or updated
  by `rush update`, so they require extra maintenance for upgrades.

## Creating an autoinstaller

1. Use the [rush init-autoinstaller](../commands/rush_init-autoinstaller.md) command to create the folder:

   ```bash
   # This creates the common/autoinstallers/my-autoinstaller/package.json file
   rush init-autoinstaller --name my-autoinstaller
   ```

2. Edit the **my-autoinstaller/package.json** file to add your dependencies.

3. Run [rush update-autoinstaller](../commands/rush_update-autoinstaller.md) to update the shrinkwrap file.
   You should redo this step whenever you modify the **package.json** file.

   ```bash
   # Create or update common/autoinstallers/my-autoinstaller/pnpm-lock.yaml
   # This file should be committed and tracked by Git.
   rush update-autoinstaller --name my-autoinstaller
   ```

4. Commit the updated files to git

   ```bash
   git add common/autoinstallers/my-autoinstaller/

   git commit -m "Updated autoinstaller"
   ```

To associate an autoinstaller with a custom command, specify its name in the `autoinstallerName` field
in [command-line.json](../configs/command-line_json.md).

To associate an autoinstaller with a Rush plugin, see the [Creating Rush plugins](../extensibility/creating_plugins.md)
documentation.

## Maintaining an autoinstaller

- To modify an autoinstaller, edit its **package.json** file.

  ```bash
  # This will also upgrade any indirect dependencies.
  rush update-autoinstaller --name my-autoinstaller

  # Commit the updated pnpm-lock.yaml
  git commit -m "Updated autoinstaller"
  ```

- To delete the autoinstaller, simply delete its folder:

  ```bash
  # BE CAREFUL WHEN RECURSIVELY DELETING FOLDERS
  rm -Rf common/autoinstallers/my-autoinstaller

  # Commit the changes to Git
  git add common/autoinstallers

  git commit -m "Deleted autoinstaller"
  ```

## See also

- [rush init-autoinstaller](../commands/rush_init-autoinstaller.md)
- [rush update-autoinstaller](../commands/rush_update-autoinstaller.md)
- [Enabling Prettier](../../maintainer/enabling_prettier)
- [Custom commands](./custom_commands.md)
- [Creating Rush plugins](../extensibility/creating_plugins.md)
