---
layout: page
title: '@override'
navigation_source: docs_nav
---

**Tag type:** modifier

**TSDoc standardization:** [extended](
https://github.com/microsoft/tsdoc/blob/master/tsdoc/src/details/Standardization.ts)

The `@override` modifier has similar semantics to the `override` keyword in C#.  It should only be applied
to a member of a class.  The `@override` modifier indicates that the member is overriding (i.e. redefining)
the corresponding member from a base class.  The base class member should be marked as `@virtual` or `@override`.

The `@override` modifier will be displayed in the generated documentation.

API Extractor does not currently validate whether the `@override` modifier is used correctly.
(This may be implemented in the future.)

> NOTE: Unlike many other programming languages, TypeScript supports inheritance for static members of a class.
> Thus, it is valid to use `@virtual`, `@override`, and `@sealed` for static members as well as instance members.

**Usage example:**

```ts
/** @public */
export class Control {
  /**
   * The title of the control
   * @virtual
   */
  public get title(): string {
    return 'Control';
  }

  /**
   * Draws the control on the screen
   * @virtual
   */
  public render(): void {
    . . .
  }
}

/** @public */
export class Button extends Control {
  /**
   * {@inheritDoc Control.title}
   * @override
   */
  public get title(): string {
    return 'Button';
  }

  /**
   * {@inheritDoc Control.render}
   * @override
   */
  public render(): void {
    . . .
  }
}

/** @public */
export class FancyButton extends Button {
  /**
   * {@inheritDoc Button.title}
   * @override
   */
  public get title(): string {
    return 'Fancy Button';
  }

  /**
   * {@inheritDoc Button.render}
   * @override
   */
  public render(): void {
    . . .
  }
}
```

## See also

- [@virtual modifier]({% link pages/tsdoc/tag_virtual.md %})
- [@sealed modifier]({% link pages/tsdoc/tag_sealed.md %})
- [C# "override" keyword](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/override)
