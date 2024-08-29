---
title: 使用 Sparo 加速 Git
---

Monorepos 经常会随着越来越多的项目被合并而迅速增长。虽然 Rush 提供了多种机制来加速[安装时间](../advanced/subspaces.md)和[构建时间](../maintainer/cobuilds.md)，但对于非常大的仓库，即使是基本操作如 `git clone` 和 `git checkout` 也可能变得异常缓慢。

## Git 优化

Git 提供了一些内置功能，这些功能可能足以加速中等大小的仓库：

- [浅克隆](https://git-scm.com/docs/git-clone#Documentation/git-clone.txt-code--depthcodeemltdepthgtem)允许只克隆几个提交，但通常只适用于临时克隆，如 CI 作业。

- [部分克隆](https://git-scm.com/docs/partial-clone)允许在没有文件内容（"blobless" 克隆）或甚至没有提交详细信息（"treeless" 克隆）的情况下克隆，大大加速了您的 `git clone` 时间，并允许在 `git checkout` 期间获取这些详细信息。

- [大文件存储 (LFS)](https://git-lfs.com/) 可以将大型二进制文件移至单独的服务器，在检出时根据需要下载它们。然而，使用 LFS 是棘手的，因为这个功能依赖于外部于 Git 的 `.gitattributes` 过滤：您的 `.gitattributes` 规则可以根据文件扩展名选择什么是“大”的，但没有简单的方法可以根据实际文件大小或更新频率进行选择。如果您不小心选择了太多文件，性能可能会比没有 LFS 更糟。此外，对 `.gitattributes` 的更改不能在不重写整个 Git 历史记录的情况下追溯应用 — 这对于一个活跃的仓库来说是一种非常破坏性的行为。

幸运的是，Git 提供了更多高级功能，如**稀疏检出**、**单分支克隆**、**文件系统监视器**、**后台维护**，以及多种可选择设置以调整行为。这些功能可以直接通过 Git 命令行访问，但配置可能复杂。非专业用户经常在采用上遇到困难。

## 如何通过 Sparo 帮助

作为应用高级 Git 优化的更简单替代方法，尝试使用 [Sparo](https://tiktok.github.io/sparo) 工具。它直接与 Rush 集成并自动优化 Git。基本策略是*只获取您需要的*，通过三个维度：（1）跳过无关分支，（2）跳过无关历史（部分克隆），（3）跳过无关项目文件夹的检出（稀疏检出）。

Sparo 通过使用 [Sparo 配置文件](https://tiktok.github.io/sparo/pages/guide/sparo_profiles/)简化稀疏检出，这些配置文件可以指定智能选择，例如：*"只检出我团队正在工作的两个应用程序，以及 Rush 工作区中的所有依赖项。"*这样，工程师就不需要花时间确定确切的文件夹路径进行检出。Sparo 检出总是包括一组基本的["骨架文件夹"](https://tiktok.github.io/sparo/pages/reference/skeleton_folders/)；这确保每个项目的 **package.json** 文件始终可用。Sparo 还可以选择性地收集匿名 Git 时间度量，帮助您的构建团队随时间分析性能。

[Sparo 网站](https://tiktok.github.io/sparo/zh-cn/)提供了更多背景。

## 使用 Sparo

Git 和 Sparo 命令行可以互换使用。唯一的要求是您的工作目录必须最初使用 `sparo clone` 而不是 `git clone` 来克隆。

这里有一个快速指南，使用 [azure-sdk-for-js](https://github.com/Azure/azure-sdk-for-js.git)，这是 GitHub 上的一个大型公共 RushJS monorepo:

### 第 1 步：克隆仓库

```shell
# 安装 Sparo 命令行
npm install -g sparo

# 克隆您的 Rush 仓库 -- 只克隆最小的“骨架”
sparo clone https://github.com/Azure/azure-sdk-for-js.git
```

### 第 2 步：创建配置文件

```shell
cd azure-sdk-for-js

# 创建一个稀疏检出配置文件，保存在 common/sparo-profiles/my-team.json
sparo init-profile --profile my-team
```

编辑创建的 **my-team.json** 文件以添加[项目选择器](../developer/selecting_subsets.md)。例如：

**common/sparo-profiles/my-team.json**

```js
{
  "selections": [
     {
       // 这个演示配置文件将检出 "@azure/arm-commerce" 项目
       // 及其所有依赖：
       "selector": "--to",
       "argument": "@azure/arm-commerce"
     }
  ]
}
```

### 第 3 步：检出您的配置文件

保存更改到 **my-team.json** 之后，现在是应用它的时候了：

```shell
sparo checkout --profile my-team
```

试试看！例如：

```shell
rush install

# 构建应该成功，因为 Sparo 确保了依赖项目
# 被包括在稀疏检出中：
rush build --to @azure/arm-commerce
```

对于日常工作，考虑选择如 `sparo revert` 这样的镜像子命令代替 `git revert`。Sparo 包装提供（1）更好的默认设置，（2）更好性能的建议，以及（3）可选的匿名性能度量。

示例：

```shell
sparo pull

sparo commit -m "Example command"
```

## 另请参阅

- [Sparo 网站](https://tiktok.github.io/sparo/zh-cn/)
- [为前端 Monorepos 提供更快的 Git：介绍 Sparo](https://developers.tiktok.com/blog/2024-sparo-faster-git-for-frontend-monorepos) - 来自 Sparo 维护者的博客文章
