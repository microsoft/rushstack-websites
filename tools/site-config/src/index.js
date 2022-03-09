const { spawnSync } = require('child_process');

function getGitHubOrg() {
  const gitResult = spawnSync('git', ['remote', '-v'], { encoding: 'utf8', shell: true });
  const lines = gitResult.stdout.split(/\r?\n/);
  const origins = lines.filter((line) => line.startsWith('origin'));

  if (origins.length < 1) {
    throw new Error('Cannot determine fork: no origin entries returned by git remote -v.');
  }

  const match = origins[0].match(/[:/](.+?)\/rushstack-websites(.git)?/);

  if (match && match[1]) {
    return match[1];
  } else {
    throw new Error(`Cannot determine fork: unrecognized origin line: ${origins[0]}`);
  }
}

function getTargetOrg() {
  const target = process.env.TARGET;

  if (target && target.length > 0) {
    if (target === 'local') {
      console.log(`Using TARGET=local.`);
      return { target: 'local' };
    } else if (target === 'fork') {
      const org = getGitHubOrg();
      console.log(`Using TARGET=fork (${org}/rushstack-websites).`);
      return { target: 'fork', org };
    } else if (target === 'prod') {
      console.log(`Using TARGET=prod.`);
      return { target: 'prod' };
    } else {
      throw new Error(`You specified TARGET=${target}, valid values are: local, fork, prod.`);
    }
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `Detected local dev server, defaulting to TARGET=local.\n` +
          `(You can override this by specifying TARGET=[local, fork, prod])`
      );
      return { target: 'local' };
    } else {
      const org = getGitHubOrg();
      if (org === 'microsoft') {
        console.log(
          `Detected prod build on main repo, defaulting to TARGET=prod.\n` +
            `(You can override this by specifying TARGET=[local, fork, prod])`
        );
        return { target: 'prod' };
      } else {
        console.log(
          `Detected prod build on fork, defaulting to TARGET=fork.\n` +
            `(You can override this by specifying TARGET=[local, fork, prod])`
        );
        return { target: 'fork', org };
      }
    }
  }
}

function getSiteConfig(packageName) {
  const target = getTargetOrg();

  // Default URLs for each site prefix
  const sitePrefixes = {
    '@api-extractor': 'https://api-extractor.com',
    '@rushjs': 'https://rushjs.io',
    '@rushstack': 'https://rushstack.io',
    '@tsdoc': 'https://tsdoc.org'
  };

  // When deploying a fork, the supported websites can link between each other
  const forkedSitePrefixes = {
    '@api-extractor': 'https://api-extractor.com',
    '@rushjs': '/rushstack-websites/rushjs.io',
    '@rushstack': '/rushstack-websites/rushstack.io',
    '@tsdoc': 'https://tsdoc.org'
  };

  switch (target.target) {
    case 'local':
      return {
        ...target,
        sitePrefixes,
        configOverrides: {}
      };
    case 'fork':
      return {
        ...target,
        sitePrefixes: forkedSitePrefixes,
        configOverrides: {
          baseUrl: `/rushstack-websites/${packageName}/`,
          organizationName: target.org
        }
      };
    case 'prod':
      return {
        ...target,
        sitePrefixes,
        configOverrides: {}
      };
  }
}

module.exports = {
  getSiteConfig
};
