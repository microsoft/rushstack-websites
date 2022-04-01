---
title: 快速开始
---

Rush Stack 项目都是在 Github 上的 **rushstack** 仓库中开发的：

&nbsp;&nbsp;&nbsp;&nbsp; [https://github.com/microsoft/rushstack](https://github.com/microsoft/rushstack)

对于文档的修复，每个站点都有独立的 GitHub 仓库：

- Rush Stack 站点：[https://github.com/microsoft/rushstack.io-website](https://github.com/microsoft/rushstack.io-website)
- [Rush](@rushjs/) 站点：[https://github.com/microsoft/rushjs.io-website](https://github.com/microsoft/rushjs.io-website)
- [API Extractor](@api-extractor/) 站点：[https://github.com/microsoft/api-extractor.com-website](https://github.com/microsoft/api-extractor.com-website)

## 在你的机器上开始

- **Node.js 12**: 建议使用 [nvm](https://github.com/creationix/nvm) （针对 Mac/Linux）或者 [nvm-windows](https://github.com/coreybutler/nvm-windows) （针对 Windows），它可以帮助你轻松地在不同的 Node.js 切换。当你下载 Node.js 时，首先确保卸载之前的版本并清楚其文件，查看 [FAQ: 当安装完 Rush 后，为什么我依旧使用旧版本？](https://rushjs.io/pages/help/faq/#after-installing-rush-why-am-i-still-seeing-the-old-version)来查看更多细节。

- **Visual Studio Code** （推荐）：你可以使用任何编辑器，但是我们推荐 [VS Code](https://code.visualstudio.com). 它非常优秀！

## 构建项目

在 **rushstack** 仓库内使用 [Rush](http://rushjs.io) 来构建项目。

1. 确保你有 Rush 的最新版：

```
C:\>npm install -g @microsoft/rush
```

2. 克隆仓库：

```
C:\Repos>git clone https://github.com/microsoft/rushstack
```

3. 使用 Rush 来安装依赖：

```
C:\Repos>cd rushstack
C:\Repos\rushstack>rush install
```

4. 在仓库内对所有项目进行构建：

```
C:\Repos\rushstack>rush rebuild
```

5. 如果你仅仅想构建一个项目：

```
C:\Repos\rushstack>cd libraries\rush-core-library
C:\Repos\rushstack\libraries\rush-core-library>rushx build
```

**重要**：在 Rush 仓库内不应该使用诸如 `npm install` 的命令。查看 [Rush 文档](@rushjs/pages/developer/new_developer/) 来了解更多细节。

## 提交 PR

我们欢迎贡献代码！ 为 **rushstack** 仓库提交一个功能：

1. Fork 该仓库.
2. 创建新的 Git 分支并 commit 你的变动。
3. 如果你修改了任何 package.json 文件，执行 `rush update` 来保证 **package-lock.json** 文件处于最新。注意 commit 该文件。
4. 创建 PR 前需要执行 `rush change`, 如果有提示，则[输出一个变更日志](@rushjs/pages/best_practices/change_logs/), 并将其创建的文件 commit 掉.
5. 创建一个 [pull request](https://help.github.com/articles/creating-a-pull-request/)
6. 如果你的 PR 主要影响某个项目，那么在 PR 标题中以该项目作为前缀。例如: "**[api-extractor] Added a new API feature**" 或者 "**[node-core-libary] Fixed a bug in the library**".

Someone should review your PR within a few days. Be aware that the Rush Stack maintainers manage large
corporate monorepos, which can be very distracting work. If nobody's responding to PR comments, try asking in the
[#contributor-helpline](https://rushstack.zulipchat.com/#narrow/stream/279883-contributor-helpline)
chat room. We greatly appreciate community contributions and do want to get your PR reviewed!

有人会在几天内审查你的 PR。请注意，Rush Stack 的维护者都是管理大型 monorepo 的人，他们每天都有很多琐事，如果没有人回应 PR 的评论，试着在 [#contributor-helpline](https://rushstack.zulipchat.com/#narrow/stream/279883-contributor-helpline) 聊天室询问。我们非常感谢社区的贡献，并真诚的希望你的 PR 得到审查！
