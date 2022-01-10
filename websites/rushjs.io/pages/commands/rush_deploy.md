---
layout: page
title: rush deploy
navigation_source: docs_nav
---

```
usage: rush deploy [-h] [-p PROJECT_NAME] [-s SCENARIO_NAME] [--overwrite]
                   [-t PATH] [--create-archive ARCHIVE_PATH]


After building the repo, "rush deploy" can be used to prepare a deployment by
copying a subset of Rush projects and their dependencies to a target folder,
which can then be uploaded to a production server. The "rush deploy" behavior
is specified by a scenario config file that must be created first, using the
"rush init-deploy" command.

Optional arguments:
  -h, --help            Show this help message and exit.
  -p PROJECT_NAME, --project PROJECT_NAME
                        Specifies the name of the main Rush project to be
                        deployed. It must appear in the
                        "deploymentProjectNames" setting in the deployment
                        config file.
  -s SCENARIO_NAME, --scenario SCENARIO_NAME
                        By default, the deployment configuration is specified
                        in "common/config/rush/deploy.json". You can use
                        "--scenario" to specify an alternate name. The name
                        must be lowercase and separated by dashes. For
                        example, if SCENARIO_NAME is "web", then the config
                        file would be "common/config/rush/deploy-web.json".
  --overwrite           By default, deployment will fail if the target folder
                        is not empty. SPECIFYING THIS FLAG WILL RECURSIVELY
                        DELETE EXISTING CONTENTS OF THE TARGET FOLDER.
  -t PATH, --target-folder PATH
                        By default, files are deployed to the "common/deploy"
                        folder inside the Rush repo. Use this parameter to
                        specify a different location. WARNING: USE CAUTION
                        WHEN COMBINING WITH "--overwrite". This parameter may
                        alternatively be specified via the
                        RUSH_DEPLOY_TARGET_FOLDER environment variable.
  --create-archive ARCHIVE_PATH
                        If specified, after the deployment has been prepared,
                        "rush deploy" will create an archive containing the
                        contents of the target folder. The newly created
                        archive file will be placed according to the
                        designated path, relative to the target folder.
                        Supported file extensions: .zip
```

## See also

- [Deploying projects]({% link pages/maintainer/deploying.md %})
- [rush init-deploy]({% link pages/commands/rush_init-deploy.md %})
