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

---

Heft 是一个由配置驱动的工具链，它调用其他流行工具，如 TypeScript、ESLint、Jest、Webpack 和 API Extractor。你可以用它来构建 web 应用程序、Node.js 服务、命令行工具、库等。Heft 以相同的方式构建所有的 JavaScript 项目：一个有效的方式。

Heft 通常由**package.json**文件中的`"build"`动作启动。它设计用于在可能有数百个项目的 monorepo 中使用，其中[Rush](https://rushjs.io/)协调器在每个项目文件夹中单独调用`"build"`动作。在这种情况下，所有操作必须尽快执行。专门的脚本成为维护的头痛，所以最好用由配置文件驱动的可重用引擎来替代它们。在一个大的 repo 中，你会希望最小化这些配置文件在项目之间的重复。最终，你会希望定义一小套典型的项目类型（称为["rigs"](https://rushstack.io/pages/heft/rig_packages/)）并维护它们，然后阻止项目覆盖 rig 配置。保持一致性可以确保任何人都能轻松地为任何项目做出贡献。Heft 就是所有这些概念的现成实现。

然而，你并不需要一个 monorepo 才能使用 Heft。它也适用于小型的独立项目。与其他类似的系统相比，Heft 有一些独特的设计目标：

- **可扩展**：Heft 与[Rush Stack](https://rushstack.io/)工具系列接口，这些工具是为拥有许多人和项目的大型 monorepo 量身定制的。但是，Heft 并不需要 Rush。

- **优化**：Heft 在每一步都跟踪细粒度的性能指标。TypeScript 插件实现了复杂的优化，如：文件系统缓存、增量编译、多目标发出、Jest/Webpack/ESLint 的统一编译器通道，以及在单独的工作进程中托管编译器。

- **完整**：Rush Stack 希望建立一个全面的解决方案，用于构建典型的 TypeScript 项目。无意见的任务抽象经常与这个目标相悖：优化和支持（以及记录！）每一种可能的技术选择组合是很昂贵的。最好的优化和集成对任务如何交互做出深入的假设。尽管 Heft 引擎本身非常灵活，但我们的哲学是同意一个涵盖广泛场景的标准方法，然后投入使该方法的体验达到最佳。

- **可扩展**：大多数项目都需要至少几个专门的任务，如预处理器、后处理器或加载器。Heft 围绕使用[tapable](https://www.npmjs.com/package/tapable)挂钩系统（熟悉于 Webpack）的插件进行组织。编写你自己的插件很容易。与 Grunt 或 Gulp 等松散的架构相比，Heft 的插件系统是围绕明确易读的配置文件进行组织的。自定义通常会扩展标准的 rig，而不是从头开始。

- **熟悉**：像 Rush 一样，Heft 是一个常规的 Node.js 应用程序 -- 开发人员不需要安装原生的先决条件，如 Python、MSYS2 或.NET Framework。Heft 的源代码易于理解和调试，因为它是 100%的 TypeScript，与你的 web 项目使用的编程语言相同。当然，仍然可以为原生目标进行开发。

- **专业**：Rush Stack 项目由开发大规模商业应用的工程师开发和使用。每个特性都经过设计、公开讨论和深思熟虑的代码审查。破坏性的变化需要我们迁移我们自己的数千个项目，所以与典型的 Node.js 工具相比，升级相对无痛。

<!-- --------------------------------------------------------------------------- -->
<!-- Text above this line should stay in sync with heft's package README.md file -->
<!-- --------------------------------------------------------------------------- -->
