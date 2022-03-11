---
title: 环境变量
---

Rush 的环境变量可以通过终端环境变量来定制：

## RUSH_ABSOLUTE_SYMLINKS

如果该变量设定为 `true`, Rush 会使用绝对路径创建符号链接而不是相对路径。当仓库被移动时，或者仓库的部分内容被移动到沙盒时，该参数可能会很有用。

## RUSH_ALLOW_UNSUPPORTED_NODEJS

如果该变量设定为 `true`, 当运行的 Node 版本不符合 **rush.json** 中 `odeSupportedVersionRange` 字段指定的范围时，Rush 不会失败。

## RUSH_BUILD_CACHE_CREDENTIAL（实验性）

该环境变量用于 [构建缓存](../../maintainer/build_cache) 这个实验性的功能。

配置后将会给远端的构建缓存提供一个凭证。这个凭证可以被缓存或覆盖。

如果使用 Azure Blob Storage, 在序列化的参数重必须有一个 SAS 口令。关于其更多细节可以参考[这篇文章](https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview)。

## RUSH_BUILD_CACHE_ENABLED （实验性）

该环境变量用于 [构建缓存](../../maintainer/build_cache) 这个实验性的功能。

覆盖定义在 `build-cache.json` 中的 `buildCacheEnabled` 值。这个环境变量必须是 `1`（表示 true）或者 `0`（表示 false）。如果没有配置构建缓存，那么该环境变量将被忽略。

## RUSH_BUILD_CACHE_WRITE_ALLOWED（实验性）

该环境变量用于 [构建缓存](../../maintainer/build_cache) 这个实验性的功能。

覆盖定义在 `build-cache.json` 中的 `isCacheWriteAllowed` 值。这个环境变量必须是 `1`（表示 true）或者 `0`（表示 false）。如果没有配置构建缓存，那么该环境变量将被忽略。

## RUSH_DEPLOY_TARGET_FOLDER

该环境变量用于给 [rush deploy](../../commands/rush_deploy) 指令指定 `--target-folder` 参数。

## RUSH_GIT_BINARY_PATH

显式的指定 Rush 执行时候的 Git 执行文件的路径。

## RUSH_GLOBAL_FOLDER

覆盖了 Rush 中的 `~/.rush` 全局目录的路径，它用于存储临时文件。

为了避免并发问题和兼容性问题，Rush 中的大部分临时文件都是存储在仓库内每个项目中的独立目录中。然而，一小部分文件（例如 `@microsoft/rush-lib` 引擎和包管理器）被存储在全局文件夹下来加速安装。在 POSIX 风格的操作系统上的默认路径为 `~/.rush`, 在 Windows 上的默认路径为 `C:\Users\YourName`.（POSIX 是 IEEE 公司的一个商标）。

使用 `RUSH_GLOBAL_FOLDER` 可以指定不同的目录路径，如果 Windows 租政策禁止安装在用户目录时，该环境变量很有用。

## RUSH_INVOKED_FOLDER

当 Rush 执行脚本时，有时候需要改变工作目录，例如从一个项目文件到仓库根目录。起初的工作目录（Rush 命令被调用的目录）被
子进程的 `RUSH_INVOKED_FOLDER` 环境变量赋值，以便在脚本中按需使用。`RUSH_INVOKED_FOLDER` 与包管理器执行生命周期脚本时的 `INIT_CWD` 相同。

## RUSH_PARALLELISM

约定构建期间最大的并行进程数，更多信息可以参考 [rush build](../../commands/rush_build) 的 `--parallelism` 参数的命令行帮助。

## RUSH_PNPM_STORE_PATH

当使用 pnpm 作为包管理器时，该变量可以用于配置 pnpm 使用的存储目录。

如果使用相对路径，那么存储路径将被解析为相对于进程当前工作目录。推荐使用绝对路径。

## RUSH_PREVIEW_VERSION

该命令变量可以覆盖版本选择器将要安装的 Rush 的版本。默认值由 `rushVersion` 字段来确定。

例如，如果你想在升级前尝试不同版本的 Rush, 你可以这样做：

```shell
$ set RUSH_PREVIEW_VERSION=5.0.0-dev.25
$ rush install
```

## RUSH_TEMP_FOLDER

该变量覆盖了 Rush 的临时目录。默认值是仓库根目录下的 **common/temp**。

## RUSH_VARIANT

该变量设定了当安装和链接包依赖时 Rush 使用的安装变种。

更多信息可以参考[安装变种](../../advanced/installation_variants)。
