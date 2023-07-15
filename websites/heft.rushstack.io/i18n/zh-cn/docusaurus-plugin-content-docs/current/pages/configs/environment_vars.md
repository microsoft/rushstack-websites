---
title: Environment variables
---

Heft 的行为可以通过下面描述的 shell 环境变量进行自定义：

## HEFT_JEST_DETECT_OPEN_HANDLES

此环境变量为 `@rushstack/heft-jest-plugin` 的 `--detect-open-handles` 参数提供了另一种指定方法。

## HEFT_JEST_DISABLE_CODE_COVERAGE

此环境变量为 `@rushstack/heft-jest-plugin` 的 `--disable-code-coverage` 参数提供了另一种指定方法。

## HEFT_JEST_MAX_WORKERS

此环境变量为 `@rushstack/heft-jest-plugin` 的 `--max-workers` 参数提供了另一种指定方法。

## HEFT_JEST_TEST_TIMEOUT_MS

此环境变量为 `@rushstack/heft-jest-plugin` 的 `--test-timeout-ms` 参数提供了另一种指定方法。

## RUSHSTACK_FILE_ERROR_BASE_FOLDER

在打印诊断信息（例如错误或警告）时控制如何显示源文件路径。

可能的值：

- **_(绝对路径)_**：打印的路径将相对于指定的绝对路径
- `{PROJECT_FOLDER}`：一个特殊的标记，表示打印的路径将相对于包含 **package.json** 的项目文件夹
- `{ABSOLUTE_PATH}`：一个特殊的标记，表示打印的路径应该是绝对路径

默认值是 `{PROJECT_FOLDER}`，但是当 Rush 调用如 Heft 这样的命令时，它将 `RUSHSTACK_FILE_ERROR_BASE_FOLDER` 设置为包含 **rush.json** 的根文件夹的路径。

> 注意：`RUSHSTACK_FILE_ERROR_BASE_FOLDER` 功能由通用的 [FileError](https://api.rushstack.io/pages/node-core-library.fileerror/) API 来实现，该 API 来自 `@rushstack/node-core-library`。

## WEBPACK_DEV_SERVER

默认情况下，`@rushstack/heft-webpack4-plugin` 和 `@rushstack/heft-webpack5-plugin` 在启动 Webpack 时会寻找名为 `webpack-dev-server` 的 NPM 包。使用 `WEBPACK_DEV_SERVER` 环境变量来配置不同的 NPM 包名称，比如这个包的私有分支。
