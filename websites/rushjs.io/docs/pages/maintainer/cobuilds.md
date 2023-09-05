---
title: Cobuilds (experimental)
---

<!--
  Grammar note for writers

  The noun form refers to the overall run:
  RIGHT: "This cobuild used 3 machines."
  WRONG: "This run used 3 cobuilds." !!!

  So the plural form refers indirectly to the feature:
  RIGHT: "This monorepo uses cobuilds."
  RIGHT: "Cobuilds are enabled in this monorepo."

  Otherwise you have to say "feature":
  RIGHT: "You need to enable the cobuild feature."
  WRONG: "You need to enable cobuild." !!!
  WRONG: "You need to enable the cobuilds feature." !!!

  Adjective form:
  RIGHT: "This class defines a cobuild lock provider."
-->

Rush's "cobuild" feature (cooperative builds) provides a lightweight solution for distributing work across
multiple machines. The idea is a simple extension of what you're already doing: just spawn multiple instances
of the same CI pipeline on different machines, allowing them to share work via Rush's [build cache](./build_cache.md).

For example, suppose your job runs `rush install && rush build`, and we launch this command on two machines.
If machine #1 has already built a project, then machine #2 will skip that project, instead fetching the result
from the build cache. In this way, the building gets divided between the two pipelines, and with perfect parallelism
the build might finish in half the time.

But there is a flaw in this idea: What if machine #2 reaches a project that machine #1 already started building
but has not finished yet? This cache miss will cause machine #2 to start building the same project,
when it may have been better to work on something else while waiting for machine #1 to finish that project.
We can solve this by using a simple key/value store to communicate progress between machines.
(In this tutorial we'll use Rush's [Redis](https://redis.io/) provider, but if your company already hosts
some other service such as [Memcached](https://www.memcached.org/), it's
[fairly easy](https://github.com/microsoft/rushstack/blob/main/rush-plugins/rush-redis-cobuild-plugin/src/RedisCobuildLockProvider.ts)
to implement your own provider.)

## Do I need cobuilds?

Without cobuilds, Rush already parallelizes your jobs on a single machine. (This may not be immediately obvious,
since Rush's output is "collated" for readability, making it appear as if projects are getting built one at a time.)
You can fine-tune the maximum parallelism using the `--parallelism` command-line parameter, but keep in mind
that projects can only build concurrently if they don't depend on each other. Thus, cobuilds will only help
if you've reached the limits for a single machine (considering cpu cores, disk I/O rates, and available memory).
And only if further parallelism is actually possible for your project dependency graph.

The cobuild feature launches multiple instances of a CI pipeline, under the assumption that machines will be
readily available. Typical Rush monorepos target a pool of machines that is 100 or less, so this should not
be an issue. An extremely large monorepo, might need thousands of machines, at which point it would make more
sense to use a "build accelerator" such as
[BuildXL](https://github.com/microsoft/BuildXL/blob/main/Documentation/Wiki/Frontends/js-rush-options.md)
instead of cobuilds. (There are also plans to integrate Rush with
[bazel-buildfarm](https://github.com/bazelbuild/bazel-buildfarm); Bazel is Google's equivalent of BuildXL.)
Build accelerators generally require you to replace your CI system with their centralized job scheduler
that manages its own dedicated pool of machines. Such systems require nontrivial maintenance
and can have steeper learning curves, which is why we recommend to start with cobuilds first.

Before adopting cobuilds, we recommend to try these things first:

1. **Enable the build cache**: The [build cache](./build_cache.md) is a prerequisite for cobuilds anyway.

2. **Identify bottlenecks:** If your monorepo's dependency graph does not actually allow lots of projects
   to be built in parallel, that must be fixed first before considering distributed builds.
   You can use Rush's `--timeline` parameter to identify bottlenecks that are causing too many projects
   to wait before they can start building. These bottlenecks can be solved by:

   - eliminating unnecessary dependencies between projects
   - introducing [Rush phases](./phased_builds.md) to break up build steps into multiple operations
   - refactoring code to break up big projects into smaller projects

3. **Upgrade your hardware:** If your builds are slow, it can help to add more machines. We generally recommend
   to choose high end hardware with the maximum amount of RAM and CPU cores for your plan, based on typical
   behavior of `rush install` and `rush build`. But every monorepo is different, so collect benchmarks on
   different hardware configurations to inform your decision. Speeding up the build makes everybody more productive;
   however, because hardware upgrades usually come from a different budget than engineering salaries,
   management sometimes may need some help to see this connection.

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
>   you can implement a plugin by following the example of
>   [rush-redis-cobuild-plugin](https://github.com/microsoft/rushstack/tree/main/rush-plugins/rush-redis-cobuild-plugin).
>   (And consider contributing it back to Rush Stack!)
>
> - A CI system that is able to trigger multiple runners for a given CI pipeline.
>   For example, Jenkins and Azure DevOps allow a "parent" pipeline to trigger "child" pipelines.
>
> - [Rush phases](./phased_builds.md) are suggested to increase parallelism, but are not required.

## Enabling the cobuild feature

1. Upgrade `rushVersion` in your **rush.json** to `5.104.1` or newer.

2. Create an autoinstaller for the Rush plugin:

   ```bash
   rush init-autoinstaller --name cobuild-plugin
   ```

   It's also okay to use an existing autoinstaller. For more about Rush plugins and autoinstallers,
   see [Using Rush plugins](../maintainer/using_rush_plugins.md) and [Autoinstallers](./autoinstallers.md).

3. Add the `@rushstack/rush-redis-cobuild-plugin` plugin to the autoinstaller. (We'll use Redis for this tutorial.)

   **common/autoinstallers/cobuild-plugin/package.json**

   ```js
   {
     "name": "cobuild-plugin",
     "version": "1.0.0",
     "private": true,
     "dependencies": {
       "@rushstack/rush-redis-cobuild-plugin": "5.104.0"
     }
   }
   ```

   > 👉 **IMPORTANT:**
   >
   > Over time, make sure to keep the version of `@rushstack/rush-redis-cobuild-plugin` in sync with
   > the `rushVersion` from your **rush.json**.

4. Update the autoinstaller's lockfile:

   ```bash
   rush update-autoinstaller --name cobuild-plugin

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
         "autoinstallerName": "cobuild-plugin"
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
     "url": "redis://server.example.com:6379",

     /**
      * An environment variable that your CI pipeline will assign,
      * which the plugin uses to authenticate with Redis.
      */
     "passwordEnvironmentVariable": "REDIS_PASSWORD"
   }
   ```

7. You can use `rush init` to create the **cobuild.json** [config file](../configs/cobuild_json.md) that is
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

8. Run `rush update` which should now install the `cobuild-plugin` autoinstaller. This downloads its
   manifest file:

   **common/autoinstallers/cobuild-plugin/rush-plugins/@rushstack/rush-redis-cobuild-plugin/rush-plugin-manifest.json**

   Commit this file to Git as well. (As part of the plugin system, this file caches important information so
   that Rush can access it without having to install the plugin's NPM package.)

## Configuring build pipelines

Each CI system has different ways of defining jobs. For this tutorial, we'll use a
[GitHub Actions workflow](https://docs.github.com/en/actions/using-workflows/about-workflows)
since it's included with the free plan for public projects.

Suppose our non-cobuild CI pipeline looks like this (with build cache writes enabled):

**.github/workflows/ci-single.yml**

```yaml
name: ci-single.yml
on:
  #push:
  #  branches: ['main']
  #pull_request:
  #  branches: ['main']

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:
jobs:
  build:
    name: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 16

      - name: Rush Install
        run: node common/scripts/install-run-rush.js install

      - name: Rush build (install-run-rush)
        run: node common/scripts/install-run-rush.js build --verbose --timeline
        env:
          RUSH_BUILD_CACHE_WRITE_ALLOWED: 1
          RUSH_BUILD_CACHE_CREDENTIAL: ${{ secrets.RUSH_BUILD_CACHE_CREDENTIAL }}
```

Here's how we would convert that into a cobuild with 3 runners:

**.github/workflows/ci-cobuild.yml**

```yaml
name: ci-cobuild.yml
on:
  #push:
  #  branches: ['main']
  #pull_request:
  #  branches: ['main']

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:
jobs:
  build:
    name: cobuild
    runs-on: ubuntu-latest
    strategy:
      matrix:
        runner_id: [runner1, runner2, runner3]
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 16

      - name: Rush Install
        run: node common/scripts/install-run-rush.js install

      - name: Rush build (install-run-rush)
        run: node common/scripts/install-run-rush.js build --verbose --timeline
        env:
          RUSH_BUILD_CACHE_WRITE_ALLOWED: 1
          RUSH_BUILD_CACHE_CREDENTIAL: ${{ secrets.RUSH_BUILD_CACHE_CREDENTIAL }}
          RUSH_COBUILD_CONTEXT_ID: ${{ github.run_id }}_${{ github.run_number }}_${{ github.run_attempt }}
          RUSH_COBUILD_RUNNER_ID: ${{ matrix.runner_id }}
          REDIS_PASSWORD: ${{ secrets.REDIS_PASSWORD }}
```

The `runner_id` matrix causes the job to be run on 3 separate machines. The `REDIS_PASSWORD` variable name
is what we defined earlier in **rush-redis-cobuild-plugin.json**. The `RUSH_COBUILD_CONTEXT_ID`
and `RUSH_COBUILD_RUNNER_ID` variables are explained below.

## Cobuild environment variables in detail

### `RUSH_COBUILD_CONTEXT_ID`

Cobuild runners must define this environment variable; without it, Rush will perform a regular build without
any cobuild logic.

The `RUSH_COBUILD_CONTEXT_ID` variable controls caching: Imagine that a pull request validation has failed
because a project had errors. Without cobuilds, a project with errors is NOT saved to the build cache. If a
person goes to the GitHub website and clicks a button to **"Re-run this job"**, the successful projects will
be pulled from the cache, but that failed project will be forced to build again, which is good because maybe
it was a transient failure.

Whereas with cobuilds, if a project has errors, we don't want the other two machines to try to build that project.
The error logs are saved to the build cache, and will be restored and printed by the other runners (to provide
a complete log on every machine). But if a person clicks **"Re-run this job"**, how do we force the failing
projects to get rebuild in that case? The `RUSH_COBUILD_CONTEXT_ID` identifier solves this, by getting added
to the cache key to force a rebuild.

`RUSH_COBUILD_CONTEXT_ID` is specified differently for each system. It can be any string with these properties:

- `RUSH_COBUILD_CONTEXT_ID` must be the same across every machine for a given job
- `RUSH_COBUILD_CONTEXT_ID` must be different each time the job is run, including reattempts of the same "run"
- It must be a short string, because it becomes part of a cache key

Some examples:

<!-- prettier-ignore-start -->
| CI system | Suggested value for `RUSH_COBUILD_CONTEXT_ID` |
|---|---|
| [Azure DevOps](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/run-number?view=azure-devops&tabs=yaml) | `${{ Build.BuildNumber }}` |
| [GitHub Actions](https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables) | ` ${{ github.run_id }}_${{ github.run_number }}_${{ github.run_attempt }}` |
| [CircleCI](https://circleci.com/docs/variables/) | `${CIRCLE_WORKFLOW_ID}_${CIRCLE_WORKFLOW_JOB_ID}` |
<!-- prettier-ignore-end -->

### `RUSH_COBUILD_RUNNER_ID`

This environment variable to uniquely identifies each machine. If this variable is not defined,
Rush will generate a random identifier on each run.

In the example, we specified it as `RUSH_COBUILD_RUNNER_ID: ${{ matrix.runner_id }}` for readability.

## Technical details

### Build cache correctness

You will find that the cobuild feature increases the requirement that every project's output is accurately saved
and restored by the cache. To see why, suppose that project `A` directly depends on project `B`. There are several
ways that an inaccurate cache might still produce a successful build:

1. Project `A` and `B` are both cache misses, so no caching occurs. **- OR -**
2. Project `A` and `B` are both cache hits. `B` does not get restored accurately. `A` would have failed to
   compile, but didn't need to build `A`. The final result of `A` is still correct. **- OR -**
3. Only project `A` is a cache miss. `B` does not get restored accurately, but the missing files are
   still on disk from a previous build on the same machine. Thus `A` compiles without errors.

These lucky situations are relatively common in non-cobuild scenarios, and if you're unlucky, the problem might
go away of you try again. The failure won't be noticed consistently until this happens:

4. Only project `A` is a cache miss. `B` does not get restored accurately, and we started with a clean disk.

Cobuilds greatly increase the likelihood of encountering #4, because their goal is to build cache misses
that depend on a cache hit. In short, after first enabling the cobuilds feature, you may need to spend some time
fixing incorrect build cache configurations.

> 👉 **rush-audit-cache-plugin**
>
> If you suspect that files are not getting accurately saved/restored by the Rush build cache,
> try the [rush-audit-cache-plugin](https://www.npmjs.com/package/rush-audit-cache-plugin).
> It detects such problems by monitoring file writes during a build operation. The file paths are then compared
> with your cache configuration to produce a report of file paths that aren't being cached correctly.

### What gets stored in Redis?

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

## See also

- [Enabling the build cache](./build_cache.md)
- [Environment variables](../configs/environment_vars.md)
- [Using Rush plugins](../maintainer/using_rush_plugins.md)
- [Autoinstallers](./autoinstallers.md)
