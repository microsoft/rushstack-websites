---
title: '@packageDocumentation'
---

| Standardization: | [Core]({% link pages/spec/standardization_groups.md %}) |
| Syntax kind: | [Modifier]({% link pages/spec/tag_kinds.md %}) |

## Usage

Used to indicate a doc comment that describes an entire NPM package (as opposed to an individual API item belonging
to that package). The `@packageDocumentation` comment is found in the \*.d.ts file that acts as the entry point for
the package, and it should be the first `/**` comment encountered in that file. A comment containing
a `@packageDocumentation` tag should never be used to describe an individual API item.

## Example

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
```

## See also

- [@alpha]({% link pages/tags/alpha.md %}) tag
- [@beta]({% link pages/tags/beta.md %}) tag
- [@experimental]({% link pages/tags/experimental.md %}) tag
- [@public]({% link pages/tags/public.md %}) tag
- [API Extractor: @packageDocumentation](https://api-extractor.com/pages/tsdoc/tag_packagedocumentation/):
  a reference implementation of this feature
