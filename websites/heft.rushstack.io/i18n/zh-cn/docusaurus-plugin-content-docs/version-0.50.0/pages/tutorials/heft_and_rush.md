---
title: 与 Rush 交互
---

[开始使用 Heft](../tutorials/getting_started.md) 教展示了独立项目中使用 Heft. 本文将介绍 Rush monorepo 下如何使用 Heft.

## Heft 如何被调用

如果你刚刚使用 Rush, [维护者教程](@rushjs/pages/maintainer/setup_new_repo/) 介绍了初始化一个新仓库的基本步骤。 Heft 会接管 Rush 调用的项目中 `"build"` 脚本。在我们教程中，脚本示例如下：

**&lt;project folder&gt;/package.json**

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

## 使用 rig 包来共享配置

monorepos 的一个主题是**_尽量减少 "模板 "文件_**。换句话说，合并那些在 monorepo 中需要复制粘贴到每个项目下的配置文件。让模板保持同步是个麻烦事。一旦需要变动，如果你有百个项目，你需要数百次重复操作。

然而，与此同时，我们要遵守 Rush 的**_项目隔离原则_**。每个项目都应该独立构建，而不应该与其他项目纠缠在一起（例如，通过使用诸如 `.../.../other-project` 的相对路径引用文件）。这条原则有助于实现 Rush 的子集构建和增量构建功能，甚至当你不想使用 Rush 后，它也可以非常轻易地在 monorepo 间迁移项目。出于这个原因，我们不鼓励在 monorepo 仓库的根目录下放一个 **.eslintrc.js** 文件并让所有项目都借此调用 ESLint.

相反，Heft 支持一种名为 **rig packages** 的形式，公共配置以 `devDependencies` 下的 NPM 包的形式提供，rig 包提供了三种方式来减少重复配置：

1. 配置文件使用 `"extends"` 的字段来继承 rig 中的配置，例如 **tsconfig.json**
2. Rig 的配置文件可以消除整个配置文件，使用 **config/rig.json** 文件来直接指定 Heft 在 rig 包中查找配置文件。例如：**config/heft.json**
3. Rig 的依赖可以通过 rig 包来提供，避免在项目内的 `devDependencies` 中添加它们。例如：**typescript** 包

[使用 rig 包](../intro/rig_packages.md)一文中有更详细的介绍。

## 增量构建

使用 Rush 与 Heft 的另一个好处是支持增量构建。例如，如果你运行 `rush build` 两次，由于第一次运行后所有的项目已经构建好，因此第二次运行会在瞬时完成。有趣的是，这种增量构建分析是由 Rush 实现的，而不是 Heft.

由于 JavaScript 是一种解释型语言，每次在项目中启动 Node.js 进程时都会有一小部分开销。因此，即使 Heft 不执行任何工作，也可能需要 1 秒钟来启动工具链，分析输入文件，并确定所有东西都是最新的。对于一个有 500 个项目的 monorepo 来说，这将增加到 500 秒的分析。Rush 通过对所有项目进行全局分析来避免这一点：将你的源文件的哈希值与输出文件的哈希值进行比较，如果这些哈希值相同，那么 Rush 可以确定一个项目可以被完全跳过，甚至不需要启动 Heft。Rush 的增量构建适用于任何行为良好的脚本，而不仅仅是 Heft.
