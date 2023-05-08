---
layout: page
title: Approach
navigation_source: docs_nav
---

The TSDoc specification aims to meet these requirements:

- **Designed for TypeScript**: ...while aligning as closely as possible with the familiar JSDoc notations we know and love.
- **Markdown integration**: Doc comments may incorporate [CommonMark](http://commonmark.org) notations for rich text elements such as boldface, code fences, headings, tables, etc. (This turned out to be the toughest requirement, since the Markdown grammar is very irregular and very dependent on context.) TSDoc makes special accommodations for entrenched pipelines (e.g. GitHub Pages) that expect to bring their own Markdown renderer to the party.
- **Common core**: Common tags such as `@param` and `@returns` will have consistent behavior across all tools.
- **Extensible**: Each tool can supplement the core tags with custom tags for specialized scenarios.
- **Interoperable**: The TSDoc standard guarantees that unsupported custom tags won't interfere with parsing of other content. TSDoc also eliminates Markdown ambiguities. (Are backticks allowed inside a `{@link}` tag? What happens if there is only one backtick? etc.)
- **Multi-package support**: Many teams ship a collection of NPM packages that work together and are documented as a set. The cross-referencing syntax (e.g. `{@link}` or `{@inheritDoc}`) needs a portable way to reference API items imported from other packages. We also define _package.json_ metadata that enables tooling to detect whether a dependency's \*.d.ts doc comments should be parsed as TSDoc or not.
- **Open standard**: TSDoc is an open source, community-driven standard. You are encouraged to contribute your own ideas and pull requests.

The **@microsoft/tsdoc** library package brings in some additional goals:

- **"Strict" and "Lax" modes**: Many projects don’t have the time/desire to change their existing code, so they want a "_lax_" mode that makes a best attempt to render their doc comments as-is. Other projects want a "_strict_" mode that ensures consistent syntax everywhere and catches typos that might result in rendering errors. Some projects want to be "_strict_" eventually, but they can't migrate everything overnight; they need a "_transitional_" mode similar to tslint suppressions.
- **Comment-emitter for roundtripping**: The parser reads doc comments as input and produces an abstract syntax tree (AST) as output. This should be reversible: given an AST input (possibly with modifications), the library can regenerate the corresponding doc comment.
- **Self-contained**: The implementation will be small, fast, and self-contained. It will not have a dependency on the TypeScript compiler API. Doc comments will be received as a plain text string, and the AST will be a simple JavaScript tree object. This makes it easier for tools to accept **@microsoft/tsdoc** as a dependency.
