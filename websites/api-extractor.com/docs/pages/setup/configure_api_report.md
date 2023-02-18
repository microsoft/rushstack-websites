---
title: Configuring an API report
---

_This article continues the tutorial from the "[Invoking API Extractor](../setup/invoking.md)" page.
It's recommended to start there._

The API report file is relatively simple to configure. The two most interesting settings are:

- `apiReport.enabled` - whether we want to generate the report at all
- `apiReport.reportFolder` - the folder where the report will be stored

For a single project, it's fine to keep the report in the default location `"<projectFolder>/etc/"`.
Whereas if you work in a monorepo with many projects, you may prefer to have all the API report files
written to a central location such as [common/reviews/api](https://github.com/microsoft/rushstack/tree/main/common/reviews/api) used by the **rushstack**
repo where API Extractor is developed.

The report file should be tracked by Git, so that changes to an API signature will appear as diffs when a
pull request (PR) is created.

The **rushstack** repo uses a [.github/CODEOWNERS](https://github.com/microsoft/rushstack/blob/main/.github/CODEOWNERS) file to require approvals from
a specific list of people when an API is changed. Depending on your process, this approval can be more or
less formalized.

### Redirecting warnings to the API report file

By the way, the API report file can also be used to track specific warning types. For example, although the
[ae-forgotten-export](../messages/ae-forgotten-export.md) validation is generally useful,
suppose there are certain cases where you purposefully do not want to export a declaration.

Normally the warning would be printed to the console, like this:

```
Warning: (ae-forgotten-export) The symbol "IWidget" needs to be exported by
the entry point index.d.ts
```

Console warnings cause the **api-extractor** tool to return a nonzero exit code, which will cause
a production build to fail. However, using the
[addToApiReportFile](../configs/api-extractor_json.md#messagessectionruleaddtoapireportfile)
setting, you can configure the warning to be added to the API report file instead. You would add a section
like this to your **api-extractor.json** file:

**awesome-widgets/config/api-extractor.json**<br/>

```js
  . . .
  "messages": {
    "extractorMessageReporting": {
      "ae-forgotten-export": {
        "logLevel": "warning",
        "addToApiReportFile": true
      },
    },
    . . .
  },
  . . .
```

Instead of printing the warning to the console, instead you will see something like this in your report file:

**awesome-widgets/etc/api-extractor.api.md**<br/>

```js
// Warning: (ae-forgotten-export) The symbol "IWidget" needs to be exported
// by the entry point index.d.ts
//
// @public
export class Widget implements IWidget {}
```

If you take a look at [api-extractor-defaults.json](https://github.com/microsoft/rushstack/blob/main/apps/api-extractor/src/schemas/api-extractor-defaults.json)
you will see that API Extractor already does this by default for many message types. In general it defaults to true
for any message where the problem is not serious, but the fix may require nontrivial effort or have nontrivial
consequences for your API.

#### Next up: [Configuring a .d.ts rollup](../setup/configure_rollup.md)
