---
title: '@microsoft/tsdoc'
---

[NPM package](https://www.npmjs.com/package/@microsoft/tsdoc)<br/>
[CHANGELOG.md](https://github.com/microsoft/tsdoc/blob/main/tsdoc/CHANGELOG.md)

The **@microsoft/tsdoc** package is the reference implementation of a parser for the TSDoc syntax.
You cannot use it directly. It is an engine component intended to be incorporated into
[other documentation tools](../intro/using_tsdoc.md).

If you are implementing a tool that needs to extract information from TypeScript code comments,
**@microsoft/tsdoc** provides an easy solution that will correctly implement TSDoc.

## Can't I just use a RegExp?

Suppose we are analyzing a TypeScript code comment such as this:

**input example 1:**

```ts
/**
 * This API calculates the average of a list of numbers.
 *
 * @param list - the array of input numbers
 * @returns the arithmetic mean, or 0 if `list` is an empty array
 *
 * @internal
 */
```

Let's say we're making a documentation tool, and we want to analyze whether this comment was tagged as `@internal`.
We could forget about fancy parsers and do a simple test like this:

```ts
function isApiInternal(docComment: string): boolean {
  return docComment.indexOf('@internal') >= 0;
}
```

But we'll quickly notice some potential edge cases would not be detected correctly:

**input example 2:**

```ts
/**
 * @internalDefault
 */
```

**input example 3:**

```ts
/**
 * For more information, please contact support@internalwebsite.com.
 */
```

No problem! A regular expression can distinguish `@internal` from words containing it:

```ts
function isApiInternal(docComment: string): boolean {
  return /(^|\s)@internal(\s|$)/.test(docComment);
}
```

But TypeScript doc comments support many other syntaxes which are not so easy to handle.
Jumping straight to an advanced case, think about what the doc comment might look like for our
own `isApiInternal()` function. (If our documentation tool is any good, surely it should be able to
document its own APIs!)

**input example 4:**

````ts
/**
 * Returns `true` if a comment string contains the
 * {@link http://tsdoc.org/pages/tags/internal | @internal tag}.
 *
 * @example
 * ```ts
 * // Prints "true" if comment contains "@internal"
 * console.log(isApiInternal(input));
 * ```
 */
````

The `@internal` substring appears twice in example 4, but neither of these usages was meant to designate
`isApiInternal()` itself as being an internal API. The first case is inside a `{@link}` tag, and the second case
is inside an example code block. If you try to expand the RegExp, you will find that the edge cases quickly
become insurmountable. (Regular expressions don't work because Markdown is not a
[regular language](https://en.wikipedia.org/wiki/Chomsky_hierarchy#The_hierarchy). It is not even a
context-free grammar.)

This leads to a couple insights:

- In order to correctly analyze doc comments, you need a proper parser
- Different parsers can disagree about a basic question like _"Is this API tagged as `@internal` or not?"_
  For example, if a parser doesn't support ` ``` ` code blocks, then it would misinterpret the above input.

## Invoking the TSDoc parser

Here's how we might implement `isApiInternal()` using the **@microsoft/tsdoc** engine:

````ts
import { TSDocParser, ParserContext } from '@microsoft/tsdoc';

function isApiInternal(docComment: string): boolean {
  const tsdocParser: TSDocParser = new TSDocParser();

  // Analyze the input doc comment
  const parserContext: ParserContext = tsdocParser.parseString(docComment);

  // Check for any syntax errors
  if (parserContext.log.messages.length > 0) {
    throw new Error('Syntax error: ' + parserContext.log.messages[0].text);
  }

  // Since "@internal" is a standardized tag and a "modifier", it is automatically
  // added to the modifierTagSet:
  return parserContext.docComment.modifierTagSet.isInternal();
}

const input: string = [
  '/**',
  ' * @ Returns `true` if a comment string contains the',
  ' * {@link http://tsdoc.org/pages/tags/internal | @internal tag}.',
  ' *',
  ' * @example',
  ' * ```ts',
  ' * // Prints "true" if comment contains "@internal"',
  ' * console.log(isApiInternal(input));',
  ' * ```',
  ' */'
].join('\n');

// Prints "false" because the two "@internal" usages in our example are embedded
// in other constructs, and thus should not be interpreted as tags.
console.log(isApiInternal(input));
````

The library provides a number of other nice features:

- It tracks source code coordinates for every input token. This enables precise error messages
  for every token, and can be used to implement [syntax highlighting](https://github.com/microsoft/tsdoc/blob/main/playground/src/SyntaxStyler/DocNodeSyntaxStyler.ts).

- It provides an Abstract Syntax Tree that makes it easy
  to [render rich text](https://github.com/microsoft/tsdoc/blob/26c4bab8efb04bc5d1619585e1f071bcc10cf16a/playground/src/DocHtmlView.tsx#L140)
  in other formats such as HTML

- The parser supports custom tags

- Error messages returned by the parser can be filtered, for example if you want to ignore warnings that are
  not relevant to your scenario

## Invoking the TSDoc parser

The [api-demo folder](https://github.com/microsoft/tsdoc/tree/main/api-demo) provides a more complete example.
It also contains an "advanced" example, illustrating how to interface TSDoc with the parse tree returned by
the TypeScript compiler engine.
