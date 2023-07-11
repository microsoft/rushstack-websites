---
title: Storybook plugin
---

<!-- prettier-ignore-start -->
|     |     |
| --- | --- |
| **Plugin package:** | [@rushstack/heft-storybook-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-storybook-plugin) |
| **Plugin name:** | [storybook-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-storybook-plugin/heft-plugin.json) implemented by [StorybookPlugin.ts](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-storybook-plugin/src/StorybookPlugin.ts) |
| **Plugin config file:** | (none) |
| **heft.json options:** | [IStorybookPluginOptions](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-storybook-plugin/src/StorybookPlugin.ts) |
<!-- prettier-ignore-end -->

This is a Heft plugin for using the [Storybook](https://storybook.js.org/) framework.

## When to use it

If you've chosen Storybook as your approach for developing, testing, and documenting UI components.

> **Note:** This plugin was originally developed for Storybook 6. If you're trying to set it up with a newer
> version, please see
> [this Zulip thread](https://rushstack.zulipchat.com/#narrow/stream/262522-heft/topic/Storybook.20v7/near/361429415)
> for workarounds and ongoing work to improve the plugin.

## How it works

The basic approach is for Heft to perform TypeScript compilation in the normal way, producing `lib/**/*.js` files
which become the inputs to the Storybook toolchain. The Heft plugin locates the Storybook startup module
(e.g. `@storybook/react`) and invokes the Storybook toolchain in-process. Since Storybook's toolchain implements
its own Webpack dev server, when the `--storybook` parameter is provided, Heft's own Webpack plugin will be
suppressed to avoid launching two dev servers.

## The "storykit" package

The Storybook gallery is a full complex web application that gets built by the Storybook toolchain.
This toolchain brings along a lot of its own NPM dependencies, but since it's also trying to compile
your project's source code, it tries to discover and use your project's `devDependencies` such as React,
Webpack, and associated loaders. In practice, it is fairly awkward to for a single `node_modules` folder to mix
together all of the dependencies of a professional toolchain like Heft with with all the dependencies of Storybook's
toolchain and plugins.

To solve this problem, `storybook-plugin` introduces a model where you create a second NPM package
called **storykit**, whose **package.json** provides all the tooling dependencies for Storybook.
In this way, dependencies of the two toolchains are cleanly separated, and you can reuse your Storybook
setup easily across different app projects, similar to a rig.

Storybook's browser API unfortunately isn't separated into dedicated NPM packages, but instead is exported by
the Node.js toolchain packages such as `@storybook/react`. For an even cleaner separation, your storykit package
can simply reexport such APIs.

## Configuration

The [heft-storybook-react-tutorial]https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-storybook-react-tutorial)
sample folder illustrates a complete project setup.

## heft.json plugin options

This commented template documents the available options for Heft's `storybook-plugin`:

```ts
// OPTIONS FOR storybook-plugin
"options": {
  /**
   * (REQUIRED) Specifies an NPM package that will provide the Storybook dependencies for the project.
   *
   * Storybook's conventional approach is for your app project to have direct dependencies
   * on NPM packages such as `@storybook/react` and `@storybook/addon-essentials`.  These packages have
   * heavyweight dependencies such as Babel, Webpack, and the associated loaders and plugins needed to
   * build the Storybook app (which is bundled completely independently from Heft).  Naively adding these
   * dependencies to your app's package.json muddies the waters of two radically different toolchains,
   * and is likely to lead to dependency conflicts, for example if Heft installs Webpack 5 but
   * `@storybook/react` installs Webpack 4.
   *
   * To solve this problem, `heft-storybook-plugin` introduces the concept of a separate
   * "storykit package".  All of your Storybook NPM packages are moved to be dependencies of the
   * storykit.  Storybook's browser API unfortunately isn't separated into dedicated NPM packages,
   * but instead is exported by the Node.js toolchain packages such as `@storybook/react`.  For
   * an even cleaner separation the storykit package can simply reexport such APIs.
   */
  "storykitPackageName": "@my-corp/my-react-storykit",

  /**
   * The module entry point that Heft serve mode should use to launch the Storybook toolchain.
   * Typically it is the path loaded the `start-storybook` shell script.
   *
   * If you are using `@storybook/react`, then the startup path would be:
   *
   * "startupModulePath": "@storybook/react/bin/index.js"
   */
  // "startupModulePath": "",

  /**
   * The module entry point that Heft non-serve mode should use to launch the Storybook toolchain.
   * Typically it is the path loaded the `build-storybook` shell script.
   *
   * If you are using `@storybook/react`, then the static build path would be:
   *
   * "staticBuildModulePath": "@storybook/react/bin/build.js"
   */
  // "staticBuildModulePath": "",

  /**
   * The customized output directory for a Storybook static build.
   * If this setting is not specified, then the Storybook default output directory will be used.
   */
  // "staticBuildOutputFolder": "example/path"
}
```

## CLI parameters

[heft-storybook-plugin/heft-plugin.json](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-storybook-plugin/heft-plugin.json) defines these parameters:

```
  --storybook
                        Used by the "@rushstack/heft-storybook-plugin" package to launch
                        Storybook.
```
