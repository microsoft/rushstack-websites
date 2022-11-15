---
title: Installation models
---

Installing a package involves downloading an archive and extracting its files into a folder on disk,
for example into the `node_modules` folder tree. We'll use the term **installation model** to describe
the mechanics of this process. Unlike most other programming languages, there are multiple installation models
in common use for Node.js today:

1. **NPM installation model** - The classic `node_modules` layout, currently used by [NPM](https://www.npmjs.com/)
   as well as [Yarn Classic](https://classic.yarnpkg.com/lang/en/).
   The fundamental design of this algorithm unavoidably produces
   [phantom dependencies](@rushjs/pages/advanced/phantom_deps/)
   (ability to import files that were not declared in **package.json**), as well as
   [NPM doppelgangers](@rushjs/pages/advanced/npm_doppelgangers/)
   (duplicate installations of the same version of the same package).
   NPM's implementation also produces
   [nondeterministic installations](http://npm.github.io/how-npm-works-docs/npm3/non-determinism.html)
   depending on the order in which CLI comands are invoked.
   The other installation models can all be understood as attempts to undo these design flaws,
   with different tradeoffs for backwards compatibility with existing packages.

2. **PNPM installation model** - The [PNPM](https://pnpm.io/) package manager introduced a completely
   different `node_modules` layout that relies heavily on [symlinks](https://en.wikipedia.org/wiki/Symbolic_link).
   This completely eliminates the problem of **NPM doppelgangers** (although **peer doppelgangers** are still
   possible). It also can completely eliminate **phantom dependencies**,
   depending on the [dependency hoisting](https://pnpm.io/npmrc#dependency-hoisting-settings) configuration.
   The resulting `node_modules` structure is somewhat convoluted, but its big advantage is excellent
   backwards compatibility with legacy code that resolves modules by traversing the `node_modules` tree.
   (Compatibility fixes are sometimes required, but in most cases the fix is very simple, and today almost every
   popular package has been fixed.) Yarn now also optionally supports the PNPM installation model via
   the [@yarnpkg/plugin-pnpm](https://yarnpkg.com/api/modules/plugin_pnpm.html) plugin.

3. **Plug'n'Play (PnP) installation model** - The [Yarn](https://yarnpkg.com/) package manager took a different
   approach, by introducing a hook called [Plug'n'Play](https://yarnpkg.com/features/pnp) that allows the Node.js
   `require()` API to be patched with a completely different implementation. The basic concept is that `yarn install`
   will generate a patch script `.pnp.cjs`, and then Node.js gets invoked with `NODE_OPTIONS="--require $(pwd)/.pnp.cjs"`.
   The script is expected to implement the [PnP API](https://yarnpkg.com/advanced/pnpapi) contract, although there
   is currently no spec for how module resolution might be performed by a tool that cannot execute arbitrary
   JavaScript code (for example a Java service). Because it fundamentally redesigns the semantics of `require()`,
   Plug'n'Play offers significant improvements in both features and performance; however it has struggled to gain
   widespread adoption due to compatibility challenges for existing NPM packages. The PNPM package manager
   now optionally supports the Plug'n'Play installation model via
   the [node-linker=pnp](https://pnpm.io/npmrc#node-linker) setting.

Rush Stack recommends the **PNPM installation model** for monorepos, because it currently seems to provide
the best tradeoff between correctness and backwards compatibility. It is the default and best supported
installation mode for the Rush build orchestrator. It is the only model supported by Lockfile Explorer,
although in the future we expect to implement support for other lockfile formats.

> This [Feature Comparison](https://pnpm.io/feature-comparison) summarizes some other interesting
> differences between package managers, beyond the installation models that they support.

> The acronyms "PnP" and "PNPM" are easy to confuse: PnP (Plug'n'Play) is an installation model,
> whereas PNPM is a package manager whose default installation model is not PnP.
