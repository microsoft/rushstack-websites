---
title: Installing Git hooks
---

The Git version control system allows you to configure hook scripts that will be invoked whenever certain actions
are performed. (See Git's [Customizing Git](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) chapter
for complete documentation.) The basic idea is that you create shell scripts with well-known names such as
**pre-commit**, **post-update**, **prepare-commit-msg**, and so forth. If the Git client finds these scripts
in the local **.git/hooks** folder, it will run the scripts whenever the corresponding operations are performed.

For security reasons, Git will not automatically install these scripts when you clone a repo. Instead, each
developer must invoke a command that creates the files and chmods them to be executable. Rush can automate
this for you!

## Configuring Rush to install a Git hook script

As an example, suppose we find that developers are making commits without a meaningful description of their work.
As a result, the Git history is difficult to understand. To solve this problem, might want to add a `commit-msg`
hook that requires the commit message to meet certain requirements. For example, here's a simple Bash script that
requires at least 3 words of text:

**common/git-hooks/commit-msg**

```bash
#!/bin/sh
#
# This is an example Git hook for use with Rush.  To enable this hook, rename this file
# to "commit-msg" and then run "rush install", which will copy it from common/git-hooks
# to the .git/hooks folder.
#
# TO LEARN MORE ABOUT GIT HOOKS
#
# The Git documentation is here: https://git-scm.com/githooks
# Some helpful resources: https://githooks.com
#
# ABOUT THIS EXAMPLE
#
# The commit-msg hook is called by "git commit" with one argument, the name of the file
# that has the commit message.  The hook should exit with non-zero status after issuing
# an appropriate message if it wants to stop the commit.  The hook is allowed to edit
# the commit message file.

# This example enforces that commit message should contain a minimum amount of
# description text.
if [ `cat $1 | wc -w` -lt 3 ]; then
  echo ""
  echo "Invalid commit message: The message must contain at least 3 words."
	exit 1
fi
```

The sample file shown above is a template that `rush init` generates when setting up a new repo.
You can probably find a copy as
[common/git-hooks/commit-msg.sample](https://github.com/microsoft/rush-example/blob/main/common/git-hooks/commit-msg.sample)
in your own repo.

You would use it as follows:

1. Add this file in your **common/git-hooks** folder, and commit to Git.
2. When a developer runs `rush install`, Rush will copy this file to be **.git/hooks/commit-msg**
3. When you run `git commit`, Git will find the script and invoke it
4. If the commit message is too short, the script returns a nonzero exit code; Git shows the
   `Invalid commit message` notice and rejects the operation.

Using Rush to install the hook script avoids the need for a separate solution such as the popular
[Husky](https://www.npmjs.com/package/husky) package. Note that Husky expects your repo to have a
root-level **package.json** and **node_modules** folder, and Husky runs shell commands for every Git operation
(even unused hooks); using Rush to install hooks avoids those limitations.

> **Note:** If you need to uninstall the hooks for some reason, it is safe to delete the files
> in your **.git/hooks/** folder.

## Invoking Prettier during "git commit"

The Prettier tool ensures that source files follow consistent conventions for syntax issues like spacing and commas.
By configuring a `git commit` hook to invoke Prettier automatically, you can apply these fixes without any effort
on the developer's part.

The [Enabling Prettier](../../maintainer/enabling_prettier) article provides step-by-step instructions.
