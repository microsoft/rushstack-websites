---
title: Building the projects
---

If you're going to submit a pull request for TSDoc, you will need to use the Rush monorepo manager tool.

> **What's this Rush thing?** Rush is a monorepo build orchestrator that handles policy validation,
> change log management, installing (using [PNPM](https://pnpm.js.org/)), linking, building,
> and publishing. To learn more about Rush, please visit: [https://rushjs.io](https://rushjs.io)

Install the tool like this:

```shell
$ npm install -g @microsoft/rush
```

_NOTE: If this command fails because your user account does not have permissions to
access NPM's global folder, you may need to
[fix your NPM configuration](https://docs.npmjs.com/getting-started/fixing-npm-permissions)._

Rush will symlink the **api-demo** project to use your local build of the **@microsoft/tsdoc** library,
for easy testing/validation.

To build the projects:

```shell
$ cd ./tsdoc
$ rush install
$ rush build
```

## To run all the unit tests from the command-line

The unit tests are implemented using [Jest](https://jestjs.io/), but invoked via the
[Heft](https://www.npmjs.com/package/@rushstack/heft) build system.
(See the linked pages for more comprehensive documentation.)

The unit tests are invoked automatically when you build a project:

```shell
$ cd ./tsdoc
$ npm run build
```

## Running the unit tests interactively

You can also invoke Heft/Jest interactively (the `jest --watch` scenario), so that affected tests will be
re-run whenever a source file is saved. Launch the watch mode like this:

```shell
$ cd ./tsdoc
$ npm run watch
```

## Debugging the unit tests

The [./tsdoc/.vscode/launch.json](https://github.com/microsoft/tsdoc/blob/main/tsdoc/.vscode/launch.json) file includes a
[Visual Studio Code](https://code.visualstudio.com/) configuration that makes debugging
easier. To debug a unit test:

1. Launch VS Code in the tsdoc subfolder (not the repository root):

   ```shell
   $ cd ./tsdoc
   $ code .
   ```

2. In the editor window, open a test file. For example, **src/**tests**/ParsingBasicTests.test.ts**.

3. In the VS Code window, click **View --> Debug** (CTRL+SHIFT+D)

4. From the DEBUG combo box, choose the "**Debug Jest tests**" debug configuration, and click the play button.
   This will run all tests in the debugger.
