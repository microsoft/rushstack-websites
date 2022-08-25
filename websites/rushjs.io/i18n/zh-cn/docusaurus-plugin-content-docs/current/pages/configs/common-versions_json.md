---
title: common-versions.json
---

这是 [rush init](../commands/rush_init.md) 为 monorepo 生成的模版下的 **command-version.json** 文件：

**common/config/rush/common-versions.json**

```js
/**
 * 该配置项用于配置 NPM 依赖版本，它会影响 Rush 仓库内的所有项目。
 * 更多信息可以参考 Rush 官网： https://rushjs.io
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/common-versions.schema.json",

  /**
   * 一张指定 NPM 包的“偏好版本”的表。该功能通常用于给间接依赖指定某个旧版本
   * 或者减少间接依赖的复制数量。
   *
   * "preferredVersions" 是一个语义化的值（例如： "~1.2.3"）。Rush 将该值插入
   * 到影响包管理机器计算版本的顶层 common/temp/package.json 中的 "dependencies" 字段中。
   * 该字段的效果由包管理器决定，通常不会导致兼容或者违背语义化版本的问题。
   * 如果你使用 PNPM, 其效果类似于 pnpmfile.js 钩子，可以查看 Rush 的文档来了解更多细节。
   *
   * 修改完该字段后，建议执行 "rush update --full" 来使得包管理器重新计算版本。
   */
  "preferredVersions": {
    /**
     * 当仓库内某个依赖请求 "^1.0.0" 时，确保它们会获得 "1.2.3"
     * 版本，而不是最新版本。
     */
    // "some-library": "1.2.3"
  },

  /**
   * 当设定该值为 true 时，仓库中的所有项目、所有依赖将会被自动添加到 preferredVersions 中，
   * 除非不同的项目为某个依赖指定了不同的版本范围。
   * 对于陈旧的版本管理器而言，它们会尝试减少非直接依赖的复制数量。但是，对于不兼容 peerDependencies
   * 的间接依赖而言可能造成问题。
   *
   * 该值的默认值为 true. 如果你在安装期间遇到了同级依赖导致的问题，建议
   * 将它设定为 false.
   *
   * 修改完该字段后，建议执行 "rush update --full" 来使得包管理器重新计算版本。
   */
  // "implicitlyPreferredVersions": false,

  /**
   * "rush check" 命令用来确保每个项目中的同一版本都有相同的语义化版本。
   * 然而，有时需要一些例外。
   * allowedAlternativeVersions 属性列出 "rush check" 运行时允许的
   * 其他版本的依赖列表。
   *
   * 重要：这张表是针对*额外*的版本，它是通常版本（根据仓库中的所有项目推
   * 断而来）的替代品。这个设计避免了该文件不必要的更新。
   */
  "allowedAlternativeVersions": {
    /**
     * 例如，允许某些项目使用旧版本的 TypeScript 编译器。
     * （除了其他项目正在使用的“通常”版本，还包括）：
     */
    // "typescript": [
    //   "~2.4.0"
    // ]
  }
}
```
