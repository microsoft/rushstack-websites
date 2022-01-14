# rehype-headerless-table-plugin

A [rehype plugin](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md) that suppresses an HTML table header containing only empty table cells.

This type of table, a "headerless" table, is supported by Kramdown (a parser used by some Jekyll websites), but not by Remark. This plugin allows us to retain a "headerless table" output by following a specific markdown format.

This plugin runs after the markdown file has been parsed and translated into HTML.

## Usage

To produce a headerless table, write the following markdown:

```md
|            |            |
| ---------- | ---------- |
| My Content | My Content |
```

This markdown produces the following HTML normally:

```html
<table>
  <thead>
    <tr>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>My Content</td>
      <td>My Content</td>
    </tr>
  </tbody>
</table>
```

This plugin then transforms the above table by removing the empty `<thead>` block:

```html
<table>
  <tbody>
    <tr>
      <td>My Content</td>
      <td>My Content</td>
    </tr>
  </tbody>
</table>
```

## TODO

Note that Docusaurus uses an older version of `unist-util-visit`, because later versions are distributed only as ESM modules. However, the typings included in this old version are not as good, so this plugin may include a few small typing shims to compensate.
