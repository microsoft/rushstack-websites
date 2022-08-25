---
title: 日常用到的 Heft 命令
---

[开始使用 Heft](../heft_tutorials/getting_started.md) 教程介绍了 `heft build` 和 `heft test`. 本文将介绍一些特别有用的日常命令，参考 [Heft 命令行](../heft/cli.md) 一文来获取完整的命令和参数。

## 调查问题

如果你正在诊断 Heft 构建问题，下面有一些有用的参数：

- `--verbose`: 例如，你可以用 `heft build --verbose` 替换 `heft build`, 该参数的功能可以展示任务调用过程中的更多细节。
- `--debug`: 为了获得更多的细节，可以运行 `heft --debug build` 来查看调用堆栈和额外的跟踪信息。注意，`--debug`是一个全局参数，所以它必须在 `build` action 之前。

## 监听模式构建

执行 `heft build --watch` 时，TypeScript 编译器会不间断运行并等待源文件发生变化。一旦发生变动，Heft 会重新构建受影响的文件，该构建是最小增量构建，其速度非常快。

当使用 Webpack 时，`heft start` 会唤醒一个本地开发服务器（参考 [DevServer](https://webpack.js.org/configuration/dev-server/)），每当源代码被保存时，该服务会自动以编译好的代码刷新浏览器。当调试 UI 布局时，该功能可以节省大量的时间！并不需要给 `heft start` 添加 `--watch` 参数，因为该 action 下会自动启动监听模式。

## Jest 交互式终端

对于测试而言，可以使用 `heft test --watch` 来调用 Jest 的交互功能，其目录如下：

```
No tests found related to files changed since last commit.
Press `a` to run all tests, or run Jest with `--watchAll`.

Run start. 0 test suites

Tests finished:
  Successes: 0
  Failures: 0
  Total: 0

Watch Usage
 › Press a to run all tests.
 › Press f to run only failed tests.
 › Press p to filter by a filename regex pattern.
 › Press t to filter by a test name regex pattern.
 › Press q to quit watch mode.
 › Press Enter to trigger a test run.
```

每当你保存更改后的源文件，Heft 将自动编译项目，然后 Jest 将重新运行任何受影响的测试，最终更新报告。
