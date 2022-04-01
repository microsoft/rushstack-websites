---
title: Heft 架构
---

## 属于

以下概念对理解 Heft 的设计很重要：

- **action** - Heft 命令行下的动词（根据 Rush Stack 中的 [ts-command-line](https://www.npmjs.com/package/@rushstack/ts-command-line) 定义）。例如，"test" 就是 `heft test --clean` 命令中的 "action". action 是与用户之间的交互，是为开发者量身定制的宏。
- **plugin** - 它是一个 **TypeScript** 类，以 `IHeftPlugin` 接口为基础来实现任意的功能。plugin 会一句 Heft 的配置来选择性地加载。
- **plugin package** - an NPM package that provides one or more Heft plugins. You can create your own NPM package that exports custom plugins for Heft to use. See [Core Plugins](./core_plugins.md) for a list of the built-in plugins.
- **plugin package** - 它是一个提供更多 Heft 插件的 NPM 包。你可以创建自己的 NPM 包来到处更多的 Heft 插件。查看[核心插件](./core_plugins.md)一文来寻找更多的内置插件。
- **hook** - Heft 借助 Webpack 的 [tapable](https://www.npmjs.com/package/tapable) 系统来在构建期间为各种事件注册插件。
- **task** - 一个 Heft 概念，它描述了被一些工具调用后带有输出的操作。例如，`Typescript` 和 `eslint` 便是 Heft 的任务，不同于其他系统，Heft 中的任务并不是真实的代码或组件，例如 `TypeScripPlugin` 对象实现了三个独立的任务（`typescript`, `eslint` 和 `tslint`），它们的代码是整合在一起的。
- **stage** - 包括多个 Heft 任务的工作序列。当调用 Heft 时，命令行会选择一系列有用的 stages 来运行。stage 也可以用来分组日志输出。例如，Heft 的 stage 可以是 "clean", "build", "test"。
- **rig package** - 一个提供了 Heft 配置的 NPM 报，这些包可以在多个有类似需求的项目内重复使用。关于设计细节可以查看 [@rushstack/rig-package](https://www.npmjs.com/package/@rushstack/rig-package) 一文。
- **rig profile** - 从 rig 保重获取到的命名配置。一个 rig 包可以提供多个配置。例如，它可以为应用程序项目和库项目提供不同的配置。

&nbsp;

> **Future plans:** 现今 Rush 命令只能调用 Heft action. 然而，未来我们想实现一个“多阶段构建”的功能，该功能可以使 Rush 能够协调更细化的工作流程。例如，一旦一个库的依赖已经好了编译了它的输出，Rush 可以在该库跑完它的单元测试之前开始构建应用程序。这个功能会带来一些额外的术语：
>
> - **command** - monorepo 仓库中的命令被全局的定义在 [command-line.json](@rushjs/pages/configs/command-line_json/).
> - **phase** - 与 Heft 的 "stage" 类似， 但是它的各个阶段会被定义在全局，Rush 可以对其依赖进行建模。
