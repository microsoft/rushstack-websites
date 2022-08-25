---
title: rush init-deploy
---

```
用法： rush init-deploy [-h] -p PROJECT_NAME [-s SCENARIO]

该命令可以生成用于 "rush deploy" 的配置文件。默认名为 common/config/rush/deploy.json.
然而，如果你需要管理多个不同配置的部署环境，你可以使用 '--scenario" 来创建额外的配置文件。

可选参数：
  -h, --help            展示帮助信息并退出。
  -p PROJECT_NAME, --project PROJECT_NAME
                        指定该场景下需要被部署的项目名。它将添加到 "deploymentProjectNames"
                        配置中。
  -s SCENARIO, --scenario SCENARIO
                        默认情况下，部署配置将被写到 "common/config/rush/deploy.json"
                        中，你可以使用 "--scenario" 来指定一个可选名，该名字必须
                        小写且使用破折号分开，例如，如果名字是 "web"，那么配置文件
                        应该是 "common/config/rush/deploy-web.json".
```

## 参考

- [部署项目](../maintainer/deploying.md)
- [deploy.json](../configs/deploy_json.md) 配置文件
- [rush deploy](../commands/rush_deploy.md)
- [rush init](../commands/rush_init.md)
