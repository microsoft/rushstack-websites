---
title: rush-pnpm
---

当使用 PNPM 包管理器时，Rush 会将 PNPM 工作区重定位到 `common/temp/` 路径下。
它还会注入一些配置钩子来支持 Rush 特定的增强功能，例如
[优先版本](../advanced/preferred_versions.md) 和更快的增量安装。

因此，如果你在 Rush 仓库中直接调用 `pnpm` 命令，它可能会因为找不到 `pnpm-workspace.yaml` 文件失败。
一些操作可能会由于与 Rush 的增强功能不兼容而发生故障。

为了避免这些问题，在你的 Rush 仓库中，无论何时都应该使用 `rush-pnpm` 来代替 `pnpm` 命令。
`@microsoft/rush` 附带了 `rush-pnpm` 二进制文件用于替代品 `pnpm` 命令。它提供了以下功能：

- 设置正确的上下文/环境，以便 PNPM 命令能够正常工作
- 报告已知不兼容操作的错误
- 报告潜在不兼容操作的警告
