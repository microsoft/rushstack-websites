---
hide_title: true
custom_edit_url: null
pagination_prev: null
pagination_next: null
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@rushstack/rig-package](./rig-package.md) &gt; [IRigConfig](./rig-package.irigconfig.md)

## IRigConfig interface

This is the main API for loading the `config/rig.json` file format.

**Signature:**

```typescript
export interface IRigConfig 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [filePath](./rig-package.irigconfig.filepath.md) | <code>readonly</code> | string | The full path to the <code>rig.json</code> file that was found, or <code>&quot;&quot;</code> if none was found. |
|  [projectFolderOriginalPath](./rig-package.irigconfig.projectfolderoriginalpath.md) | <code>readonly</code> | string | The project folder path that was passed to [RigConfig.loadForProjectFolder()](./rig-package.rigconfig.loadforprojectfolder.md)<></>, which maybe an absolute or relative path. |
|  [projectFolderPath](./rig-package.irigconfig.projectfolderpath.md) | <code>readonly</code> | string | The absolute path for the project folder path that was passed to [RigConfig.loadForProjectFolder()](./rig-package.rigconfig.loadforprojectfolder.md)<></>. |
|  [relativeProfileFolderPath](./rig-package.irigconfig.relativeprofilefolderpath.md) | <code>readonly</code> | string | The relative path to the rig profile specified by <code>rig.json</code>, or <code>&quot;&quot;</code> if the file was not found. |
|  [rigFound](./rig-package.irigconfig.rigfound.md) | <code>readonly</code> | boolean | Returns <code>true</code> if <code>config/rig.json</code> was found, or <code>false</code> otherwise. |
|  [rigPackageName](./rig-package.irigconfig.rigpackagename.md) | <code>readonly</code> | string | The <code>&quot;rigPackageName&quot;</code> field from <code>rig.json</code>, or <code>&quot;&quot;</code> if the file was not found. |
|  [rigProfile](./rig-package.irigconfig.rigprofile.md) | <code>readonly</code> | string | The <code>&quot;rigProfile&quot;</code> value that was loaded from <code>rig.json</code>, or <code>&quot;&quot;</code> if the file was not found. |

## Methods

|  Method | Description |
|  --- | --- |
|  [getResolvedProfileFolder()](./rig-package.irigconfig.getresolvedprofilefolder.md) | Performs Node.js module resolution to locate the rig package folder, then returns the absolute path of the rig profile folder specified by <code>rig.json</code>. |
|  [getResolvedProfileFolderAsync()](./rig-package.irigconfig.getresolvedprofilefolderasync.md) | An async variant of [IRigConfig.getResolvedProfileFolder()](./rig-package.irigconfig.getresolvedprofilefolder.md) |
|  [tryResolveConfigFilePath(configFileRelativePath)](./rig-package.irigconfig.tryresolveconfigfilepath.md) | This lookup first checks for the specified relative path under <code>projectFolderPath</code>; if it does not exist there, then it checks in the resolved rig profile folder. If the file is found, its absolute path is returned. Otherwise, <code>undefined</code> is returned. |
|  [tryResolveConfigFilePathAsync(configFileRelativePath)](./rig-package.irigconfig.tryresolveconfigfilepathasync.md) | An async variant of [IRigConfig.tryResolveConfigFilePath()](./rig-package.irigconfig.tryresolveconfigfilepath.md) |

