---
title: '@rushstack/heft-config-file'
---

The [@rushstack/heft-config-file](https://github.com/microsoft/rushstack/tree/main/libraries/heft-config-file)
library is the standard engine used to load Heft's config files. It provides a number of features such as:

- JSON schema validation
- `"extends"` inheritance with intuitive error messages
- Support for [rig package](../intro/rig_packages.md) resolution
- Four different `"extends"` inheritance types (append, merge, replace, computed) with preconfigured defaults
- Property inheritance directives to customize them

## Property inheritance directives

When using `"extends"` inheritance, Heft config files are generally preconfigured with an intuitive default
strategy for each JSON field. (For a real world example, take a look at the `propertyInheritance`
field from
[JestPlugin.ts](https://github.com/microsoft/rushstack/blob/9ffb14519dd42e5808e56bc2ea80c8734f5f2e5b/heft-plugins/heft-jest-plugin/src/JestPlugin.ts#L675).)

If you need a different inheritance type for a particular setting, you can add **property inheritance directives**
to your JSON file. For example, suppose that we are extending a hypothetical file with a previously defined
`exampleObject` value that is a keyed object, and a `exampleArray` value that is an array object:

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/example-config-file.schema.json",
  "extends": "base-project/config/example-config-file.json",

  "$exampleObject.inheritanceType": "merge", // valid choices are: "merge", "replace"
  "exampleObject": {
    "$exampleObjectMember.inheritanceType": "merge", // valid choices are: "merge", "replace"
    "exampleObjectMember": { ... },

    "$exampleArrayMember.inheritanceType": "append", // valid choices are: "append", "replace"
    "exampleArrayMember": [ ... ]
  },

  "$exampleArray.inheritanceType": "replace", // valid choices are: "append", "replace"
  "exampleArray": [ ... ]
}
```

Once an object is set to a `inheritanceType` of override, all sub-property `inheritanceType` values will be ignored,
since the top-most object already overrides all sub-properties.

One thing to note is that different logic is used for keyed objects versus arrays. This is to make it explicit
that arrays will be appended as-is, and no additional processing (eg. deduplicating if the array is intended
to be a set) is done during merge. If such behavior is required, it can be done on the implementation side.
Deduplicating arrays within the `@rushstack/heft-config-file` package doesn't quite make sense, since deduplicating
arrays of non-primitive objects is not easily defined.
