---
title: '@override'
---

<!-- prettier-ignore-start -->
|    |    |
| -- | -- |
| Standardization: | [Extended](../spec/standardization_groups.md) |
| Syntax kind: | [Modifier](../spec/tag_kinds.md) |
<!-- prettier-ignore-end -->

## Usage

This modifier has similar semantics to the `override` keyword in C# or Java. For a member function or property,
explicitly indicates that this definition is overriding (i.e. redefining) the definition inherited from the
base class. The base class definition would normally be marked as `virtual`.

TypeScript's [override keyword](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html#override-and-the---noimplicitoverride-flag)
should be preferred over the `@override` tag, unless documentation is being generated from declaration files.

A documentation tool may enforce that the `@virtual`, `@override`, and/or `@sealed` modifiers are consistently
applied, but this is not required by the TSDoc standard.

## Example

In the code sample below, `Child.render()` overrides the virtual member `Base.render()`:

```ts
class Base {
  /** @virtual */
  public render(): void {}

  /** @sealed */
  public initialize(): void {}
}

class Child extends Base {
  /** @override */
  public render(): void;
}
```

## See also

- [@sealed](../tags/sealed.md) tag
- [@virtual](../tags/virtual.md) tag
- [C# reference: override](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/override):
  an equivalent feature from another programming language
