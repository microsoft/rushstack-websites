---
title: Injected dependencies
---

Injected dependencies are a PNPM feature allowing local project folders to be installed as if they were published to an NPM registry.

## Background: Conventional workspace symlinking

Rush projects typically use the `workspace:` specifier to depend on other projects within the monorepo workspace. For example, suppose `my-project` and `my-library` are projects in the Rush workspace:

**my-repo/apps/my-project/package.json**

```json
{
  "name": "my-project",
  "version": "1.2.3",
  "dependencies": {
    "react": "^18.3.1",
    "my-library": "workspace:*"
  }
}
```

In the above example, the `react` package will installed by downloading from the NPM registry and extracting into a `node_modules` subfolder. By contrast, the `workspace:*` specifier causes PNPM to create a `node_modules` symlink pointing to the source code folder where `my-library` is developed:

**Symlink:** `my-repo/apps/my-project/node_modules/my-library` --> `my-repo/libraries/my-library/`

In this way, `my-project` will always consume the latest locally built outputs for `my-library`. It may even be the case that `my-project` and `my-library` are never published to an NPM registry at all.

## Limitations of workspace symlinking

Suppose however that `my-library` declares a peer dependency like this:

**my-repo/libraries/my-library/package.json**

```json
{
  "name": "my-library",
  "version": "0.0.0",
  "peerDependencies": {
    "react": "^18.0.0 || ^17.0.0"
  },
  "devDependencies": {
    "react": "17.0.0"
  }
}
```

The `my-library` project declares that it can use both React version 17 and 18. For local development, the `devDependencies` install the oldest supported version 17.0.0, a common practice to validate backwards compatibility.

Why do we need `peerDependencies` instead of `dependencies`? With `dependencies`, the package manager would be free to choose any version of `react` matching `"^18.0.0 || ^17.0.0"`. For example, if our app is using React 17, then `my-library` could get React 18, which is wrong. The peer dependency avoids this possibility by stipulating that `my-library` must get the same `react` version as its consumer (and in fact the same installed disk folder).

What if two different apps depend on `my-library`, and those apps have different versions of `react`? For external NPM packages, PNPM would normally solve this by installing two copies of (the same version of) `my-library` into two different subfolders of `node_modules`. These copies are called **"peer dependency doppelgangers".** They are needed because of a design constraint of the Node.js module resolvers:

> _**Context-free resolution:** When a given file imports an NPM package, the module resolver will always resolve the same way for every importer of the file._

In other words, the only way to cause `my-library` to import React 17 for `app1` while importing React 18 for `app2` is for the two apps to import from two different `my-library` folders on disk (doppelgangers).

The package manager creates doppelgangers automatically as needed when extracting NPM packages into the `node_modules` folder. However, in our example, `my-project` uses `workspace:*` to create a symlink to the project folder for `my-library`, instead of extracting an NPM package into the `node_modules` folder. How will the peer dependency be satisfied? PNPM simply produces an incorrect installation in this situation:

- When `my-project` imports React, it will get version 18
- When `my-project` imports `my-library` and `my-library` imports React, it will get version 17 (as installed from the `devDependencies`)

The `peerDependencies` are ignored.

## Injected dependencies to the rescue

To solve this problem, PNPM supports [a package.json setting](https://pnpm.io/package_json#dependenciesmetainjected) called `injected` that will cause `my-library` to get installed as if it had been published to NPM. Here's how to enable it:

**my-repo/apps/my-project/package.json**

```json
{
  "name": "my-project",
  "version": "1.2.3",
  "dependencies": {
    "react": "^18.3.1",
    "my-library": "workspace:*"
  },
  "dependenciesMeta": {
    "my-library": {
      "injected": true
    }
  }
}
```

With this change, `pnpm install` (in our case `rush install` or `rush update`) will install `my-library` by copying the project contents into the `node_modules` folder of `my-project`. Because they are conventionally installed, injected dependencies can become doppelgangers and correctly satisfy peer dependencies.

Injected installation honors publishing filters such as `.npmignore`, and so the copied contents accurately reflect what would happen if `my-library` had been published to an NPM registry. For this reason, a test project that consumes a library can set `injected: true` to catch mistakes in `.npmignore` filters -- misconfigurations that are often missed when using `workspace:` symlinking.

Sounds great -- so why doesn't PNPM use injected install for all `workspace:` references?

## Syncing injected dependencies

We said that injected dependencies get copied into a `node_modules` folder during `rush install`. But what happens if we make changes to `my-library` and then run `rush build`? When `my-project` imports `my-library`, it will still find the old copy from `node_modules`. To get a correct result, we would need to redo `rush install` every time we rebuild `my-library`. More precisely, we would need to redo `rush install` _**after**_ building any injected project but _**before**_ the consumer gets built. In a worst case, that could mean redoing `rush install` hundreds of times during `rush build`. This is unrealistic.

PNPM currently doesn't yet include a built-in solution for this problem, and as a result injected dependencies have not yet gained wide adoption. However, a new tool called [pnpm-sync](https://github.com/tiktok/pnpm-sync) provides a solution: Whenever `my-library` is rebuilt, `pnpm-sync` will automatically copy its outputs to update the appropriate `node_modules` subfolders.

Normally it would be up to each project to determine whether and how to invoke the `pnpm-sync` command, but Rush integrates this feature and manages it automatically. To use `pnpm-sync` with Rush, enable the `usePnpmSyncForInjectedDependencies` experiment:

**common/config/rush/experiments.json**

```json
  /**
   * (UNDER DEVELOPMENT) For certain installation problems involving peer dependencies, PNPM cannot
   * correctly satisfy versioning requirements without installing duplicate copies of a package inside the
   * node_modules folder. This poses a problem for "workspace:*" dependencies, as they are normally
   * installed by making a symlink to the local project source folder. PNPM's "injected dependencies"
   * feature provides a model for copying the local project folder into node_modules, however copying
   * must occur AFTER the dependency project is built and BEFORE the consuming project starts to build.
   * The "pnpm-sync" tool manages this operation; see its documentation for details.
   * Enable this experiment if you want "rush" and "rushx" commands to resync injected dependencies
   * by invoking "pnpm-sync" during the build.
   */
  "usePnpmSyncForInjectedDependencies": true
```

This will enable the following behaviors:

- `rush install` and `rush update` will automatically invoke `pnpm-sync prepare` to configure copying of injected dependencies such as `my-library`

- `rush build` (and other Rush custom commands and phases) will automatically invoke `pnpm-sync copy` to resync the installed folders whenever a project like `my-library` is rebuilt

- `rushx` will automatically invoke `pnpm-sync copy` after any operation performed under the `my-library` folder

## Injected dependencies for subspaces

If you are using Rush subspaces, consider enabling `alwaysInjectDependenciesFromOtherSubspaces` as well:

**common/config/subspaces/&lt;subspace-name&gt;/pnpm-config.json**

```json
  /**
   * When a project uses `workspace:` to depend on another Rush project, PNPM normally installs
   * it by creating a symlink under `node_modules`.  This generally works well, but in certain
   * cases such as differing `peerDependencies` versions, symlinking may cause trouble
   * such as incorrectly satisfied versions.  For such cases, the dependency can be declared
   * as "injected", causing PNPM to copy its built output into `node_modules` like a real
   * install from a registry.  Details here: https://rushjs.io/pages/advanced/injected_deps/
   *
   * When using Rush subspaces, these sorts of versioning problems are much more likely if
   * `workspace:` refers to a project from a different subspace.  This is because the symlink
   * would point to a separate `node_modules` tree installed by a different PNPM lockfile.
   * A comprehensive solution is to enable `alwaysInjectDependenciesFromOtherSubspaces`,
   * which automatically treats all projects from other subspaces as injected dependencies
   * without having to manually configure them.
   *
   * NOTE: Use carefully -- excessive file copying can slow down the `rush install` and
   * `pnpm-sync` operations if too many dependencies become injected.
   *
   * The default value is false.
   */
  "alwaysInjectDependenciesFromOtherSubspaces": true
```

## See also

- [pnpm-sync](https://github.com/tiktok/pnpm-sync) GitHub project
- [dependenciesMeta.\*.injected](https://pnpm.io/package_json#dependenciesmetainjected) from PNPM documentation
- [Rush subspaces](../advanced/subspaces.md)
