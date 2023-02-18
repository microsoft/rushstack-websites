---
layout: page
title: '@virtual'
navigation_source: docs_nav
---

**Tag type:** modifier

**TSDoc standardization:** [extended](
https://github.com/microsoft/tsdoc/blob/master/tsdoc/src/details/Standardization.ts)

The `@virtual` modifier has similar semantics to the `virtual` keyword in C#.  It should only be applied
to a member of a class.  It indicates that the member may be overridden (i.e. redefined) by a corresponding member
of a child class.  The `@virtual` modifier should not be applied to `abstract` members, because the `abstract`
keyword already implies that the method is virtual.

The `@virtual` modifier will be displayed in the generated documentation.

API Extractor does not currently validate whether the `@virtual` modifier is used correctly.  (This may be implemented
in the future.)

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
```

## See also

- [@override modifier]({% link pages/tsdoc/tag_override.md %})
- [@sealed modifier]({% link pages/tsdoc/tag_sealed.md %})
- [C# "virtual" keyword](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/virtual)
