---
title: Overview
hide_title: true
---

<img src="/images/site/monodex-logo.svg" alt="Rush Monodex" title="Rush Monodex"
style={{ height: '130px', paddingBottom: '1rem' }}/>

**Semantic search indexer for Rush monorepos using Qdrant vector database**

## Overview

`monodex` is a CLI tool that indexes Rush monorepo source code and documentation into a Qdrant vector database for scalable semantic search.

### Features

- **AST-based chunking**: Tree-sitter powered intelligent splitting for TypeScript/TSX files
- **Breadcrumb context**: Full symbol paths like `@rushstack/node-core-library:JsonFile.ts:JsonFile.load`
- **Oversized chunk handling**: Functions split at natural AST boundaries (statement blocks, if/else, try/catch)
- **Local embeddings**: Uses jina-embeddings-v2-base-code with ONNX Runtime (no external APIs)
- **Qdrant integration**: Direct batch uploads to Qdrant vector database
- **Incremental sync**: Content-hash based change detection for fast re-indexing
- **Rush-optimized**: Smart exclusion rules for Rush monorepo patterns
