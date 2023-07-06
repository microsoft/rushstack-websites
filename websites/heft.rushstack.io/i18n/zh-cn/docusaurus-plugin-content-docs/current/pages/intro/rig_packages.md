---
title: 使用 rig
---

大型项目下，在不同项目下使用完全相同的 Heft 配置十分常见。但也可能有一些差异 —— 例如，Node.js 项目生成 CommonJS 模块，然而 web 应用生成 ESNext 模块。但通常而言，一小撮相同的“配置文件”可以覆盖绝大部分项目。我们可以通过将通用配置移动到 NPM 包中，并将该包添加到 `"devDependencies"` 中避免重复。这就是 **rig 包**. 注意单个 NPm 包可能包含多个不同的 **rig 档案**，每个档案是一个包含一组配置文件的文件夹。

Heft 提供了两种标准的 rig 包，可以在你的项目中使用：

- [@rushstack/heft-node-rig](https://www.npmjs.com/package/@rushstack/heft-node-rig) 它包含一个名为 `default` 的配置档案
- [@rushstack/heft-web-rig](https://www.npmjs.com/package/@rushstack/heft-web-rig) 它包含一个名为 `library` 的配置档案

当然，定义自己的 rig 包也很简单。

[heft-node-rig-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-rig-tutorial) 是一个介绍如何使用 `@rushstack/heft-node-rig` 的示例仓库。

让我们来看用 rig 包的影响构建的三种方式：

## 1. 针对 `"extends"` 的基础文件

许多配置文件提供了继承自另一个文件的功能。例如，在我们的示例项目中，TypeScript 的配置被减少到只有几行：

**heft-node-rig-tutorial/tsconfig.json**

```js
{
  "extends": "./node_modules/@rushstack/heft-node-rig/profiles/default/tsconfig-base.json",
  "compilerOptions": {
    "types": ["heft-jest", "node"]
  }
}
```

大部分的设置源自 `default` 配置档案中的 `tsconfig-base.json`. 同时本地的 **tsconfig.json** 文件可以按需添加 `"types"` 等自定义设置。

以下配置文件都支持诸如 "extends" 的字段，以便设置可以从另一个 NPM 包继承配置：

- **.eslintrc.js** 用于 [eslint task](../tasks/eslint.md), 提供了 [@rushstack/eslint-patch](https://www.npmjs.com/package/@rushstack/eslint-patch) 的解决方法，或者使用 [@rushstack/eslint-config](https://www.npmjs.com/package/@rushstack/eslint-config) 规则集（包含了 `@rushstack/eslint-patch`）
- **config/api-extractor.json** 用于 [api-extractor task](../tasks/api-extractor.md)
- **config/jest.config.json** 用于 [jest task](../tasks/jest.md)
- **tsconfig.json** 用于 [typescript task](../tasks/typescript.md)
- **tslint.json** 用于 [tslint task](../tasks/tslint.md)
- **webpack.config.js** 不直接支持集成，但是它是一个 JavaScript 模块，可以通过 `require()` 来加载共享配置。

## 2. "Riggable" 配置文件

在上面示例中，我们不能完全消除 **tsconfig.json**, 因为诸如 VS Code 等工具会在项目根目录下寻找该文件。对于 **.eslintrc.js** 等其他文件也是如此。除了这些特殊情况外，大多数其他的 Heft 配置文件可以通过创建一个 **rig.json** 来完全消除，示例可参考 `heft-note-rig-tutorial` 项目。

**heft-node-rig-tutorial/config/rig.json**

```js
// "rig.json" 文件来指导不同的工具在外部包中寻找它们的对应配置文件。
// 关于该系统的文档可参考： https://www.npmjs.com/package/@rushstack/rig-package
{
  "$schema": "https://developer.microsoft.com/json-schemas/rig-package/rig.schema.json",

  /**
   * （必须）继承的 rig 包的名字。
   * 它要求 NPM 包必须带有 "-rig" 的后缀。
   */
  "rigPackageName": "@rushstack/heft-node-rig"

  /**
   * （可选） 从 rig 包的配置档案中选择一个。
   * 该命名要求是一个小写字母，用连字符分割，例如 "sample-profile".
   * 如果省略，则使用 "default" 配置档案
   */
  // "rigProfile": "your-profile-name"
}
```

**rig.json** 文件告知 Heft， 如果在 **heft-node-rig-tutorial/config** 中没找到相应的配置，那么尝试 **@rushstack/heft-node-rig/profiles/default/common** 中进行寻找。

"riggable" 配置文件示例：

- **&lt;project folder&gt;/config/api-extractor-task.json**
- **&lt;project folder&gt;/config/heft.json**
- **&lt;project folder&gt;/config/typescript.json**

## 3. Riggable 依赖

rig 包也提供了 NPM 依赖，为了避免在项目的 `devDependencies` 指定某些依赖。rig 已经提供了以下工具包：

- `typescript`
- `@microsoft/api-extractor`
- `eslint`
- `tslint`

目前，rig 只提供了这些包。通过 rig 来提供依赖是一个可选项，你本地项目的 `devDependencies` 优先于 rig.

Heft 通过以下方法来查找每个依赖：

1. 如果本地项目内的某个依赖列在 `devDependencies` 中，那么这个工具将从当前文件夹下解析（该步骤不考虑 `dependencies` 或 `peerDependencies`）。

2. 否则，如果当前项目存在 **rig.json** 文件，并且 rig 的 **package.json** 将工具列举在 `dependencies` 下，那么会从 rig 包的目录中解析这些工具（该步骤不考虑 `devDependencies` 或 `peerDependencies`）。

3. 否则，会从当前项目的目录中解析工具，如果找不到，则会报错。

> **注意：** 早于 0.25.0 的版本中，Heft 使用了
> [不同的查找策略](https://github.com/microsoft/rushstack/pull/2539)，
> 该策略并不依赖 **rig.json** 文件，它的工作方式如下：当解析某个工程的 **tsconfig.json** 时，
> 如果它的 `extends` 字段指向了某个 NPM 包。Heft 会查看该包是否有直接依赖于 `typescript`,
> 如果依赖，那么将在该文件夹下解析所有的 riggable 工具。

Heft 本身直接依赖以下软件包，所以你的项目不需要依赖它们：

- `webpack` 和 `webpack-dev-server`
- `jest` 以及它的核心依赖

## 参考

- [@rushstack/rig-package](https://www.npmjs.com/package/@rushstack/rig-package) 文档介绍了 **rig.json** 的实现。
- [heft-node-rig-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-rig-tutorial) 示例项目。
