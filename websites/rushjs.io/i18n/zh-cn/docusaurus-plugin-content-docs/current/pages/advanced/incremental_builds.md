---
title: 增量构建
---

Rush 的**增量构建**功能可以通过跳过某些已经是最新的库来加速构建，在本文中，“已经是最新的”含义是：

1. 项目已经在本地构建过，并且
2. 其源码和 NPM 依赖没有发生变化，并且
3. 如果该项目依赖另一个 Rush 项目，这些项目都是最新的，并且
4. 命令行参数没有变化（例如，在 `rush build` 后调用 `rush build --production` 需要重新构建）。

该功能可以和[选择项目参数](../../developer/selecting_subsets)结合使用，其作用是开发者显式的告诉 Rush 那些项目需要被处理。增量构建可以重新使用本地磁盘上已经存在的输出（与[构建缓存](../../maintainer/build_cache)形成鲜明的对比，构建缓存可以从云端获取到之前的构建缓存，它依然是实验性的功能，但是它可能最终会替换增量构建。)

## 如何使用

只需要执行 `rush build` 两次就能使用增量构建：

```shell
$ rush install

# 可能需要一点时间
$ rush build

# 第二次耗时只需要几秒钟
$ rush build
```

`rush build` 是增量构建（`rush rebuild` 不是增量构建）。如果是你自定义的[全局指令](../../maintainer/custom_commands), 你可以在配置文件 [command-line.json](../../configs/command-line_json) 中启用 `"incremental"` 选项来使其成为增量构建。

## 它是如何工作的？

你的项目构建脚本（被 `rushx build` 或 `npm run build` 调用）可能自身就有增量优化。例如，[Heft](https://rushstack.io/pages/heft/overview/) 对于不同的任务维护了多缓存。然而，甚至当 `rushx build` 对一个项目无效时，仍然会由于开启了 Node 进程、调用 JavaScript 文件，比较单个文件的时间戳而导致的昂贵的开销，假设上述操作需要 500ms, 如果你的 monorepo 存在 100 个项目，那么即使在项目都是最新的情况下，上述工作要花费 100 \* 0.5 == **50 seconds**.

Rush 通过一次搜索来对仓库进行全局分析，进而消除了这次操作耗时 —— 这种方式在所有项目都是最新的情况下，可以不唤醒所有项目。作为一个额外的优化，Rush 的增量分析依赖文件哈希而不是时间戳。如果你切换到不同的分支，或者切来切去，许多文件的时间戳会改变，但是 Rush 的增量分析不会受到影响，因为源文件没有发生改变。文件哈希受到 [@rushstack/package-deps-hash](https://www.npmjs.com/package/@rushstack/package-deps-hash) 管理，哈希值被存储在 `<your-project>/.rush/temp/package-deps_<task-name>.json` 的文件中，监视这个文件可以提供一些技术指标。

## 只构建发生变化的项目（不安全）

假设我们的 monorepo 有以下项目：

<img src="/images/docs/selection-intro.svg" alt="a sample monorepo" style={{ height: "150px" }} />

上述图例中，圆圈表示本地项目，没有外部的 NPM 依赖。箭头 `D` 到 `C` 表明 `D` 依赖 `C`, 这意味着 `C` 必须在 `D` 构建前构建。

假设构建完所有项目后，在 `B` 项目下改变了源文件。项目 `C` 和 `D` 依赖于 `B`, 因此也需要构建：

<img src="/images/docs/selection-impact.svg" alt="rush build --impacted-by B" style={{ height: "150px" }} />

我们可能会调用：

```shell
# 该命令会重新构建 B, C, D
$ rush build
```

但是，你如何知道你对 `C` 的改变是否会影响其 API? 例如，也许你想更新某个控制按钮的颜色，或者某个错误信息中的文本。

`--changed-projects-only` 参数告知 Rush 之构建那些文件被更改的项目：

<img src="/images/docs/selection-only.svg" alt="rush build --only B" style={{ height: "150px" }} />

我们的调用方式如下：

```shell
# 下面指令会重新构建 B（但是忽略 C 和 D）
$ rush build --changed-projects-only
```

`--changed-projects-only` 参数是不安全的，因为当下游项目重新构建时可能遇到错误。假设你比 Rush 更了解那些需要重新构建，那么这个参数可以节省时间。如果你不知道，那么可以调用 `rush build` 来保证正确性。

参考

- [选择部分项目](../../developer/selecting_subsets)
- [使用监听模式](../../advanced/watch_mode)
