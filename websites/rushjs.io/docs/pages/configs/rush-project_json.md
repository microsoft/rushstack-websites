---
title: rush-project.json
---

This is the template for the optional **rush-project.json** config file. This file may be provided
by a [rig package](https://rushstack.io/pages/heft/rig_packages/).

**&lt;your project&gt;/config/rush-project.json**

```js
/**
 * The "config/rush-project.json" file configures Rush-specific settings for an individual project
 * in a Rush monorepo.  More documentation is available on the Rush website: https://rushjs.io
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/rush-project.schema.json",

  /**
   * Optionally specifies another JSON config file that this file extends from. This provides a way for standard
   * settings to be shared across multiple projects.
   *
   * To delete an inherited setting, set it to `null` in this file.
   */
  // "extends": "my-rig/profiles/default/config/rush-project.json",

  /**
   * The incremental analyzer can skip Rush commands for projects whose input files have not changed since
   * the last build.  Normally, every Git-tracked file under the project folder is assumed to be an input.
   * Use "incrementalBuildIgnoredGlobs" to ignore specific files, specified as globs relative to
   * the project folder.  The glob syntax is based on the .gitignore file format.
   */
  "incrementalBuildIgnoredGlobs": [
    // "etc/api-report/*.md"
  ],

  /**
   * Disable caching for this project. The project will never be restored from cache. This may be useful
   * if this project affects state outside of its folder.
   *
   * Default value: false
   */
  // "disableBuildCacheForProject": true,

  /**
   * Options for individual commands and phases.
   */
  "operationSettings": [
    // {
    //   /**
    //    * (Required) The name of the operation.
    //    * This should be a key in the "package.json" file's "scripts" section.
    //    */
    //   "operationName": "build",
    //
    //   /**
    //    * Specify the folders where this operation writes its output files.  If enabled, the Rush build cache
    //    * will restore these folders from the cache.  The strings are folder names under the project root folder.
    //    * These folders should not be tracked by Git.  They must not contain symlinks.
    //    */
    //   "outputFolderNames": [
    //     "lib", "dist"
    //   ],
    //
    //   /**
    //    * Specify a list of glob (minimatch) paths (absolute or relative) pointing to files
    //    * (within or outside the .git repository) that affect the output of this operation.
    //    * If provided, the hash values of these files will become part of the final hash when
    //    * reading and writing from cache.
    //    */
    //   "dependsOnAdditionalFiles": [],
    //
    //   /**
    //    * Specify a list of environment variables that affect the output of this operation.
    //    * If provided, the values of these variables will become part of the hash when reading
    //    * and writing from cache.
    //    */
    //   "dependsOnEnvVars": [ "MY_ENVIRONMENT_VARIABLE" ],
    //
    //   /**
    //    * Disable caching for this operation.  The operation will never be restored from cache.
    //    * This may be useful if this operation affects state outside of its folder.
    //    */
    //   // "disableBuildCacheForOperation": true
    // }
  ]
}
```

## See also

- [Enabling the build cache](../maintainer/build_cache.md)
