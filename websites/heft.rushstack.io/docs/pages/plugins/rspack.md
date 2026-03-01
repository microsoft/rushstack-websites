---
title: Rspack plugin
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<!-- prettier-ignore-start -->
|     |     |
| --- | --- |
| **Plugin package:** | [@rushstack/heft-rspack-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-rspack-plugin) |
| **Plugin name:** | [rspack-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-rspack-plugin/heft-plugin.json) implemented by [RspackPlugin.ts](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-rspack-plugin/src/RspackPlugin.ts) |
| **Plugin config file:** | (none) |
| **heft.json options:** | [IRspackPluginOptions](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-rspack-plugin/src/RspackPlugin.ts) |
<!-- prettier-ignore-end -->

This task invokes [Rspack](https://rspack.dev/) to produce application bundles. Rspack is a high-performance
JavaScript bundler written in Rust that is designed to be largely compatible with the Webpack ecosystem. It
provides features such as:

- Combining many small .js files into one large file for faster downloads
- Improving performance by applying various compiler optimizations such as inlining and dead code elimination ("tree shaking")
- Compressing and obfuscating code by shortening identifiers, using built-in minification by default
- Converting assets such as .css or even images into embedded JavaScript objects
- Significantly faster build times compared to Webpack, thanks to its Rust-based implementation

Like the [Webpack plugin](./webpack.md), Heft invokes the TypeScript compiler to produce intermediate .js files
which become the inputs for the Rspack bundler. This reduces the number of compiler passes, and avoids the
need for compiler optimizations to be reimplemented multiple times for different contexts.

## When to use it

Rspack should be used for projects whose output is a web application bundle, particularly when build
performance is a priority. Because Rspack is designed to be compatible with most Webpack loaders and
plugins, it can often be adopted as a drop-in replacement for Webpack with minimal configuration changes.

Rspack can also be used to bundle Node.js tools or services, however this is less common.

## package.json dependencies

You'll need to add the plugin package to your project:

<Tabs>
  <TabItem value="rush-install" label="Rush">

```bash
# If you are using Rush, run this shell command in your project folder:
rush add --package @rushstack/heft-rspack-plugin --dev
```

  </TabItem>
  <TabItem value="npm-install" label="NPM">

```bash
# If you are using vanilla NPM, run this shell command in your project folder:
npm install @rushstack/heft-rspack-plugin --save-dev
```

  </TabItem>
</Tabs>

The `@rushstack/heft-rspack-plugin` package has a peer dependency on `@rspack/core`. You must add this
dependency as well:

<Tabs>
  <TabItem value="rush-install" label="Rush">

```bash
# If you are using Rush, run this shell command in your project folder:
rush add --package @rspack/core --dev
```

  </TabItem>
  <TabItem value="npm-install" label="NPM">

```bash
# If you are using vanilla NPM, run this shell command in your project folder:
npm install @rspack/core --save-dev
```

  </TabItem>
</Tabs>

## Configuration

Your [heft.json config file](../configs/heft_json.md) could invoke Rspack like in this example:

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
        { "sourcePath": "lib-commonjs" }
      ],
      "tasksByName": {
        "typescript": {
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-typescript-plugin"
          }
        },
        "rspack": {
          "taskDependencies": ["typescript"],
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-rspack-plugin"
          }
        }
      }
    }
  }
}
```

Next, create an **rspack.config.mjs** file in your project folder. Here is a rudimentary example:

**&lt;project folder&gt;/rspack.config.mjs**

```js
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('@rspack/core').Configuration} */
const rspackConfig = {
  mode: 'development',
  resolve: {
    // Note: Do not specify '.ts' or '.tsx' here.  Heft invokes Rspack as a post-process after the compiler.
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

export default rspackConfig;
```

If you want to use a slightly different configuration when developing using the localhost dev server,
you can optionally create a second file called **rspack.dev.config.js**.

To start the localhost dev server, use the `heft start` command, which conventionally is defined as an alias
for `heft build-watch --serve` (see `aliasesByName` above). Whenever you save a change to a source file,
Heft's watch mode will recompile your project, then Rspack's dev server should refresh your
web browser with the latest build of the app.

### Interaction with Jest

Rspack works best with the `esnext` module format, whereas Jest must use the `commonjs` module format because
its tests are executed by the Node.js runtime. In order to use Rspack and Jest together, you will need
to emit both module formats. This is described in the [Jest plugin](../plugins/jest.md) section.

## CLI parameters

[heft-rspack-plugin/heft-plugin.json](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-rspack-plugin/heft-plugin.json) defines these parameters:

```
  --serve
                        Start a local web server for testing purposes using
                        @rspack/dev-server. This parameter is only available
                        when running in watch mode.
```

## See also

- [Rspack documentation](https://rspack.dev/)
- [Webpack plugin](./webpack.md) - the equivalent plugin for Webpack
