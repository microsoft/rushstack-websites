---
title: Overview
hide_title: true
custom_edit_url: null
---

<div>
  <img src="/images/site/heft-logo.svg" alt="heft" title="heft" style={{ width: '380px', paddingTop: '30px' }} />
  <p />
</div>

<!-- --------------------------------------------------------------------------- -->
<!-- Text below this line should stay in sync with heft's package README.md file -->
<!-- --------------------------------------------------------------------------- -->

Heft 是一个由配置驱动的工具链，它调用其他流行的工具，如 TypeScript、ESLint、Jest、Webpack 和 API Extractor。你可以用它来构建 Web 应用程序、Node.js 服务、命令行工具、库等等。Heft 以相同的方式构建所有的 JavaScript 项目：一种离效的方式。

Heft 通常由**package.json**的命令，如`"npm run build"`或`"npm run test"`来启动。它设计用于在一个可能有数百个项目的 monorepo 中使用，其中[Rush](https://rushjs.io/)协调器在每个项目文件夹中单独调用这些命令。在这种情况下，一切都必须尽可能快地执行。专门的脚本变得头疼难以维护，所以最好用一个由配置文件驱动的可重用引擎来替换它们。在一个大的仓库中，你会想要最小化这些配置文件在项目之间的重复。最终，你会想要定义一个小的典型项目类型集
(["rigs"](https://rushstack.io/pages/heft/rig_packages/))来官方支持，然后阻止项目覆盖 rig 配置。保持一致性可以确保任何人都可以轻松地为任何项目做出贡献。Heft 是所有这些概念的现成实现。

然而，你并不需要一个 monorepo 就可以使用 Heft。它也非常适合小型的独立项目。相比其他类似的系统，Heft 有一些独特的设计目标：

- **可扩展**：Heft 与[Rush Stack](https://rushstack.io/)工具家族接口，这些工具是为大型的、拥有许多人和项目的 monorepos 量身定做的。虽然，Heft 并不需要 Rush。

- **优化**：Heft 在每一步都跟踪精细的性能指标。TypeScript 插件实现了诸如：文件系统缓存、增量编译、同时多目标发射和对 Jest/Webpack/ESLint 的统一编译器通道等复杂的优化。JSON 配置文件和插件清单使得无需评估可能效率低下的脚本代码就能快速查询元数据。

- **完整**：Rush Stack 渴望建立一个完全实现的解决方案来构建典型的 TypeScript 项目。非常规的任务抽象经常与这个目标相悖：优化和支持（和文档！）每一种可能的技术选择组合都是昂贵的。最好的优化和整合做了深入的假设，关于任务将如何交互。尽管 Heft 引擎本身非常灵活，但我们的理念是同意一个覆盖广泛范围的场景的标准方法，然后投入在为这种方法制造最好的体验。

- **可扩展**：大多数项目至少需要一些特殊的任务，如预处理器、后处理器或加载器。Heft 围绕使用[tapable](https://www.npmjs.com/package/tapable)钩子系统（来自 Webpack）的插件进行组织。强类型的 API 使得编写自己的插件变得容易。与 Grunt 或 Gulp 这样的松散架构相比，Heft 的插件系统是围绕明确易读的配置文件进行组织的。定制通常会扩展一个标准的 rig，而不是从头开始。

- **熟悉**：像 Rush 一样，Heft 是一个常规的 Node.js 应用程序——开发人员不需要安装如 Python、MSYS2 或.NET 框架等本地前提条件。Heft 的源代码易于理解和调试，因为它是 100%的 TypeScript，与你的 Web 项目使用的编程语言相同。当然，仍然可以为本地目标进行开发。

- **专业**：Rush Stack 项目是由为开发大型商业应用的工程师开发的。每个功能都是设计、在公开中讨论并仔细地进行代码审查的。破坏性的变化需要我们迁移我们自己的数千个项目，所以与典型的 Node.js 工具相比，升级相对无痛。

<!-- --------------------------------------------------------------------------- -->
<!-- Text above this line should stay in sync with heft's package README.md file -->
<!-- --------------------------------------------------------------------------- -->
