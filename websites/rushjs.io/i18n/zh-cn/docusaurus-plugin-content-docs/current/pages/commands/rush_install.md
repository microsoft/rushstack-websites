---
title: rush install
---

```
用法： rush install [-h] [-p] [--bypass-policy] [--no-link]
                    [--network-concurrency COUNT] [--debug-package-manager]
                    [--max-install-attempts NUMBER] [--ignore-hooks]
                    [--variant VARIANT] [-t PROJECT] [-T PROJECT] [-f PROJECT]
                    [-o PROJECT] [-i PROJECT] [-I PROJECT]
                    [--to-version-policy VERSION_POLICY_NAME]
                    [--from-version-policy VERSION_POLICY_NAME]

"rush install" 命令会基于 "rush update" 创建/更新的 shrinkwrap 文件来给仓库内的所有项
目安装依赖（"shrinkwrap" 文件存储了仓库内项目的所有依赖和版本关系）。如果 shrinkwrap 文件
缺失或过时后（例如，由于项目的 package.json 文件改变），"rush install" 命令会执行失败，
并告诉你需要执行 "rush update" 来替代。其主要特性是只读：持续集成中应该使用 "rush install"
而不是 "rush update" 来获取那些忘记在 commit 中更新 shrinkwrap 的开发者。如果想要避免
shrinkwrap 文件偶然更新，那么这些谨慎的人可以使用 "rush install"

可选参数：
  -h, --help            展示帮助信息并推出。
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
  -t PROJECT, --to PROJECT
                        默认情况下将会处理仓库内的所有项目，可以通过该参数来选中部分项目。
                        每个 "--to" 参数会包含项目和其依赖的项目。"." 是当前工作目录的
                        简写。 更多信息可以参考“选中部分项目”一文。
  -T PROJECT, --to-except PROJECT
                        默认情况下将会处理仓库内的所有项目，可以通过该参数来选中部分项目。
                        每个 "--to-except" 会包含项目的依赖，而不包括项目本身。"." 是
                        当前工作目录的简写。 更多信息可以参考“选中部分项目”一文。
  -f PROJECT, --from PROJECT
                        默认情况下将会处理仓库内的所有项目，可以通过该参数来选中部分项目。
                        每个 "--from" 参数将会包含该项目和所有依赖它的项目，再加上这个
                        集合的依赖。"." 是当前工作目录的简写。 更多信息可以参考“选中部
                        分项目”一文。
  -o PROJECT, --only PROJECT
                        默认情况下将会处理仓库内的所有项目，可以通过该参数来选中部分项目。
                        正常情况下会构建仓库内的所有项目。通过该参数可以选中部分项目。
                        每个 "--only" 参数会选中指定的项目，而其依赖不会被添加。"." 是
                        当前目录的简写。注意这个参数是“不安全”的，因为它可能将某些依赖排除
                        在外。更多信息可以参考“选中部分项目”一文。
  -i PROJECT, --impacted-by PROJECT
                        正常情况下会构建仓库内的所有项目。通过该参数可以选中部分项目。
                        每个 "--impacted-by" 参数会包含该项目和所有依赖该项目的项目
                        （因此可能会造成破坏性变动）。"." 是当前目录的简写。注意该参数是
                        “不安全的”, 因为它可能将某些依赖排除在外。更多信息可以参考“选中
                        部分项目”一文。
  -I PROJECT, --impacted-by-except PROJECT
                        正常情况下会构建仓库内的所有项目。通过该参数可以选中部分项目。
                        每个 "--impacted-by-expect" 参数会包含所有依赖该项目的项目，
                        而不包含本身。"." 是当前目录的简写。注意该参数是“不安全的”，
                        因为它可能将某些依赖排除在外。更多信息可以参考“选中部分项目”一文。
  --to-version-policy VERSION_POLICY_NAME
                       正常情况下会构建仓库内的所有项目。通过该参数可以选中部分项目。
                        "--to-version-policy" 参数会给每个属于 VERSION_POLICY_NAME
                        的项目指定 "--to", 更多信息可以参考“选中部分项目”一文。
  --from-version-policy VERSION_POLICY_NAME
                        正常情况下会构建仓库内的所有项目。通过该参数可以选中部分项目。
                        "--from-version-policy" 参数会给每个属于 VERSION_POLICY_NAME
                        的项目指定 "--from", 更多信息可以参考“选中部分项目”一文。
```

## 参考

- [rush update](../commands/rush_update.md)
