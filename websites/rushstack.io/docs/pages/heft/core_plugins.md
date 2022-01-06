---
title: Core plugins
---

## Built-in plugins

These plugins are bundled with the `@rushstack/heft` package and are enabled by default:

| Plugin  | Description |
| ------------- | ------------- |
| [ApiExtractorPlugin](https://github.com/microsoft/rushstack/blob/master/apps/heft/src/plugins/ApiExtractorPlugin/ApiExtractorPlugin.ts) | Implements the [api-extractor](../heft_tasks/api-extractor.md) task |
| [CopyFilesPlugin](https://github.com/microsoft/rushstack/blob/master/apps/heft/src/plugins/CopyFilesPlugin.ts) | Implements the [copy-files](../heft_tasks/copy-files.md) task |
| [CopyStaticAssetsPlugin](https://github.com/microsoft/rushstack/blob/master/apps/heft/src/plugins/CopyStaticAssetsPlugin.ts) | Implements the [copy-static-assets](../heft_tasks/copy-static-assets.md) task |
| [DeleteGlobsPlugin](https://github.com/microsoft/rushstack/blob/master/apps/heft/src/plugins/DeleteGlobsPlugin.ts) | Implements the [delete-globs](../heft_tasks/delete-globs.md) task |
| [NodeServicePlugin](https://github.com/microsoft/rushstack/blob/master/apps/heft/src/plugins/NodeServicePlugin.ts) | Implements the [node-service](../heft_tasks/node-service.md) task for developing Node.js services |
| [ProjectValidatorPlugin](https://github.com/microsoft/rushstack/blob/master/apps/heft/src/plugins/ProjectValidatorPlugin.ts) | An internal Heft plugin that performs basic validation such as warning about obsolete files in the `.heft` folder |
| [SassTypingsPlugin](https://github.com/microsoft/rushstack/blob/master/heft-plugins/heft-sass-plugin/src/SassTypingsPlugin.ts) | Implements the [sass-typings](../heft_tasks/sass-typings.md) task |
| [TypeScriptPlugin](https://github.com/microsoft/rushstack/blob/master/apps/heft/src/plugins/TypeScriptPlugin/TypeScriptPlugin.ts) | Implements the [typescript](../heft_tasks/typescript.md), [eslint](../heft_tasks/eslint.md), and [tslint](../heft_tasks/tslint.md) tasks |

## Packaged plugins

The following core plugins are published as separate NPM packages, and must be explicitly loaded using your
project's [heft.json](../heft_configs/heft_json.md) config file:

- [@rushstack/heft-jest-plugin](https://github.com/microsoft/rushstack/tree/master/heft-plugins/heft-jest-plugin) - Implements the [jest](../heft_tasks/jest.md) task for unit tests
- [@rushstack/heft-webpack5-plugin](https://github.com/microsoft/rushstack/tree/master/heft-plugins/heft-webpack5-plugin) - Implements the [webpack](../heft_tasks/webpack.md) bundling and `webpack-dev-server` functionality for Webpack 5
- [@rushstack/heft-webpack4-plugin](https://github.com/microsoft/rushstack/tree/master/heft-plugins/heft-webpack4-plugin) - Supports older projects using Webpack 4
