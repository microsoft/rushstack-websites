---
title: Getting started
---

## Usage

### Web app

Here's how to invoke the **Rush Lockfile Explorer** tool:

```bash
# Install the NPM package globally.
#
# (You could substitute "pnpm" or "yarn" instead of "npm" here.  To avoid confusing
# duplicate installs, always use the same tool for global installations!)
npm install -g @rushstack/lockfile-explorer

# Go to your monorepo folder
cd my-rush-repo

# Run "rush install" to ensure common/temp/node_modules is up to date.
# (If your monorepo is using PNPM without Rush, substitute "pnpm install" for this step.)
rush install

# Launch the Lockfile Explorer command line interface (CLI).
# It expects to find a Rush/PNPM workspace in your shell's current working directory.
# As a shorthand, the "lfx" alias can be used here instead of "lockfile-explorer".
lockfile-explorer start
```

The CLI will start a Node.js service on `http://localhost/` and launch your default web browser:

<a href="pathname:///images/site/readme-screenshot.png"><img src={require('/images/site/readme-screenshot.png').default}
alt="App Screenshot" style={{ width: '600px' }}/></a><br/>

_Lockfile Explorer main window_

### Manually invoked shell command

You can use `lockfile --check` to verify whether there are any versions in the dependency tree that do not meet the expected criteria. The `--project` option specifies the project name, if it is not specified, the project will be automatically located based on the current execution position. You can specify a version number after the package name, if not specified, it will check for consistency across the entire dependency tree.

Usage Example:

```bash
lockfile-explorer check react
lockfile-explorer check --project xxx react
lockfile-explorer check --project xxx react@18
lockfile-explorer check --project xxx react@18.2
lockfile-explorer check --project xxx react@18.2.0
```

## How it works

The web app will expect to find a Rush/PNPM workspace in the current working directory where
the `lockfile-explorer` command was invoked. It will read files such as:

- **common/config/rush/pnpm-lock.yaml** - the PNPM lockfile for your monorepo
- **common/config/rush/.pnpmfile.cjs** - which transforms **package.json** files during installation
- The **package.json** files for your local workspace projects
- The **package.json** files for external packages installed in the `node_modules` folders.
