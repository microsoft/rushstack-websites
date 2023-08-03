---
title: sass.json
---

<!-- prettier-ignore-start -->
|     |     |
| --- | --- |
| **File path:** | **&lt;project folder&gt;/config/rig.json** |
| [**Riggable?**](../intro/rig_packages.md) | Yes |
| **Associated plugin:** | [Sass plugin](../plugins/sass.md) |
<!-- prettier-ignore-end -->

## 模板

```js
/**
 * @rushstack/heft-sass-plugin 的配置
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft-sass-plugin.schema.json"

  /**
   * 可选地指定另一个此文件扩展的 JSON 配置文件。这提供了在多个项目之间共享标准设置的方法。
   */
  // "extends": "base-project/config/serve-command.json",

  /**
   * 项目源代码的根目录。
   *
   * 默认值："src/"
   */
  // "srcFolder": "src/",

  /**
   * 生成的 Sass 类型定义的输出目录。
   *
   * 默认值："temp/sass-ts/"
   */
  // "generatedTsFolder": "temp/sass-ts/",

  /**
   * 可选的额外文件夹，Sass 类型定义应该输出到这些文件夹。
   */
  // "secondaryGeneratedTsFolders": [],

  /**
   * 确定是否将导出值包装在默认属性中，或者不包装。
   *
   * 默认值：true
   */
  // "exportAsDefault": false,

  /**
   * 如果指定，编译过的 CSS 文件将被发射到哪些文件夹。为了方便引用翻译，
   * 它们将通过在源文件名后面追加
   * ".css" 来命名，除非设置了 "preserveSCSSExtension"。
   *
   * 默认值：undefined
   */
  // "cssOutputFolders": [],

  /**
   * 如果设置，当从带有 ".scss" 扩展名的文件中发射编译的 CSS 时，发射的 CSS 将具有
   * 扩展名 ".scss"，而不是 ".scss.css"。
   *
   * 默认值：false
   */
  // "preserveSCSSExtension": true,

  /**
   * 具有这些扩展名的文件将通过 Sass 转译器进行类型生成。
   *
   * 默认值：[".sass", ".scss", ".css"]
   */
  // "fileExtensions": [".sass", ".scss"],

  /**
   * 具有这些扩展名的文件将被视为非模块 SCSS，并通过
   * Sass 转译器进行类型生成。
   */
  // "nonModuleFileExtensions": [ ".css" ],

  /**
   * 用于解析 Sass 导入的路径列表。路径应该相对于项目根目录。
   *
   * 默认值：["node_modules", "src"]
   */
  // "importIncludePaths": ["node_modules", "src"],

  /**
   * 一个相对于 "src" 文件夹的文件路径列表，应该从类型生成中排除这些文件。
   *
   * 默认值：undefined
   */
  // "excludeFiles": []
}
```

## 参见

- [Sass 插件](../plugins/sass.md) 任务
