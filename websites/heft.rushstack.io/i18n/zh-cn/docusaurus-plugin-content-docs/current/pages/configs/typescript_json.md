---
title: typescript.json
---

<!-- prettier-ignore-start -->
|     |     |
| --- | --- |
| **File path:** | **&lt;project folder&gt;/config/typescript.json** |
| [**Riggable?**](../intro/rig_packages.md) | Yes |
| **Associated plugin:** | [TypeScript plugin](../plugins/typescript.md) |
<!-- prettier-ignore-end -->

## 模板

```js
/**
 * 配置 Heft 的 TypeScript 插件。
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/typescript.schema.json",

  /**
   * 可选地指定另一个此文件扩展的 JSON 配置文件。这提供了在多个项目之间共享标准设置的方法。
   */
  // "extends": "base-project/config/typescript.json",

  /**
   * 如果提供，除了在 tsconfig 中指定的模块，还发出这些模块种类。
   * 注意，此选项仅适用于主 tsconfig.json 配置。
   */
  "additionalModuleKindsToEmit": [
    // {
    //   /**
    //    * (必须) 必须是 "commonjs", "amd", "umd", "system", "es2015", "esnext" 其中之一
    //    */
    //  "moduleKind": "amd",
    //
    //   /**
    //    * (必须) 输出将写入的文件夹的名称。
    //    */
    //    "outFolderName": "lib-amd"
    // }
  ],

  /**
   * 如果为 true，则将 CommonJS 模块输出发射到 tsconfig "outDir"
   * 编译器选项指定的文件夹，用 .cjs 扩展名与默认的编译输出一起（或如果 tsconfig.json
   * 指定 CommonJS，则代替）。
   */
  // "emitCjsExtensionForCommonJS": true,

  /**
   * 如果为 true，则将 ESNext 模块输出发射到 tsconfig "outDir"
   * 编译器选项指定的文件夹，用 .mjs 扩展名与默认的编译输出一起（或如果 tsconfig.js
   * 指定 ESNext，则代替）。
   */
  // "emitMjsExtensionForESModule": true,

  /**
   * 如果为 true，启用类似于 "tsc --build" 命令的行为。将构建主项目引用的项目。请注意，这将有效地启用 "noEmitOnError"。
   */
  // "buildProjectReferences": true,

  /**
   * 如果为 true，且 tsconfig.json 有 "isolatedModules": true，则编译将在工作线程中并行进行。
   */
  // "useTranspilerWorker": true,

  /**
   * 指定将用于编译的 tsconfig.json 文件。等同于
   * 'tsc' 和 'tslint' 命令行工具的 "project" 参数。
   * 默认值是 "./tsconfig.json"。
   */
  // "project": "tsconfig.special.json",

  /**
   * 配置应该复制到 TypeScript 编译器的发射文件夹中的额外文件类型，例如
   * 这样这些文件可以通过 import 语句解析。
   */
  "staticAssetsToCopy": {
    /**
     * 应从 src 文件夹复制到目标文件夹的文件扩展名。
     */
    // "fileExtensions": [
    //   ".json", ".css"
    // ],

    /**
     * 应明确包含的 glob 模式。
     */
    // "includeGlobs": [
    //   "some/path/*.js"
    // ],

    /**
     * 应明确排除的 glob 模式。这优先于在 "includeGlobs" 中列出的 globs
     * 和在 "fileExtensions" 提供的匹配文件扩展名的文件。
     */
    // "excludeGlobs": [
    //   "some/path/*.css"
    // ]
  }
}

```

## 参见

- [TypeScript 插件](../plugins/typescript.md)
- [Jest 插件](../plugins/jest.md)
