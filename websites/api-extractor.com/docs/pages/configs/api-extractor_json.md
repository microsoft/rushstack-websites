---
title: api-extractor.json
---

API Extractor's behavior is controlled by a config file **api-extractor.json** that is stored with your project.
You can use the [api-extractor init](../commands/api-extractor_init.md) command to create a template
file to get you started. The template will contain comments describing each setting. It is based on
[api-extractor-template.json](https://github.com/microsoft/rushstack/blob/main/apps/api-extractor/src/schemas/api-extractor-template.json)
from the source code.

The individual JSON fields are documented below.

- TOC
  {:toc}

## Top-level Settings

### extends

Examples:

```js
  "extends": "./shared/api-extractor-base.json",
```

```js
  "extends": "my-package/include/api-extractor-base.json",
```

**Default value:** `""`

**Supported tokens:** none

Optionally specifies another JSON config file that this file extends from. This provides a way for
standard settings to be shared across multiple projects.

If the path starts with `./` or `../`, the path is resolved relative to the folder of the file that contains the
`extends` field. Otherwise, the first path segment is interpreted as an NPM package name, and will be resolved using
NodeJS `require()`.

### projectFolder

Example:

```js
  "projectFolder": "..",
```

**Default value:** `"<lookup>"`

**Supported tokens:** `<lookup>`

Determines the `<projectFolder>` token that can be used with other config file settings. The project folder typically
contains the **tsconfig.json** and **package.json** config files, but the path is user-defined.

The path is resolved relative to the folder of the config file that contains the setting.

The default value for `projectFolder` is the token `<lookup>`, which means the folder is determined by traversing
parent folders, starting from the folder containing api-extractor.json, and stopping at the first folder that contains
a **tsconfig.json** file. If a **tsconfig.json** file cannot be found in this way, then an error will be reported.

### mainEntryPointFilePath

**(REQUIRED)**

Example:

```js
  "mainEntryPointFilePath": "<projectFolder>/lib/index.d.ts",
```

**Supported tokens:** `<projectFolder>`, `<packageName>`, `<unscopedPackageName>`

Specifies the .d.ts file to be used as the starting point for analysis. API Extractor analyzes the symbols exported
by this module.

The file extension must be ".d.ts" and not ".ts".

The path is resolved relative to the folder of the config file that contains the setting; to change this,
prepend a folder token such as `<projectFolder>`.

### bundledPackages

Example:

```js
  "bundledPackages": [ "library2" ],
```

A list of NPM package names whose exports should be treated as part of this package.

For example, suppose that API extractor is run on the project `library1`, and Webpack is used to generate a distributed
bundle `library1.js` that embeds another NPM package `library2`. Some types from `library2` may become part
of the exported API for `library1`, but by default API Extractor would generate a .d.ts rollup that explicitly
imports `library2`. To avoid this, we can specify `"bundledPackages": [ "library2" ]` as shown above.
This would direct API Extractor to embed those types directly in the .d.ts rollup `library1.d.ts`, as if they had
been local files for `library1`.

### newlineKind

Example:

```js
  "newlineKind": "lf",
```

**Default value:** `"crlf"`

Specifies what type of newlines API Extractor should use when writing output files. By default, the output files
will be written with Windows-style newlines. To use POSIX-style newlines, specify `"lf"` instead. To use the OS's default
newline kind, specify `"os"`.

### testMode

Example:

```js
  "testMode": true,
```

**Default value:** `false`

Set to true when invoking API Extractor's test harness. When `testMode` is true, the `toolVersion` field in the
.api.json file is assigned an empty string to prevent spurious diffs in output files tracked for tests.

### enumMemberOrder

Example:

```js
  "enumMemberOrder": "preserve",
```

**Default value:** `"by-name"`

Specifies how API Extractor sorts members of an enum when generating api.json. By default, the output files
will be sorted alphabetically, which is `"by-name"`. To keep the ordering in the source code, specify `"preserve"`.

## Compiler Section

Determines how the TypeScript compiler engine will be invoked by API Extractor.

### compiler.tsconfigFilePath

Example:

```js
  "tsconfigFilePath": "<projectFolder>/tsconfig.json",
```

**Default value:** `"<projectFolder>/tsconfig.json"`

**Supported tokens:** `<projectFolder>`, `<packageName>`, `<unscopedPackageName>`

Specifies the path to the tsconfig.json file to be used by API Extractor when analyzing the project.

The path is resolved relative to the folder of the config file that contains the setting; to change this, prepend
a folder token such as `<projectFolder>`.

Note: This setting will be ignored if `overrideTsconfig` is used.

### compiler.overrideTsconfig

Example:

```js
  "compiler": {
    . . .
    "overrideTsconfig": {
      "$schema": "http://json.schemastore.org/tsconfig",

      "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "declaration": true,
        "sourceMap": true,
        "declarationMap": true,
        "outDir": "lib"
      },
      "include": [
        "src/**/*.ts"
      ]
    },
    . . .
  }
```

**Default value:** _no overrideTsconfig section_

**Supported tokens:** `<projectFolder>`, `<packageName>`, `<unscopedPackageName>`

Provides a compiler configuration that will be used instead of reading the **tsconfig.json** file from disk. The object
must conform to the [TypeScript tsconfig schema](http://json.schemastore.org/tsconfig).

If omitted, then the **tsconfig.json** file will be read from the `projectFolder`.

### compiler.skipLibCheck

Example:

```js
  "compiler": {
    . . .
    "skipLibCheck": true
  }
```

**Default value:** `false`

This option causes the compiler to be invoked with the `--skipLibCheck` option. This option is not recommended and
may cause API Extractor to produce incomplete or incorrect declarations, but it may be required when dependencies
contain declarations that are incompatible with the TypeScript engine that API Extractor uses for its analysis.
Where possible, the underlying issue should be fixed rather than relying on `skipLibCheck`.

## API Report Section

Configures how the API report file (\*.api.md) will be generated.

### apiReport.enabled

**(REQUIRED)**

Example:

```js
  "apiReport": {
    "enabled": true,
    . . .
  }
```

Whether to generate an API report.

### apiReport.reportFileName

Example:

```js
  "apiReport": {
    . . .
    "reportFileName": "<unscopedPackageName>.api.md",
    . . .
  }
```

**Default value:** `"<unscopedPackageName>.api.md"`

**Supported tokens:** `<packageName>`, `<unscopedPackageName>`

The filename for the API report files. It will be combined with `reportFolder` or `reportTempFolder` to produce
a full output filename.

The file extension should be `.api.md`, and the string should not contain a path separator such as `\` or `/`.

### apiReport.reportFolder

Example:

```js
  "apiReport": {
    . . .
    "reportFolder": "<projectFolder>/etc/",
    . . .
  }
```

**Default value:** `"<projectFolder>/etc/"`

**Supported tokens:** `<projectFolder>`, `<packageName>`, `<unscopedPackageName>`

Specifies the folder where the API report file is written. The file name portion is determined by
the `reportFileName` setting.

The API report file is normally tracked by Git. Changes to it can be used to trigger a branch policy, e.g. for
an API review.

The path is resolved relative to the folder of the config file that contains the setting; to change this,
prepend a folder token such as `<projectFolder>`.

### apiReport.reportTempFolder

Example:

```js
  "apiReport": {
    . . .
    "reportTempFolder": "<projectFolder>/temp/",
    . . .
  }
```

**Default value:** `"<projectFolder>/temp/"`

**Supported tokens:** `<projectFolder>`, `<packageName>`, `<unscopedPackageName>`

Specifies the folder where the temporary report file is written. The file name portion is determined by
the `reportFileName` setting.

After the temporary file is written to disk, it is compared with the file in the `reportFolder`.
If they are different, a production build will fail.

The path is resolved relative to the folder of the config file that contains the setting; to change this,
prepend a folder token such as `<projectFolder>`.

### apiReport.includeForgottenExports

Example:

```js
  "apiReport": {
    . . .
    "includeForgottenExports": true,
    . . .
  }
```

**Default value:** `false`

Whether "forgotten exports" should be included in the API report file. Forgotten exports are declarations
flagged with [ae-forgotten-export](../messages/ae-forgotten-export.md) warnings.

## Doc Model Section

Configures how the doc model file (\*.api.json) will be generated.

### docModel.enabled

**(REQUIRED)**

Example:

```js
  "docModel": {
    "enabled": true,
    . . .
  }
```

Whether to generate a doc model file.

### docModel.apiJsonFilePath

Example:

```js
  "docModel": {
    . . .
    "apiJsonFilePath": "<projectFolder>/temp/<unscopedPackageName>.api.json",
    . . .
  }
```

**Default value:** `"<projectFolder>/temp/<unscopedPackageName>.api.json"`

**Supported tokens:** `<projectFolder>`, `<packageName>`, `<unscopedPackageName>`

The output path for the doc model file. The file extension should be `.api.json`.

The path is resolved relative to the folder of the config file that contains the setting; to change this,
prepend a folder token such as `<projectFolder>`.

### docModel.includeForgottenExports

Example:

```js
  "docModel": {
    . . .
    "includeForgottenExports": true,
    . . .
  }
```

**Default value:** `false`

Whether "forgotten exports" should be included in the doc model file. Forgotten exports are declarations
flagged with [ae-forgotten-export](../messages/ae-forgotten-export.md) warnings.

## .d.ts Rollup Section

Configures how the .d.ts rollup file will be generated.

### dtsRollup.enabled

**(REQUIRED)**

Example:

```js
  "dtsRollup": {
    "enabled": true,
    . . .
  }
```

Whether to generate the .d.ts rollup file.

### dtsRollup.untrimmedFilePath

Example:

```js
  "dtsRollup": {
    . . .
    "untrimmedFilePath": "<projectFolder>/dist/<unscopedPackageName>.d.ts",
    . . .
  }
```

**Default value:** `"<projectFolder>/dist/<unscopedPackageName>.d.ts"`

**Supported tokens:** `<projectFolder>`, `<packageName>`, `<unscopedPackageName>`

Specifies the output path for a .d.ts rollup file to be generated without any trimming.
This file will include all declarations that are exported by the main entry point.

If the path is an empty string, then this file will not be written.

The path is resolved relative to the folder of the config file that contains the setting; to change this,
prepend a folder token such as `<projectFolder>`.

### dtsRollup.betaTrimmedFilePath

Example:

```js
  "dtsRollup": {
    . . .
    "betaTrimmedFilePath": "<projectFolder>/dist/<unscopedPackageName>-beta.d.ts",
    . . .
  }
```

**Default value:** `""`

**Supported tokens:** `<projectFolder>`, `<packageName>`, `<unscopedPackageName>`

Specifies the output path for a .d.ts rollup file to be generated with trimming for a "beta" release.
This file will include only declarations that are marked as `@public` or `@beta`.

If the path is an empty string, then this file will not be written.

The path is resolved relative to the folder of the config file that contains the setting; to change this,
prepend a folder token such as `<projectFolder>`.

### dtsRollup.publicTrimmedFilePath

Example:

```js
  "dtsRollup": {
    . . .
    "publicTrimmedFilePath": "<projectFolder>/dist/<unscopedPackageName>-public.d.ts",
    . . .
  }
```

**Default value:** `""`

**Supported tokens:** `<projectFolder>`, `<packageName>`, `<unscopedPackageName>`

Specifies the output path for a .d.ts rollup file to be generated with trimming for a "public" release.
This file will include only declarations that are marked as `@public`.

If the path is an empty string, then this file will not be written.

The path is resolved relative to the folder of the config file that contains the setting; to change this,
prepend a folder token such as `<projectFolder>`.

### dtsRollup.omitTrimmingComments

Example:

```js
  "dtsRollup": {
    . . .
    "omitTrimmingComments": true,
    . . .
  }
```

**Default value:** `false`

When a declaration is trimmed, by default it will be replaced by a code comment such as
`Excluded from this release type: exampleMember`. Set `omitTrimmingComments` to true to remove the
declaration completely.

## TSDoc Metadata Section

Configures how the **tsdoc-metadata.json** file will be generated.

### tsdocMetadata.enabled

Example:

```js
  "tsdocMetadata": {
    "enabled": true,
    . . .
  }
```

**Default value:** `true`

Whether to generate the **tsdoc-metadata.json** file.

### tsdocMetadata.tsdocMetadataFilePath

Example:

```js
  "tsdocMetadata": {
    . . .
    "tsdocMetadataFilePath": "<projectFolder>/dist/tsdoc-metadata.json",
    . . .
  }
```

**Default value:** `"<lookup>"`

**Supported tokens:** `<projectFolder>`, `<packageName>`, `<unscopedPackageName>`

Specifies where the TSDoc metadata file should be written.

The path is resolved relative to the folder of the config file that contains the setting; to change this,
prepend a folder token such as `<projectFolder>`.

The default value is `<lookup>`, which causes the path to be automatically inferred from the `tsdocMetadata`,
`typings` or `main` fields of the project's package.json. If none of these fields are set, the lookup
falls back to `tsdoc-metadata.json` in the package folder.

## Message Reporting Section

Configures how API Extractor reports error and warning messages produced during analysis.

There are three sources of messages: compiler messages, API Extractor messages, and TSDoc messages.

### messages.\<section\>.\<rule\>.logLevel

Example:

```js
  "messages": {
    "compilerMessageReporting": {
      "default": {
        // Treat compiler messages as errors instead of warnings
        "logLevel": "error"
      }
    },
    . . .
  }
```

**Default value:** `"warning"`

**Possible values:** `"error"`, `"warning"`, `"none"`

Specifies whether the message should be written to the the tool's output log. Note that
the `addToApiReportFile` property may supersede this option.

Errors cause the build to fail and return a nonzero exit code. Warnings cause a production build fail
and return a nonzero exit code. For a non-production build (e.g. when `api-extractor run` includes
the `--local` option), the warning is displayed but the build will not fail.

### messages.\<section\>.\<rule\>.addToApiReportFile

Example:

```js
  "messages": {
    "compilerMessageReporting": {
      "default": {
        "logLevel": "warning",

         // Don't break the build over compiler issues; instead write them to the API report
        "addToApiReportFile": true
      }
    },
    . . .
  }
```

**Default value:** `false`

When `addToApiReportFile` is true: If API Extractor is configured to write an API report file (.api.md),
then the message will be written inside that file; otherwise, the message is instead logged according to
the `logLevel` option.

### messages.compilerMessageReporting

Example:

```js
  "messages": {
    "compilerMessageReporting": {
      "TS2551": {
        // Ignore TypeScript error TS2551 ("Property ___ does not exist on type ___")
        "logLevel": "none"
      }
    },
    . . .
  }
```

**Default value:**

```js
  "messages": {
    "compilerMessageReporting": {
      "default": {
        "logLevel": "warning"
      }
    },
    . . .
  }
```

Configures handling of diagnostic messages reported by the TypeScript compiler engine while analyzing
the input .d.ts files.

TypeScript message identifiers start with `TS` followed by an integer. For example: `TS2551`

### messages.extractorMessageReporting

Example:

```js
  "messages": {
    . . .
    "extractorMessageReporting": {
      "ae-extra-release-tag": {
        // Completely disable the "ae-extra-release-tag" validation
        "logLevel": "none"
      },
    },
    . . .
  }
```

**Default value:**

_(See [api-extractor-defaults.json](https://github.com/microsoft/rushstack/blob/main/apps/api-extractor/src/schemas/api-extractor-defaults.json)
for the complete up-to-date table.)_

```js
  "messages": {
    . . .
    "extractorMessageReporting": {
      "default": {
        "logLevel": "warning"
      },
      "ae-forgotten-export": {
        "logLevel": "warning",
        "addToApiReportFile": true
      },
      "ae-incompatible-release-tags": {
        "logLevel": "warning",
        "addToApiReportFile": true
      },
      "ae-internal-missing-underscore": {
        "logLevel": "warning",
        "addToApiReportFile": true
      },
      "ae-unresolved-inheritdoc-reference": {
        "logLevel": "warning",
        "addToApiReportFile": true
      },
      "ae-unresolved-inheritdoc-base": {
        "logLevel": "warning",
        "addToApiReportFile": true
      }
    },
    . . .
  }
```

Configures handling of messages reported by API Extractor during its analysis.

API Extractor message identifiers start with `ae-`. For example: `ae-extra-release-tag`

### messages.tsdocMessageReporting

Example:

```js
  "messages": {
    . . .
    "tsdocMessageReporting": {
      "tsdoc-link-tag-unescaped-text": {
        // Completely disable the "tsdoc-link-tag-unescaped-text" validation
        "logLevel": "none"
      },
    }
  }
```

**Default value:**

```js
  "messages": {
    . . .
    "tsdocMessageReporting": {
      "default": {
        "logLevel": "warning"
      }
    }
  }
```

Configures handling of messages reported by the TSDoc parser when analyzing code comments.

TSDoc message identifiers start with `tsdoc-`. For example: `tsdoc-link-tag-unescaped-text`
