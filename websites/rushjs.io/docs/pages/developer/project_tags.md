---
title: Using project tags
---

Rush's **project tags** provide a convenient way to reference arbitrary groups of Rush projects.
Tags are applied to projects using the `"tags"` property in the **rush.json** config file.

For example:

**rush.json**

```js
  . . .
  "projects": [
    {
      "packageName": "my-controls",
      "projectFolder": "libraries/my-controls",
      "reviewCategory": "production",

      /**
        * An optional set of custom tags that can be used to select this project.
        * For example, adding "my-custom-tag" will allow this project to
        * be selected by the command "rush list --only tag:my-custom-tag"
        */
      "tags": [ "1.0.0-release", "frontend-team" ]
    },

    {
      "packageName": "my-toolchain",
      "projectFolder": "tools/my-toolchain",
      "reviewCategory": "tools",
      "tags": [ "tools" ]
    }
  ]
  . . .
```

For details about the `tag:my-custom-tag` selector syntax, see [Selecting subsets of projects](../../developer/selecting_subsets#selectors).

## Tag syntax

The tag name must be one or more words separated by hyphens, where a word may contain lowercase letters, digits,
and the period character. Some examples:

```bash
rush list --to tag:my-custom-tag
```

```bash
rush list --to tag:api-extractor.com
```

```bash
rush list --to tag:1.0.0
```

## Validating tags

Allowing arbitrary `"tags"` strings in the **rush.json** `"projects"` array is error-prone. If somebody
accidentally misspells a tag, or if they use an old tag that is now obsolete, it may take a while to discover
this mistake. You can use the `"allowedProjectTags"` setting to define a fixed list tags to be used in your monorepo.
This also provides a centralized place to document their meanings.

**rush.json**

```js
  . . .
  /**
    * This is an optional, but recommended, list of allowed tags that can be applied to Rush projects
    * using the "tags" setting in this file.  This list is useful for preventing mistakes such as misspelling,
    * and it also provides a centralized place to document your tags.  If "allowedProjectTags" list is
    * not specified, then any valid tag is allowed.  A tag name must be one or more words
    * separated by hyphens or slashes, where a word may contain lowercase ASCII letters, digits,
    * ".", and "@" characters.
    */
  "allowedProjectTags": [
    // Apply this tag to all Rush projects that are CLI tools
    "tools",

    // Apply this tag to all projects owned by our company's frontend team
    "frontend-team",

    // Use this to tag projects to be included in the QA test pass
    // for the upcoming product launch.
    "1.0.0-release"
  ],  . . .
```
