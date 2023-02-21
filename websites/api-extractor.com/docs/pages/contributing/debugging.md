---
title: Debugging
---

If you're contributing to API Extractor, you'll eventually want to run it in a debugger. If you open
VS Code in the **apps/api-extractor** folder, it contains a [launch.json file](https://github.com/microsoft/rushstack/blob/main/apps/api-extractor/.vscode/launch.json) with
premade debugger configurations for running API Extractor on various test projects
in the **build-tests** folder.

For example, to analyze **build-tests/api-extractor-test-01** in the debugger, you would do this:

1. Make sure that project has been compiled (since API extractor processes .d.ts files, not .ts files):

   ```shell
   $ cd ./build-tests/api-extractor-test-01
   $ rushx build
   ```

   (`npm run build` would also work)

2. Open VS Code in the **apps/api-extractor** folder.

3. Click on the "Debug" icon on the left toolbar (Ctrl+Shift+D).

4. Choose the `"test-01"` configuration from the combo box.

5. Click the green "play" button (F5).

The **api-extractor-scenarios** project is slightly tricky because it has many different entry points.
For each entry point, the [runScenarios.ts](https://github.com/microsoft/rushstack/blob/main/build-tests/api-extractor-scenarios/src/runScenarios.ts)
driver will create a complete **api-extractor.json** style config file in the **temp/configs** folder.
Thus, you need to manually edit the debugger configuration to specify the one you want. The section looks like this:

**api-extractor/.vscode/launch.json** <br/>

```js
    . . .
    {
      "type": "node",
      "request": "launch",
      "name": "scenario",
      "program": "${workspaceFolder}/lib/start.js",
      "cwd": "${workspaceFolder}/../../build-tests/api-extractor-scenarios",
      "args": [
        "--debug",
        "run",
        "--local",
        "--config",
        "./temp/configs/api-extractor-typeof.json"
      ],
      "sourceMaps": true
    },
    . . .
```

Change the `--config` parameter from `"./temp/configs/api-extractor-typeof.json"`
to instead specify the particular config file for the scenario you want to debug.

By the way, if you want to add a new scenario to **api-extractor-scenarios**,
don't forget to register it in
[config/build-config.json](https://github.com/microsoft/rushstack/blob/main/build-tests/api-extractor-scenarios/config/build-config.json).
