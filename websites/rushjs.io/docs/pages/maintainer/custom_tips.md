---
title: Custom tips (experimental)
---

Custom Tips allow you to annotate Rush's console messages with advice tailored for your specific monorepo.

Here's an example situation where custom tips can help: Suppose that your company uses a private NPM registry,
which periodically syncs the latest package versions from the upstream `npmjs.com` server. Sometimes users may
try to install a version that was just published, and has not synced yet, in which case `rush update` might
display this error:

```
Progress: resolved 0, reused 1, downloaded 0, added 0
/users/example/code/my-repo/apps/my-app:
 ERR_PNPM_NO_MATCHING_VERSION  No matching version found for example-library@1.2.3

This error happened while installing a direct dependency of my-app

The latest release of example-library is "1.1.0".
```

This error is a bit confusing, since the latest release really is `1.2.3`, whereas the error is referring to
the latest version synced by the private registry. If you maintain a helpline for your monorepo, you may
frequently receive support tickets about this error, which can be avoided by showing a custom tip.

## Configuring a custom tip

The `ERR_PNPM_NO_MATCHING_VERSION` code above is from PNPM. Rush's corresponding tip ID
is `TIP_PNPM_NO_MATCHING_VERSION`. We can define the tip as follows:

(If you don't have this file, you can generate it using `rush init`.)

**common/config/rush/custom-tips.json**

```js
/**
 * This configuration file allows repo maintainers to configure extra details to be
 * printed alongside certain Rush messages.  More documentation is available on the
 * Rush website: https://rushjs.io
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/custom-tips.schema.json",

  /**
   * Specifies the custom tips to be displayed by Rush.
   */
  "customTips": [
    // {
    //   /**
    //    * (REQUIRED) An identifier indicating a message that may be printed by Rush.
    //    * If that message is printed, then this custom tip will be shown.
    //    * Consult the Rush documentation for the current list of possible identifiers.
    //    */
    //   "tipId": "TIP_RUSH_INCONSISTENT_VERSIONS",
    //
    //   /**
    //    * (REQUIRED) The message text to be displayed for this tip.
    //    */
    //   "message": "For additional troubleshooting information, refer this wiki article:\n\nhttps://intranet.contoso.com/docs/pnpm-mismatch"
    // }
    {
      "tipId": "TIP_PNPM_NO_MATCHING_VERSION",
       "message": "This \"no matching version\" error from PNPM often results from a new version that has not been synced yet to our company's internal NPM registry.\n\nFor troubleshooting guidance, consult our team wiki:\n\nhttps://example.com/wiki/npm-syncing"
    }
  ]
}
```

With this change, users will now see the custom message alongside the original error:

```
Progress: resolved 0, reused 1, downloaded 0, added 0
/users/example/code/my-repo/apps/my-app:
 ERR_PNPM_NO_MATCHING_VERSION  No matching version found for example-library@1.2.3

This error happened while installing a direct dependency of my-app

The latest release of example-library is "1.1.0".

| Custom Tip (TIP_PNPM_NO_MATCHING_VERSION)
|
| This "no matching version" error from PNPM often results from a new version that has not been synced
| yet to our company's internal NPM registry.
|
| For troubleshooting guidance,  consult our team wiki:
|
| https://example.com/wiki/npm-syncing
```

Note that Rush prefixes custom tips with a `|` to distinguish them from the official messaging from the Rush software.

## Contributing new tips

Is there a Rush message that you would like to customize, but no `tipId` is available? Implementing new tips is
relatively easy. The code is in
[rush-lib/src/api/CustomTipsConfiguration.ts](https://github.com/microsoft/rushstack/blob/main/libraries/rush-lib/src/api/CustomTipsConfiguration.ts),
so feel free to create a pull request proposing new tips.

## Custom Tip identifiers

<!-- NOTE: Sort them alphabetically! -->

### TIP_PNPM_INVALID_NODE_VERSION

Corresponds to PNPM's [ERR_PNPM_INVALID_NODE_VERSION](https://pnpm.io/errors#err_pnpm_invalid_node_version).

### TIP_PNPM_MISMATCHED_RELEASE_CHANNEL

Corresponds to PNPM's [ERR_PNPM_MISMATCHED_RELEASE_CHANNEL](https://pnpm.io/errors#err_pnpm_mismatched_release_channel).

### TIP_PNPM_NO_MATCHING_VERSION

<!-- Not currently documented on the PNPM website. -->

Corresponds to PNPM's [ERR_PNPM_NO_MATCHING_VERSION](https://pnpm.io/next/errors).

### TIP_PNPM_NO_MATCHING_VERSION_INSIDE_WORKSPACE

Corresponds to PNPM's [ERR_PNPM_NO_MATCHING_VERSION_INSIDE_WORKSPACE](https://pnpm.io/errors#err_pnpm_no_matching_version_inside_workspace).

### TIP_PNPM_OUTDATED_LOCKFILE

Corresponds to PNPM's [ERR_PNPM_OUTDATED_LOCKFILE](https://pnpm.io/errors#err_pnpm_outdated_lockfile).

### TIP_PNPM_PEER_DEP_ISSUES

Corresponds to PNPM's [ERR_PNPM_PEER_DEP_ISSUES](https://pnpm.io/errors#err_pnpm_peer_dep_issues).

### TIP_PNPM_TARBALL_INTEGRITY

Corresponds to PNPM's [ERR_PNPM_TARBALL_INTEGRITY](https://pnpm.io/errors#err_pnpm_tarball_integrity)

### TIP_PNPM_UNEXPECTED_STORE

Corresponds to PNPM's [ERR_PNPM_UNEXPECTED_STORE](https://pnpm.io/errors#err_pnpm_unexpected_store).

### TIP_RUSH_INCONSISTENT_VERSIONS

This message is printed by `rush install` or `rush update` when projects have inconsistent dependency versions,
only if `ensureConsistentVersions` is enabled in **rush.json**.

**Example Rush output:**

```
Found 5 mis-matching dependencies!
```
