---
title: '@internal'
---

**Tag type:** modifier

**TSDoc standardization:** [discretionary](https://github.com/microsoft/tsdoc/blob/main/tsdoc/src/details/Standardization.ts)

The `@internal` modifier is one of the four **release tags**. It indicates that an API item is meant only for usage
by other NPM packages from the same maintainer. Third parties should never use "internal" APIs. To emphasize this,
an underscore prefix should be used in the name of a declaration with an (explicit) `@internal` tag. API Extractor
validates this naming convention and will report
[ae-internal-missing-underscore](../messages/ae-internal-missing-underscore.md) if the underscore
is missing.

**Usage example:**

```ts
/**
 * This is some example documentation.
 * @internal
 */
export function _doSomething(): void {}
```

## See also

- [Doc comment syntax: Release tags](../tsdoc/doc_comment_syntax.md#release-tags)
- [The .d.ts rollup](../overview/demo_rollup.md)
- [ae-internal-missing-underscore](../messages/ae-internal-missing-underscore.md)
