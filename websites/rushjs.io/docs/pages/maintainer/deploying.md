---
title: Deploying projects
---

Suppose that your monorepo includes a Node.js service that we want to deploy to a web server.
For example, let's say the Node.js service is a local Rush project called `app1`, and the repo is
organized as follows:

- **apps/app1**:
  - depends on `ext-lib7` (from NPM) and `lib3` (a local project)
  - dev dependencies on `ext-tool8` (from NPM) and `tool6` (a local project)
- **apps/app2**: depends on `lib3` and `lib4`
- **libraries/lib3**: depends on `lib5`
- **libraries/lib4**: no dependencies
- **libraries/lib5**: peer dependency on `ext-lib7`
- **tools/tool6**: no dependencies

One solution might be to run `rush install` and `rush build`, and then copy the entire monorepo to the server.
However, this could potentially include many extraneous files and NPM packages. Instead we would like to copy
only `app1` and its regular dependencies (`ext-lib7`, `lib3`, `lib5`). We do not want to include dev dependencies such
as `ext-tool8`.

The [rush deploy](../../commands/rush_deploy) command calculates this set of files and
copies them to a target folder, which you can then upload to your server.

## Configuring "rush deploy"

The `rush deploy` command reads its settings from a config file
[common/config/rush/deploy.json](../../configs/deploy_json). This config file is not created
by `rush init`. Instead, you create the file using [rush init-deploy](../../commands/rush_init-deploy).

Continuing our example, we can create the file using this command:

```shell
# Create common/config/rush/deploy.json and configure it to deploy "app1"
$ rush init-deploy --project app1
```

After the file **deploy.json** is created, open it in your editor and adjust the settings as appropriate. Then
commit this file to Git.

## Preparing a deployment

To copy the files to the deployment target folder, you would use these commands:

```shell
# Install dependencies
$ rush install

# Build the monorepo
$ rush build

# Copy app1 and its dependencies to the default target folder: common/deploy/
$ rush deploy
```

This will prepare a deployment by copying `app1` and its dependencies the target folder. The copied files will be
organized similarly to the monorepo's folder structure:

- **common/deploy/apps/app1/...**
- **common/deploy/common/temp/node_modules/ext-lib7/...**
- **common/deploy/libraries/lib3/...**
- **common/deploy/libraries/lib4/...**

You can test that the deployment worked correctly by executing `app1` from within the deployment target folder:

```shell
# Change to the app1 location under the target folder
$ cd common/deploy/apps/app1

# Invoke the package.json script that starts the web service
$ rushx start
```

If the project fails to run (but worked correctly from its original location **apps/app1**), then you many
need to tune the settings in **deploy.json**. Once you've confirmed that the project works correctly, the next step
is to upload the **common/deploy** subtree to your server machine.

## Handling links

The **common/deploy** subtree will have symbolic links created by `rush install`. For example, if you are using the
PNPM package manager, then **common/deploy/apps/app1/node_modules/ext-lib7** may be a symlink to a folder under the
**common/deploy/common/temp/node_modules/.pnpm/...** path. Correctly replicating these links can be problematic for
upload tools such as `tar` or `ftp`.

The **deploy.json** config file provides a setting `linkCreation` that offers choices for handling links:

- `"default"`: Create the links while copying the files; this is the default behavior. Use this setting if your
  file copy tool can handle links correctly.
- `"script"`: A Node.js script called **create-links.js** will be written to the target folder. Use this setting
  to create links on the server machine, after the files have been uploaded.
- `"none"`: Do nothing; some other tool may create the links later, based on the **deploy-metadata.json** file.

The **deploy-metadata.json** file is written to the deployment target folder and contains a full inventory of
links that need to be created. It might look something like this:

```js
{
  "scenarioName": "deploy.json",
  "mainProjectName": "app1",
  "links": [
    {
      "kind": "folderLink",
      "linkPath": "common/deploy/apps/app1/node_modules/ext-lib7",
      "targetPath": "common/deploy/common/temp/node_modules/.pnpm/registry.npmjs.org/ext-lib7/1.0.0/node_modules/ext-lib7"
    },
    . . .
  ]
}
```

If you specify `"linkCreation": "script"` then `rush deploy` will create the **common/deploy** folder without
any links. After you have uploaded this folder to your server machine, you can then invoke the script
to create the links:

```shell
# Invoke this command on the server machine, after the files have been uploaded
$ node create-links.js create
```

> NOTE: When using `"linkCreation": "script"`, the current implementation does not yet generate the
> **node_modules/.bin** command-line binaries. If you're interested in contributing a fix, see
> [this PR comment](https://github.com/microsoft/rushstack/pull/2010#issuecomment-656900649) for a
> suggested solution.

## Including additional projects

Continuing our example, suppose that we want to include `app1` and `app2` together as a single deployment.
Since `app2` is not a dependency of `app1`, it will not be included automatically. We can consider `app1` to be
the "main project" (listed in `deploymentProjectNames`), and then declare `app2` as an "additional project".
The config file would look like this:

**common/config/rush/deploy.json**

```js
{
  . . .
  // The main project
  "deploymentProjectNames": ["app1"],
  . . .
  "projectSettings": [
    {
      "projectName": "app1",

      // When deploying "app1", include "app2".  We need to add this explicitly because
      // "app2" is not a dependency of "app1".
      "additionalProjectsToInclude": [ "app2" ]
    }
  ]
}
```

## Multiple deployments using the same config file

Continuing our example, suppose that instead we want `app1` and `app2` to be deployed separately to two different
web servers. If the settings are the same, we can simply add both of them to the `deploymentProjectNames` array,
like this:

**common/config/rush/deploy.json**

```js
  . . .
  "deploymentProjectNames": [ "app1", "app2" ],
  . . .
```

When performing the deployment, the `--project` parameter selects which project to deploy. For example:

```shell
# Copy app1 and its dependencies to /mnt/deploy/app1
$ rush deploy --project app1 --target-folder /mnt/deploy/app1

# Copy app2 and its dependencies to /mnt/deploy/app2
$ rush deploy --project app2 --target-folder /mnt/deploy/app2
```

The `--target-folder` parameter copies the files to a custom location instead of the **common/deploy/** default folder.

## Multiple deployments using different config files

Continuing our example, suppose that `app2` deploys separately and it requires different settings from `app1`.
For example, suppose that we want `"linkCreation": "default"` for `app1`, but `"linkCreation": "script"` for `app2`.
We will create two config files:

- **common/config/rush/deploy.json** - the default scenario file, which we'll use for `app1`
- **common/config/rush/deploy-app2-example.json** -- the `app2-example` scenario, which we will use for `app2`

Both of these files can be created using `rush init-deploy`:

```shell
# Create common/config/rush/deploy.json
$ rush init-deploy --project app1

# Create common/config/rush/deploy-app2-example.json
$ rush init-deploy --project app2 --scenario app2-example
```

After editing **deploy-app2-example.json** to specify `"linkCreation": "script"`, we can now use the
`--scenario` parameter with `rush deploy`:

```shell
# Copy app1 and its dependencies to /mnt/deploy/app1
# Uses scenario file: common/config/rush/deploy.json
$ rush deploy --target-folder /mnt/deploy/app1

# Copy app2 and its dependencies to /mnt/deploy/app2
# Uses scenario file: common/config/rush/deploy-app2-example.json
$ rush deploy --target-folder /mnt/deploy/app2 --scenario app2-example
```

Note that the `--project` parameter is not needed with `rush deploy` because each config file has only one project
in its `"deploymentProjectNames"` array.

## See also

- [common/config/rush/deploy.json](../../configs/deploy_json) config file
- [rush deploy](../../commands/rush_deploy) command-line parameters
- [rush init-deploy](../../commands/rush_init-deploy) command-line parameters
