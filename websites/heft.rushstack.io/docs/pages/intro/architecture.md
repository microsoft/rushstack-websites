---
title: Heft architecture
---

## Read this first 🎈

Here's a quick summary of the most important concepts of Heft:

### Action

In Heft's terminology, an "action" is command-line verb, as formalized by Rush Stack's [ts-command-line](https://www.npmjs.com/package/@rushstack/ts-command-line) system. For example, with the shell command `heft test --clean` you are invoking the `test` action. Use `heft --help` to see the available actions. The `clean` and `run` actions are provided by Heft itself; the others are produced by your **heft.json** configuration.

> **Note:** Early releases of Heft also used the word "action" for `eventActions` in **heft.json**. This terminology is no longer used.

### Parameter

Actions support various command-line "parameters" for adjusting behavior. For example, with the shell command `heft test --clean` you are invoking the `--clean` parameter. Some parameters are defined by Heft itself; others are contributed by Heft plugins.

### Task

The "task" is the most fundamental operation of Heft. A task typically reads input files and/or generates output files by invoking some tool. For example, `typescript` and `eslint` are Heft tasks. Tasks cannot be invoked directly; instead, they are used to define phases.

### Phase

A "phase" is a plan for invoking Heft tasks, specified using a **heft.json** config file for your project. In that file, phases are given names such as `build` or `test`. Defining a phase creates two corresponding command-line actions. For example, the `test` phase produces a `heft test` and `heft test-watch` action (for interactive watch mode). The **heft.json** config file also specifies dependency ordering of tasks.

If tasks belong to the same phase, they can share memory objects for optimization; otherwise, they must only communicate by writing files to disk. This requirement supports integration with [Rush phases](https://rushjs.io/pages/maintainer/phased_builds/) which may run at different times or on different computers, communicating via the Rush build cache.

### Plugin

Heft plugins are TypeScript classes that implement the `IHeftPlugin` contract. There are two kinds of plugins:

- a **task plugin** defines one task
- a **lifecycle plugin** provides general functionality across tasks, for example to collect timing metrics

### Plugin package

A "plugin package" is an NPM package containing Heft plugins. The NPM package naming pattern is `heft-____-plugin` or `heft-____-plugins` (according to the number of plugins). **Built-in plugins** are loaded directly from the `@rushstack/heft` package.

See [Core Plugins](../intro/core_plugins.md) for a list of official plugins.

### Plugin manifest

Each plugin package includes a file **heft-plug.json** which is called the "plugin manifest." It describes the available plugins, their options, and their command-line parameters. Heft is data-driven, which means that such information can be discovered without executing any custom scripts. (Although scripted configuration is very popular, it has many problems such as unexpected performance costs, unpredictable behavior that hinders caching, and poor error messages.)

### Hook

Heft plugins can register handlers for various events during the build lifecycle. The API terminology of "tapping" event "hooks" comes from Heft's usage of the [tapable](https://www.npmjs.com/package/tapable) system, familiar from Webpack plugins.

### Rig package

The main philosophy of Heft is to move build logic into plugin packages, so that your build process is defined by config files instead of program scripts. In a large monorepo, this greatly reduces maintenance costs, by ensuring that program scripts are developed as professional software and not ad hoc commands in a `.js` file.

The Rush Stack [rig system](./rig_packages.md) goes a step further, optionally moving config files into a centralized NPM package called a "rig." Rigs define the standardized configurations for your monorepo. Heft also allows `devDependencies` to be resolved from rig packages, reducing **package.json** clutter.

### Rig profile

A single rig package can provide multiple "profiles" which are just different sets of config files. Rig profiles share the same rigged `devDependencies`, and may also share configuration via `"extends"` inheritance.
