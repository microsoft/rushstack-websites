---
title: '@remarks'
---

<!-- prettier-ignore-start -->
|    |    |
| -- | -- |
| Standardization: | [Core](../spec/standardization_groups.md) |
| Syntax kind: | [Block tag](../spec/tag_kinds.md) |
<!-- prettier-ignore-end -->

## Usage

The main documentation for an API item is separated into a brief "summary" section,
optionally followed by a more detailed "remarks" section. On a documentation web site,
index pages (e.g. showing members of a class) will show only the brief summaries,
whereas a detail pages (e.g. describing a single member) will show the summary followed
by the remarks. The `@remarks` block tag ends the summary section, and begins the
remarks section for a doc comment.

## Example

```ts
/**
 * The summary section should be brief. On a documentation web site,
 * it will be shown on a page that lists summaries for many different
 * API items.  On a detail page for a single item, the summary will be
 * shown followed by the remarks section (if any).
 *
 * @remarks
 *
 * The main documentation for an API item is separated into a brief
 * "summary" section optionally followed by an `@remarks` block containing
 * additional details.
 *
 * @privateRemarks
 *
 * The `@privateRemarks` tag starts a block of additional commentary that is not meant
 * for an external audience.  A documentation tool must omit this content from an
 * API reference web site.  It should also be omitted when generating a normalized
 * *.d.ts file.
 */
```

## See also

- [@privateRemarks](../tags/privateremarks.md) tag
