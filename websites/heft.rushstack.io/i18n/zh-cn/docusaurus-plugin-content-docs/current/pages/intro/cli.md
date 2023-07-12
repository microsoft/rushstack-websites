---
title: Heft command line
---

## heft barebones configuration

```
usage: heft [-h] [--debug] [--unmanaged] <command> ...

Heft is a pluggable build system designed for web projects.

Positional arguments:
  <command>
    clean      Clean the project, removing temporary task folders and
              specified clean paths.
    run        Run a provided selection of Heft phases.
    run-watch  Run a provided selection of Heft phases in watch mode..

Optional arguments:
  -h, --help   Show this help message and exit.
```

## jest-plugin

[jest-plugin](../plugins/jest.md) adds these custom command-line parameters:

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

## node-service-plugin

[node-service-plugin](../plugins//node-service.md) adds these custom command-line parameters:

```
  --serve
                        Start a local web server for testing purposes. This
                        parameter is only available when running in watch
                        mode.
```

## storybook-plugin

[storybook-plugin](../plugins//storybook.md) adds these custom command-line parameters:

```
  --sst
                        Invokes the SST postprocessing. Requires AWS credentials.
  --sst-stage STAGE_NAME
                        Specifies the Serverless Stack stage; equivalent to
                        to the "--stage" parameter from the "sst" CLI
```

```
  --storybook
                        Used by the "@rushstack/heft-storybook-plugin" package to launch
                        Storybook.
```

## webpack5-plugin

[webpack5-plugin](../plugins//webpack.md) adds these custom command-line parameters:

```
  --serve
                        Start a local web server for testing purposes using
                        webpack-dev-server. This parameter is only available
                        when running in watch mode.
```
