Monet gaetan---
title: What is TSDoc?
---

TSDoc is a proposal to standardize the doc comments used in [TypeScript](http://www.typescriptlang.org/) code, so that different tools can extract content without getting confused by each other's markup. The TSDoc notation looks pretty familiar:

```typescript
export class Statistics {
  /**
   * Returns the average of two numbers.
   *
   * @remarks
   * This method is part of the {@link core-library#Statistics | Statistics subsystem}.
   *
   * @param x - The first input number
   * @param y - The second input number
   * @returns The arithmetic mean of `x` and `y`
   *
   * @beta
   */
  public static getAverage(x: number, y: number): number {
    return (x + y) / 2.0;
  }
}
```

We are developing a library package [@microsoft/tsdoc](https://www.npmjs.com/package/@microsoft/tsdoc) that provides an open source reference implementation of a parser. Using this library is an easy way to ensure that your tool is 100% compatible with the standard.

&#x1F44B; **\*Give it a try!** The <a target="_blank" href="/play">TSDoc Playground</a> provides an interactive demo of the parser!\*

## Why do we need TSDoc?

A single source file may get analyzed by multiple tools. Here's some examples of popular tools that need to parse doc comments:

- [TypeDoc](https://github.com/TypeStrong/typedoc): an API reference generator that extracts member documentation from code comments
- [DocFX](https://dotnet.github.io/docfx/): an integrated pipeline that ingests API reference content for many different programming languages, but then applies its own Markdown renderer and custom tag parsing
- [API Extractor](https://api-extractor.com/): a build tool that tracks TypeScript API review workflows and generates \*.d.ts rollups for third-party SDKs
- [ESLint](https://eslint.org/): lint rules might look for tags such as `@virtual` or `@override`, which represent behavioral contracts to be validated
- [Visual Studio Code](https://code.visualstudio.com): an editor that supports syntax highlighting and interactive refactoring for TypeScript doc comments
- **Your own scripts!** - Developers often create build scripts that extract documentation or bundling directives from code comments

All these tools recognize a syntax that is loosely based on [JSDoc](https://jsdoc.app/), but each with its own flavor of syntax extensions. This can lead to frustrating incompatibilities.

Consider a hypothetical input:

````typescript
/**
 * @returns true if the specified tag is surrounded with `{`
 * and `}` characters.
 *
 * @example
 * Prints "true" for `{@link}` but "false" for `@internal`:
 * ```ts
 * console.log(isInlineTag('{@link}'));
 * console.log(isInlineTag('@internal'));
 * ```
 * @see {@link http://example.com/@internal | the @internal tag}
 */
declare function isInlineTag(tagName: string): boolean;
````

Is this `isInlineTag()` function marked as `@internal`? Well, API Extractor would say "no," because it recognizes many [CommonMark](https://commonmark.org/) constructs. But the TypeScript compiler would say "yes" -- even for the `@see` hypertext and URL -- because its parser treats everything as literal text.

Is the `@see` block part of the `@example`? Again, different tools behave differently depending on how they handle that tag.

In many cases, sloppy parsing mostly works. Occasional malfunctions are no big deal. But when these directives determine professional website content or build output, incorrect parsing can become a serious concern.

## Three requirements

TSDoc aims to standardize the doc comment grammar, while carefully balancing several competing design requirements:

1. **Extensibility:** Tools must be able to define their own custom tags to represent domain-specific metadata in a natural way.
2. **Interoperability:** Custom tags must not prevent other tools from correctly analyzing the comment. In order words, custom tags must use established syntax patterns that can be safely recognized and discarded during parsing.
3. **Familiar syntax:** As much as possible, TSDoc should preserve the familiar style of JSDoc/Markdown. This also maximizes the likelihood that legacy comments will parse correctly as TSDoc.

_**Why can't JSDoc be the standard?**_ The JSDoc grammar is not rigorously specified, but rather inferred from the behavior of a particular implementation. The majority of the standard JSDoc tags are preoccupied with providing type annotations for plain JavaScript, which is not a primary concern for a strongly-typed language such as TypeScript.

## Who's involved?

Implementation:

- [Pete Gonzalez](https://github.com/octogonz) created the initial concept and parser API
- [Ron Buckton](https://github.com/rbuckton) redesigned the declaration reference syntax and has been working on a rewrite of the markdown parser
- [Ian Clanton-Thuon](https://github.com/iclanton/) contributed the TSDoc Playground
- [Brian Folts](https://github.com/bafolts) contributed the **eslint-plugin-tsdoc** package for ESLint
- many other contributors who implemented features and bugfixes!

(Should your name appear here? [Suggest an update](https://github.com/microsoft/rushstack-websites/edit/main/websites/tsdoc.org/docs/index.md) to this page.)

Contributing design input:

- [TypeScript](http://www.typescriptlang.org) compiler group at Microsoft
- [API Extractor](https://api-extractor.com/) community
- [DocFX](https://dotnet.github.io/docfx/) maintainers
- [TypeDoc](http://typedoc.org) community
- [SimplrJS](https://simplrjs.com/) developers, who maintain the [ts-docs-gen](https://github.com/SimplrJS/ts-docs-gen) tool
- [Tom Dale](https://github.com/tomdale), who's working on the documentation engine for [Ember.js](https://www.emberjs.com), [Glimmer.js](https://glimmerjs.com), and other projects
- [Rob Eisenberg](https://github.com/EisenbergEffect), who's working on the documentation engine for [Aurelia](http://aurelia.io/).

## Next steps

👉 [Learn more](./pages/intro/approach.md) -- about the goals and approach

👉 [How can I use TSDoc?](./pages/intro/using_tsdoc.md) -- learn about tools and resources for developing with TSDoc
