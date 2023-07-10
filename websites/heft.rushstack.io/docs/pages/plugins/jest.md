---
title: Jest plugin
---

<!-- prettier-ignore-start -->
|     |     |
| --- | --- |
| **Plugin package:** | [@rushstack/heft-jest-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-jest-plugin) |
| **Plugin name:** | [jest-plugin](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-jest-plugin/heft-plugin.json) implemented by [JestPlugin.ts](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-jest-plugin/src/JestPlugin.ts) |
| **Plugin config file:** | Jest's [jest.config.json](https://jestjs.io/docs/configuration) loaded by `@rushstack/heft-config-file` for rigging |
| **heft.json options:** | [IJestPluginOptions](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-jest-plugin/src/JestPlugin.ts) |
<!-- prettier-ignore-end -->

This plugin invokes the [Jest](https://jestjs.io/en/) test framework for unit testing.

## When to use it

We recommend Jest for several reasons:

- **All-in-one**: Unlike frameworks such as `mocha` that require many components to be hooked together, Jest provides a single integrated solution for your: test runner, assertion library, mock/spy API, instrumentation, code coverage, and reporting. Jest also has first class support for React.

- **Interactive**: Jest supports a "watch mode" for automatically re-running tests whenever a file is saved, plus a [snapshot testing](https://jestjs.io/docs/en/snapshot-testing) that can automatically update assertions when a contract changes.

- **Isolated runtime**: Jest runs web tests in a Node.js environment rather than launching a web browser, and leverages the [Node.js VM](https://nodejs.org/api/vm.html) feature to prevent tests from leaking state.

That said, if for some reason you need to run tests in some other runtime such as an Android client or real web browser, Jest may not be the best bet.

## package.json dependencies

If you are using a standard rig such as [@rushstack/heft-node-rig](https://www.npmjs.com/package/@rushstack/heft-node-rig)
or [@rushstack/heft-web-rig](https://www.npmjs.com/package/@rushstack/heft-web-rig), then Jest
will already be loaded and configured.

Otherwise, you'll need to add the plugin package to your project:

```bash
# If you are using Rush, run this shell command in your project folder:
rush add --package @rushstack/heft-jest-plugin --dev

# Or if you are using plain NPM, run this shell command:
npm install @rushstack/heft-jest-plugin --dev-dev
```

The plugin has direct dependencies on the Jest packages that it needs, so you don't need to add Jest to your
project's **package.json** file.

Your project should get its typings from `@types/heft-jest` instead of `@types/jest`:

```bash
# If you are using Rush, run this shell command in your project folder:
rush add --package @types/heft-jest --exact --dev

# Or if you are using plain NPM, run this shell command:
npm install @types/heft-jest --dev-dev --save-exact
```

...and then reference the `@types/heft-jest` in your **tsconfig.json** file, like this example:

```js
{
  "extends": "./node_modules/@rushstack/heft-node-rig/profiles/default/tsconfig-base.json",
  "compilerOptions": {
    "types": [
      "heft-jest", // <---- ADD THIS
      "node"
    ]
  }
}
```

## Config files

If Jest is not already being provided by a rig, your [heft.json config file](../configs/heft_json.md) could invoke it
like in this example:

**&lt;project folder&gt;/config/heft.json**

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",

  "phasesByName": {
    "build": {
      . . .
    },
    "test": {
      "phaseDependencies": ["build"],
      "tasksByName": {
        "jest": {
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-jest-plugin"
          }
        }
      }
    }
  }
}
```

Heft looks for [Jest's config file](https://jestjs.io/docs/en/configuration) in the standard path
**config/jest.config.json**. Although Jest itself supports other config file names and even embedding settings
in your **package.json** file, Heft requires the name `config/jest.config.json`. In a large scale monorepo,
enforcing one standard filename makes it easier to search for these files, perform bulk edits, and copy configuration
recipes between projects.

For a simple setup, your Jest configuration should extend Heft's
[jest-shared.config.json](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-jest-plugin/includes/jest-shared.config.json) like this:

**&lt;project folder&gt;/config/jest.config.json**

```js
{
  "extends": "@rushstack/heft-jest-plugin/includes/jest-shared.config.json"
}
```

Alternatively, if you are using a rig package such as `@rushstack/heft-web-rig`, specify the rig like in this example:

**&lt;project folder&gt;/config/jest.config.json**

```js
{
  "extends": "@rushstack/heft-web-rig/profiles/library/config/jest.config.json"
}
```

(If you maintain your own rig, it should extend from `@rushstack/heft-jest-plugin` to ensure that Jest uses
Heft's transforms and resolver.)

_**Note:** If you find yourself frequently adding lots of custom settings to **jest.config.json**, please create
a GitHub issue and tell us about it. Our aim is to provide a configuration that minimizes the need for
project-specific customizations._

## The "extends" field

The `"extends"` field in **jest.config.json** is a Heft-specific enhancement that will not work if the Jest
command line is invoked without Heft. This setting replaces Jest's `"preset"` field which has limited module
resolution capabilities and does not support rigs. Heft parses **jest.config.json** using
the `@rushstack/heft-config-file` engine, with full support for
[property inheritance directives](../advanced/heft-config-file.md#property-inheritance-directives).

If for some reason your `jest.config.json` needs to be directly readable by Jest, the
`disableConfigurationModuleResolution` plugin setting can be used to restore the standard behavior,
with the downside that your Jest configuration will not be riggable.

For example:

**&lt;project folder&gt;/config/heft.json**

```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",

  "phasesByName": {
    "build": {
      . . .
    },
    "test": {
      "phaseDependencies": ["build"],
      "tasksByName": {
        "jest": {
          "taskPlugin": {
            "pluginPackage": "@rushstack/heft-jest-plugin",
            "options": {
              // (Not recommended) Disable Heft's support for rigs and the "extends" field
              "disableConfigurationModuleResolution": true
            }
          }
        }
      }
    }
  }
}
```

## Differences from ts-jest

Conventionally, Jest supports TypeScript compilation via plugins called [transforms](https://jestjs.io/docs/en/tutorial-react#custom-transformers), which are modeled as a function that receives a single `.ts` file as input, and returns a `.js` file and `.map` file as its output. The official `babel-jest` transform actually does compile one file at a time, but that approach cannot support language features such as `const enum` that require analyzing imported types. The popular `ts-jest` transform solves that problem by performing a full compiler analysis and reusing it each time the transform is invoked, but this won't support other build steps such as preprocessors. Both `babel-jest` and `ts-jest` also impose a significant performance cost, by invoking the compiler a second time when running tests.

Heft takes a different approach of performing a conventional build and then invoking Jest on the output. If your build targets a browser runtime, you'll need to use the [additionalModuleKindsToEmit](../configs/typescript_json.md) setting to emit CommonJS outputs in a secondary folder. (Emitting extra files is still significantly faster than invoking the compiler twice.) Besides avoiding redundant compiler invocations, Heft's strategy ensures that your unit tests are compiled with your full build process including any preprocessor tasks such as [Sass typings generation](../plugins/sass.md).

Some helpful examples of mocking and other Jest techniques can be found in the [heft-node-jest-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-jest-tutorial) project folder.

> **Important differences when using Jest with Heft:**
>
> - Invoke Jest using the `heft` command line. Invoking the `jest` command line directly will not invoke TypeScript and is incompatible with the `"extends"` field from **jest.config.json**.
>
> - Do not add `ts-jest` or `babel-jest` as a dependency for your project.
>
> - Instead of `import { mocked } from "ts-jest/utils";`, use the global `mocked()` function that is provided by `@types/heft-jest`. Besides this difference, the [API documentation](https://kulshekhar.github.io/ts-jest/docs/guides/test-helpers/) from `ts-jest` is still applicable to Heft's implementation.
>
> - The `ts-jest` transform will magically "hoist" calls to `jest.mock();`. Heft does not consider this a best practice. Instead, use the [@rushstack/hoist-jest-mock](https://www.npmjs.com/package/@rushstack/eslint-plugin#rushstackhoist-jest-mock) lint rule to remind developers to manually hoist their calls. It is enabled by default with [@rushstack/eslint-config](https://www.npmjs.com/package/@rushstack/eslint-config).

## Debugging Jest tests

To debug your Jest tests, it's recommended create a VS Code [launch.json file](https://code.visualstudio.com/docs/editor/debugging#_launch-configurations) like this:

**&lt;project folder&gt;/.vscode/launch.json**

```
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Jest tests",
      "program": "${workspaceFolder}/node_modules/@rushstack/heft/lib/start.js",
      "cwd": "${workspaceFolder}",
      "args": ["--debug", "test", "--clean"],
      "console": "integratedTerminal",
      "sourceMaps": true
    },
  ]
}
```

This launches the full Heft toolchain in your debugger. The `--debug` switch prevents Jest from being spawned as a separate process. The `--clean` flag is optional, but fixes an issue where in rare situations Jest's "haste-map" may become corrupted by an aborted run.

To restrict the debugger to run one specific test, you can add the `--test-name-pattern` parameter. (See [here](../intro/cli.md) for command-line documentation.) Another option is to use Jest's [test.only()](https://jestjs.io/docs/en/api#testonlyname-fn-timeout) API.

## CLI parameters

[heft-jest-plugin/heft-plugin.json](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-jest-plugin/heft-plugin.json) defines these parameters:

```
  --config RELATIVE_PATH
                        Use this parameter to control which Jest
                        configuration file will be used to run Jest tests. If
                        not specified, it will default to "config/jest.config.
                        json". This corresponds to the "--config" parameter
                        in Jest's documentation.
  --debug-heft-reporter
                        Normally Heft installs a custom Jest reporter so that
                        test results are presented consistently with other
                        task logging. If you suspect a problem with the
                        HeftJestReporter, specify "--debug-heft-reporter" to
                        temporarily disable it so that you can compare with
                        how Jest's default reporter would have presented it.
                        Include this output in your bug report. Do not use
                        "--debug-heft-reporter" in production.
  --detect-open-handles
                        Attempt to collect and print open handles preventing
                        Jest from exiting cleanly. This option has a
                        significant performance penalty and should only be
                        used for debugging. This corresponds to the
                        "--detectOpenHandles" parameter in Jest's
                        documentation.
  --disable-code-coverage
                        Disable any configured code coverage. If code
                        coverage is not configured, this parameter has no
                        effect.
  --find-related-tests SOURCE_FILE
                        Find and run the tests that cover a source file that
                        was passed in as an argument. This corresponds to the
                        "--findRelatedTests" parameter in Jest's
                        documentation. This parameter is not compatible with
                        watch mode.
  --max-workers COUNT_OR_PERCENTAGE
                        Use this parameter to control maximum number of
                        worker processes tests are allowed to use. This
                        parameter is similar to the parameter noted in the
                        Jest documentation, and can either be an integer
                        representing the number of workers to spawn when
                        running tests, or can be a string representing a
                        percentage of the available CPUs on the machine to
                        utilize. Example values: "3", "25%"
  --silent
                        Prevent tests from printing messages through the
                        console. This corresponds to the "--silent" parameter
                        in Jest's documentation.
  -t REGEXP, --test-name-pattern REGEXP
                        Run only tests with a name that matches a regular
                        expression. The REGEXP is matched against the full
                        name, which is a combination of the test name and all
                        its surrounding describe blocks. This corresponds to
                        the "--testNamePattern" parameter in Jest's
                        documentation.
  --test-path-ignore-patterns REGEXP
                        Avoid running tests with a source file path that
                        matches one ore more regular expressions. On Windows
                        you will need to use "/" instead of "\". This
                        corresponds to the "--testPathIgnorePatterns"
                        parameter in Jest's documentation.
  --test-path-pattern REGEXP
                        Run only tests with a source file path that matches a
                        regular expression. On Windows you will need to use
                        "/" instead of "\". This corresponds to the
                        "--testPathPattern" parameter in Jest's documentation.
  --test-timeout-ms TIMEOUT
                        Change the default timeout for tests; if a test
                        doesn't complete within this many milliseconds, it
                        will fail. Individual tests can override the default.
                        If unspecified, the default is normally 5000 ms. This
                        corresponds to the "--testTimeout" parameter in
                        Jest's documentation.
  -u, --update-snapshots
                        Update Jest snapshots while running the tests. This
                        corresponds to the "--updateSnapshots" parameter in
                        Jest.
```

## heft.json options

When loading `@rushstack/heft-jest-plugin` in your **heft.json**, the following settings can be provided inline using the `"options"` field:

[heft-plugins/heft-jest-plugin/src/JestPlugin.ts](https://github.com/microsoft/rushstack/blob/main/heft-plugins/heft-jest-plugin/src/JestPlugin.ts)

```js
export interface IJestPluginOptions {
  configurationPath?: string;
  debugHeftReporter?: boolean;
  detectOpenHandles?: boolean;
  disableCodeCoverage?: boolean;
  disableConfigurationModuleResolution?: boolean;
  findRelatedTests?: string[];
  maxWorkers?: string;
  passWithNoTests?: boolean;
  silent?: boolean;
  testNamePattern?: string;
  testPathIgnorePatterns?: string;
  testPathPattern?: string;
  testTimeout?: number;
  updateSnapshots?: boolean;
}
```

Their function is identical to the corresponding command-line parameters.

## See also

- [heft-node-jest-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-jest-tutorial) sample project
- Jest's [API reference](https://jestjs.io/docs/en/api)
- [jest.config.json](https://jestjs.io/docs/en/configuration) documentation
