---
title: Heft command line
---

## heft

```
usage: heft [-h] [--unmanaged] [--debug] [--plugin PATH] <command> ...

Heft is a pluggable build system designed for web projects.

Positional arguments:
  <command>
    clean        Clean the project
    build        Build the project.
    start        Run the local server for the current project
    test         Build the project and run tests.

Optional arguments:
  -h, --help     Show this help message and exit.
  --unmanaged    Disables the Heft version selector: When Heft is invoked via
                 the shell path, normally it will examine the project's
                 package.json dependencies and try to use the locally
                 installed version of Heft. Specify "--unmanaged" to force
                 the invoked version of Heft to be used. This is useful for
                 example if you want to test a different version of Heft.
  --debug        Show the full call stack if an error occurs while executing
                 the tool
  --plugin PATH  Used to specify Heft plugins.

For detailed help about a specific command, use: heft <command> -h

```

## heft clean

```
usage: heft clean [-h] [-v] [--clear-cache]

Optional arguments:
  -h, --help     Show this help message and exit.
  -v, --verbose  If specified, log information useful for debugging.
  --clear-cache  If this flag is provided, the compiler cache will also be
                 cleared. This isn't dangerous, but may lead to longer
                 compile times
```

## heft build

```
usage: heft build [-h] [-v] [--production] [--locale LOCALE] [-l]
                  [--typescript-max-write-parallelism PARALLEILSM]
                  [--max-old-space-size SIZE] [-w] [--clean]


Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --verbose         If specified, log information useful for debugging.
  --production          If specified, build ship/production output
  --locale LOCALE       Only build the specified locale, if applicable.
  -l, --lite            Perform a minimal build, skipping optional steps like
                        linting.
  --typescript-max-write-parallelism PARALLEILSM
                        Set this to change the maximum write parallelism.
                        This parameter overrides what is set in typescript.
                        json. The default is 50.
  --max-old-space-size SIZE
                        Used to specify the max old space size.
  -w, --watch           If provided, run tests in watch mode.
  --clean               If specified, clean the package before building.
```

## heft start

```
usage: heft start [-h] [-v] [--production] [--locale LOCALE] [-l]
                  [--typescript-max-write-parallelism PARALLEILSM]
                  [--max-old-space-size SIZE] [--clean]


Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --verbose         If specified, log information useful for debugging.
  --production          If specified, build ship/production output
  --locale LOCALE       Only build the specified locale, if applicable.
  -l, --lite            Perform a minimal build, skipping optional steps like
                        linting.
  --typescript-max-write-parallelism PARALLEILSM
                        Set this to change the maximum write parallelism.
                        This parameter overrides what is set in typescript.
                        json. The default is 50.
  --max-old-space-size SIZE
                        Used to specify the max old space size.
  --clean               If specified, clean the package before starting the
                        development server.
```

## heft test

(Help is shown with `@rushstack/heft-jest-plugin` configured.)

```
usage: heft test [-h] [-v] [--production] [--locale LOCALE] [-l]
                 [--typescript-max-write-parallelism PARALLEILSM]
                 [--max-old-space-size SIZE] [-w] [--clean] [--no-test]
                 [--no-build] [--config RELATIVE_PATH] [--debug-heft-reporter]
                 [--detect-open-handles] [--disable-code-coverage]
                 [--find-related-tests SOURCE_FILE]
                 [--max-workers COUNT_OR_PERCENTAGE] [--silent] [-t REGEXP]
                 [--test-path-pattern REGEXP] [--test-timeout-ms INTEGER] [-u]


Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --verbose         If specified, log information useful for debugging.
  --production          If specified, build ship/production output
  --locale LOCALE       Only build the specified locale, if applicable.
  -l, --lite            Perform a minimal build, skipping optional steps like
                        linting.
  --typescript-max-write-parallelism PARALLEILSM
                        Set this to change the maximum write parallelism.
                        This parameter overrides what is set in typescript.
                        json. The default is 50.
  --max-old-space-size SIZE
                        Used to specify the max old space size.
  -w, --watch           If provided, run tests in watch mode.
  --clean               If specified, clean the package before building.
  --no-test             If specified, run the build without testing.
  --no-build            If provided, only run tests. Do not build first.
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
                        documentation. This parameter may alternatively be
                        specified via the HEFT_JEST_DETECT_OPEN_HANDLES
                        environment variable.
  --disable-code-coverage
                        Disable any configured code coverage. If code
                        coverage is not configured, this parameter has no
                        effect. This parameter may alternatively be specified
                        via the HEFT_JEST_DISABLE_CODE_COVERAGE environment
                        variable.
  --find-related-tests SOURCE_FILE
                        Find and run the tests that cover a space separated
                        list of source files that were passed in as arguments.
                         This corresponds to the "--findRelatedTests"
                        parameter in Jest's documentation.
  --max-workers COUNT_OR_PERCENTAGE
                        Use this parameter to control maximum number of
                        worker processes tests are allowed to use. This
                        parameter is similar to the parameter noted in the
                        Jest documentation, and can either be an integer
                        representing the number of workers to spawn when
                        running tests, or can be a string representing a
                        percentage of the available CPUs on the machine to
                        utilize. Example values: "3", "25%" This parameter
                        may alternatively be specified via the
                        HEFT_JEST_MAX_WORKERS environment variable.
  --silent              Prevent tests from printing messages through the
                        console. This corresponds to the "--silent" parameter
                        in Jest's documentation.
  -t REGEXP, --test-name-pattern REGEXP
                        Run only tests with a name that matches a regular
                        expression. The REGEXP is matched against the full
                        name, which is a combination of the test name and all
                        its surrounding describe blocks. This corresponds to
                        the "--testNamePattern" parameter in Jest's
                        documentation.
  --test-path-pattern REGEXP
                        Run only tests with a source file path that matches a
                        regular expression. On Windows you will need to use
                        "/" instead of "\" This corresponds to the
                        "--testPathPattern" parameter in Jest's documentation.
  --test-timeout-ms INTEGER
                        Change the default timeout for tests; if a test
                        doesn't complete within this many milliseconds, it
                        will fail. Individual tests can override the default.
                        If unspecified, the default is normally 5000 ms. This
                        corresponds to the "--testTimeout" parameter in
                        Jest's documentation. This parameter may
                        alternatively be specified via the
                        HEFT_JEST_TEST_TIMEOUT_MS environment variable.
  -u, --update-snapshots
                        Update Jest snapshots while running the tests. This
                        corresponds to the "--updateSnapshots" parameter in
                        Jest
```
