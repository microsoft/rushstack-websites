---
title: '"jest" task'
---

This task invokes the [Jest](https://jestjs.io/en/) test framework for unit testing.


## When to use it

We recommend Jest for several reasons:

- **All-in-one**: Unlike frameworks such as `mocha` that require many components to be hooked together, Jest provides a single integrated solution for your: test runner, assertion library, mock/spy API, instrumentation, code coverage, and reporting.  Jest also has first class support for React.

- **Interactive**: Jest supports a "watch mode" for automatically re-running tests whenever a file is saved, plus a [snapshot testing](https://jestjs.io/docs/en/snapshot-testing) that can automatically update assertions when a contract changes.

- **Isolated runtime**: Jest runs web tests in a Node.js environment rather than launching a web browser, and leverages the [Node.js VM](https://nodejs.org/api/vm.html) feature to prevent tests from leaking state.

That said, if for some reason you need to run tests in some other runtime such as an Android client or real web browser, Jest may not be the best bet.


## package.json dependencies

Heft has direct dependencies on the Jest packages that it needs, so you don't need to add Jest to your project's **package.json** file.  Instead, you will need to install the Heft plugin package:

```shell
$ rush add --package @rushstack/heft-jest-plugin --dev
```

Your project should get its typings from `@types/heft-jest` instead of `@types/jest`:

```bash
$ rush add --package @types/heft-jest --exact --dev
```

...and then reference `heft-jest` in your **tsconfig.json** file, like this example:

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

The Heft plugin that you installed above needs to be loaded using the [heft.json config file](../heft_configs/heft_json):

**&lt;project folder&gt;/config/heft.json**
```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/heft.schema.json",

  . . .

  "heftPlugins": [
    { "plugin": "@rushstack/heft-jest-plugin" }  // <---- ADD THIS
  ]
}
```

Heft looks for [Jest's config file](https://jestjs.io/docs/en/configuration) in the standard path **config/jest.config.json**.  Although Jest itself supports other config file names and even embedding settings in your **package.json** file, Heft requires the name `jest.config.json`.  Using one standard filename makes it easy to search for these files, perform bulk edits, and copy configuration recipes between projects.

For a simple setup, your Jest configuration should extend Heft's [jest-shared.config.json](https://github.com/microsoft/rushstack/blob/master/heft-plugins/heft-jest-plugin/includes/jest-shared.config.json) like this:

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

_**Note:** If you find yourself frequently adding lots of custom settings to **jest.config.json**, please create a GitHub issue and tell us about it.  Our aim is to provide a configuration that minimizes the need for project-specific customizations._


## The "extends" field

The `"extends"` field in **jest.config.json** is a Heft-specific enhancement that will not work if the Jest command line
is invoked without Heft.  It replaces Jest's `"preset"` field which has limited module resolution capabilities and does not support rigs.

If for some reason your `jest.config.json` needs to be directly readable by Jest, the
`disableConfigurationModuleResolution` plugin setting can be used to restore the old behavior.

For example:

**&lt;project folder&gt;/config/heft.json**
```js
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/heft.schema.json",

  . . .

  "heftPlugins": [
    {
      "plugin": "@rushstack/heft-jest-plugin",
      "options": {
        // (Not recommended) Disable Heft's support for rigs and the "extends" field
        "disableConfigurationModuleResolution": true
      }
    }
  ]
}
```


## Differences from ts-jest

Internally, Jest supports TypeScript compilation via plugins called [transforms](https://jestjs.io/docs/en/tutorial-react#custom-transformers), which are modeled as a synchronous function that receives a single `.ts` file as input, and returns a `.js` file and `.map` file as its output. The official `babel-jest` transform actually does compile one file at a time, but that approach cannot support language features such as `const enum` that require analyzing imported types.  The `ts-jest` transform solves this problem by performing a full compiler analysis and reusing it each time the transform is invoked, but this won't support other build steps such as preprocessors.  Both `babel-jest` and `ts-jest` also impose a significant performance cost, by invoking the compiler a second time when running tests.

Heft takes a different approach of performing a conventional build and then invoking Jest on the output.  If your build targets a browser runtime, you'll need to use the [emitFolderNameForTests](../heft_tasks/webpack) setting to emit CommonJS outputs in a secondary folder. (Emitting extra files is still significantly faster than invoking the compiler twice.)  Heft's `jest-build-transform.js` does not compile anything itself, but rather returns the output of the full pipeline.

Some helpful examples of mocking and other Jest techniques can be found in the [heft-node-jest-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-jest-tutorial) project folder.

> **Important differences when using Jest with Heft:**
>
> - Invoke Jest using the `heft` command line.  Invoking the `jest` command line directly will not invoke TypeScript and is incompatible with the `"extends"` field from **jest.config.json**.
>
> - Do not add `ts-jest` or `babel-jest` as a dependency for your project.
>
> - Instead of `import { mocked } from "ts-jest/utils";`, use the global `mocked()` function that is provided by `@types/heft-jest`.  Besides this difference, the [API documentation](https://kulshekhar.github.io/ts-jest/user/test-helpers) from `ts-jest` is still applicable to Heft's implementation.
>
> - The `ts-jest` transform will magically "hoist" calls to `jest.mock();`.  Heft does not consider this a best practice. Instead, use the [@rushstack/hoist-jest-mock](https://www.npmjs.com/package/@rushstack/eslint-plugin#rushstackhoist-jest-mock) lint rule to remind developers to manually hoist their calls.  It is enabled by default with [@rushstack/eslint-config](https://www.npmjs.com/package/@rushstack/eslint-config).
>


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

This launches the full Heft toolchain in your debugger.  The `--debug` switch prevents Jest from being spawned as a separate process.  The `--clean` flag is optional, but fixes an issue where in rare situations Jest's "haste-map" may become corrupted by an aborted run.

To restrict the debugger to run one specific test, you can add the `--test-name-pattern` parameter. (See [here](../heft/cli) for command-line documentation.)  Another option is to use Jest's [test.only()](https://jestjs.io/docs/en/api#testonlyname-fn-timeout) API.


## See also

- [heft-node-jest-tutorial](https://github.com/microsoft/rushstack-samples/tree/main/heft/heft-node-jest-tutorial) sample project
- Jest's [API reference](https://jestjs.io/docs/en/api)
- [jest.config.json](https://jestjs.io/docs/en/configuration) documentation
