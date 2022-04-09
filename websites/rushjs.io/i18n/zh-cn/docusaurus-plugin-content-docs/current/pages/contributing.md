---
title: 贡献
---

Rush 是在 [Rush Stack](https://rushstack.io/) 项目下进行开发：

&nbsp;&nbsp;&nbsp;&nbsp; [https://github.com/microsoft/rushstack](https://github.com/microsoft/rushstack)

在 [rushjs.io-website](https://github.com/microsoft/rushjs.io-website) 仓库中贡献文档。

请阅读 [Contributing](https://rushstack.io/pages/contributing/get_started/) 文档以获取更多关于构建 Rush 和提交 PR 的指南。

相关的仓库目录是：

- [apps/rush](https://github.com/microsoft/rushstack/tree/master/apps/rush) - 前端命令行交互
- [libraries/rush-lib](https://github.com/microsoft/rushstack/tree/master/libraries/rush-lib) - 实现自动化 API 和引擎的逻辑。

## 测试 Rush 构建

一旦你完成了修复和构建了你的分支（就像[贡献](https://rushstack.io/pages/contributing/get_started/)一文中描述的），你需要测试你的 Rush 构建。

Rush 有一个**版本选择器**功能，它读取从 **rush.json** 中读取了 `rushVersion`, 之后自动下载并调用指定的引擎版本。因此如果我们启用你构建的 `@microsoft/rush`, 它将并不会执行你的代码。为了跳过这个版本选择器，我们需要直接调用 `@microsoft/rush-lib` 引擎：

```shell
$ cd rushstack/libraries/rush-lib
$ node ./lib/start.js --help
```

如果你想从其他位置上更容易地调用你的测试构建，我们建议创建一个 `testrush` 命令。

对于 Mac OS 或 Linux 系统的 Bash:

```shell
# 用自己构建的rush-lib的完整路径来代替。
alias testrush="node ~/git/rushstack/libraries/rush-lib/lib/start.js"
```

对于 Windows, 可以创建一个 `testrush.cmd` 并将其加到系统路径 `PATH`:

```
@ECHO OFF
REM Substitute the full path to your own build of rush-lib:
node "C:\Git\rushstack\apps\rush-lib\lib\start.js" %*
```

## 调试 Rush

使用 VS Code 的调试器来调试 Rush 也是如此。创建一个如下的配置文件：

**rushstack/libraries/rush-lib/.vscode/launch.json**

```js
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Rush",
      "program": "${workspaceFolder}/lib/start.js",
      "args": [ "list", "--json" ],  // <====== 定义你自己的 Rush 命令
      "cwd": "(repo folder that you want to debug)"  // <===== 定义你的工作目录
    }
  ]
}
```

保存完上述文件后，在 VSCode 中点击 _"View" --> "Run"_ 并选择 "Debug Rush" 配置。之后点击 _"Run" --> "Start Debugging"_ 开始调试。调试器会正确地工作。

## 不使用单元测试来构建

Rush 目前使用 **gulp-core-build** 来进行构建，它默认执行了单元测试，这将花费很长时间。你可以通过直接调用 gulp 来跳过它们。

```shell
# 完整的构建 Rush 及其依赖，包括单元测试。
$ rush build --to rush-lib --verbose

# "rush-lib" 快速构建，没有单元测试。
$ npm install -g gulp
$ cd rushstack/libraries/rush-lib
$ gulp build
```
