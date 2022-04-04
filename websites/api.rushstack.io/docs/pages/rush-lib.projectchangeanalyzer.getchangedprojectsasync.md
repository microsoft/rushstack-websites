---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---

<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@microsoft/rush-lib](./rush-lib.md) &gt; [ProjectChangeAnalyzer](./rush-lib.projectchangeanalyzer.md) &gt; [getChangedProjectsAsync](./rush-lib.projectchangeanalyzer.getchangedprojectsasync.md)

## ProjectChangeAnalyzer.getChangedProjectsAsync() method

> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.

Gets a list of projects that have changed in the current state of the repo when compared to the specified branch, optionally taking the shrinkwrap and settings in the rush-project.json file into consideration.

<b>Signature:</b>

```typescript
getChangedProjectsAsync(options: IGetChangedProjectsOptions): Promise<Set<RushConfigurationProject>>;
```

## Parameters

| Parameter | Type                                                                   | Description |
| --------- | ---------------------------------------------------------------------- | ----------- |
| options   | [IGetChangedProjectsOptions](./rush-lib.igetchangedprojectsoptions.md) |             |

<b>Returns:</b>

Promise&lt;Set&lt;[RushConfigurationProject](./rush-lib.rushconfigurationproject.md) &gt;&gt;