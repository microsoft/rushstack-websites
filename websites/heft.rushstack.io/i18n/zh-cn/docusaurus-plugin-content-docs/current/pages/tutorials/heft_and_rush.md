---
title: 与Rush的接口
---

[Hello World](../tutorials/hello_world.md)教程演示了如何在独立项目中使用 Heft。现在，让我们来看看 Heft 在 Rush monorepo 环境中是如何工作的。

## Heft 如何被调用

如果你对 Rush 不熟悉，[维护者教程](@rushjs/pages/maintainer/setup_new_repo/)解释了设置新 repo 的基础知识。当 Rush 在 Rush 项目文件夹中调用`"build"`脚本时，Heft 开始接管。在我们的教程样本项目中，脚本看起来是这样的：

**&lt;项目文件夹&gt;/package.json**

```
{
  . . .
  "scripts": {
    "build": "heft build --clean",
    "start": "node lib/start.js"
  }
  . . .
}
```

## 使用 rig package 共享配置

在 monorepos 中的一个主题将是**_最小化"样板"文件_**。换句话说，整合那些否则会复制+粘贴到 monorepo 的每个项目文件夹中的文件和设置。样板是一种麻烦，因为它很难保持同步。当需要修复时，如果你有数百个项目，你需要重新应用相同的修复数百次。（更糟的是，如果允许工程师以不同的方式定制他们的项目，那么你可能需要应用数百个*不同的*修复，这是非常高的维护成本。）

与此同时，我们希望尊重 Rush 的**_项目隔离原则_**：每个项目应独立构建，不应与其他项目纠缠在一起（例如，通过使用相对路径如`../../other-project`引用文件）。这种纪律促进了 Rush 的特性，如子集构建和增量构建。这也使得在 monorepos 之间迁移项目，甚至如果你改变主意后停止使用 Rush，移动 Rush 项目文件夹变得非常容易。因此，我们不鼓励如在 monorepo 的根目录中放置一个集中的**.eslintrc.js**文件，并为所有项目全局调用 ESLint 的做法。

结合这些目标，Heft 支持一种叫做**rig package**的正式概念，其中共享的设置由添加到每个项目的`devDependencies`的 NPM package 提供。rig package 提供三种减少重复的方式：

1. 配置文件可以使用`"extends"`等设置继承 rig 的常用设置。例如：**tsconfig.json**
2. Riggable 配置文件可以完全被消除，使用**config/rig.json**文件指导 Heft 在 rig package 中找到它们。例如：**config/heft.json**
3. Riggable 依赖项可以由 rig package 提供，避免需要将它们添加到你的项目的`devDependencies`。例如：**typescript** package

[使用 rig package](../intro/rig_packages.md)文章详细描述了这个。

## 增量构建

使用 Rush 与 Heft 的另一个好处是支持增量构建。例如，如果你运行`rush build`两次，第二次它将立即完成，因为所有的项目都已经构建过了。有趣的是，这个增量构建分析是由 Rush 自己执行的，而不是 Heft。

由于 JavaScript 是一种解释型语言，每次在项目文件夹中启动一个 Node.js 进程都会有一点开销。因此，即使 Heft 完全不执行任何工作，它也可能需要 1 秒钟的时间来启动工具链，分析输入文件，并确定一切都是最新的。对于拥有 500 个项目的 monorepo 来说，这加起来就是 500 秒的分析时间。Rush 通过对所有项目进行全局分析，比较你的源文件的 hash 和输出文件的 hash 来避免这个。如果这些 hash 是相同的，那么 Rush 就可以确定一个项目可以完全跳过，甚至不用启动 Heft。Rush 的增量构建分析适用于任何规范的脚本，不仅仅是 Heft。

## 使用 Heft phases 实现 Rush phases

Rush 的增量构建可以使用[Rush phases](https://rushjs.io/pages/maintainer/phased_builds/)进行更粒度的划分。
Heft phases 专门设计用来与这个模型对齐。

下面是从 GitHub 上的 Rush Stack monorepo 中的[node-core-library/package.json](https://github.com/microsoft/rushstack/blob/main/libraries/node-core-library/package.json)摘录的一部分：

```js
  "scripts": {
    "build": "heft build --clean",
    "test": "heft test --clean",
    "_phase:build": "heft run --only build -- --clean",
    "_phase:test": "heft run --only test -- --clean"
  },
```

`"test"`命令调用`heft test`，它将执行`build`和`test`两个 phases，而`"_phase:test"`命令只执行`test` phase。这是可行的，因为[config/rush/command-line.json](https://github.com/microsoft/rushstack/blob/main/common/config/rush/command-line.json)模型化了我们的 phase 依赖，所以 Rush 本身将确保在执行`test`之前运行`build` phase。通过向 Rush 公开这些细节，Heft 的 phases 可以使用 Rush 的构建缓存进行优化，甚至可以参与到使用 Cobuild feature 的分布式构建中。
