---
title: experiments.json
---

This is the template that [rush init](../../commands/rush_init)
generates for **experiments.json**:

**common/config/rush/experiments.json**

```js
/**
 * This configuration file allows repo maintainers to enable and disable experimental
 * Rush features.  More documentation is available on the Rush website: https://rushjs.io
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/experiments.schema.json",

  /**
   * Rush 5.14.0 improved incremental builds to ignore spurious changes in the pnpm-lock.json file.
   * This optimization is enabled by default. If you encounter a problem where "rush build" is neglecting
   * to build some projects, please open a GitHub issue. As a workaround you can uncomment this line
   * to temporarily restore the old behavior where everything must be rebuilt whenever pnpm-lock.json
   * is modified.
   */
  /*[LINE "HYPOTHETICAL"]*/ "legacyIncrementalBuildDependencyDetection": true,

  /**
   * By default, 'rush install' passes --no-prefer-frozen-lockfile to 'pnpm install'.
   * Set this option to true to pass '--frozen-lockfile' instead for faster installs.
   */
  /*[LINE "HYPOTHETICAL"]*/ "usePnpmFrozenLockfileForRushInstall": true,

  /**
   * By default, 'rush update' passes --no-prefer-frozen-lockfile to 'pnpm install'.
   * Set this option to true to pass '--prefer-frozen-lockfile' instead to minimize shrinkwrap changes.
   */
  /*[LINE "HYPOTHETICAL"]*/ "usePnpmPreferFrozenLockfileForRushUpdate": true,

  /**
   * If using the 'preventManualShrinkwrapChanges' option, restricts the hash to only include the layout of external dependencies.
   * Used to allow links between workspace projects or the addition/removal of references to existing dependency versions to not
   * cause hash changes.
   */
  /*[LINE "HYPOTHETICAL"]*/ "omitImportersFromPreventManualShrinkwrapChanges": true,

  /**
   * If true, the chmod field in temporary project tar headers will not be normalized.
   * This normalization can help ensure consistent tarball integrity across platforms.
   */
  /*[LINE "HYPOTHETICAL"]*/ "noChmodFieldInTarHeaderNormalization": true
}
```
