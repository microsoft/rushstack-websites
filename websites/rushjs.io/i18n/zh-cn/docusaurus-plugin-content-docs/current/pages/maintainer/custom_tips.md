---
title: Custom tips (实验性功能)
---

Custom tips 允许您为 Rush 的控制台消息添加为您的特定单仓库量身定制的建议。

以下是一个 custom tips 可以帮助的例子：假设您的公司使用一个私有的 NPM 注册表，该注册表定期从上游的 `npmjs.com` 服务器同步最新的包版本。有时用户可能试图安装刚刚发布的版本，而该版本尚未同步，此时 `rush update` 可能会显示以下错误：

```
Progress: resolved 0, reused 1, downloaded 0, added 0
/users/example/code/my-repo/apps/my-app:
 ERR_PNPM_NO_MATCHING_VERSION  No matching version found for example-library@1.2.3

This error happened while installing a direct dependency of my-app

The latest release of example-library is "1.1.0".
```

此错误有些令人困惑，因为真正的最新发布版本是 `1.2.3`，而错误则是指的私有注册表同步的最新版本。如果您为您的单仓库维护一个帮助热线，您可能会经常收到关于这个错误的支持票据，这可以通过显示 custom tip 来避免。

## 配置 custom tip

上面的 `ERR_PNPM_NO_MATCHING_VERSION` 代码来自 PNPM。Rush 对应的提示 ID 是 `TIP_PNPM_NO_MATCHING_VERSION`。我们可以如下定义提示：

(如果您没有此文件，您可以使用 `rush init` 生成它。)

**common/config/rush/custom-tips.json**

```js
/**
 * 这个配置文件允许仓库维护者配置与某些 Rush 消息一起打印的额外详细信息。更多文档可在
 * Rush 官方网站上找到：https://rushjs.io
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/custom-tips.schema.json",

  /**
   * 指定 Rush 要显示的 custom tips。
   */
  "customTips": [
    // {
    //   /**
    //    * (必须) 一个标识符，表示 Rush 可能打印的消息。
    //    * 如果打印了该消息，则将显示此 custom tip。
    //    * 请参阅 Rush 文档以获取可能的标识符的当前列表。
    //    */
    //   "tipId": "TIP_RUSH_INCONSISTENT_VERSIONS",
    //
    //   /**
    //    * (必须) 要为此提示显示的消息文本。
    //    */
    //   "message": "要获取额外的故障排除信息，请参阅此 wiki 文章：\n\nhttps://intranet.contoso.com/docs/pnpm-mismatch"
    // }
    {
      "tipId": "TIP_PNPM_NO_MATCHING_VERSION",
       "message": "PNPM 的这个“没有匹配版本”的错误经常是由于新版本尚未同步到我们公司的内部 NPM 注册表所导致的。\n\n要获取故障排除指南，请查阅我们的团队 wiki：\n\nhttps://example.com/wiki/npm-syncing"
    }
  ]
}
```

随着这次更改，用户现在将在原始错误旁边看到 custom tip：

```
Progress: resolved 0, reused 1, downloaded 0, added 0
/users/example/code/my-repo/apps/my-app:
 ERR_PNPM_NO_MATCHING_VERSION  No matching version found for example-library@1.2.3

This error happened while installing a direct dependency of my-app

The latest release of example-library is "1.1.0".

| Custom Tip (TIP_PNPM_NO_MATCHING_VERSION)
|
| PNPM 的这个“没有匹配版本”的错误经常是由于新版本尚未同步到我们公司的内部 NPM 注册表所导致的。
|
| 要获取故障排除指南，请查阅我们的团队 wiki：
|
| https://example.com/wiki/npm-syncing
```

请注意，Rush 用 `|` 前缀 custom tips，以将其与 Rush 软件的官方消息区分开。

## 贡献新的 tips

有没有你想自定义的 Rush 消息，但没有可用的 `tipId`？实现新的 tips 相对容易。代码位于
[rush-lib/src/api/CustomTipsConfiguration.ts](https://github.com/microsoft/rushstack/blob/main/libraries/rush-lib/src/api/CustomTipsConfiguration.ts)，
请随时创建拉取请求来提议新的 tips。

## Custom tip 标识符

<!-- 注意：按字母顺序排序！-->

### TIP_PNPM_INVALID_NODE_VERSION

对应于 PNPM 的 [ERR_PNPM_INVALID_NODE_VERSION](https://pnpm.io/errors#err_pnpm_invalid_node_version)。

### TIP_PNPM_MISMATCHED_RELEASE_CHANNEL

对应于 PNPM 的 [ERR_PNPM_MISMATCHED_RELEASE_CHANNEL](https://pnpm.io/errors#err_pnpm_mismatched_release_channel)。

### TIP_PNPM_NO_MATCHING_VERSION

<!-- PNPM 网站上当前未记录 -->

对应于 PNPM 的 [ERR_PNPM_NO_MATCHING_VERSION](https://pnpm.io/next/errors)。

### TIP_PNPM_NO_MATCHING_VERSION_INSIDE_WORKSPACE

对应于 PNPM 的 [ERR_PNPM_NO_MATCHING_VERSION_INSIDE_WORKSPACE](https://pnpm.io/errors#err_pnpm_no_matching_version_inside_workspace)。

### TIP_PNPM_OUTDATED_LOCKFILE

对应于 PNPM 的 [ERR_PNPM_OUTDATED_LOCKFILE](https://pnpm.io/errors#err_pnpm_outdated_lockfile)。

### TIP_PNPM_PEER_DEP_ISSUES

对应于 PNPM 的 [ERR_PNPM_PEER_DEP_ISSUES](https://pnpm.io/errors#err_pnpm_peer_dep_issues)。

### TIP_PNPM_TARBALL_INTEGRITY

对应于 PNPM 的 [ERR_PNPM_TARBALL_INTEGRITY](https://pnpm.io/errors#err_pnpm_tarball_integrity)。

### TIP_PNPM_UNEXPECTED_STORE

对应于 PNPM 的 [ERR_PNPM_UNEXPECTED_STORE](https://pnpm.io/errors#err_pnpm_unexpected_store)。

### TIP_RUSH_INCONSISTENT_VERSIONS

当项目有不一致的依赖版本时，此消息由 `rush install` 或 `rush update` 打印，只有在 **rush.json** 中启用了 `ensureConsistentVersions` 时才会这样。

**Rush 输出示例：**

```
找到 5 个不匹配的依赖关系！
```
