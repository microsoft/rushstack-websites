---
title: 其他有用的指令
---

## 安装最新的语义化兼容的版本

`rush update` 通常情况下只会以最小增量更新的方式来满足项目内 **package.json** 文件，如果你想要将所有项目的依赖都更新到最新版本，可以这样做：

```sh
# 它会高效地删除 shrinkwrap 文件，并会下载 package.json 文件中指定的最新兼容版本。
# 注意，package.json 文件本身不会被修改。
$ rush update --full
```

对于日常工作而言，`--full` 可能导致你的 PR 出现一些问题，例如，如果某一个依赖没有很好地遵循语义化版本规则。对于小型仓库而言，这不是什么问题，但对于大型的 monorepo，我们建议使用日常使用 `rush update`，同时在某条独立的 CI 或指定人员定期使用 `rush update --full`.

## 更快的构建方式

- **如果你用到的项目很少**：假如你的 Git 仓库内包含 50 个项目，但是你只用在 **widget** 和 **widget-demo** 项目内工作，你可以通过 `rush rebuild --to widget --to widget-demo` 来构建这两个库以及他们的依赖。

- **如果你变更了某个库**：假设你的 Git 仓库包含 50 个项目，同时你仅仅在 **widget** 库中修复了一些 bugs, 同时你需要给所有用到该库的项目进行单元测试，但是重新构建所有项目有些浪费时间，因此可以通过 `rush rebuild --from widget` 来构建只包含该库的项目。

[只选择部分项目](../../developer/selecting_subsets)一文详细描述了如何只选择部分项目。

## 一种更快的安装方式

如果你的仓库正在使用 PNPM 并在 [rush.json](../../configs/rush_json) 中启用了 `useWorkspaces=true`，那么就可以使用 “部分安装” 的功能，该功能可以通过仅在指定的项目中安装 NPM 包来减少安装时间。

例如：

```sh
# 仅安装构建 "my-project" 所需的 NPM 包
#（包括安装 "my-project" 在仓库内依赖的项目的依赖）
$ rush install --to my-project

# 与 "rush build" 类似，可以使用 "." 来指向当前 shell 所处的工作目录
$ cd my-project
$ rush install --to .

# 该指令安装了执行 "rush build --from my-project" 所需的依赖
$ rush install --from my-project
```

## 返回到一个干净的状态

在使用 Rush 后，你可能需要清理一下，比如将一个目录打包成压缩文件。这里有一些清理指令：

```sh
# 移除所有被 Rush 创建的链接
$ rush unlink

# 移除 Rush 创建的所有临时文件，包括删除公共文件夹下已下载的 NPM 包。
$ rush purge
```
