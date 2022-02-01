---
title: Autoinstallers
---

A Rush **autoinstaller** is a folder under **common/autoinstallers/** with a **package.json** file and
shrinkwrap file (package manager lock file), whose installation is decoupled from the usual `rush install`.
Installation is triggered on demand when an associated feature is invoked.

## When to use autoinstallers

If you're enabling a Rush plugin, you must configure an autoinstaller.

If you are creating a [Rush custom command](./custom_commands.md) whose script needs NPM dependences,
an autoinstaller is one way to install them. Some alternatives to compare:

- **rush install**: Typically most dependencies in a Rush monorepo will get installed all together by
  `rush install` using the centralized shrinkwrap file. For most needs this is the simplest approach
  and easiest to maintain. If some dependencies are irrelevant to a particular task, you can skip
  installing them by using
  [project selection parameters](../developer/selecting_subsets.md) such as
  `rush install --to example-project`.

- **install-run.js**: The [install-run.js](./enabling_ci_builds.md) script enables you to install NPM packages
  outside of `rush install`. This is useful for commands that run in contexts where `rush install` is
  not invoked at all, or where `rush install` may be broken. For example, a Git commit hook script gets run on
  branches where `rush install` might fail: developers often commit work in progress, or a Git rebase may introduce
  broken commits that get fixed up by a later commit.

  A limitation of **install-run.js** is that it only installs one NPM package; if you need multiple packages
  (for example the `pretty-quick` driver, the `prettier` engine, and some Prettier plugins)
  then you would need to make them dependencies of a helper NPM package and publish it to your private NPM registry.

- **autoinstallers**: Autoinstallers avoid the need to publish a helper NPM package. They typically have a
  small dependency tree and thus install much faster than `rush install`. However keep in mind that your overall
  installation time will be worse in situations that require multiple autoinstallers and/or `rush install`,
  due to the overhead of installing redundant instances of the same NPM packages.

  Also, autoinstallers are not validated or updated by `rush update`, so extra maintenance is required.

## Creating an autoinstaller

1. Use the [rush init-autoinstaller](../commands/rush_init-autoinstaller.md) command to create the folder:

   ```shell
   # This creates the common/autoinstallers/my-autoinstaller/package.json file
   $ rush init-autoinstaller --name my-autoinstaller
   ```

2. Edit the **my-autoinstaller/package.json** file to add your dependencies.

3. Run [rush update-autoinstaller](../commands/rush_update-autoinstaller.md) to update the shrinkwrap file.
   You should redo this step whenever you modify the **package.json** file.

   ```shell
   # Create or update common/autoinstallers/my-autoinstaller/pnpm-lock.yaml
   # This file should be committed and tracked by Git.
   $ rush update-autoinstaller --name my-autoinstaller
   ```

4. Commit the updated files to git

   ```shell
   $ git add common/autoinstallers/my-autoinstaller/
   $ git commit -m "Updated autoinstaller"
   ```

To associate an autoinstaller with a custom command, specify its name in the `autoinstallerName` field
in [command-line.json](.../configs/command-line_json.md).

To associate an autoinstaller with a Rush plugin, see the [Creating Rush plugins](../advanced/creating_plugins.md)
documentation.

## Maintaining an autoinstaller

- To modify an autoinstaller, edit its **package.json** file.

  ```shell
  # This will also upgrade any indirect dependencies.
  $ rush update-autoinstaller --name my-autoinstaller

  # Commit the updated pnpm-lock.yaml
  $ git commit -m "Updated autoinstaller"
  ```

- To delete the autoinstaller, simply delete its folder:

  ```shell
  # BE CAREFUL WHEN RECURSIVELY DELETING FOLDERS
  $ rm -Rf common/autoinstallers/my-autoinstaller

  # Commit the changes to Git
  $ git add common/autoinstallers
  $ git commit -m "Deleted autoinstaller"
  ```
