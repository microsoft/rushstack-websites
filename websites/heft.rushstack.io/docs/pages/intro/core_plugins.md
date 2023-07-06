---
title: Core plugins
---

## Built-in plugins

These plugins are bundled with the `@rushstack/heft` package and are enabled by default:

| Plugin                                                                                                                                | Description                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [ApiExtractorPlugin](https://github.com/microsoft/rushstack/blob/main/apps/heft/src/plugins/ApiExtractorPlugin/ApiExtractorPlugin.ts) | Implements the [api-extractor](../tasks/api-extractor.md) task                                                            |
| [CopyFilesPlugin](https://github.com/microsoft/rushstack/blob/main/apps/heft/src/plugins/CopyFilesPlugin.ts)                          | Implements the [copy-files](../tasks/copy-files.md) task                                                                  |
| [CopyStaticAssetsPlugin](https://github.com/microsoft/rushstack/blob/main/apps/heft/src/plugins/CopyStaticAssetsPlugin.ts)            | Implements the [copy-static-assets](../tasks/copy-static-assets.md) task                                                  |
| [DeleteGlobsPlugin](https://github.com/microsoft/rushstack/blob/main/apps/heft/src/plugins/DeleteGlobsPlugin.ts)                      | Implements the [delete-globs](../tasks/delete-globs.md) task                                                              |
| [NodeServicePlugin](https://github.com/microsoft/rushstack/blob/main/apps/heft/src/plugins/NodeServicePlugin.ts)                      | Implements the [node-service](../tasks/node-service.md) task for developing Node.js services                              |
| [ProjectValidatorPlugin](https://github.com/microsoft/rushstack/blob/main/apps/heft/src/plugins/ProjectValidatorPlugin.ts)            | An internal Heft plugin that performs basic validation such as warning about obsolete files in the `.heft` folder         |
| [SassTypingsPlugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-sass-plugin/src/SassTypingsPlugin.ts)          | Implements the [sass-typings](../tasks/sass-typings.md) task                                                              |
| [TypeScriptPlugin](https://github.com/microsoft/rushstack/blob/main/apps/heft/src/plugins/TypeScriptPlugin/TypeScriptPlugin.ts)       | Implements the [typescript](../tasks/typescript.md), [eslint](../tasks/eslint.md), and [tslint](../tasks/tslint.md) tasks |

## Packaged plugins

The following core plugins are published as separate NPM packages, and must be explicitly loaded using your
project's [heft.json](../configs/heft_json.md) config file:

- [@rushstack/heft-jest-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-jest-plugin) - Implements the [jest](../tasks/jest.md) task for unit tests
- [@rushstack/heft-webpack5-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-webpack5-plugin) - Implements the [webpack](../tasks/webpack.md) bundling and `webpack-dev-server` functionality for Webpack 5
- [@rushstack/heft-webpack4-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-webpack4-plugin) - Supports older projects using Webpack 4
