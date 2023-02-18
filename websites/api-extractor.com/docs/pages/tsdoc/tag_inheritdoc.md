---
layout: page
title: '{@inheritDoc}'
navigation_source: docs_nav
---

**Tag type:** inline tag

**TSDoc standardization:** [extended](
https://github.com/microsoft/tsdoc/blob/master/tsdoc/src/details/Standardization.ts)

**Syntax:**

* `{@inheritDoc DECLARATION_REFERENCE}`

The `@inheritDoc` tag automatically copies documentation content from another declaration.  This avoids duplication
when two declarations have the same behavior, and thus should have identical documentation.

The inline tag content is a [TSDoc declaration reference]({% link pages/tsdoc/declaration_references.md %}),
which specifies the "**target declaration**" to be copied from.  The target can be any arbitrary declaration;
it does not need to be from a base class or implemented interface.  The target declaration is not optional;
an [ae-unresolved-inheritdoc-base]({% link pages/messages/ae-unresolved-inheritdoc-base.md %}) error
will be reported if it is omitted.  The target declaration may itself contain another
`@inheritDoc` tag; however, if the links form a cycle, then the
[ae-cyclic-inherit-doc]({% link pages/messages/ae-cyclic-inherit-doc.md %}) error will be reported.

**Usage example:**
```ts
import { Serializer } from 'example-library';

/**
 * An interface describing a widget.
 * @public
 */
export interface IWidget {
  /**
   * Draws the widget on the display surface.
   * @param x - the X position of the widget
   * @param y - the Y position of the widget
   */
  public draw(x: number, y: number): void;
}

/** @public */
export class Button implements IWidget {
  /** {@inheritDoc IWidget.draw} */
  public draw(x: number, y: number): void {
    . . .
  }

  /**
   * {@inheritDoc example-library#Serializer.writeFile}
   * @deprecated Use {@link example-library#Serializer.writeFile} instead.
   */
  public save(): void {
    . . .
  }
}
```

In the above example, `Button.draw()` implements the `IWidget.draw()` interface contract, so we can use
`{@inheritDoc IWidget.draw}` to avoid copy+pasting the entire comment block.  Note that `Button.save()`
inherits its documentation from `Serializer.writeFile()` which has a different name and is imported from a different
package; although there is no "inheritance" relationship, we can still copy documentation from that declaration.

## What gets copied

The `@inheritDoc` tag does not copy the entire comment body.  Only the following components are copied:

- summary section
- `@remarks` block
- `@params` blocks
- `@typeParam` blocks
- `@returns` block

Other tags such as `@defaultValue` or `@example` are not copied, and need to be explicitly included after
the `@inheritDoc` tag.

## See also

- [Declaration references]({% link pages/tsdoc/declaration_references.md %})
- [ae-cyclic-inherit-doc]({% link pages/messages/ae-cyclic-inherit-doc.md %})
- [ae-unresolved-inheritdoc-base]({% link pages/messages/ae-unresolved-inheritdoc-base.md %})
- [ae-unresolved-inheritdoc-reference]({% link pages/messages/ae-unresolved-inheritdoc-reference.md %})
