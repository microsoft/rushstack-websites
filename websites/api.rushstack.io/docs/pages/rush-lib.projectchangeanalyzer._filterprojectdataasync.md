---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@microsoft/rush-lib](./rush-lib.md) &gt; [ProjectChangeAnalyzer](./rush-lib.projectchangeanalyzer.md) &gt; [\_filterProjectDataAsync](./rush-lib.projectchangeanalyzer._filterprojectdataasync.md)

## ProjectChangeAnalyzer.\_filterProjectDataAsync() method

> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.
> 

**Signature:**

```typescript
_filterProjectDataAsync<T>(project: RushConfigurationProject, unfilteredProjectData: Map<string, T>, rootDir: string, terminal: ITerminal): Promise<Map<string, T>>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  project | [RushConfigurationProject](./rush-lib.rushconfigurationproject.md) |  |
|  unfilteredProjectData | Map&lt;string, T&gt; |  |
|  rootDir | string |  |
|  terminal | [ITerminal](./node-core-library.iterminal.md) |  |

**Returns:**

Promise&lt;Map&lt;string, T&gt;&gt;

