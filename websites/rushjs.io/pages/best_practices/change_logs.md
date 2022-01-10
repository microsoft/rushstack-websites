---
layout: page
title: Authoring change logs
navigation_source: docs_nav
---

When publishing an NPM package, it is common practice to include a [CHANGELOG.md](https://github.com/microsoft/rushstack/blob/master/libraries/node-core-library/CHANGELOG.md) file to inform your consumers about bug fixes, new features, and changed or removed functionality. Rush automates this using the [rush change]({% link pages/commands/rush_change.md %}) command. This command should be run once you are ready to merge your PR, after all your changes have been committed to the branch. It analyzes the changes in your branch and (when necessary) prompts you to write human-readable descriptions of your changes.

The way in which you phrase your description is important. You don't want to be overly concise or specific, you don't want to reveal private information, and you want the description to be as helpful as possible. We recommend to err on the side of readability. Ask yourself:

- "How is my change relevant to a third-party developer?"
- "Could it break them?"
- "Does it fix a bug that's been annoying them?"
- "Is it a new feature for them to try?"

In some workflows, a human editor will review the change logs before they are published, however everyone should do their best to ensure that the content is clear and professional.

## Recommended Practices

- Use the [present simple tense](http://www.englishtenses.com/tenses/present_simple) using the [imperative ("command") mood](http://grammarist.com/grammar/english-moods/).

- Write from the perspective of an external audience who may be unfamiliar with implementation details of your package

- Focus on scenario outcomes ("Searching now supports wildcards") instead of code changes ("Added regular expression support to SearchHelper class")

- Start with a verb. These verbs are recommended:

  - **Add** - when you introduce or expose a new feature, property, class, UI, etc.
  - **Remove** - when you fully removed something and it can no longer be used.
  - **Deprecate** - when you plan on removing something, but it is still accessible.
  - **Fix an issue with/where...** - when you fixed a bug.
  - **Improve** - when you made an existing thing better.
  - **Update** - when you refresh something, but don't necessarily make it better.
  - **Upgrade** - when upgrading the version of a dependency.
  - **Initial/Beta release of ...** - when releasing a brand-new feature.

- Don't use the word **bug**. Use **issue** instead.

- Don't use shorthand words or acronyms, unless they are widely recognized (e.g. "HTTP")

- Use correct spelling and grammar. The CHANGELOG.md is part of your package's published documentation.

- When referring to public API changes, use the `()` suffix to indicate a function name, e.g. `setSomethingOnWebpart()`

- When referring to public API changes, use backticks (`` ` ` ``) around class and property names.

- When documenting an upgrade, indicate the old and new version. For example: "Upgraded `widget-library` from `1.0.2` to `2.0.1`"

- If fixing a GitHub issue, consider adding the issue URL in parentheses.

- Don't add a trailing period unless you have two or more sentences.

## Example Change Log Messages

Here are some hypothetical change log messages that might be provided to `rush change`:

- _Add "buttonColor" to the button manifest schema_
- _Remove support for older mobile web browsers as described in the README.md_
- _Deprecate the `doSomething()` API function. Use `doSomethingBetter()` instead._
- _Fix an issue where "ExampleWidget" API did not handle dates correctly_
- _Improve the diagnostic logging when running in advanced mode_
- _Upgrade from React 15 to React 16_
- _Initial release of the flexible panels feature_
