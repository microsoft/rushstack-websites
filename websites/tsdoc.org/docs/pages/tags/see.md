---
layout: page
title: '@see'
navigation_source: docs_nav
---

| Standardization: | [Extended]({% link pages/spec/standardization_groups.md %}) |
| Syntax kind: | [Block tag]({% link pages/spec/tag_kinds.md %}) |

## Usage

Used to build a list of references to an API item or other resource that may be related to the
current item.

> Note: JSDoc attempts to automatically hyperlink the text immediately after `@see`. Because this is ambiguous
> with plain text, TSDoc instead requires an explicit `{@link}` tag to make hyperlinks.

## Example

```ts
/**
 * Parses a string containing a Uniform Resource Locator (URL).
 * @see {@link ParsedUrl} for the returned data structure
 * @see {@link https://tools.ietf.org/html/rfc1738|RFC 1738}
 * for syntax
 * @see your developer SDK for code samples
 * @param url - the string to be parsed
 * @returns the parsed result
 */
function parseURL(url: string): ParsedUrl;
```

`@see` is a block tag. Each block becomes an item in the list of references. For example, a documentation
system might render the above blocks as follows:

```markdown
`function parseURL(url: string): ParsedUrl;`

Parses a string containing a Uniform Resource Locator (URL).

## See Also

- ParsedUrl for the returned data structure
- RFC 1738 for syntax
- your developer SDK for code samples
```

## See also

- [RFC #235](https://github.com/microsoft/tsdoc/issues/235):
  `@see` block tag specifies an item for a "See Also" section
