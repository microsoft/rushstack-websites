---
title: 推荐设定
---

当你的仓库构建并运行后，**rush.json** 中还有一些建议开启的配置项，这些严格的设定可以提高仓库的健康程度和减少维护成本。由于这些配置项要求你修改代码，因此默认是关闭的，同时，这些配置并不适用于所有场景。

## repository.url

如果仓库使用 `rush change` 来记录更新日志，那么强烈建议在 **rush.json** 中设定 **repository.url**, 它可以确保 `rush change` 找到准确的基础分支，尤其是当仓库被其他人 "fork" 的情况下。

**rush.json** 示例如下：

```js
  "repository": {
    // 将下面的 URL 为你的仓库的 "git clone" 时使用的 URL
    "url": "https://github.com/microsoft/rush-example"
  }
```

## ensureConsistentVersions

我们推荐将 **rush.json** 内的 `ensureConsistentVersions` 设定为 `true`，它会使得 Rush 在执行以下指令时前执行 `rush check`:

- `rush update`
- `rush link`
- `rush version`
- `rush publish`

该指令会去检查每个项目的 **package.json** 文件并保证所有的依赖都是同一个版本，该配置可以避免版本不一致导致的问题，因此推荐你打开。

在某些特殊情况下不同版本可能更适用些，例如，你可能希望逐步更新项目内的 TypeScript 版本，而不是一次性的，在此期间，你需要使用两个不同的 `typescript` 版本。对于该情况，你可以在 **common-versions.json** 中添加一个 `allowedAlternativeVersions` 字段。

> NOTE: 注意：在早期的 Rush 版本中，CI 脚本示例将 `rush check` 视为一个单独的构建步骤；如果开启 `ensureConsistentVersions`，那么你可以将 `rush check` 从 CI 构建步骤中删除。

## strictPeerDependencies

如果你使用 PNPM 包管理器，那么强烈建议你将 **rush.json** 中的 `strictPeerDependencies` 设定为 `true`，它会使得 Rush 在安装时开启 PNPM 的 `--strict-peer-dependencies` 配置项。开启后，如果出现不兼容的依赖版本时候，即不满足 peerDependencies 时，`rush install` 将会执行失败（出于历史原因，JavaScript 的包管理器通常不会将其视为一个错误）。
