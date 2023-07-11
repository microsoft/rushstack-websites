---
title: Interfacing with Rush
---

The [Hello World](../tutorials/hello_world.md) tutorial showed how Heft can be used in a standalone project. Now let's look at how Heft works in the context of a Rush monorepo.

## How Heft gets invoked

If you're new to Rush, the [maintainer tutorials](@rushjs/pages/maintainer/setup_new_repo/) explain the basics of setting up a new repo. Heft takes over when Rush invokes the `"build"` script in a Rush project folder. In our sample project from the tutorial, the script looked like this:

**&lt;project folder&gt;/package.json**

```
{
  . . .
  "scripts": {
    "build": "heft build --clean",
    "start": "node lib/start.js"
  }
  . . .
}
```

## Sharing configuration using rig packages

A major theme in monorepos will be _**minimizing "boilerplate" files**_. In other words, consolidating files and settings that would otherwise get copy+pasted into every single project folder in the monorepo. Boilerplate is a nuisance because it's difficult to keep in sync. When a fix is needed, if you have hundreds of projects, you would need to reapply the same fix hundreds of times. (Even worse, if engineers have been allowed to customize their projects differently, the you might need to apply hundreds of _different_ fixes, which is a very high maintenance cost.)

At the same time, we want to honor Rush's _**principle of project isolation**_: Each project should build independently and should not become entangled with other projects (for example, by referencing files using relative paths like `../../other-project`). This discipline facilitates Rush features like subset builds and incremental builds. It also makes it very easy to move Rush project folders around, to migrate projects between monorepos, and even to stop using Rush later if you change your mind. For this reason, we discourage practices such as putting a centralized **.eslintrc.js** file in the root of the monorepo and invoking ESLint globally for all projects.

Combining these goals, Heft supports a formalism called **rig packages**, where common settings are provided by an NPM package that is added to each project's `devDependencies`. Rig packages offer three different ways to reduce duplication:

1. Config files can use a setting such as `"extends"` to inherit common settings from a rig. Example: **tsconfig.json**
2. Riggable config files can be eliminated entirely, using a **config/rig.json** file that directs Heft to find them in the rig package. Example: **config/heft.json**
3. Riggable dependencies can be provided by the rig package, avoiding the need to add them to your project's `devDependencies`. Example: the **typescript** package

The [Using rig packages](../intro/rig_packages.md) article describes this in detail.

## Incremental builds

Another benefit of using Rush with Heft is support for incremental builds. For example, if you run `rush build` twice, the second time it will complete instantly, since all projects have already been built. Interestingly, this incremental build analysis is performed by Rush itself, not Heft.

Since JavaScript is an interpreted language, there is a small overhead every time a Node.js process is launched in a project folder. Thus even if Heft performs no work at all, it might take 1 second simply to spin up the toolchain, analyze the input files, and determine that everything is up to date. For a monorepo with 500 projects, that adds up to 500 seconds of analysis. Rush avoids this by performing a global analysis of all projects, comparing the hash of your source files against a hash of the output files. If these hashes are the same, then Rush can determine that a project can be skipped entirely without even launching Heft. Rush's incremental build analysis works for any well-behaved script, not just Heft.

## Using Heft phases to implement Rush phases

Rush's incremental build can be made more granular using [Rush phases](https://rushjs.io/pages/maintainer/phased_builds/).
Heft phases are specifically designed to align with this model.

Here's an excerpt from the [node-core-library/package.json](https://github.com/microsoft/rushstack/blob/main/libraries/node-core-library/package.json) in the Rush Stack monorepo on GitHub:

```js
  "scripts": {
    "build": "heft build --clean",
    "test": "heft test --clean",
    "_phase:build": "heft run --only build -- --clean",
    "_phase:test": "heft run --only test -- --clean"
  },
```

The `"test"` command invokes `heft test` which will perform both `build` and `test` phases, whereas the
`"_phase:test"` command performs only the `test` phase. This works because
[config/rush/command-line.json](https://github.com/microsoft/rushstack/blob/main/common/config/rush/command-line.json)
models our phase dependencies, so Rush itself will ensure that the `build` phase has run before performing `test`.
By exposing these details to Rush, Heft's phases can be optimized using Rush's build cache and even participate
in distributed builds using the Cobuild feature.
