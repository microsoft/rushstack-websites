---
title: rush-project.json （实验性）
---

**rush-project.json** 是可选的配置文件，该文件通过 [rig 包](https://rushstack.io/pages/heft/rig_packages/) 提供。

**&lt;your project&gt;/config/rush-project.json**

```js
/**
 * "config/rush-project.json" 文件用来给仓库内的项目单独配置 Rush-specific
 * 更多信息可以参考 Rush 官网： https://rushjs.io
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/rush-project.schema.json",

  /**
   * 可选参数，指定另一个 JSON 配置文件，当前文件继承自该文件。这提供了一种在多个项目内
   * 共享配置文件的方法，
   */
  // "extends": "my-rig/profiles/default/config/rush-project.json",

  /**
   * 指定工具链写入输出文件的目。启用后，Rush 构建缓存将从缓存中
   * 恢复这个文件。
   *
   * 这些字符串是根目录下的文件名，这些文件不应该被 Git 追踪。
   * 它们不能包含符号连接。
   */
  "projectOutputFolderNames": [
    // "lib", "dist"
  ],

  /**
   * 配置构建缓存。
   */
  "buildCacheOptions":{
    /**
     * 选择性地禁用项目构建缓存，选中的项目将不能从缓存中恢复。
     *
     * 如果项目的构建脚本与缓存有冲突，那么可以使用这个方法解决。
     * 例如在项目文件夹外写文件。在可能的情况下，更好的方法是
     * 改进构建脚本，使其与缓存兼容。
     */
    // "disableBuildCache": true,

    /**
     * 对 Rush 命令的缓存进行细粒度的控制。
     */
    "optionsForCommands": [
    //   {
    //     /**
    //      * Rush 指令名, 定义在 custom-commands.json 文件中
    //      */
    //     "name": "my-command",
    //
    //     /**
    //      * 选择性地禁用项目构建缓存，选中的项目将不能从缓存中恢复。

    //      *
    //      * 如果项目的构建脚本与缓存有冲突，那么可以使用这个方法解决。
    //      * 例如在项目文件夹外写文件。在可能的情况下，更好的方法是
    //      * 改进构建脚本，使其与缓存兼容。
    //      */
    //     "disableBuildCache": true
    //   }
    ]
  }
}
```

## 参考

- [开启构建缓存](../maintainer/build_cache.md)
