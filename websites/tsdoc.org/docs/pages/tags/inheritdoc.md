---
title: '@inheritDoc'
---

<!-- prettier-ignore-start -->
|    |    |
| -- | -- |
| Standardization: | [Extended](../spec/standardization_groups.md) |
| Syntax kind: | [Inline tag](../spec/tag_kinds.md) |
<!-- prettier-ignore-end -->

## Usage

This inline tag is used to automatically generate an API item's documentation by copying it from another
API item. The inline tag parameter contains a reference to the other item, which may be an unrelated class,
or even an import from a separate NPM package.

> Note: The notation for declaration references has not been finalized. See GitHub
> [issue #9](https://github.com/microsoft/tsdoc/issues/9)

### What gets copied

The `@inheritDoc` tag does not copy the entire comment body. Only the following components are copied:

- summary section
- `@remarks` block
- `@params` blocks
- `@typeParam` blocks
- `@returns` block

Other tags such as `@defaultValue` or `@example` are not copied, and need to be explicitly included after
the `@inheritDoc` tag. When the `@inheritDoc` tag is specified, neither the summary section nor the `@remarks`
section may be specified in the comment.

## Example

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
