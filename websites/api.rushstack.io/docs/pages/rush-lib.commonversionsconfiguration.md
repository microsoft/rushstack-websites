---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@microsoft/rush-lib](./rush-lib.md) &gt; [CommonVersionsConfiguration](./rush-lib.commonversionsconfiguration.md)

## CommonVersionsConfiguration class

Use this class to load and save the "common/config/rush/common-versions.json" config file. This config file stores dependency version information that affects all projects in the repo.

**Signature:**

```typescript
export declare class CommonVersionsConfiguration 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [allowedAlternativeVersions](./rush-lib.commonversionsconfiguration.allowedalternativeversions.md) | <code>readonly</code> | Map&lt;string, ReadonlyArray&lt;string&gt;&gt; | A table that stores, for a given dependency, a list of SemVer ranges that will be accepted by "rush check" in addition to the normal version range. |
|  [filePath](./rush-lib.commonversionsconfiguration.filepath.md) | <code>readonly</code> | string | Get the absolute file path of the common-versions.json file. |
|  [implicitlyPreferredVersions](./rush-lib.commonversionsconfiguration.implicitlypreferredversions.md) | <code>readonly</code> | boolean \| undefined | <p>When set to true, for all projects in the repo, all dependencies will be automatically added as preferredVersions, except in cases where different projects specify different version ranges for a given dependency. For older package managers, this tended to reduce duplication of indirect dependencies. However, it can sometimes cause trouble for indirect dependencies with incompatible peerDependencies ranges.</p><p>If the value is <code>undefined</code>, then the default value is <code>true</code>.</p> |
|  [preferredVersions](./rush-lib.commonversionsconfiguration.preferredversions.md) | <code>readonly</code> | Map&lt;string, string&gt; | A table that specifies a "preferred version" for a given NPM package. This feature is typically used to hold back an indirect dependency to a specific older version, or to reduce duplication of indirect dependencies. |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [getAllPreferredVersions()](./rush-lib.commonversionsconfiguration.getallpreferredversions.md) |  | Returns preferredVersions. |
|  [getPreferredVersionsHash()](./rush-lib.commonversionsconfiguration.getpreferredversionshash.md) |  | Get a sha1 hash of the preferred versions. |
|  [loadFromFile(jsonFilename)](./rush-lib.commonversionsconfiguration.loadfromfile.md) | <code>static</code> | Loads the common-versions.json data from the specified file path. If the file has not been created yet, then an empty object is returned. |
|  [save()](./rush-lib.commonversionsconfiguration.save.md) |  | Writes the "common-versions.json" file to disk, using the filename that was passed to loadFromFile(). |

