---
layout: page
title: A sample project
navigation_source: docs_nav
---

*This article continues the tutorial from the "[What is API Extractor?]({% link pages/overview/intro.md %})" page.  It's recommended to start there.*

For this tutorial, we'll consider a hypothetical TypeScript library project.  The declarations are taken from
a real-world NPM package **@microsoft/sp-core-library**.  Its main entry point is **src/index.ts**, which contains
export statements like this:

**src/index.ts**<br/>
```ts
export { default as Log } from './log/Log';
export { default as ILogHandler } from './log/ILogHandler';
```

These definitions come from three other source files (excerpted here for brevity):

**src/log/Log.ts**<br/>
```ts
import DefaultLogHandler from './DefaultLogHandler';
import ILogHandler from './ILogHandler';

/**
 * The Log class provides static methods for logging messages at different levels (verbose,
 * info, warning, error) and with context information. Context information helps identify
 * which component generated the messages and makes the messages useful and filterable.
 * @public
 */
export default class Log {
  private static _logHandler: ILogHandler = new DefaultLogHandler();

  /**
   * Configures the logger with a different target.
   * @beta
   */
  public static initialize(logHandler: ILogHandler): void {
    Log._logHandler = logHandler;
  }

  /**
   * Logs a verbose message
   * @param   source - the source from where the message is logged, e.g., the class name.
   *          The source provides context information for the logged message.
   *          If the source's length is more than 20, only the first 20 characters are kept.
   * @param   message - the message to be logged
   *          If the message's length is more than 100, only the first 100 characters are kept.
   */
  public static verbose(source: string, message: string): void {
    this._logHandler.verbose(source, message);
  }

  . . .
  public static info(source: string, message: string): void {
    this._logHandler.info(source, message);
  }

  . . .
  public static warn(source: string, message: string): void {
    this._logHandler.warn(source, message);
  }

  . . .
  public static error(source: string, error: Error): void {
    this._logHandler.error(source, error);
  }
}

```

**src/log/ILogHandler.ts**<br/>
```ts
/**
 * The redirectable implementation for the Log class.
 * @beta
 */
export interface ILogHandler {
  verbose(source: string, message: string): void;
  info   (source: string, message: string): void;
  warn   (source: string, message: string): void;
  error  (source: string, error: Error): void;
}

export default ILogHandler;
```

**src/log/DefaultLogHandler.ts**<br/>
*(private in this example, so its implementation is unimportant and left to your imagination.)*

Let's examine how API Extractor processes these inputs to produce the API report, d.ts rollup, and API documentation
outputs...

#### Next up: [The API report]({% link pages/overview/demo_api_report.md %})
