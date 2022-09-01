---
title: Config file reference
---

## Configuration files

| File(s)                                              | What it does                                                                                                                                                                                                                                                                 |
| :--------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rush.json                                            | The main configuration file for Rush                                                                                                                                                                                                                                         |
| common/changes/...                                   | Storage for the `rush change` command                                                                                                                                                                                                                                        |
| common/config/rush/.npmrc                            | If you need custom settings for "npm install" (e.g. NPM registry mappings), put them in this file. Rush will copy this file into the **common/temp/** folder.                                                                                                                |
| common/config/rush/npm-shrinkwrap.json               | The shrinkwrap file when your package manager is NPM. This is the common shrinkwrap file that applies to all projects in the Rush repo. For more information, see **"What is this "shrinkwrap file"** in the [Everyday commands](../developer/everyday_commands.md) section. |
| common/config/rush/pnpm-lock.yaml                   | The shrinkwrap file when your package manager is PNPM.                                                                                                                                                                                                                       |
| common/config/rush/yarn.lock                         | The shrinkwrap file when your package manager is Yarn.                                                                                                                                                                                                                       |
| common/config/rush/command-line.json                 | Used to define [custom commands](../maintainer/custom_commands.md).                                                                                                                                                                                                          |
| common/config/rush/browser-approved-packages.json    | Used by the **approvedPackagesPolicy** setting from rush.json                                                                                                                                                                                                                |
| common/config/rush/nonbrowser-approved-packages.json | Used by the **approvedPackagesPolicy** setting from rush.json                                                                                                                                                                                                                |
| common/config/rush/common-versions.json              | Used to specify versions that affect all projects in a repo.                                                                                                                                                                                                                 |
| common/config/rush/version-policies.json             | Controls how `rush publish` works.                                                                                                                                                                                                                                           |

## Temporary files created by Rush

| File(s)                       | What it does                                                                                                                                 |
| :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| common/temp/install-run/...   | Storage for the **install-run.js** and **install-run-rush.js** scripts. See [Enabling CI builds](../maintainer/enabling_ci_builds.md).       |
| common/temp/node_modules/...  | The installed packages. This is a plain old `npm install` output, with no symlinks in this tree.                                             |
| common/temp/npm-cache/...     | A local NPM cache will be created here. Rush does not use the global NPM cache due to its concurrency problems.                              |
| common/temp/npm-local/...     | Based on the **npmVersion** setting, Rush will install NPM in your home directory and create a symlink to it for each repo that requests it. |
| common/temp/npm-tmp/...       | Temporary files created by NPM during installation.                                                                                          |
| common/temp/projects/...      | Synthetic projects referenced by **common/temp/package.json**.                                                                               |
| common/temp/rush-recycler/... | Used to speed up recursive deletes.                                                                                                          |
| common/temp/last-install.flag | Don't worry about this file. It tracks the timestamp of the last successful `rush install`.                                                  |
| common/temp/package.json      | The common package definition.                                                                                                               |
| common/temp/rush-link.json    | Don't worry about this file. It is created whenever you run `rush link`, and read by later commands such as "rush build".                    |
