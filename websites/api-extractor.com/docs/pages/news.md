---
layout: page
title: What's new
---

To find out what's changed in the latest release, please see the package changelogs:

- [@microsoft/api-extractor changelog](https://github.com/microsoft/rushstack/blob/main/apps/api-extractor/CHANGELOG.md)
- [@microsoft/api-documenter changelog](https://github.com/microsoft/rushstack/blob/main/apps/api-documenter/CHANGELOG.md)
- [@microsoft/api-extractor-model changelog](https://github.com/microsoft/rushstack/blob/main/libraries/api-extractor-model/CHANGELOG.md).

API Extractor is maintained by the Rush Stack developer community.  For roadmaps and updates from the team,
please visit the [Rush Stack News](https://rushstack.io/pages/news/) page.

There's also a [@rushstack](https://twitter.com/rushstack) Twitter feed.


## Important Updates

### API Extractor 7 is out! 🎉

After nearly 6 months of "beta" releases, we're excited to announce that API Extractor 7
is finally ready for general usage!  Since the beta releases used the 7.0.x version numbers,
we're using 7.1.0 for the first stable release.

### Big changes in Version 7

Version 7 represents a major overhaul of the analysis engine:  In the past, API Extractor used a relatively
simple analyzer that required special parsers/writers to be coded for each supported declaration type
(classes, enums, interfaces, etc).  This worked because of an assumption that your code base restricted itself
to a small set of recommended TypeScript language features.  When we introduced the .d.ts rollup feature, it suddenly
became important to perfectly handle all sorts of expressions, since otherwise the generated .d.ts rollup
would not compile.  To address this, a new, much more flexible analyzer was designed.  In API Extractor 6,
this new analyzer is not used for API reports or documentation.  It had trouble with a lot of projects, but that
wasn't a big deal, since you could simply disable the .d.ts rollup feature for those projects.  Starting with
API Extractor 7, the new analyzer is used for everything.  This is a big architectural improvement, but now
there's no fallback if it can't handle certain projects.  Thus, version 7 was in "beta" for several months while
we ironed out every last bugs and edge case until several major real world monorepos could finally build successfully.

In addition to this, API Extractor brings a bunch of other cool enhancements:

- Each warning, error, and console message has been assigned a "message ID"

- Each message ID can be can individually suppressed or configured

- The **api-extractor.json** config file format has been improved, and is now self-documenting

- The API for invoking API Extractor programmatically has been greatly improved, and now includes a general
  callback for intercepting all messages

- The .api.json file format was completely redesigned, and we now provide a high-level library
  **@microsoft/api-extractor-model** for loading, saving, and querying it

- Support for TypeScript 3.4 in all its glory!

### Upgrading from API Extractor 6

The new config file schema is the most conspicuous breaking change.  Fortunately, the overall concepts and operation
mostly the same in Version 7, so upgrading **api-extractor.json** is a straightforward 1:1 mapping.  Note that
the interpretation of relative file paths has changed somewhat, though.  Also, certain sections such as `"policies"`
and `"validationRules"` are no longer needed.  If you invoke API Extractor programmatically, the `Extractor` class
has significant breaking changes, but it's well documented.
