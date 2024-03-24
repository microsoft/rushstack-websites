---
title: Invoking TypeScript Before API Extractor
---

Suppose you prefer to work in TypeScript files, and you use ts-node to run your TypeScript files. Great! Now you want to use API Extractor and API Documenter to generate documentation.

There's just one catch. API Extractor inputs are _type declaration_ files. (`*.d.ts`.) You may write some type declaration files, but the whole point of ts-node is to _not emit_ compiled files when you don't need to. Now you need to.

The overall approach is:

1. Copy a configuration file into your source directory.
2. Use TypeScript to emit declaration files into an ignored snapshot directory.
3. Copy type declaration files from your source directory into the snapshot directory.
4. Run API Extractor against the snapshot.

## Configuring TypeScript

You will need a TypeScript configuration file specifically for emitting type declaration files. Here's a quick sample:

```json
// typings-tsconfig.json
{
  "compilerOptions": {
    "lib": ["ESNext"],
    "module": "es2022",
    "target": "esnext",
    "moduleResolution": "node",

    "declaration": true,
    "emitDeclarationOnly": true,
    "outDir": "../typings-snapshot/source",
    "newLine": "lf"
  },

  "extends": "@tsconfig/node18/tsconfig.json"
}
```

Since you're using ts-node already, you certainly have one of these files already (`tsconfig.json`), but it probably isn't configured the same. The key properties for this purpose above are `declaration`, `emitDeclarationOnly`, and `outDir`. These guarantee a specific output location, for only type declaration files.

Speaking of the output directory (which is `snapshotDir` below), yes, you need one. It should be a directory your version control system ignores (using `.gitignore` or `.hgignore` files, most likely). It should also _not_ be a directory which already exists. This directory is a transient one to feed to API Extractor.

Save this configuration file in a directory you don't ignore. We're going to copy it into the source directory.

## Emitting type declaration files

As a prerequisite, you have to know where the TypeScript compiler resides on your file system. If it's a developer dependency, you'll probably find it at `node_modules/typescript/bin/tsc` from your project's root directory.

Invoking it takes a few steps:

```typescript
import fs from 'fs/promises';
import { fork } from 'child_process';
import path from 'path';
import url from 'url';

declare const projectDir: string; // your actual project root, with the node_modules directory as a child
declare const sourceDir: string; // your TypeScript sources file
declare const snapshotDir: string; // this is your temporary output directory

const tsconfigFile = path.join(url.fileURLToPath(import.meta.url), '../typings-tsconfig.json');
const tsconfigSourceFile = path.join(sourceDir, 'typings-tsconfig.json');

await fs.rm(snapshotDir, { force: true, recursive: true });
await fs.mkdir(snapshotDir);

await fs.copyFile(tsconfigFile, tsconfigSourceFile);

const pathToTSC = path.join(projectDir, `node_modules/typescript/bin/tsc`);
const parameters = ['--project', tsconfigSourceFile];

try {
  // set up a promise to resolve or reject when tsc exits
  type PromiseResolver<T> = (value: T | PromiseLike<T>) => unknown;
  type PromiseRejecter = (reason?: unknown) => unknown;

  let resolve: PromiseResolver<void>, reject: PromiseRejecter;
  const tscPromise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  // run the TypeScript compiler!
  const tsc = fork(pathToTSC, parameters, {
    silent: false,
    // this ensures you can see TypeScript error messages
    stdio: ['ignore', 'inherit', 'inherit', 'ipc']
  });
  tsc.on('exit', (code) => (code ? reject(code) : resolve()));

  await tscPromise;
} finally {
  // clean up
  await fs.rm(tsconfigSourceFile);
}
```

## Copying existing type declaration files

You're not done yet. TypeScript converted your `**.ts` files to `**.d.ts`, but it didn't migrate your _existing_ type declaration files. You need to do that yourself.

```typescript
let files = await fs.readdir(sourceDir, { encoding: 'utf-8', recursive: true });
files = files.filter((f) => f.endsWith('.d.ts'));

await Promise.all(
  files.map(async (file) => {
    await fs.mkdir(path.dirname(path.join(snapshotDir, file)), { recursive: true });
    await fs.copyFile(path.join(sourceDir, file), path.join(snapshotDir, file));
  })
);
```

## Now you can use API Extractor

Make sure your `projectFolder` in `api-extractor.jsonc` points to the snapshot directory you've just created. Then you're good to go, configuring API Extractor as you need.
