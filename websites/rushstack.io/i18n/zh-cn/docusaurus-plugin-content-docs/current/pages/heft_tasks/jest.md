---
title: '"jest" task'
---

该任务调用了单元测试框架 [Jest](https://jestjs.io/en/).

## 何时使用它

我们推荐 Jest 有以下几个原因：

- **多合一**：不同于 `mocha` 需要多个组件结合在一起，Jest 提供了集成解决方案：测试运行工具、断言库、模拟 API, 仪表、代码覆盖率和报告。Jest 对 React 也有一流的支持。

- **交互式**：Jest 支持 "监听模式"：每当文件被保存时自动重新执行测试，另外还有一个[快照测试](https://jestjs.io/docs/en/snapshot-testing)，可以在代码出现变动时自动更新快照。

- **运行时隔离**：Jest 在 Node.js 环境下执行 Web 测试，而不会启动浏览器，并利用 [Node.js VM](https://nodejs.org/api/vm.html) 功能来防止测试状态被污染。

这就是说，如果出于某种原因，你需要在其他运行时（如 Android 客户端或真正的 Web 浏览器上）运行测试，Jest 可能不是最好的选择。

## package.json dependencies

Heft 直接依赖它所需的 Jest 包，所以你不需要在 **package.json** 下安装 Jest.相反，你将需要安装 Heft 插件：

```shell
$ rush add --package @rushstack/heft-jest-plugin --dev
```

项目中应该从 `@type/heft-jest` 中获取类型，而不是 `@type/jest`:

```bash
$ rush add --package @types/heft-jest --exact --dev
```

之后，在 **tsconfig.json** 下引用 `heft-json`, 示例如下：

```js
{
  "extends": "./node_modules/@rushstack/heft-node-rig/profiles/default/tsconfig-base.json",
  "compilerOptions": {
    "types": [
      "heft-jest", // <---- ADD THIS
      "node"
    ]
  }
}
```

## 配置文件

上面安装的 Heft 插件需要加载 [heft.json 配置文件](../heft_configs/heft_json.md)：

**&lt;project folder&gt;/config/heft.json**

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/heft.schema.json",

  . . .

  "heftPlugins": [
    { "plugin": "@rushstack/heft-jest-plugin" }  // <---- ADD THIS
  ]
}
```

Heft 会在 **config/jest.config.json** 中寻找 [Jest 的配置文件](https://jestjs.io/docs/en/configuration)，尽管 Jest 自身支持其他的配置文件形式，甚至可以在你的 **package.json** 文件中写入配置，但 Heft 需要 `jest.config.json` 这个文件。使用统一的文件名，可以方便地搜索文件、批量编辑、在项目之间复制配置。

下面是一个简单的示例，你的 Jest 配置应继承自 Heft 的 [jest-shared.config.json](https://github.com/microsoft/rushstack/blob/master/heft-plugins/heft-jest-plugin/includes/jest-shared.config.json), 示例如下：

**&lt;project folder&gt;/config/jest.config.json**

```js
{
  "extends": "@rushstack/heft-jest-plugin/includes/jest-shared.config.json"
}
```

如果你使用的是 rig 包，如 `@rushstack/heft-web-rig`, 则示例如下：

**&lt;project folder&gt;/config/jest.config.json**

```js
{
  "extends": "@rushstack/heft-web-rig/profiles/library/config/jest.config.json"
}
```

（如果你维护自己的 rig, 那么它应该扩展自 `@rushstack/heft-jest-plugin`, 这样可以确保 Jest 使用了 Heft 内的转换和解析逻辑。）

_**\*注意：**如果你在 **jest.config.json** 中添加大量的自定义设置，请创建一个 GitHub issue. 因为我们的目标是提供一个配置来最大限度地减少对特定项目的定制需求。_

## "extends" 字段

The `"extends"` field in **jest.config.json** is a Heft-specific enhancement that will not work if the Jest command line
is invoked without Heft. It replaces Jest's `"preset"` field which has limited module resolution capabilities and does not support rigs.

**jest.config.json** 中的 `"extends"` Heft 内特有的字段，它无法在没有 Heft 的 Jest 中直接工作。它替换了 Jest 的 `"preset"` 字段，因为该字段模块解析能力有限，同时无法支持 rig.

如果由于某种原因，需要使用 Jest 来直接读取 `jest.config.json`, 那么 `disableConfigurationModuleResolution` 插件设置可以用来恢复之前的行为。

例如：

**&lt;project folder&gt;/config/heft.json**

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/heft.schema.json",

  . . .

  "heftPlugins": [
    {
      "plugin": "@rushstack/heft-jest-plugin",
      "options": {
        // (Not recommended) Disable Heft's support for rigs and the "extends" field
        "disableConfigurationModuleResolution": true
      }
    }
  ]
}
```

## 与 ts-jest 的区别

在内部，Jest 通过名为 [transforms](https://jestjs.io/docs/en/tutorial-react#custom-transformers) 的插件来支持 TypeScript 编译，这些插件被设定为一个同步函数，它以 `.ts` 文件为输入，并输出 `.js` 和 `.map` 文件。官方的 `babel-jest` 实际上是一次编译一个文件，但这种方法不能支持诸如 `const enum` 等语言特性来进行分析类型。`ts-jest` 通过执行完整的编译器流程并在每次调用转码时复用之前的操作来解决上述问题，但这不支持诸如预处理器等其他构建步骤。`babel-jest`和 `ts-jest` 在运行测试的时候，都会二次调用编译器，这也会带来很大的性能损耗。

Heft 采取了一种不同的方法，即先执行构建流程，然后在对输出调用 Jest. 如果你的代码在浏览器上运行，则需要使用 [emitFolderNameForTests](.../heft_tasks/webpack.md) 配置来在一个辅助文件夹下输出 CommonJS 格式。（输出额外的文件比调用两次编译器要快得多）。Heft 的 `jest-build-transform.js` 本身不编译任何东西，而是返回整个流程的输出。

在 [heft-node-jest-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-jest-tutorial) 项目中可以找到一些关于模拟和其他 Jest 的示例：

> **使用 Jest 和 Heft 时的重要区别：**
>
> - 请使用 `heft` 来调用 Jest。因为直接调用 `jest` 命令不会调用 TypeScript，并且与 **jest.config.json** 的 `"extends"` 字段不兼容。
>
> - 不要在依赖中添加 `ts-jest` 或 `babel-jest`.
>
> - `@types/heft-jest` 所提供的全局 `mocked()` 函数来替代 `import { mocked } from "ts-jest/utils";`. 除此之外，`ts-jest` 的 [API 文档](https://kulshekhar.github.io/ts-jest/docs/guides/test-helpers/)的剩余内容仍然适用于 Heft.
>
> - `ts-jest` 中将调用 `jest.mock();`. Heft 认为这不是最佳方案。相反，使用[@rushstack/hoist-jest-mock](https://www.npmjs.com/package/@rushstack/eslint-plugin#rushstackhoist-jest-mock) 格式化规则来提醒开发者手动提升函数调用。可以通过 [@rushstack/eslint-config](https://www.npmjs.com/package/@rushstack/eslint-config)启用该功能。

## 调试 Jest 测试用例

推荐使用 VS Code 的 [launch.json 文件](https://code.visualstudio.com/docs/editor/debugging#_launch-configurations) 来调试 Jest, 配置示例如下：

**&lt;project folder&gt;/.vscode/launch.json**

```
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Jest tests",
      "program": "${workspaceFolder}/node_modules/@rushstack/heft/lib/start.js",
      "cwd": "${workspaceFolder}",
      "args": ["--debug", "test", "--clean"],
      "console": "integratedTerminal",
      "sourceMaps": true
    },
  ]
}
```

上述配置启动用了完整的 Heft 工具链。`--debug` 字段防止 Jest 作为一个单独的进程被生成。`--clean` 是可选标志，但它修复了一个边界问题：Jest 的 "haste-map" 可能会被中断的运行所破坏。

为了让调试器只运行一个特定的测试，你可以添加 `--test-name-pattern` 参数。（参考[命令行文档](../heft/cli.md)）。另一个选择是使用 Jest 的 [test.only()](https://jestjs.io/docs/en/api#testonlyname-fn-timeout).

## 参考

- [heft-node-jest-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-jest-tutorial) 示例项目
- Jest 的 [API 参考](https://jestjs.io/docs/en/api)
- [jest.config.json](https://jestjs.io/docs/en/configuration) 文档
