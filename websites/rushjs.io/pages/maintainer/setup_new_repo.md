---
layout: page
title: Setting up a new repo
navigation_source: docs_nav
---

This tutorial walks through the process of consolidating several projects into a new Rush monorepo. (If you'd like to see a fully worked out sample based on these steps, take a look at the [rush-example](https://github.com/microsoft/rush-example) repo on GitHub.)

For this example, suppose we have 3 project folders, like this:

- **my-app**: a web application
- **my-controls**: a control library used by the application
- **my-toolchain**: a NodeJS build tool used to compile the other projects

Initially each of these projects is in its own folder. They are built using a cumbersome procedure like this:

```
~$ cd my-toolchain
~/my-toolchain$ npm run build
~/my-toolchain$ npm link
~/my-toolchain$ cd ../my-controls
~/my-controls$ npm link my-toolchain
~/my-controls$ npm run build
~/my-controls$ npm link
~/my-app$ cd ../my-app
~/my-app$ npm link my-toolchain
~/my-app$ npm link my-controls
~/my-app$ npm run build
```

Let's Rushify these projects!

## Step 1: Check your Rush version

Before we get started, make sure you have the latest Rush release installed globally:

```
~$ npm install -g @microsoft/rush
```

_NOTE: If this command fails because your user account does not have permissions to access NPM's global folder, you may need to [fix your NPM configuration](https://docs.npmjs.com/getting-started/fixing-npm-permissions)._

## Step 2: Use "rush init" to initialize your repo

Let's assume you already created an empty GitHub repo that we will copy these projects into. Clone your repo somewhere and then run `rush init` to generate Rush's config files:

```
~$ git clone https://github.com/my-team/my-repo
~$ cd my-repo
~/my-repo$ rush init
```

It will generate these files (see [Config file reference]({% link pages/advanced/config_files.md %}) for more info):

| File                                         | What it does                                                                                                                                                                |
| :------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **rush.json**                                | The main configuration file for Rush                                                                                                                                        |
| **.gitattributes**                           | _(Delete this file if you're not using Git.)_ <br/>Tells Git not to perform merging operations for shrinkwrap files, because it is unsafe.                                  |
| **.gitignore**                               | _(Delete this file if you're not using Git.)_ <br/>Tells Git not to track temporary files created by Rush.                                                                  |
| **.travis.yml**                              | _(Delete this file if you're not using Travis.)_ <br/>Configures the [Travis CI](https://travis-ci.com/) service to perform PR builds using Rush.                           |
| **common/config/rush/.npmrc**                | Rush uses this file to configure the package registry, regardless of whether the package manager is PNPM, NPM, or Yarn.                                                     |
| **common/config/rush/command-line.json**     | You can use this to define custom commands/parameters that will become part of the Rush command-line.                                                                       |
| **common/config/rush/common-versions.json**  | Used to specify NPM dependency version selections that affect all projects in a Rush repo.                                                                                  |
| **common/config/rush/pnpmfile.js**           | _(Delete this file if you've chosen to use NPM or Yarn instead of PNPM.)_ <br/>Used to workaround problems with dependencies that have mistakes in their package.json file. |
| **common/config/rush/version-policies.json** | Used to define advanced publishing configurations.                                                                                                                          |

**NOTE: If any of these files already exists in your branch, `rush init` will issue a warning and will NOT overwrite the existing files.**

Next, add the generated files to Git and commit them to your branch:

```
~/my-repo$ git add .
~/my-repo$ git commit -m "Initialize Rush repo"
```

## Step 3: Customize your configuration

The template files have lots of documentation and commented example snippets. We suggest you look over them to familiarize yourself with the basic options and features.

You can change your options at any time, but there are a few settings in **rush.json** that you should think about in advance:

- **Choose a package manager**: The template defaults to using PNPM, but you can also use NPM or Yarn. See [NPM vs PNPM vs Yarn]({% link pages/maintainer/package_managers.md %}) for guidance.

- **Check your Rush version**: Make sure your `rushVersion` setting is the latest version, which is shown in the [NPM registry](https://www.npmjs.com/package/@microsoft/rush).

- **Check other version fields**: Also check that you're using recent stable releases for any other applicable fields such as `pnpmVersion`, `npmVersion`, `yarnVersion`, `nodeSupportedVersionRange`

- **Decide whether to use the "category folders" model**: See the comments in **rush.json** regarding `projectFolderMinDepth` and `projectFolderMaxDepth`, and make a plan for how project folders will be organized in the monorepo

- **Configure your registry access**: The initial **.npmrc** file is configured to use the public NPM registry. If you will be using a [private registry]({% link pages/maintainer/npm_registry_auth.md %}), you should update the **common/config/rush/.npmrc** file.

#### Next up: [Adding projects to a repo]({% link pages/maintainer/add_to_repo.md %})
