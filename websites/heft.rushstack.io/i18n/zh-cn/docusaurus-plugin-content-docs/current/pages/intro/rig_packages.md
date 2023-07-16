---
title: 使用rig包
---

在大规模的环境中，许多项目使用完全相同的 Heft 配置进行构建是有益的。可能存在一些细微差别——例如，一个 Node.js 项目可能需要输出 CommonJS 模块，而一个 web 应用程序项目可能需要输出 ESNext 模块。但通常，少数几个常见的"配置文件"（profile）就能涵盖大多数项目。[@rushstack/rig-package](https://www.npmjs.com/package/@rushstack/rig-package)系统为将常见设置移入添加到消费它的项目的`"devDependencies"`中的 NPM 包提供了一种正式化的机制。这就叫做**rig package**。注意，同一个 NPM 包可能产生几个不同的**rig profile**；每个配置文件都是一个包含一组配置文件的文件夹。

## 一些具体示例

Heft 也提供了两个你可以在项目中使用的标准 rig package：

- [@rushstack/heft-node-rig](https://github.com/microsoft/rushstack/tree/main/rigs/heft-node-rig)有一个叫做`default`的 profile
- [@rushstack/heft-web-rig](https://github.com/microsoft/rushstack/tree/main/rigs/heft-web-rig)有`app`和`library`两个 profiles

按照这些示例定义你自己的自定义 rig package 也很简单。

[heft-node-rig-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-rig-tutorial)示例项目演示了如何使用`@rushstack/heft-node-rig`。

## 配置的原则

[@rushstack/rig-package](https://www.npmjs.com/package/@rushstack/rig-package)定义了"配置"（rigging）的概念，但仅提供一个基于**rig.json**配置文件解析文件路径的 API。将配置应用到现有工具需要超越此 API 的额外逻辑，不同的工具可能需要不同的实现。Heft 已经为其官方插件实现了这样的逻辑，但如果你有使用 Heft 以外的其他工具链的项目，你可以通过复制 Heft 的同样的方法使它们可配置。

配置涉及三个不同的特性：

### 1. 用于`"extends"`的基础文件

许多配置文件提供了一种继承另一个文件的共享设置的功能，这是重用配置的一种简单方式。例如，在我们的样例项目中，TypeScript 配置只减少到几行：

**heft-node-rig-tutorial/tsconfig.json**

```js
{
  "extends": "./node_modules/@rushstack/heft-node-rig/profiles/default/tsconfig-base.json",
  "compilerOptions": {
    "types": ["heft-jest", "node"]
  }
}
```

大部分的设置都来自`default`配置文件中的`tsconfig-base.json`。但是我们本地的**tsconfig.json**文件可以根据需要添加如`"types"`之类的自定义设置。

以下配置文件都支持一个字段如`"extends"`，该字段可以继承来自另一个 NPM 包的设置：

- **.eslintrc.js**用于[lint task](../plugins/lint.md)，只要你使用[@rushstack/eslint-patch](https://www.npmjs.com/package/@rushstack/eslint-patch)的解决方法或[@rushstack/eslint-config](https://www.npmjs.com/package/@rushstack/eslint-config)的规则集（包含补丁）
- **config/api-extractor.json**用于[api-extractor task](../plugins/api-extractor.md)
- **config/jest.config.json**用于[jest task](../plugins/jest.md)；Jest 常规使用`"preset"`字段用于继承，但是它有一些问题，所以 Heft 用`@rushstack/heft-config-file`引擎替换了 Jest 的配置加载器，然后我们使用`"extends"`而非`"preset"`。在所有其他方面，此文件具有标准的 Jest 格式。
- **tsconfig.json**用于[typescript task](../plugins/typescript.md)
- **webpack.config.js**并未显式支持继承，但作为一个 JavaScript 模块，它可以调用`require()`来加载共享设置。

### 2. 可配置的配置文件

尽管`"extends"`可以使文件变小，但不能完全消除它们。**rig.json**文件可以完全消除大部分 Heft 配置文件。我们说这样的文件是"可配置"的配置文件。以下是来自`heft-node-rig-tutorial`项目的一个例子：

**heft-node-rig-tutorial/config/rig.json**

```js
// "rig.json" 文件引导工具去外部包中查找它们的配置文件。
// 此系统的文档：https://www.npmjs.com/package/@rushstack/rig-package
{
  "$schema": "https://developer.microsoft.com/json-schemas/rig-package/rig.schema.json",

  /**
   * (必须的)要继承的 rig package 的名称。
   * 它应该是一个带有 "-rig" 后缀的 NPM 包名。
   */
  "rigPackageName": "@rushstack/heft-node-rig"

  /**
   * (可选的)从 rig package 中选择一个配置文件。名称必须由
   * 用连字符分隔的小写字母数字单词组成，例如 "sample-profile"。
   * 如果省略，则将使用 "default" 配置文件。"
   */
  // "rigProfile": "your-profile-name"
}
```

**rig.json**文件告诉 Heft，如果它在**heft-node-rig-tutorial/config**中找不到文件，那么它应该尝试在**@rushstack/heft-node-rig/profiles/default/common**文件夹中寻找。

"可配置"配置文件的例子：

- **&lt;项目文件夹&gt;/config/api-extractor-task.json**
- **&lt;项目文件夹&gt;/config/heft.json**
- **&lt;项目文件夹&gt;/config/typescript.json**

我们不能完全消除**tsconfig.json**，因为像 VS Code 这样的工具期望在项目文件夹的根目录中找到这个文件。其他一些文件如**.eslintrc.js**也是如此。在这个网站上，每个配置文件的文档都会指定它是否可配置。

### 3. 可配置的依赖

一个 rig package 也可以提供 NPM 依赖，避免在项目中指定他们为`"devDependencies"`。以下工具包可以由 rig 提供（只要他们不被需要作为其他项目依赖的`peerDependencies`）：

- `@microsoft/api-extractor`
- `eslint`
- `jest` 和相关的包
- `tslint`
- `typescript`
- `webpack` 以及它的加载器和插件

通过 rig 提供依赖是可选的。你本地项目的`devDependencies`优先级高于 rig。

Heft 使用以下流程分别解析每一个可配置的工具：

1. 如果工具包在本地项目的`devDependencies`中列出，那么工具将从当前项目文件夹中解析。（这个步骤不考虑`dependencies`或`peerDependencies`。）

2. 否则，如果当前项目有一个**rig.json**文件，并且 rig 的**package.json**在它的`dependencies`中列出了该工具，那么工具将从 rig package 文件夹中解析。（这个步骤不考虑`devDependencies`或`peerDependencies`。）

3. 否则，工具将从当前项目文件夹中解析。如果在那里找不到，那么就会报告一个错误。

## 另见

- [@rushstack/rig-package](https://www.npmjs.com/package/@rushstack/rig-package) 文档提供了**rig.json**系统的完整规范
- [heft-node-rig-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-rig-tutorial) 样例项目
