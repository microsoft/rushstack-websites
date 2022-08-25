---
title: '"eslint" task'
---

该任务会调用 [ESLint](https://eslint.org/), 其作用是检查代码中常见错误。

## 何时使用

Rush Stack 推荐使用 ESLint 与其他几个库作为代码校验工具：

- [Prettier](@rushjs/pages/maintainer/enabling_prettier/): Prettier 用来管理琐碎的语法，例如空格、逗号、分号等。它们并不影响代码语义，我们也不会因此来报错影响开发者，它们也不是构建的一部分。相反，Prettier 会通过 `git commit` 的钩子来自动格式化代码。可以查看 Rush 观望中的[启用 Prettier](@rushjs/pages/maintainer/enabling_prettier/) 一文。

- [TypeScript](../heft_tasks/typescript.md): TypeScript 编译器执行复杂的类型检查和语义分析，这是保证程序正确性的重要保障。

- **ESLint**: lint 使用额外的语法规则来辅助编译器检查代码，这些规则十分主观并高度可定制。TypeScript 可能会检查到 _"函数参数是一个字符串但是被声明称了一个数字"_，但是 ESLint 可能会检查到 _"这个类名应该使用帕斯卡命名法而不是驼峰命名法"_。不同于 Prettier, ESLint 修复问题可能需要一个大的代码变更，并且甚至可能会破坏 API 一致性。

- [API Extractor](../heft_tasks/api-extractor.md): 额外校验库包的有效性。它可以确保 API 正常工作并具有正确的文档。

尽管建议以上述方式配置你的构建系统，但 Heft 并不要求采用特定的方法。上述组件中都是可选的，而且其他配置也是允许的。例如，旧的代码库可能需要使用 [TSLint](../heft_tasks/tslint.md) 来代替 ESLint.

## package.json dependencies

你需要在项目内安装 `eslint` 包：

```bash
$ rush add --package eslint --dev
```

另外，你可以通过从 [与 Rush 交互](../heft_tutorials/heft_and_rush.md) 一文中描述的 "rig package" 中加载来避免添加该依赖。然而，如果你使用 [VS Code 内的 ESLint 插件](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)，它将尝试从你的项目文件夹中解析 `eslint`.此时需要将 ESLint 添加到 **package.json** 文件中来确保插件可用。(该扩展也能够加载一个全局安装的 `eslint`, 但版本可能与本地分支所要求的版本不一致)。

## 配置文件

该任务在 Heft 内并没有一个专用的配置文件。Heft 会寻找 ESLint 的配置文件。尽管 ESLint 支持 [7 种不同](https://eslint.org/docs/user-guide/configuring#configuration-file-formats)的名称、格式的配置文件，但 Heft 只会寻找 **".eslintrc.js "**. 这有几个有点：

- **一致性：**使用统一的 **".eslintrc.js "** 可以简化搜索文件、批量编辑、在项目之间复制配置更方便。
- **临时解决办法：**使用 `.js` 扩展可以在文件内使用 JavaScript 表达式。但由于表达难以验证、依赖对缓存不可见的环境等原因，通常不使用该方法。然而，由于历史原因，ESLint 的配置文件格式有一些限制只能通过脚本来解决（例如，使用 `__dirname` 来解析文件路径）。

不建议将 **.eslintrc.js** 放在 monorepo 根目录中，因为它违反了 Rush 的原则，即项目独立、且容易在 monorepos 之间移动。

相反，每个项目应该有自己的 \*_.eslintrc.js_ \*文件。我们推荐使用 [@rushstack/eslint-config](https://www.npmjs.com/package/@rushstack/eslint-config) 来共享配置，它是基于 [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) 规则集来专门为大规模的 monorepos 定制的。同时，如果你需要额外的自定义 lint 规则，建议创建一个基于 `@rushstack/eslint-config` 的自定义的 NPM 包。

采用上述方法，ESLint 配置文件的内容会非常少，例如：

**&lt;project folder&gt;/.eslintrc.js**

```ts
// 用于解决 https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['@rushstack/eslint-config/profile/node'],
  parserOptions: { tsconfigRootDir: __dirname }
};
```

### Profiles and mixins

目前 `@rushstack/eslint-config` 提供了三种不同的**格式化配置**：

- `@rushstack/eslint-config/profile/node`- 为 Node.js 服务准备
- `@rushstack/eslint-config/profile/node-trusted-tool` - 为 Node.js 工具准备
- `@rushstack/eslint-config/profile/web-app` - 为浏览器应用准备。

它也支持**格式化规则混用**，按需添加以下规则：

- `@rushstack/eslint-config/mixins/react` - 当你使用 React 时
- `@rushstack/eslint-config/mixins/friendly-locals` - 当你喜欢使用更繁琐的声明时
- `@rushstack/eslint-config/mixins/tsdoc` - 当在项目内使用 API Extractor 时

[@rushstack/eslint-config 文档](https://www.npmjs.com/package/@rushstack/eslint-config)更详细的解释了以上选项。
