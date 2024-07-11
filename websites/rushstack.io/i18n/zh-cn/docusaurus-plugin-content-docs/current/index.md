---
title: Rush Stack 是什么
hide_title: true
---

## Rush Stack 是什么

**Rush Stack** 是：

- **使命**：为 web 项目的大规模 monorepo 仓库来提供可复用技术
- **开放协作**：汇集了社区的合作者们，面对严苛的工具，你不再单打独斗
- **具体策略**：整合诸如 Node.js, TypeScript, ESLint, Prettier, Webpack, Jest 等一系列流行的工具最终形成解决方案
- **一系列项目**：同宗同源，项目之间紧密合作

如今我们选择将多年的沉淀的各个部分统筹到 **Rush Stack** 的统一框架下。你可以在 [News](pages/news.md) 页面上跟踪我们的进展。

## Rush Stack 里有什么？

在 **Rush Stack** 中，主要有以下项目：

- [Rush](@rushjs/): 可扩展的 monorepo 构建编排工具。
- [Heft](@heft/): 可以与 Rush 交互的可扩展构建系统。
- [API Extractor](@api-extractor/): 为工具库审阅 API 并生成 .d.ts 文件。
- [API Documenter](@api-extractor/pages/setup/generating_docs): 生成你的 API 文档站。
- [@rushstack/eslint-bulk](https://www.npmjs.com/package/@rushstack/eslint-bulk):
  使你能够在你的 monorepo 中推出新的 lint 规则，而无需在源文件中添加成千上万个机器生成的 `// eslint-ignore-next-line` 指令，从而避免混乱。
- [@<!---->rushstack/eslint-config](https://www.npmjs.com/package/@rushstack/eslint-config): 专门为大型 TypeScript monorepo 仓库设计的 ESLint 规则集。
- [@rushstack/eslint-patch](https://www.npmjs.com/package/@rushstack/eslint-patch):
  增强 ESLint 对大型 monorepo 的支持的补丁。
- [@<!---->rushstack/eslint-plugin-packlets](https://www.npmjs.com/package/@rushstack/eslint-plugin-packlets):
  “Packlets”可用于在单个项目内来组织代码文件，作为替代 NPM 发包的一个轻量级解决方案。
- [Lockfile Explorer](https://lfx.rushstack.io/): 帮助你在使用 Rush monorepo 时调查和解决版本冲突问题。
- [Rundown](https://www.npmjs.com/package/@rushstack/rundown): 用于优化 Node.js 启动时间的工具。
- [@rushstack/trace-import](https://www.npmjs.com/package/@rushstack/trace-import): 我们的命令行工具，用于调试 `import` 和 `require()` 解析模块的方式。

以上项目建立在一个可复用的库框架上，这个框架包括：

- [ts-command-line](https://www.npmjs.com/package/@rushstack/ts-command-line): 一个严格的命令行解析器，可以通过内置支持 PowerShell 和 Bash 的工具链来添加选项和文档。
- [node-core-library](https://www.npmjs.com/package/@rushstack/node-core-library): 被仓库内所有项目使用的核心库。
- [package-deps-hash](https://www.npmjs.com/package/@rushstack/package-deps-hash): Rush 使用的增量构建引擎。
- [rig-package](https://www.npmjs.com/package/@rushstack/rig-package): 用于不同项目内共享配置，它使得无需重复配置文件。
- [stream-collator](https://www.npmjs.com/package/@rushstack/stream-collator): 保证 Rush 在并行任务之间显示实时日志，且没有丑陋的错行输出。
- [tree-pattern](https://www.npmjs.com/package/@rushstack/tree-pattern): JavaScript 树结构的模式匹配，用于 lint 规则。
- [一系列 webpack 插件](https://github.com/microsoft/rushstack/tree/master/webpack)，它们对构建页面应用很有用。

## Rush Stack 与 Rush 什么关系？

当你使用 [Rush](@rushjs/) 时，“Rush Stack”内的组件是可选的。

作为**构建调度器**，Rush 的主要工作是：

- 确保确定性和稳定的包安装（使用 Yarn, PNPM 或 NPM）
- 按照正确的顺序并尽可能快的构建项目
- 使用一系列策略来保证你的 monorepo 顺利地执行
- 管理你的发布流程
- 建立一个标准的仓库结构和熟悉的 CLI 工具，以便开发者可以在多个不同的 monorepo 中提交代码

除了上述作用外，Rush 将其余的事情留给了你。个人项目中可以分别使用你喜欢的任何工具链来构建，这是非常灵活的！

但是灵活性也有缺点，Node.js 工具因其令人纠结的技术栈而臭名昭著：选择编译工具、选择格式化工具、选择打包工具、选择包管理工具、选择任务引擎、选择测试工具、选择断言库等等。一旦你做出选择，就需要整合这些部件，而这些部件本身就是一个软件项目。随着规模的增大，这些成本也迅速增加。

2019 年夏天，我们启动了 **Rush Stack**, 其目标是为上述问题提供一个可复用的解决方案。当然，你可以依然只使用 Rush 本身，但是当你厌倦于独自配置时，我们邀请你：

- 权衡灵活性，选定一套由开发大型 monorepo 的专家提供的方案
- 与社区内正在探索这些方法的开发者合作
- 帮助我们深入探索各种构建工具的集成，优化，文档和美化，以达到世界级开发者体验
