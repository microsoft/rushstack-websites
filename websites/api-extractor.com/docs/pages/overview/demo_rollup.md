---
layout: page
title: The .d.ts rollup
navigation_source: docs_nav
---

*This article continues the tutorial from the "[What is API Extractor?]({% link pages/overview/intro.md %})" page.  It's recommended to start there.*

The next API Extractor output that we'll discuss is the "**.d.ts rollup**."  Recall that our example project
has these TypeScript source files:

<b>
src/index.ts<br/>
src/log/Log.ts<br/>
src/log/ILogHandler.ts<br/>
</b>

Each of the above files builds into a corresponding set of intermediary outputs:

<b>
lib/index.d.ts<br/>
lib/index.js<br/>
lib/log/Log.d.ts<br/>
lib/log/Log.js<br/>
lib/log/ILogHandler.d.ts<br/>
lib/log/ILogHandler.js<br/>
</b>

We can use a linker such as [Webpack](https://webpack.js.org) to roll up the \*.js files into a combined
bundle file: **dist/sp-core-library.js**

In the same way, API Extractor can produce a rollup for your \*.d.ts files: **dist/sp-core-library.d.ts**

Optionally, we can also enable .d.ts "trimming" which excludes the declarations marked as `@beta`
from appearing in the rollup file: **dist/sp-core-library-public.d.ts**

The trimmed file contents would look like this:

**dist/sp-core-library-public.d.ts**
```ts
/* Excluded from this release type: ILogHandler */

/**
 * The Log class provides static methods for logging messages at different levels (verbose,
 * info, warning, error) and with context information. Context information helps identify
 * which component generated the messages and makes the messages useful and filterable.
 * @public
 */
export declare class Log {
  private static _logHandler;

  /* Excluded from this release type: initialize */

  /**
   * Logs a verbose message
   * @param   source - the source from where the message is logged, e.g., the class name.
   *          The source provides context information for the logged message.
   *          If the source's length is more than 20, only the first 20 characters are kept.
   * @param   message - the message to be logged
   *          If the message's length is more than 100, only the first 100 characters are kept.
   */
  public static verbose(source: string, message: string, scope?: ServiceScope): void;

  . . .
  public static info(source: string, message: string): void;

  . . .
  public static warn(source: string, message: string): void;

  . . .
  public static error(source: string, error: Error): void;
}
```

With trimming enabled, developers no longer have to worry about accidentally taking a dependency on the
unstable `Log.initialize()` function when they are targeting production.  That function won't even appear
in their VS Code IntelliSense!  If they want to use the `@beta` APIs, they would explicitly opt-in to a
"beta" release.  For the real **@microsoft/sp-core-library** package, "opting in" is accomplished by installing
[a special version number](https://www.npmjs.com/package/@microsoft/sp-core-library?activeTab=versions)
with the `-plusbeta` suffix (however other approaches are possible as well).

API Extractor's .d.ts rollup feature is fairly sophisticated.  For example, it supports:

- declarations whose exported name is different from the original definition
- types imported from other packages
- `export * from` relationships with other packages
- merged declarations

One significant limitation for .d.ts rollups is the assumption that your package has a single entry point.
(If that's not the case, you probably won't be able to use this feature of API Extractor, although you can still
use the API report and documentation generation features.)

#### Next up: [The API docs]({% link pages/overview/demo_docs.md %})
