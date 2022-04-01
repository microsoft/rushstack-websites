// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

const path = require('path');
const { Executable } = require('@rushstack/node-core-library');

const rushstackPath = process.argv[2];

if (!rushstackPath) {
  console.error('Syntax: rushx update-api-docs <path to local rushstack repo>');
  console.error();
  console.error('Before running this command, do a full install + build in your rushstack repo');
  console.error('to generate the api-extractor output files in common/temp/api.');
  process.exit(1);
}

const result = Executable.spawnSync(
  './node_modules/.bin/api-documenter.cmd',
  [
    'generate',
    '--input-folder',
    path.join(rushstackPath, 'common', 'temp', 'api'),
    '--output-folder',
    './docs/pages'
  ],
  { stdio: 'inherit' }
);

process.exitCode = result.status;
