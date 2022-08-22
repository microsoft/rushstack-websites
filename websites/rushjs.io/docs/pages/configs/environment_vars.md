---
title: Environment variables
---

The Rush tool's behavior can be customized using the shell environment variables described below:

## RUSH_ABSOLUTE_SYMLINKS

If this variable is set to `true`, Rush will create symlinks with absolute paths instead
of relative paths. This can be necessary when a repository is moved during a build or
if parts of a repository are moved into a sandbox.

## RUSH_ALLOW_UNSUPPORTED_NODEJS

If this variable is set to `true`, Rush will not fail the build when running a version
of Node that does not match the criteria specified in the `nodeSupportedVersionRange`
field from **rush.json**.

## RUSH_BUILD_CACHE_CREDENTIAL (EXPERIMENTAL)

This environment variable is used by the experimental
[build cache](../../maintainer/build_cache)
feature.

Provides a credential for accessing the remote build cache, if configured. This credential overrides
any cached credentials.

If Azure Blob Storage is used to store cache entries, this must be a SAS token serialized as query parameters.
See [this article](https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview) for details
about SAS tokens.

## RUSH_BUILD_CACHE_ENABLED (EXPERIMENTAL)

This environment variable is used by the experimental
[build cache](../../maintainer/build_cache)
feature.

Overrides the value of `buildCacheEnabled` in the `build-cache.json` configuration file. The value of this
environment variable must be `1` (for true) or `0` (for false). If there is no build cache configured, then
this environment variable is ignored.

## RUSH_BUILD_CACHE_WRITE_ALLOWED (EXPERIMENTAL)

This environment variable is used by the experimental
[build cache](../../maintainer/build_cache)
feature.

Overrides the value of `isCacheWriteAllowed` in the `build-cache.json` configuration file. The value of this
environment variable must be `1` (for true) or `0` (for false). If there is no build cache configured, then
this environment variable is ignored.

## RUSH_DEPLOY_TARGET_FOLDER

This environment variable can be used to specify the `--target-folder` parameter
for the [rush deploy](../../commands/rush_deploy) command.

## RUSH_GIT_BINARY_PATH

Explicitly specifies the path for the Git binary that is invoked by certain Rush operations.

## RUSH_GLOBAL_FOLDER

Overrides the location of the `~/.rush` global folder where Rush stores temporary files.

Most of the temporary files created by Rush are stored separately for each monorepo working folder,
to avoid issues of concurrency and compatibility between tool versions. However, a small set
of files (e.g. installations of the `@microsoft/rush-lib` engine and the package manager) are stored
in a global folder to speed up installations. The default location is `~/.rush` on POSIX-like
operating systems or `C:\Users\YourName` on Windows.
(POSIX is a registered trademark of the Institute of Electrical and Electronic Engineers, Inc.)

Use `RUSH_GLOBAL_FOLDER` to specify a different folder path. This is useful for example if a Windows
group policy forbids executing scripts installed in a user's home directory.

## RUSH_INVOKED_FOLDER

When Rush executes shell scripts, it sometimes changes the working directory to be a project folder or
the repository root folder. The original working directory (where the Rush command was invoked) is assigned
to the the child process's `RUSH_INVOKED_FOLDER` environment variable, in case it is needed by the script.
The `RUSH_INVOKED_FOLDER` variable is the same idea as the `INIT_CWD` variable that package managers
assign when they execute lifecycle scripts.

## RUSH_PARALLELISM

Specifies the maximum number of concurrent processes to launch during a build.
For more information, see the command-line help for the `--parallelism` parameter for
[rush build](../../commands/rush_build).

## RUSH_PNPM_STORE_PATH

When using PNPM as the package manager, this variable can be used to configure the path that
PNPM will use as the store directory.

If a relative path is used, then the store path will be resolved relative to the process's
current working directory. An absolute path is recommended.

## RUSH_PREVIEW_VERSION

This variable overrides the version of Rush that will be installed by
the version selector. The default value is determined by the `rushVersion`
field from rush.json.

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

## RUSH_VARIANT

This variable selects a specific installation variant for Rush to use when installing
and linking package dependencies.

For more information about this feature, see
[Installation Variants](../../advanced/installation_variants).
