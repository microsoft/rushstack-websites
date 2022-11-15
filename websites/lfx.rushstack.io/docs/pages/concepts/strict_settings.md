---
title: Strict settings
---

Many lockfile problems can be avoided by enabling various "strict" settings for
Rush and PNPM. These settings activate additional validation checks and disable
some "magic" features that try to hide problems caused by an incorrect lockfile.

These strict settings are disabled by default, because it can take some effort
to get them enabled in a preexisting mononrepo. Once enabled, engineers may encounter
versioning errors more frequently in their day to day work, but these errors are generally
less costly to manage than the much deeper problems that can arise in a monorepo
with inherent version conflicts, whose engineers learned about versioning by studying
an environment that is fundamentally broken.

## strictPeerDependencies

**Difficulty Level: Easy**

It can take some work to get `strictPeerDependencies` initially enabled in a legacy monorepo;
however, once your lockfile is in a clean state, it's relatively easy to fix any future errors
that arise.

[common/config/rush/pnpm-config.json](@rushjs/pages/configs/pnpm-config_json/)

```js
  . . .
  /**
   * If true, then Rush will add the `--strict-peer-dependencies` command-line parameter when
   * invoking PNPM.  This causes `rush update` to fail if there are unsatisfied peer dependencies,
   * which is an invalid state that can cause build failures or incompatible dependency versions.
   * (For historical reasons, JavaScript package managers generally do not treat this invalid
   * state as an error.)
   *
   * PNPM documentation: https://pnpm.io/npmrc#strict-peer-dependencies
   *
   * The default value is false to avoid legacy compatibility issues.
   * It is strongly recommended to set `strictPeerDependencies=true`.
   */
  "strictPeerDependencies": true,
  . . .
```

## ensureConsistentVersions

**Difficulty Level: Medium**

It can take some work to get `ensureConsistentVersions` enabled in a legacy monorepo, however once
your versions are consistent, it's relatively easy to fix any future errors that arise. For any difficult
cases, you can simply exempt the affected package using `allowedAlternativeVersions`.

[rush.json](https://rushjs.io/pages/configs/rush_json/)

```js
/**
 * If you would like the version specifiers for your dependencies to be consistent, then
 * uncomment this line. This is effectively similar to running "rush check" before any
 * of the following commands:
 *
 *   rush install, rush update, rush link, rush version, rush publish
 *
 * In some cases you may want this turned on, but need to allow certain packages to use a different
 * version. In those cases, you will need to add an entry to the "allowedAlternativeVersions"
 * section of the common-versions.json.
 */
// "ensureConsistentVersions": true,
```

## Disable PNPM hoisting

**Difficulty level: Advanced**

This setting is somewhat challenging in a large monorepo, because many hoisted dependencies
may require fixups. We were able to successfully enable this setting in the
[microsoft/rushstack](https://github.com/microsoft/rushstack/)
monorepo where Lockfile Explorer is developed. For some thoughts about a more gradual
migration path, see
[Design Proposal #3635](https://github.com/microsoft/rushstack/issues/3635).

[common/config/rush/.npmrc](@rushjs/pages/configs/npmrc/)

```bash
# Disable hoisted phantom dependencies in this repository.  PNPM has two separate
# settings for hoisting, but they have equivalent effects because Rush monorepo
# relocates the workspace root to the "common/temp" path.

# 1. Don't hoist under common/temp/node_modules/
public-hoist-pattern=

# 2. Don't hoist under common/temp/node_modules/.pnpm/node_modules/
hoist=false
hoist-pattern=
```

> NOTE: In the future, we plan to replace these `.npmrc` settings
> with an official Rush setting with JSON schema validation and
> a more intuitive interface. See
> [GitHub Issue #3542](https://github.com/microsoft/rushstack/issues/3542)
> for discussion.

## preventManualShrinkwrapChanges

**Difficulty Level: Easy**

To reduce the likelihood of merge conflicts, we recommend waiting to enable this setting
until you start encountering problems caused by people manually tampering with the lockfile.

[common/config/rush/pnpm-config.json](@rushjs/pages/configs/pnpm-config_json/)

```js
  . . .
 /**
   * If true, then `rush install` will report an error if manual modifications
   * were made to the PNPM shrinkwrap file without running `rush update` afterwards.
   *
   * This feature protects against accidental inconsistencies that may be introduced
   * if the PNPM shrinkwrap file (`pnpm-lock.yaml`) is manually edited.  When this
   * feature is enabled, `rush update` will append a hash to the file as a YAML comment,
   * and then `rush update` and `rush install` will validate the hash.  Note that this
   * does not prohibit manual modifications, but merely requires `rush update` be run
   * afterwards, ensuring that PNPM can report or repair any potential inconsistencies.
   *
   * To temporarily disable this validation when invoking `rush install`, use the
   * `--bypass-policy` command-line parameter.
   *
   * The default value is false.
   */
  "preventManualShrinkwrapChanges": true,
  . . .
```

## Settings hardwired by Rush

If you're using the Rush build orchestrator, these settings are always automatically enabled:

- [--link-workspace-packages=false](https://pnpm.io/npmrc#link-workspace-packages)
- [--prefer-frozen-lockfile=false](https://pnpm.io/npmrc#prefer-frozen-lockfile)
- [ignoreCompatibilityDb=true](https://pnpm.io/npmrc#ignore-compatibility-db)

## Settings to avoid

It's strongly recommended NOT to enable these settings:

- [shamefully-hoist=true](https://pnpm.io/npmrc#shamefully-hoist)
- [auto-install-peers=true](https://pnpm.io/npmrc#auto-install-peers)
- [shared-workspace-lockfile=false](https://pnpm.io/npmrc#shared-workspace-lockfile)
