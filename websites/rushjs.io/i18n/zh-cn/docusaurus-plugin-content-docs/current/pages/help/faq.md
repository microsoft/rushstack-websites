---
title: 常见问题回答
---

### 我的项目都放在一个大的仓库里？这是一个好主意吗？

_回答在 [这篇文章](../../intro/why_mono) 中。_

### 我该如何报告错误或请求新功能？

在 **rushstack** 仓库下开启一个 [issue](https://github.com/microsoft/rushstack/issues), 并在 issue 标题中包含 "Rush"。

### 在一个大的仓库里有很多项目，"npm install" 将会花很长时间？

您可能会想：“Hmm.. 如果我的当前安装需要 3 分钟，而您想把 20 个项目放在一个仓库里，我的 NPM 安装时间会不会涨到 60 分钟？” 哦，不对。Rush 会将您的依赖放在一个 "common" 目录下，并且只会执行一次 "npm install"，它与你安装单个应用耗时基本相同。

### Rush 将会使我的工具非标准化吗？

不对！Rush 会在现有的系统和标准中工作。它只会更好地做事，更快。

- 每个项目目录依然是自成一体的（没有模糊包的界限）
- 依然可以在没有 Rush 的情况下构建项目；仅需要执行 `npm install` 和 `gulp`.
- 可以在任何一个时间内将项目移动到单独的目录中，而不用任何代码变化。

## Rush Stack 是否和 Rush 相同？

不。**Rush Stack** 是一组项目，由一组共同使命为构建大规模 TypeScript 专业工具链的开发人员维护。Rush 时 Rush Stack 的一部分。其他部分都是可选的。 Rush 本身是无关的工具链，它可以单独工作得很好。更多细节可以在 [Rush Stack](https://rushstack.io/) 网站上查看。

### 安装完 Rush 之后，还是看到旧版本了？

问题并不是 Rush 上，但是我们听到了很多关于此的问题因为 Rush 是开始在仓库工作钱第一个需要调用的工具，其症状如下：

```
$ npm install -g @microsoft/rush
C:\Program Files\nodejs\rush -> C:\Program Files\nodejs\node_modules\@microsoft\
rush\bin\rush
C:\Program Files\nodejs
`-- @microsoft/rush@3.0.1

$ rush
Rush Multi-Package Build Tool 2.5.0 - http://aka.ms/rush
```

NPM 看起来表示安装了 3.0.1 版本，但是我们执行指令时，展示的是 2.5.0 版本，发生了什么？

问题在于当你在输入诸如 "gulp" 和 "rush" 的命令时，它们在你的系统路径中被发现，这可能指向了以前安装的 NodeJS 或 NPM 的目录。

修复方法：

1. 运行 `npm ls -g --depth 0` 来确定你的 NPM 包被安装在哪里。
2. 运行 `set` 命令，检查你的 PATH 环境变量。
3. 确保你从步骤 1 拿到的 PATH 环境变量中没有其他 NPM 或 NodeJS 目录。
4. 在 PATH 中删除无用的目录，例如从 NPM 之前的安装，NodeJS，nodist，nvm-windows，等等。
5. 如果你之前使用过这些另一种引擎，很有可能你的硬盘上还有一些无用的 NPM 包。建议你跟踪它们并删除它们。

查看：

```
C:\Program Files\nodejs
C:\Program Files (x86)\nodist
%APPDATA%\npm
%APPDATA%\nvm
```

### "npm install" 步骤报告网络错误，该怎么办？

如果你从一个自定义的 NPM 源安装包（例如公司的私有服务），那么你的项目需要在 .npmrc 中添加特殊的配置。如果这些配置不正确，"npm install" 可能会报告一些令人迷惑的错误，这些错误看起来像是网络问题。NPM 会在多个位置上寻找 ".npmrc" 文件，并忽略其他位置，理解这一点很重要。

没有 Rush 时，NPM 会在两个地方寻找 "**.npmrc**"，_并合并它们的内容_：

- 你当前 package.json 的目录下（适用于在 Git 中存储项目特定的配置）
- 你的用户主目录（这里存放着你的认证令牌）

当使用 Rush 调用 "npm install", 将在两个地方寻找 "**.npmrc**":

- "**./common/config/rush/.npmrc**" （安装期间拷贝了 "**./common/temp/.npmrc**"）
- 你的用户主目录

### 为什么 Rush 的 JSON 配置文件中包含 `//` 注释，GitHub 在红色显示？

JSON 起初是用于作为数据交换格式，不支持代码注释。最近 JSON 这样人类可编辑的配置文件格式得到了广泛的流行，很明显它必须要求注释。因此，大多数严格的 JSON 库都可以处理注释，而不会有任何问题。（一个显而易见的例外是 `JSON.parse()`；不要使用它 -- 它不能验证范式，他的错误报告也很糟糕）

VS Code 默认会将 JSON 注释高亮为错误，但是它提供了一个 "[JSON with comments](https://code.visualstudio.com/docs/languages/json#_json-with-comments)" 模式。要启用这个模式，在 **settings.json** 中添加这行：

```json
"files.associations": { "*.json": "jsonc" }
```

默认情况下，Github 以错误的形式高亮注释。为了修复此问题，你可以在 **.gitattributes** 文件中添加这行（为解决 Github 缓存问题，你也可能需要提交一个改变）：

```
*.json  linguist-language=JSON-with-Comments
```

_讨论其他更多的可能性，参考 [issue #1088](https://github.com/microsoft/rushstack/issues/1088)._

### 为了避免与其他工具干扰，如何清理 Rush 的安装？

通常建议使用 Rush 来管理所有的 monorepo. Rush 在项目 `node_modules` 文件夹下创建的符号链接可能会干扰诸如 NPM 或 Yarn 的其他工具，因为它们不同的安装模式而导致故障。然而，有时这是不可避免的。例如，当迁移一个 repo 到 Rush 下时，CI 系统可能需要重用一个现有的工作文件夹来使用不同的安装方式构建不同的分支。为了防止干扰，你的 CI 任务首先需要调用一个命令来删除以前的文件。

对于 Yarn 或 NPM, 类似 `git clean -dfx` 的命令通常足够。（改操作会删除文件 -- 调用前请[参考手册](https://git-scm.com/docs/git-clean)）

为了清理 Rush 安装，并不推荐 `git clean`, 这是因为它们不能很可靠的处理符号连接。相反，使用 [rush purge](../../commands/rush_purge) 来删除由 Rush 创建的 `node_modules` 文件夹。
