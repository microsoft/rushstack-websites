---
title: Using rig packages
---

In a large scale environment, it's beneficial for many projects to be built using the exact same Heft configuration.
There may be some minor differences -- for example, a Node.js project may emit CommonJS modules, whereas a web application
project may need to emit ESNext modules. But generally a small handful of common "profiles" will cover most projects.
The [@rushstack/rig-package](https://www.npmjs.com/package/@rushstack/rig-package) system provides a formalized
mechanism for moving common settings into an NPM package which gets added to the `"devDependencies"` for the projects
that consume it. This is called a **rig package**. Note that several different **rig profiles** may come from the
same NPM package; each profile is a folder containing a set of config files.

## Some concrete examples

Heft also provides two standard rig packages that you can use in your projects:

- [@rushstack/heft-node-rig](https://github.com/microsoft/rushstack/tree/main/rigs/heft-node-rig) with a profile called `default`
- [@rushstack/heft-web-rig](https://github.com/microsoft/rushstack/tree/main/rigs/heft-web-rig) with profiles `app` and `library`

It's also easy to define your own custom rig packages by following these examples.

The [heft-node-rig-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-rig-tutorial)
sample project illustrates how to consume `@rushstack/heft-node-rig`.

## Principles of rigging

The [@rushstack/rig-package](https://www.npmjs.com/package/@rushstack/rig-package) defines the "rigging" concept
but only provides an API for resolving file paths based on a **rig.json** config file. Retrofitting rigging
onto existing tools requires extra logic beyond this API, and different implementations may be needed for different
tools. Heft has already implemented such logic for its official plugins, but if you have projects that use some
other toolchain besides Heft, you make them riggable by copying the same approaches as Heft.

Rigging involves three distinct features:

### 1. Base files for `"extends"`

Many config files provide a facility for inheriting shared settings from another file,
which is an easy way to reuse configuration from a rig. For example, in our sample project,
the TypeScript configuration is reduced to just a few lines:

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

- **.eslintrc.js** for the [lint task](../plugins/lint.md), provided that you use the [@rushstack/eslint-patch](https://www.npmjs.com/package/@rushstack/eslint-patch) workaround or the [@rushstack/eslint-config](https://www.npmjs.com/package/@rushstack/eslint-config) ruleset (which includes the patch)
- **config/api-extractor.json** for the [api-extractor task](../plugins/api-extractor.md)
- **config/jest.config.json** for the [jest task](../plugins/jest.md); Jest conventionally uses the `"preset"` field for inheritance however it has some problems, so Heft replaces Jest's config loader with `@rushstack/heft-config-file` engine, and then we use `"extends"` instead of `"preset"`. In all other respects, this file has the standard Jest format.
- **tsconfig.json** for the [typescript task](../plugins/typescript.md)
- **webpack.config.js** does not explicitly support inheritance, but being a JavaScript module, it can call `require()` to load shared settings.

### 2. Riggable config files

Although `"extends"` makes files smaller, it cannot eliminate them entirely. The **rig.json** file
can completely eliminate most Heft config files. We say that such files are "riggable" config files.
Here's an example from the `heft-node-rig-tutorial` project:

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

We cannot eliminate **tsconfig.json** entirely because tools such as VS Code expect to find this file in
the root of your project folder. This is true of a few other files such as **.eslintrc.js**. On this website,
the documentation for each config file specifies whether it is riggable or not.

### 3. Riggable dependencies

A rig package can also provide NPM dependencies, to avoid having to specify them as `"devDependencies"` for
your project. The following tool packages can be provided by the rig (provided they aren't required as
`peerDependencies` of some other project dependency):

- `@microsoft/api-extractor`
- `eslint`
- `jest` and related packages
- `tslint`
- `typescript`
- `webpack` and its loaders and plugins

Providing dependencies via a rig is optional. Your local project's `devDependencies` take precedence over the rig.

Heft resolves each riggable tool independently, using the following procedure:

1. If the tool package is listed in the `devDependencies` for the local project, then the tool is resolved from
   the current project folder. (This step does NOT consider `dependencies` or `peerDependencies`.)

2. OTHERWISE, if the current project has a **rig.json** file, and if the rig's **package.json** lists the tool in its
   `dependencies`, then the tool is resolved from the rig package folder. (This step does NOT consider
   `devDependencies` or `peerDependencies`.)

3. OTHERWISE, the tool is resolved from the current project folder. If it can't be found there, then an error
   is reported.

## See also

- [@rushstack/rig-package](https://www.npmjs.com/package/@rushstack/rig-package) documentation provides the complete specification for the **rig.json** system
- [heft-node-rig-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-rig-tutorial) sample project
