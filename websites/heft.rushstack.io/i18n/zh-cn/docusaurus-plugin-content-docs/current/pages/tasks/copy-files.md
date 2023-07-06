---
title: '"copy-files" task'
---

该任务实现了 [heft.json] 文件内的 `"eventActions"` 字段下的 `"actionKind": "copyFiles"` 类型。

## 何时使用

这项任务最常用于复制资源文件，如字体、图像等资源到输出目录下。

一些说明：

- 避免使用这个 task 来读写项目文件夹以外的文件。这样做会违反 Rush 的 [项目隔离原则](../tutorials/heft_and_rush.md)。
- 尽可能避免使用诸如 `**` 这样低效的 glob 操作符，这些操作会递归地遍历一个目录树。这些磁盘密集型的操作会拖慢构建速度。
- 过于宽泛的通配符有时会包含到那些不被 Git 标记的游离文件夹。

## package.json dependencies

无 - 这个功能被 Heft 内部实现。

## 配置文件

在 [heft.json](../configs/heft_json.md) 配置文件内注册事件，例如：

**&lt;project folder&gt;/config/heft.json**

```js
{
  . . .

  "eventActions": [
    {
      /**
       * （必须） 应该被执行的内置的操作种类
       * "copyFiles" 会拷贝匹配的文件夹
       */
      "actionKind": "copyFiles",

      /**
       * （必须） 该 action 在 Heft 哪个阶段执行。
       * 注意，heft.json 注册的事件是在插件执行完后执行的
       * 例如，当 TypeScript 调用后，才会执行 "compile" 事件。
       *
       * 可选参数: "pre-compile", "compile", "bundle", "post-build"
       */
      "heftEvent": "pre-compile",

      /**
       * （必须）用户自定义的标记，其作用是允许替换或者删除其他被添加的处理程序。
       */
      "actionId": "my-example-action",

      /**
       * （必须）一个数组，其中指定了 Heft 事件中要执行的复制操作。
       */
      "copyOperations": [
        {
          /**
           * （必须） 被复制的文件夹，其目录相对于项目根目录。
           * 随后诸如 "includeGlobs" 和 "excludeGlobs" 将会相对该目录进行解析。
           * 注意： 指定 "sourceFolder" 本身不会选择任何要复制的文件。
           */
          "sourceFolder": "src",

          /**
           * （必须）将被拷贝的文件夹，相对于项目根目录。
           * 如果您指定一个以上的目标文件夹，Heft 将只读取一次输入。
           * 文件，使用流来有效地写入多个输出。
           */
          "destinationFolders": ["dist"],

          /**
           * 一旦指定，会递归地扫描 "sourceFolder" 下的所有文件夹下匹配
           * 所有扩展名的文件。（如果 "fileExtensions" 和 "includeGlobs"
           * 都被指定，它们的选择会被加在一起）。
           */
          // "fileExtensions": [".jpg", ".png"],

          /**
           * 一组 glob 匹配符，满足匹配符的文件将被复制，这些路径相对于 "sourceFolder".
           * glob 语法可以参考文档：https:www.npmjs.com/package/fast-glob
           */
          "includeGlobs": ["assets/*.md"],

          /**
           * 一组 glob 匹配符，满足匹配符的文件和文件夹将不被复制，这些路径相对于 "sourceFolder".
           * 并排除了 "includeGlobs" 和 "fileExtensions" 中的匹配项。
           */
          // "excludeGlobs": [],

          /**
           *
           * 通常情况下，当文件在子文件夹下被选中时，在目标文件夹中会创建一个相应的文件夹。
           * 指定 flatten=true 以放弃源路径,并将所有匹配的文件复制到同一文件夹。
           * 如果两个文件有相同的名字，将会报告错误。
           * 默认值为 false.
           */
          // "flatten": false,

          /**
           * 如果为 true，将会创建硬链接而不是复制文件。
           * 根据操作系统的不同，这可能会更快。
           * (但要注意的是，如果有工具修改了链接，它可能会导致不符合预期的行为）。
           * 默认值为 false.
           *
           */
          // "hardlink": false
        }
      ]
    }
  ],

  . . .
}
```
