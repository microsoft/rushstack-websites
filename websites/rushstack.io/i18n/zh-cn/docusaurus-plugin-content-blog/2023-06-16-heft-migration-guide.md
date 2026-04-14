---
title: Heft 0.51迁移指南
authors:
  - D4N14L
  - octogonz
tags: [heft]
draft: false
hide_table_of_contents: false
---

Heft **0.51.0** 版本推出了一个带来了一些重大架构变化的"多阶段"特性。如果你一直在使用较旧的版本，那么升级将需要对你的**Heft 配置文件**以及可能编写的**自定义插件**进行一些更改。在这篇文章中，我们将总结发生了哪些更改，以及如何迁移你的项目。这可能是在 Heft 的 1.0.0 版本发布之前的最后一次重大破坏性更改。

<!--truncate-->

> 想要更深入地了解多阶段设计及其背后的动机，请参阅我们的另一篇文章[Heft 0.51 中的新内容](/blog/2023/06/15/heft-whats-new/)。

## 版本时间线

虽然大部分的重大更改都在 Heft **0.51.0** 中，但在后续的几个版本中也进行了一些重要的更改：

- Heft **0.51.0**: 为支持多阶段功能做出的大规模架构变更，包括配置文件架构和插件 API 的破坏性更改
- Heft **0.52.0**: 恢复对 `heft start` 别名的支持（该别名在 0.51.0 版本中被移除）；增加了定义自定义别名的能力；`@rushstack/heft-node-rig` 现在使用与 `@rushstack/heft-web-rig` 相同的 `heft start` 别名启动其开发服务器
- Heft **0.53.0**: 移除了 `taskEvents` 配置设置；像 `copy-files-plugin` 和 `node-service-plugin` 这样的内建任务现在使用与第三方插件相同的配置（简单地指定 `@rushstack/heft` 为他们的插件包名称）
- Heft **0.54.0**: 恢复了对 `heft test -u` 中 `-u` 等短参数名称的支持（该支持在 0.51.0 版本中被移除）
- Heft **0.55.0**: 从插件 API 的会话对象中移除了 `cacheFolderPath`，因为 `.cache` 文件夹不再被使用

为了简化这些迁移说明，在本文中我们将假设你正在升级到 **0.55.0 或更新的版本**，且你的当前版本是 **0.50.x 或更旧的版本**。

## 迁移 heft.json 文件

### JSON Schema URL 的更改

为了在编辑配置文件时能得到正确的 VS Code 智能提示，需要更新每个 Heft 配置文件中的 `"$schema"` 字段。只需将 `json-schemas/heft/` 替换为 `json-schemas/heft/v0` 即可。

例如：

- 旧的：`"$schema": "https://developer.microsoft.com/json-schemas/heft/heft.schema.json"`
- 新的：`"$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json"`

完整的 JSON schema 名称列表可以在[此 GitHub 文件夹](https://github.com/microsoft/json-schemas/tree/main/heft/v0)中找到。这些名称是上面显示的 URL 的最后一部分。

### 插件必须显式加载

在旧的设计中，许多插件被内置于 `@rushstack/heft` 中，不需要使用 **heft.json** 设置显式加载。如果找不到它们相关的配置文件，那么它们的任务就会被默默地跳过。

**旧的：** 隐式加载的插件：

- heft-typescript-plugin
- copy-static-assets-plugin
- copy-files-plugin
- delete-globs-plugin
- run-script-plugin
- api-extractor-plugin
- project-validator-plugin
- node-service-plugin

**新的：** 迁移后，每个插件必须通过 **heft.json** 配置文件显式加载。通常这是从你的 rig 继承过来的。这种新模型消除了神秘和不确定性，因为插件及其依赖的完整集合现在在配置文件中表示。

如果你正在使用我们的 `@rushstack/heft-node-rig` 和 `@rushstack/heft-web-rig`，你的项目应该只需要做少量的更改，因为更新后的 rigs 现在显式加载所有这些插件。如果你创建了一个自定义的 rig，迁移工作将会更复杂，但你可以从我们的例子中复制：

- [heft-node-rig/profiles/default/config/heft.json](https://github.com/microsoft/rushstack/blob/main/rigs/heft-node-rig/profiles/default/config/heft.json)
- [heft-web-rig/profiles/app/config/heft.json](https://github.com/microsoft/rushstack/blob/main/rigs/heft-web-rig/profiles/app/config/heft.json)

### 迁移 package.json 依赖

许多插件已经被提取到它们自己的 NPM 包中。这减少了对某些插件不使用的项目的启动时间和安装占用。

以下是写作时的当前库存：

- [@rushstack/heft](https://github.com/microsoft/rushstack/tree/main/apps/heft)：其[heft-plugin.json](https://github.com/microsoft/rushstack/blob/main/apps/heft/heft-plugin.json)定义了多个插件 copy-files-plugin、delete-files-plugin、node-service-plugin、run-script-plugin
- [@rushstack/heft-api-extractor-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-api-extractor-plugin)
- [@rushstack/heft-dev-cert-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-dev-cert-plugin)
- [@rushstack/heft-jest-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-jest-plugin)
- [@rushstack/heft-lint-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-lint-plugin)
- [@rushstack/heft-sass-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-sass-plugin)
- [@rushstack/heft-serverless-stack-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-serverless-stack-plugin)
- [@rushstack/heft-storybook-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-storybook-plugin)
- [@rushstack/heft-typescript-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-typescript-plugin)
- [@rushstack/heft-webpack4-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-webpack4-plugin)
- [@rushstack/heft-webpack5-plugin](https://github.com/microsoft/rushstack/tree/main/heft-plugins/heft-webpack5-plugin)

### 迁移独立的 heft.json

旧的 **heft.json** 区分了"事件动作"（即内置任务）和"heftPlugins"（即来自插件包的任务）。

**旧的：** `heft-node-rig` 中的 **heft.json** 摘录

```ts
// ⚠️ 旧格式示例 -- 请勿使用！⚠️
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/heft.schema.json",

  // "deleteGlobs" 指定在 "clean" 事件下运行
  "eventActions": [
    {
      // 📌 [1] 旧的清理方式
      "actionKind": "deleteGlobs",
      "heftEvent": "clean",
      "actionId": "defaultClean",
      "globsToDelete": ["dist", "lib", "lib-commonjs", "temp"]
    }
  ],

  // Jest 插件使用 "heftPlugins" 部分加载
  // 并且它的事件序列是使用程序逻辑定义的
  "heftPlugins": [
    // 📌 [2] 旧的加载插件方式
    { "plugin": "@rushstack/heft-jest-plugin" }
  ]
}
```

**新的：** `heft-node-rig` 中的 **heft.json** 摘录

```ts
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",

  "phasesByName": {
    // ("build" 是用户定义的名称，不是模式字段)
    "build": {
      // 📌 [1] 新的清理方式
      "cleanFiles": [
        { "sourcePath": "dist" },
        { "sourcePath": "lib" },
        { "sourcePath": "lib-commonjs" }
      ],
      "tasksByName": {
        // ("typescript" 是用户定义的名称，不是模式字段)
        "typescript": {
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-typescript-plugin"
          }
        },
        "lint": {
          "taskDependencies": ["typescript"],
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-lint-plugin"
          }
        },
        "api-extractor": {
          "taskDependencies": ["typescript"],
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-api-extractor-plugin"
          }
        },
        "node-service": {
          "taskDependencies": ["typescript"],
          "taskPlugin": {
            // 这个内置插件指定 "@rushstack/heft" 作为它的包名称
            "pluginPackage": "@rushstack/heft",
            "pluginName": "node-service-plugin"
          }
        }
      }
    },

    // ("test" 是用户定义的名称，不是模式字段)
    "test": {
      "phaseDependencies": ["build"],
      "tasksByName": {
        // ("jest" 是用户定义的任务名称)
        "jest": {
          // 📌 [2] 新的加载插件方式
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-jest-plugin"
          }
        }
      }
    }
  }
}
```

观察上面的示例，主要的更改有：

- 每个任务必须从 `pluginPackage` 中显式加载，因此 rig 的 **heft.json** 现在更冗长（但更易理解！）
- 内置任务（例如 `node-service`）与外部插件具有相同的规范
- 旧的 `"heftEvent"` 生命周期已被 `phaseDependencies` 和 `taskDependencies` 取代，其依赖图确定了任务的顺序

完整的配置文件可以在这里找到：[heft-node-rig/profiles/default/config/heft.json](https://github.com/microsoft/rushstack/blob/main/rigs/heft-node-rig/profiles/default/config/heft.json)

### 迁移已配置的 heft.json

这是来自[TSDoc Playground](https://tsdoc.org/play/)项目的另一个示例，它的 [heft.json](https://github.com/microsoft/tsdoc/blob/main/playground/config/heft.json) 继承自我们的 `heft-web-rig`：

**旧的：** `playground/config/heft.json` 中的 **heft.json** 摘录

```ts
// ⚠️ 旧格式示例 -- 请勿使用！⚠️
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/heft.schema.json",

  "extends": "@rushstack/heft-web-rig/profiles/library/config/heft.json",

  "eventActions": [
    {
      "actionId": "copyLicenseToDistFolder",
      "actionKind": "copyFiles",
      // 📌 [3] 旧的编译后操作方式
      "heftEvent": "compile",
      "copyOperations": [
        {
          "destinationFolders": ["./dist"],
          // 📌 [4] 旧的指定源文件夹方式
          "sourceFolder": "..",
          "includeGlobs": ["LICENSE"]
        }
      ]
    }
  ]
}
```

**新的：** `playground/config/heft.json` 中的 **heft.json** 摘录

```ts
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",

  "extends": "@rushstack/heft-web-rig/profiles/library/config/heft.json",

  "phasesByName": {
    // ("build" 是用户定义的名称，不是模式字段)
    "build": {
      "tasksByName": {
        // ("post-compile-copy" 是用户定义的名称，不是模式字段)
        "post-compile-copy": {
          // 📌 [3] 新的编译后操作方式，通过依赖于相关任务来实现

          // 在 "typescript" 完成后才应运行 "post-compile-copy" 任务
          "taskDependencies": ["typescript"],

          "taskPlugin": {
            "pluginName": "copy-files-plugin",
            "pluginPackage": "@rushstack/heft",
            "options": {
              "copyOperations": [
                {
                  // 📌 [4] 新的指定源文件夹（或文件路径）的方式
                  "sourcePath": "..",
                  "destinationFolders": ["./dist"],
                  "includeGlobs": ["LICENSE"]
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

观察：

- 这里的更改很小，因为 rig 提供了大部分的构建定义
- 最新的 `heft-web-rig` 使用了 `heft-webpack5-plugin`，因此我们需要在转换过程中从 Webpack 4 升级到 5
- `"heftEvent": "compile"` 事件不再存在；相反，它必须通过等效的 `"taskDependencies"` 条目来表示，该条目引用了 rig 的 `"typescript"` 任务定义

### 迁移"pre-compile"操作

在上面的示例中，我们通过将 `"heftEvent": "compile"` 替换为 `"taskDependencies": ["typescript"]` 进行了配置文件的迁移，通过表达在 `"typescript"` 任务完成之后才能执行该操作。但是 `"taskDependencies"` 是单向关系。在这种新模型中，我们如何表示诸如 `pre-compile` 这样的事件呢？

考虑以下示例：

**旧版:** **heft.json** 样本

```ts
// ⚠️ 旧格式示例 -- 请勿使用！⚠️
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/heft.schema.json",

  "extends": "@rushstack/heft-web-rig/profiles/app/config/heft.json",

  "eventActions": [
    {
      "actionKind": "copyFiles",
      "actionId": "copyAssets",
      // 📌 [5] 旧的执行"pre-compile"操作的方式
      "heftEvent": "pre-compile",
      "copyOperations": [
        {
          "sourceFolder": "node_modules/some-library/dist",
          "destinationFolders": ["temp/typings"],
          "includeGlobs": ["*.d.ts"]
        }
      ]
    }
  ]
}
```

**新版:** **heft.json** 样本

```ts
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",

  "extends": "@rushstack/heft-web-rig/profiles/app/config/heft.json",

  "phasesByName": {
    // ("build" 是用户定义的名称，不是模式字段)
    "build": {
      "tasksByName": {
        // ("pre-compile-copy" 是用户定义的名称，不是模式字段)
        "pre-compile-copy": {
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft",
            "pluginName": "copy-files-plugin",
            "options": {
              "copyOperations": [
                {
                  "sourcePath": "node_modules/some-library/dist",
                  "destinationFolders": ["temp/typings"],
                  "includeGlobs": ["*.d.ts"]
                }
              ]
            }
          }
        },

        // ("typescript" 是用户定义的名称，最初在 rig 中定义)
        "typescript": {
          // 📌 [5] 新的执行"pre-compile"操作的方式
          // "typescript" 任务在 "pre-compile-copy" 完成之后才能运行
          "taskDependencies": ["pre-compile-copy"]
        }
      }
    }
  }
}
```

供参考，`@rushstack/heft-web-rig` 如下定义了 `"typescript"` 任务：

[heft-web-rig/profiles/app/config/heft.json](https://github.com/microsoft/rushstack/blob/main/rigs/heft-web-rig/profiles/app/config/heft.json) 摘录

```js
  . . .
  "typescript": {
    "taskDependencies": ["sass"],
    "taskPlugin": {
      "pluginPackage": "@rushstack/heft-typescript-plugin"
    }
  },
  . . .
```

观察：

- 回想一下，我们通过为自己的任务指定 `taskDependencies`（`"taskDependencies": ["typescript"]`）来实现了 `"post-compile-copy"`。
- 相比之下，我们通过修改 rig 的 `"typescript"` 任务的 `taskDependencies`（`"taskDependencies": ["pre-compile-copy"]`）来实现 `"pre-compile-copy"`。
- rig 已经有 `"taskDependencies": ["sass"]`。但我们不需要指定 `"taskDependencies": ["typescript", "sass"]`，因为 Heft 的配置解析器默认会通过追加而不是替换的方式合并数组。
- 这种合并行为由 `@rushstack/heft-config-file` 实现，并且可以使用[属性继承指令](/blog/2023/06/15/heft-whats-new/#heftjson-属性继承指令)进行自定义。

## 迁移命令行语法

旧的 `--watch` 命令行参数已被移除。现在，可以通过在操作名称后附加 `-watch` 来启用监听模式。

**旧的：**

```shell
heft build --watch --verbose
```

**新的：**

```
heft build-watch --verbose
```

## 命令别名

在旧的设计中，`heft start` 是一个特殊操作，用于启动开发服务器。在新的设计中，它是在 **heft.json** 中定义的命令别名。新的别名系统允许您定义自己的自定义别名，以缩短常用命令的长度。

[heft-web-rig/profiles/app/config/heft.json](https://github.com/microsoft/rushstack/blob/main/rigs/heft-web-rig/profiles/app/config/heft.json) 摘录

```js
  // 将 "heft start" 定义为 "heft build-watch --serve" 的别名。
  "aliasesByName": {
    "start": {
      "actionName": "build-watch",
      "defaultParameters": ["--serve"]
    }
  },
```

The `--serve` CLI 参数是我们启动`localhost`开发服务器的标准约定。它被`heft-webpack5-plugin`和内置的`node-service-plugin`所支持。

## 迁移自定义插件

在更新到新版本的 Heft 时，插件也需要进行兼容性更新。一些较为显著的 API 更改包括：

- **heft-plugin.json**清单文件必须随插件包一起提供。如果找不到**heft-plugin.json**文件，Heft 将报告错误。
- 插件类必须具有无参数的构造函数，并且必须是**heft-plugin.json**中的`entryPoint`属性指向的文件的默认导出。
- 现在可以使用**heft-plugin.json**中的`optionsSchema`属性指定在**heft.json**中提供的选项的模式文件，并且 Heft 将对其进行验证。
- 参数现在在**heft-plugin.json**中定义，并且通过插件的`IHeftTaskSession.parameters`或`IHeftLifecycleSession.parameters`属性来使用。
  _注意：除了默认的 Heft 参数外，只有调用插件定义的参数是可访问的_
- 插件不再能够定义自己的操作。如果插件需要自己的操作，应将专用阶段添加到消费者的**heft.json**中。
- `runScript` Heft 事件已被修改，仅接受`runAsync`方法，并且属性已更新以反映常规 Heft 任务插件可用的内容。
- 与路径相关的变量已重命名以明确表示它们是路径（例如，`HeftConfiguration.buildFolder`现在是`HeftConfiguration.buildFolderPath`）
- `runIncremental`钩子现在可以用于确保按正确的依赖顺序进行监视模式的重建
- `clean`钩子已被删除，以便使用**heft.json**中的`cleanFiles`选项清除文件，以便明确指定正在清除的文件和时间
- 作为后果，插件不再能够以编程方式计算`heft clean`命令要清除的文件夹；其行为由静态配置文件预先确定，从而使整个系统更简单和更可预测。

## 其他迁移说明

- 在**jest.config.json**中，已删除`folderNameForTests`和`extensionForTests`属性，应改用`testMatch`属性处理。
- 内置的`node-service-plugin`现在支持`--serve`参数，以保持与`@rushstack/heft-webpack5-plugin`开发服务器的一致性。
- 如果指定了`--serve`并且省略了`config/node-service.json`，那么`node-service-plugin`将以硬错误失败。
- 尽管`@rushstack/heft-lint-plugin`和`@rushstack/heft-typescript-plugin`已分别提取到单独的 NPM 包中，但它们必须
