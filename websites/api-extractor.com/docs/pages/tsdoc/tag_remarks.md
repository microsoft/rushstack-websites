---
title: '@remarks'
---

**Tag type:** block tag

**TSDoc standardization:** [core](https://github.com/microsoft/tsdoc/blob/master/tsdoc/src/details/Standardization.ts)

The main documentation for an API item is separated into a brief "summary" section, optionally followed by
a more detailed "remarks" section. On a documentation web site, index pages (e.g. showing members of a class)
will show only the brief summaries, whereas a detail pages (e.g. describing a single member) will show the summary
followed by the remarks. The `@remarks` block tag ends the summary section, and begins the remarks section for
a doc comment.

_NOTE: This design differs from [JSDoc's approach](http://jsdoc.app/tags-summary.html), which uses
an optional `@summary` tag to provide a condensed restatement of the full documentation. We experimented with
this, but found that a well-written article already contains a "summary" in its first sentence or two._

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

> <div style={{fontWeight: 'bold', fontSize: '24px'}}>Properties</div>
>
> | Property       | Modifiers | Type                | Description                |
> | -------------- | --------- | ------------------- | -------------------------- |
> | [firstName](#) |           | <code>string</code> | The employee's first name. |
> | [lastName](#)  |           | <code>string</code> | The employee's last name.  |
>
> <div style={{fontWeight: 'bold', fontSize: '24px', paddingTop: '1rem'}}>Methods</div>
>
> | Method             | Modifiers | Description               |
> | ------------------ | --------- | ------------------------- |
> | [getFullName()](#) |           | The employee's full name. |

Whereas the detail page for `getFullName()` would show the summary followed by the remarks:

> <div style={{fontWeight: 'bold', fontSize: '24px'}}>Employee.getFullName() method</div>
>
> The employee's full name.
>
> <b>Signature:</b>
>
> ```typescript
> getFullName(): string;
> ```
>
> <b>Returns:</b> `string`
>
> <div style={{fontWeight: 'bold', fontSize: '24px', paddingTop: '1rem'}}>Remarks</div>
>
> Returns the first name followed by the last name.

## See also

- [Doc comment syntax: Comment structure](../tsdoc/doc_comment_syntax.md#comment-structure)
- [@privateRemarks tag](../tsdoc/tag_privateremarks.md)
