---
layout: page
title: '@virtual'
navigation_source: docs_nav
---

| Standardization: | [Extended]({% link pages/spec/standardization_groups.md %}) |
| Syntax kind: | [Modifier]({% link pages/spec/tag_kinds.md %}) |

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

- [@override]({% link pages/tags/override.md %}) tag
- [@sealed]({% link pages/tags/sealed.md %}) tag
- [C# reference: virtual](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/virtual):
  an equivalent feature from another programming language
