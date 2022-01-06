const { getSiteConfig } = require('site-config');
const siteConfig = getSiteConfig(require('./package.json').name);

if (siteConfig.target !== 'fork') {
  throw new Error('The deploy-fork command should not be used unless TARGET=fork');
}

const config = {
  // These configuration values are not used during deployment and exist only
  // to keep Docusaurus happy.
  title: 'Rush Stack',
  url: `https://${siteConfig.org}.github.io/`,
  baseUrl: 'rushstack-websites/',
  trailingSlash: true,

  // Deployment settings
  projectName: 'rushstack-websites',
  ...siteConfig.configOverrides
};

module.exports = config;
