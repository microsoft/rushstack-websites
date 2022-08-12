---
title: Installation variants
---

Sometimes you may want to build your entire monorepo using a modified set of dependencies. For example,
suppose you just finished upgrading to a major new release of a framework, but you intend to maintain compatibility
with the previous release during a transition period. Your developers should use the new variant for their everyday
work, but for PR builds, you want your CI job to build the entire repo twice -- once with the old variant,
and once with the new variant.

It seems like you could solve this by writing a simple script to search+replace the versions in your
**package.json** files, but you'll quickly encounter other files that are affected:

- **shrinkwrap file**: builds won't be deterministic unless you maintain separate shrinkwrap files for
  the two variants
- **common-versions.json**: the `preferredVersions` or `allowedAlternativeVersions` may need to be different
  for the two variants
- **pnpmfile.js**: if you have workarounds for poorly behaved legacy packages, they may need to be different
  for the two variants

This problem seems to requires a separate, parallel set of configuration files. Starting with Rush 5.4.0,
there's now an out-of-box solution for this problem.

## Setting up a variant

Suppose "**widget-sdk**" is a hypothetical library that just shipped a major new release 3, and we've upgraded to
version 3, but we want to maintain compatibility with version 2. We can indicate this using a loose SemVer
range our **package.json** file:

**libraries/my-controls/package.json**

```json
{
  "name": "my-controls",
  "version": "1.0.0",
  "description": "An example library project",
  "license": "MIT",
  "main": "lib/index.js",
  "typings": "lib/index.d.ts",
  "scripts": {
    "build": "node_modules/.bin/my-build"
  },
  "dependencies": {
    "widget-sdk": "^2.3.4 || ^3.0.2"
  },
  "devDependencies": {
    "my-toolchain": "^1.0.0",
    "typescript": "^3.0.3"
  }
}
```

The `"^2.3.4 || ^3.0.2"` range indicates that our library will accept **widget-sdk** version 2.x (but not older
than 2.3.4) or version 3.x (but not older than 3.0.2). When you run `rush update`, you will normally get the latest
compatible version. How to build and test with the older version 2? Let's set up a variant!

**1<!-- -->. Define your variant.** In the rush.json config file, we add a definition like this:

**\*rush.json** excerpt\*

```js
  "variants": [
    // {
    //   /**
    //    * The folder name for this variant.
    //    */
    //   "variantName": "example-variant",
    //
    //   /**
    //    * An informative description
    //    */
    //   "description": "Build this repo using the previous release of the SDK"
    // }

    {
      "variantName": "old-widget-sdk",
      "description": "Build this repo using version 2 of the widget-sdk"
    }
  ],
```

**2<!-- -->. Copy the config files.** To get your variant started, copy your existing config files from **common/config/rush**
to your variant folder **common/config/rush/variants/old-widget-sdk**. Three config files are currently supported
(others may be added in the future):

- **shrinkwrap.yaml**, **npm-shrinkwrap.json**, or **yarn.lock** depending on your package manager
- **common-versions.json**
- **pnpmfile.js** if you are using PNPM as your package manager

Be sure to add the copied files to Git:

```shell
$ git add .
$ git commit -m "Creating a new variant"
```

**3<!-- -->. Override the dependency versions for the variant.** For this example, we will downgrade
**widget-sdk** to use version 2.x. This can be done by using Rush's
[preferred versions](../../advanced/preferred_versions) feature.
We'll use a wildcard so that `rush update --full` still picks up minor/patch releases:

**\*common-versions.json** excerpt\*

```js
  /**
   * A table that specifies a "preferred version" for a dependency package. The "preferred version"
   * is typically used to hold an indirect dependency back to a specific version, however generally
   * it can be any SemVer range specifier (e.g. "~1.2.3"), and it will narrow any (compatible)
   * SemVer range specifier.  See the Rush documentation for details about this feature.
   */
  "preferredVersions": {

    /**
     * When someone asks for "^1.0.0" make sure they get "1.2.3" when working in this repo,
     * instead of the latest version.
     */
    // "some-library": "1.2.3"

    "widget-sdk": "^2.3.9"
  },
```

Note that `^2.3.9` satisfies the SemVer range `^2.3.4 || ^3.0.2` that we specified in **package.json** above.
(If this was not true, then the preferred version would not have any effect!)

**4<!-- -->. Install your variant and test it.** Let's start by running `rush update` to install the new set of
dependency versions:

```shell
$ rush update --full --variant old-widget-sdk
```

This will update the file **common/config/rush/old-widget-sdk/shrinkwrap.yaml**, install those dependencies
in **common/temp/node_modules**, and link each project to use those dependencies. The `rush install` command also
supports the `--variant` option. Your CI job can use this when it builds with the old **widget-sdk** release.

Now you can build and test your variant:

```shell
$ rush rebuild
```

⏵ If you get tired of typing `--variant`, you can also use the
[RUSH_VARIANT](../../configs/environment_vars)
environment variable to specify the variant name.

**5<!-- -->. Restoring the original state.** When you're done testing your variant, you can return to the original
state by running `rush install` without the `--variant` option. We call this the "**default variant**", because
it's the same default behavior as a repo that didn't define any variants:

```shell
# Restore the original state by omitting "--variant":
$ rush install
```

> **Tip:** If you forget which variant is active, you can look in the **common/temp/current-variant.json** file.
> If you open this file in a text editor, you should see a line like this:
>
> ```
> {
>  "variant": "old-widget-sdk"
> }
> ```
