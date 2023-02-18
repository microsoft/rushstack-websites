---
layout: page
title: Invoking API Extractor
navigation_source: docs_nav
---

Sounds great!  So... how exactly do we enable API Extractor for a new project?

* TOC
{:toc}


## Invoking via the command-line

The simplest way to invoke API Extractor is via the command-line.

### 1. Configure the TypeScript compiler for your project

For this tutorial, suppose we have a hypothetical library project whose **package.json** file looks like this:

**awesome-widgets/package.json**
```js
{
  "name": "awesome-widgets",
  "version": "1.0.0",
  "main": "./lib/index.js",
  "typings": "./lib/index.d.ts"
}
```

Here we assume the library's main entry point is **awesome-widgets/src/index.ts**, which compiles to
produce the **index.js** and **index.d.ts** files seen above.  In your **tsconfig.json** file, you should enable
the following settings:

- `"declaration": true` - This enables generation of the .d.ts files that API Extractor will analyze.
  *By design, TypeScript source files are not directly analyzed, but instead must be first processed by your compiler.*

- `"declarationMap": true` - This enables generation of .d.ts.map files that allow API Extractor errors to be
  reported using line numbers from your original source files; without this, the error locations will instead
  refer to the generated .d.ts files.

Our example **tsconfig.json** file might look like this:

**awesome-widgets/tsconfig.json**
```js
{
  "$schema": "http://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "declaration": true,
    "sourceMap": true,
    "declarationMap": true,
    "types": [
    ],
    "lib": [
      "es5"
    ],
    "outDir": "lib"
  },
  "include": [
    "src/**/*.ts"
  ]
}
```

### 2. Install API Extractor

To install the NPM package in your global environment, use a command like this:

```shell
$ npm install -g @microsoft/api-extractor
```

Assuming your `PATH` environment variable is set up correctly, now you should now be able to invoke the
`api-extractor` tool from your shell.


### 3. Create a template config file

Next, we need to create a config file `api-extractor.json` for your project.  The following command will create
[a template file](
https://github.com/microsoft/rushstack/blob/main/apps/api-extractor/src/schemas/api-extractor-template.json)
that shows all settings and their default values:

```
$ api-extractor init
```

We recommend to use this template for your real config file.  However, since the template is fairly verbose,
in this tutorial we will show condensed files without the extra comments.
[This page]({% link pages/configs/api-extractor_json.md %}) explains each setting in depth.

> **Comments in JSON files**
>
> Strictly speaking, JSON was originally intended as a machine interchange format, and thus does not formally support
> code comments.  Recently JSON has gained popularity as a human-edited config file format, which obviously requires
> comments.  As such, most serious JSON libraries can handle comments without any trouble. (A notable exception
> is `JSON.parse()`; don't use that -- it cannot validate schemas and has poor error reporting.)
>
> VS Code highlights JSON comments as errors by default, but it provides an optional "[JSON with comments](
> https://code.visualstudio.com/docs/languages/identifiers)" mode.  To enable this, add this line to
> VS Code's **settings.json**:
>
> ```json
> "files.associations": { "*.json": "jsonc" }
> ```
>
> GitHub also highlights comments as errors by default.  To fix that, add this line to your **.gitattributes** file:
>
> ```
> *.json  linguist-language=JSON-with-Comments
> ```
>
> *For a discussion of some other possibilities, see
> [issue #1088](https://github.com/microsoft/rushstack/issues/1088).*

Our convention is to put config files in the "config" subfolder, so folder tree might look like this:

<b>
awesome-widgets/package.json<br/>
awesome-widgets/tsconfig.json<br/>
awesome-widgets/config/api-extractor.json<br/>
awesome-widgets/lib/index.d.js<br/>
awesome-widgets/lib/index.js.map<br/>
awesome-widgets/lib/index.d.ts<br/>
awesome-widgets/lib/index.d.ts.map<br/>
awesome-widgets/src/index.ts<br/>
</b>

If your project doesn't use the "config" subfolder convention, you can also put **api-extractor.json** in your
project folder.  API Extractor will look for it in both places.

In the next few pages, we'll look at the individual settings in more detail.  For now, we should simply make sure
that the `mainEntryPointFilePath` matches the `"typings"` field in our **package.json** file above.  The template
assigns it like this:

```js
  "mainEntryPointFilePath": "<projectFolder>/lib/index.d.ts",
```

...which matches the **package.json** `"typings"` field above.


### 4. Running the tool

Now we're ready to invoke the **api-extractor** command line.  For a local (non-production) build, you would
use these shell commands:

```shell
$ cd awesome-widgets

# First invoke the TypeScript compiler to make the .d.ts files
$ tsc

# Next, we invoke API Extractor
$ api-extractor run --local --verbose
```

If you're having trouble, the `--diagnostics` option prints additional information that can help to diagnose the
issue.

```shell
# Print troubleshooting logs
$ api-extractor run --local --diagnostics
```

> **Compiler version incompatibilities**
>
> When API Extractor invokes the compiler engine to analyze your project, it uses its own TypeScript version.  It
> cannot use your toolchain's version because the compiler engine API may be incompatible.  This sometimes causes
> API Extractor to report compiler errors due to differences in the system typings between TypeScript versions.
> You can avoid this by specifying the `--typescript-compiler-folder` command-line option
> (`IExtractorInvokeOptions.typescriptCompilerFolder` in the API).  This enables API Extractor to use
> the system typings from your toolchain's TypeScript folder.
>
> If the issue is that your toolchain uses a newer compiler release than API Extractor's engine, please
> open a GitHub issue requesting to upgrade API Extractor's compiler.  We try to stay as current as possible.


## Invoking from a build script

If your project is built using a custom toolchain that is coded in TypeScript, you can alternatively invoke
the API Extractor engine programmatically.

There are a lot of options, but here's a bare bones example:

```ts
import * as path from 'path';
import {
  Extractor,
  ExtractorConfig,
  ExtractorResult
} from '@microsoft/api-extractor';

const apiExtractorJsonPath: string = path.join(__dirname, '../config/api-extractor.json');

// Load and parse the api-extractor.json file
const extractorConfig: ExtractorConfig = ExtractorConfig.loadFileAndPrepare(apiExtractorJsonPath);

// Invoke API Extractor
const extractorResult: ExtractorResult = Extractor.invoke(extractorConfig, {
  // Equivalent to the "--local" command-line parameter
  localBuild: true,

  // Equivalent to the "--verbose" command-line parameter
  showVerboseMessages: true
});

if (extractorResult.succeeded) {
  console.log(`API Extractor completed successfully`);
  process.exitCode = 0;
} else {
  console.error(`API Extractor completed with ${extractorResult.errorCount} errors`
    + ` and ${extractorResult.warningCount} warnings`);
  process.exitCode = 1;
}
```

If you invoke API Extractor multiple times for a single **tsconfig.json** environment, this approach also allows
you to reuse the same `CompilerState` object across multiple invocations.  This can be a significant performance
optimization, since the TypeScript compiler analysis is relatively expensive.  Take a look at the
[api-extractor-scenarios/src/runScenarios.ts](
https://github.com/microsoft/rushstack/blob/main/build-tests/api-extractor-scenarios/src/runScenarios.ts)
test runner for a real world example of how to do this.

## Reusing settings across projects

The **api-extractor.json** file contents are completely described by the `IConfigFile` interface, which you
can use to construct the `ExtractorConfig` object.  With this approach it's possible to avoid creating an
**api-extractor.json** file entirely, but we generally recommend not to do that.  When developers are
troubleshooting problems, it's very useful to have your actual configuration represented in a standard config file
that people can inspect and tinker with.  Also, if you ever need to debug API Extractor itself,
it's probably easer to debug the isolated `api-extractor` process than a complex toolchain, but you'll need an
**api-extractor.json** file for that.

So... if you work in a modern monorepo with many different projects, how can you ensure they have consistent
API Extractor settings without a lot of copy+pasting of **api-extractor.json** files?  Following the
convention of **tsconfig.json** and **tslint.json**, API Extractor supports an `"extends"` field that allows
your **api-extractor.json** file to inherit its configuration from a shared template file.
[See here]({% link pages/configs/api-extractor_json.md %}#extends) for details.


*Now that we've got things running, let's look at how to configure the three different output types...*

#### Next up: [Configuring an API report]({% link pages/setup/configure_api_report.md %})
