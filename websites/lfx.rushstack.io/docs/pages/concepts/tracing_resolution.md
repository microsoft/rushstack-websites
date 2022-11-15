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
[the Node.js specification](https://nodejs.org/api/modules.html#all-together), but approximately it works
like this (ignoring many details such as import path mappings):

1. If your import path starts with `.` or `..` or `/` (for example `require('./path/to/file')`),
   then the entire string will be resolved as a regular file path.

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

4. Once a match is found, the `two/three` import path remainder is evaluated relative to the `@company/one` install folder.
   Let's suppose that `/a/b/node_modules/@company/one/package.json` was the found match; then (if there are no
   import path mappings) the resolved script will be `/a/b/node_modules/@company/one/two/three.js`.

5. If the import path remainder is an empty string (for example `require('@company/one')`), then a default path will be used.
   The default path would be `/a/b/node_modules/@company/one/index.js`, but most likely an explicit path will be
   specified by a **package.json** field such as `"main"`. For example, with `"main": "dist/one.js"`,
   the final path instead would be `/a/b/node_modules/@company/one/dist/one.js`.

A couple important things to understand about this algorithm:

- **Phantom dependencies are possible:**
  The `node_modules` folder was probably created by `pnpm install` based on some **package.json** file,
  most likely the package that owns our script `/a/b/c/d/e.js`. However, at no point does the algorithm
  read THAT **package.json** file. Resolution only considers `node_modules` folders, regardless of how they
  were created. This is the fundamental design flaw that makes
  [phantom dependencies](@rushjs/pages/advanced/phantom_deps/) possible, as well as "hoisting" which is the
  questionable practice of intentionally introducing phantom dependencies.

- **Symlinks get normalized:** When a module is imported via a symlink, the script path is normalized
  by calling [fs.realpath()](https://nodejs.org/api/fs.html#fspromisesrealpathpath-options)
  to eliminate any symlinks, so that Step 3 will visit parent folders from the physical path
  instead of the logical (with symlinks) path.

  For example: suppose that `/my-repo/my-app/node_modules/my-library` is actually a symlink to
  `/my-repo/my-library`, and the executing script was imported as `./node_modules/my-library/dist/bundle.js`.
  When `bundle.js` calls `require('some-other-library')`, the searched parent folder will be
  `/my-repo/my-library/node_modules/`, NOT `/my-repo/my-app/node_modules`. This feature is what makes
  the PNPM installation model possible.

  (This was not true in ancient versions of Node.js; see the
  [--preserve-symlinks](https://nodejs.org/api/all.html#cli_preserve_symlinks) docs for details.)

### 🔍 Tracing CommonJS resolution

Let's try a hands-on experiment, to see how CommonJS resolution can be traced by inspecting folders on disk.

1<!-- -->. Clone and install the [demo/sample-1](https://github.com/microsoft/lockfile-explorer-demos/tree/demo/sample-1)
branch from the [lockfile-explorer-demos](https://github.com/microsoft/lockfile-explorer-demos/)
demo repo. **_You will need to launch the Verdaccio service in a separate shell window._** See the
[Demos repository](../scenarios/demos_repo.md) topic for instructions.

Recall that the `demo/sample-1` lockfile looks like this:

<img src='/images/docs/lfx-demo-sample-1.svg' alt="dependency graph: demo/sample-1" />

After running `rush install` in the `~/lockfile-explorer-demos/` folder, the project B should
have the following files:

- `~/lockfile-explorer-demos/projects/b/package.json`: defines the package
- `~/lockfile-explorer-demos/projects/b/index.js`: some placeholder source code
- `~/lockfile-explorer-demos/projects/b/node_modules/@rushstack/d/`: installed folder for dependency D
- `~/lockfile-explorer-demos/projects/b/node_modules/@rushstack/n/`: installed folder for dependency N

Observe that PNPM has created symlinks in the `b/node_modules` folder. We can inspect them using the shell:

<Tabs>
  <TabItem value="bash" label="Bash">

```bash
ls -l ~/lockfile-explorer-demos/projects/b/node_modules/
```

Output:

```
lrwxrwxrwx 1 d -> /home/yourself/lockfile-explorer-demos/projects/d/
lrwxrwxrwx 1 n -> /home/yourself/lockfile-explorer-demos/common/temp/node_modules/.pnpm/@rushstack+n@2.0.0/node_modules/@rushstack/n/
```

  </TabItem>
  <TabItem value="windows" label="PowerShell">

```powershell
dir projects\b\node_modules\@rushstack\ | select Name,LinkType,Target
```

Output:

```
Name LinkType Target
---- -------- ------
d    Junction {C:\Git\lockfile-explorer-demos\projects\d\}
n    Junction {C:\Git\lockfile-explorer-demos\common\temp\node_modules\.pnpm\@rushstack+n@2.0.0\node_modules\@rushstack\n\}
```

  </TabItem>
  <TabItem value="cmd" label="DOS">

```batch
dir node_modules\@rushstack\
```

Output:

```
Directory of C:\Git\lockfile-explorer-demos\projects\b\node_modules\@rushstack

12/01/2022  03:11 PM    <DIR>          .
12/01/2022  03:11 PM    <DIR>          ..
12/01/2022  03:11 PM    <JUNCTION>     d [C:\Git\lockfile-explorer-demos\projects\d]
12/01/2022  03:11 PM    <JUNCTION>     n [C:\Git\lockfile-explorer-demos\common\temp\node_modules\.pnpm\@rushstack+n@2.0.0\node_modules\@rushstack\n]
```

  </TabItem>
</Tabs>

Observe that:

- `node_modules/@rushstack/d` gets symlinked to `projects/d` because `b/package.json` declared
  it as a local workspace dependency (`"@rushstack/d": "workspace:*"`)
- `node_modules/@rushstack/d` gets symlinked to a folder under `common/temp` because
  `b/package.json` declared it as an external dependency, installed from the NPM registry
  (`"@rushstack/n": "^2.0.0"`)

> Note: Rush silently forces [--link-workspace-packages=false](https://pnpm.io/npmrc#link-workspace-packages)
> which ensures that the `workspace:` prefix unambiguously determines whether a dependency will be linked
> locally versus externally. If you are using PNPM without Rush, it's instead decided by an implicit heuristic.

We can confirm this by calling the
[Node.js require.resolve()](https://nodejs.org/api/modules.html#requireresolverequest-options)
API:

```bash
# From the folder of project B...
cd ~/lockfile-explorer-demos/projects/b/

# ...call the require.resolve() API to print out the target path for D:
node -e console.log(require.resolve('@rushstack/d'))

# Expected output:
# /home/yourself/lockfile-explorer-demos/projects/d/index.js
```

Now let's follow the chain a step further. At runtime, suppose that A imports a file from D,
and then D in turn tries to import N. Will it work? We might try this experiment:

```bash
# INCORRECT METHOD

# From the folder of project B/D...
cd ~/lockfile-explorer-demos/projects/b/node_modules/@rushstack/d

# ...call the require.resolve() API to print out the target path for N:
node -e console.log(require.resolve('@rushstack/n'))

# Expected output:
# /home/yourself/lockfile-explorer-demos/common/temp/node_modules/.pnpm/@rushstack+n@2.0.0/node_modules/@rushstack/n/index.js
```

According to the diagram, this should NOT work, because D

> Warning: If you're creating a tool that needs to resolve imports, do not write your own code that
> traverses `node_modules` folders. The presentation here is greatly simplified for learning purposes;
> the full algorithm is complex and difficult to implement correctly. Instead, use a standard API such as
> [require.resolve()](https://nodejs.org/api/modules.html#requireresolverequest-options),
> [node-core-library Import](https://api.rushstack.io/pages/node-core-library.import/),
> or the [resolve](https://www.npmjs.com/package/resolve) NPM package.

## ES module resolution

- `"module"` used by runtimes supporting ESNext modules, for example the Webpack bundler.
  For example: `"module": "dist/one.esm.js"`

## TypeScript module resolution

https://www.typescriptlang.org/docs/handbook/module-resolution.html

- `"typings"` or `"types"` used only by the TypeScript compiler. (If it's missing, the compiler will
  look in the same folder as the runtime `.js` file.)
  For example: `"typings": "dist/one.d.ts"`

### 🔍 Tracing TypeScript resolution

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
