---
title: Side-by-side versions
---

_This hands-on demo uses the `lockfile-explorer-demos` environment.
For setup instructions, read the [Demos repository](./demos_repo.md) article._

## Step 1: A diamond dependency

**GitHub checkout branch:** [demo/sbs-1](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/sbs-1)

```bash
cd lockfile-explorer-demos

# WARNING: THIS COMMAND WILL DELETE ANY LOCAL CHANGES YOU MADE
git checkout -f -B demo/sbs-1 remotes/origin/demo/sbs-1
rush install
```

<a className='no-external-link-icon'
href="https://raw.githubusercontent.com/microsoft/lockfile-explorer-demos/demo/sbs-1/common/images/lfx-demo-sbs-1.svg"><img
src="https://raw.githubusercontent.com/microsoft/lockfile-explorer-demos/demo/sbs-1/common/images/lfx-demo-sbs-1.svg"
/></a><br/>

Let's start with a simple side-by-side version, as discussed in the [Version conflicts](../concepts/version_conflicts.md)
section. In the above diagram, `A` depends on `B` and also `P`:

[projects/a/package.json](https://github.com/microsoft/lockfile-explorer-demos/blob/demo/sbs-1/projects/a/package.json)

```js
{
  "name": "@rushstack/a",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "@rushstack/b": "workspace:*",
    "@rushstack/p": "~2.0.1"
  }
}
```

Whereas `B` also depends on `P`, but using the [SemVer range](../concepts/semver.md) `~2.0.2` instead of `~2.0.1`.

This creates a **"diamond dependency"**. However, because the package manager is able to satisfy both ranges
using `P@2.0.3`, it does not create a side-by-side version.👍

The resulting lockfile looks like this:

[common/config/rush/pnpm-lock.yaml](https://github.com/microsoft/lockfile-explorer-demos/blob/demo/sbs-1/common/config/rush/pnpm-lock.yaml) _(shown with unimportant fields omitted)_

```yaml
importers:
  ../../projects/a:
    specifiers:
      '@rushstack/b': workspace:*
      '@rushstack/p': ~2.0.1
    dependencies:
      '@rushstack/b': link:../b
      '@rushstack/p': 2.0.3

  ../../projects/b:
    specifiers:
      '@rushstack/p': ~2.0.2
    dependencies:
      '@rushstack/p': 2.0.3

packages:
  /@rushstack/p/2.0.3:
    dev: false
```

## Step 2: Side-by-side versions

**GitHub checkout branch:** [demo/sbs-2](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/sbs-2)

```bash
# WARNING: THIS COMMAND WILL DELETE ANY LOCAL CHANGES YOU MADE
git checkout -f -B demo/sbs-2 remotes/origin/demo/sbs-2
rush install
```

<a className='no-external-link-icon'
href="https://raw.githubusercontent.com/microsoft/lockfile-explorer-demos/demo/sbs-2/common/images/lfx-demo-sbs-2.svg"><img
src="https://raw.githubusercontent.com/microsoft/lockfile-explorer-demos/demo/sbs-2/common/images/lfx-demo-sbs-2.svg"
/></a><br/>

Step 2 adds a third project `C` which depends on `P: ^1.0.0`, which does produce side-by-side versions.

It's not ideal for different monorepo projects to be using inconsistent version ranges. (What if
in the future `A` takes a dependency on `C`?). However in this lockfile there's no immediate trouble,
since the two dependency trees are disjoint.

## Step 3: Side-by-side version trouble

**GitHub checkout branch:** [demo/sbs-3](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/sbs-3)

```bash
# WARNING: THIS COMMAND WILL DELETE ANY LOCAL CHANGES YOU MADE
git checkout -f -B demo/sbs-3 remotes/origin/demo/sbs-3
rush install
```

<a className='no-external-link-icon'
href="https://raw.githubusercontent.com/microsoft/lockfile-explorer-demos/demo/sbs-3/common/images/lfx-demo-sbs-3.svg"><img
src="https://raw.githubusercontent.com/microsoft/lockfile-explorer-demos/demo/sbs-3/common/images/lfx-demo-sbs-3.svg"
/></a><br/>

Step 3 introduces a version conflict: In the above diagram, `A` depends on `P: ^2.0.0` however `B`
is using `P: ^1.0.0`. This means that `A`'s dependency tree now includes two different versions `P`.
As discussed in [Version conflicts](../concepts/version_conflicts.md), this might cause performance issues,
such as a performance regression where `A`'s bundle contains ttwo copies of `P`. It could also cause a TypeScript
compile error, due to conflicts between the .d.ts files from `P@2.0.3` versus `P@1.2.3`. Even if the code compiles,
it could also cause a runtime failure, for example if two instances of a singleton get initialized.

Let's launch Lockfile Explorer and inspect it:

```
cd lockfile-explorer-demos

lockfile-explorer
```

The app window will look something like this:

<img src="/images/docs/demo-sbs-3-lfx.png" alt="Step 3 app screenshot" />

_Lockfile Explorer view of demos/sbs-3 branch_

On the left pane, you can see the two entries for `P@2.0.3` and `P@1.2.3`. And the **Direct Referrers**
pane helps us to trace backwards to understand how these versions were introduced.

> The examples on this page all rely on inconsistent version ranges in **package.json** files.
> Rush provides a strict setting [ensureConsistentVersions](../concepts/strict_settings.md#ensureconsistentversions)
> specifically designed to avoid these inconsistencies. In these demo branches, that policy has been
> [disabled in rush.json](https://github.com/microsoft/lockfile-explorer-demos/blob/ce3d0b13baa36c1cd22baf141f7c7b66b252bcfc/rush.json#L71).
