const { themes } = require('prism-react-renderer');
const lightCodeTheme = themes.vsLight;
const darkCodeTheme = themes.vsDark;

function getSiteConfig() {
  // Default URLs for each site prefix
  const sitePrefixes = {
    '@api-extractor': 'https://api-extractor.com',
    '@heft': 'https://heft.rushstack.io',
    '@lfx': 'https://lfx.rushstack.io',
    '@rushjs': 'https://rushjs.io',
    '@rushstack': 'https://rushstack.io',
    '@tsdoc': 'https://tsdoc.org'
  };

  return {
    sitePrefixes,
    configOverrides: {}
  };
}

module.exports = {
  getSiteConfig,
  lightCodeTheme,
  darkCodeTheme
};
