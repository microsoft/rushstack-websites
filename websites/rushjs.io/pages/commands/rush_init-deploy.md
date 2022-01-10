---
layout: page
title: rush init-deploy
navigation_source: docs_nav
---

```
usage: rush init-deploy [-h] -p PROJECT_NAME [-s SCENARIO]

Use this command to initialize a new scenario config file for use with "rush
deploy". The default filename is common/config/rush/deploy.json. However, if
you need to manage multiple deployments with different settings, you can use
use "--scenario" to create additional config files.

Optional arguments:
  -h, --help            Show this help message and exit.
  -p PROJECT_NAME, --project PROJECT_NAME
                        Specifies the name of the main Rush project to be
                        deployed in this scenario. It will be added to the
                        "deploymentProjectNames" setting.
  -s SCENARIO, --scenario SCENARIO
                        By default, the deployment configuration will be
                        written to "common/config/rush/deploy.json". You can
                        use "--scenario" to specify an alternate name. The
                        name must be lowercase and separated by dashes. For
                        example, if the name is "web", then the config file
                        would be "common/config/rush/deploy-web.json".
```

## See also

- [Deploying projects]({% link pages/maintainer/deploying.md %})
- [deploy.json]({% link pages/configs/deploy_json.md %}) config file
- [rush deploy]({% link pages/commands/rush_deploy.md %})
- [rush init]({% link pages/commands/rush_init.md %})
