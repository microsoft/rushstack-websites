---
title: Enabling Prettier
---

The Rush Stack [lint strategy](https://rushstack.io/pages/heft_tasks/eslint/) recommends the
[Prettier](https://prettier.io/) tool for ensuring consistent syntax across all source files. With this
approach, ESLint and Prettier have complementary roles:

Recommended ESLint usage:

- ESLint enforces a set of rules for coding conventions.<br/>_Example: "Function names should be capitalized with camelCase."_
- Fixing these issues can break tests or API contracts. ESLint can cause build errors.
- Rules are highly customizable -- different projects may require different rules.
- Thus, we recommend to invoke ESLint separately for each project folder, as part of building that project.

Recommended Prettier usage:

- Prettier normalizes syntax formatting.<br/>_Example: indentation and comma placement_
- Fixing these issues should never affect the meaning of the code. Prettier can be run automatically and invisibly.
- Prettier discourages customization -- one convention is good enough for the entire repo, if not the entire world.
- Thus, we recommend applying Prettier globally for the entire repo.

In this article we'll show how to configure Prettier to run automatically during `git commit`.
We also suggest for developers to install the
[Prettier extension for VS Code](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode),
which formats files automatically whenever you save.

## Preparing for Prettier

Before we get to the Git hook, first we need to configure Prettier, and get your existing files prettified.

1.  Since Prettier will run for all files, its [config file](https://prettier.io/docs/en/configuration.html) goes
    at the root of the repo. Prettier allows many different names for this config file, but despite all that
    flexibility its JSON parser rejects code comments. Therefore it's recommended to use the `.js` file extension.

    **&lt;repo root&gt;/.prettierrc.js**

    ```js
    // Documentation for this file: https://prettier.io/en/configuration.html
    module.exports = {
      // We use a larger print width because Prettier's word-wrapping seems to be tuned
      // for plain JavaScript without type annotations
      printWidth: 110,

      // Use .gitattributes to manage newlines
      endOfLine: 'auto',

      // Use single quotes instead of double quotes
      singleQuote: true,

      // For ES5, trailing commas cannot be used in function parameters; it is counterintuitive
      // to use them for arrays only
      trailingComma: 'none'
    };
    ```

2.  You also need to make a `.prettierignore` file to tell Prettier which files to skip. Note that the Git hook
    will implicitly filter any files that are not committed to Git, however this is not the case for other tools
    such as the
    [Prettier extension for VS Code](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).
    It is recommended to for `.prettierignore` to extend the same patterns used in `.gitignore`, like this:

    **&lt;repo root&gt;/.prettierignore**

    ```shell
    #-------------------------------------------------------------------------------------------------------------------
    # Keep this section in sync with .gitignore
    #-------------------------------------------------------------------------------------------------------------------

    👋 (copy + paste your .gitignore file contents here) 👋

    #-------------------------------------------------------------------------------------------------------------------
    # Prettier-specific overrides
    #-------------------------------------------------------------------------------------------------------------------

    # Rush files
    common/changes/
    common/scripts/
    common/config/
    CHANGELOG.*

    # Package manager files
    pnpm-lock.yaml
    yarn.lock
    package-lock.json
    shrinkwrap.json

    # Build outputs
    dist
    lib

    # Prettier reformats code blocks inside Markdown, which affects rendered output
    *.md
    ```

3.  Once the configuration is set up, next we need to invoke Prettier manually to reformat all the existing
    source files. You can fine-tune your `.prettierignore` configuration by examining the Git diff after
    performing this command.

    ```shell
    # Install prettier so you can invoke it manually
    $ npm install --global prettier

    # Run these commands from your repo root, since "." below refers to the current folder
    $ cd my-repo

    # See what files Prettier will operate on; use this to tune your .prettierignore rules
    $ prettier . --list-different

    # When you are ready, this will bulk fix all existing source files in your repo
    $ prettier . --write
    ```

The first time you run Prettier, it may produce a very large diff if you already have many files in your repo.
In that case it's a good idea to merge a PR with just those changes. That will make it easier to review the
PR for the next steps below.

## Git hook requirements

Let's set up a [Git hook](../../maintainer/git_hooks) that will invoke Prettier automatically
whenever changes are committed.

Keep in mind that the `git commit` command is a core operation that must always be quick and reliable:
Developers may want to make commits to their branch without running `rush install` first. In some situations
`rush install` cannot be run, because the branch may be in a partially working state. It seems that our Git hook
should NOT rely on the usual monorepo installation mechanism.

We could solve this by using Rush's [install-run.js](../../maintainer/enabling_ci_builds)
script to install the Prettier package on demand. But it turns out that we need to install several dependencies
together:

- `pretty-quick`: To speed up the operation, we'll use [pretty-quick](https://www.npmjs.com/package/pretty-quick)
  to calculate the subset of files that are staged for commit. Only those files need to processed.
  Prettier cannot do this part, because it doesn't interface with Git.
- `prettier`: The `pretty-quick` tools has a peer dependency on Prettier's package.
- **optional plugins:** If you use any plugins for Prettier, they need to be resolvable by the `prettier` package.

For this situation, Rush's "autoinstaller" feature provides a convenient alternative to **install-run.js**.

## Enabling the Git hook

1.  First, use the [rush init-autoinstaller](../../commands/rush_init-autoinstaller) command to
    create an autoinstaller:

    ```shell
    # This creates the common/autoinstallers/rush-prettier/package.json file:
    $ rush init-autoinstaller --name rush-prettier
    ```

2.  Install the dependencies and create the **pnpm-lock.yaml** file:

    ```shell
    $ cd common/autoinstallers/rush-prettier

    # Instead of running these commands, you could instead manually edit the
    # "dependencies" in the package.json file
    $ pnpm install prettier
    $ pnpm install pretty-quick

    # (If you need plugins, install them as well)

    # When you are finished, run this command to ensure that the
    # common/autoinstallers/rush-prettier/ppnpm-lock.yaml file is up to date
    $ rush update-autoinstaller --name rush-prettier
    ```

3.  You should now have two files **package.json** and **pnpm-lock.yaml** in your
    **common/autoinstallers/rush-prettier** folder. Add them to Git and commit them.

    ```shell
    $ git add package.json
    $ git add pnpm-lock.yaml
    $ git commit -m "Create rush-prettier autoinstaller"
    ```

4.  Next, we will create a `rush prettier` custom command that invokes the `pretty-quick` tool.
    Add this to the `"commands"` section of your **command-line.json** file:

    **common/config/rush/command-line.json**

    ```js
      . . .
      "commands": [
        {
          "name": "prettier",
          "commandKind": "global",
          "summary": "Used by the pre-commit Git hook. This command invokes Prettier to reformat staged changes.",
          "safeForSimultaneousRushProcesses": true,

          "autoinstallerName": "rush-prettier",

          // This will invoke common/autoinstallers/rush-prettier/node_modules/.bin/pretty-quick
          "shellCommand": "pretty-quick --staged"
        }
        . . .
    ```

    The `"autoinstallerName": "rush-prettier"` line ensures that our autoinstaller will install Prettier
    before the shell command is invoked. The shell command `pretty-quick --staged` will be invoked
    in the **common/autoinstallers/rush-prettier** folder.

5.  After saving these changes, let's test our custom command by running `rush prettier`. The first time you should
    see Rush automatically performing a number of steps: (1) install the correct version of the Rush engine,
    (2) install the correct version of the PNPM package manager, (3) installing **rush-prettier/package.json**
    and its dependencies, (4) invoking `pretty-quick --staged`. However the second time you invoke it, the first
    3 steps are up to date, so step (4) runs without any delay. Nice!

    Because `rush prettier` only processes files that are staged for commit, the report will most likely show:

    ```
    Found 0 changed files.
    Everything is awesome!
    ```

6.  The last step is to add a Git hook that invokes `rush prettier` automatically whenever `git commit` is performed.
    To do this, create a file called **pre-commit** in the **common/git-hooks** folder:

    **common/git-hooks/pre-commit**

    ```
    #!/bin/sh
    # Called by "git commit" with no arguments.  The hook should
    # exit with non-zero status after issuing an appropriate message if
    # it wants to stop the commit.

    # Invoke the "rush prettier" custom command to reformat files whenever they
    # are committed. The command is defined in common/config/rush/command-line.json
    # and uses the "rush-prettier" autoinstaller.
    node common/scripts/install-run-rush.js prettier || exit $?
    ```

7.  To actually install the hook, run `rush install`.

8.  Before finally merging your PR, you may want to run `prettier . --write` one last time to reformat any files
    that may have been modified before we installed the hook.

You're done! Whenever changes are committed to Git, they will now be automatically prettified.

## Installing prettier plugins

Prettier supports [plugins](https://prettier.io/docs/en/plugins.html), which can add new languages or formatting rules. If you choose to add prettier plugins to your setup, special care must be taken to ensure that all of the tooling that might call prettier will be able to load your prettier configuration:

- `rush prettier` as configured in the steps above
- Editors (VSCode, Webstorm, Sublime, etc.) that are configured to format on save
- Jest and heft test, which use prettier to format snapshots

Here's an example, using the `prettier-plugin-packagejson` plugin:

1.  First, add the plugin package to your autoinstaller `package.json` file -- if configured as above,
    this will be `common/autoinstallers/rush-prettier/package.json`.

    ```json
    {
      "dependencies": {
        "prettier-plugin-packagejson": "^2.2.18"
      }
    }
    ```

2.  Update your autoinstaller's lockfile:

    ```shell
    rush update-autoinstaller --name rush-prettier
    ```

3.  Add the _full path_ of your plugin folder to the `plugins` array in `.prettierrc.js`:

    ```javascript
    module.exports = {
      // ... your other configuration goes here ...
      // ,

      plugins: ['./common/autoinstallers/rush-prettier/node_modules/prettier-plugin-packagejson']
    };
    ```

4.  Commit your autoinstaller and prettierrc changes.

Note that after pulling this change, local developers will need to run `rush prettier` at least once to install the updated autoinstaller -- otherwise, their format-on-save functions and jest snapshot formatting may stop working. In practice this will fix itself after they perform at least one git commit and run the git hooks, but it may be worth notifying your team any time you do update prettier plugins this way.
