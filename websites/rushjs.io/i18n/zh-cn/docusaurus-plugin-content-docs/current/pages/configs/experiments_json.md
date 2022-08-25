---
title: experiments.json
---

这是 [rush init](../commands/rush_init.md) 生成的模版下的 **experiments.json** 文件：

**common/config/rush/experiments.json**

```js
/**
 * 该配置文件允许仓库开启或禁止某些实验性的功能。
 * 更多信息可以参考 Rush 官网： https://rushjs.io
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/experiments.schema.json",

  /**
   * Rush 5.14.0 改善了增量构建，它会忽略 pnpm-lock.json 文件中的一些虚假变化。
   * 该优化默认开启，如果你遇到了 "rush build" 忽略构建某些项目的问题，请开启一个
   * Github issue, 临时的解决方法是取消这行的注释来恢复当 package.json 变化时的
   * 旧行为。
   */
  /*[LINE "HYPOTHETICAL"]*/ "legacyIncrementalBuildDependencyDetection": true,

  /**
   * 默认情况下，'rush install' 传给 "pnpm install" 带有 --no-prefer-frozen-lockfile 参数。
   * 设定该值为 true 会传入 '--frozen-lockfile' 进而实现更快的下载。
   */
  /*[LINE "HYPOTHETICAL"]*/ "usePnpmFrozenLockfileForRushInstall": true,

  /**
   * 默认情况下， 'rush update' 传给 "pnpm install" 带有 --no-prefer-frozen-lockfile 参数
   * 设定该值为 true 会传入  '--prefer-frozen-lockfile' 来替换最小 shrinkwrap 变动。
   */
  /*[LINE "HYPOTHETICAL"]*/ "usePnpmPreferFrozenLockfileForRushUpdate": true,

  /**
   * 使用 'preventManualShrinkwrapChanges' 选项限制哈希值，使其只包括对外部依赖。
   * 该参数用于允许项目之间的增加/删除已经存在的依赖版本引用不会导致哈希变化。
   */
  /*[LINE "HYPOTHETICAL"]*/ "omitImportersFromPreventManualShrinkwrapChanges": true,

  /**
   * 若该值为 true, 临时项目的压缩文件的头信息的 chmod 字段不会被规范化。
   * 规范化可以帮助压缩文件在不同平躺上保持一致。
   */
  /*[LINE "HYPOTHETICAL"]*/ "noChmodFieldInTarHeaderNormalization": true
}
```
