---
title: SemVer
---

When an **NPM package** is published to an NPM registry, the package folder gets compressed into a `tar` archive
("tarball") and uploaded to the NPM registry server. The release is identified by a package `"name"`
and `"version"`, which are specified in the published **package.json** file. For example:

**my-library/package.json**

```js
{
  "name": "my-library",
  "version": "1.2.3",
  "description": "This is an example NPM package"
}
```

The published version (`1.2.3`) might later be marked as **"deprecated"**, for example

If a security vulnerability is later discovered for the `1.2.3` release, we can mark that version
as **"deprecated"**. If the release is found to contain malware or other content that violates a policy,
we could mark it as **"unpublished"** (preventing installation entirely). However, most modern registries
will NOT allow a given version to be republished with different content, since that can interfere with caching
and reproducible builds. Thus, within a given NPM registry, the package name and version from a mostly
unique key for obtaining a given release.

A package can "depend on" other packages, which essentially means that in order to install the package,
the package manager must also install those dependencies. Dependencies are specified in **package.json**
using the fields `"dependencies"`, `"devDependencies"`, and `"peerDependencies"`. (Various other fields
can influence how dependencies get installed, for example `"optionalDependencies"` and
`"peerDependenciesMeta"`.)

Here's an example where `my-app` depends on `my-library`:

**my-app/package.json**

```js
{
  "name": "my-app",
  "version": "0.0.0",
  "dependencies": {
    "my-library": "^1.2.0"
  }
}
```

The version notation is defined by the **Semantic Version** standard, **"SemVer"** for short. Consult
the [SemVer Specification](https://semver.org/) for full details. The standard defines two kinds of syntaxes:

1. A **version** identifies a single specific release of an NPM package.
   For example, `1.2.3` used in the `"version"` field above.
2. A **version range** is a pattern that can match muliple possible versions.
   For example `^1.2.0` used in the `"dependencies"` field above. It matches `1.2.0` and `1.7.9`
   but not `1.1.0` nor `2.0.0`. See below for details.

## "Version" cheat sheet

Versions must have three parts (`MAJOR.MINOR.PATCH`) and sometimes four parts (`MAJOR.MINOR.PATCH-PRERELEASE`):

- **MAJOR number:** No guarantees; breaking changes are possible.
  For example if `2.0.0` is bumped to `3.0.0`, an existing API might get removed or renamed.
- **MINOR number:** Guaranteed backwards compatible; but may not be forwards compatible.
  For example if `2.0.0` is bumped to `2.1.0`, a new API might be added, but an old API shouldn't get removed.
- **PATCH number:** Guaranteed backwards and forwards compatible; bug fixes only.
  For example if `2.0.0` is bumped to `2.0.1`, a bug might get fixed, but no API is added or removed.
- **PRERELEASE suffix:** Used to specify a sequence of incremental releases, such as nightly builds,
  release candidates for testing, preview releases, etc. For example, the third test release of pull request
  #1234 might get published with version `5.0.0-pr1234.3`.
- For completeness: The spec also defines an optional "metadata suffx" specified using the `+` character.
  This component has limited usefulness and is best avoided.

"Prerelease" tags are optional strings that are appended using a hyphen (`-`). They are so-named because
they are considered to precede their base version. For example, the following versions are listed in
**_increasing order_** according to the SemVer rules for ordering:

- `1.2.3-beta` (smallest / oldest version)
- `1.2.3-dev.0`
- `1.2.3-dev.1`
- `1.2.3-dev.2`
- `1.2.3-pr1234.0`
- `1.2.3-pr1234.1`
- `1.2.3` (biggest / newest version)

Be careful: The ordering rules for prereleases involve complicated string parsing heuristics,
and the version range matching rules can be counterintuitive.

> Many NPM packages use SemVer syntax but do not implement its behavioral semantics.
> Some packages are simply careless about their interface contracts. Other projects
> intentionally chose a looser convention, where MAJOR bumps are reserved for big changes,
> and MINOR and PATCH increments indicate "less significant changes" that may still break
> an interface contract.

## "Version range" cheat sheet

The following version range syntaxes are commonly used with NPM packages, and can be considered "best practices":

<div className="markdown-table-nowrap-first-column">

<!-- prettier-ignore-start -->
| Example syntax | Description |
| :--- | :--- |
| `1.2.3` | If an exact version is used, it matches only that single version |
| `*` | The star will matches any version without restrictions |
| `>=1.2.3` | Comparison operators (`<`, `>`, `<=`, `>=`) match according to the ordering of versions.  In this example, `1.2.3` and `5.0.0`, but not `1.2.2`. Note that `1.2.3-prerelease.1` will also match,  but `1.2.4-prerelease.0` will NOT -- **prerelease versions** only match ranges with equal MAJOR/MINOR/PATCH. |
| `>=1.2.3-prerelease.0` | Note that a **prerelease range** can match a differing MAJOR/MINOR/PATCH.  This example will match both `5.0.0` and `>=1.2.3-prerelease.2` (but NOT `1.2.4-prerelease.0`). |
| `>=1.2.3 <3.0.0` | Concatenated ranges specify an AND conjunction.  In this example, `1.2.3` and `2.0.0` but not `3.0.0` nor `1.0.0`. |
| `~1.2.3` | The tilde (`~`) shorthand matches equal or newer versions within the same PATCH version.  The example `~1.2.3` is equivalent to `>=1.2.3 <1.3.0`. See **MAJOR Version 0** warning below. |
| `^1.2.3` | The caret (`^`) shorthand matches equal or newer versions within the same MINOR version.  The example `^1.2.3` is equivalent to `>=1.2.3 <2.0.0`. See **MAJOR Version 0** warning below. |
| <!-- MDX is incapable of escaping a pipe --> <code>^1.0.0 &#124;&#124; ^2.0.0</code> | The <code>&#124;&#124;</code> operator specifies an OR disjunction.  This example will match either `^1.0.0` or `^2.0.0`. |
| `workspace:*` | Expressions with colon prefixes such as `npm:` and `workspace:` are actually **dependency specifiers**, not SemVer ranges. They are explained in a separate section below. |
<!-- prettier-ignore-end -->

</div>

The SemVer standard defines many other syntaxes; however, if a syntax doesn't appear in the list above,
then we generally recommend to avoid it. Keep your version ranges simple!

> **MAJOR Version 0**
>
> The caret and tilde operators have a special narrower meaning when the MAJOR version is `0`.
>
> For example, the caret `^0.1.2` will match `>=0.1.2 <0.2.0`, as if it was a tilde.
>
> And `~0.1.2` is equivalent to `0.1.2`, as if it was an exact version.
>
> The idea is to enable the MAJOR version to be kept at 0 through a series of early releases
> that may include breaking changes, and then version 1.0.0 can be used for the first stable release.
> Many people are unaware of this behavior.

The most commonly used syntaxes are `^1.2.3` for packages known to be stable, and `~1.2.3` for packages
that have been known to violate SemVer by introducing breaking changes in a MINOR release.

Unbounded MAJOR ranges such as `*` or `>2.0.0` are generally not recommended, unless constrained in
some other way such as via a peer dependency. (The special `workspace:*` notation is okay
because its wildcard gets rewritten to an exact version during pubishing.)

## SemVer surprises

Here's a quick list of SemVer edge cases that can be counterintuitive for casual users:

- `~0.1.2` does NOT match `0.1.3` -- see the "MAJOR Version 0" note above
- `^0.1.2` does NOT match `0.2.0` -- see the "MAJOR Version 0" note above
- `^1.0.0` does NOT match `1.0.0-hotfix.0` because the "hotfix" is using PRERELEASE syntax,
  considered "smaller" than `1.0.0`
- `^1.0.0` does NOT match `1.0.1-hotfix.0` because prereleases only match their base version
- `>1.0.0` does NOT match `1.0.1-hotfix.0` for the same reason
- `^1.0.0-beta` DOES match `1.2.3` because prerelease ranges do mwatch newer versions

You can use the [SemVer calculator](https://semver.npmjs.com/) website to experiment with SemVer range expressions
to see what they match.

## "Dependency specifier" cheat sheet

Strictly speaking, the `"dependencies"` table in **package.json** maps to a **dependency specifier** syntax,
which is a superset of **SemVer ranges**. Here's some examples:

<div className="markdown-table-nowrap-first-column">

<!-- prettier-ignore-start -->
| Example syntax | Description |
| :--- | :--- |
| `"foo": "beta"` | Install the specific version of NPM package `foo` that is currently tagged using the `beta` [dist-tag](https://docs.npmjs.com/cli/v9/commands/npm-dist-tag), according to the NPM registry |
| `"foo": "workspace:^1.2.3"` | Symlink `foo` from the project folder in your local PNPM workspace, instead of installing a package from the NPM registry. If the containing package gets published, during publishing `pnpm publish` will transform `"workspace:^1.2.3"` to `"^1.2.3"` in the published **package.json** file. |
| `"foo": "workspace:*"` | The string `workspace:*` is handled specially by PNPM during publishing.  It will match any version, but during publishing the `workspace:*` string will get transformed to the exact version  of that package. For example, suppose `foo` is a local project with version `1.2.3`. During publishing,  `workspace:^1.0.0` would transform to `^1.0.0`, whereas `workspace:*` would transform to `1.2.3`. |
| `"foo2": "npm:foo@^2.0.0"` | Install `foo` with version range `^2.0.0`, but into `node_modules/foo2/` (for example because we already installed version 1 in `node_modules/foo/` |
| `"foo": "file:./path/to/foo.tgz"` | Install `foo` by extracting **foo.tgz** from disk. This practice is not recommended, but called out here because it was used by Rush's legacy installation model (with `useWorkspaces=false`). |

<!-- prettier-ignore-end -->

</div>

## See Also

- [SemVer calculator](https://semver.npmjs.com/) - an interactive online tool for testing SemVer range expressions to see which versions they match
- [SemVer Specification](https://semver.org/) - the reference document for the SemVer standard
- ["semver" NPM package](https://www.npmjs.com/package/semver) - a CLI tool and JavaScript library for parsing SemVer strings
