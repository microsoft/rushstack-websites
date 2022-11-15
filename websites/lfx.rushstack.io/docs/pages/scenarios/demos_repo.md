---
title: Demos repository
---

The demo scenarios are documented in this repo:

https://github.com/microsoft/lockfile-explorer-demos

## Preparing the Verdaccio environment

If you want to use `rush install` or `rush update` in the demo branches, the [Verdaccio](https://verdaccio.org/)
NPM registry service needs to be running on localhost.

1. Clone the `main` branch of this repo
2. `pnpm install`
3. `pnpm start` to launch Verdaccio
4. In a separate shell window: `pnpm publish-all` to publish all of the
   [demo NPM packages](https://github.com/microsoft/lockfile-explorer-demos/tree/main/demo-packages) to localhost.

## Deleting the Verdaccio database

If you modify **package.json** files and want to republish them, you MUST delete the Verdaccio database first:

1. Stop the service if it's already running (CTRL+C)
2. Delete the temporary files `temp/verdaccio/storage/*` by running: `rm -Rf temp`
3. Now you can redo the steps above ("Preparing the Verdaccio environment")

NOTE: Before running `rush install` in a demo branch (such as `demo/sample-1`), you should first run `rush purge`;
otherwise PNPM will complain that the checksum has changed for the modified packages.

## Diagram notation

Each demo scenario includes a GitHub branch that you can check out, for example:

**GitHub checkout branch:** [demo/sample-1](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/sample-1)

The lockfile is always found in Rush's standard location:
[common/config/rush/pnpm-lock.yaml](https://github.com/microsoft/lockfile-explorer-demos/blob/demo/sample-1/common/config/rush/pnpm-lock.yaml)

Each demo includes a visual illustration of the lockfile for that branch:

<a className='no-external-link-icon'
href="https://raw.githubusercontent.com/microsoft/lockfile-explorer-demos/demo/sample-1/common/images/lfx-demo-sample-1.svg"><img
src="https://raw.githubusercontent.com/microsoft/lockfile-explorer-demos/demo/sample-1/common/images/lfx-demo-sample-1.svg"
/></a><br/>

Some notes about the above notation:

- The circled nodes (`A`, `B`, `C`, `D`, `E`) are local workspace projects.
  In the Lockfile Explorer UI, these appear in the **"Projects"** tab.

- The rectangular nodes (`J@1_N2`) are installed external NPM package folders.
  In the Lockfile Explorer UI, these are called "lockfile entries" and appear on the **Packages** tab.
  The labels use a shorthand for the PNPM entry identifier; for example `J@1_N2` is shorthand
  for `@rushstack/j/1.0.0_@rushstack+n@2.0.0` in the above lockfile.

- The vertical dashed line indicates the boundary between local workspace projects and external NPM packages.

- The blue arrows indicate dependencies. If `A` points to `B`, this means `A` has a dependency on `B`.
  If the **package.json** version specifier is relevant, it is shown next to the arrow.
  For example, `J: ^1.0.0` is shorthand for `"@rushstack/j": "^1.0.0"` in the `"dependencies"` or `"devDependencies"`
  of [projects/d/package.json](https://github.com/microsoft/lockfile-explorer-demos/blob/demo/sample-1/projects/d/package.json)

- Dependencies from the `"peerDependencies"` section of **package.json** are shown with green lines.
  If the peer is satisfied, then the arrow points to the resolved lockfile entry.

## Demo branches

Here's a quick list of the demo branches used in this tutorial series:

- [demo/doppel-1](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/doppel-1)
- [demo/doppel-2](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/doppel-2)
- [demo/doppel-3](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/doppel-3)
- [demo/peer-1](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/peer-1)
- [demo/peer-2](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/peer-2)
- [demo/peer-3](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/peer-3)
- [demo/peer-4](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/peer-4)
- [demo/peer-5](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/peer-5)
- [demo/sample-1](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/sample-1)
- [demo/sbs-1](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/sbs-1)
- [demo/sbs-2](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/sbs-2)
- [demo/sbs-3](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/sbs-3)
