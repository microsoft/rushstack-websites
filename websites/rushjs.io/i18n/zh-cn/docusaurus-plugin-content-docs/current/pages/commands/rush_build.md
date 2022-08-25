---
title: rush build
---

```
用法：rush build [-h] [-p COUNT] [-t PROJECT] [-T PROJECT] [-f PROJECT]
                  [-o PROJECT] [-i PROJECT] [-I PROJECT]
                  [--to-version-policy VERSION_POLICY_NAME]
                  [--from-version-policy VERSION_POLICY_NAME] [-v] [-c]
                  [--ignore-hooks]

除了 "rush build" 可以增量构建外，刚命令与 "rush rebuild" 相似。换句话说，Rush build
只会构建自上次成功构建后发生的代码。它需要 Git 工作树来进行分析，只关心被 Git 跟踪的源文件
和在其项目下的文件（该算法的更多细节可以参考 "package-deps-hash" 包的文档）。增量构建状态
会保存在每个项目中的 ".rush/temp" 文件夹，该文件夹没被 Git 记录。构建指令被 "package-deps_build.json"
文件下的“参数”字段记录；当参数发生变化时（例如有或者没有 "--production" 参数），会重新执行
全量构建。

可选参数：
  -h, --help            展示帮助信息并退出。
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
  -c, --changed-projects-only
                        正常情况增量构建逻辑会重新构建所有直接或间接改变的项目。
                        指定 "--changed-projects-only" 将会忽略依赖项目，而仅构建
                        文件发生变化的项目。注意，该参数是“不安全”的，需要开发者确保忽略
                        的项目可以被忽略。
  --ignore-hooks        跳过定义在 "rush.jon" 下 "eventHooks" 脚本的。确保你知道
                        跳过了哪些。
```

## 参考

- [选择部分项目](../developer/selecting_subsets.md)
- [rush rebuild](../commands/rush_rebuild.md)
