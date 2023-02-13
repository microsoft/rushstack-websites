'use strict';

/**
 * When using the PNPM package manager, you can use pnpmfile.js to workaround
 * dependencies that have mistakes in their package.json file.  (This feature is
 * functionally similar to Yarn's "resolutions".)
 *
 * For details, see the PNPM documentation:
 * https://pnpm.js.org/docs/en/hooks.html
 *
 * IMPORTANT: SINCE THIS FILE CONTAINS EXECUTABLE CODE, MODIFYING IT IS LIKELY TO INVALIDATE
 * ANY CACHED DEPENDENCY ANALYSIS.  After any modification to pnpmfile.js, it's recommended to run
 * "rush update --full" so that PNPM will recalculate all version selections.
 */
module.exports = {
  hooks: {
    readPackage
  }
};

/**
 * This hook is invoked during installation before a package's dependencies
 * are selected.
 * The `packageJson` parameter is the deserialized package.json
 * contents for the package that is about to be installed.
 * The `context` parameter provides a log() function.
 * The return value is the updated object.
 */
function readPackage(packageJson, context) {
  // // The karma types have a missing dependency on typings from the log4js package.
  // if (packageJson.name === '@types/karma') {
  //  context.log('Fixed up dependencies for @types/karma');
  //  packageJson.dependencies['log4js'] = '0.6.38';
  // }

  if (packageJson.dependencies) {
    // The docusaurus-theme-search-typesense project does not keep up with latest Docusaurus releases.
    if (packageJson.name === 'docusaurus-theme-search-typesense') {
      const docusaurusPackageNames = [
        '@docusaurus/core',
        '@docusaurus/logger',
        '@docusaurus/plugin-content-docs',
        '@docusaurus/theme-common',
        '@docusaurus/theme-translations',
        '@docusaurus/utils',
        '@docusaurus/utils-validation'
      ];
      for (const docusaurusPackageName of docusaurusPackageNames) {
        if (packageJson.dependencies[docusaurusPackageName]) {
          packageJson.dependencies[docusaurusPackageName] = '2.3.1';
        }
        if (packageJson.peerDependencies[docusaurusPackageName]) {
          packageJson.peerDependencies[docusaurusPackageName] = '2.3.1';
        }
      }
    }

    // This is a workaround for what a possible PNPM bug?  Because "@docusaurus/types" is an optional
    // peer dependency, we end up with side-by-side installs of "@docusaurus/theme-common" etc whose
    // only difference is whether "@docusaurus/types" was included.
    if (packageJson.name.startsWith('@docusaurus/')) {
      packageJson.dependencies['@docusaurus/types'] = '2.3.1';
    }

    if (packageJson.dependencies['trim'] == '0.0.1') {
      // remark-parse@8.0.3 still depends on "trim" with the CVE-2020-7753 vulnerability
      // https://github.com/facebook/docusaurus/issues/7275
      packageJson.dependencies['trim'] = '^1.0.0';
    }
  }

  return packageJson;
}
