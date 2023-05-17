---
title: Architecture notes
---

If you're interested in contributing, here's some general architectural notes that will hopefully help you find
your way around the code base. (By the way, if you'd like to see more detail about specific aspects or topics,
please let use know by creating a GitHib issue in the
[rushstack-websites](https://github.com/microsoft/rushstack-websites/issues) documentation monorepo.)

## Project anatomy

API Extractor's code is separated into source code folders that reflect subsystems that can be arranged
into a rough overall operational flow.

- [src/cli](https://github.com/microsoft/rushstack/tree/main/apps/api-extractor/src/cli) -
  the command-line interface (CLI) that gets things started

- [src/api](https://github.com/microsoft/rushstack/tree/main/apps/api-extractor/src/api) -
  this folder contains the public API such as `Extractor` and `ExtractorConfig`. The CLI invokes these
  APIs the same way that an external consumer would; it doesn't use any special internals. The TypeScript
  compiler gets configured in this stage, producing the `ts.Program` object that will be used below.

- [src/collector](https://github.com/microsoft/rushstack/tree/main/apps/api-extractor/src/collector) -
  The `Collector` acts as a central orchestrator that runs many of the stages below. Conceptually it is "collecting"
  all the API information in a central place, primarily `CollectorEntity` objects. This folder also has the
  `MessageRouter` class that routes errors and warnings based on the `"messages"` table from **api-extractor.json**.

- [src/analyzer](https://github.com/microsoft/rushstack/tree/main/apps/api-extractor/src/analyzer) -
  the core analyzer, which traverses the TypeScript compiler's abstract syntax tree (AST) and produces
  the higher-level representations used by API Extractor. There are 4 major pieces of tech here:

  - The `AstSymbol` and `AstDeclaration` classes, which mirror the compiler's `ts.Symbol` and `ts.Declaration`
    classes. The difference is that an `AstDeclaration` node is only generated for a subset of interesting nodes
    (e.g. classes, enums, interfaces, etc.) that will become "API items" in the documentation website and its
    `api-extractor-model` representation. This condensed tree omits all the intermediary `ts.Declaration`
    nodes (e.g. `extends` clauses, `:` tokens, and so forth). The
    [AstSymbol.ts](https://github.com/microsoft/rushstack/blob/main/apps/api-extractor/src/analyzer/AstSymbol.ts)
    code comments provide some more detail about this very important data structure.

  - The `ExportAnalyzer`, which traverses chains of TypeScript `import` statements, eliminating the
    intermediary symbol aliases to build a flattened view as seen in the .d.ts rollup. The problem is
    that the compiler's API makes it difficult to detect when this traversal leaves the working package
    (e.g. hops into the `node_modules` folder or compiler's runtime library). That's why this file has special
    handling for each kind of import syntax. The `export * from` construct is by far the most complicated form.

  - The `Span` class, which is a fairly lame but fairly effective utility for rewriting TypeScript source code
    while ignoring most of its meaning except for specific node types that we recognize. API Extractor does not
    use the compiler's emitter to write .d.ts files, partially because those API were not public when we
    started, but also because it more faithfully preserves the original .d.ts inputs. The
    [DtsRollupGenerator.\_modifySpan()](https://github.com/microsoft/rushstack/blob/716b063f20fd3df82cf8436eeb2528789b0b7c37/apps/api-extractor/src/generators/DtsRollupGenerator.ts#L154)
    function is a good illustration of how `Span` is used.

  - The `AstReferenceResolver`: Given a TSDoc declaration reference, this walks the the `AstSymbolTable` to
    find whatever it refers to.

- [src/enhancers](https://github.com/microsoft/rushstack/tree/main/apps/api-extractor/src/enhancers) -
  After the `Collector` has collected all the API objects and their metadata, we run a series of additional
  postprocessing stages called `enhancers`. The current ones are `ValidationEnhancer` (which applies some
  API validation rules) and `DocCommentEnhancer` which tunes up the TSDoc comments, for example expanding
  the `@inheritDoc` references.

- [src/generators](https://github.com/microsoft/rushstack/tree/main/apps/api-extractor/src/generators) -
  This folder implements API Extractor's famous 3 output types: `ApiReportGenerator`, `DtsRollupGenerator`,
  and `ApiModelGenerator`.

- [src/schemas](https://github.com/microsoft/rushstack/tree/main/apps/api-extractor/src/schemas) -
  This folder contains the `api-extractor init` template file, the JSON schema for **api-extractor.json**,
  and **api-extractor-defaults.json** which represents the default values for **api-extractor.json** settings.

## Data flow

Another useful way to understand API Extractor is by examining what happens to a declaration as it
gets transformed by each stage. Consider a simple `function` declaration that has two overloads:

```ts
import { Report } from 'reporting-package';

/** Declaration 1 */
export declare function add(report: Report, amount: number): void;

/** Declaration 2 */
export declare function add(report: Report, title: string): void;
```

Here's how it gets processed:

- **Compiler stage:** The TypeScript compiler engine parses the .d.ts file into two `ts.Declaration` objects
  (one for each overload) representing the parsed syntax. The compiler's analyzer then makes an associated
  `ts.Symbol` which represents the function's type. Each TypeScript type always becomes exactly one symbol,
  and in this case with two associated declarations (the two overloads). There will also be many
  "aliases" for this symbol. For example, if we write `import { add } from "./math"`, the word `add` here becomes
  a symbol alias whose declaration is that `import` statement. If we follow the chain of symbol aliases (perhaps
  through many imports and exports), we will always reach the unique "followed symbol" corresponding to the original
  real definition of `add()`.

- **Analyzer stage:** API Extractor starts from your API entry point and follows each export to find its
  "followed symbol". Then we make an `AstSymbol` and two `AstDeclaration`'s for `add()`. The analyzer also walks up
  and down the AST tree to fill out the context. For example, if the `AstSymbol` is a `class`, then we'll create
  a child `AstSymbol` for each of its members. And if the class belongs to a `namespace`, then a parent `AstSymbol`
  is added representing the namespace.

  While following `import` statements, if we reach an external NPM package, the analysis stops there and
  produces an `AstImport` instead of a regular `AstSymbol`. This is because API Extractor understands
  package boundaries, and in fact is designed to be invoked separately on each project. Thus, in the above example,
  `Report` would become an `AstImport` instead of an `AstSymbol`. The analyzer's overall job is to pick through
  the extremely detailed compiler data structures and produce a simplified tree of `AstSymbol` objects. This
  algorithm is the most complex stage of API Extractor, so we try to keep it isolated and single-purpose.

- **Collector stage:** The collector builds the inventory of things that will end up as top-level items
  in the .d.ts rollup. We call these `CollectorEntity` objects, and there is one for our `add()` function,
  and another one for the `Report` import. So `AstSymbol` and `AstImport` can become a `CollectorEntity`.
  But note that `AstDeclaration` cannot, nor can `AstModule` (the analyzer's representation of a .d.ts source file).
  To keep this straight, the analyzer's objects inherit from the `AstEntity` base class if-and-only-if they
  can become a `CollectorEntity`. The `CollectorEntity` wraps `AstEntity` and appends some additional
  collector stage information:

  - Whether the entity is an `export` of your .d.ts rollup or just a local declaration.
  - The local name in the .d.ts rollup, since local declarations may need to get renamed
    by `DtsRollupGenerator._makeUniqueNames()` to avoid naming conflicts
  - The export name(s) which can be different from the local name. For example:
    `export { A as B, A as C }`.

- **Enhancers stage:** The enhancers mostly work with the `DeclarationMetadata`, `ApiItemMetadata`, and `SymbolMetadata`
  objects. These objects are stored on `AstSymbol` and `AstDeclaration`, but they are entirely owned by the collector
  stage.

- **ApiReportGenerator and DtsRollupGenerator:** These generators essentially just dump the `CollectorEntity`
  items into a big text file, but with different formatting. Other than trimming items according to release type,
  they don't do much processing.

- **api-extractor-model stage:** The **@microsoft/api-extractor-model** package is completely independent and does not
  rely on any of the other API Extractor types described above. It defines the portable .api.json file format.
  It has its own rich hierarchy inheriting from the `ApiItem` base class (mixin inheritance actually): `ApiClass`,
  `ApiNamespace`, `ApiParameter`, etc. In our example, the `add()` function will become an `ApiFunction` item
  in this representation. This model is designed to make it easy for third parties to generate documentation without
  having to understand the thorny compiler data structures. Thus the `ApiModelGenerator` takes our `CollectorEntity`
  for `add()` and converts it into an `ApiFunction` that will get serialized into .api.json.

  Recall that the analyzer internally used the `AstReferenceResolver` helper to look up TSDoc declaration references
  and find the target `AstDeclaration`. For the .api.json files, **@microsoft/api-extractor-model** provides
  an analogous `ModelReferenceResolver` helper that looks up `ApiItem` targets.

- **API Documenter stage:** Okay, one final transformation happens here. It's the last one! :-) When API Documenter
  loads up the .api.json file, it does not render it directly to .md files. First it converts the `ApiFunction`
  for our `add()` example function into a tree of TSDoc `DocNode` elements. Normally `DocNode` is used to represent
  doc comments. But it happens to be a full DOM-like structure that can represent rich text. Since the TSDoc comment
  for `add()` is already this kind of rich text, API Documenter cleverly reuses this representation to model an
  entire web page. This intermediate representation enables the markdown emitter to be decoupled from the documentation
  engine, and makes it easy in the future to output other formats such as HTML or React.

To summarize, for the humble `add()` function this pipeline produced a number of different representations:

- `AstDeclaration` for the overload declarations
- `AstSymbol` for the TypeScript type
- `CollectorEntity` for the entry in the .d.ts file
- `DeclarationMetadata`, `ApiItemMetadata`, and `SymbolMetadata` to annotate the symbol and declaration with more info
- `ApiFunction` for the .api.json file
- `DocNode` subtree for the documentation website
