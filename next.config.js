const path = require('path');

module.exports = {
  future: {
    webpack5: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {

    // To test "npm link"ed packages with peer dependencies
    // config.resolve.alias['styled-components'] = path.resolve('./node_modules/styled-components');
    // config.resolve.alias['react'] = path.resolve('./node_modules/react');

    return config;
  },
}
