const visit = require('unist-util-visit');

/**
 * This plugin runs after the markdown file has been parsed and turned into an AST,
 * but before it is run through rehype (which turns the AST into HTML).
 *
 * The `prefixes` object passed in options provides the site prefixes to replace
 * in markdown links and the value to replace them with.
 *
 * For example, the following options config:
 *
 *   {
 *     prefixes: {
 *       '@rushjs': 'https://rushjs.io'
 *     }
 *   }
 *
 * Will turn this markdown link:
 *
 *   [Check out Rush!](@rushjs/)
 *
 * Into this:
 *
 *   [Check out Rush!](https://rushjs.io/)
 *
 * Any site prefixes discovered in markdown files that aren't included in the `prefixes`
 * object will throw an error.
 *
 * Note that links to docs in *this site* should always be relative paths within
 * the docs folder, for example:
 *
 *   [Another page](../overview/getting_started)
 *
 * Links to docs on *other sites* should use the appropriate prefix marker and
 * then the expected website URI:
 *
 *   [A page on another site](@api-extractor/pages/overview/getting_started)
 *
 * Finally, if the need arises to use Docusaurus' built-in @site prefix, you
 * should use the PRE-BUILD path of the file in the project folder:
 *
 *   [Link to raw markdown file](@site/docs/overview/getting_started.md)
 *
 */
module.exports = (options) => {
  const prefixes = options.prefixes;

  const transformer = async (ast) => {
    visit(ast, 'link', (node) => {
      if (node.url && node.url.startsWith('@')) {
        // "@site" is a Docusaurus built-in, so we won't touch it
        if (node.url.startsWith('@site')) return;

        let found = false;

        for (let prefix of Object.keys(prefixes)) {
          if (node.url.startsWith(prefix)) {
            found = true;
            node.url = prefixes[prefix] + node.url.slice(prefix.length);
            break;
          }
        }

        if (!found) {
          throw new Error(`Link with url '${node.url}' has unknown prefix (expected one of ${JSON.stringify(Object.keys(prefixes))})`);
        }
      }
    });
  };
  return transformer;
};
