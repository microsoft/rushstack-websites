---
title: Heft 0.51中的新功能
authors:
  - D4N14L
tags: [heft]
draft: false
hide_table_of_contents: false
---

"多阶段" Heft 是 `@rushstack/heft` 项目的一次重大更新，目标是与 [Rush 分阶段构建](@rushjs/pages/maintainer/phased_builds/) 更紧密地集成。此外，这次更新为 Heft 带来了更大的可定制性和改进的并行处理能力。这篇文章解释了这些改进背后的动机和架构。

<!--truncate-->

> 对于升级指南，请参阅[Heft 0.51 迁移指南](/blog/2023/06/16/heft-migration-guide)文章。

更新版本的 Heft 改进了一些关键领域，包括：

- 开发者定义的 Heft 插件和 Heft 事件的执行顺序
- 通过`--to`或`--only`等范围参数对 Heft 操作的部分执行
- 简化的插件 API，方便开发者制作 Heft 插件
- 通过**heft-plugin.json**明确定义所有 Heft 插件
- 为在一个插件包内定义多个插件提供了原生支持
- 改进了插件参数的处理
- 在 Heft 操作中提供了对增量观察模式的原生支持
- 降低了开销并改进了性能
- 还有更多！

## Heft 任务

Heft 任务是在**heft.json**中指定的最小工作单元。Heft 任务可能依赖于同一阶段内的其他任务，所有任务依赖必须在依赖任务才能执行之前完成执行。

在过去的版本中，我们区分了内置任务（`copy-files-plugin`，`node-service-plugin`等）与从插件包中加载的第三方任务。从 Heft 0.53.0 开始，两种任务现在都以相同的方式声明。内置插件只需为他们的插件`packageName`指定`@rushstack/heft`即可。

## Heft 阶段

Heft 阶段定义了在执行该阶段时将运行的一组任务。阶段充当一组逻辑任务的集合，这些任务在合理的情况下（但不一定）映射到[Rush 阶段](@rushjs/pages/maintainer/phased_builds/)。Heft 阶段可能依赖于其他阶段，当执行多个阶段时，所有选定的阶段必须完成执行，才能执行依赖的阶段。

**heft.json**文件是定义给定项目或装备的阶段和任务的地方。由于此文件包含阶段和任务之间的关系，因此它定义了执行 Heft 操作的操作顺序。

## Heft 操作

使用与 Rush 类似的扩展逻辑，可以通过使用`heft run`操作来执行一组 Heft 阶段。此操作按阶段依赖关系的顺序执行一组选定的阶段。如果选定的阶段互不依赖，那么将并行执行它们。选择参数包括：

- `--only` - 执行指定的阶段
- `--to` - 执行指定的阶段及其所有依赖项

此外，还可以通过在命令后附加`-- <参数>`来为`heft run`操作提供任务和阶段特定的参数。例如，`heft run --only build -- --clean`将仅运行`build`阶段，并在执行阶段之前进行清理。

此外，Heft 将为在**heft.json**配置中指定的每个阶段生成操作。通过运行`heft <阶段名称>`执行这些操作，并运行 Heft 至指定的阶段，包括所有阶段依赖项。因此，这些推断的 Heft 操作相当于运行`heft run --to <阶段名称>`，并且旨在作为 CLI 的简写。

## 观察模式

现在，观察模式已成为 Heft 中的一项一等公民特性。所有的 Heft 操作都创建了观察模式操作。例如，要在观察模式下运行`build`和`test`阶段，可以使用`heft test-watch`或`heft run-watch --to test`中的任一命令。在观察模式下运行时，Heft 更喜欢`runIncremental`钩子而非`run`钩子（参见[Heft 任务插件](#heft任务插件)）。

## heft.json 结构

所有阶段都在顶级`phasesByName`属性内定义。每个阶段可能会指定`phaseDependencies`，以定义在运行一组 Heft 阶段时的阶段执行顺序。阶段也可以提供`cleanFiles`选项，该选项接受一个删除操作数组，在使用`--clean`标志运行时执行。

在阶段规格中，`tasksByName` 定义了执行阶段时运行的所有任务。每个任务可能会指定 `taskDependencies` 来定义任务执行的顺序。（如果省略了 `taskDependencies`，则默认为 []，并且任务只等待包含阶段的任何 `phaseDependencies`。）`taskDependencies` 中定义的所有任务必须存在于同一阶段。由于 CLI 可用性的原因，阶段名、任务名、插件名和参数范围，必须是 `kebab-cased`。

以下是一个定义了`build`和`test`阶段的"heft.json"文件示例：

**heft.json**定义阶段和任务的示例

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",
  "extends": "base-project/config/heft.json",

  // "phasesByName"定义了所有阶段，每个阶段定义了要运行的任务
  "phasesByName": {
    // ("build"是用户定义的名称，不是模式字段)
    "build": {
      "phaseDescription": "对构建输出进行转译并运行一个语法检查器",
      "cleanFiles": [
        {
          "sourcePath": "temp-build-output"
        }
      ],
      // "tasksByName"定义了阶段内的所有任务
      "tasksByName": {
        // ("typescript"是用户定义的名称，不是模式字段)
        "typescript": {
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-typescript-plugin"
          }
        },
        "lint": {
          "taskDependencies": [ "typescript" ],
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-lint-plugin",
            "pluginName": "eslint"
          }
        },
        "copy-assets": {
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft",
            "pluginName": "copy-files-plugin",
            "options": {
              "copyOperations": [
                {
                  // 注意：在之前的HEFT版本中，这被称为"sourceFolder"
                  "sourcePath": "src/assets",
                  "destinationFolders": [ "dist/assets" ]
                }
              ]
            }
          }
        }
      }
    },

    // ("test"是用户定义的名称，不是模式字段)
    "test": {
      "phaseDependencies": [ "build" ],
      "phaseDescription": "运行Jest测试，如果提供的话。",
      "tasksByName": {
        // ("jest"是用户定义的名称，不是模式字段)
        "jest": {
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-jest-plugin"
          }
        }
      }
    }
  }
}
```

生命周期插件在顶层的`heftPlugins`数组中指定。插件可以通过提供包名和插件名来引用。另外，如果一个包只包含一个插件，插件可以通过仅提供包名来引用，Heft 将解析为唯一导出的插件。生命周期插件也可以提供选项来修改默认行为。

**heft.json**加载生命周期插件的示例

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",
  "extends": "base-project/config/heft.json",

  "heftPlugins": [
    {
      "pluginPackage": "@rushstack/heft-metrics-reporter",
      "options": {
        "disableMetrics": true
      }
    },
    {
      "pluginPackage": "@rushstack/heft-initialization-plugin",
      "pluginName": "my-lifecycle-plugin"
    }
  ]

  // (此处也可以出现"phasesByName"部分)
}
```

## heft.json 属性继承指令

以前，**heft.json** 文件与其扩展的基本文件之间的共享属性将合并数组和覆盖对象。现在，数组和对象都将合并，当自定义扩展基本配置时，简化了**heft.json**文件的使用。

另外，配置文件解析器现在支持**属性继承指令**，用于自定义在使用`"extends"`继承时 JSON 属性如何合并。这个系统由 [@rushstack/heft-config-file](https://www.npmjs.com/package/@rushstack/heft-config-file) 库实现，并适用于所有使用该解析器加载的配置文件。覆盖是通过使用定义继承行为的指令来指定的。

例如，假设我们正在扩展一个文件，该文件具有预先定义的`exampleObject`值（一个键对象）和`exampleArray`值（一个数组对象）：

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/example-config-file.schema.json",
  "extends": "base-project/config/example-config-file.json",

  "$exampleObject.inheritanceType": "merge", // 有效选择为："merge", "replace"
  "exampleObject": {
    "$exampleObjectMember.inheritanceType": "merge", // 有效选择为："merge", "replace"
    "exampleObjectMember": { ... },

    "$exampleArrayMember.inheritanceType": "append", // 有效选择为："append", "replace"
    "exampleArrayMember": [ ... ]
  },

  "$exampleArray.inheritanceType": "replace", // 有效选择为："append", "replace"
  "exampleArray": [ ... ]
}
```

一旦对象被设置为覆盖的`inheritanceType`，所有子属性的`inheritanceType`值将被忽略，因为最顶层的对象已经覆盖了所有子属性。

需要注意的一点是，合并键对象和数组时使用了不同的`mergeBehavior`动词。这是为了明确表示数组将按原样追加，合并过程中不进行任何额外处理（例如，如果数组应该是一组，那么不进行重复）。如果需要这样的行为，可以在实现端完成。在`@rushstack/heft-config-file`包中对数组进行重复处理没有什么意义，因为对非基元对象的数组进行重复处理并不容易定义。

## 关联的 NPM 包

许多以前内置于 Heft 的任务现已被拆分到单独的 NPM 包中。完整列表如下：

- `@rushstack/heft`
- `@rushstack/heft-typescript-plugin`
- `@rushstack/heft-lint-plugin`
- `@rushstack/heft-api-extractor-plugin`
- `@rushstack/heft-jest-plugin`
- `@rushstack/heft-sass-plugin`
- `@rushstack/heft-storybook-plugin`
- `@rushstack/heft-webpack4-plugin`
- `@rushstack/heft-webpack5-plugin`
- `@rushstack/heft-dev-cert-plugin`

此外，Rushstack 提供的 rigs 已更新以与新版本的 Heft 兼容：

- `@rushstack/heft-node-rig`
- `@rushstack/heft-web-rig`

## 编写 Heft 插件

### 生命周期插件

Heft 生命周期插件为某些与生命周期相关的钩子提供实现。这些插件将在所有 Heft 阶段中使用，因此除了少数特定情况（如用于指标报告）之外，应很少在外部使用。Heft 生命周期插件提供一个 `apply()` 方法，插件可以在此处挂载以下 Tapable 钩子：

- `toolStart` - 在 Heft 执行开始时提供与插件相关的功能
- `toolFinish` - 在所有任务完成后，在 Heft 执行结束时提供与插件相关的功能
- `recordMetrics` - 在所有任务完成后，向插件提供有关 Heft 运行的指标信息

### 任务插件

Heft 任务插件为 Heft 任务提供实现。Heft 插件提供一个 `apply()` 方法，插件可以在此处挂载以下 Tapable 钩子：

- `registerFileOperations` - 在插件首次运行前确切地调用一次。允许插件使用与 `copyFiles` 和 `deleteFiles` Heft 事件相同的选项注册复制或删除操作（这个钩子就是实现这些事件的方式）。
- `run` - 提供与插件相关的任务功能
- `runIncremental` - 在观察模式下提供与插件相关的任务功能。如果没有为任务提供 `runIncremental` 实现，Heft 将像往常一样回退到使用 `run` 钩子。选项结构包括两个用于支持观察操作的函数：
  - `requestRun()` - 这个函数请求 Heft 运行时安排插件所属任务的新运行，可能会取消当前的构建。
  - `watchGlobAsync(patterns, options)` - 这个函数是为了方便常见的监视 glob 变化的情况而提供的。它返回一个 `Map<string, IWatchedFileState>`，该映射枚举了 glob 选定的文件（或文件夹）列表，以及它们自

### heft-plugin.json

**heft-plugin.json** 配置文件是一个新的，必需的清单文件，所有 Heft 插件包的包文件夹中都必须存在。此文件用于多种用途，包括定义所有包含的生命周期或任务插件，定义所有插件特定的 CLI 参数，并提供一个可选的模式文件，以验证可以通过 **heft.json** 传递的插件选项。

以下是定义生命周期插件和任务插件的示例 **heft-plugin.json** 文件：

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft-plugin.schema.json",

  "lifecyclePlugins": [
    {
      "pluginName": "my-lifecycle-plugin",
      "entryPoint": "./lib/MyLifecyclePlugin.js",
      "optionsSchema": "./lib/schemas/mylifecycleplugin.schema.json",
      "parameterScope": "my-lifecycle",
      "parameters": [
        {
          "parameterKind": "string",
          "longName": "--my-string",
          "description": "…",
          "argumentName": "ARG_NAME",
          "required": false
        }
      ]
    }
  ],

  "taskPlugins": [
    {
      "pluginName": "my-task-plugin",
      "entryPoint": "./lib/MyTaskPlugin.js",
      "optionsSchema": "./lib/schemas/mytaskplugin.schema.json",
      "parameterScope": "my-task",
      "parameters": [
        {
          "parameterKind": "string",
          "longName": "--my-other-string",
          "description": "…",
          "argumentName": "ARG_NAME",
          "required": false
        }
      ]
    }
  ]
}
```

### 跨插件交互

有时插件之间的交流会很有帮助。例如，`@rushstack/heft-lint-plugin` 和 `@rushstack/heft-typescript-plugin` 共享一个 TypeScript 的 `ts.Program` 对象，这极大地提高了构建时间，因为避免了两次计算编译器的语义分析。这种优化带来了一个约束，那就是任务必须在您的 **heft.json** 配置中共享同一个 Heft 阶段。

这是如何工作的？Heft 插件可以使用 `requestAccessToPluginByName()` API 来访问请求的 **插件访问器**。访问器是插件提供给外部使用的对象，是分享插件特定信息或提供额外插件功能的钩子的理想位置。

在阶段执行开始时，清理钩子执行之前，满足访问请求。如果请求的插件没有提供访问器，将抛出一个错误，指出缺少访问器的插件。然而，如果完全没有请求的插件，访问请求将默默地失败。这样做是为了允许对外部插件进行非必需的集成。因此，实现跨插件交互的方式很重要，以期望这种情况，并优雅地处理，或者抛出一个有帮助的错误。

可访问的插件基于范围进行限制。对于生命周期插件，您可以请求访问添加到 Heft 配置中的任何其他生命周期插件。对于任务插件，您可以请求访问 Heft 配置中相同阶段内的任何其他任务插件。

### 自定义 CLI 参数

现在，只能通过 **heft-plugin.json** 定义 CLI 参数，而定义的参数可以通过 `HeftTaskSession.parameters` API 在插件中使用。此外，当使用 `--help` 参数（例如 `heft test --help` 或 `heft run --to test -- --help`）时，现在可以在 CLI 中发现选定的 Heft 阶段的所有插件参数。

这些参数可以使用可选提供的 `parameterScope` 在 CLI 上自动进行 "去重"。默认情况下，**heft-plugin.json** 中定义的参数将使用 `--<parameterName>` 和 `--<parameterScope>:<parameterName>` 在 CLI 上可用。当多个插件提供相同的参数时，为了 "去重" 冲突的参数，只有后者参数在 CLI 上可用。例如，如果 PluginA 具有参数范围 "PluginA" 定义 `--parameter`，并且 PluginB 也使用参数范围 "PluginB" 定义 `--parameter`，那么参数 _只能_ 作为 `--PluginA:parameter` 和 `--PluginB:parameter` 可用。

如果您对这些对 Heft 的更改有任何问题或反馈，请[在聊天室中提问](https://rushstack.zulipchat.com/#narrow/stream/262522-heft)或[提交一个问题](https://github.com/microsoft/rushstack/issues/new?assignees=&labels=&template=heft.md&title=%5Bheft%2Frc%2f0%5D+)。
