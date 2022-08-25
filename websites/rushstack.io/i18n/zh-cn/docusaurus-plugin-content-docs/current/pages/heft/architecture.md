---
title: Heft 架构
---

## 术语

以下概念对理解 Heft 的设计很重要：

- **action** - Heft 命令行动作（根据 Rush Stack 中的 [ts-command-line](https://www.npmjs.com/package/@rushstack/ts-command-line) 定义）。例如，"test" 就是 `heft test --clean` 命令中的 "action"。 action 是与用户之间的交互，是为开发者量身定制的宏。
- **plugin** - 它是一个 **TypeScript** 类，以 `IHeftPlugin` 接口为基础来实现任意的功能。plugin 会根据 Heft 的配置来选择性地加载。
- **plugin package** - 这个 NPM 包可以提供一个或多个 Heft 插件。你可以创建自己的 NPM 包并导出自定义插件提供给 Heft 使用。查看[核心插件](../heft/core_plugins.md)一文来寻找更多的内置插件。
- **hook** - Heft 借助 Webpack 的 [tapable](https://www.npmjs.com/package/tapable) 系统来在构建期间为各种事件注册插件。
- **task** - 一个 Heft 概念，它描述了被一些工具调用后带有输出的操作。例如，`Typescript` 和 `eslint` 便是 Heft 的任务，不同于其他系统，Heft 中的任务并不是真实的代码或组件，例如 `TypeScripPlugin` 对象实现了三个独立的任务（`typescript`, `eslint` 和 `tslint`），它们的代码是整合在一起的。
- **stage** - 包括多个 Heft 任务的工作序列。当调用 Heft 时，命令行会选择一系列有用的 stages 来运行。stage 也可以用来分组日志输出。例如，Heft 的 stage 可以是 "clean", "build", "test"。
- **rig package** - 一个提供了 Heft 配置的 NPM 包，这个包可以在多个有类似需求的项目内重复使用。关于设计细节可以查看 [@rushstack/rig-package](https://www.npmjs.com/package/@rushstack/rig-package) 一文。
- **rig profile** - 从 rig 包中获取到的命名配置。一个 rig 包可以提供多个配置。例如，它可以为应用程序项目和库项目提供不同的配置。

&nbsp;

> **Future plans:** 现今 Rush 命令只能调用 Heft action。 然而，未来我们想实现一个“多阶段构建”的功能，该功能可以使 Rush 能够协调更细化的工作流程。例如，一旦一个库的依赖已经完成编译并输出，Rush 可以在该库跑完它的单元测试之前开始构建应用程序。这个功能会带来一些额外的术语：
>
> - **command** - 一个全局定义的 monorepo 仓库中的命令在 [command-line.json](@rushjs/pages/configs/command-line_json/) 中。
> - **phase** - 与 Heft 的 "stage" 类似， 但是它的各个阶段会被定义在全局，Rush 可以对其依赖进行建模。
