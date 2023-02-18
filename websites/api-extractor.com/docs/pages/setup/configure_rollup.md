---
title: Configuring a .d.ts rollup
---

_This article continues the tutorial from the "[Invoking API Extractor]({% link pages/setup/invoking.md %})" page.
It's recommended to start there._

## Simple case

To enable .d.ts rollup generation, you simply need to set `dtsRollup.enabled` to true in your **api-extractor.json**
config file.

By default, the rollup file will be written to `"<projectFolder>/dist/<unscopedPackageName>.d.ts"`,
but you can change this using the `dtsRollup.untrimmedFilePath` setting.

Recall from our earlier example that the original **package.json** file looked like this:

**awesome-widgets/package.json**

```js
{
  "name": "awesome-widgets",
  "version": "1.0.0",
  "main": "./lib/index.js",
  "typings": "./lib/index.d.ts"
}
```

To actually use the rollup, we need to change the `"typings"` field to point to the rollup file, like this:

**awesome-widgets/package.json**

```js
{
  "name": "awesome-widgets",
  "version": "1.0.0",
  "main": "./lib/index.js",
  "typings": "./dist/awesome-widgets.d.ts"
}
```

This directs the TypeScript compiler to look for its typings in the new location.
If you use Webpack to bundle your JavaScript, you might also change `"main"` to point to your
`"./dist/awesome-widgets.js"` bundle, and then you could probably add your entire **lib** folder
to the **.npmignore** file and make your package a lot smaller.

## An important limitation

The .d.ts rollup feature currently assumes that your package has a single entry point (the `mainEntryPointFilePath`
setting). This isn't always the case. Some projects rely on path-based imports, like this:

```ts
import { Button } from 'awesome-widgets/lib/Button';
```

This import statement is fishing around in the **awesome-widgets** folder tree to find a specific file.
In general this is incompatible with a rollup, since any exported declarations will now have two copies:
one in the **lib** folder, and one in the rollup file. The TypeScript compiler generally does not consider
duplicated declarations to be interchangeable, and it can lead to some very confusing error messages.

From an API design standpoint, path-based imports have a downside that the folder layout becomes part of your API
contract: For example, if we want to reorganize **lib/Button** into a **lib/controls/Button** folder, we now
need to worry that this is a breaking change for any consumer who's doing path-based imports. The TSDoc project
has considered this problem, and its **tsdoc-metadata.json** file is planned to eventually declare the officially
supported entry points for a project. Its declaration reference notation already allows import paths.

But today, API Extractor assumes your project has a single entry point. (The API Extractor developers do not
consider path-based imports to be a best practice, so we have eliminated them from all of the hundreds of TypeScript
packages that we work on. Thus, this enhancement is not a top priority for us. If someone from the community wants
to work on it, though, we'd certainly help with that effort.)

Although multiple entry points pose a problem for .d.ts rollups, fortunately you CAN still use the API report file
and documentation features: You would simply create a dummy source file such as **src/api-extractor.ts** that
reexports all your various entry points, and then specify that as your `mainEntryPointFilePath`. This allows
API Extractor to analyze all your declarations as if they came from a single entry point.

## Trimming based on release tags

The .d.ts rollup feature also supports "trimming", i.e. removing unwanted members according to their
[release tag]({% link pages/tsdoc/doc_comment_syntax.md %}#release-tags) (`@alpha`, `@beta`, `@public`, or
`@internal`). Keep in mind that in API Extractor's terminology, "beta" does not refer to the readiness
of an entire release branch. Instead, we're using "beta" to describe the support level for
_individual API members_. Thus, the trimmed version and untrimmed version will typically be compiled from
the exact same source files and the exact same Git branch.

To enable trimming, add these settings to your **api-extractor.json** file:

- `dtsRollup.betaTrimmedFilePath` - Specifies the output path for a .d.ts rollup file to be generated with
  trimming for a "beta" release. This file will include only declarations that are marked as `@public` or `@beta`.

- `dtsRollup.publicTrimmedFilePath` - Specifies the output path for a .d.ts rollup file to be generated with
  trimming for a "public" release. This file will include only declarations that are marked as `@public`.

The build mechanics are left up to you, but typically we recommend for the `"typings"` field in your
**package.json** to continue to point to the untrimmed rollup file. If you work on a collection of related packages,
this allows your packages to continue to have full access to the untrimmed declarations during the build.
For example, an `@internal` function in one package may make calls to an `@internal` function in your other package.
The trimmed files are wired up after the build, prior to `npm publish`.

Continuing the example project from earlier, we could modify our **api-extractor.json** file to contain
a section like this:

**awesome-widgets/config/api-extractor.json**

```js
{
  . . .
  "dtsRollup": {
    "enabled": true,
    "untrimmedFilePath": "<projectFolder>/dist/<unscopedPackageName>.d.ts",
    "betaTrimmedFilePath": "<projectFolder>/dist/<unscopedPackageName>-beta.d.ts",,
    "publicTrimmedFilePath": "<projectFolder>/dist/<unscopedPackageName>-public.d.ts"
  },
}
```

Imagine that we will build and publish three types of releases from the exact same source code:

- **internal release:** Version `1.0.0-dev.0` gets published to our private NPM registry at our company
- **beta release:** Version `1.0.0-plusbeta` gets published to the npmjs.com registry for consumers who want
  to experiment with preview APIs
- **public release:** Version `1.0.0` also gets published to the npmjs.com registry for consumers who
  are writing production code

To publish an internal release, we simply run `npm publish` in the project folder.

To publish a beta release, we would first update the `"typings"` field in **package.json** to point to **awesome-widgets-beta.d.ts**. (Alternatively, we could overwrite the **dist/awesome-widgets.d.ts** with
that file.) Then we run `npm publish`.

To publish a public release, we would first update the `"typings"` field in **package.json** to point to **awesome-widgets-public.d.ts**. (Alternatively, we could overwrite the **dist/awesome-widgets.d.ts** with
that file.) Then we run `npm publish`.

Many other approaches are possible as well. Your build scripts can use these files however you like.
The approach described here the advantage that consumers can easily switch between different release types
based on their version selection, and we've found it works well when you need to publish a set of
closely interrelated NPM packages.

#### Next up: [Generating Docs]({% link pages/setup/generating_docs.md %})
