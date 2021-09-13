const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  trailingSlash: true,

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {

    config.optimization.minimizer = [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: { evaluate: false }
        },
      }),
    ];

    return config;
  },
}
