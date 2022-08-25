---
title: Getting started as a developer
---

## Prerequisites

In order to use Rush, you will need the NodeJS engine. We recommend the latest [LTS version](https://nodejs.org/en/download/releases/), because non-stable NodeJS releases frequently have bugs. You might consider installing via [nvm-windows](https://github.com/coreybutler/nvm-windows) or [nvm](https://github.com/creationix/nvm) (Mac/Linux), which allows you to easily switch between different NodeJS versions that might be required for different projects that you work on.

You also need to install the Rush tool itself. It's pretty easy. From your shell or command prompt, type this:

```bash
npm install -g @microsoft/rush
```

_NOTE: If this command fails because your user account does not have permissions to access NPM's global folder, you may need to [fix your NPM configuration](https://docs.npmjs.com/getting-started/fixing-npm-permissions)._

To see Rush's command line help, you can type:

```bash
rush -h
```

The command-line help is also published online in the [Command Reference](../commands/rush_add.md).

## A couple caveats

Before we get started, a couple important points to keep in mind:

#### 1. Avoid certain commands in a Rush repo

Rush optimizes by installing all of your dependency packages in a central folder, and then uses [symlinks](https://en.wikipedia.org/wiki/Symbolic_link) to create the "node_modules" folder for each of your projects.

**Avoid using package manager commands that install/link dependencies.** For example, `npm run` will work fine, but these commands will get confused by Rush's symlinks: `npm install`, `npm update`, `npm link`, `npm dedupe`, etc. (The same goes for other package managers: Avoid commands such as `pnpm install` or `yarn install`.) If you want to use those commands, first run `rush unlink` to delete the symlinks created by Rush.

If you use `git clean -dfx` to clean up your folder, be aware that it handles symlinks poorly. To avoid trouble, always run `rush unlink` before using `git clean -dfx`.

Afterwards you can run `rush update` to recreate the symlinks. (There is a standalone `rush link` command, but it's rarely needed.)

#### 2. If you suspect your install is corrupted...

Rush's package management commands are "incremental", which means they save time by skipping steps that appear to be unnecessary. Since Rush runs in automated build environments, we have many safeguards to ensure these checks are accurate. However when debugging or tinkering with packages on your local machine, sometimes your NPM "node_modules" folder can get into a bad state, causing strange errors.

If you suspect your install is corrupted, try running `rush update --purge`. This will force a full reinstall of your packages, and usually get you back into a good state.
