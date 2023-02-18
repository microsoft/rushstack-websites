---
layout: page
title: '@remarks'
navigation_source: docs_nav
---

**Tag type:** block tag

**TSDoc standardization:** [core](
https://github.com/microsoft/tsdoc/blob/master/tsdoc/src/details/Standardization.ts)

The main documentation for an API item is separated into a brief "summary" section, optionally followed by
a more detailed "remarks" section.  On a documentation web site, index pages (e.g. showing members of a class)
will show only the brief summaries, whereas a detail pages (e.g. describing a single member) will show the summary
followed by the remarks.  The `@remarks` block tag ends the summary section, and begins the remarks section for
a doc comment.

*NOTE: This design differs from [JSDoc's approach](http://usejsdoc.org/tags-summary.html), which uses
an optional `@summary` tag to provide a condensed restatement of the full documentation.  We experimented with
this, but found that a well-written article already contains a "summary" in its first sentence or two.*

**Usage example:**

```ts
/**
 * Represents an employee.
 *
 * @public
 */
export class Employee {
  /**
   * The employee's first name.
   *
   * @remarks
   * The first name may contain Unicode characters.
   */
  public firstName: string;

  /**
   * The employee's last name.
   *
   * @remarks
   * The last name may contain Unicode characters.
   */
  public lastName: string;

  /**
   * The employee's full name.
   *
   * @remarks
   * Returns the first name followed by the last name.
   */
  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

The index page for the class might show the summaries in tables like this:

> <span style="font-weight: 700; font-size: 24px;">Properties</span>
>
> |  Property | Modifiers | Type | Description |
> |  --- | --- | --- | --- |
> |  [firstName](#) |  | <code>string</code> | The employee's first name. |
> |  [lastName](#) |  | <code>string</code> | The employee's last name. |
>
> <span style="font-weight: 700; font-size: 24px;">Methods</span>
>
> |  Method | Modifiers | Description |
> |  --- | --- | --- |
> |  [getFullName()](#) |  | The employee's full name. |

Whereas the detail page for `getFullName()` would show the summary followed by the remarks:

> <span style="font-weight: 700; font-size: 24px;">Employee.getFullName() method</span>
>
> The employee's full name.
>
> <b>Signature:</b>
>
> ```typescript
> getFullName(): string;
> ```
> <b>Returns:</b> `string`
>
> <span style="font-weight: 700; font-size: 24px;">Remarks</span>
>
> Returns the first name followed by the last name.

## See also

- [Doc comment syntax: Comment structure]({% link pages/tsdoc/doc_comment_syntax.md %}#comment-structure)
- [@privateRemarks tag]({% link pages/tsdoc/tag_privateremarks.md %})
