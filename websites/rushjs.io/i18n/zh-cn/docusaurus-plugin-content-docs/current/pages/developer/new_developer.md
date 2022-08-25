---
title: 以开发者的身份开始
---

## 前提

为了使用 Rush, 首先需要 NodeJS, 我们推荐最新的[长期维护版本](https://nodejs.org/en/download/releases/)，因为非稳定的 NodeJS 时常有一些 bugs, 你可以使用 [nvm-windows](https://github.com/coreybutler/nvm-windows) 和 [nvm](https://github.com/creationix/nvm) (Mac/Linux) 安装，这样你就可以方便地切换到不同的 NodeJS 版本，这些版本可能会用于不同的项目。

你也需要安装 Rush 本身，这非常简单，从你的 shell 或命令行窗口输入这个命令：

```sh
$ npm install -g @microsoft/rush
```

_注意：如果上述命令由于你没有 NPM 全局权限安装失败，你可以查看[修复你的 NPM 配置](https://docs.npmjs.com/getting-started/fixing-npm-permissions)。_

为了查看 Rush 的命令行帮助，你可以输入：

```sh
$ rush -h
```

命令行帮助也被发布到[命令参考](../commands/rush_add.md)内。

## 一些细节

在我们开始之前，有一些重要的提示：

#### 1. Rush 仓库内不要使用某些指令

Rush 会在某个中心文件夹安装所有的依赖，之后使用[符号链接](https://en.wikipedia.org/wiki/Symbolic_link)给每个项目创建 "node_modules" 文件夹。

**不要使用包管理工具来安装或链接依赖。**例如，`npm run` 会正常执行，但是诸如 `npm install`, `npm update`, `npm link`, `npm dedupe` 等命令会干扰 Rush 的符号链接，同样，对于其他包管理工具，也要避免使用 `pnpm install` 或者 `yarn install` 等命令。如果你想使用这些命令，首先运行 `rush unlink` 来删除 Rush 创建的符号链接。

如果你使用 `git clean -dfx` 来清理文件夹，注意它对符号链接的处理不够好。在使用 `git clean -dfx` 之前，请确保你已经运行 `rush unlink`.

最后，你可以运行 `rush update` 重新生成符号连接。(有一个单独的 `rush link` 命令，但是很少使用它。)

#### 2. 如果你怀疑安装出现问题

Rush 的包管理工具命令是“增量”式的，这意味着可以通过跳过不必要的安装来节省时间。因为当 Rush 运行在自动构建环境中时，有很多保障措施来确保检查的准确性。然而，当你在本地调试时，有时会导致你的 NPM “node_modules” 文件夹变得不正确，最终导致奇怪的错误。

如果你怀疑你的安装已经出现问题，尝试执行 `rush update --purge`, 该指令会强制重新完全安装你的包，通常它会带你回到正常的状态。
