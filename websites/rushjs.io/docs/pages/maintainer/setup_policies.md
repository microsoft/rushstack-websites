---
title: Enabling policies
---

The [rush-schema.json](https://github.com/microsoft/rushstack/blob/main/libraries/rush-lib/src/schemas/rush.schema.json) JSON schema defines some additional settings you can specify in **rush.json**.

## projectFolderMinDepth: Controlling folder size

Rush repositories can grow very big. When you have lots of projects (and maybe several repositories), it's very useful to impose a standard structure that makes it immediately obvious which folders contain buildable projects. We suggest a convention like this:

- In the repo, top-level folders are "category folders" (e.g. "**~/demo/libraries**")
- Project folders are always nested under a category folder (e.g. "**~/demo/libraries/lib1**")
- A project folder must always be at the second level (e.g. we forbid nesting such as "**~/demo/libraries/lib1/lib2**")
- Cross-project files are always stored in the common folder (e.g. "**~/demo/common/docs**", "**~demo/common/scripts**", etc.)
- There are no exceptions to these rules

If we want to adopt this policy for our demo repo, we can move the projects into category folders like this:

**~/demo/apps/application**<br/>
**~/demo/libraries/lib1**<br/>
**~/demo/libraries/lib2**<br/>

...and then enforce that projects must be a the second level using these settings in **~/demo/rush.json**:

```javascript
  // The minimum folder depth for the projectFolder field.
  // (The default value is 1, i.e. no slashes in the path name.)
  "projectFolderMinDepth": 2,
  // The maximum folder depth for the projectFolder field.
  // (The default value is 2, i.e. a single slash in the path name.)
  "projectFolderMaxDepth": 2,
```

## allowedEmailRegExps: Avoiding private e-mail addresses

Git requires every commit to be accompanied by a name and e-mail address. However, there is no validation of these fields, and their defaults are pulled from a global setting on your PC that's easy to forget about. When using Git for work, people often accidentally commit using an unintended e-mail address that looks... not so professional. If the repo is hosted on GitHub, these e-mail addresses immediately become queryable via the GitHub REST API, easy pickings for unscrupulous spammers. (The privacy settings for your GitHub account don't affect "git commit".)

Rush can help, though. The "gitPolicy" setting in **rush.json** allows you to specify a list of acceptable e-mail patterns for a repository. The patterns are regular expressions. (Since they are inside a JSON string literal, note that backslashes must be double-escaped.)

```javascript
  "gitPolicy": {
    // A list of regular expressions describing allowable e-mail patterns
    // for Git commits.  They are case-insensitive anchored JavaScript RegExps.
    // Example: ".*@example\\.com"
    "allowedEmailRegExps": [
      // Require GitHub scrubbed e-mails
      "[^@]+@users\\.noreply\\.github\\.com"
    ],

    // An example valid e-mail address for "Mr. Example" that conforms to one
    // of the allowedEmailRegExps.  Example: "mr-example@contoso.com"
    "sampleEmail": "mrexample@users.noreply.github.com"
  },
```

Whenever the developer runs `rush install`, Rush will check that their e-mail address follows one of the patterns. If not, it displays a warning like this:

```bash
rush install
```

```
Rush Multi-Package Build Tool

Checking Git policy for this repository.

Hey there!  To keep things tidy, this repo asks you to submit your Git commmits
using an e-mail like this pattern:

    [^@]+@users\.noreply\.github\.com

...but yours is configured like this:

    Bob <bobbles@somewhere.sketchy.int>

To fix it, you can use commands like this:

    git config --local user.name "Mr. Example"
    git config --local user.email "mrexample@users.noreply.github.com"

Aborting, so you can go fix your settings.  (Or use --bypass-policy to skip.)
```

## approvedPackagesPolicy: Reviewing new NPM dependencies

Are there certain people on your team who constantly find exciting new libraries and add them to your package.json? This can quickly get out of hand, especially in environments that require legal or security reviews for external code. The **approvedPackagesPolicy** feature allows you to detect when new NPM dependencies are introduced.

Since different levels of scrutiny are often required (e.g. for a shipping product, versus an intern project, versus an internal library), we distinguish "review categories". This allows us to approve a package once for an entire category of projects, while still being alerted when the dependency is used somewhere else.

Continuing the example scenario from [Setting up a new repo](../../maintainer/setup_new_repo), here's how we would update **rush.json** to define some review categories for "published" versus "internal" projects:

```javascript
{
  "rushVersion": "4.0.0",
  "npmVersion": "5.5.1",
  "nodeSupportedVersionRange": ">=8.9.0 <9.0.0",

  "approvedPackagesPolicy": {
    "reviewCategories": [ "published", "internal" ],
    // We don't need to review @types packages, because we can assume
    // the untyped package should already have been approved
    "ignoredNpmScopes": [ "@types" ]
  },

  "projects": [
    {
      "packageName": "application",
      "projectFolder": "application",
      "reviewCategory": "internal"
    },
    {
      "packageName": "lib1",
      "projectFolder": "lib1",
      "reviewCategory": "internal"
    },
    {
      "packageName": "lib2",
      "projectFolder": "lib2",
      "reviewCategory": "published"
    }
  ]
}
```

When you run `rush install`, it will create two files that report your dependencies. These files should be added to Git and can be configured so that changes require approval:

- **~/demo/common/config/rush/browser-approved-packages.json**: Packages approved for usage in a web browser. This is generally the stricter of the two types, so by default all new packages are added to this file. For web browser dependencies, the review discussion typically focuses on: _How big is the minified code?_ _What's the license?_ _Are there security issues?_
- **~/demo/common/config/rush/nonbrowser-approved-packages.json**: Packages approved for usage everywhere _except_ in a web browser. This review discussion typically focuses on: _How much clutter will it pull into our node_modules folder?_ _Do we already have an equivalent package?_ _Is there any real code in there, or is it a just a flimsy wrapper for another package?_

After running `rush install`, the **browser-approved-packages.json** file will look like this.

```javascript
{
  "packages": [
    {
      "name": "@microsoft/gulp-core-build",
      "allowedCategories": [ "internal" ]
    },
    {
      "name": "@microsoft/node-library-build",
      "allowedCategories": [ "internal", "published" ]
    },
    {
      "name": "gulp",
      "allowedCategories": [ "internal", "published" ]
    }
  ]
}
```

For example, this file is showing that the external dependency **@microsoft/gulp-core-build** was found in the package.json file for an "internal" project (let's say **~/demo/lib1**) but not any "public" project (such as **~/demo/application**).

Rush has no way to detect whether an NPM package is for the browser or not. Since these are all non-browser files, you must manually move them to the other file **browser-approved-packages.json**.

#### How approvals work

Whenever `rush install` is run, the content in these files will be broadened to match the current contents of package.json. This file should be committed to Git. When the developer creates a pull request, the PR diff can be used e.g. to trigger a special approval.
