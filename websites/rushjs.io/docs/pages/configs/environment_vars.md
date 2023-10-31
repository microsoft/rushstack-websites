---
title: Environment variables
---

The Rush tool's behavior can be customized using the shell environment variables described below:

## RUSH_ABSOLUTE_SYMLINKS

If this variable is set to `1`, Rush will create symlinks with absolute paths instead
of relative paths. This can be necessary when a repository is moved during a build or
if parts of a repository are moved into a sandbox.

## RUSH_ALLOW_UNSUPPORTED_NODEJS

If this variable is set to `1`, Rush will not fail the build when running a version
of Node that does not match the criteria specified in the `nodeSupportedVersionRange`
field from **rush.json**.

## RUSH_ALLOW_WARNINGS_IN_SUCCESSFUL_BUILD

Setting this environment variable overrides the value of `allowWarningsInSuccessfulBuild`
in the **command-line.json** configuration file. Specify `1` to allow warnings in a successful build,
or `0` to disallow them. (See the comments in the
[command-line.json](../configs/command-line_json.md)
file for more information).

## RUSH_BUILD_CACHE_CREDENTIAL

This environment variable is used by the
[build cache](../maintainer/build_cache.md)
feature.

Provides a credential for accessing the remote build cache, if configured. This credential overrides
any cached credentials.

Setting this environment variable overrides whatever credential has been saved in the
local cloud cache credentials using `rush update-cloud-credentials`.

If Azure Blob Storage is used to store cache entries, this must be a SAS token serialized as query parameters.
See [this article](https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview) for details
about SAS tokens.

## RUSH_BUILD_CACHE_ENABLED

This environment variable is used by the
[build cache](../maintainer/build_cache.md)
feature.

Setting this environment variable overrides the value of `buildCacheEnabled` in the
[build-cache.json](../configs/build-cache_json.md)
configuration file. Specify `1` to enable the build cache or `0` to disable it.

If set to `0`, this is equivalent to passing the `--disable-build-cache` flag.

If there is no build cache configured, then this environment variable is ignored.

## RUSH_BUILD_CACHE_WRITE_ALLOWED

This environment variable is used by the
[build cache](../maintainer/build_cache.md)
feature.

Overrides the value of `isCacheWriteAllowed` in the `build-cache.json` configuration file. The value of this
environment variable must be `1` (for true) or `0` (for false). If there is no build cache configured, then
this environment variable is ignored.

## RUSH_COBUILD_CONTEXT_ID (EXPERIMENTAL)

Cobuild pipelines must define this environment variable; without it, Rush will perform a regular build without
any cobuild logic. See the [Cobuilds](../maintainer/cobuilds.md) documentation for details.

## RUSH_COBUILD_LEAF_PROJECT_LOG_ONLY_ALLOWED (EXPERIMENTAL)

This is useful when you are using the cobuild feature but the Rush build cache is not able for
"leaf" projects in the dependency graph. (For example, common libraries have build cache enabled,
but the apps the consume these libraries do now.) Normally, because we can't obtain such projects
from the cache, all cobuild machines are forced to build that project. This is inefficient if our
goal is to validate whether the project builds successfully, not to deploy it.

Setting `RUSH_COBUILD_LEAF_PROJECT_LOG_ONLY_ALLOWED` to `1` will cause Rush to use a special
"log files only" caching for leaf projects with build cache disabled. The log files are cached
and will be displayed on other cobuild machines, but the project contents are cached or restored.
See the [Cobuilds](../maintainer/cobuilds.md) documentation for details.

## RUSH_COBUILD_RUNNER_ID (EXPERIMENTAL)

This environment variable to uniquely identifies each cobuild machine. If this variable is not defined,
Rush will generate a random identifier on each run.
See the [Cobuilds](../maintainer/cobuilds.md) documentation for details.

## RUSH_DEPLOY_TARGET_FOLDER

This environment variable can be used to specify the `--target-folder` parameter
for the [rush deploy](../commands/rush_deploy.md) command.

## RUSH_GIT_BINARY_PATH

Explicitly specifies the path for the Git binary that is invoked by certain Rush operations.

## RUSH_TAR_BINARY_PATH

Explicitly specifies the path for the `tar` binary that is invoked by certain Rush operations.

## RUSH_GLOBAL_FOLDER

Overrides the location of the `~/.rush` global folder where Rush stores temporary files.

Most of the temporary files created by Rush are stored separately for each monorepo working folder,
to avoid issues of concurrency and compatibility between tool versions. However, a small set
of files (e.g. installations of the `@microsoft/rush-lib` engine and the package manager) are stored
in a global folder to speed up installations. The default location is `~/.rush` on POSIX-like
operating systems or `C:\Users\YourName` on Windows.

Use `RUSH_GLOBAL_FOLDER` to specify a different folder path. This is useful for example if a Windows
group policy forbids executing scripts installed in a user's home directory.

(POSIX is a registered trademark of the Institute of Electrical and Electronic Engineers, Inc.)

## RUSH_INVOKED_ARGS

When running a hook script, this environment variable communicates the original arguments
passed to the `rush` or `rushx` command.

Unlike `RUSH_INVOKED_FOLDER`, the `RUSH_INVOKED_ARGS` variable is only available for hook scripts.
Other lifecycle scripts should not make assumptions about Rush's command line syntax
if Rush did not explicitly pass along command-line parameters to their process.

## RUSH_INVOKED_FOLDER

When Rush executes shell scripts, it sometimes changes the working directory to be a project folder or
the repository root folder. The original working directory (where the Rush command was invoked) is assigned
to the the child process's `RUSH_INVOKED_FOLDER` environment variable, in case it is needed by the script.

The `RUSH_INVOKED_FOLDER` variable is the same idea as the `INIT_CWD` variable that package managers
assign when they execute lifecycle scripts.

## RUSH_PARALLELISM

Specifies the maximum number of concurrent processes to launch during a build.
For more information, see the command-line help for the `--parallelism` parameter for
[rush build](../commands/rush_build.md).

## RUSH_PNPM_STORE_PATH

When using PNPM as the package manager, this variable can be used to configure the path that
PNPM will use as the store directory.

If a relative path is used, then the store path will be resolved relative to the process's
current working directory. An absolute path is recommended.

## RUSH_PREVIEW_VERSION

This variable overrides the version of Rush that will be installed by
the version selector. The default value is determined by the `rushVersion`
field from **rush.json**.

For example, if you want to try out a different release of Rush before upgrading your repo, you can assign
the variable like this:

```bash
# This is Bash's syntax; for Windows shell, change "export" to be "set"
export RUSH_PREVIEW_VERSION=5.0.0-dev.25

rush install
```

## RUSH_TEMP_FOLDER

This variable overrides the temporary folder used by Rush.
The default value is **common/temp** under the repository root.

This environment variable is not compatible with workspace installs (`useWorkspaces` = true).
If attempting to move the PNPM store path, see the `RUSH_PNPM_STORE_PATH` environment variable.

## RUSH_VARIANT

This variable selects a specific installation variant for Rush to use when installing
and linking package dependencies.

For more information about this feature, see
[Installation Variants](../advanced/installation_variants.md).

## RUSH_PNPM_VERIFY_STORE_INTEGRITY

When using PNPM as the package manager, this variable can be used to control whether or not PNPM
validates the integrity of the PNPM store during installation. The value of this environment variable must be
`1` (for true) or `0` (for false). If not specified, defaults to the value in **.npmrc**.
