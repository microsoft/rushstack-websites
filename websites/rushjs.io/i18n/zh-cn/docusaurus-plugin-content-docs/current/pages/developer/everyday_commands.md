---
title: 日常用到的指令
---

日常的开发仅仅需要以下几个 Rush 指令：

## rush update

当 **package.json** 文件发生变化时，请务必运行 `rush update`, 换句话说：

- 当从 git 上拉取新的更改（例如 `git pull`）后。

- 当项目内 **package.json** 文件被手动修改后。

- 当 **common/config** 目录下可能影响版本的文件（例如 **pnpmfile.js**, **common-versions.json** 等）被修改后。

`rush update` 操作可能会改变 **common/config** 下的一些文件，当这些文件发生变化时，你需要通过 commit 到 Git 中，并在相应的 PR 中包含它们。若不确定是否需要 commit，执行 `rush update` 就可以了 —— 如果已经是最新的，则不需要等待！

`rush update` 内做了些什么：

1. Rush 检查或应用各种可能会改变 **common/config** 内文件的策略。

2. Rush 会将所有项目内的 **package.json** 文件与仓库的公共 shrinkwrap 文件进行比较来检查是否有效。

3. 若无效，则包管理工具会更新 shrinkwrap 文件。

4. 无论如何，包管理工具都会将所有依赖安装到 **common/temp/node_modules** 目录下。

5. 最后，Rush 会给每个项目下构建一个 **node_modules** 文件夹，该文件夹下内容通过符合链接到 **common/temp/node_modules**. （该操作等同于 `rush link`）

> **shrinkwrap 文件是什么？**
>
> 需要项目中并没有将依赖指定为诸如 `1.2.3` 这样精确的版本，而是使用诸如 `1.x` 或者 `^1.2.3` 这样语义化版本。语义化的版本意味着依赖安装时的最新版本，这种**非确定性**的策略存在一定问题：当依赖的库新版本发布时，周一建立分支周二便可能因此而失败，这就很让人抓狂。shrinkwrap 文件就解决了这个问题，它存储了一个完整的安装计划，并被会 Git 记录。
>
> shrinkwrap 文件在不同的 [包管理器](../../maintainer/package_managers) 中有不同的名字：**shrinkwrap.yaml**, **npm-shrinkwrap.json** 或者 **yarn.lock** 等。

你可以观察到，CI 流水线中使用 `rush install` 来替代 `rush update`, 二者的不同点是 `rush install` 不会更新任何文件，相反，如果存在过失的数据，则会在 PR 上报错，并提示你执行 `rush update` 或者提示你 commit 其结果。（一些开发者为了防止 shrinkwrap 文件中不符合预期的更新，他们选择使用 `rush install` 当作常用指令，而不是 `rush build`）

## rush rebuild

一旦你拉取到最新的修改，那么就应该进行编译所有项目。`rush rebuild` 将给仓库内的所有项目执行一个完整的、清除式的构建。

如果你的工具链支持增量构建，那么你可以执行 `rush build` 来构建那些变动过的项目。

## rushx

如果你仅仅想构建一个项目，那么可以使用 `rushx` 指令。你可以在对应的项目下运行 `rushx` 指令，`rushx` 指令与 `npm run` 的指令类似，但它输入更简单、报错提示更友好、同时还有命令行帮助信息。

## rush check

当编辑完 **package.json** 文件后，你可以执行 `rush check` 来检查多个项目是否依赖同一个库的不同版本，在 monorepo 环境下，这种行为是不可取的。许多仓库使用 `rush check` 作为 CI 的起始，此时如果你提交的 PR 中提交了依赖不同版本，他们会报错。

## rush change

如果你从事库会被 NPM 发布，那么你的仓库可能需要你在 PR 中添加相应的变更日志。如果没有添加，你的 PR 构建会在 `rush change --verify` 步骤失败。

为了书写变更日志，首先需要把变动以 commit 的形式提交到 Git 中，之后在仓库下执行 `rush change`, 该指令会检查 Git 历史，并根据变动情况提示你为每个变化的项目书写更新日志。每一条日志会被存储在 **common/changes** 下的独立文件中。你应该把这些文件添加到 Git 中，以便于后续的提交。

随后，Rush 的自动发布工作流会检查这些文件，以确定哪些包需要发布。它会删除这些文件，并将你的更新信息复制到包的 CHANGELOG.md 文件中。

⏵ 查看 [更新日志编写](../../best_practices/change_logs) 来获取更多写变更记录的提示。

# 常见情况

上面就是 Rush 的一些常用的指令。

结合起来，日常的指令可能会像这样：

```sh
# 从 Git 获取最新的代码
$ git pull

# 按需安装 NPM 包
$ rush update

# 清理并重新构建所有项目
$ rush rebuild

# 进入某个项目内
$ cd ./my-project

# 假设 package.json 内存在 "start" 指令。
# (通过 "rushx" 来查看可用的命令)
$ rushx start
```
