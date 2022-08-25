---
title: 仓库中添加项目
---

_该文章是 [创建一个新的仓库](../maintainer/setup_new_repo.md) 的继续。（如果你想看最终结果，可以在 GitHub 上查看 [rush 示例](https://github.com/microsoft/rush-example)）_

## 步骤 4: 添加第一个项目

我们建议每次只添加或验证单个项目，而不是一次性将所有项目都添加到 **rush.json** 中。将你的项目想象成一张[依赖图](https://en.wikipedia.org/wiki/Dependency_graph)，可以从“叶子”项目（不依赖仓库内的其他项目），之后逐步推进。如果你遇到了任何错误，这种方法可以让错误更容易理解和调查。如果每次提交单个项目，这也会使你的 Git 历史更加易于理解。

对于这个示例，首先添加 **my-toolchain** 项目，它是其他所有项目的基础。我们将使用“种类目录”模式（其含义可以参考 **rush.json** 中的注释），所以将其移动到一个名为 "tools" 的文件夹下，我们最终的计划是将所有 NodeJS 工具包都放到 "tools" 文件夹中。

```
~/my-repo$ mkdir tools
~/my-repo$ cd tools
~/my-repo/tools$ cp -R ~/my-toolchain/ .
~/my-repo/tools$ cd my-toolchain
```

接下来需要删除项目下的一些文件：

- 删除本地的 shrinkwrap 文件，因为它会被 Rush 的 shrinkwrap 文件代替。

- 考虑删除 **.npmrc** 文件，因为 Rush 使用了 **common/config/rush/.npmrc**.

- 考虑删除项目的 Git 配置文件，除非该项目有单独的配置。

```
~/my-repo/tools/my-toolchain$ rm -f shrinkwrap.yaml npm-shrinkwrap.json package-lock.json yarn.lock
~/my-repo/tools/my-toolchain$ rm -f .npmrc          # （如果存在的话）
~/my-repo/tools/my-toolchain$ rm -f .gitattributes  # （如果存在的话）
~/my-repo/tools/my-toolchain$ rm -f .gitignore      # （如果存在的话）
```

> **关于 “shrinkwrap 文件”**
>
> 依据不同的包管理工具，shrinkwrap 文件可能是 **shrinkwrap.yaml**, **npm-shrinkwrap.json**, **package-lock.json**, 或 **yarn.lock**.（一些包管理工具使用了 "lock" 文件，
> 但该 “lock” 与文件的访问权限并无关系。在该文档中，由于我们并不知道你使用了哪种包管理工具，因此使用 "shrinkwrap" 来泛指这些文件。
>
> 通常，包管理工具会在每个项目文件夹内创建 shrinkwrap 文件，但是在 Rush 中，整个项目共用存储在 \*\*common/config/rush" 目录下的一个 shrinkwrap 文件，它会被存储在 Git 内。
> 将所有依赖信息整合到单独一个 shrinkwrap 内有一些优势，例如减少冲突、方便查看 diff, 还能提高安装速度。

提交新的项目文件到 Git:

```
~/my-repo/tools/my-toolchain$ cd ../..
~/my-repo$ git add .
~/my-repo$ git commit -m "Adding my-toolchain"
```

## 步骤 5: 第一次运行 "rush update"

当将项目文件拷贝完后，我们需要编辑 **rush.json**, 应该在 `projects` 字段下增加一个对象：

```jsonc
  "projects": [
    {
      "packageName": "my-toolchain",
      "projectFolder": "tools/my-toolchain"
    }
  ]
```

这告知 Rush 需要接管 my-toolchain 这个项目。

> **为什么 Rush 不能自动检测到这个项目？**
>
> Rush 并不会使用通配符来检测项目。该设计有以下考虑：
>
> 1. 深度优先搜索开销太大，尤其是需要重复收集列表时；
> 2. 在带有缓存的 CI 机器上，搜索可能会遗漏掉之前构建中的文件；
> 3. 集中式的管理所有项目以及其重要的元数据是很有用的，例如，可以让审批等策略更简单。

随后通过执行 `rush update` 来安装 **my-toolchain** 的依赖，该命令可以在 Rush 仓库内的任何子目录下运行。

```
~/my-repo$ rush update
~/my-repo$ git add .
~/my-repo$ git commit -m "rush update"
```

因为这是仓库内的第一个项目，你将会发现 `rush update` 创建了一些新文件：

- **common/config/rush/shrinkwrap.yaml**: 公共的 shrinkwrap 文件 (此处假定使用了 PNPM)

- **common/scripts/install-run-rush.js**: 用于在 CI 任务中以一种可靠的方式来启动 Rush

- **common/scripts/install-run.js**: 用于在 CI 任务中以一种可靠的方式来启动任意工具

## 步骤 6: 验证新项目是否构建成功

为了构建项目，Rush 会寻找项目内的 **package.json** 文件内 `"scripts"` 字段下的 `"build"` 指令，在 [rush 示例](https://github.com/microsoft/rush-example)中，使用简单的 shell 脚本 `"rimraf ./lib/ && tsc"` 来执行构建。

```json
{
  "name": "my-toolchain",
  "version": "1.0.0",
  "description": "An example toolchain used to build projects in this repo",
  "license": "MIT",
  "bin": {
    "my-build": "bin/my-build.js"
  },
  "scripts": {
    "build": "rimraf ./lib/ && tsc"
  },
  "dependencies": {
    "colors": "^1.3.2"
  },
  "devDependencies": {
    "@types/node": "^10.9.4",
    "rimraf": "^2.6.2",
    "typescript": "^3.0.3"
  }
}
```

当创建 `"build"` 指令时，需要注意以下几件事：

Rush 通常会使用系统的 PATH 环境变量来查找脚本，然而，如果你制定了诸如 "gulp" 或者 "make" 等单个单词的指令，Rush 会首先在 `common\temp\node_modules\.bin` 目录下查找该指令。

如果进程返回非零退出码，Rush 将判定为失败，并阻塞随后的构建。

如果指令对 `stderr` 存在任意输入，则 Rush 将以错误、警告报告等形式来解释该输入。这将会中断构建流程（设计如此，如果你允许开发者以这种 “狼来了” 的形式合并 PR，很快你就会发现，报警提示很快就会堆积到没人再去看它们）。诸如 Jest 等的工具库认为向 `stderr` 写入信息是常见操作，对此需要你[重定向它们的输出](https://github.com/microsoft/rushstack-legacy/blob/main/core-build/gulp-core-build/src/tasks/JestReporter.ts#L14).

即使某个项目不需要被 `rush build` 处理，你依然需要保留 `build` 字段，将其设定为空字符串(`""`) 后 Rush 会忽略它们。

现在我们来构建你的项目，在 Rush 仓库下的任何子目录都可以执行下面命令（它将会构建仓库内的所有项目）：

```
$ rush build
```

Rush 提供了大量命令行选项来构建项目，可以参考 [rush build](../commands/rush_build.md) 和 [rush rebuild](../commands/rush_rebuild.md).

> **幻影依赖错误**
>
> Rush 和 PNPM 使用符号连接来防止项目中引入[幻影依赖](../advanced/phantom_deps.md)，如果一个 NPM 依赖并没有在项目内的 **package.json**
> 中声明，那么当你尝试引入它时会有一个运行时报错。当你将项目迁移到 Rush 时，幻影依赖报错是最常见的问题之一。通常的解决方案是将缺失的依赖添加到 **package.json** 文件中。
>
> [rush scan](../commands/rush_scan.md) 指令可以快速地检查出这些问题。

## 步骤 7: 添加更多的项目

你可以依据步骤 4 来添加更多的项目，在我们的事例中，接下来将会添加 **my-controls** 工程（因为它依赖 **my-toolchain**），最后是 **my-application**（因为它依赖其他两个项目)。由于我们的设想的场景中可能有更多这类项目，因此预期会添加一些类别文件夹（"libraries" 和 "apps"），因为我们的场景中会有更多这类项目。完整的 `"projects"` 字段示例如下：

```jsonc
  "projects": [
    {
      "packageName": "my-app",
      "projectFolder": "apps/my-app"
    },

    {
      "packageName": "my-controls",
      "projectFolder": "libraries/my-controls",
      "reviewCategory": "production"
    },

    {
      "packageName": "my-toolchain",
      "projectFolder": "tools/my-toolchain",
      "reviewCategory": "tools"
    }
  ]
```

如果你已经成功添加了所有项目，便可以开始考虑启用其他功能。配置文件中包含大量的代码片段，你可以将它们注释掉后使用。[rush 示例](https://github.com/microsoft/rush-example) 中使用了这些代码片段。
