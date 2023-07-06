---
title: typescript.json
---

|                                          |                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **File path:**                           | **&lt;project folder&gt;/config/typescript.json**                                                                                                                                                                                                                                                                                                                                 |
| [**Riggable?**](../heft/rig_packages.md) | Yes                                                                                                                                                                                                                                                                                                                                                                               |
| **Associated plugins:**                  | [TypeScriptPlugin](https://github.com/microsoft/rushstack/blob/master/apps/heft/src/plugins/TypeScriptPlugin/TypeScriptPlugin.ts), [CopyStaticAssetsPlugin](https://github.com/microsoft/rushstack/blob/master/apps/heft/src/plugins/CopyStaticAssetsPlugin.ts), [JestPlugin](https://github.com/microsoft/rushstack/blob/master/heft-plugins/heft-jest-plugin/src/JestPlugin.ts) |

## Template

```js
/**
 * 配置 Heft 的 TypeScript 插件。该插件也负责管理格式化。
 *
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/typescript.schema.json",

  /**
   * 可选地指定另一个用于继承配置的 JSON 配置文件。
   * 这是多项目之间共享配置的一种方法。
   */
  // "extends": "base-project/config/typescript.json",

  /**
   * 可以设置为 "copy "或 "hardlink"。如果设置为 "copy", 从缓冲区复制文件。
   * 生成压缩包时该选项很有用，因为压缩文件不能很好的处理硬链接。
   * 默认值为 "hardlink"
   */
  // "copyFromCacheMode": "copy",

  /**
   * 一旦指定，还会生成 tsconfig 中指定的模块类型。
   * 注意，这些选项仅仅适用于 tsconfig.json 配置文件。
   */
  "additionalModuleKindsToEmit": [
    // {
    //   /**
    //    * （必须）必须是 "commonjs", "amd", "umd", "system", "es2015", "esnext" 之一
    //    */
    //  "moduleKind": "amd",
    //
    //   /**
    //    * （必须）输出的文件名将被重写
    //    */
    //    "outFolderName": "lib-amd"
    // }
  ],

  /**
   * 指定测试将使用的中间文件夹。
   * 因为 Jest 使用 Node.js 来执行测试，模块格式必须是CommonJS。
   *
   * 默认值是"lib".
   */
  // "emitFolderNameForTests": "lib-commonjs",

  /**
   * 如果设定为 "true", 则不会调用 TSlint.
   */
  // "disableTslint": true,

  /**
   * 同时写文件的最大并发数。
   * 默认值为 50.
   */
  // "maxWriteParallelism": 50,

  /**
   * 描述将静态文件从 src 拷贝到 TS 输出文件夹的方式，
   * 例如它们可以被 import 语句解析。
   */
  "staticAssetsToCopy": {
    /**
     * 指定从 src 拷贝到目标文件夹下的文件扩展符。
     */
    // "fileExtensions": [
    //   ".json", ".css"
    // ],
    /**
     * 显式被拷贝文件的 glob 通配符
     */
    // "includeGlobs": [
    //   "some/path/*.js"
    // ],
    /**
     * 显式排出的文件的 glob 通配符
     * 它优先于 "includeGlobs" 和 "fileExtensions" 匹配的文件。
     */
    // "excludeGlobs": [
    //   "some/path/*.css"
    // ]
  }
}
```

## 参考

- [typescript](../heft_tasks/typescript.md) task
- [copy-static-assets](../heft_tasks/copy-static-assets.md) task
- [jest](../heft_tasks/jest.md) task
