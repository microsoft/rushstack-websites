---
title: subspaces.json
---

**common/config/rush/subspaces.json**

```js
/**
 * 此配置文件管理 Rush 的实验性“subspaces”功能，
 * 它允许在一个 Rush 工作区中使用多个 PNPM 锁定文件。
 * 有关完整文档，请参阅 https://rushjs.io
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/subspaces.schema.json",

  /**
   * 将此标志设置为“true”以启用 subspaces 功能。
   */
  "subspacesEnabled": false,

  /**
   * （已弃用）这是从该功能的早期原型迁移的临时解决方案：
   * https://github.com/microsoft/rushstack/pull/3481
   * 它允许只有一个项目的 subspace 将其配置文件存储在项目文件夹中。
   */
  "splitWorkspaceCompatibility": false,

  /**
   * 当没有使用“--subspace”或“--to”参数调用诸如“rush update”之类的命令时，
   * Rush 将安装所有 subspaces。在拥有大量 subspaces 的巨大 monorepo 中，
   * 这将非常缓慢。将“preventSelectingAllSubspaces”设置为 true 以避免这种错误，
   * 通过始终要求选择参数来运行诸如“rush update”之类的命令。
   */
  "preventSelectingAllSubspaces": false,

  /**
   * subspace 名称列表，应该是由连字符分隔的小写字母数字单词，
   * 例如“my-subspace”。相应的配置文件路径将类似于
   * “common/config/subspaces/my-subspace/package-lock.yaml”。
   */
  "subspaceNames": []
}
```

## 另见

- [Rush subspaces](../advanced/subspaces.md)
