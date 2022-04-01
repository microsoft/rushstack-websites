---
title: rush add
---

```
用法：rush add [-h] -p PACKAGE [--exact] [--caret] [--dev] [-m] [-s] [--all]

在当前项目下（由当前的工作目录决定）添加指定的包作为依赖，然后运行"rush update"。
如果版本没有指定，则会自动检测版本（通常是最新的版本或者是不会破坏 "ensureConsistentVersions" 策略的版本）
如果指定了版本范围（或者工作区范围），则会使用范围内的最新版本。
如果没有使用 "--exact" 或 "--carte" 参数，则会自动在版本号前面加上波浪号。
如果使用 "--make-consistent" 参数，则可以更新所有包的 package.json 文件，使其使用相同的依赖。

可选参数：
  -h, --help            展示帮助信息并退出。
  -p PACKAGE, --package PACKAGE
                        (必须) 应当被添加到依赖的包名。可以在 "@" 符号后添加语义化版本。
                        警告： 特征字符串经常被 shell 解释，所以建议使用引号。例如，书
                        写 "rush add --package "example@^1.2.3"", 而不是
                        "rush add --package example@^1.2.3".
  --exact               一旦使用该参数，添加到 package.json 那的版本将是一个精确
                        版本（例如，没有 ~ 或 ^ 标记）。
  --caret               一旦使用该参数，那么添加到 package.json 中的版本将带有
                        ^ 标记。
  --dev                 一旦使用该参数，那么添加到库将添加到 package.json 中的
                        "devDependencies" 字段。
  -m, --make-consistent
                        一旦使用该参数，使用该库的其他项目将会在 package.json 文件中
                        将该依赖成相同的版本。
  -s, --skip-update     一旦使用该参数，当更新完 package.json 文件后将不会执行
                        "rush update".
  --all                 一旦使用该参数，该依赖将被添加到所有项目中。
```
