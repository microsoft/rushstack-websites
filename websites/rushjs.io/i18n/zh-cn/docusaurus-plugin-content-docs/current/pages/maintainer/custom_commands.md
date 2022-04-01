---
title: 自定义指令
---

如果你的工具链有特殊的模式或功能，你可以将它们作为自定义指令或 Rush 工具的参数来暴露出来。

## 自定义指令和参数

**common/config/rush/command-line.json** 下有一个配置文件用于自定义指令和参数，你的配置文件应该满足 [command-line.schema.json](https://github.com/microsoft/rushstack/blob/master/apps/rush-lib/src/schemas/command-line.schema.json) 范式，考虑以下示例：

```javascript
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/command-line.schema.json",

  "commands": [
    {
      /**
       * （必须）用于确定自定义指令的类型。
       * Rush 的 "bulk" 类型指令将会在每个项目中都被调用，Rush 会寻找项目 package.json 内的 "scripts" 字段中匹配该命令行的字段。
       * 默认情况下，Rush 会根据依赖图来确定要运行的项目（与 "rush build" 的工作原理类似）。
       * 也可以通过诸如 "--to" 或 "--from" 参数来限制项目集合。
       */
      "commandKind": "bulk",
      "name": "import-strings",
      "summary": "Imports translated strings into each project.",
      "description": "Requests translated strings from the translation service and imports them into each project.",
      "enableParallelism": true
    },
    {
       /**
       *（必须）用于确定自定义指令的类型。
       * Rush 的 "global" 类型的指令会在整个仓库调用一次。
       */
      "commandKind": "global",

      "name": "deploy-app",
      "summary": "Deploys the application",
      "description": "Run this command to deploy the application",

      "shellCommand": "node common/scripts/deploy-app.js"
    }
  ],

  "parameters": [
    {
      /**
       * (必须) 决定自定义参数的类型
       * "flag" 类型的参数是一个布尔属性的参数
       */
      "parameterKind": "flag",
      "longName": "--ship",
      "shortName": "-s",
      "description": "Perform a production build, including minification and localization steps",
      "associatedCommands": [ "build", "rebuild", "import-strings" ],
    },

    {
      "parameterKind": "flag",
      "longName": "--minimal",
      "shortName": "-m",
      "description": "Perform a fast build, which disables certain tasks such as unit tests and linting",
      "associatedCommands": [ "build", "rebuild" ]
    },
    {
      /**
       * (必须) 决定自定义参数的类型
       * "choice" 类型的参数需要从可供选择的参数中选取一个
       */
      "parameterKind": "choice",
      "longName": "--locale",
      "description": "Selects a single instead of the default locale (en-us) for non-ship builds or all locales for ship builds.",
      "associatedCommands": [ "build", "rebuild", "import-strings" ],
      "alternatives": [
        {
          "name": "en-us",
          "description": "US English"
        },
        {
          "name": "fr-fr",
          "description": "French (France)"
        },
        {
          "name": "es-es",
          "description": "Spanish (Spain)"
        },
        {
          "name": "zh-cn",
          "description": "Chinese (China)"
        }
      ]
    }
  ]
}
```

**自定义指令：**你可以像 Rush 内置的指令（例如 `rush build`, `rush check` 等）一样自定义自己的指令，这有两种类型：

- **bulk**: bulk 类型的指令会在每个项目中被调用，其原理与 `rush build`. 设定 `"enableParallelism": true` 后，项目可以并行运行。
- **global**: global 类型的指令会在整个仓库内执行指定的脚本文件。

你也可以自定义命令行“参数”。一个参数可以通过 `associatedCommands` 来被一个或多个指令关联。你甚至可以将自定义参数关联到 Rush 内置的 `build` 和 `rebuild` 指令上。在上述示例中，我们将 `--ship` 参数关联到 `rush build`, `rush rebuild` 和自定义的 `rush import-strings` 上。

目前有三种 `parameterKind` 类型：

- **flag**: **flag** 是一个布尔属性的参数，例如 `--ship`.
- **choice**: **choice** 是一个从列表选择的额外参数，例如 `--locale fr-fr`.
- **string**: **string** 是一个可以接受任何字符串值的参数，例如 `--name my-new-package`.

未来会支持更多参数类型（它们使用 [ts-command-line](https://www.npmjs.com/package/@microsoft/ts-command-line) 来解析）

## 使用自定义命令和选项

你可以自定义指令和其描述将被会被 Rush 的命令行帮助中（当在仓库的工作目录中调用时），继续上述示例，如果我们运行 `rush import-strings --help`，我们将看到这样的内容：

```
Rush Multi-Project Build Tool 5.1.0 - https://rushjs.io

usage: rush import-strings [-h] [-p COUNT] [-t PROJECT1]
                           [--to-version-policy VERSION_POLICY_NAME]
                           [-f PROJECT2] [-v] [-s]
                           [--locale {en-us,fr-fr,es-es,zh-cn}]

Requests translated strings from the translation service and imports them
into each project.

Optional arguments:
  -h, --help            Show this help message and exit.
  -p COUNT, --parallelism COUNT
                        Specify the number of concurrent build processes The
                        value "max" can be specified to indicate the number
                        of CPU cores. If this parameter omitted, the default
                        value depends on the operating system and number of
                        CPU cores.
  -t PROJECT1, --to PROJECT1
                        Run command in the specified project and all of its
                        dependencies
  --to-version-policy VERSION_POLICY_NAME
                        Run command in all projects with the specified
                        version policy and all of their dependencies
  -f PROJECT2, --from PROJECT2
                        Run command in all projects that directly or
                        indirectly depend on the specified project
  -v, --verbose         Display the logs during the build, rather than just
                        displaying the build status summary
  -s, --ship            Perform a production build, including minification
                        and localization steps
  --locale {en-us,fr-fr,es-es,zh-cn}
                        Selects a single instead of the default locale
                        (en-us) for non-ship builds or all locales for ship
                        builds.
```

如果实现一个自定义指令和自定义参数？对于 global 指令而言，Rush 仅仅会唤起其 `shellCommand` 并传递参数；对于 bulk 指令，Rush 会在 **package.json** 中查找对应的脚本。假设我们有以下内容：

**example/package.json**

```json
{
  "name": "example",
  "version": "1.0.0",
  "main": "lib/index.js",
  "typings": "lib/index.d.ts",
  "scripts": {
    "import-strings": "./node_modules/.bin/loc-importer",
    "build": "./node_modules/.bin/gulp"
  }
}
```

如果执行 `rush import-strings --locale fr-fr`，Rush 将会读取 "import-strings" 脚本体并执行如下：

```
./node_modules/.bin/loc-importer --locale fr-fr
```

（Rush 直接在 shell 中执行，并不依赖 `npm run`.）因为这个 choice 参数有默认值，如果我们运行 `rush import-strings`，那么 **loc-importer** 将会执行如下：

```
./node_modules/.bin/loc-importer --locale en-us
```

换句话说，Rush 的自定义参数只是简单的在 **package.json** 中的脚本内添加一些内容，这意味着当你使用诸如 "`rimraf ./lib && rimraf ./temp`" 等 shell 脚本时，可能会出现问题，因为这些脚本不支持这些参数，或者需要在中间插入这些参数。这是因为设计的原因在于：我们不建议在 JSON 中写入复杂的构建脚本。相反，最好把这些操作移到一个方便注释和审查的脚本文件中。当 monorepo 仓库逐渐扩大时，你也许想要讲这个脚本移动到一个可以在多个项目中共享的库里。

## 参考

- [command-line.json](../../configs/command-line_json)
