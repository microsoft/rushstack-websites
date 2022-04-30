---
title: 核心插件
---

## 内置的插件

以下插件与 `@rushstack/heft` 捆绑在一起，并且会默认开启：

| 插件                                                                                                                                    | 描述                                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [ApiExtractorPlugin](https://github.com/microsoft/rushstack/blob/master/apps/heft/src/plugins/ApiExtractorPlugin/ApiExtractorPlugin.ts) | 实现 [api-extractor](../heft_tasks/api-extractor.md) 任务                                                                     |
| [CopyFilesPlugin](https://github.com/microsoft/rushstack/blob/master/apps/heft/src/plugins/CopyFilesPlugin.ts)                          | 实现 [copy-files](../heft_tasks/copy-files.md) 任务                                                                           |
| [CopyStaticAssetsPlugin](https://github.com/microsoft/rushstack/blob/master/apps/heft/src/plugins/CopyStaticAssetsPlugin.ts)            | 实现 [copy-static-assets](../heft_tasks/copy-static-assets.md) 任务                                                           |
| [DeleteGlobsPlugin](https://github.com/microsoft/rushstack/blob/master/apps/heft/src/plugins/DeleteGlobsPlugin.ts)                      | 实现 [delete-globs](../heft_tasks/delete-globs.md) 任务                                                                       |
| [NodeServicePlugin](https://github.com/microsoft/rushstack/blob/master/apps/heft/src/plugins/NodeServicePlugin.ts)                      | 实现 [node-service](../heft_tasks/node-service.md) 任务，它用于部署 Node.js 服务                                              |
| [ProjectValidatorPlugin](https://github.com/microsoft/rushstack/blob/master/apps/heft/src/plugins/ProjectValidatorPlugin.ts)            | 内部的 Heft 插件，用于执行基本的验证，例如警告 `.heft` 文件夹下过时的文件                                                     |
| [SassTypingsPlugin](https://github.com/microsoft/rushstack/blob/master/heft-plugins/heft-sass-plugin/src/SassTypingsPlugin.ts)          | 实现 [sass-typings](../heft_tasks/sass-typings.md) 任务                                                                       |
| [TypeScriptPlugin](https://github.com/microsoft/rushstack/blob/master/apps/heft/src/plugins/TypeScriptPlugin/TypeScriptPlugin.ts)       | 实现 [typescript](../heft_tasks/typescript.md), [eslint](../heft_tasks/eslint.md), and [tslint](../heft_tasks/tslint.md) 任务 |

## 封装的插件

以下核心插件作为独立的 NPM 包发布，使用时必须在项目的 [heft.json](../heft_configs/heft_json.md) 配置文件来声明。

- [@rushstack/heft-jest-plugin](https://github.com/microsoft/rushstack/tree/master/heft-plugins/heft-jest-plugin) - 实现 [jest](../heft_tasks/jest.md) 任务，它用于单元测试
- [@rushstack/heft-webpack5-plugin](https://github.com/microsoft/rushstack/tree/master/heft-plugins/heft-webpack5-plugin) - 实现 [webpack](../heft_tasks/webpack.md) 打包，并实现了适用于 Webpack 5 的 `webpack-dev-server` 函数
- [@rushstack/heft-webpack4-plugin](https://github.com/microsoft/rushstack/tree/master/heft-plugins/heft-webpack4-plugin) - 支持使用 Webpack 4 的老项目
