---
title: The PNPM lockfile
---

The previous sections covered the basics of version conflicts, SemVer, and installation models.
We're now ready to examine the package lockfile in detail. In a nutshell, it stores an
**installation plan** for how the `node_modules` folder should get installed, according to the
[installation model](./install_models.md) in use. From now on, we'll assume that it's the
PNPM installation model, and so the filename is `pnpm-lock.yaml`.

## Why do we need a lockfile?

Suppose hypothetically that we did not have a `pnpm-lock.yaml` file stored in Git, and suppose also that
`my-app/package.json` has a dependency on `"react": "^18.0.0"`. Let's say today is May 1st, and the latest release
from the 18 series is `react@18.1.0`. Without a lockfile, that is what PNPM would choose to install.
Latest is greatest, right? Well, consider a few hypothetical scenarios:

1. **Ability to reproduce an error.** Some time passes, and it's now June 15th. When you install `my-app`,
   the latest version is now `react@18.2.0`. Suppose the app malfunctions because of a change introduced in
   that version. But when you ask a teammate for help, they don't know what you're talking about. _"Everything
   runs fine on my computer!"_ The reason is that their `node_modules` folder still has the old `react@18.1.0`.

2. **Building old branches.** To investigate, you remember that the project worked successfully a week ago,
   so you decide to try checking out older versions of the Git branch. By pinpointing the commit that
   broke things, maybe you can compare the diff to find the change that broke things. However because there is
   no lockfile, those old branches are all now failing as well, because `react@18.2.0` is getting installed
   instead of `react@18.1.0`.

3. **Deterministic releases.** But that means... The next time we deploy to production, it's going to
   include `react@18.2.0` and cause a customer incident. Uh oh! Essentially, we're deploying something
   different from what we tested. How can we pin the version back to `react@18.1.0` for a given branch?

A naive solution would be to change `"react": "^18.0.0"` to `"react": "18.1.0"` in `my-app/package.json`,
however this only affects direct dependencies of your project. A typical `node_modules` folder may contain
thousands of NPM packages, most of which are dependencies-of-dependencies, whose version range is determined
by an external `package.json` file.

## What does a lockfile store?

The package lockfile is the ideal solution to the above problem: It records the exact version number of every
single package in your `node_modules` folder, along with topological information such as peer dependency
relationships. This enables the package manager to reproduce the exact same `node_modules` folder structure
regardless of whatever the "latest" versions might be on that day. The `pnpm-lock.yaml` file is serialized as
human-readable text, in a format whose diff minimizes Git merge conflicts as much as possible. The file format
also carefully avoids storing extra information that might not be portable between operating systems
or NPM registry configurations.

## How is a lockfile created?

<div className="markdown-table-nowrap-col-1-and-2">

<!-- prettier-ignore-start -->
| PNPM command | Rush command | What it does |
| --- | --- | --- |
| `pnpm update` | `rush update --full` | Rebuilds `pnpm-lock.yaml` file from scratch, choosing the latest versions that satisfy each version range specified in **package.json** files. |
| `pnpm install`<br/>with `--no-frozen-lockfile` | `rush update` | Checks whether the existing lockfile is consistent with your version ranges. If not, a minimal update is performed, preserving as much as possible from the previous lockfile. |
| `pnpm install`<br/>with `--frozen-lockfile` | `rush install` | Checks whether the existing lockfile is consistent with your version ranges. If not, Rush fails with an error message telling you  to run `rush update`. |
| `pnpm install` | | Uses a heuristic to detect whether the command seems to be running in a CI environment.  If yes, the behavior is like `rush install`. Otherwise, the behavior is like `rush update`. |
<!-- prettier-ignore-end -->

</div>

With Rush, the lockfile is stored in `common/config/rush/pnpm-lockfile.yaml`. During installation, it gets
copied to `common/temp/` where the workspace installation occurs.

If you're using a PNPM workspace without Rush, then `pnpm-lockfile.yaml` is instead stored in your repository's
root folder, next to your `pnpm-workspace.yaml` file.

> **Two different meanings of "lockfile"**
>
> In classic computing, the word ["lock file"](https://en.wikipedia.org/wiki/File_locking#Lock_files)
> has always referred to a file that coordinates a multi-process concurrency mechanism such as a mutex.
> The `@rushstack/node-core-library` [LockFile class](https://api.rushstack.io/pages/node-core-library.lockfile/)
> implements such a mechanism.
>
> When NPM was first introduced, its serialized installation plan was called a "shrinkwrap file",
> `npm-shrinkwrap.json` and `shrinkwrap.yaml`, and Rush still uses this terminology in many places.
> Yarn called its file `yarn.lock`, adopting a similar naming convention as Ruby's `Gemfile.lock`,
> which people had started calling "lockfiles". For consistency, PNPM and NPM later switched to using
> "lockfile" instead of "shrinkwrap file".
>
> When the context is unclear, our documentation will sometimes use the term **package lockfile**
> to avoid any confusion with concurrency lockfiles.

## Overall file structure

Let's continue with the
[demo/sample-1](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/sample-1)
branch from the [lockfile-explorer-demos](https://github.com/microsoft/lockfile-explorer-demos/)
demo repo, which we already saw in the [Tracing package resolution](./tracing_resolution.md) section.

Recall that the `demo/sample-1` lockfile looks like this:

<img src='https://raw.githubusercontent.com/microsoft/lockfile-explorer-demos/demo/sample-1/common/images/lfx-demo-sample-1.svg' alt="dependency graph: demo/sample-1" />

Let's examine the corresponding YAML file. Using `...` to fold the YAML subtrees, the top-level file structure
looks like this:

[lockfile-explorer-demos/common/config/rush/pnpm-lock.yaml](https://github.com/microsoft/lockfile-explorer-demos/blob/demo/sample-1/common/config/rush/pnpm-lock.yaml) (`demo/sample-1` branch)

```yaml
lockfileVersion: 5.4

importers:
  .: ...
  ../../projects/a: ...
  ../../projects/b: ...
  ../../projects/c: ...
  ../../projects/d: ...
  ../../projects/e: ...

packages:
  /@rushstack/j/1.0.0_@rushstack+n@2.0.0: ...
  /@rushstack/k/1.0.0_@rushstack+m@1.0.0: ...
  /@rushstack/k/1.0.0_wxpgugna4ivthu7yyu4fmciltu: ...
  /@rushstack/l/1.0.0_@rushstack+m@1.0.0: ...
  /@rushstack/l/1.0.0_wxpgugna4ivthu7yyu4fmciltu: ...
  /@rushstack/m/1.0.0: ...
  /@rushstack/n/2.0.0: ...
  /@rushstack/n/3.0.0: ...
```

Comparing with the diagram, the `importers` section represents our local projects in the workspace.
The `packages` section represents the external NPM packages downloaded from the NPM registry.

The YAML key for local projects is their file path, relative to the folder of `common/temp/pnpm-workspace.yaml`,
which Rush generates from its project inventory in **rush.json**. The empty `.:` key corresponds to the
root `common/temp/package.json` which is generated by Rush.

The YAML key for external packages appears to be a combination of the package name and version. For
example, `@rushstack/n` version `3.0.0` becomes `/@rushstack/n/3.0.0`.

But what are these strange entries with `_` suffixes? The answer is that they are **peer doppelgangers**
-- multiple installs of the same version of the same package. Although the
[PNPM installation model](./install_models.md) eliminates NPM doppelgangers, it still needs to create
doppelgangers in the case of a peer dependency. For example, in the diagram we can see that `@rushstack/k`
version `1.0.0` needs to be installed in two separate folder locations:

- `/@rushstack/k/1.0.0_@rushstack+m@1.0.0` provides `K@1` with peer `M@1`, installed into:<br/>
  `.pnpm/@rushstack+k@1.0.0_@rushstack+m@1.0.0/node_modules/@rushstack/k`

- `/@rushstack/k/1.0.0_wxpgugna4ivthu7yyu4fmciltu` provides `K@1` with both peer `M@1` and `N@2`, installed into:<br/>
  `.pnpm/@rushstack+k@1.0.0_wxpgugna4ivthu7yyu4fmciltu/node_modules/@rushstack/k>`

The `.pnpm` disk folder can be found under `common/temp/node_modules/`, and PNPM's various symlinks will ultimately
point into paths under this folder. The exact disk paths are implementation details and therefore not captured in
the lockfile; to observe them, you need to run `rush install` and then inspect the resulting `common/temp` folder.

The `_@rushstack+m@1.0.0` suffix is really just an informational label to improve readability for humans.
In cases where the generated label would be too long, PNPM falls back to using a hashed string such
as `_wxpgugna4ivthu7yyu4fmciltu`.

## Lockfile "entries"

Lockfile Explorer refers to the `importers:` and `packages:` items as **lockfile entries**. It's important
to understand that "entries" don't correspond to package versions, but rather **_folders on disk_** where
a package version got installed: A single package version may produce multiple lockfile entries,
in the case of doppelgangers.

The Lockfile Explorer UI displays `importers:` on the "Projects" tab. The `packages:` are displayed the "Packages" tab.

👉 Now's a good time to run `lockfile-explorer` in your `demo/sample-1` checkout workspace, to see how
these lockfile entries appear in the UI.

## A package entry

Here's an example entry from the `packages:` section, describing an install of `@rushstack/l` version `1.0.0`:

```yaml
/@rushstack/l/1.0.0_wxpgugna4ivthu7yyu4fmciltu:
  resolution:
    {
      integrity: sha512-j9Pr82osu3t22rasnYg2pp/wMjMtg7KXu3WY59onaxHht/E8TgKqTWj4Mas2q+dF2xxs/vho9PdYKRlaXDzkhA==
    }
  peerDependencies:
    '@rushstack/m': ^1.0.0
    '@rushstack/n': ^2.0.0
  peerDependenciesMeta:
    '@rushstack/n':
      optional: true
  dependencies:
    '@rushstack/m': 1.0.0
    '@rushstack/n': 2.0.0
  dev: false
```

We can see several fields:

- `resolution:` has a tarball hash, used in the case where an NPM registry allowed a package to be republished with
  different content (a deprecated practice)
- `dependencies:` lists the `dependencies` of this package, and the exact lockfile entry that was chosen
  to match their version range.
- The `dependencies:` field actually combines both regular and `devDependencies`, because the installation
  plan doesn't care /why/ something is a dependency; it ultimately needs to be installed or not
- `dev:` will be `true` if this package was only ever referenced via `devDependencies`. It is used by
  PNPM's [--dev parameter](https://pnpm.io/cli/install#--dev--d).
- `peerDependencies:` tracks the peer dependencies specially, since managing them is one of the most complex
  aspects of the PNPM algorithm.
- `peerDependenciesMeta:` tracks whether they are optional or not

## A project entry

Perhaps surprisingly, the `importers:` section for local projects has a somewhat different structure,
even though both are described by the same **package.json** input format. Let's see if we can explain why:

```yaml
../../projects/c:
  specifiers:
    '@rushstack/e': workspace:*
    '@rushstack/k': ^1.0.0
    '@rushstack/m': ~1.0.0
  dependencies:
    '@rushstack/e': link:../e
    '@rushstack/k': 1.0.0_@rushstack+m@1.0.0
    '@rushstack/m': 1.0.0
```

- `specifiers:` remembers the original SemVer ranges from **package.json**. Because this package was not
  published to an NPM registry, its **package.json** file can be manually modified at any time, so the
  lockfile needs to detect such changes. In other words, the lockfile needs to capture more details about
  local projects, because they are mutable whereas published packages are (mostly) immutable.

- `dependencies:` tracks the dependencies in the same way as the `packages:` section.
  The `link:../e` string describes a dependency that will be symlinked to a local project folder,
  for example due to a `workspace:*` specifier in **package.json**.

- Note that `peerDependencies` never appears in this section. The reason is that PNPM does not properly
  install peer dependencies for local projects. Why? Well, as we've seen, peer dependencies are installed
  by creating peer doppelganger folders -- multiple copies of the package folder. But for a local project
  that is built from source code, how would that work? Whenever you recompile the code, there would need
  to be some mechanism that copies the output into the various doppelganger folders under `node_modules`.
  In practice it doesn't cause much trouble, but nonetheless it's a somewhat important limitation to understand,
  as it explains some weirdness with peer dependencies for local projects.
  See [PNPM#4407](https://github.com/pnpm/pnpm/issues/4407#issuecomment-1125470213)
  for our current thinking about it.

## Lockfile entry identifiers

Looking at the above snippets, you may notice that the `dependencies:` section uses a different
entry identifier syntax than the YAML keys. For example:

- `../../projects/e` from `importers:` gets referenced as `../e`. The path is relative to `projects/c` instead
  of relative to `common/temp/pnpm-workspace.yaml`.
- `/@rushstack/k/1.0.0_@rushstack+m@1.0.0` from `packages:` gets referenced as
  `'@rushstack/k': 1.0.0_@rushstack+m@1.0.0`.

The `dependencies:` uses a shortened form of the lockfile entry identifier, probably because it yields
significant file compression for the YAML file, and maybe is a little easier to read. However this inconsistency
makes it somewhat difficult to traverse the dependency graph by searching for strings in your text editor.
This was one of the major motivations for creating the Lockfile Explorer app.
