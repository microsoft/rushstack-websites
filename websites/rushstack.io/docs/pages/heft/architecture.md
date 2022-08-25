---
title: Heft architecture
---

## Terminology

The following concepts are important for understanding Heft's design:

- **action** - a Heft command-line verb (as formalized by Rush Stack's [ts-command-line](https://www.npmjs.com/package/@rushstack/ts-command-line) system). For example, the "test" action appears in the `heft test --clean` command. Actions are the user interface, essentially macros tailored for typical developer activities.
- **plugin** - a TypeScript class that implements the `IHeftPlugin` contract to provide arbitrary functionality. Plugins are loaded optionally based on Heft's configuration.
- **plugin package** - an NPM package that provides one or more Heft plugins. You can create your own NPM package that exports custom plugins for Heft to use. See [Core Plugins](../heft/core_plugins.md) for a list of the built-in plugins.
- **hook** - Heft leverages Webpack's [tapable](https://www.npmjs.com/package/tapable) system for enabling plugins to register handlers for various events during the build.
- **task** - a conceptual Heft operation that produces an output, typically by invoking some tool. For example, `typescript` and `eslint` are Heft tasks. Unlike in other systems, Heft's tasks are not a formal coding contract or component; for example the `TypeScriptPlugin` object implements three separate tasks (`typescript`, `eslint`, and `tslint`) whose code is closely integrated.
- **stage** - a larger sequence of work encompassing multiple Heft tasks. When invoking Heft, the command line typically selects a meaningful set of stages to run. The stage names are also used to group logging output. Examples of Heft stages: "clean", "build", "test"
- **rig package** - an NPM package that provides Heft configurations that can be reused across multiple projects with similar requirements See the [@rushstack/rig-package](https://www.npmjs.com/package/@rushstack/rig-package) documentation for details about this system.
- **rig profile** - a named configuration obtained from a rig package. A single rig package can provide more than one configuration. For example, it might provide separate profiles for application projects versus library projects.

&nbsp;

> **Future plans:** Today Rush commands can only invoke Heft actions. However, in the future we want to implement a "multiphase build" feature that will enable Rush to orchestrate more granular steps of work. For example, once a library dependency has compiled its output, Rush could start building the application before the library finishes running its unit tests. This feature will bring some additional jargon:
>
> - **command** - A monorepo command-line action as defined globally in [command-line.json](@rushjs/pages/configs/command-line_json/).
> - **phase** - This is similar to Heft's "stage", except that phases will be defined globally so that Rush can model their dependency relationships.
