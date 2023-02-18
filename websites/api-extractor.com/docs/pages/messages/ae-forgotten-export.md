---
title: ae-forgotten-export
---

_"The symbol *** needs to be exported by the entry point ***."_

## Remarks

This message is reported when an exported API refers to another declaration that is not exported.

Example:

Suppose your library has **./src/index.ts** as the `mainEntryPointFilePath`, and it contains the following code:

```ts
// uncallable forgotten export
enum ReportType {
  Full,
  Condensed
}

// forgotten export
interface IShowReportOptions {
  reportTitle: string;
  validation?: boolean;
  reportType?: ReportType;
}

/**
 * Shows a report.
 * @public
 */
export function showReport(options: IShowReportOptions): void {}

// Warning: "The symbol "IShowReportOptions" needs to be exported by the entry point src/index.d.ts."
```

In the example above, type signature for `showReport()` refers to an interface `IShowReportOptions` that is not
exported by the entry point. The interface is missing the `export` keyword. This is valid TypeScript code,
however it poses several problems from the perspective of API design:

- **Third parties cannot declare the type:** For example, suppose the consumer of this API wants to make a helper
  function `getDefaultReportOptions()` that creates the `options` object. Since they cannot import the
  `IShowReportOptions` declaration, there is no easy way for them to annotate the return value of their function.

- **The type is awkward to document:** Since `IShowReportOptions` is not exported, it would not normally be included
  in the API documentation that is generated for this library. Instead, the information would need to be incorporated
  somehow into the doc comment for `showReport()`, which can be awkward. And what if several different functions
  use this interface?

- **The API may be uncallable:** In the case of the `ReportType` enum, since the enum cannot be imported, a consumer
  actually cannot use the members of this enum. Thus, they have no way to specify the
  `IShowReportOptions.reportType` value at all. Also, `reportType` is an optional parameter, so this unfortunate
  oversight might go unnoticed for a long time before someone finally reports the bug.

The `ae-forgotten-export` validation helps you to identify these problems and fix them proactively.

Keep in mind that API Extractor models your library as having a single entry point. For example, suppose we moved
the `ReportType` into another file, and that our **./src/index.ts** imported it using a statement such as
`import { ReportType } from './ReportType';`. In this case, although the enum is "exported" by
**./src/ReportType.ts**, the `ae-forgotten-export` message will nonetheless be reported; the `ReportType` enum needs
to be exported by the main entry point.

## How to fix

Use the `export` keyword to export the declaration from the main entry point file (as specified by
the `mainEntryPointFilePath` setting).

Alternatively, if changing your API signature would be too disruptive, you can simply choose to ignore this message.
By default it uses `addToApiReportFile` reporting, which means that it will be written into your API report
for tracking purposes. It will not produce a console warning and thus will NOT break your build
(assuming that you have `apiReport.enabled` set to true).

## See also

- [mainEntryPointFilePath setting]({% link pages/configs/api-extractor_json.md %}#mainentrypointfilepath)
