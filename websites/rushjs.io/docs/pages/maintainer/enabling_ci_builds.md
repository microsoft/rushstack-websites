---
title: Enabling CI builds
---

When you set up a PR build definition for continuous integration, the automated script can run essentially the same commands that a developer invokes manually. But there are some additional options that you may find useful.

If we were invoking these commands manually, it might look something like this:

```sh
# Fetch the master branch
$ git fetch origin master:refs/remotes/origin/master -a

# (optional) Fail if the developer didn't create a required change log.
# By "fail", we mean that the script will stop because Rush returned
# a nonzero exit code.
$ rush change -v

# Install NPM packages in the common folder, but don't automatically do "rush link"
$ rush install --no-link

# Run "rush link" explicitly, so your CI system can measure it as a separate step
$ rush link

# Do a full "ship" build, showing detailed logs in real time
# (We assume "--ship" was defined in common/config/rush/command-line.json)
$ rush rebuild --ship --verbose
```

But there's one hitch -- what if your CI environment doesn't come with Rush preinstalled?
You might consider sticking a **package.json** at the root of your repo, and then invoking
`npm install` to install Rush. Unfortunately this would introduce a phantom **node_modules**
folder, which defeats Rush's protection against
[phantom dependencies](../../advanced/phantom_deps).

## install-run-rush.js for bootstrapping Rush

Fortunately there's a more elegant solution for getting Rush installed on a CI machine:
All Rush repos come with a script `common/scripts/install-run-rush.js` that will:

- find your **rush.json** file
- read the `rushVersion` that's specified there
- automatically install that version of Rush under the **common/temp/install-run** folder
- using the appropriate settings from your repo's .npmrc file
- ...and then invoke the Rush tool, passing along any command-line parameters that you provided

The installation is cached, so this is not any slower than invoking Rush normally. In fact,
for CI systems that preserve files from previous runs, **install-run-rush.js** is faster
than `npm install` because it can cache different versions of Rush depending on the Git branch
being built.

Try executing the script from your shell:

```
~$ cd my-repo
~/my-repo$ node common/scripts/install-run-rush.js --help
~/my-repo$ node common/scripts/install-run-rush.js install
```

Below we'll show how to incorporate this into a Travis build definition.

## install-run.js for other commands

By the way, Rush provides a second script **install-run.js** that allows you to use this same
technology with arbitrary NPM packages. For example, here's a command that prints a QR code
for the Rush web site: :-)

```
~/my-repo$ node common/scripts/install-run.js qrcode@1.2.2 qrcode https://rushjs.io
```

Note that the **install-run.js** command line is a little different: It must include the
package name and version (which can be a SemVer range, although it's best to avoid nondeterminism).
It also needs a second parameter that specifies the name of the executable binary (even though
the binary name is often the same as the package name). In the above example, we're invoking the
`qrcode` binary and its command-line parameter is `https://rushjs.io`.

Of course, a more straightforward approach would be to specify **qrcode** as an ordinary dependency
of a **package.json** file somewhere, for example a **tools/repo-scripts** project. That way it can
part of your normal installation, and tracked by your repo's shrinkwrap file. But in some cases
that is undesirable, for example scripts that are only used by a lightweight CI job that doesn't
require a `rush install`. or Git hooks that need to work correctly even when the `rush install` state
is broken or outdated.

## Travis example from "rush init"

[Travis CI](https://travis-ci.com/) is a continuous integration build service that integrates
with GitHub and is free for open source projects. The `rush init` command creates a **.travis.yml**
that's a good starting point if you use this service. Note how it uses **install-run-rush.js**
to invoke the Rush tool:

```yaml
language: node_js
node_js:
  - '8.9.4'
script:
  - set -e

  - echo 'Checking for missing change logs...' && echo -en 'travis_fold:start:change\\r'
  - git fetch origin master:refs/remotes/origin/master -a
  - node common/scripts/install-run-rush.js change -v
  - echo -en 'travis_fold:end:change\\r'

  - echo 'Installing...' && echo -en 'travis_fold:start:install\\r'
  - node common/scripts/install-run-rush.js install
  - echo -en 'travis_fold:end:install\\r'

  - echo 'Building...' && echo -en 'travis_fold:start:build\\r'
  - node common/scripts/install-run-rush.js rebuild --verbose
  - echo -en 'travis_fold:end:build\\r'
```

For an example of an equivalent setup using an Azuze DevOps build pipeline, take a look at the
[build.yaml file](https://github.com/microsoft/rushstack/blob/master/common/config/azure-pipelines/templates/build.yaml),
in the monorepo where Rush is developed.
