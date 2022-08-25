---
title: PNPM Compatibility DB
---

Both Yarn and PNPM support a feature called the **Compatibility DB**, which is a public database of **package.json** fixups. These fixups solve known issues that the official maintainer of an NPM package may be unwilling to solve. (The best practice would be to avoid such packages, but often that is impractical.) Compatibility DB fixups are similar to user-authored rules found in **.pnpmfile.cjs**. They are maintained with the [@yarnpkg/extensions](https://www.npmjs.com/package/@yarnpkg/extensions) package.

PNPM's feature protects small projects from common pitfalls, but the approach has some downsides for a large monorepo:

- Hidden magic: The fixups are bundled into the PNPM binary. When trying to coordinate complex cross-project version dependencies, it is awkward for key inputs to be in a file with no Git diff, not even viewable in the GitHub website.
- Unnecessary coupling: Different versions of the `@yarnpkg/extensions` rules are bundled into different PNPM releases. This may cause churn the lockfile when upgrading or downgrading the package manager.
- Applied last: The fixups are applied after **.pnpmfile.cjs**. This means the fixed up versions aren't visible to the user's own transformations or logging, and **.pnpmfile.cjs** is no longer the final authority about version choices.

To avoid these issues, `rush install` and `rush update` always disable the Compatibility DB feature when invoking PNPM.

Details:

- Compatibility DB is implemented by PNPM versions `>= 6.32.12`, `>= 7.0.1` (but not `7.0.0`)
- The `ignore-compatibility-db` switch is implemented in newer PNPM releases: `>= 6.34.0 <7.0.01` and `>= 7.9.0`
- Compatibility DB is disabled by Rush versions `>= 5.76.0` if possible...
- ..otherwise, if the switch is missing, Rush prints a warning recommending to upgrade PNPM

The Compatibility DB fixes are useful. To apply them in your Rush repo, it's recommended to copy these settings into a proper Git-tracked file such as **.pnpmfile.cjs**.

> 💡 Feature idea: Propose an automated mechanism for syncing `@yarnpkg/extensions` into a Git-tracked file under `common/config/rush`.
