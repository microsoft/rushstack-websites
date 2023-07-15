---
title: Everyday Heft commands
---

[Hello World](../tutorials/hello_world.md)教程介绍了`heft build`和`heft test`命令行 action。在本节中，我们将介绍一些特别有用的日常命令。有关 action 和 parameter 的完整列表，请参考[Heft 命令行](../intro/cli.md)参考。

## 调查问题

如果你正在诊断 Heft 构建的问题，有几个有用的 parameter 需要注意：

- `--verbose`：例如，你可以运行`heft build --verbose`来查看有关如何调用 task 的更多详细信息，而不是`heft build`。
- `--debug`：对于更多的详细信息，你可以运行`heft --debug build`来查看调用堆栈和额外的跟踪信息。注意，`--debug`是一个全局 parameter，所以它必须在`build` action 名之前。

## 运行任意集合的 phases

你在**heft.config**中定义的每个 phase 都会产生一对命令行 action，这些 action 调用该 phase 及其依赖项（使用`phaseDependencies`声明）。`heft run`命令允许你选择运行任意的 phases：

```
usage: heft run [-h] [-t PHASE] [-T PHASE] [-o PHASE] ...

Run a provided selection of Heft phases.

Positional arguments:
  "..."                 Scoped parameters. Must be prefixed with "--", ex.
                        "-- --scopedParameter foo --scopedFlag". For more
                        information on available scoped parameters, use "--
                        --help".

Optional arguments:
  -h, --help            Show this help message and exit.

Optional scoping arguments:
  -t PHASE, --to PHASE  The phase to run to, including all transitive
                        dependencies.
  -T PHASE, --to-except PHASE
                        The phase to run to (but not include), including all
                        transitive dependencies.
  -o PHASE, --only PHASE
                        The phase to run.
```

假设你的`test` phase 依赖于`build`。然后正常运行`heft test`会执行这两个 phases。要**只**调用`test` phase，你可以使用`heft run --only test`。

请注意，task 不能单独运行。phase 是选择 Heft 操作的最小粒度。
