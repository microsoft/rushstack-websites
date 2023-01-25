---
title: rushx
---

The `rushx` command is similar to `npm run` or `pnpm run`: It invokes a shell script that is defined in the
`"scripts"` section of the **package.json** file for an individual project. Any additional CLI parameters
are passed only to that shell script without any validation.

Consider this very simple example project:

**&lt;my project&gt;/package.json**

```js
{
  "name": "my-project",
  "version": "0.0.0",
  "scripts": {
    "build": "rm -Rf lib && tsc",
    "test": "jest"
  }
}
```

If you invoke `rushx` alone, it will simply display the available commands:

```
usage: rushx [-h]
       rushx [-q/--quiet] <command> ...

Optional arguments:
  -h, --help            Show this help message and exit.
  -q, --quiet           Hide rushx startup information.

Project commands for my-project:
  build: "rm -Rf lib && tsc"
  test:  "jest"
```

If you invoke `rushx build`, then it would run `rm -Rf lib && tsc`. If you add a parameter such as
`rushx build --verbose`, it is blindly appended to the end of the string: `rm -Rf lib && tsc --verbose`.

## rush vs rushx

It's easy to confuse these two commands:

- **rush** invokes a generic operation that affects the entire repo ("global commands") or else affects multiple projects ("bulk commands"). Such commands [should be carefully designed](../maintainer/custom_commands.md). Rush enforces that their parameters must be validated and documented.
- **rushx** performs custom operations for one single project. Although some of these are used to implement bulk commands, many of them will be helper scripts that are understood only by the developers of that particular project. Rush does not rigorously validate these commands.

## Why use "rushx" instead of "pnpm run" or "npx"?

The `rushx` command has similar functionality as `pnpm run` or `npx`, but with some additional benefits:

- Ensures deterministic tooling by using the [Rush version selector](../contributing.md)
- Prepares the shell environment based on Rush's configuration
- Implements additional validations
