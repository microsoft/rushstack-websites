---
title: heft.json
---

|                                           |                                                                                                                                                                                                                                    |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **File path:**                            | **&lt;project folder&gt;/config/heft.json**                                                                                                                                                                                        |
| [**Riggable?**](../intro/rig_packages.md) | Yes                                                                                                                                                                                                                                |
| **Associated plugins:**                   | [CopyFilesPlugin](https://github.com/microsoft/rushstack/blob/master/apps/heft/src/plugins/CopyFilesPlugin.ts), [DeleteGlobsPlugin](https://github.com/microsoft/rushstack/blob/master/apps/heft/src/plugins/DeleteGlobsPlugin.ts) |

## Template

```js
/**
 * 定义了 Heft 所使用的配置。
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/heft.schema.json",

  /**
   * 可选地指定另一个用于继承配置的 JSON 配置文件。
   * 这是多项目之间共享配置的一种方法。
   */
  // "extends": "base-project/config/heft.json",

  "eventActions": [
    // {
    //   /**
    //    * （必须）内置操作类型
    //    * "deleteGlobs" 可以删除符合 glob 通配符的文件或文件夹。
    //    */
    //   "actionKind": "deleteGlobs",
    //
    //   /**
    //    * （必须） 该 action 在 Heft 哪个阶段执行。
    //    * 注意，heft.json 注册的事件是在插件执行完后执行的
    //    * 例如，当 TypeScript 调用后，才会执行 "compile" 事件。
    //    *
    //    * 可选参数: "clean", "pre-compile", "compile", "bundle", "post-build"
    //    */
    //   "heftEvent": "clean",
    //
    //   /**
    //    *（必须）用户自定义的标记，其作用是允许替换或者删除其他被添加的处理程序。
    //    */
    //   "actionId": "my-example-action",
    //
    //   /**
    //    * （必须）需要删除的 glob 匹配符号。
    //    * 该路径相对于项目根目录。
    //    * glob 语法可以参考文档：https:www.npmjs.com/package/fast-glob
    //    */
    //   "globsToDelete": [
    //     "dist",
    //     "lib",
    //     "lib-esnext",
    //     "temp"
    //   ]
    // },
    //
    // {
    //   /**
    //    * （必须） 应该被执行的内置的操作种类
    //    * "copyFiles" 会拷贝匹配的文件夹
    //    */
    //   "actionKind": "copyFiles",
    //
    //   /**
    //    * （必须） 该 action 在 Heft 哪个阶段执行。
    //    * 注意，heft.json 注册的事件是在插件执行完后执行的
    //    * 例如，当 TypeScript 调用后，才会执行 "compile" 事件。
    //    *
    //    * 可选参数: "pre-compile", "compile", "bundle", "post-build"
    //    */
    //   "heftEvent": "pre-compile",
    //
    //   /**
    //    * （必须）用户自定义的标记，其作用是允许替换或者删除其他被添加的处理程序。
    //    */
    //   "actionId": "my-example-action",
    //
    //   /**
    //    * （必须）一个数组，其中指定了 Heft 事件中要执行的复制操作。
    //    */
    //   "copyOperations": [
    //     {
    //       /**
    //        * （必须） 被复制的文件夹，其目录相对于项目根目录。
    //        * 随后诸如 "includeGlobs" 和 "excludeGlobs" 将会相对该目录进行解析。
    //        * 注意： 指定 "sourceFolder" 本身不会选择任何要复制的文件。
    //        */
    //       "sourceFolder": "src",
    //
    //       /**
    //        * （必须）将被拷贝的文件夹，相对于项目根目录。
    //        * 如果您指定一个以上的目标文件夹，Heft 将只读取一次输入。
    //        * 文件，使用流来有效地写入多个输出。
    //        */
    //       "destinationFolders": ["dist/assets"],
    //
    //       /**
    //        * 一旦指定，会递归地扫描 "sourceFolder" 下的所有文件夹下匹配
    //        * 所有扩展名的文件。（如果 "fileExtensions" 和 "includeGlobs"
    //        * 都被指定，它们的选择会被加在一起）。
    //        */
    //       "fileExtensions": [".jpg", ".png"],
    //
    //       /**
    //        * 一组 glob 匹配符，满足匹配符的文件将被复制，这些路径相对于 "sourceFolder".
    //        * glob 语法可以参考文档：https:www.npmjs.com/package/fast-glob
    //        */
    //       "includeGlobs": ["assets/*.md"],
    //
    //       /**
    //        * 一组 glob 匹配符，满足匹配符的文件和文件夹将不被复制，这些路径相对于 "sourceFolder".
    //        * 并排除了 "includeGlobs" 和 "fileExtensions" 中的匹配项。
    //        */
    //       "excludeGlobs": [],
    //
    //       /**
    //        * 通常情况下，当文件在子文件夹下被选中时，在目标文件夹中会创建一个相应的文件夹。
    //        * 指定 flatten=true 以放弃源路径,并将所有匹配的文件复制到同一文件夹。
    //        * 如果两个文件有相同的名字，将会报告错误。
    //        * 默认值为 false.
    //        */
    //       "flatten": false,
    //
    //       /**
    //        * 如果为 true，将会创建硬链接而不是复制文件。
    //        * 根据操作系统的不同，这可能会更快。
    //        * (但要注意的是，如果有工具修改了链接，它可能会导致不符合预期的行为）。
    //        * 默认值为 false.
    //        */
    //       "hardlink": false
    //     }
    //   ]
    // }
  ],

  /**
   * 一系列需要加载的 Heft 插件
   */
  "heftPlugins": [
    // {
    //  /**
    //   * 指向插件包的路径
    //   */
    //  "plugin": "path/to/my-plugin",
    //
    //  /**
    //   * 由插件定义的可选参数对象。
    //   */
    //  // "options": { }
    // }
  ]
}
```

## 参考

- [copy-files](../tasks/copy-files.md) task
- [delete-globs](../tasks/delete-globs.md) task
