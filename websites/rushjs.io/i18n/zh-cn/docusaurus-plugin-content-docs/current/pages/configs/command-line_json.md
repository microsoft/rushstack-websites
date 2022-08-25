---
title: command-line.json
---

这是 [rush init](../commands/rush_init.md) 为 monorepo 生成的模版下的 **command-line.json** 文件：

**common/config/rush/command-line.json**

```js
/**
 * 该配置项配置 "rush" 的自定义命令。
 * 更多信息可以参考 Rush 官网： https://rushjs.io
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/command-line.schema.json",

  /**
   * 自定义“命令”为命令行引入了新的变量。可以通过 "rush --help", "rush my-bulk-command --help", 或
   * "rush my-global-command --help" 来看更多的帮助。
   */
  "commands": [
    // {
    //   /**
    //    * （必须）决定自定义命令的类型
    //    * Rush 的 "bulk" 命令会在每个项目中单独执行。Rush 会寻找每个项目内的 package.json 文件下的
    //    * 符合命令的 "script' 脚本。默认情况下，命令会按照依赖图在仓库内的每个项目执行（与 "rush build"
    //    * 工作流类似）。
    //    * 可以限定一些子项目，例如使用 "--to" 或 "--from" 参数。
    //    */
    //   "commandKind": "bulk",
    //
    //   /**
    //    * （必须） 输入的名称被视为命令行的一部分。 这也项目内 package.json 中
    //    * "scripts" 的钩子。
    //    * 该名称必须是大写字母、数字和下划线的组合，它应当包含一个英语动词（例如： "deploy"）
    //    * 使用连字符来分割单词（例如： "upload-docs")。一组相关的命令可以以冒号为前缀。
    //    * （例如："docs:generate", "docs:deploy", "docs:serve" 等等）
    //    *
    //    * 注意，如果此处覆盖了 "rebuild" 命令，它就与 "build" 指令分割开了，
    //    * 同时会调用 "rebuild" 而不是 "build" 脚本。
    //    */
    //   "name": "my-bulk-command",
    //
    //   /**
    //    * （必须）该自定义命令的简短总结，它将被展示在命令行帮助中。
    //    * 例如 "rush --help".
    //    */
    //   "summary": "Example bulk custom command",
    //
    //   /**
    //    * 当打印命令行帮助时的更细节的描述。（例如："rush --help my-command"）
    //    * 如果为空，则使用 "summary" 字段。
    //    *
    //    * 无论何时引入指令或参数，花些时间来写一些有意义的文档会给开发体验带来巨大提升。
    //    */
    //   "description": "This is an example custom command that runs separately for each project",
    //
    //   /**
    //    * Rush 操作需要一个锁文件来防止同一个仓库被多个指令同时处理。（例如：同时执行 "rush install" 和
    //    * "rush build" 会出错）。如果你的命令可以与其他操作同时执行，那么设定 "safeForSimultaneousRushProcesses"
    //    * 为 true 来禁用这种保护。
    //    *
    //    * 对于调用其他 Rush 命令的脚本而言，这一点是尤为需要的。
    //    */
    //   "safeForSimultaneousRushProcesses": false,
    //
    //   /**
    //    * （必须）如果为真，那么该指令可以安全的并行执行，例如同时在多个项目内执行。
    //    * 与 "rush build" 类似，无论是否开启并行，在其依赖完成前，该项目都不会
    //    * 开始执行。
    //    */
    //   "enableParallelism": false,
    //
    //   /**
    //    * 通常项目会依照依赖顺序处理，对于某个项目而言，直到其依赖处理完成后才会处理
    //    * 该项目。但对于某个特定的操作而言，该限制并不适用，例如 "clean" 任务来删除
    //    * 输出文件。在这种情况下，可以设定 "ignoreDependencyOrder" 为 true 来
    //    * 提高并行度。
    //    */
    //   "ignoreDependencyOrder": false,
    //
    //   /**
    //    * 通常情况下，Rush 会要求每个项目的 package.jso 文件下都有对应的 "script"
    //    * 匹配自定义指令名。设定 "ignoreMissingScript" 为 true 可以禁止此检查，
    //    * 缺少相应定义的项目会被跳过。
    //    */
    //   "ignoreMissingScript": false,
    //
    //   /**
    //    * 当调用 shell 脚本时，Rush 将用以下方法来从警告信息中区分出错误信息：
    //    * - 如果脚本返回非 0 状态码，那么 Rush 会认为存在“一个或多个错误”，之后以红色输
    //    * 出错误信息，它会阻止 Rush 继续处理其他项目。
    //    * - 如果脚本的状态码为 0, 但是向 stderr 流写入了一些数据，Rush 会认为存在 “一
    //    * 个或多个警告”，之后以黄色输出警告信息，但是不会阻止 Rush 继续处理其他项目。
    //    *
    //    * 因此，警告信息不会阻碍本地开发，但在 Rush 的设计中，当存在任何警告或报错信息，
    //    * Rush进程会返回非 0 状态码，进而会导致 CI 任务失败，
    //    * 在一个活跃的 monorepo 中，我们发现如果你的主干分支允许警告，那么就会在不经
    //    * 意间交给开发者忽略警告，这很快会导致存在非常多“预期”的警告信息以至于这些信息
    //    * 没有任何提示性作用的状态。
    //    *
    //    * 有时，尽管操作是成功的，但由于某个行为存在问题的任务会被写入到 stderr 流中。
    //    * 在这种情况下，强烈建议修复这个任务，然而，你可以设定 allowWarningsInSuccessfulBuild
    //    * =true 来进行变通，这会导致 Rush 只会对错误信息才返回非 0 的状态码。
    //    *
    //    * 注意： 默认值为 false. 在 5.7.x 以及更旧的版本中，默认值为 true.
    //    */
    //   "allowWarningsInSuccessfulBuild": false,
    //
    //   /**
    //    * 该参数为 true 时，其行为类似于内置的 "build" 命令的增量构建。
    //    */
    //   "incremental": false,
    //
    //   /**
    //    * （实验性）通常 Rush 会在命令完成后终止。如果该值被设定为 "true", Rush 会进入
    //    * 到一个监听指定项目文件的循环中。当检测到文件变动时，指令会被唤醒，且其范围是选
    //    * 中的项目以及依赖。
    //    *
    //    * 更多信息，可以参考“使用监听模式”一文。
    //    */
    //   "watchForChanges": false,
    //
    //   /**
    //    * （实验性）对于该行为禁止掉缓存。如果该命令会影响到项目自身目录以外的状态时，该
    //    * 命令很有用。
    //    */
    //   "disableBuildCache ": false
    // },
    //
    // {
    //   /**
    //    * （必须）自定义指令的类型。
    //    * Rush 的 "global" 指令会在整个项目内唤醒一次。
    //    */
    //   "commandKind": "global",
    //
    //   "name": "my-global-command",
    //   "summary": "Example global custom command",
    //   "description": "This is an example custom command that runs once for the entire repo",
    //
    //   "safeForSimultaneousRushProcesses": false,
    //
    //   /**
    //    * （必须）一个使用操作系统 shell 调用的脚本。工作目录是含有 rush.json 的
    //    * 目录。如果自定义指令与该指令有关，那么它们的值应该被添加到字符串的尾部。
    //    */
    //   "shellCommand": "node common/scripts/my-global-command.js",
    //
    //   /**
    //    * 如果你的 "shellCommand" 依赖 NPM 包，那么推荐将其写成 Rush 内的一
    //    * 个项目，使得工作链可以正常构建。某些情况下该指令应该在没有首次执行
    //    * "rush build" 的情况下正常工作，推荐的方式是将该项目发布到 NPM 源
    //    * 上，并使用 common/scripts/install-run.js 来调用它。
    //    *
    //    * 自动安装功能提供了另外一种可能：在 "common/autoinstallers" 下的目
    //    * 录都有一个 package.json 文件和 shrinkwrap 文件。在被调用前，Rush
    //    * 会自动调用包管理器来安装这些依赖。自动下载有一个优势：即使所在的分支的  Autoinstallers have the
    //    * "rush isntall" 出现了问题，它们也能正常工作，这使得该功能可以实现
    //    * Git 的钩子脚本。但是该功能也有一个缺点，它们不能用于构建项目，并且会增
    //    * 加仓库的安装量。
    //    *
    //    * "autoinstallerName" 属性不能包含路径，并必须是一个有效的 NPM 包名。
    //    * 例如， "my-task" 是映射到 "common/autoinstallers/my-task/package.json"
    //    * 的包名，当调用该 "shellCommand" 时，"common/autoinstallers/my-task/node_modules/.bin"
    //    * 应当被添加到环境变量中。
    //    */
    //   // "autoinstallerName": "my-task"
    // }
  ],

  /**
   * 自定义“参数”给指定的 Rush 命令行指令引入了参数。
   * 例如，你也许会给 "rush build" 命令增加 "production" 参数。
   */
  "parameters": [
    // {
    //   /**
    //    * （必须）自定义参数的类型
    //    * "flag" 类型表明该参数的作用是一个开关。
    //    */
    //   "parameterKind": "flag",
    //
    //   /**
    //    * （必须）参数的全名。必须是小写并使用破折号分割。
    //    */
    //   "longName": "--my-flag",
    //
    //   /**
    //    * 该参数的缩写，该属性可选。它必须是在破折号后跟有一个
    //    * 大小写敏感的字母，
    //    *
    //    * 注意：推荐使用全名来增加可读性。缩写仅仅是为了方便。
    //    * 字母表很容易被占用完，并且不方便记忆，所以*仅仅*当
    //    * 遇到非常频繁的操作时才使用简写。
    //    */
    //   "shortName": "-m",
    //
    //   /**
    //    * （必须） 在命令帮助中显示的描述信息。
    //    *
    //    * 无论何时引入指令或参数，花些时间来写一些有意义的文档会给开发体验带来巨大提升。
    //    */
    //   "description": "A custom flag parameter that is passed to the scripts that are invoked when building projects",
    //
    //   /**
    //    * （必须）该列表内存储了这个参数可被哪些自定义指令或内置指令使用。
    //    */
    //   "associatedCommands": ["build", "rebuild"]
    // },
    //
    // {
    //   /**
    //    * （必须）自定义参数的类型
    //    * 一个“字符串”类型的自定义命令行参数是指参数为一个简单的文本。
    //    */
    //   "parameterKind": "string",
    //   "longName": "--my-string",
    //   "description": "A custom string parameter for the \"my-global-command\" custom command",
    //
    //   "associatedCommands": ["my-global-command"],
    //
    //   /**
    //    * 参数名，在命令帮助中将被显示。
    //    *
    //    * 例如，参数名一个 "--count", 其类型为 "NUMBER", 那么命令行
    //    * 帮助信息应该展示 "--count NUMBER". 该参数必须由大写字母、数字
    //    * 下划线组成，应该尽可能的短。
    //    */
    //   "argumentName": "SOME_TEXT",
    //
    //   /**
    //    * 当该属性为 true 时，参数必须包含在命令中。默认为 false.
    //    */
    //   "required": false
    // },
    //
    // {
    //   /**
    //    * （必须）自定义参数的类型
    //    * "choice" 参数类型是指参数必须是给定列表内的某个值。
    //    */
    //   "parameterKind": "choice",
    //   "longName": "--my-choice",
    //   "description": "A custom choice parameter for the \"my-global-command\" custom command",
    //
    //   "associatedCommands": ["my-global-command"],
    //
    //   /**
    //    * 当该属性为 true 时，参数必须包含在命令中。默认为 false.
    //    */
    //   "required": false,
    //
    //   /**
    //    * 正常情况下若某个参数被省略掉，那么它将不会被传到 shell 中。
    //    * 该属性用于插入一个默认值，若 "defaultValue" 定义后，参数永远会被
    //    * 传入到 shell 中，若未指定则使用默认值。该值必须是定义在可选列表中
    //    * 的一个。
    //    */
    //   "defaultValue": "vanilla",
    //
    //   /**
    //    * （必须）一系列用于选择的可选参数。
    //    */
    //   "alternatives": [
    //     {
    //       /**
    //        * 用于选择参数的一个可选值。
    //        * 例如，在 "--flavor vanilla" 使用了 "vanilla".
    //        */
    //       "name": "vanilla",
    //
    //       /**
    //        *
    //        * 在命令行帮助中显示的可选参数的详细描述。
    //        *
    //        * 无论何时引入指令或参数，花些时间来写一些有意义的文档会给开发体验带来巨大提升。
    //        *
    //        */
    //       "description": "Use the vanilla flavor (the default)"
    //     },
    //
    //     {
    //       "name": "chocolate",
    //       "description": "Use the chocolate flavor"
    //     },
    //
    //     {
    //       "name": "strawberry",
    //       "description": "Use the strawberry flavor"
    //     }
    //   ]
    // }
  ]
}
```

## 参考

- [可选参数](../maintainer/custom_commands.md)
