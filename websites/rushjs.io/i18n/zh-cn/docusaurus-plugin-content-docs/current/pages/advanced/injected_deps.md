---
title: 注入依赖
---

注入依赖是 PNPM 的一种功能，可以让本地项目文件夹像发布到 NPM 注册表一样被安装。

## 背景：传统的工作区符号链接

Rush 项目通常使用 `workspace:` 指定符号来依赖单体仓库工作区内的其他项目。例如，假设 `my-project` 和 `my-library` 是 Rush 工作区中的项目：

**my-repo/apps/my-project/package.json**

```json
{
  "name": "my-project",
  "version": "1.2.3",
  "dependencies": {
    "react": "^18.3.1",
    "my-library": "workspace:*"
  }
}
```

在上述示例中，`react` 包将通过从 NPM 注册表下载并解压到 `node_modules` 子文件夹中来安装。相比之下，`workspace:*` 指定符号会让 PNPM 创建一个指向 `my-library` 开发所在源码文件夹的 `node_modules` 符号链接：

**符号链接：** `my-repo/apps/my-project/node_modules/my-library` --> `my-repo/libraries/my-library/`

通过这种方式，`my-project` 将始终使用 `my-library` 最新的本地构建输出。甚至可能存在 `my-project` 和 `my-library` 都从未发布到 NPM 注册表的情况。

## 工作区符号链接的局限性

然而，假设 `my-library` 声明了一个对等依赖如下：

**my-repo/libraries/my-library/package.json**

```json
{
  "name": "my-library",
  "version": "0.0.0",
  "peerDependencies": {
    "react": "^18.0.0 || ^17.0.0"
  },
  "devDependencies": {
    "react": "17.0.0"
  }
}
```

`my-library` 项目声明它可以使用 React 版本 17 和 18。在本地开发中，`devDependencies` 安装了支持的最早版本 17.0.0，这是一种验证向后兼容性的常见做法。

为什么我们需要 `peerDependencies` 而不是 `dependencies`？如果使用 `dependencies`，那么包管理器可以自由选择任何匹配 `"^18.0.0 || ^17.0.0"` 的 `react` 版本。例如，如果我们的应用使用 React 17，那么 `my-library` 可能会获取 React 18，这是错误的。对等依赖通过规定 `my-library` 必须与其使用者保持相同的 `react` 版本（实际上是相同的已安装磁盘文件夹）来避免这种情况。

如果两个不同的应用依赖 `my-library`，且这些应用有不同版本的 `react`，该怎么办？对于外部 NPM 包，PNPM 通常通过将（相同版本的）`my-library` 安装到 `node_modules` 的不同子文件夹来解决此问题。这些副本称为 **“对等依赖二重身”**。这是 Node.js 模块解析器的设计约束所决定的：

> _**无上下文解析：** 当某个文件导入 NPM 包时，模块解析器对文件的每个导入者的解析方式都是一致的。_

换句话说，唯一能让 `my-library` 在为 `app1` 导入 React 17 而为 `app2` 导入 React 18 的方式，是两个应用从磁盘上的两个不同 `my-library` 文件夹（即二重身）导入。

当将 NPM 包提取到 `node_modules` 文件夹时，包管理器会根据需要自动创建二重身。然而，在我们的示例中，`my-project` 使用 `workspace:*` 来创建 `my-library` 项目文件夹的符号链接，而不是将 NPM 包提取到 `node_modules` 文件夹。那么对等依赖将如何满足？在这种情况下，PNPM 只会产生一个错误的安装：

- 当 `my-project` 导入 React 时，它将获取版本 18
- 当 `my-project` 导入 `my-library` 而 `my-library` 导入 React 时，它将获取版本 17（从 `devDependencies` 安装）

`peerDependencies` 被忽略。

## 注入依赖的救援

为了解决这个问题，PNPM 支持一个名为 `injected` 的 [package.json 配置](https://pnpm.io/package_json#dependenciesmetainjected)，它将使 `my-library` 像发布到 NPM 一样被安装。以下是启用它的方法：

**my-repo/apps/my-project/package.json**

```json
{
  "name": "my-project",
  "version": "1.2.3",
  "dependencies": {
    "react": "^18.3.1",
    "my-library": "workspace:*"
  },
  "dependenciesMeta": {
    "my-library": {
      "injected": true
    }
  }
}
```

进行此更改后，`pnpm install`（在我们的例子中是 `rush install` 或 `rush update`）将通过将项目内容复制到 `my-project` 的 `node_modules` 文件夹中来安装 `my-library`。由于它们是常规安装的，注入依赖可以成为二重身并正确满足对等依赖。

注入安装遵循发布过滤器，例如 `.npmignore`，因此复制的内容准确地反映了如果 `my-library` 发布到 NPM 注册表会发生什么。因此，消耗库的测试项目可以设置 `injected: true`，以捕捉 `.npmignore` 过滤器中的错误——这些在使用 `workspace:` 符号链接时经常被忽略的配置错误。

听起来很棒——那么为什么 PNPM 不对所有 `workspace:` 引用使用注入安装？

## 同步注入依赖

我们说过，注入依赖会在 `rush install` 期间被复制到 `node_modules` 文件夹中。但是如果我们对 `my-library` 进行了更改，然后运行 `rush build`，会发生什么？当 `my-project` 导入 `my-library` 时，它仍会找到来自 `node_modules` 的旧副本。为了得到正确的结果，我们需要在每次重建 `my-library` 后重新执行 `rush install`。更准确地说，我们需要在构建任何注入项目 _**之后**_ 但 _**在**_ 消费者开始构建 _**之前**_ 重新执行 `rush install`。在最坏的情况下，这可能意味着在 `rush build` 期间重复执行 `rush install` 数百次。这是不现实的。

PNPM 目前还没有包含该问题的内置解决方案，因此注入依赖尚未被广泛采用。然而，一个名为 [pnpm-sync](https://github.com/tiktok/pnpm-sync) 的新工具提供了解决方案：每当 `my-library` 被重建时，`pnpm-sync` 会自动将其输出复制到适当的 `node_modules` 子文件夹进行更新。

通常每个项目都需要自行决定是否以及如何调用 `pnpm-sync` 命令，但 Rush 集成了此功能并自动进行管理。要在 Rush 中使用 `pnpm-sync`，可以启用 `usePnpmSyncForInjectedDependencies` 实验：

**common/config/rush/experiments.json**

```json
  /**
   * （开发中）对于涉及对等依赖的某些安装问题，PNPM 无法在不在 node_modules 文件夹中安装包的副本的情况下正确满足版本要求。
   * 这对“workspace:*”依赖项构成了问题，因为它们通常是通过将符号链接指向本地项目源码文件夹进行安装。
   * PNPM 的“注入依赖”功能提供了一种将本地项目文件夹复制到 node_modules 的模型，但复制必须在依赖项目构建 **之后** 并且在消费者项目开始构建 **之前** 发生。
   * “pnpm-sync”工具负责管理此操作；有关详细信息，请参阅其文档。
   * 如果希望在构建期间通过调用“pnpm-sync”来重新同步注入依赖，请启用此实验。
   */
  "usePnpmSyncForInjectedDependencies": true
```

此设置将启用以下行为：

- `rush install` 和 `rush update` 将自动调用 `pnpm-sync prepare` 来配置注入依赖（如 `my-library`）的复制

- `rush build`（以及其他 Rush 自定义命令和阶段）将在 `my-library` 等项目重建时自动调用 `pnpm-sync copy` 以重新同步已安装的文件夹

- `rushx` 将在 `my-library` 文件夹下执行的任何操作后自动调用 `pnpm-sync copy`

## 用于子空间的注入依赖

如果您使用 Rush 子空间，请考虑同时启用 `alwaysInjectDependenciesFromOtherSubspaces`：

**common/config/subspaces/&lt;subspace-name&gt;/pnpm-config.json**

```json
  /**
   * 当项目使用 `workspace:` 依赖其他 Rush 项目时，PNPM 通常通过在 `node_modules` 下创建一个符号链接来安装。
   * 这通常效果很好，但在某些情况下，例如不同的 `peerDependencies` 版本，符号链接可能会引发问题，
   * 比如错误的版本满足。对于这种情况，可以将依赖项声明为“injected”，
   * 使得 PNPM 能够将其构建输出复制到 `node_modules` 中，就像从注册表实际安装一样。
   * 详细信息：https://rushjs.io/pages/advanced/injected_deps/
   *
   * 使用 Rush 子空间时，如果 `workspace:` 引用来自不同子空间的项目，那么这类版本问题的可能性更高。
   * 这是因为符号链接将指向由不同的 PNPM 锁定文件安装的独立 `node_modules` 树。
   * 全面的解决方案是启用 `alwaysInjectDependenciesFromOtherSubspaces`，
   * 它会自动将其他子空间中的所有项目视为注入依赖，无需手动配置它们。
   *
   * 注意：请谨慎使用——如果注入的依赖过多，过度的文件复制会减慢 `rush install` 和 `pnpm-sync` 操作。
   *
   * 默认值为 false。
   */
  "alwaysInjectDependenciesFromOtherSubspaces": true
```

## 另见

- [pnpm-sync](https://github.com/tiktok/pnpm-sync) GitHub 项目
- PNPM 文档中的 [dependenciesMeta.\*.injected](https://pnpm.io/package_json#dependenciesmetainjected)
- [Rush 子空间](../advanced/subspaces.md)
