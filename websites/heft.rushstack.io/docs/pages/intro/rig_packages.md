---
title: Using rig packages
---

In a large scale environment, it's common for many projects to be built using the exact same Heft configuration.
There may be some differences -- for example, a Node.js project may emit CommonJS modules, whereas a web application
project may need to emit ESNext modules. But generally a small handful of common "profiles" will cover most projects.
We can avoid this duplication by moving common settings into an NPM package which gets added to the `"devDependencies"`
for the projects that consume it. This is called a **rig package**. Note that several different **rig profiles** may
come from the same NPM package; each profile is a folder containing a set of config files.

Heft also provides two standard rig packages that you can use in your projects:

- [@rushstack/heft-node-rig](https://www.npmjs.com/package/@rushstack/heft-node-rig) with a profile called `default`
- [@rushstack/heft-web-rig](https://www.npmjs.com/package/@rushstack/heft-web-rig) with a profile called `library`

It's also easy to define your own custom rig packages.

The [heft-node-rig-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-rig-tutorial)
sample project illustrates how to consume `@rushstack/heft-node-rig`.

Let's look at three different ways that rig packages influence the build.

## 1. Base files for `"extends"`

Many config files provide a facility for inheriting shared settings from another file. For example, in our
sample project, the TypeScript configuration is reduced to just a few lines:

**heft-node-rig-tutorial/tsconfig.json**

```js
{
  "extends": "./node_modules/@rushstack/heft-node-rig/profiles/default/tsconfig-base.json",
  "compilerOptions": {
    "types": ["heft-jest", "node"]
  }
}
```

The bulk of the settings come from `tsconfig-base.json` in the `default` profile. But our local **tsconfig.json**
file can add custom settings such as `"types"` as needed.

The following config files all support a field such as `"extends"` that enables settings to be inherited from another NPM package:

- **.eslintrc.js** for the [eslint task](../tasks/eslint.md), provided that you use the [@rushstack/eslint-patch](https://www.npmjs.com/package/@rushstack/eslint-patch) workaround or the [@rushstack/eslint-config](https://www.npmjs.com/package/@rushstack/eslint-config) ruleset (which includes the patch)
- **config/api-extractor.json** for the [api-extractor task](../tasks/api-extractor.md)
- **config/jest.config.json** for the [jest task](../tasks/jest.md)
- **tsconfig.json** for the [typescript task](../tasks/typescript.md)
- **tslint.json** for the [tslint task](../tasks/tslint.md)
- **webpack.config.js** does not explicitly support inheritance, but being a JavaScript module, it can call `require()` to load shared settings.

## 2. "Riggable" config files

In the above example, we cannot eliminate **tsconfig.json** entirely because tools such as VS Code expect to find
this file in the root of your project folder. This is true of a few other files such as **.eslintrc.js**.
Aside from these special cases, most other Heft config files can be eliminated entirely by creating a **rig.json**
file, as seen in the `heft-node-rig-tutorial` project:

**heft-node-rig-tutorial/config/rig.json**

```js
// The "rig.json" file directs tools to look for their config files in an external package.
// Documentation for this system: https://www.npmjs.com/package/@rushstack/rig-package
{
  "$schema": "https://developer.microsoft.com/json-schemas/rig-package/rig.schema.json",

  /**
   * (Required) The name of the rig package to inherit from.
   * It should be an NPM package name with the "-rig" suffix.
   */
  "rigPackageName": "@rushstack/heft-node-rig"

  /**
   * (Optional) Selects a config profile from the rig package.  The name must consist of
   * lowercase alphanumeric words separated by hyphens, for example "sample-profile".
   * If omitted, then the "default" profile will be used."
   */
  // "rigProfile": "your-profile-name"
}
```

The **rig.json** file tells Heft that if it doesn't find a file in the **heft-node-rig-tutorial/config**, it should
try looking in the **@rushstack/heft-node-rig/profiles/default/common** folder instead.

Examples of "riggable" config files:

- **&lt;project folder&gt;/config/api-extractor-task.json**
- **&lt;project folder&gt;/config/heft.json**
- **&lt;project folder&gt;/config/typescript.json**

## 3. Riggable dependencies

The rig package can also provide NPM dependencies, to avoid having to specify them as `"devDependencies"` for
your project. The following tool packages can be provided by the rig:

- `typescript`
- `@microsoft/api-extractor`
- `eslint`
- `tslint`

Today, only these packages can be provided via a rig. Providing dependencies via a rig is optional. Your local
project's `devDependencies` take precedence over the rig.

Heft resolves each riggable tool independently, using the following procedure:

1. If the tool package is listed in the `devDependencies` for the local project, then the tool is resolved from
   the current project folder. (This step does NOT consider `dependencies` or `peerDependencies`.)

2. OTHERWISE, if the current project has a **rig.json** file, and if the rig's **package.json** lists the tool in its
   `dependencies`, then the tool is resolved from the rig package folder. (This step does NOT consider
   `devDependencies` or `peerDependencies`.)

3. OTHERWISE, the tool is resolved from the current project folder. If it can't be found there, then an error
   is reported.

> **Note:** Prior to version 0.25.0, Heft used a
> [different lookup strategy](https://github.com/microsoft/rushstack/pull/2539)
> that did not rely on **rig.json**. It worked like this: While parsing the **tsconfig.json** file for a project,
> if the `"extends"` field referred to a file from an NPM package, Heft would look to see if that package had
> a direct dependency on the `typescript` package. If so, ALL riggable tools would be resolved from that folder.

Heft itself has a direct dependency on the following packages, so your project does not need to depend on them:

- `webpack` and `webpack-dev-server`
- `jest` and its core dependencies

## See also

- [@rushstack/rig-package](https://www.npmjs.com/package/@rushstack/rig-package) documentation provides the complete specification for the **rig.json** system
- [heft-node-rig-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-rig-tutorial) sample project
