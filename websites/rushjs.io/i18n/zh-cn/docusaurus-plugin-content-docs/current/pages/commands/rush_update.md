---
title: rush update
---

```
用法： rush update [-h] [-p] [--bypass-policy] [--no-link]
                   [--network-concurrency COUNT] [--debug-package-manager]
                   [--max-install-attempts NUMBER] [--ignore-hooks]
                   [--variant VARIANT] [--full] [--recheck]

"rush update" 命令会依据 package.json 文件安装依赖，并按需更新 shrinkwrap 文件（
shrinkwrap 文件是存储仓库内所有项目的依赖和版本的中心，它被放到 "common/config/rush"
文件夹下）。注意，Rush 会在一次性给仓库内的所有项目安装。 当你从 Git 上拉去文件，或者修改
完 package.json 文件后，需要执行 "rush update" 才能开始工作。如果无需更新，则 "rush
update" 会在瞬时完成。注意：在某些情况下应该使用 "rush install" 来替换 "rush update",
更多信息可以参考 "rush install" 的命令行帮助。

可选参数：
  -h, --help            展示帮助信息并退出
  -p, --purge           开始执行之前执行 "rush purge".
  --bypass-policy       强制覆盖 rush.json 中约定的 "gitPolicy" 规定。
  --no-link             一旦指定该参数，那么当安装完成后项目不会执行符号连接。你需要手动
                        执行 "rush link", 当想要独立的报告每个阶段，或者在两个阶段之
                        间进行额外的操作时，该参数十分有用。当使用 workspaces 时，不支
                        持该参数。
  --network-concurrency COUNT
                        一旦指定该参数，将会限制最大的并发网络请求数。当网络出现问题时，
                        该参数十分有用。
  --debug-package-manager
                        开启包管理器的详细日志。当使用该参数时，你可能想要 Rush 输出到
                        一个文件中。
  --max-install-attempts NUMBER
                        覆盖默认的尝试安装的次数，默认值为 3.
  --ignore-hooks        跳过执行定义在 rush.json 中的 "eventHooks" 脚本。你应该知道
                        自己跳过了什么。
  --variant VARIANT     通过一个安装配置变量来执行 Rush 命令。该参数可以通过环境变量
                        RUSH_VARIANT 来指定。
  --full                通常 "rush update" 会尝试保留已安装的版本并会在满足
                        package.json 文件要求的情况下进行最小更新。这种保守的方式
                        可以防止 PR 被卷入到与自己无关的包更新中。当你想将所有依赖
                        更新到语义化兼容的最新版本时候，可以使用 "--full" 参数。
                        该操作应该由某个人或者机器来定期执行，进而处理潜在的升级回
                        归。
  --recheck             如果 shrinkwrap 文件看依赖已经满足 package.json 文件，
                        那么 "rush update" 不再会调用包管理器。但是在某些情况
                        下，这种方法可能并不精准。使用 "--recheck" 参数可以强制
                        包管理器处理 shrinkwrap 文件。这也会更新 shrinkwrap 文件。
                        （为了最大限度减少 shrinkwrap 的变更，这些修复只会在临时
                        文件中执行）
```

## 参考

- [rush install](../commands/rush_install.md)
