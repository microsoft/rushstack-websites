---
title: Cobuilds (Experimental)
---

Rush's **cobuild** feature ("cooperative builds") provides a cheap way to distribute work across
multiple machines. For an extremely large scale setup, you need a build accelerator such as
[BuildXL](https://github.com/microsoft/BuildXL/blob/main/Documentation/Wiki/Frontends/js-rush-options.md)
to manage a farm of machines and schedule jobs. (There are also plans to integrate Rush
with [bazel-buildfarm](https://github.com/bazelbuild/bazel-buildfarm), Google's equivalent of BuildXL.)
However such systems have steep learning curves and require nontrivial maintenance.

By comparsion, cobuilds are a simple extension of what you're already doing: spawn multiple instances of
your CI pipeline on different machines, allowing them to share work via Rush's [build cache](./build_cache.md).
For example, suppose your runs `rush install && rush build` and we launch this two machines.
If machine #1 has already built a project, then machine #2 can skip that project, by fetching the result
from the build cache. But there is a flaw in this idea: What if machine #2 gets to that project when
machine #1 is almost finished. The cache miss will cause machine #2 to start building the same project,
when it would have been better to work on something else and wait for machine #1 to finish.
We can solve this by using a simple key/value store to communicate progress between machines.
(Rush includes a [Redis](https://redis.io/) provider, but it's easy to implement plugins for whatever
service is most convenient for your environment.)

## Do I need cobuilds?

Without cobuilds, Rush already parallelizes your jobs on a single machine. (This may not be immediately obvious,
since Rush "collates" the console output so that it looks as if projects are getting built one at a time.)
You can fine-tune the parallelism using the `--parallelism` command-line parameter.

Before adopting cobuilds, we recommend to try these things first:

1. **Enable the build cache**: The [build cache](./build_cache.md) is a prerequisite for cobuilds anyway.

2. **Identify bottlenecks:** If your monorepo's dependency graph does not allow parallelism, then no approach
   or amount of parallelism will be effective. You can use the`--timeline` parameter to identify bottlenecks
   that causing too many projects to wait before they can start building. These bottlenecks can be solved
   by refactoring code to break apart big projects and eliminate unnecessary dependencies.

3. **Upgrade your hardware:** Compared to engineering salaries, hardware is extremely cheap.
   If your builds are slow, we recommend to upgrade to high end hardware with the maximum amount of RAM
   and CPU cores.

4. **Cache state between runs:** CI machines often start `rush install && rush build` with a completely clean
   machine image. For example, `rush install` time can be improved by using `RUSH_PNPM_STORE_PATH` to
   save the PNPM store and restore it between runs. Some environments permit the machine to be reused for
   multiple jobs, so that other Rush caches are preserved.

> **Prerequisites**
>
> In order to use this feature, you will need:
>
> - The [build cache](./build_cache.md) enabled with a cloud storage provider.
>
> - A [Redis server](https://redis.io/). If your company uses some other key/value service,
>   you can use that instead, by implementing a plugin following the example of
>   [rush-redis-cobuild-plugin](https://github.com/microsoft/rushstack/tree/main/rush-plugins/rush-redis-cobuild-plugin).
>
> - A CI job runner that is able to trigger multiple instances of a given CI pipeline.
>   For example, Jenkins and Azure DevOps allow a "parent" pipeline to trigger "child" pipelines.

## Enabling the cobuild feature

1. Upgrade `rushVersion` in your **rush.json** to `5.104.0` or newer.

2. If you haven't done something equivalent already, create an autoinstaller for your Rush plugins:

   ```bash
   rush init-autoinstaller --name rush-plugins
   ```

   For background about plugins and autoinstallers, see [Using Rush plugins](../maintainer/using_rush_plugins.md).

3. Add the `@rushstack/rush-redis-cobuild-plugin` plugin to the autoinstaller. (We'll use Redis for this tutorial.)

   **common/autoinstallers/rush-plugins/package.json**

   ```js
   {
     "name": "rush-plugins",
     "version": "1.0.0",
     "private": true,
     "dependencies": {
       "@rushstack/rush-redis-cobuild-plugin": "5.104.0"
     }
   }
   ```

   > 👉 **IMPORTANT:**
   >
   > Keep the version of `@rushstack/rush-redis-cobuild-plugin` in sync with
   > the `rushVersion` from your **rush.json**.

4. Update the autoinstaller's lockfile:

   ```bash
   rush update-autoinstaller --name rush-plugins

   # Remember to commit the updated pnpm-lock.yaml file to git
   ```

5. Next, we need to update **rush-plugins.json** to load the plugin from our `rush-plugins` autoinstaller.

   **common/config/rush/rush-plugins.json**

   ```js
   {
     "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/rush-plugins.schema.json",
     "plugins": [
       /**
        * Each item defines a plugin to be loaded by Rush.
        */
       {
         /**
          * The name of the NPM package that provides the plugin.
          */
         "packageName": "@rushstack/rush-redis-cobuild-plugin",

         /**
           * The name of the plugin.  This can be found in the "pluginName"
           * field of the "rush-plugin-manifest.json" file in the NPM package folder.
           */
         "pluginName": "rush-redis-cobuild-plugin",

         /**
          * The name of a Rush autoinstaller that will be used for installation, which
          * can be created using "rush init-autoinstaller".  Add the plugin's NPM package
          * to the package.json "dependencies" of your autoinstaller, then run
          * "rush update-autoinstaller".
          */
         "autoinstallerName": "rush-plugins"
       }
     ]
   }
   ```

6. Configure `rush-redis-cobuild-plugin` by creating its config file:

   **common/config/rush-plugins/rush-redis-cobuild-plugin.json**

   ```js
   {
     /**
      * The URL of your Redis server
      */
     "url": "redis://<remote_ip>:6379",

     /**
      * An environment variable that your CI pipeline will assign,
      * which the plugin uses to authenticate with Redis.
      */
     "passwordEnvironmentVariable": "REDIS_PASS"
   }
   ```

7. Lastly, use `rush init` to create the **cobuild.json** [config file](../configs/cobuild_json.md) that is
   used to enable the cobuild feature. Make sure to set `"cobuildFeatureEnabled": true` as shown below:

   **common/config/rush/cobuild.json**

   ```js
   /**
    * This configuration file manages Rush's cobuild feature.
    * More documentation is available on the Rush website: https://rushjs.io
    */
    {
     "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/cobuild.schema.json",

     /**
      * (Required) EXPERIMENTAL - Set this to true to enable the cobuild feature.
      * RUSH_COBUILD_CONTEXT_ID should always be specified as an environment variable with an non-empty string,
      * otherwise the cobuild feature will be disabled.
      */
     "cobuildFeatureEnabled": true,

     /**
      * (Required) Choose where cobuild lock will be acquired.
      *
      * The lock provider is registered by the rush plugins.
      * For example, @rushstack/rush-redis-cobuild-plugin registers the "redis" lock provider.
      */
     "cobuildLockProvider": "redis"
   }
   ```

## Configuring build pipelines

Each CI system has different ways of defining jobs. Many of them now use YAML config files to define
the work, although the file format is different for each system.

Here's some simplified pseudocode:

**cobuild example with 3 machines**

```yaml
# THIS IS SIMPLIFIED PSEUDOCODE ILLUSTRATING THE BASIC IDEA.
# YOUR ACTUAL CI SYSTEM WILL USE A DIFFERENT REPRESENTATION.
jobs:
  - job: primary
    envs:
      RUSH_COBUILD_CONTEXT_ID: ${{ BUILD_ID }}
      RUSH_COBUILD_RUNNER_ID: primary
      RUSH_BUILD_CACHE_WRITE_ALLOWED: 1
      REDIS_PASS: my_redis_password
    steps:
      - git clone
      - rush install
      - rush build
      - publish artifacts

  - job: cobuild1
    envs:
      RUSH_COBUILD_CONTEXT_ID: ${{ BUILD_ID }}
      RUSH_COBUILD_RUNNER_ID: cobuild1
      RUSH_BUILD_CACHE_WRITE_ALLOWED: 1
      REDIS_PASS: my_redis_password
    steps:
      - git clone
      - rush install
      - rush build

  - job: cobuild2
    envs:
      RUSH_COBUILD_CONTEXT_ID: ${{ BUILD_ID }}
      RUSH_COBUILD_RUNNER_ID: cobuild2
      RUSH_BUILD_CACHE_WRITE_ALLOWED: 1
      REDIS_PASS: my_redis_password
    steps:
      - git clone
      - rush install
      - rush build
```

## Configuring environment variables

### `RUSH_COBUILD_CONTEXT_ID`

Cobuild pipelines must define this environment variable; without it, Rush will perform a regular build without
any cobuild logic.

The `RUSH_COBUILD_CONTEXT_ID` variable controls caching: Imagine that a pull request validation has failed
because a project had errors. Without cobuilds, a project with errors is NOT saved to the build cache. If a
person goes to the GitHub website and clicks a button to **"Re-run this job"**, the successful projects will
be pulled from the cache, but that failed project will get built again.

However with cobuilds, if a project had errors, we don't want the other two machines to try to build that project.
The error logs are saved to the build cache. Thus, without `RUSH_COBUILD_CONTEXT_ID`, when the person clicks
**"Re-run this job"** the failing project would wrongly NOT get rebuilt.

How to assign this ID depends on your particular system, built most likely it will be a unique identifier of
the parent job that spawns the 3 child jobs. It can be any string with these properties:

- `RUSH_COBUILD_CONTEXT_ID` must be the same across every machine for a given "run"
- `RUSH_COBUILD_CONTEXT_ID` must be different each time a new "run" is started
- It must be a short string, because it becomes part of a cache key

Some examples:

<!-- prettier-ignore-start -->
| CI system | Suggested value for `RUSH_COBUILD_CONTEXT_ID` | Reference |
|---|---|---|
|  Azure DevOps | `Build.BuildNumber` | [Configure run or build numbers](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/run-number?view=azure-devops&tabs=yaml) |
| Github Actions | | Combine `GITHUB_ACTION` `GITHUB_RUN_NUMBER` `GITHUB_RUN_ATTEMPT` | [Default environment variables](https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables) |
| CircleCI | Combine `CIRCLE_WORKFLOW_ID` `CIRCLE_BUILD_NUM` | [Project values and variables](https://circleci.com/docs/variables/) |
<!-- prettier-ignore-end -->

### `RUSH_COBUILD_RUNNER_ID`

This environment variable to uniquely identifies each machine. If this variable is not defined,
Rush will generate a random identifier on each run.

## Technical background

### What is stored in Redis?

The cobuild feature uses Redis for two main purposes:

1. **A reentrant locking mechanism.** The key corresponding to the lock is in the format of
   `cobuild:lock:<context_id>:<cluster_id>`, and the corresponding value is `<runner_id>`.
   When setting the lock key, a 30-second expiration time is also set.
   This ensures that the same runner can reacquire the lock when attempting to obtain it again,
   while also automatically releasing the lock if the runner does not respond for a certain period of time.

2. **Track completed operations.** The key corresponding to the completed state is in the format of
   `cobuild:completed:<context_id>:<cache_id>`, and the corresponding value is a string in a serialized form
   of the operation's execution result and the corresponding `cache_id`. Before attempting to acquire a lock,
   a machine will first query this completion result information. If there is a completion result available,
   the result is reused based on the parsed information.
