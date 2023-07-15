---
title: heft.json
---

<!-- prettier-ignore-start -->
|     |     |
| --- | --- |
| **File path:** | **&lt;project folder&gt;/config/heft.json** |
| [**Riggable?**](../intro/rig_packages.md) | Yes |
| **Associated plugin:** | (global) |
<!-- prettier-ignore-end -->

## Template

```js
/**
 * 定义 core Heft 使用的配置。
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",

  /**
   * 可选地指定此文件继承自的另一个 JSON 配置文件。这为标准设置在多个项目之间共享提供了一种方式。
   */
  // "extends": "base-project/config/heft.json",

  /**
   * 为现有的 Heft 动作定义别名，并允许他们通过
   * 名称和默认参数来调用。JSON 的键是用户自定义的名称。
   *
   * 例如，"heft start" 别名通常定义为调用
   * "heft build-watch --serve"，使用类似以下的定义：
   *
   *   "aliasesByName": { "start": { "actionName": "build-watch", "defaultParameters": [ "--serve" ] } }
   */
  "aliasesByName": {
    // /**
    //  * 被定义的 Heft 别名的命令行动作名称。
    //  * 此 JSON 键是用户自定义的值。
    //  */
    // "example-alias-name": {
    //   /**
    //    * 由此别名调用的现有 Heft 命令行动作的名称。
    //    */
    //   "actionName": "example-action",
    //
    //   /**
    //    * 默认传递给 Heft 动作的命令行参数列表。
    //    * 这些参数将在指定的动作之后和
    //    * 用户指定的参数之前附加。
    //    */
    //   "defaultParameters": [ "--do-some-thing" ]
    // }
  },

  /**
   * 此项目要加载的 Heft 生命周期插件列表。
   */
  "heftPlugins": [
    // {
    //   /**
    //    * (必须的) 插件的 NPM 包名。
    //    */
    //   "pluginPackage": "@mycorp/heft-example-plugin",
    //
    //   /**
    //    * 从 NPM 包的 heft-plugin.json 清单中加载的插件名称。
    //    * 如果未指定，且插件包提供单个插件，则加载该插件。
    //    */
    //   // "pluginName": "example-plugin",
    //
    //   /**
    //    * 传递给插件的选项。 这是一个自定义对象，其结构
    //    * 由插件定义。
    //    */
    //   // "options": { "example-key": "example-value" }
    // }
  ],

  /**
   * Heft 在执行过程中可以运行的阶段。
   * JSON 的键是用户自定义的名称。
   */
  "phasesByName": {
    /**
     * 阶段的名称，被其他字段如 "phaseDependencies" 所使用。
     * 此 JSON 键是用户自定义的值。
     */
    "example-phase": {
      /**
       * 在命令行帮助中显示的描述。
       */
      "phaseDescription": "一个示例阶段",

      /**
       * 在阶段执行开始时进行清理的删除操作列表。
       * 它们的结构类似于 delete-files-plugin 使用的选项。
       */
      "cleanFiles": [
        // {
        //   /**
        //    * 源文件或文件夹的绝对路径，相对于项目根目录。
        //    * 如果指定了 "fileExtensions", "excludeGlobs", 或 "includeGlobs"，则 "sourcePath"
        //    * 被视为文件夹；如果不是文件夹，将抛出错误。
        //    * 诸如 "includeGlobs" 和 "excludeGlobs" 的设置将相对于此路径解析。
        //    * 如果没有指定 globs 或文件扩展名，整个文件夹将被复制。
        //    * 如果未提供此参数，则默认为项目根目录。
        //    */
        //   // "sourcePath": "lib",
        //
        //   /**
        //    * 如果指定，此选项递归扫描 "sourcePath" 下的所有文件夹，并包含
        //    * 与指定扩展名匹配的任何文件。 如果 "fileExtensions" 和 "includeGlobs"
        //    * 都指定了，它们的选择将会合并。
        //    */
        //   // "fileExtensions": [ ".png" ],
        //
        //   /**
        //    * 选择要复制的文件的 glob 模式列表。 路径相对于 "sourcePath" 解析，
        //    * "sourcePath" 必须是文件夹路径。 如果 "fileExtensions" 和 "includeGlobs"
        //    * 都指定了，它们的选择将会合并。
        //    *
        //    * 对于 glob 语法，请参考：https://www.npmjs.com/package/fast-glob
        //    */
        //   // "excludeGlobs": [],
        //
        //
        //   /**
        //    * 排除从中复制文件或文件夹的 glob 模式列表。 路径相对于 "sourcePath" 解析，
        //    * "sourcePath" 必须是文件夹路径。 这些排除项消除了由 "includeGlobs" 或 "fileExtensions" 设置选中的项目。
        //    *
        //    * 对于 glob 语法，请参考：https://www.npmjs.com/package/fast-glob
        //    */
        //   // "includeGlobs": [ "**/temp" ]
        // }
      ],

      /**
       * 必须在此阶段开始之前运行的阶段名称列表。
       */
      "phaseDependencies": [ ],

      /**
       * 在执行 Heft 阶段期间运行的 Heft 任务。
       * JSON 的键是用户自定义的名称。
       */
      "tasksByName": {
        /**
         * 任务的名称，被其他字段如 "taskDependencies" 所使用。
         * 此 JSON 键是用户自定义的值。
         */
        "example-task": {
          /**
           * 必须在此任务开始之前运行的任务名称列表。
           */
          "taskDependencies": [],

          /**
           * (必需) 要加载的 Heft 插件，它将执行此任务的操作。
           */
          "taskPlugin": {
            /**
             * (必需) 插件的 NPM 包名称。
             */
            "pluginPackage": "@mycorp/heft-example-plugin",

            /**
             * 要从 NPM 包的 heft-plugin.json manifest 中加载的插件的名称。
             * 如果未指定，并且插件包提供了一个插件，则将加载该插件。
             */
            // "pluginName": "example-plugin",

            /**
             * 传递给插件的选项。这是一个由插件定义的自定义对象的结构。
             */
            // "options": { "example-key": "example-value" }
          }
        }
      }
    }
  }
}
```
