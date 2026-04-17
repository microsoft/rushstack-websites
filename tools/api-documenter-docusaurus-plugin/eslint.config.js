// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

const { defineConfig } = require('eslint/config');
const nodeProfile = require('@rushstack/eslint-config/flat/profile/node');

module.exports = defineConfig([
  ...nodeProfile,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname
      }
    }
  }
]);
