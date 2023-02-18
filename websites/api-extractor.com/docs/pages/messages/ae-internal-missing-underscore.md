---
layout: page
title: ae-internal-missing-underscore
navigation_source: docs_nav
---

*"The name ___ should be prefixed with an underscore because the declaration is marked as @internal."*

## Remarks

When a declaration is marked as `@internal`, it's a good practice to prefix its name with an underscore character
("_").

Suppose that there is a library called **widget-lib** which exports a declaration like this:

```ts
/**
 * @internal
 */
export class Widget {
  public render(): void {
  }
}

/**
 * @public
 */
export class WidgetManager {
  /**
   * @internal
   */
  public initialize(): void {
  }
}

// Warning: The name "Widget" should be prefixed with an underscore because
// the declaration is marked as @internal.
// Warning: The name "initialize" should be prefixed with an underscore because
// the declaration is marked as @internal.
```

When a caller goes to use this API, they might accidentally try to use `Widget` or `initialize`, not realizing
that they are internal.  API Extractor's .d.ts trimming feature can help by removing these declarations from the
TypeScript IntelliSense, but what if you are not using that feature?  Or what if your library is consumed by
JavaScript code that does not perform type checking?

Adding an underscore to these declarations makes it immediately obvious that something is special about these APIs:

```ts
/**
 * @internal
 */
export class _Widget {
  // This method is @internal, but we don't add an underscore because
  // the container already has an underscore:
  public render(): void {
  }
}

/**
 * @public
 */
export class WidgetManager {
  /**
   * @internal
   */
  public _initialize(): void {
  }
}
```

The consumer's code might look like this:

```ts
import { _Widget, WidgetManager } from 'widget-lib';

let widget = new _Widget();  // <-- bad

let widgetManager = new WidgetManager();
widgetManager._initialize();   // <-- bad
```

The underscore makes this mistake much easier to spot.

Note that we don't need to add an underscore to every member of the `Widget` class.  That would be redundant,
since in TypeScript you can't access to those items without referring to their container.  Thus, API Extractor
only checks `ae-internal-missing-underscore` for the outermost `@internal` container.


## How to fix

Rename the internal declaration so that its name starts with an underscore.

Alternatively, if changing your API signature would be too disruptive, you can simply choose to ignore this message.
By default it uses `addToApiReportFile` reporting, which means that it will be written into your API report
for tracking purposes.  It will not produce a console warning and thus will NOT break your build
(assuming that you have `apiReport.enabled` set to true).
