---
title: Webpack plugins
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<!-- prettier-ignore-start -->
|     |     |
| --- | --- |
| **Plugin packages:** | [@rushstack/heft-webpack4-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-webpack4-plugin) <br/>  [@rushstack/heft-webpack5-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-webpack5-plugin) |
| **Plugin names:** | [webpack4-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-webpack4-plugin/heft-plugin.json) implemented by [Webpack4Plugin.ts](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-webpack4-plugin/src/Webpack4Plugin.ts) <br/> [webpack5-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-webpack5-plugin/heft-plugin.json) implemented by [Webpack5Plugin.ts](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-webpack5-plugin/src/Webpack5Plugin.ts) |
| **Plugin config file:** | (none) |
| **heft.json options:** | [IWebpackPluginOptions (Webpack 4)](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-webpack4-plugin/src/Webpack4Plugin.ts) <br/> [IWebpackPluginOptions (Webpack 5)](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-webpack5-plugin/src/Webpack5Plugin.ts) |
<!-- prettier-ignore-end -->

<!-- No we are not going to use branded capitalization like "webpack" or "npm". ;-) -->

This task invokes the [Webpack](https://webpack.js.org/) tool to produce application bundles. It provides features such as:

- Combining many small .js files into one large file for faster downloads
- Improving performance by applying various compiler optimizations such as inlining and dead code elimination ("tree shaking")
- Compressing and obfuscating code by shortening identifiers, using the [Terser](https://terser.org/) minifier by default
- Converting assets such as .css or even images into embedded JavaScript objects

Webpack also has the ability to act as a general purpose build system, for example by invoking a compiler or linter, however Heft does not use it that way. Heft invokes the TypeScript compiler to produce intermediate .js files which become the inputs for other tasks such as Jest or Webpack. This reduces the number of compiler passes, and avoids the need for compiler optimizations to be reimplemented multiple times for different contexts (`ts-loader`, `ts-jest`, etc).

> The [heft-webpack-basic-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-webpack-basic-tutorial) sample project illustrates a complete project using Webpack and React.

## When to use it

Webpack should be used for projects whose output is a web application bundle. Webpack can also be used to bundle Node.js tools or services, however this is less common.

> In these notes, we'll assume you're using Webpack 5. For Webpack 4, substitute
> `@rushstack/heft-webpack4-plugin` instead of `@rushstack/heft-webpack5-plugin` everywhere.
> Their usage is essentially identical.

## package.json dependencies

The simplest way to use Webpack is via
[@rushstack/heft-web-rig](https://github.com/microsoft/rushstack/tree/main/rigs/heft-web-rig),
which provides a standard configuration with a recommended set of plugins and loaders.

Otherwise, if you're not using a rig, you'll need to add the plugin package to your project:

<Tabs>
  <TabItem value="rush-install" label="Rush">

```bash
# If you are using Rush, run this shell command in your project folder:
rush add --package @rushstack/heft-webpack5-plugin --dev
```

  </TabItem>
  <TabItem value="npm-install" label="NPM">

```bash
# If you are using vanilla NPM, run this shell command in your project folder:
npm install @rushstack/heft-webpack5-plugin --save-dev
```

  </TabItem>
</Tabs>

The `@rushstack/heft-webpack5-plugin` package has a peer dependency on `webpack`. If you're not using a rig,
then you must add this dependency as well:

<Tabs>
  <TabItem value="rush-install" label="Rush">

```bash
# If you are using Rush, run this shell command in your project folder:
rush add --package webpack --dev
```

  </TabItem>
  <TabItem value="npm-install" label="NPM">

```bash
# If you are using vanilla NPM, run this shell command in your project folder:
npm install webpack --save-dev
```

  </TabItem>
</Tabs>

> **Important:** If you are using `@rushstack/heft-web-rig`, then the peer dependency is satisfied by the rig,
> so it's not strictly necessarily to add `webpack` to your project's **package.json** dependencies.
> However doing so can be useful, for example to satisfy peer dependencies of project-specific loaders.
> If you add it, make sure the same SemVer range is the same as the rig's
> [heft-web-rig/package.json](https://github.com/microsoft/rushstack/blob/main/rigs/heft-web-rig/package.json)
> to avoid inconsistencies.

You should also add `@types/webpack-env` to your project, which provides TypeScript typings for the Webpack environment:

<Tabs>
  <TabItem value="rush-install" label="Rush">

```bash
# If you are using Rush, run this shell command in your project folder:
rush add --package @types/webpack-env --exact  --dev

# Because @types packages don't follow SemVer, it's a good idea to use --exact
```

  </TabItem>
  <TabItem value="npm-install" label="NPM">

```bash
# If you are using vanilla NPM, run this shell command in your project folder:
npm install @types/webpack-env --save-dev --save-exact

# Because @types packages don't follow SemVer, it's a good idea to use --save-exact
```

  </TabItem>
</Tabs>

## Configuration

Since `@types/webpack-env` defines global APIs (that aren't accessed using regular `import` statements), it must
be be added to your TypeScript configuration like this:

**&lt;project folder&gt;/tsconfig.json**

```js
{
  "extends": "./node_modules/@rushstack/heft-web-rig/profiles/library/tsconfig-base.json",
  "compilerOptions": {
    "types": [
      "webpack-env" // <---- ADD THIS
    ]
  }
}
```

If Webpack is not already being provided by a rig, your [heft.json config file](../configs/heft_json.md) could invoke it
like in this example:

**&lt;project folder&gt;/config/heft.json**

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",

  "aliasesByName": {
    "start": {
      "actionName": "build-watch",
      "defaultParameters": ["--serve"]
    }
  },

  "phasesByName": {
    "build": {
      "cleanFiles": [
        { "sourcePath": "dist" },
        { "sourcePath": "lib" },
        { "sourcePath": "lib-amd" },
        { "sourcePath": "lib-commonjs" },
        { "sourcePath": "lib-es6" }
      ],
      "tasksByName": {
        "sass": {
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-sass-plugin"
          }
        },
        "typescript": {
          "taskDependencies": ["sass"],
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-typescript-plugin"
          }
        },
        "webpack": {
          "taskDependencies": ["typescript"],
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-webpack5-plugin"
          }
        }
        . . .
      }
    },
    . . .
  }
}
```

Next, create a **webpack.config.js** file in your project folder. Here is a rudimentary example:

**&lt;project folder&gt;/webpack.config.js**

```js
'use strict';

const path = require('path');

const webpackConfig = {
  mode: 'development',
  resolve: {
    // Note: Do not specify '.ts' or '.tsx' here.  Heft invokes Webpack as a post-process after the compiler.
    extensions: ['.js', '.jsx', '.json']
  },
  entry: {
    app: path.join(__dirname, 'lib', 'index.js')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]_[contenthash].js'
  }
};

module.exports = webpackConfig;
```

If you want to use a slightly different configuration when developing using the localhost dev server,
you can optionally create a second file called **webpack.dev.config.js**.

To start the localhost dev server, use the `heft start` command, which conventionally is defined as an alias
for `heft build-watch --serve` (see `aliasesByName` above). Whenever you save a change to a source file,
Heft's watch mode will recompile your project, then Webpack hot module reloading should refresh your
web browser with the latest build of the app.

### Interaction with Jest

Webpack works best with the `esnext` module format, whereas Jest must use the `commonjs` module format because
its tests are executed by the Node.js runtime. In order to use Webpack and Jest together, you will need
to emit both module formats. This is described in the [Jest plugin](../plugins/jest.md) section.

## CLI parameters

[heft-jest-plugin/heft-plugin.json](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-webpack5-plugin/heft-plugin.json) defines these parameters:

```
  --serve
                        Start a local web server for testing purposes using
                        webpack-dev-server. This parameter is only available
                        when running in watch mode.
```
