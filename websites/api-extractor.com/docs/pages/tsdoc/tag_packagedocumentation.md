---
title: '@packageDocumentation'
---

**Tag type:** modifier

**TSDoc standardization:** [core](https://github.com/microsoft/tsdoc/blob/master/tsdoc/src/details/Standardization.ts)

This tag identifies the doc comment that describes an entire NPM package (as opposed to an individual declaration
that is exported by the package). API Documenter will display the `@packageDocumentation` content on the page
for the package.

If present, the `@packageDocumentation` comment must appear in the \*.d.ts file acts as the entry point for the package,
and it should be the first `/**` comment encountered in that file. The `@packageDocumentation` modifier should not be
used in any other type of doc comment.

The `@packageDocumentation` comment should NOT have a
[release tag](../tsdoc/doc_comment_syntax.md#release-tags)
such as `@public` or `@internal`.

If the `@packageDocumentation` comment is not found, API Extractor will add the following message to the
API report file:

```ts
// (No @packageDocumentation comment for this package)
```

**Usage example:**

Suppose our NPM package is called `widget-lib`, and its main entry point is **./src/index.ts**.
The source code might look like this:

```ts
// Copyright (c) Example Company. All rights reserved. Licensed under the MIT license.

/**
 * A library for building widgets.
 *
 * @remarks
 * The `widget-lib` defines the {@link IWidget} interface and {@link Widget} class,
 * which are used to build widgets.
 *
 * @packageDocumentation
 */

/**
 * Interface implemented by all widgets.
 * @public
 */
export interface IWidget {
  /**
   * Draws the widget on the screen.
   */
  render(): void;
}

/**
 * The standard implementation of the `IWidget` contract.
 * @public
 */
export class Widget implements IWidget {
  /** {@inheritDoc IWidget.render} */
  public render(): void {
    . . .
  }
}
```

## See also

- [Doc comment syntax: Release tags](../tsdoc/doc_comment_syntax.md#release-tags)
- [ae-misplaced-package-tag](../messages/ae-misplaced-package-tag.md)
- [mainEntryPointFilePath setting](../configs/api-extractor_json.md#mainentrypointfilepath)
