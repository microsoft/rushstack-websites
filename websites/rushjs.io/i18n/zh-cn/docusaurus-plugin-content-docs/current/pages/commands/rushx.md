---
title: rushx
---

`rushx` 命令与 `npm run` 或者 `pnpm run` 类似，它会调用 **package.json** 文件中 `"scripts"` 字段中定义的 shell 脚本。任何额外的命令行参数都会传递给该 shell 脚本，这些参数不会经过任何验证。

例如在你的项目中：

**&lt;my project&gt;/package.json**

```js
{
  "name": "my-project",
  "version": "0.0.0",
  "scripts": {
    "build": "rm -Rf lib && tsc",
    "test": "jest"
  }
}
```

如果你单独调用 `rushx`，它将会显示可用的命令：

```
用法：rushx [-h]
      rushx [-q/--quiet] <命令> ...

可选参数：
  -h, --help            展示帮助信息并退出。
  -q, --quiet           隐藏 Rush 启动信息。

my-project 项目中可用的命令：
  build: "rm -Rf lib && tsc"
  test:  "jest"
```

调用 `rushx build` 等同于运行 `rm -Rf lib && tsc`。添加的参数将会被直接添加到字符串的末尾，例如 `rushx build --verbose` 等同于 `rm -Rf lib && tsc --verbose`。

## 使用 "rush" 还是 "rushx"？

`rushx` 和 `rush` 这两个命令很容易混淆：

- **rush** 调用一个通用的操作，它会影响整个仓库（“全局命令”）或者多个项目（“批量命令”）。这些命令[应该被仔细设计](../maintainer/custom_commands.md)。Rush 会强制对它们的参数进行验证和文档化。
- **rushx** 为单个项目执行自定义操作。尽管一些命令用于实现批量命令，但是许多命令都是该项目开发人员独有的辅助脚本。Rush 并不严格验证这些命令。

## 为什么使用 "rushx" 而不是 "pnpm run" 或者 "npx"？

`rushx` 命令具有与 `pnpm run` 或者 `npx` 相似的功能，但是还有一些额外的好处：

- 通过使用 [Rush 版本选择器](../contributing.md) 来确定需要使用的工具链
- 基于 Rush 的配置来准备 shell 环境
- 实现了额外的验证
