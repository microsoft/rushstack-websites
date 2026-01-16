---
title: Selector expressions
---

## Introduction

A **selector expression** is a way to combine multiple selectors, selector parameters, and set operators to select a specific subset of projects.

For example, you may want to select all projects that _were changed in the current pull request_ and also _tagged in rush.json with the tag "app"_. You can express this as a JSON selector expression:

```json
{
  "intersect": ["git:origin/main", "tag:app"]
}
```

If you save this expression in a local file, `example.json`, you can select it on the command line:

```bash
rush build --to json:example.json
```

## Common examples

### Intersecting selections

A very common reason to use a selector expression is that you need an _intersection_ of different filters. Without an expression, you can only combine multiple selector parameters on the command line, which provides a _union_ of all selections.

The introduction above provides an example:

```json
{
  "intersect": ["git:origin/main", "tag:app"]
}
```

### Operating on a selection parameter

In addition to operating on a selector, you can _apply_ a selection parameter (like `from` or `to` or `impacted-by`) and then perform set operations on the result. For example, instead of finding changed projects tagged "app", perhaps you need the set of projects that could be _impacted by_ the changed projects, that are tagged "app".

```json
{
  "intersect": [{ "impactedBy": "git:origin/main" }, "tag:app"]
}
```

Each selection parameter from the command line is available as a JSON property in a JSON selector expression -- just remove the leading dashes and make it lower camelcase. For example, `--to-except` becomes `"toExcept"` in a selector expression.

### Listing projects

A list of named projects is technically a _set union_ of the named projects.

For example, you may have several key projects in the repo, and in a pull request, you need a list of any project that is in the dependency tree for those projects and also impacted by this pull request. That might look like this:

```json
{
  "intersect": [
    {
      "to": {
        "union": ["@acme/project1", "@acme/project2", "@acme/project3"]
      }
    },
    {
      "impactedBy": "git:origin/main"
    }
  ]
}
```

When you use this selector expression, you probably want _only_ the projects that are the result of this expression; you can obtain this from the command line like this:

```bash
rush list --only json:example.json
```

## Expression reference

### Operators

#### Union

```json
{
   "union": ["expression1", "expression2", ...]
}
```

This operator returns the union of two or more expressions (that is, it returns projects that are in at least one of the passed expressions).

#### Intersect

```json
{
   "intersect": ["expression1", "expression2", ...]
}
```

This operator returns the intersection of two or more expressions (that is, it returns only projects that are in all of the passed expressions).

#### Subtract

```json
{
   "subtract": ["expression1", "expression2", ...]
}
```

This operator returns the subtraction of two or more expressions (that is, it returns only projects that are in expression1, but not in any of the remaining expressions).

### Selection parameters

#### to

```json
{
  "to": "expression"
}
```

Filters the provided expression, using the same rules as `--to`.

#### toExcept

```json
{
  "toExcept": "expression"
}
```

Filters the provided expression, using the same rules as `--to-except`.

#### from

```json
{
  "from": "expression"
}
```

Filters the provided expression, using the same rules as `--from`.

#### impactedBy

```json
{
  "impactedBy": "expression"
}
```

Filters the provided expression, using the same rules as `--impacted-by`.

#### impactedByExcept

```json
{
  "impactedByExcept": "expression"
}
```

Filters the provided expression, using the same rules as `--impacted-by-except`.

#### only

```json
{
  "only": "expression"
}
```

This parameter is supported for completeness only, to mimic the parameter `--only`. It serves no practical purpose, and just returns the provided expression without changes.
