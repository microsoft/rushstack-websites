---
title: '@virtual'
---

<!-- prettier-ignore-start -->
|    |    |
| -- | -- |
| Standardization: | [Extended](../spec/standardization_groups.md) |
| Syntax kind: | [Modifier](../spec/tag_kinds.md) |
<!-- prettier-ignore-end -->

## Usage

This modifier has similar semantics to the `virtual` keyword in C# or Java. For a member function or property,
explicitly indicates that subclasses may override (i.e. redefine) the member.

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

- [@override](../tags/override.md) tag
- [@sealed](../tags/sealed.md) tag
- [C# reference: virtual](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/virtual):
  an equivalent feature from another programming language
