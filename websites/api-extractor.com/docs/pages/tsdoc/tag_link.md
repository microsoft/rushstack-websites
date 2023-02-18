---
layout: page
title: '{@link}'
navigation_source: docs_nav
---

**Tag type:** inline tag

**TSDoc standardization:** [core](
https://github.com/microsoft/tsdoc/blob/master/tsdoc/src/details/Standardization.ts)

**Syntax:**

* `{@link DECLARATION_REFERENCE}`
* `{@link DECLARATION_REFERENCE | DISPLAY_TEXT}`
* `{@link URL}`
* `{@link URL | DISPLAY_TEXT}`

The `@link` tag creates a hyperlink to an internet URL or another API documentation page specified
using a [TSDoc declaration references]({% link pages/tsdoc/declaration_references.md %}) notation.
If the *DISPLAY_TEXT* is omitted, then the declaration name or URL address will be used as the display text.


**Usage example:**

```ts
/**
 * The base class for all {@link https://en.wikipedia.org/wiki/Widget | widgets}.
 *
 * @remarks
 * Implements the {@link @microsoft/widget-lib#IWidget} interface.  To draw the widget,
 * call the {@link BaseWidget.draw | draw() function}.
 *
 * @public
 */
export class BaseWidget implements IWidget {
  /** {@inheritdoc IWidget} */
  public draw(): void {
    . . .
  }

  . . .
}
```

## See also

- [Declaration references]({% link pages/tsdoc/declaration_references.md %})
- [ae-unresolved-link]({% link pages/messages/ae-unresolved-link.md %})
