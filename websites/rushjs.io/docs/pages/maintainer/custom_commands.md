---
title: Custom commands
---

If your toolchain has special modes or features, you can expose these as custom commands or parameters for the Rush tool.

## Defining custom commands and parameters

These are defined in the config file **common/config/rush/command-line.json**. Your config file should conform to the [command-line.schema.json](https://github.com/microsoft/rushstack/blob/main/libraries/rush-lib/src/schemas/command-line.schema.json) schema. Consider this sample:

```javascript
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/command-line.schema.json",

  "commands": [
    {
      /**
       * (Required) Determines the type of custom command.
       * Rush's "bulk" commands are invoked separately for each project.  Rush will look in
       * each project's package.json file for a "scripts" entry whose name matches the
       * command name.  By default, the command will run for every project in the repo,
       * according to the dependency graph (similar to how "rush build" works).
       * The set of projects can be restricted e.g. using the "--to" or "--from" parameters.
       */
      "commandKind": "bulk",
      "name": "import-strings",
      "summary": "Imports translated strings into each project.",
      "description": "Requests translated strings from the translation service and imports them into each project.",
      "enableParallelism": true
    },
    {
      /**
       * (Required) Determines the type of custom command.
       * Rush's "global" commands are invoked once for the entire repo.
       */
      "commandKind": "global",

      "name": "deploy-app",
      "summary": "Deploys the application",
      "description": "Run this command to deploy the application",

      "shellCommand": "node common/scripts/deploy-app.js"
    }
  ],

  "parameters": [
    {
      /**
       * (Required) Determines the type of custom parameter.
       * A "flag" is a custom command-line parameter whose presence acts as an on/off switch.
       */
      "parameterKind": "flag",
      "longName": "--ship",
      "shortName": "-s",
      "description": "Perform a production build, including minification and localization steps",
      "associatedCommands": [ "build", "rebuild", "import-strings" ],
    },

    {
      "parameterKind": "flag",
      "longName": "--minimal",
      "shortName": "-m",
      "description": "Perform a fast build, which disables certain tasks such as unit tests and linting",
      "associatedCommands": [ "build", "rebuild" ]
    },
    {
      /**
       * (Required) Determines the type of custom parameter.
       * "A "choice" is a custom command-line parameter whose argument must be chosen from a list
       * of allowable alternatives.
       */
      "parameterKind": "choice",
      "longName": "--locale",
      "description": "Selects a single instead of the default locale (en-us) for non-ship builds or all locales for ship builds.",
      "associatedCommands": [ "build", "rebuild", "import-strings" ],
      "alternatives": [
        {
          "name": "en-us",
          "description": "US English"
        },
        {
          "name": "fr-fr",
          "description": "French (France)"
        },
        {
          "name": "es-es",
          "description": "Spanish (Spain)"
        },
        {
          "name": "zh-cn",
          "description": "Chinese (China)"
        }
      ]
    }
  ]
}
```

**Custom commands:** You can define your own commands that are similar to Rush's built-in command verbs (e.g. `rush build`, `rush check`, etc). There are two kinds:

- **bulk command:** These commands run individually for each project in the repo, similar to how `rush build` works. If you set `"enableParallelism": true`, projects can be processed in parallel.
- **global command:** These commands run once for the entire repo, by executing a specified script file.

You can also define your own command-line "parameters". A parameter can be associated with one or more commands via its `associatedCommands` list. You can even associate your custom parameters with Rush's own built-in `build` and `rebuild` commands. In the above example, we associate the `--ship` parameter with `rush build`, `rush rebuild`, and our custom `rush import-strings`.

Currently three kinds of `parameterKind` are supported:

- **flag parameter**: A "flag" is a simple switch such as `--ship`.
- **choice parameter**: An "choice" requires an additional argument which must come from a list of supported alternatives, for example `--locale fr-fr`.
- **string parameter**: A "string" can take any string as a value, for example `--name my-new-package`.

More parameter kinds may be supported in the future. (They are parsed using the [ts-command-line](https://www.npmjs.com/package/@microsoft/ts-command-line) library which supports other parameter kinds that could be exposed.)

## Using custom commands and options

Your custom definitions and their descriptions will be incorporated into Rush's command-line help (when invoked under your repo working folder). Continuing the above example, if we run `rush import-strings --help` we'll now see something like this:

```
Rush Multi-Project Build Tool 5.1.0 - https://rushjs.io

usage: rush import-strings [-h] [-p COUNT] [-t PROJECT1]
                           [--to-version-policy VERSION_POLICY_NAME]
                           [-f PROJECT2] [-v] [-s]
                           [--locale {en-us,fr-fr,es-es,zh-cn}]

Requests translated strings from the translation service and imports them
into each project.

Optional arguments:
  -h, --help            Show this help message and exit.
  -p COUNT, --parallelism COUNT
                        Specify the number of concurrent build processes The
                        value "max" can be specified to indicate the number
                        of CPU cores. If this parameter omitted, the default
                        value depends on the operating system and number of
                        CPU cores.
  -t PROJECT1, --to PROJECT1
                        Run command in the specified project and all of its
                        dependencies
  --to-version-policy VERSION_POLICY_NAME
                        Run command in all projects with the specified
                        version policy and all of their dependencies
  -f PROJECT2, --from PROJECT2
                        Run command in all projects that directly or
                        indirectly depend on the specified project
  -v, --verbose         Display the logs during the build, rather than just
                        displaying the build status summary
  -s, --ship            Perform a production build, including minification
                        and localization steps
  --locale {en-us,fr-fr,es-es,zh-cn}
                        Selects a single instead of the default locale
                        (en-us) for non-ship builds or all locales for ship
                        builds.
```

How to implement a custom command/parameter? For global commands, Rush simply invokes their `shellCommand` and passes the parameters along. For bulk commands, Rush looks for a corresponding script name in your **package.json** file. Suppose we have something like this:

**example/package.json**

```json
{
  "name": "example",
  "version": "1.0.0",
  "main": "lib/index.js",
  "typings": "lib/index.d.ts",
  "scripts": {
    "import-strings": "./node_modules/.bin/loc-importer",
    "build": "./node_modules/.bin/gulp"
  }
}
```

If we run `rush import-strings --locale fr-fr`, then Rush will read the "import-strings" script body and execute it like this:

```
./node_modules/.bin/loc-importer --locale fr-fr
```

(Rush directly executes it using your shell; it does not rely on `npm run`.) Since this choice parameter has a default value, if we run `rush import-strings`, then **loc-importer** is executed like this:

```
./node_modules/.bin/loc-importer --locale en-us
```

In other words, Rush's custom parameters are simply appended to the **package.json** script body. This means you may run into trouble if your script body uses shell expressions such as "`rimraf ./lib && rimraf ./temp`" which don't support these parameters, or need them to be inserted in the middle of the string. This is by design: We don't recommend writing nontrivial build scripts inside a JSON string. Instead, it's better to move this operation into a proper script file that can be commented and reviewed. As your monorepo grows, you'll probably also want to move that script into a reusable library that can be shared across projects.

## See also

- [command-line.json](../../configs/command-line_json)
