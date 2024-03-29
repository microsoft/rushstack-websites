---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@rushstack/package-deps-hash](./package-deps-hash.md) &gt; [getRepoRoot](./package-deps-hash.getreporoot.md)

## getRepoRoot() function

> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.
> 

Finds the root of the current Git repository

**Signature:**

```typescript
export declare function getRepoRoot(currentWorkingDirectory: string, gitPath?: string): string;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  currentWorkingDirectory | string | The working directory for which to locate the repository |
|  gitPath | string | _(Optional)_ The path to the Git executable |

**Returns:**

string

The full path to the root directory of the Git repository

