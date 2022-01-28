// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

// Docusaurus has a weird approach of mixing together CommonJS/Node.js and ESNext/browser
// source files under the same folder tree.  For our purposes, the plugin entry point
// index.js is the only CommonJS/Node.js module; the rest of the files are all ESNext/browser.
const path = require('path');

function theme(context) {
  return {
    name: 'theme-rushstack-suite-nav',

    getPathsToWatch() {
      console.log('getPathsToWatch =-============================');
      return [path.resolve(__dirname, '../lib/theme')];
    },

    getThemePath() {
      console.log('getThemePath =-============================');
      return path.resolve(__dirname, '../lib/theme');
    }
  };
}

module.exports = theme;
