---
title: rush init
---

```
用法： rush init [-h] [--overwrite-existing] [--rush-example-repo]

当在一个空文件夹下调用该命令时，它会提供一系列配置模版来使用 Rush 管理项目。

可选参数：
  -h, --help            展示帮助信息并退出。
  --overwrite-existing  默认情况下，"rush init" 不会覆盖已经存在的配置文件。指定该
                        参数后会重写。当你将仓库的 Rush 升级到一个新版本时，它十分有
                        用。警告：小心使用！
  --rush-example-repo   当拷贝模版配置文件时，"rush-example" 的 GitHub 仓库使用了
                        这些不包含注释的片段，"rush-example" 是一个说明 Rush 诸多
                        特性的 monorepo 仓库。该参数主要用于维护该示例。
```

## 参考

- [开始一个新仓库](../maintainer/setup_new_repo.md)
- GitHub 上的[rush 示例](https://github.com/microsoft/rush-example)仓库
- [rush init-deploy](../commands/rush_init-deploy.md)
