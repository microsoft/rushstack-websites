---
title: Tracing package resolution
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## CommonJS module resolution

If you are using the NPM or PNPM [installation model](./install_models.md) (versus PnP),
the CommonJS `require()` API performs module resolution by traversing physical folders on disk.
This is convenient for troubleshooting, because many problems can be understood simply by inspecting folders
using your shell. The complete algorithm is detailed in
[the Node.js specification](https://nodejs.org/api/modules.html#all-together), but essentially it works
like this (ignoring many details such as folder imports and path mappings):

1. If your import path starts with `.` or `..` or `/` (for example `require('./path/to/file')`),
   then the entire string will be resolved as a regular file/folder path.

2. Otherwise, the first part will be interpreted as an NPM package name. For example
   `require('one/two/three')` would look for an NPM package called `one`,
   and `require('@company/one/two/three')` would look for an NPM package `@company/one`.

3. If the API call `require('@company/one/two/three')` is performed by a script `/a/b/c/d/e.js`, then
   the module resolver will look for the `@company/one` install folder by searching for `node_modules` folders
   in parents of the script's folder. In our example, the following paths would be checked (approximately, ignoring many details):

   - `/a/b/c/d/node_modules/@company/one/package.json`
   - `/a/b/c/node_modules/@company/one/package.json`
   - `/a/b/node_modules/@company/one/package.json`
   - `/a/node_modules/@company/one/package.json`
   - `/node_modules/@company/one/package.json`

   The first match is taken, ignoring other possible matches. If no match is found, then `require()` fails
   by throwing an exception.

4. Once a match is found, the `two/three` module subpath is evaluated relative to the `@company/one` install folder.
   Let's suppose that `/a/b/node_modules/@company/one/package.json` was the found install folder;
   then (absent other mappings) the resolved target path will be `/a/b/node_modules/@company/one/two/three.js`.

5. If the package subpath is not specified (for example `require('@company/one')`), then a main index will be used.
   The default would be `/a/b/node_modules/@company/one/index.js`, but most likely an explicit path will be
   specified by a **package.json** field such as `"main"`. For example, with `"main": "dist/bundle.js"`,
   the final target path instead would become `/a/b/node_modules/@company/one/dist/bundle.js`.

A couple important things to understand about this algorithm:

- **Phantom dependencies are possible:**
  The `node_modules` folder was probably created by `pnpm install` based on some **package.json** file,
  most likely the package that owns our script `/a/b/c/d/e.js`. However, at no point does the algorithm
  read THAT **package.json** file. Resolution only considers `node_modules` folders, regardless of how they
  were created. This is the fundamental design flaw that makes
  [phantom dependencies](@rushjs/pages/advanced/phantom_deps/) possible, along with **"hoisting"**
  which is the dubious practice of intentionally introducing phantom dependencies.

- **Symlinks get normalized:** When a package is resolved via a symlink, the folder path is normalized
  by calling [fs.realpath()](https://nodejs.org/api/fs.html#fspromisesrealpathpath-options)
  to eliminate any symlinks, so that Step 3 will visit parent folders from the physical path
  instead of the logical (with symlinks) path.

  For example: suppose that `/my-repo/my-app/node_modules/my-library` is actually a symlink to
  `/my-repo/my-library`, and the executing script was imported as `./node_modules/my-library/dist/bundle.js`.
  When `bundle.js` calls `require('some-other-library')`, the searched parent folder will be
  `/my-repo/my-library/node_modules/`, NOT `/my-repo/my-app/node_modules`. This feature is what enables
  the PNPM installation model to eliminate phantom dependencies.

  (This was not true in ancient versions of Node.js; see the
  [--preserve-symlinks](https://nodejs.org/api/all.html#cli_preserve_symlinks) docs for details.)

### 🔍 Tracing CommonJS resolution

Let's try a hands-on experiment, to see how CommonJS resolution can be traced by inspecting folders on disk.

1<!-- -->. Clone and install the [demo/sample-1](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/sample-1)
branch from the [lockfile-explorer-demos](https://github.com/microsoft/lockfile-explorer-demos/)
demo repo. **_You will need to launch the Verdaccio service in a separate shell window._** See the
[Demos repository](../scenarios/demos_repo.md) topic for instructions.

Recall that the `demo/sample-1` lockfile looks like this:

<img src='https://raw.githubusercontent.com/microsoft/lockfile-explorer-demos/demo/sample-1/common/images/lfx-demo-sample-1.svg' alt="dependency graph: demo/sample-1" />

After running `rush install` in the `~/lockfile-explorer-demos/` folder, the project `C` should
have the following files:

- `~/lockfile-explorer-demos/projects/c/package.json`: defines the package
- `~/lockfile-explorer-demos/projects/c/index.js`: some placeholder source code
- `~/lockfile-explorer-demos/projects/c/node_modules/@rushstack/e/`: installed folder for dependency E
- `~/lockfile-explorer-demos/projects/c/node_modules/@rushstack/k/`: installed folder for dependency K
- `~/lockfile-explorer-demos/projects/c/node_modules/@rushstack/m/`: installed folder for dependency M

Observe that PNPM has created symlinks in the `c/node_modules` folder. We can inspect them using the shell:

<Tabs>
  <TabItem value="bash" label="Bash">

```bash
# Example project C's node_modules folder
ls -l projects/c/node_modules/@rushstack/
```

Output:

```
lrwxrwxrwx 1 e -> /home/yourself/lockfile-explorer-demos/projects/e/
lrwxrwxrwx 1 k -> /home/yourself/lockfile-explorer-demos/common/temp/node_modules/.pnpm/@rushstack+k@1.0.0_@rushstack+m@1.0.0/node_modules/@rushstack/k/
lrwxrwxrwx 1 m -> /home/yourself/lockfile-explorer-demos/common/temp/node_modules/.pnpm/@rushstack+m@1.0.0/node_modules/@rushstack/m/
```

  </TabItem>
  <TabItem value="windows" label="PowerShell">

```powershell
# Example project C's node_modules folder
dir projects\c\node_modules\@rushstack\ | select Name,LinkType,Target
```

Output:

```
Name LinkType Target
---- -------- ------
e    Junction {C:\Git\lockfile-explorer-demos\projects\e\}
k    Junction {C:\Git\lockfile-explorer-demos\common\temp\node_modules\.pnpm\@rushstack+k@1.0.0_@rushstack+m@1.0.0\node_modules\@rushstack\k\}
m    Junction {C:\Git\lockfile-explorer-demos\common\temp\node_modules\.pnpm\@rushstack+m@1.0.0\node_modules\@rushstack\m\}
```

  </TabItem>
  <TabItem value="cmd" label="DOS">

```batch
:: Example project C's node_modules folder
dir projects\c\node_modules\@rushstack\
```

Output:

```
Directory of C:\Git\lockfile-explorer-demos\projects\c\node_modules\@rushstack

<DIR>          .
<DIR>          ..
<JUNCTION>     e [C:\Git\lockfile-explorer-demos\projects\e]
<JUNCTION>     k [C:\Git\lockfile-explorer-demos\common\temp\node_modules\.pnpm\@rushstack+k@1.0.0_@rushstack+m@1.0.0\node_modules\@rushstack\k]
<JUNCTION>     m [C:\Git\lockfile-explorer-demos\common\temp\node_modules\.pnpm\@rushstack+m@1.0.0\node_modules\@rushstack\m]
```

  </TabItem>
</Tabs>

Observe that:

- `node_modules/@rushstack/e` gets symlinked to `projects/e` because `c/package.json` declared
  it as a local workspace dependency (`"@rushstack/e": "workspace:*"`)
- `node_modules/@rushstack/m` gets symlinked to a folder under `common/temp` because
  `c/package.json` declared it as an external dependency, installed from the NPM registry
  (`"@rushstack/m": "~1.0.0"` without `workspace:`)

> Note: In a Rush monorepo, the `workspace:` dependency specifier unambiguously determines whether
> the target is a local project or an external package. This is because Rush silently forces
> [--link-workspace-packages=false](https://pnpm.io/npmrc#link-workspace-packages).
> If you are using PNPM without Rush, this may not be the case, in which case you'll have to
> compare versions from two different **package.json** files to determine the answer.

Instead of inspecting symlinks, we can use the
[@rushstack/trace-import](https://www.npmjs.com/package/@rushstack/trace-import)
tool to test how the dependency gets resolved:

```bash
# From the folder of project C...
cd ~/lockfile-explorer-demos/projects/c/

# ...let's try to resolve package M
trace-import -p @rushstack/m
```

Output:

```
trace-import 0.1.0 - https://rushstack.io

Base folder:             C:\Git\lockfile-explorer-demos\projects\c
Package name:            @rushstack/m
Package subpath:         (not specified)

Resolving...

Package folder:          C:\Git\lockfile-explorer-demos\common\temp\node_modules\.pnpm\@rushstack+m@1.0.0\node_modules\@rushstack\m
package.json:            @rushstack/m (1.0.0)
Main index:              (none)

Target path:             C:\Git\lockfile-explorer-demos\common\temp\node_modules\.pnpm\@rushstack+m@1.0.0\node_modules\@rushstack\m\index.js
```

Now let's follow the chain a step further. At runtime, suppose that `C` imports a script from `E`,
and then `E` in turn tries to import `M`. Will it work? We might try this experiment:

```bash
# From the folder of project C/E...
cd ~/lockfile-explorer-demos/projects/c/node_modules/@rushstack/e/

# ...let's try to resolve package M
trace-import -p @rushstack/m
```

Output:

```
trace-import 0.1.0 - https://rushstack.io

Base folder:             C:\Git\lockfile-explorer-demos\projects\c\node_modules\@rushstack\e
Package name:            @rushstack/m
Package subpath:         (not specified)

Resolving...

ERROR: Cannot find package "@rushstack/m" from "C:\Git\lockfile-explorer-demos\projects\c\node_modules\@rushstack\e".
```

Even though `projects/c/node_modules/` contains M and appears to be a parent folder
of `projects/c/node_modules/@rushstack/e/`, this path traverses a symlink. Recall that
the `require()` algorithm uses `fs.realpath()` to eliminate symlinks, so the search
actually starts from `projects/e` not `projects/c/node_modules/@rushstack/e/`.

> Warning: If you're creating a tool that needs to resolve imports, do not write your own code that
> traverses `node_modules` folders. The presentation here is greatly simplified for learning purposes;
> the full algorithm is complex and difficult to implement correctly. Instead, use a standard API such as
> [require.resolve()](https://nodejs.org/api/modules.html#requireresolverequest-options),
> [node-core-library Import](https://api.rushstack.io/pages/node-core-library.import/),
> or the [resolve](https://www.npmjs.com/package/resolve) NPM package.

## ES module resolution

CommonJS is consdered a "legacy" module system, and today it is mainly used by Node.js
and associated tools such as Jest. Bundlers such as Webpack implement the modern ECMAScript
module system, whose most visible difference is that scripts use `import` instead of `require()`.

It's common that a library will need to be imported via both `import` and `require()`,
which requires having a maintaing separate copies of the code in each format. For example,

For example, consider the
[@microsoft/tsdoc](https://www.npmjs.com/package/@microsoft/tsdoc) NPM package.
Its **package.json** specifies two fields `"main"` and `"module"`:

[@microsoft/tsdoc/package.json](https://github.com/microsoft/tsdoc/blob/c758984fb4e088e69d7ea34ccab07e9def01448d/tsdoc/package.json#L20)

```js
{
  "name": "@microsoft/tsdoc",
  "version": "0.14.2",
  "description": "A parser for the TypeScript doc comment syntax",
  . . .
  "main": "lib-commonjs/index.js",
  "module": "lib/index.js",
  "typings": "lib/index.d.ts",
```

If present, the `"module"` field will be used by ECMAScript imports instead
of the `"main"` field.

## TypeScript module resolution

At compile time, TypeScript compiler looks for `.d.ts` files instead of `.js` files. In the simple case,
it simply performs CommonJS or ECMAScript resolution to find the `.js` file, and then looks for a `.d.ts` file
in the same folder. For example, `example-package/dist/bundle.d.ts` from `example-package/dist/bundle.js`.

However, like with `"main"` and `"module"`, you can specify a main index using `"typings"` as seen above.
(The field can be called `"types"` or `"typings"` -- they have the same meaning.)

If none of these methods work, the TypeScript compiler will also search for a
[Definitely Typed](https://github.com/DefinitelyTyped/DefinitelyTyped) package
such as `@types/example-package` for `package` (or `@types/scope__example` if the name was `@scope/example`).

The full spec is detailed in the
[TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/module-resolution.html).

### 🔍 Tracing TypeScript resolution

The `trace-import` tool can also be used to try resolving `.d.ts` files for TypeScript.
The command line is the same as in the above example, except that you need to include
the `--resolution-type ts` parameter (`-t ts` for short).

The `trace-import` is a handy tool for basic checks; however, it currently does not implement advanced
import mappings and **tsconfig.json** settings. For the most accurate diagnostics, it's recommended
instead to compile your project using the
[--traceResolution](https://www.typescriptlang.org/tsconfig/#traceResolution)
switch for `tsc`. This option produces megabytes of diagnostic logging, so it's recommended to
redirect the output to a file, like this:

```
cd my-typescript-project/

# Redirect the output to trace.log
tsc --traceResolution > trace.log

# Now you can inspect this file using VS Code
code trace.log
```

## See also

- [@<!---->rushstack/trace-import](https://www.npmjs.com/package/@rushstack/trace-import): Our command-line tool for troubleshooting how modules are resolved by `import` and `require()`
- [Node.js require()](https://nodejs.org/api/modules.html#all-together) specification and algorithm
- [Node.js require.resolve()](https://nodejs.org/api/modules.html#requireresolverequest-options) API docs
- [node-core-library Import](https://api.rushstack.io/pages/node-core-library.import/): the Rush Stack API
  which provides similar functionality as `require.resolve()` but with improved TypeScript typings and some
  additional features
- [resolve](https://www.npmjs.com/package/resolve): a standalone NPM package that implements
  `require.resolve()` algorithm with the ability to specify a base folder (it is used internally
  by `Import`)
- [package.json fields](https://docs.npmjs.com/cli/v6/configuring-npm/package-json) docs from NPM
