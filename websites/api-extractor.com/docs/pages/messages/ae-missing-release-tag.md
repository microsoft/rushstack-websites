---
title: ae-missing-release-tag
---

_"\_\_\_ is part of the package's API, but it is missing a release tag (@alpha, @beta, @public, or @internal)."_

## Remarks

API Extractor uses release tags to track the maturity of your API. By default, it requires every declaration
in your API to have a release tag.

Example:

```ts
/**
 * The widget class
 */
export class Widget {
  // <-- missing release tag
  /** Renders the widget */
  public render(): void {}
}

// Warning: "Widget" is part of the package's API, but it is missing
// a release tag (@alpha, @beta, @public, or @internal)
```

We can fix this warning by adding the `@public` release tag like this:

```ts
/**
 * The widget class
 * @public
 */
export class Widget {
  /** Renders the widget */
  public render(): void {
    // <-- release tag not required
  }
}
```

Note that release tags are inherited from containers of nested declarations. Thus, `ae-missing-release-tag` only
considers the outermost container.

The `ae-missing-release-tag` validation may seem a little cumbersome at first. However, requiring explicit release tags
has several benefits:

- It makes the visibility immediately obvious when reading code. For example, in a PR diff, the reviewer may
  not be able to see the entry point, but the release tag clearly signals that this class should get special
  attention. It is part of your API signature.

- When adding a new API, choosing a release tag requires the person to stop and think about visibility: How mature
  is this API design? Should it really be `@public`, or should we maybe start with `@alpha` or `@beta`?

- It avoids accidents. For example, it might be embarrassing to be browsing your API web site one day, and
  discover an internal class that got included unintentionally. The content may have been generated from private
  code comments that nobody intended to share with a public audience!

## How to fix

Fix this issue by adding a release tag to the comment.

Alternatively, if you really don't want to require explicit release tags, you can disable the `ae-missing-release-tag`
validation by adding a section like this to your **api-extractor.json** file:

```js
  "messages": {
    "extractorMessageReporting": {
      "ae-missing-release-tag": {
        "logLevel": "none"
      }
    }
  }
```

## See also

- [api-extractor.json config file]({% link pages/configs/api-extractor_json.md %}#message-reporting-section)
- [Doc comment syntax: Release tags]({% link pages/tsdoc/doc_comment_syntax.md %}#release-tags)
