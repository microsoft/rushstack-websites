---
layout: page
title: '@defaultValue'
navigation_source: docs_nav
---

**Tag type:** block tag

**TSDoc standardization:** [extended](
https://github.com/microsoft/tsdoc/blob/master/tsdoc/src/details/Standardization.ts)

This tag is used to document the default value for a field or property, if a value is not assigned explicitly.
This tag should only be used with fields or properties that are members of a class or interface.

Being a block tag, `@defaultValue` introduces a TSDoc section that contains all comment text up until the
next block tag.  This content is called the "**value text**".  The value text can have various forms, for example:

- A literal value, for example: `@defaultValue 3`
- A code span, for example: <code>@defaultValue `true`</code>
- Arbitrary rich text potentially spanning multiple lines,
  for example: <br/> `@defaultValue An instance of the {@link Widget} object`

Thus, documentation templates should not assume that the value text will consist entirely of code.

**Usage example:**

```ts
export enum WarningStyle {
  DialogBox,
  StatusMessage,
  LogOnly
}

export interface IWarningOptions {
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
   *
   * @defaultValue
   * The default is `true` unless {@link WarningStyle.StatusMessage}
   * was requested.
   */
  cancellable?: boolean;

  message: string;
}
```

## See also

- [TSDoc RFC #27](https://github.com/microsoft/tsdoc/issues/27)
