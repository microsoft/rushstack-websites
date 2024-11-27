---
title: Introduction
---

**Lockfile Lint** is a companion tool for preventing problems from reoccurring, after you've solved them using Lockfile Explorer. Similar to ESLint, it provides a config file **lockfile-lint.json** where you can define rules that check for various issues in your lockfile.

## Quick start

1. Lockfile Lint is included in the same package as Lockfile Explorer. If you didn't do so already, install it like this:

   ```shell
   npm install --global @rushstack/lockfile-explorer
   ```

2. Create the **lockfile-lint.json** config file:

   ```shell
   cd my-rush-repo

   lockfile-lint init
   ```

3. Edit the config file to enable policies that you want to check.

4. Test the policies:

   ```shell
   lockfile-lint check
   ```

   If issues are found, the output might look like this:

   ```
   Rush Lockfile Lint - https://lfx.rushstack.io/

   Checking project "my-toolchain"
   Checking project "my-app"
   Checking project "my-controls"

   PROBLEM: [restrict-versions] The version of "whatwg-fetch" should match "2.x"; actual version is "3.6.2"

   PROBLEM: [restrict-versions] The version of "colors" should match "2.x"; actual version is "1.4.0"
   ```

5. Add `lockfile-lint` to your CI validation pipeline. When the tool reports problems, the process exit code will be nonzero, causing the build to fail.

## Config file

**common/config/lockfile-lint/lockfile-lint.json**

```js
/**
 * Config file for Lockfile Lint.  For more info, please visit: https://lfx.rushstack.io
 */
{
  "$schema": "https://developer.microsoft.com/json-schemas/lockfile-explorer/lockfile-lint.schema.json",

  /**
   * The list of rules to be checked by Lockfile Lint.  For each rule configuration, the
   * type of rule is determined by the `rule` field.
   */
  "rules": [
    // /**
    //  * The `restrict-versions` rule enforces that direct and indirect dependencies must
    //  * satisfy a specified version range.
    //  */
    // {
    //   "rule": "restrict-versions",
    //
    //   /**
    //    * The name of a workspace project to analyze.
    //    */
    //   "project": "@my-company/my-app",
    //
    //   /**
    //    * Indicates the package versions to be checked.  The `requiredVersions` key is
    //    * the name of an NPM package, and the value is a SemVer range.  If the project has
    //    * that NPM package as a dependency, then its version must satisfy the SemVer range.
    //    * This check also applies to devDependencies and peerDependencies, as well as any
    //    * indirect dependencies of the project.
    //    */
    //   "requiredVersions": {
    //     /**
    //      * For example, if `react-router` appears anywhere in the dependency graph of
    //      * `@my-company/my-app`, then it must be version 5 or 6.
    //      */
    //     "react-router": "5.x || 6.x",
    //     "react": "^18.3.0",
    //     "react-dom": "^18.3.0"
    //   }
    // }
  ]
}
```

## See also

- [lockfile-lint init](../cli/lflint-init.md) command
- [lockfile-lint check](../cli/lflint-check.md) command
