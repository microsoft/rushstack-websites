---
title: Enabling the build cache
---

Rush has always supported an [incremental build](../advanced/incremental_builds.md) analyzer that
enables `rush build` to skip projects whose input files have not changed since the last build.
It can also be used with custom commands by enabling the `incremental` flag in **custom-commands.json**.
We call this the **"output preservation"** strategy for incremental builds. Because the build output
is not saved anywhere, a full rebuild is generally still required when checking out a different branch.

Rush's **build cache** improves on this by creating a tar archive of each project's build outputs.
The archive is cached so that later, if `rush build` can find a match in the cache, it can extract the archive
instead of building that project. This can provide dramatic speedups, for example reducing a 30 minute build time
to 30 seconds. We call this the **"cache restoration"** strategy for incremental builds.

The build cache archives are stored in two places:

- **In a cache folder on your local disk.** This way you can switch between different branches without
  losing your incremental build state. You can even configure a centralized folder to be shared between
  multiple enlistments on your machine. The default location is **common/temp/build-cache**.

- **In a cloud-hosted storage container. (Optional)** In a typical setup, the CI system would be configured to write
  to cloud storage, and individual users are granted read-only access. For example, each time a PR is merged into
  the `main` branch, the CI system builds that baseline and uploads it to cloud storage. Even for a user who
  is doing `git clone` for the first time, their `rush build` will be very fast.

## Enabling the local disk cache

The build cache feature is enabled using the [build-cache.json](../configs/build-cache_json.md)
config file. You can copy the template from the website or use `rush init` to create this file.

To enable the basic local disk cache, add these two settings:

**common/config/rush/build-cache.json**

```js
{
  . . .
  /**
   * (Required) EXPERIMENTAL - Set this to true to enable the build cache feature.
   *
   * See https://rushjs.io/pages/maintainer/build_cache/ for details about this experimental feature.
   */
  "buildCacheEnabled": true,

  /**
   * (Required) Choose where project build outputs will be cached.
   *
   * Possible values: "local-only", "azure-blob-storage", "amazon-s3"
   */
  "cacheProvider": "local-only",

  . . .
}
```

> **Upgrade note:** Early releases of this feature were enabled using the `"buildCache": true` setting
> in **experiments.json**. This has been superseded by `"buildCacheEnabled"` in **build-cache.json**.

## Configuring project output folders

With only this change, if you run `rush rebuild --verbose`, you will see this warning:

```
Project does not have a rush-project.json configuration file, or one provided by a rig,
so it does not support caching.
```

The build cache needs to know which folders should be stored in the tar archive. Those details vary between
toolchains, and are thus configured separately for each project using the
[rush-project.json](../configs/rush-project_json.md) config file.

For example:

**&lt;your-project&gt;/config/rush-project.json**

```js
{
  . . .

  /**
   * Specify the folders where your toolchain writes its output files.  If enabled, the Rush build cache will
   * restore these folders from the cache.
   *
   * The strings are folder names under the project root folder.  These folders should not be tracked by Git.
   * They must not contain symlinks.
   */
  "projectOutputFolderNames": ["lib", "dist"]
  . . .
}
```

## Configuring project inputs

By default, the following inputs are incorporated into Rush's cache key. In other words, if any of these things
changes, then the project must be rebuilt:

- the hash of the source files that are under the project's folder, ignoring any files excluded by `.gitignore`
- the hashes of source files under other workspace projects that are dependencies of the project <br/>
  (applies to **cache restoration** strategy but not **output preservation** strategy)

- the versions of all external NPM packages that your project depends on, including indirect dependencies
- the Rush command-line parameters used to perform the operation

These details can be customized using the [rush-project.json](../configs/rush-project_json.md) config file.
For example, you can include/exclude certain glob patterns, or specify environment variables that affect the
build output. It's recommended to use a [rig package](https://heft.rushstack.io/pages/intro/rig_packages/) to avoid
having to copy **rush-project.json** into every project folder.

> **Important:** Configure these settings carefully. If a project inputs/outputs are not accurately specified,
> then the build cache may produce incorrect or inconsistent results. For example, the restored output may
> be missing some files. Or it may be different from what would be produced by a full rebuild. Such problems
> can be difficult to reproduce and troubleshoot.
>
> If you suspect that the Rush build cache may be misconfigured, try the
> [rush-audit-cache-plugin](https://www.npmjs.com/package/rush-audit-cache-plugin).
> It monitors file writes during the build to identify inputs that are not part of your cache key.

## Testing the build cache

Now you should see projects being cached as shown in this sample log output:

```bash
rush build --verbose
```

```
. . .

==[ example-project ]==============================================[ 1 of 5 ]==

This project was not found in the build cache.

Invoking: heft test --clean

. . .

Caching build output folders: lib

Successfully set cache entry.

"example-project" completed successfully in 11.27 seconds.
```

When we run the same command a second time, Rush extracts the archive instead of invoking the build task:

```bash
rush build --verbose
```

```
. . .

==[ example-project ]==============================================[ 1 of 5 ]==

Build cache hit.

Clearing cached folders: lib, dist

Successfully restored output from the build cache.

example-project was restored from the build cache.
```

Note that `rush rebuild` will not read from cache, only `rush build` does. To disable writing from cache during `rush rebuild`,
set the [`RUSH_BUILD_CACHE_WRITE_ALLOWED`](../configs/environment_vars.md) environment variable to `0`.

By default, the cached tar archives are stored under your **common/temp/build-cache** folder
(and thus will be cleaned by `rush purge`). It is safe to delete these files.

## Enabling cloud storage

Currently the `cacheProvider` setting provides three choices:

- `"local-only"`: no cloud storage; archives are only kept on a local disk folder
- `"azure-blob-storage"`: Microsoft Azure [blob storage container](https://docs.microsoft.com/en-us/azure/storage/blobs/)
- `"amazon-s3"`: Amazon [S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingBucket.html)

(The above providers are [modeled as Rush plugins](https://github.com/microsoft/rushstack/tree/main/rush-plugins).
Custom build cache storage providers can be implemented in the same way.)

As one example, here's how to configure an Azure blob container:

**common/config/rush/build-cache.json**

```js
{
  . . .
  /**
   * (Required) EXPERIMENTAL - Set this to true to enable the build cache feature.
   *
   * See https://rushjs.io/pages/maintainer/build_cache/ for details about this experimental feature.
   */
  "buildCacheEnabled": true,

  /**
   * (Required) Choose where project build outputs will be cached.
   *
   * Possible values: "local-only", "azure-blob-storage", "amazon-s3"
   */
  "cacheProvider": "azure-blob-storage",

  /**
   * Use this configuration with "cacheProvider"="azure-blob-storage"
   */
  "azureBlobStorageConfiguration": {
    /**
     * (Required) The name of the the Azure storage account to use for build cache.
     */
    "storageAccountName": "example",

    /**
     * The name of the container in the Azure storage account to use for build cache.
     */
    "storageContainerName": "my-container"

    /**
     * If set to true, allow writing to the cache. Defaults to false.
     */
    "isCacheWriteAllowed": false

  . . .
```

Note that we have set `"isCacheWriteAllowed": false` to prevent regular users from writing to the container.
(Later, we will use an environment variable to override this for our CI job.)

## User authentication

If security is not a priority for your repo, you can simplify user setup by configuring your storage container
to allow unauthenticated anonymous access. The container is accessed via an HTTPS URL containing randomized
hashes which are difficult to guess without access to your Git repo. This provides rudimentary
[security through obscurity](https://en.wikipedia.org/wiki/Security_through_obscurity).

A more security-conscious organization however will prefer to require authentication even for read-only access.
Rush provides a [rush update-cloud-credentials](../commands/rush_update-cloud-credentials.md)
command to make this easy for users to set up:

```bash
rush update-cloud-credentials --interactive
```

```
Rush Multi-Project Build Tool 5.45.6 (unmanaged) - https://rushjs.io
Node.js version is 12.20.1 (LTS)


Starting "rush update-cloud-credentials"

 ╔═════════════════════════════════════════════════════════════════════════╗
 ║             To sign in, use a web browser to open the page              ║
 ║     https://microsoft.com/devicelogin and enter the code XAYBQEGRK      ║
 ║                            to authenticate.                             ║
 ╚═════════════════════════════════════════════════════════════════════════╝
```

The credentials are stored in the user's home directory under `~/.rush-user/credentials.json`.

## CI setup

In a typical configuration, users have read-only access and the cache is populated by an automation account;
for example, a CI job that builds your `main` branch after each PR is merged. In our example above, the
`"isCacheWriteAllowed": false` setting is what prevents users from writing to the cache. The CI job can
override this by setting the [RUSH_BUILD_CACHE_WRITE_ALLOWED](../configs/environment_vars.md)
environment variable, and by providing credentials for the CI environment in the
[RUSH_BUILD_CACHE_CREDENTIAL](../configs/environment_vars.md) environment variable.

### Credentials

#### Azure Storage

For Azure Blob Storage, `RUSH_BUILD_CACHE_CREDENTIAL` must be a SAS token serialized as query parameters.
See [this article](https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview) for details
about SAS tokens. You can obtain a SAS token via the [Settings > Access keys](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage?tabs=azure-portal)
page for your storage account.

#### AWS

For Amazon S3, `RUSH_BUILD_CACHE_CREDENTIAL` will be your AWS Access Key ID and AWS Secret Access Key separated by a colon,
such as: `<AccessKeyID>:<SecretAccessKey>`. You can also pass temporary session tokens required when assuming an IAM role: `<AccessKeyID>:<SecretAccessKey>:<SessionToken>`.

If `RUSH_BUILD_CACHE_CREDENTIAL` is not set, the build cache will attempt to read the environment vars `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SESSION_TOKEN` that
are commonly set via the AWS CLI or other CI tooling. However, `RUSH_BUILD_CACHE_CREDENTIAL` will always take precedence if it exists.

> The build cache feature is still under development. Feedback is welcome!
>
> Some relevant GitHub issues to follow:
>
> - [Build cache feature #2393](https://github.com/microsoft/rushstack/issues/2393) - the original feature spec
> - [Build Cache: split apart RUSH_BUILD_CACHE_WRITE_CREDENTIAL #2642](https://github.com/microsoft/rushstack/issues/2642)
> - [Allow project config to specify non-build-related files #2618](https://github.com/microsoft/rushstack/issues/2618)
> - ["tar" exited with code 1 while attempting to create the cache entry #2622](https://github.com/microsoft/rushstack/issues/2622)
