---
layout: page
title: Doc comment syntax
navigation_source: docs_nav
---

API Extractor parses your TypeScript code comments to obtain documentation and additional type information.
It expects your code comments to use TSDoc format.  We won't provide a full description of the grammar here;
instead, please refer to the [TSDoc project](https://github.com/microsoft/tsdoc).)  If you've used
JSDoc for JavaScript source code, TSDoc will be very similar, but be aware that there are some syntax differences.

The TSDoc language can be extended by defining custom tags.  API Extractor's particular dialect of TSDoc is
referred to as "**AEDoc**".  (Support for TSDoc was introduced with API Extractor 6.x.  In earlier releases,
API Extractor used a proprietary syntax that was also called as "AEDoc", but this is now obsolete.)

> **TSDoc Playground**
>
> By the way, the [TSDoc Playground](https://microsoft.github.io/tsdoc/) website provides an
> interactive way to experiment with code comments to see how they will be parsed.  Give it a try!

## Which comments are parsed by API Extractor?

In order for API Extractor to parse a code comment, all of the following must be true:

- The comment must appear in the emitted .d.ts file for your class
- The comment must begin with the special `/**` delimiter (two stars)
- The comment must appears immediately before an exported declaration; OR the comment appears at the top of the
  entry point file and contains a `@packageDocumentation` tag

Note that if a declaration has multiple comment blocks, only the closest one will be considered.  For example:

```ts
/**
 * Comment for f1.
 */
export function f1(): void { }

/**
 * THIS COMMENT WILL BE IGNORED ENTIRELY.
 */

/**
 * Comment for f2.
 */
export function f2(): void { }
```

## Comment structure

The overall anatomy of a TSDoc comment has these components:

- **The summary section:** The documentation content up until the first block tag is called the "summary".
  The summary section should be brief. On a documentation web site, it will be shown on a page that lists summaries
  for many different API items.  On a detail page for a single item, the summary will be shown followed by the
  remarks section (if any).
- **The remarks block:** The "remarks" block starts with the `@remarks` block tag.  Unlike the summary, the remarks
  may contain lengthy documentation content.  The remarks section should not restate information from the summary,
  since the summary section will always be displayed wherever the remarks section appears.
- **Additional blocks:** Other TSDoc blocks typically follow the `@remarks` block.  Each block is introduced
  by a block tag such as `@param`, `@returns`, `@example`, etc.
- **Modifier tags:** The modifier tags typically come last.  Modifier tags don't have an associated block of content;
  instead, their presence indicates an aspect of the declaration.  Some examples of modifier tags are: `@public`,
  `@beta`, and `@virtual`.
- **Inline tags:** Inline tags can appear inside any section, and are always delimited by `{` and `}` characters.
  Additional content can appear after the tag name and before the `}` delimiter.  Its format is tag-specific.
  Examples of inline tags are `{@link}` and `{@inheritDoc}`.

Here's some sample code that illustrates all the various components of the doc comment syntax:

```ts
/**
 * The base class for all widgets.
 *
 * @remarks
 * For details, see {@link https://example.com/my-protocol | the protocol spec}.
 *
 * @public
 */
export abstract class BaseWidget {
  /**
   * Draws the widget.
   * @remarks
   *
   * The `draw` member implements the main rendering for a widget.
   *
   * @param force - whether to force redrawing
   * @returns true, if rendering occurred; false, if the view was already up to date
   *
   * @beta @virtual
   */
  public draw(force: boolean): boolean {
    . . .
  }

  /**
   * Whether the widget is currently visible.
   *
   * @example
   * Here's some example code to hide a widget:
   *
   * ```ts
   * let myWidget = new MyWidget();
   * myWidget.visible = false;
   * ```
   *
   * @defaultValue `true`
   */
  public visible: boolean = true;

  /**
   * Gets or set the title of this widget
   */
  public get title(): string {
    . . .
  }

  // NOTE: API Extractor considers your property getter and setter functions to be
  // a single API item.  Don't write any documentation for the setter.
  public set title(value: string) {
    . . .
  }
}
```

## Release tags

The four release tags are:  `@internal`, `@alpha`, `@beta`, `@public`.  They are applied to API items such as
classes, member functions, enums, etc.  API Extractor classifies each exported API item individually, according
to its intended level of support:

- **internal**: Indicates that an API item is meant only for usage by other NPM packages from the same maintainer.
  Third parties should never use "internal" APIs.  To emphasize this, underscore prefixes should be used for items
  with an (explicit) `@internal` tag.

- **alpha**: Indicates that an API item is eventually intended to be public, but currently is in an early stage
  of development.  Third parties should not use "alpha" APIs.

- **beta**: Indicates that an API item has been released as a preview or for experimental purposes.  Third parties
  are encouraged to try it and provide feedback.  However, a "beta" API should NOT be used in production, because
  it may be changed or removed in a future version.

- **public**:  Indicates that an API item has been officially released, and is now part of the supported contract
  for a package.  If the [SemVer](https://semver.org/) versioning scheme is used, then the API signature cannot
  be changed without a MAJOR version increment.

> NOTE: TypeScript's `public`/`protected`/`private` keywords are unrelated to the AEDoc release tags.
> For example, a member function will typically have the `public` TypeScript keyword regardless of whether
> it is classified as `@public` or `@internal` in the doc comment.

When an API is first introduced, it typically starts as **alpha**.  As the design matures, it graduates
from **alpha** --> **beta** --> **public**.  The **internal** designation is mostly used to solve plumbing problems,
and usually isn't on any road map to becoming public.  (There is also a `@deprecated` tag, but it is an option
that can be combined with any of the above tags.)

The release tag applies recursively to members of a container (e.g. class or interface).  For example, if a class
is marked as `@beta`, then all of its members automatically have this status; you DON'T need add the `@beta` tag to
each member function.  However, you could add `@internal` to a member function to give it a different release status.

> NOTE:  If a container (e.g. a class or interface) has an `@internal` tag, then an underscore prefix should be added
> to its name, but its members do NOT need underscores.  Whereas e.g. if `@internal` is applied to a member function
> of a `@beta` class, then the internal function SHOULD have an underscore prefix.

Lastly, note that certain logical rules apply.  For example, a `@public` function should not return a `@beta` type.
A `@beta` class should not inherit from an `@internal` base class.  etc.  API Extractor does not currently validate
these rules, but it will soon.

## See also

- [@internal tag]({% link pages/tsdoc/tag_internal.md %})
- [@alpha tag]({% link pages/tsdoc/tag_alpha.md %})
- [@beta tag]({% link pages/tsdoc/tag_beta.md %})
- [@public tag]({% link pages/tsdoc/tag_public.md %})
- [ae-different-release-tags]({% link pages/messages/ae-different-release-tags.md %})
- [ae-extra-release-tag]({% link pages/messages/ae-extra-release-tag.md %})
- [ae-incompatible-release-tags]({% link pages/messages/ae-incompatible-release-tags.md %})
- [ae-internal-missing-underscore]({% link pages/messages/ae-internal-missing-underscore.md %})
- [ae-internal-mixed-release-tag]({% link pages/messages/ae-internal-mixed-release-tag.md %})
