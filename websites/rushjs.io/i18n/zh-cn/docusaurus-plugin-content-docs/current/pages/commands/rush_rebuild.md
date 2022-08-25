---
title: rush rebuild
---

```
用法： rush rebuild [-h] [-p COUNT] [-t PROJECT] [-T PROJECT] [-f PROJECT]
                    [-o PROJECT] [-i PROJECT] [-I PROJECT]
                    [--to-version-policy VERSION_POLICY_NAME]
                    [--from-version-policy VERSION_POLICY_NAME] [-v]
                    [--ignore-hooks]


该指令假定每个项目下的 package.json 文件中的 "scripts" 字段，该字段中有 "npm run build"
这样完全清洁的构建。Rush 会调用该脚本来构建每个在 rush.json 中注册过的项目。项目会尽可能的
并行构建，但永远会遵循本地链接生成的依赖图。并行的进程数基于机器的核心数，除非被 --parallelism
参数覆盖（对于增量构建，可以使用 "rush build" 来替换 "rush rebuild"）。

可选参数：
  -h, --help            展示帮助信息并退出
  -p COUNT, --parallelism COUNT
                        定义并行构建的最大并发数，COUNT 参数应该是一个正整数并且其最大
                        值等于 CPU 核数。如果该参数为空，那么默认值会依赖操作系统和 CPU
                        的核数决定。参数可以通过 RUSH_PARALLELISM 环境变量指定。
  -t PROJECT, --to PROJECT
                        正常情况下会构建仓库内的所有项目。通过该参数可以选中部分项目。
                        每个 "--to" 参数会包含项目和其依赖的项目。"." 是当前工作目录
                        的简写。更多信息可以参考“选中部分项目”一文。
  -T PROJECT, --to-except PROJECT
                        正常情况下会构建仓库内的所有项目。通过该参数可以选中部分项目。
                        每个 "--to-except" 参数会包含项目的依赖项目，而不包括项目
                        本身。"." 是当前工程目录的简写。更多信息可以参考“选中部分项目”
                        一文。
  -f PROJECT, --from PROJECT
                        正常情况下会构建仓库内的所有项目。通过该参数可以选中部分项目。
                        每个 "--from" 参数会包含项目和所有依赖它的项目，再加上这个集
                        合的依赖。"." 是当前工程目录的简写。更多信息可以参考“选中部分
                        项目”一文。
  -o PROJECT, --only PROJECT
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
  -v, --verbose         构建期间展示更多信息，而不是仅仅展示总结性状态。
  --ignore-hooks        跳过定义在 "rush.jon" 下 "eventHooks" 脚本的。确保你知道
                        跳过了哪些。
```

## 参考

- [选择部分项目](../developer/selecting_subsets.md)
- [rush build](../commands/rush_build.md)
