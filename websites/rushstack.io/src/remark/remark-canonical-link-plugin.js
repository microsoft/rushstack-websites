/**
 * This plugin runs after the markdown file has been parsed and turned into an AST,
 * but before it is run through rehype (which turns the AST into HTML).
 *
 * The `prefix` string passed in options provides the canonical URL prefix.
 * Unlike the website URL configured in the Docusaurus config, this prefix doesn't
 * rely on TARGET, because even for a deployed fork we want the canonical links
 * pointing at the "real" production website.
 *
 * For example, the following options config:
 *
 *   {
 *     prefix: 'https://rushstack.io/'
 *   }
 *
 * Will add the following node to the `/docs/banana.md` page:
 *
 *   <head><link rel="canonical" href="https://rushstack.io/pages/banana" /></head>
 *
 */
module.exports = (options) => {
  const prefix = options.prefix;

  if (!prefix || !prefix.endsWith('/')) {
    throw new Error(`Invalid prefix '${prefix}' - expected a URL prefix ending with a slash (/)`);
  }

  const transformer = async (ast, file) => {
    if (file.history && file.history[0] && file.history[0].match(/docs\/(.+)\.md/)) {
      const page = RegExp.$1;
      const canonicalUrl = `${prefix}pages/${page}/`;
      ast.children.unshift({
        type: 'jsx',
        value: `<head><link rel="canonical" href="${canonicalUrl}" /></head>`
      });
    }
  };

  return transformer;
};
