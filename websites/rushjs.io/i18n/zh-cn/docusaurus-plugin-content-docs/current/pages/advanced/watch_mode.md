---
# The command-line.json comments refer to this article title:
title: 使用监听模式
---

诸如 [Webpack](https://webpack.js.org/configuration/watch/) 和 [Jest](https://jestjs.io/docs/cli) 等流行工具提供了“监听模式”功能：当任务完成后，工具选择文件系统来等待源代码发生变动，一旦监听到变动，任务队列会更新其输出。这加速开发，因为 (1) 一旦你保存文件就可以重新构建；(2) 由于进程没有停止，因此可以使用缓存。

因为这些功能仅仅对单个项目有效，一旦在 monorepo 中开发，我们需要能够**_一次性监听多项目_**的监听模式。

## 一个实验性的想法

假设我们的 monorepo 有如下项目：

<img src="/images/docs/selection-intro.svg" alt="a sample monorepo" style={{ height: "150px" }} />

上述图例中，圆圈表示本地项目，没有外部的 NPM 依赖。箭头 `D` 到 `C` 表明 `D` 依赖 `C`, 这意味着 `C` 必须在 `D` 构建前构建。

假设你保存了对项目 `B` 的变动：

<img src="/images/docs/selection-impact.svg" alt="rush build --impacted-by B" style={{ height: "150px" }} />

对于多项目的“监听模式”，我们预期会发生如下事情：

- `B` 应该被重新构建，因为它的文件被改变了；
- 之后，`C` 应该被重新构建，因为它依赖于 `B`
- 之后，`D` 应该被重新构建，因为它依赖于 `C`
- 最后，Webpack dev server（预期是由 `D` 唤起的）刷新你的 web 浏览器，重新构建的 app

如果通过 rush 来实现这个方案？假设项目内 `B` 和 `C` 都有如下的简单脚本：

**package.json**

```js
  . . .
  "scripts": {
    "build": "rm -Rf lib/ && tsc && jest"
  }
  . . .
```

我们将尝试在一个无限循环中调用 `rush build --to-except D`:

```shell
# 构建所有依赖于 D 的项目（但不包括 D 本身），并在无限循环中重复这个操作
$ while true; do rush build --to-except D; done
```

之后让它一直运行，我们在项目 `D` 中唤起 `heft start`（或者 `webpack serve`）：

之后你会发现上述方案有一些问题：

- `rm -Rf lib/` 删除了符号链接文件；符号链接会迷惑 Webpack 的文件监听，所以你会看到很多报错提示说：找不到导入的文件。Webpack 不会从中恢复它们，因为当文件重新写入时，符号链接的文件不会更新。

- 当监听时，`jest` 和 `rm -Rf` 步骤一般不重要。开发者的内部循环 **_编辑 -> 重新构建 -> 重新加载_** 比文件监听所需时间慢多了。

这些问题可以通过创建一个特殊的简化脚本来解决，比如这样：

**package.json**

```js
  . . .
  "scripts": {
    "build": "rm -Rf lib/ && tsc && jest",
    "build:watch": "tsc"
  }
  . . .
```

## 设置 "watchForChanges"（实验性）

Rush 的“文件监听” 基本思想是用 [chokidar](https://www.npmjs.com/package/chokidar) 来优化循环。下面是其用法：

1. 在 [command-line.json](../../configs/command-line_json) 中的添加一个[自定义指令](../../maintainer/custom_commands)。继续上面的示例，我们的自定义指令将被命名为 `"build:watch"`。重要的设置是 `"incremental"` 和 `"watchForChanges"`:

   **common/config/rush/command-line.json**

   ```js
     . . .
     "commands": [
       {
         "name": "build:watch",
         "commandKind": "bulk",
         "summary": "Build projects and watch for changes",
         "description": "For details, see the article \"Using watch mode\" on the Rush website: https://rushjs.io/",

         // 使用增量构建（重要）
         "incremental": true,
         "enableParallelism": true,
         // 启用“监听模式”
         "watchForChanges": true
       },
     . . .
   ```

2. 在每个项目的 **package.json** 下增加 `"build:watch"` 脚本（[PR #2298](https://github.com/microsoft/rushstack/pull/2298) 的目标是简化这一步骤，来使得项目内的 `"build:watch"` 与 `"build"` 相等，最终可以被合并到一个共享的 [rig 包](https://rushstack.io/pages/heft/rig_packages/)中。

如果你使用 [Heft](https://rushstack.io/pages/heft/overview/), 你的脚本将会像这样：

**package.json**

```js
  . . .
  "scripts": {
    "build": "heft build --clean",
    "build:watch": "heft build"
  }
  . . .
```

3. 参考[选择部分项目](../../developer/selecting_subsets)一文选中 `D` 的所有依赖，但不包含 `D` 本身：

```shell
# 构建所有依赖于 D 的项目（但不包括 D 本身），并在无限循环中重复这个操作
$ rush build:watch --to-except D
```

4. 随后，开一个项目目录中开启开发服务器：

```shell
# 在项目 D 的目录下开启 Webpack 的开发服务器
# （这是示例中的 web 应用）
$ cd apps/D
$ heft start # 或者用自己的 "npm run start"
```

5. 在某些情况下，为了实现更快的监听，`--changed-projects-only` 命令可以与 `"watchForChanges"` 结合使用。[增量构建](../../advanced/incremental_builds#building-changed-projects-only-unsafe)一文详细说明了他是如何工作的，以及它是否适合使用。

> **“实验性”** `"watchForChanges"` 的功能还在其初期阶段。有意见或建议请联系我们！
> GitHub issue [#1202](https://github.com/microsoft/rushstack/issues/1202)
> 跟踪更多工作项，以及 [William Bernting](https://github.com/wbern) 的开发计划。

## 社区解决方法

Rush 的社区分享了一些有用的替代方案：

- [@telia/rush-select](https://www.npmjs.com/package/@telia/rush-select) 是为监听 RUsh 项目和选中部分构建的交互式工具。

- [rush-dev-watcher](https://github.com/dimfeld/rush-dev-watcher) 是一个简单有用的脚本，它是由 [Daniel Imfeld](https://github.com/dimfeld) 开发的，它会执行一次初始构建，然后启动多个监听器。

## 参考

- [选择部分项目](../../developer/selecting_subsets)
- [增量构建](../../advanced/incremental_builds)
