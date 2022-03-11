---
title: rush deploy
---

```
用法： rush deploy [-h] [-p PROJECT_NAME] [-s SCENARIO_NAME] [--overwrite]
                   [-t PATH] [--create-archive ARCHIVE_PATH]

仓库构建完成后，"rush deploy" 可以将 Rush 仓库内的某些项目和依赖部署到指定的目录下，该目录可
被上传到开发环境中。"rush deploy" 通过 "rush init-deploy" 生成的配置文件来指定该行为。

可选参数：
  -h, --help            展示帮助信息并退出。
  -p PROJECT_NAME, --project PROJECT_NAME
                        指定需要被部署的 Rush 项目名，它必须是部署配置文件下的
                        "deploymentProjectNames" 设定。
  -s SCENARIO_NAME, --scenario SCENARIO_NAME
                        默认情况下，部署配置在 "common/config/rush/deploy.json"
                        中指定。你可以使用 "--scenario" 来指定一个可选名，该名必须小
                        写且以破折号分割。例如，如果 SCENARIO_NAME 是 "web"，之后
                        配置文件应该是 "common/config/rush/deploy-web.json".
  --overwrite           默认情况下，如果目标目录为空则构建失败。当指定该参数后，会递归
                        的删除目标目录下存在的内容。
  -t PATH, --target-folder PATH
                        默认情况下，文件部署在 Rush 仓库内的 "common/deploy" 目录
                        下。可以使用该参数来指定不同的位置。警告：当与 "--overwrite"
                        结合使用时需要小心。该参数可以通过 RUSH_DEPLOY_TARGET_FOLDER
                        环境变量来指定。
  --create-archive ARCHIVE_PATH
                        一旦使用该参数，那么构建完成后，"rush deploy" 会创建一个目标
                        目录的压缩包。 新创建的压缩包被放到相对于目标文件的制定目录上，
                        支持的文件扩展名：.zip
```

## 参考

- [部署项目](../../maintainer/deploying)
- [rush init-deploy](../../commands/rush_init-deploy)
