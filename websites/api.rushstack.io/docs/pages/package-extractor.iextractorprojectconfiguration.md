---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@rushstack/package-extractor](./package-extractor.md) &gt; [IExtractorProjectConfiguration](./package-extractor.iextractorprojectconfiguration.md)

## IExtractorProjectConfiguration interface

The extractor configuration for individual projects.

**Signature:**

```typescript
export interface IExtractorProjectConfiguration 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [additionalDependenciesToInclude?](./package-extractor.iextractorprojectconfiguration.additionaldependenciestoinclude.md) |  | string\[\] | _(Optional)_ The names of additional dependencies to include when extracting this project. |
|  [additionalProjectsToInclude?](./package-extractor.iextractorprojectconfiguration.additionalprojectstoinclude.md) |  | string\[\] | _(Optional)_ The names of additional projects to include when extracting this project. |
|  [dependenciesToExclude?](./package-extractor.iextractorprojectconfiguration.dependenciestoexclude.md) |  | string\[\] | _(Optional)_ The names of additional dependencies to exclude when extracting this project. |
|  [patternsToExclude?](./package-extractor.iextractorprojectconfiguration.patternstoexclude.md) |  | string\[\] | _(Optional)_ A list of glob patterns to exclude when extracting this project. If a path is matched by both "patternsToInclude" and "patternsToExclude", the path will be excluded. If undefined, no paths will be excluded. |
|  [patternsToInclude?](./package-extractor.iextractorprojectconfiguration.patternstoinclude.md) |  | string\[\] | _(Optional)_ A list of glob patterns to include when extracting this project. If a path is matched by both "patternsToInclude" and "patternsToExclude", the path will be excluded. If undefined, all paths will be included. |
|  [projectFolder](./package-extractor.iextractorprojectconfiguration.projectfolder.md) |  | string | The absolute path to the project. |
|  [projectName](./package-extractor.iextractorprojectconfiguration.projectname.md) |  | string | The name of the project. |

