---
title: '@defaultValue'
---

<!-- prettier-ignore-start -->
|    |    |
| -- | -- |
| Standardization: | [Extended](../spec/standardization_groups.md) |
| Syntax kind: | [Block tag](../spec/tag_kinds.md) |
<!-- prettier-ignore-end -->

## Usage

This block tag is used to document the default value for a field or property, if a value is not assigned explicitly.

This tag should only be used with fields or properties that are members of a TypeScript `class` or `interface`.

## Example

```ts
enum WarningStyle {
  DialogBox,
  StatusMessage,
  LogOnly
}

interface IWarningOptions {
  /**
   * Determines how the warning will be displayed.
   *
   * @remarks
   * See {@link WarningStyle| the WarningStyle enum} for more details.
   *
   * @defaultValue `WarningStyle.DialogBox`
   */
  warningStyle: WarningStyle;

  /**
   * Whether the warning can interrupt a user's current activity.
   * @defaultValue
   * The default is `true` unless
   *  `WarningStyle.StatusMessage` was requested.
   */
  cancellable?: boolean;

  /**
   * The warning message
   */
  message: string;
}
```

## See also

- [RFC #27](https://github.com/microsoft/tsdoc/issues/27): `@defaultValue` to indicate a default value
