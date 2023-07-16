---
title: Heft架构
---

## 先读这个 🎈

以下是 Heft 最重要的一些概念的快速总结：

### Action

在 Heft 的术语中，"action"是命令行动词，由 Rush Stack 的[ts-command-line](https://www.npmjs.com/package/@rushstack/ts-command-line)系统规范化。使用`heft --help`来查看可用的 actions。`clean`和`run` actions 是由 Heft 本身提供的；其它的是由你的**heft.json**配置生成的。

**例子：**一个 shell 命令`heft test --clean`正在调用`test` action。

> **注意：**Heft 的早期版本也使用"action"这个词来表示**heft.json**中的`eventActions`。这个术语现在已经不再使用。

### Parameter

Actions 支持各种命令行"parameters"以调整行为。一些 parameters 是由 Heft 本身定义的；其他的是由 Heft plugins 贡献的。

**例子：**一个 shell 命令`heft test --clean`正在使用`--clean` parameter。

### Task

Heft "tasks"在你的项目的**heft.json**配置文件的`tasksByName`部分中定义。Tasks 通常读取输入文件和/或生成输出文件，通常通过调用如 TypeScript 或 ESLint 这样的熟悉的工具。每个 task 加载一个 Heft task plugin（见下文）。两个不同的 tasks 可以加载同一个 plugin。Tasks 可以相互依赖，这决定了调度顺序。

**例子：**`@rushstack/heft-web-rig`配置[定义](https://github.com/microsoft/rushstack/blob/9ffb14519dd42e5808e56bc2ea80c8734f5f2e5b/rigs/heft-web-rig/profiles/app/config/heft.json#L53)了一个名为`webpack`的 task。

### Phase

"Phase"是 Heft tasks 的一种安排，定义在你的项目的**heft.json**配置文件的`phasesByName`部分。在该文件中，phases 被赋予如`build`或`test`等名称。定义一个 phase 会创建两个对应的命令行 actions。例如，`test` phase 会产生一个`heft test`和`heft test-watch` action。`-watch`变体用于交互式的观察模式，例如本地开发服务器。

如果 tasks 属于同一个 phase，它们可以共享内存对象进行优化；否则，它们只能通过将文件写入磁盘进行通信。这个要求支持与[Rush phases](https://rushjs.io/pages/maintainer/phased_builds/)的集成，后者可能在不同的时间或在不同的计算机上运行，通过 Rush 构建缓存进行通信。

**例子：**`@rushstack/heft-web-rig`配置[定义](https://github.com/microsoft/rushstack/blob/9ffb14519dd42e5808e56bc2ea80c8734f5f2e5b/rigs/heft-web-rig/profiles/app/config/heft.json#L21)了一个包含`webpack` task 的`build` phase。

### Plugin

Heft plugins 是实现`IHeftPlugin`合约的 TypeScript 类。有两种类型的 plugins：

- 一个**task plugin**可以被**heft.json** tasks 加载，并提供他们的实现
- 一个**lifecycle plugin**提供了不特定于任何 task 的通用功能；例如，收集时间度量

### Plugin package

"Plugin package"是提供 Heft plugins 的 NPM 包。NPM 包的命名模式是`heft-____-plugin`或`heft-____-plugins`（根据 plugins 的数量）。**内建的 plugins**直接从`@rushstack/heft`包中加载。

请查看[Plugin package index](../plugins/package_index.md)以获取官方 plugins 的列表。

**例子：**`@rushstack/heft-jest-plugin`包实现了[jest-plugin](https://github.com/microsoft/rushstack/blob/9ffb14519dd42e5808e56bc2ea80c8734f5f2e5b/heft-plugins/heft-jest-plugin/src/JestPlugin.ts#L144)。

### Plugin manifest

每个 plugin package 都包含一个名为"plugin manifest"的文件**heft-plug.json**。它描述了可用的 plugins，他们的选项，以及他们的命令行 parameters。Heft 是数据驱动的，这意味着这样的信息可以在不执行任何自定义脚本的情况下被发现。(尽管脚本配置非常流行，但它有许多问题，比如意想不到的性能成本，妨碍缓存的不可预测的行为，以及糟糕的错误信息。)

**例子：**`@rushstack/heft-jest-plugin`包在[这个 manifest](https://github.com/microsoft/rushstack/blob/9ffb14519dd42e5808e56bc2ea80c8734f5f2e5b/heft-plugins/heft-jest-plugin/heft-plugin.json)中声明了`jest-plugin`。

### Hook

Heft plugins 可以为构建生命周期中的各种事件注册处理程序。"tapping"事件"hooks"的 API 术语来自于 Heft 的[tapable](https://www.npmjs.com/package/tapable)系统的使用，这在 Webpack plugins 中很常见。

**例子：**在 Heft 的源代码中，[IHeftTaskHooks](https://github.com/microsoft/rushstack/blob/9ffb14519dd42e5808e56bc2ea80c8734f5f2e5b/apps/heft/src/pluginFramework/HeftTaskSession.ts#L135)接口公开了一些 hooks。

### Rig package

Heft 的主要理念是将构建逻辑移到 plugin packages 中，这样你的构建过程就是由 config files 而不是 program scripts 定义的。在大型的 monorepo 中，这极大地降低了维护成本，通过确保 program scripts 作为专业软件进行开发，而不是作为`.js`文件中的特设命令。

Rush Stack 的[rig system](./rig_packages.md)更进一步，可选地将 config files 移动到一个名为"rig"的集中 NPM 包中。Rigs 为你的项目定义标准化的配置。在大型的 monorepo 中，他们规范了你的构建团队已经同意支持的配置。Heft 还允许从 rig packages 解析`devDependencies`，减少了**package.json**的混乱。

**例子：**[@rushstack/heft-web-rig](https://github.com/microsoft/rushstack/tree/main/rigs/heft-web-rig)是 Rush Stack 为 web 项目的参考 rig。

### Rig profile

单个 rig 包可以为特定目的提供多个"profiles"。rig 包中的 profiles 共享相同的 rigged `devDependencies`，并且可能通过`"extends"`继承共享配置。

**例子：**`@rushstack/heft-web-rig` rig 包目前定义了[two profiles](https://github.com/microsoft/rushstack/tree/main/rigs/heft-web-rig/profiles)，`app`和`library`。
