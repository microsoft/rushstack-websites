---
layout: page
title: '@sealed'
navigation_source: docs_nav
---

**Tag type:** modifier

**TSDoc standardization:** [extended](
https://github.com/microsoft/tsdoc/blob/master/tsdoc/src/details/Standardization.ts)

The `@sealed` modifier has similar semantics to the `sealed` keyword in C# or `final` keyword in Java.
It should only be applied to a class or a member of a class.

When applied to an entire class, the `@sealed` modifier indicates that the class must NOT be extended by a child class.

When applied to a member, the `@sealed` modifier indicates that the member must NOT be overridden (i.e. redefined)
by a corresponding member of a child class.  Whenever `@sealed` is applied to a member, the `@override` modifier must
be used as well.

The `@sealed` modifier will be displayed in the generated documentation.

API Extractor does not currently validate whether the `@sealed` modifier is used correctly.  (This may be implemented
in the future.)

**Usage example:**

In this example, `@sealed` is applied to the entire `Button` class:

```ts

/** @public */
export class Component {
  . . .
}

/** @public @sealed */
export class Button extends Component {
  . . .
}

/** @public */
export class FancyButton extends Button { // <-- NOT ALLOWED: THE CLASS IS SEALED
  . . .
}
```

In this example, `@sealed` is applied to the member `Button.componentType`:

```ts
/** @public */
export enum ComponentType {
  Control,
  Service
}

/** @public */
export abstract class Component {
  /** The type of component */
  public abstract get componentType(): ComponentType;

  /**
   * Draws the control on the screen
   * @virtual
   */
  public render(): void {
    . . .
  }
}

/** @public */
export class Button extends Component {
  /**
   * {@inheritDoc Component.componentType}
   * @override @sealed
   */
  public get componentType(): ComponentType {
    return ComponentType.Control;
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
  /** @override */
  public get componentType(): ComponentType {  // <-- NOT ALLOWED: THE MEMBER IS SEALED
    return ComponentType.Service;
  }

  /**
   * {@inheritDoc Button.render}
   * @override
   */
  public render(): void {  // <-- OKAY
    . . .
  }
}
```

## See also

- [@override modifier]({% link pages/tsdoc/tag_override.md %})
- [@virtual modifier]({% link pages/tsdoc/tag_virtual.md %})
- [C# "sealed" keyword](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/sealed)
- [Java "final" keyword](https://en.wikipedia.org/wiki/Final_(Java))
