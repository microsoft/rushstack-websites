---
title: Demos repository
---

This section contains a series of hands-on tutorials that explore various lockfile versioning scenarios.
The demo content can be checked out from this repo:

https://github.com/microsoft/lockfile-explorer-demos

The demo packages have names like `@rushstack/a`, `@rushstack/b`, `@rushstack/c`, etc.
They are not real packages; instead you publish them to a [Verdaccio](https://verdaccio.org/) service
that is running on your `http://localhost` network, which is used by `rush install` in the demo branches.

## Preparing the Verdaccio environment

If you want to invoke `rush install` or `rush update` in the demo branches, the [Verdaccio](https://verdaccio.org/)
NPM registry service must be running. Launch it like this:

1. Clone the `main` branch of the [lockfile-explorer-demos](https://github.com/microsoft/lockfile-explorer-demos)
   repository. Since you'll need two clones of the repository, we recommend to name this folder
   `"lockfile-explorer-demos-verdaccio"`:
   ```bash
   git clone https://github.com/microsoft/lockfile-explorer-demos.git lockfile-explorer-demos-verdaccio
   ```
2. Use the [PNPM package manager](https://pnpm.io/) to install the tooling dependencies:
   ```bash
   pnpm install
   ```
3. Launch the Verdaccio service:
   ```bash
   pnpm start
   ```
4. **_In a separate shell window_** run `pnpm publish-all` to publish all of the
   [demo NPM packages](https://github.com/microsoft/lockfile-explorer-demos/tree/main/demo-packages)
   to `http://localhost`:

   ```bash
   # (Open a separate shell window, since "pnpm start" is still running from step 3)
   cd lockfile-explorer-demos-verdaccio

   pnpm publish-all
   ```

> Deleting the Verdaccio database
>
> If want to experiment with changing the locally published **package.json** files, you MUST delete the Verdaccio
> database first:
>
> 1. Stop the service if it's already running (CTRL+C)
> 2. Delete the temporary files `temp/verdaccio/storage/*` by running: `rm -Rf temp`
> 3. Now you can redo the steps above ("Preparing the Verdaccio environment")

## Checking out a demo branch

> **_Is your "rush install" stalling with ECONNREFUSED warnings?_**
>
> ```
> WARN  GET http://127.0.0.1:54321/@rushstack/p/-/p-2.0.3.tgz error (ECONNREFUSED).
> Will retry in 10 seconds. 2 retries left.
> ```
>
> **How to fix it:** Make sure Verdaccio is running!

Here's the steps for checking out the `demo/sample-1` branch. Other branches can be checked out
in the same way.

1. We'll need a second clone for checking out branches. The documentation assumes this one is
   called `"lockfile-explorer-demos"` (whereas your `main` branch clone is `"lockfile-explorer-demos-verdaccio"`):

   ```bash
   git clone https://github.com/microsoft/lockfile-explorer-demos.git lockfile-explorer-demos
   ```

2. Check out the demo branch:

   ```bash
   # We occasionally update the demos, so make sure you have the latest branch
   git fetch

   # WARNING: THIS COMMAND WILL DELETE ANY LOCAL CHANGES YOU MADE
   git checkout -f -B demo/sample-1 remotes/origin/demo/sample-1
   ```

3. Install the NPM packages using [Rush](@rushjs/):

   ```bash
   # Verdaccio must be running for this command!

   # If you made changes to package.json, use "rush update --full" here instead
   rush install

   # NOTE: If Rush complains that package checksum hashes have changed, you may need
   # to do "rush purge" first.
   ```

## Diagram notation

The GitHub branch for each scenario will be labeled like this:

**GitHub checkout branch:** [demo/sample-1](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/sample-1)

The lockfile is always found in Rush's standard location of the branch:
[common/config/rush/pnpm-lock.yaml](https://github.com/microsoft/lockfile-explorer-demos/blob/demo/sample-1/common/config/rush/pnpm-lock.yaml)

Each demo includes a visual illustration of the lockfile for that branch. Here's the illustration for `demo/sample-1`:

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

- The blue arrows indicate dependency relationships: If `A` points to `B`, this means `A` has a dependency on `B`.
  If the **package.json** version specifier is relevant, it is shown next to the arrow.
  For example, `J: ^1.0.0` is shorthand for `"@rushstack/j": "^1.0.0"` in the `"dependencies"` or `"devDependencies"`
  of [projects/d/package.json](https://github.com/microsoft/lockfile-explorer-demos/blob/demo/sample-1/projects/d/package.json)

- If the **package.json** has `"peerDependencies"`, they are shown as green lines.
  If the peer is satisfied, then the arrow points to the resolved target lockfile entry.

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
