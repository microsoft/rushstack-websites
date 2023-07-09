---
title: Heft architecture
---

## Read this first 🎈

Here's a quick summary of the most important concepts of Heft:

### Action

In Heft's terminology, an "action" is command-line verb, as formalized by Rush Stack's [ts-command-line](https://www.npmjs.com/package/@rushstack/ts-command-line) system. Use `heft --help` to see the available actions. The `clean` and `run` actions are provided by Heft itself; the others are produced by your **heft.json** configuration.

**Example:** A shell command `heft test --clean` is invoking the `test` action.

> **Note:** Early releases of Heft also used the word "action" for `eventActions` in **heft.json**. This terminology is no longer used.

### Parameter

Actions support various command-line "parameters" for adjusting behavior. Some parameters are defined by Heft itself; others are contributed by Heft plugins.

**Example:** A shell command `heft test --clean` is using the `--clean` parameter.

### Task

Heft "tasks" are defined in the `tasksByName` section of a **heft.json** config file for your project. Tasks typically read input files and/or generate output files, often by invoking a familiar tool such as TypeScript or ESLint. Each task loads a Heft task plugin (see below). It's possible for two different tasks to load the same plugin. Tasks can depend on each other, which determines scheduling order.

**Example:** The `@rushstack/heft-web-rig` configuration [defines](https://github.com/microsoft/rushstack/blob/9ffb14519dd42e5808e56bc2ea80c8734f5f2e5b/rigs/heft-web-rig/profiles/app/config/heft.json#L53) a task called `webpack`.

### Phase

A "phase" is an arrangement of Heft tasks, defined in the `phasesByName` section of a **heft.json** config file for your project. In that file, phases are given names such as `build` or `test`. Defining a phase creates two corresponding command-line actions. For example, the `test` phase produces a `heft test` and `heft test-watch` action. The `-watch` variant is for interactive watch mode, for example a localhost dev server.

If tasks belong to the same phase, they can share memory objects for optimization; otherwise, they must only communicate by writing files to disk. This requirement supports integration with [Rush phases](https://rushjs.io/pages/maintainer/phased_builds/) which may run at different times or on different computers, communicating via the Rush build cache.

**Example:** The `@rushstack/heft-web-rig` configuration [defines](https://github.com/microsoft/rushstack/blob/9ffb14519dd42e5808e56bc2ea80c8734f5f2e5b/rigs/heft-web-rig/profiles/app/config/heft.json#L21) a `build` phase that incorporates a `webpack` task.

### Plugin

Heft plugins are TypeScript classes that implement the `IHeftPlugin` contract. There are two kinds of plugins:

- a **task plugin** can be loaded by **heft.json** tasks and provides their implementation
- a **lifecycle plugin** provides general functionality that is not specific to any task; for example, to collect timing metrics

### Plugin package

A "plugin package" is an NPM package providing Heft plugins. The NPM package naming pattern is `heft-____-plugin` or `heft-____-plugins` (according to the number of plugins). **Built-in plugins** are loaded directly from the `@rushstack/heft` package.

See the [Plugin package index](../plugins/package_index.md) for the list of official plugins.

**Example:** The `@rushstack/heft-jest-plugin` package implements [jest-plugin](https://github.com/microsoft/rushstack/blob/9ffb14519dd42e5808e56bc2ea80c8734f5f2e5b/heft-plugins/heft-jest-plugin/src/JestPlugin.ts#L144).

### Plugin manifest

Each plugin package includes a file **heft-plug.json** which is called the "plugin manifest." It describes the available plugins, their options, and their command-line parameters. Heft is data-driven, which means that such information can be discovered without executing any custom scripts. (Although scripted configuration is very popular, it has many problems such as unexpected performance costs, unpredictable behavior that hinders caching, and poor error messages.)

**Example:** The `@rushstack/heft-jest-plugin` package declares `jest-plugin` in [this manifest](https://github.com/microsoft/rushstack/blob/9ffb14519dd42e5808e56bc2ea80c8734f5f2e5b/heft-plugins/heft-jest-plugin/heft-plugin.json).

### Hook

Heft plugins can register handlers for various events during the build lifecycle. The API terminology of "tapping" event "hooks" comes from Heft's usage of the [tapable](https://www.npmjs.com/package/tapable) system, familiar from Webpack plugins.

**Example:** In Heft's source code, the [IHeftTaskHooks](https://github.com/microsoft/rushstack/blob/9ffb14519dd42e5808e56bc2ea80c8734f5f2e5b/apps/heft/src/pluginFramework/HeftTaskSession.ts#L135) interface exposes some hooks.

### Rig package

The main philosophy of Heft is to move build logic into plugin packages, so that your build process is defined by config files instead of program scripts. In a large monorepo, this greatly reduces maintenance costs, by ensuring that program scripts are developed as professional software and not ad hoc commands in a `.js` file.

The Rush Stack [rig system](./rig_packages.md) goes a step further, optionally moving config files into a centralized NPM package called a "rig." Rigs define standardized configurations for your projects. In a large monorepo, they formalize the configurations that your build team has agreed to support. Heft also allows `devDependencies` to be resolved from rig packages, reducing **package.json** clutter.

**Example:** [@rushstack/heft-web-rig](https://www.npmjs.com/package/@rushstack/heft-web-rig) is Rush Stack's reference rig for web projects.

### Rig profile

A single rig package can provide multiple "profiles" tailored for specific purposes. Profiles within a rig package share the same rigged `devDependencies`, and may also share configuration via `"extends"` inheritance.

**Example:** The `@rushstack/heft-web-rig` rig package currently defines [two profiles](https://github.com/microsoft/rushstack/tree/main/rigs/heft-web-rig/profiles), `app` and `library`.
