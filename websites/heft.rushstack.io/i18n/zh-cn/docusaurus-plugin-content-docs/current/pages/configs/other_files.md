---
title: 其他的配置文件
---

除了 Heft 本身定义的配置文件外，在构建项目时还会有一些特定工具的配置文件。

|                                          |                                                      |
| ---------------------------------------- | ---------------------------------------------------- |
| **支持的文件路径：**                     | **&lt;project folder&gt;/config/api-extractor.json** |
| **对应的任务：**                         | [api-extractor](../heft_tasks/api-extractor.md)      |
| **描述：**                               | 配置 API 报告，打包 .d.ts, 生成 API 文档             |
| [**Riggable?**](../heft/rig_packages.md) | Yes                                                  |

|                                          |                                         |
| ---------------------------------------- | --------------------------------------- |
| **支持的文件路径：**                     | **&lt;project folder&gt;/.eslintrc.js** |
| **对应的任务：**                         | [eslint](../heft_tasks/eslint.md)       |
| **描述：**                               | 配置格式化规则                          |
| [**Riggable?**](../heft/rig_packages.md) | 仅仅通过 `"extends"`                    |

|                                          |                                                    |
| ---------------------------------------- | -------------------------------------------------- |
| **支持的文件路径：**                     | **&lt;project folder&gt;/config/jest.config.json** |
| **对应的任务：**                         | [jest](../heft_tasks/jest.md)                      |
| **描述：**                               | 配置单元测试的执行方式                             |
| [**Riggable?**](../heft/rig_packages.md) | 不通过 `"preset"`                                  |

|                                          |                                         |
| ---------------------------------------- | --------------------------------------- |
| **支持的文件路径：**                     | **&lt;project folder&gt;/package.json** |
| **对应的任务：**                         | N/A                                     |
| **描述：**                               | 定义一个项目，可以作为 NPM 包发布       |
| [**Riggable?**](../heft/rig_packages.md) | N/A                                     |

|                                          |                                           |
| ---------------------------------------- | ----------------------------------------- |
| **支持的文件路径：**                     | **&lt;project folder&gt;/tsconfig.json**  |
| **对应的任务：**                         | [typescript](../heft_tasks/typescript.md) |
| **描述：**                               | 配置 TypeScript 编译器                    |
| [**Riggable?**](../heft/rig_packages.md) | 仅仅通过 `"extends"`                      |

|                                          |                                        |
| ---------------------------------------- | -------------------------------------- |
| **支持的文件路径：**                     | **&lt;project folder&gt;/tslint.json** |
| **对应的任务：**                         | [tslint](../heft_tasks/tslint.md)      |
| **描述：**                               | 配置格式化规则                         |
| [**Riggable?**](../heft/rig_packages.md) | 仅仅通过 `"extends"`                   |

|                                          |                                              |
| ---------------------------------------- | -------------------------------------------- |
| **支持的文件路径：**                     | **&lt;project folder&gt;/webpack.config.js** |
| **对应的任务：**                         | [webpack](../heft_tasks/webpack.md)          |
| **描述：**                               | 配置打包规则                                 |
| [**Riggable?**](../heft/rig_packages.md) | 仅仅通过 `import`                            |
