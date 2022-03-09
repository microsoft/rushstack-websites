---
title: Contributing
---

Rush is developed in the monorepo for the [Rush Stack](https://rushstack.io/) family of projects:

&nbsp;&nbsp;&nbsp;&nbsp; [https://github.com/microsoft/rushstack](https://github.com/microsoft/rushstack)

Contribute to the documentation website in the [rushjs.io-website](https://github.com/microsoft/rushjs.io-website) GitHub repo.

For general instructions for building Rush and guidelines for submitting PRs, please read the
[Contributing](https://rushstack.io/pages/contributing/get_started/) documentation for the Rush Stack
monorepo.

The relevant monorepo project folders are:

- [apps/rush](https://github.com/microsoft/rushstack/tree/master/apps/rush) - the command line interface front end
- [apps/rush-lib](https://github.com/microsoft/rushstack/tree/master/apps/rush-lib) - the automation API and "engine" where all the logic is implemented

## Testing Rush builds

Once you have coded your fix and built your branch (as described in the general [Contributing](https://rushstack.io/pages/contributing/get_started/) notes), you will want to test your development build of Rush.

Rush features a mechanism called the **version selector**, which reads `rushVersion` from **rush.json** and then automatically installs and invokes that specific version of the engine. Thus if we launch your build of `@microsoft/rush`, it will not actually run your modified code. To bypass the version selector, we need to invoke the `@microsoft/rush-lib` engine directly:

```shell
$ cd rushstack/apps/rush-lib
$ node ./lib/start.js --help
```

If you want to make it easy invoke your test build from other locations, we recommend to create a `testrush` command.

For Bash on Mac OS or Linux:

```shell
# Substitute the full path to your own build of rush-lib:
alias testrush="node ~/git/rushstack/apps/rush-lib/lib/start.js"
```

For Windows, we might create `testrush.cmd` and add it to our system `PATH`:

```
@ECHO OFF
REM Substitute the full path to your own build of rush-lib:
node "C:\Git\rushstack\apps\rush-lib\lib\start.js" %*
```

## Debugging Rush

The same approach is used to debug Rush using the VS Code debugger. Create a debugger configuration file like this:

**rushstack/apps/rush-lib/.vscode/launch.json**

```js
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Rush",
      "program": "${workspaceFolder}/lib/start.js",
      "args": [ "list", "--json" ],  // <====== specify your Rush command line arguments here
      "cwd": "(repo folder that you want to debug)"  // <===== specify your target working folder here
    }
  ]
}
```

After saving this file, in VS Code click _"View" --> "Run"_ and choose your "Debug Rush" configuration from the list. Then click _"Run" --> "Start Debugging"_ to start debugging. Breakpoints and TypeScript source maps should work correctly.

## Building without unit tests

Rush currently builds using the **gulp-core-build** toolchain which by default runs unit tests, which take a long time. You can bypass them by invoking gulp directly.

```shell
# Full incremental build of Rush and its dependencies, including unit tests
$ rush build --to rush-lib --verbose

# Do a quick build of "rush-lib" only without unit tests
$ npm install -g gulp
$ cd rushstack/apps/rush-lib
$ gulp build
```
