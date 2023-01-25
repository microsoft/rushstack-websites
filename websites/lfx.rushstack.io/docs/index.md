---
title: Overview
hide_title: true
---

<img src="/images/site/lockfile-explorer.svg" alt="Lockfile Explorer" title="Lockfile Explorer"
style={{ width: '400px', paddingBottom: '1rem' }}/>

**Rush Lockfile Explorer** helps you investigate and solve version conflicts when working in a monorepo
that uses the [PNPM package manager](https://pnpm.io/). It's designed for the [Rush](@rushjs/)
build orchestrator, but you can also use it to analyze a standalone PNPM workspace without Rush.

Lockfile Explorer helps with problems such as:

- Understanding why multiple versions of an NPM package are appearing in your `node_modules` folder
- Tracing dependencies to determine which project caused an NPM package to be installed
- Finding and eliminating ["doppelgangers"](./pages/scenarios/npm_doppelgangers.md)
  (multiple installations of the same version of the same package)
- Troubleshooting problems involving peer dependencies

The app is distributed as a regular NPM package. You invoke it from the shell command line,
and it launches a Node.js service on `http://localhost`:

<a href="pathname:///images/site/readme-screenshot.png"><img src={require('/images/site/readme-screenshot.png').default}
alt="App Screenshot" /></a><br/>

_Lockfile Explorer main window_

## Essentials

- [Getting Started](./pages/basics/getting_started.md) installing and using the app
- **NPM package:** [@rushstack/lockfile-explorer](https://www.npmjs.com/package/@rushstack/lockfile-explorer)
- **What's new:** [CHANGELOG.md](https://github.com/microsoft/rushstack/blob/main/apps/lockfile-explorer/CHANGELOG.md)
- **Source code:** github.com/microsoft/rushstack/ [apps/lockfile-explorer](https://github.com/microsoft/rushstack/tree/main/apps/lockfile-explorer)

Lockfile Explorer is part of the [Rush Stack](@rushstack/) family of open source projects.
