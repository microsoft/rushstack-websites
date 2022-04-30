---
title: Heft 介绍
hide_title: true
---

<div>
  <img src="/images/heft-logo-horse.svg" alt="heft" title="heft" style={{ width: '380px', paddingTop: '30px' }} />
  <p />
</div>

<!-- --------------------------------------------------------------------------- -->
<!-- Text below this line should stay in sync with heft's package README.md file -->
<!-- --------------------------------------------------------------------------- -->

Heft 是一个配置驱动的工具链，它用于调用诸如 TypeScript, ESLint, Jest, API Extractor 等流行的工具。你可以使用它来构建 web 应用、Node.js 服务、命令行工具、库等等。Heft 以一种有效、一致的方式来构建你的 JavaScript 项目。

Heft 通常由 **package.json** 中的 `"build"` 脚本调用。Heft 被设计用于 Rush 管理的可能有数百个项目的 monorepo 中，在该仓库下 [Rush](@rushjs/) 会单独在每个项目下调用 `"build"` 脚本。此时，一切都必须尽可能快地执行。带有特殊用途的脚本维护起来很麻烦，因此最好用一个由配置文件驱动、可复用的引擎来替代它们。在大型仓库中的不同项目下，你会希望减少配置文件的重复。最终，你会维护用于重复定义的一小部分项目类型(["rigs"](https://rushstack.io/pages/heft/rig_packages/))，随后不鼓励项目覆盖这些配置。一致性的配置可以保证任何人都可以轻松地参与到任何项目中。Heft 实现了这些概念。

然而，一些小型、独立的 monorepo 中不使用 Heft 也可以良好的工作。与其他类似的系统相比，Heft 具有一些独特的设计目标：

- **可扩展**： Heft 可以与 [Rush Stack](https://rushstack.io/) 内工具进行交互，它们是专门为大型多人项目设计的。尽管 Heft 并不依赖 Rush.

- **良好优化**： Heft 记录了每一步中的性能指标。尽管 Heft 依然处于早期阶段，但是 TypeScript 插件已经实现了诸如文件缓存、增量变异、缓存文件的符号连接来减少拷贝时间，将编译器放到一个单独的进程中，为 Jest 和 Webpack 提供统一的编译流程等优化。

- **完整的**： Rush Stack 希望为 TypeScript 项目创建一个完全可行的解决方案。毫无主见的抽象往往与该目标背道相驰：优化和支持（包括文档）每一个可能的技术栈非常耗时耗力，最好的优化和集成对所有可能的任务进行了许多假设，Heft 是有主见，我们的目标是在工具链上达成一致，这些工具链在大多数场景下可以良好工作，然后深度投入，最终来带良好的体验。

- **可扩展的**： 大多数项目至少需要一些诸如前置处理、后置处理或者加载等任务。Heft 由一系列基于 [tapable](https://www.npmjs.com/package/tapable) 的插件组成（与 Webpack 类似），边写自己的插件很容易。不同于 Grunt 或 Gulp 的松散架构，Heft 提供了一个预定义的“阶段”来注册自定义任务，有了这么一个标准化的起点，就可以在自定义 rigs 得到更轻松的技术支持。

- **熟悉的**：与 Rush 类似，Heft 是一个 Node.js 应用 —— 开发者不需要下载任何诸如 Python, MSYS2, 或 .NET 框架等前置。由于是 100% 的 TypeScript 项目，因此 Heft 的源代码很容易理解和调。当然，写成编译形项目也是有可能的。

- **专业的**：Rush Stack 项目是由一群从事商业项目的工程师开发的。每一个功能都经过精心设计、开放讨论、充分审查后实现的。尽管是一个免费的社区协作，但是未来的很多年，我们将以此为依托进行开发。

<!-- --------------------------------------------------------------------------- -->
<!-- Text above this line should stay in sync with heft's package README.md file -->
<!-- --------------------------------------------------------------------------- -->

## 如何开始

- [使用 Heft 来开始](../heft_tutorials/getting_started.md) 一文提供了使用 Heft 建立项目的示例。

- 它在 NPM 上的包是： [@rushstack/heft](https://www.npmjs.com/package/@rushstack/heft)

- [与 Rush 交互](../heft_tutorials/heft_and_rush.md) 一文解释了 Heft 与 Rush 如何交互使用

- [Heft 架构](./architecture.md) 一文描述了构建系统的设计细节

## 链接

- [CHANGELOG.md](https://github.com/microsoft/rushstack/blob/master/apps/heft/CHANGELOG.md) - 查看最新版本有什么变化
- [UPGRADING.md](https://github.com/microsoft/rushstack/blob/master/apps/heft/UPGRADING.md) - 将现有羡慕迁移到较新的 Heft 的说明
- [API 索引](https://api.rushstack.io/pages/heft/)

## 工程示例

以下几个文件夹提供了一些简单的 Rush monorepo 下使用 Heft 项目示例：

- [heft-node-basic-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-basic-tutorial): 使用 Jest 和 ESLint 的基本 Node.js 项目

- [heft-webpack-basic-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-webpack-basic-tutorial): 使用 Webpack 打包的基本 web 项目
