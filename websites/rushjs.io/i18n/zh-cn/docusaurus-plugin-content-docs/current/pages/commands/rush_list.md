---
title: rush list
---

```
用法： rush list [-h] [-v] [-p] [--full-path] [--json] [-t PROJECT]
                 [-T PROJECT] [-f PROJECT] [-o PROJECT] [-i PROJECT]
                 [-I PROJECT] [--to-version-policy VERSION_POLICY_NAME]
                 [--from-version-policy VERSION_POLICY_NAME]

对于记录在 rush 配置文件中的项目，该命令可以列举包名，可选列出版本(--version)和路径(--path)或者完整路径(--full-path).

可选参数：
  -h, --help            展示帮助信息退出
  -v, --version         一旦指定该参数，则项目版本会在项目名的另外一列内展示。
  -p, --path            一旦指定该参数，则项目路径会在项目名的另外一列内展示。
  --full-path           一旦指定该参数，则项目的完整路径会在项目名的另外一列内展示。
  --json                一旦指定该参数，则以 JSON 的格式输出。
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
```
