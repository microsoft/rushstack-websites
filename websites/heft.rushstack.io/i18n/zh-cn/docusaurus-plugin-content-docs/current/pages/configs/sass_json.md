---
title: sass.json
---

|                                           |                                                                                                                                |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **File path:**                            | **&lt;project folder&gt;/config/rig.json**                                                                                     |
| [**Riggable?**](../intro/rig_packages.md) | Yes                                                                                                                            |
| **Associated plugins:**                   | [SassTypingsPlugin](https://github.com/microsoft/rushstack/blob/master/heft-plugins/heft-sass-plugin/src/SassTypingsPlugin.ts) |

## Template

```js
/**
 * 为 Heft 系统配置 Sass 类型插件
 * 这个可选的附加文件为 Typescript 编译器定制了 Sass 的解析、模块解析和类型文件的输出。
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/sass.schema.json"

  /**
   * 代码根目录
   * 将在该目录下寻找 .css, .sass, .scss 文件
   */
  // "srcFolder": "src",

  /**
   * 生成 Sass 类型的输出目录
   */
  // "generatedTsFolder": "temp/sass-ts",

  /**
   * 导出值是否被为默认属性中
   */
  // "exportAsDefault": true,

  /**
   * 满足以下扩展符的文件将被传递到 Sass 编译器中
   */
  // "fileExtensions": [
  //   ".sass",
  //   ".scss",
  //   ".css
  // ],

  /**
   * 当解析 Sass 的导入时，将使用这些路径。
   */
  // "importIncludePaths": [
  //   "node_modules",
  //   "src"
  // ],

  /**
   * 相于 "src" 目录的一些文件路径，它们会被排除。
   */
  // "excludeFiles": []
}
```

## 参考

- [sass-typings](../tasks/sass-typings.md) task
