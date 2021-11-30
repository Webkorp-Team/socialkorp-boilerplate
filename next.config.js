const fs = require('fs');
const TerserPlugin = require('terser-webpack-plugin');
const withPWA = require('next-pwa');
const path = require('path');
const root = process.cwd();
const resolve = filename => path.resolve(root,filename);
const config = require(resolve('./src/api/website.config.json'));
const firebaseConfig = require(resolve('./firebase.json'));
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const rewrites = (firebaseConfig.hosting.rewrites || []).filter(
  rw => rw.destination && rw.source !== '**'
).map(rw => ({
  source: rw.source.replace(/\*\*/g,':path*').replace(/(?<!:path*)\*/g,(_,idx)=>`:argAt${idx}`),
  destination: rw.destination.replace(/(?<=\/)index.html$/,''),
}));

module.exports =
  withBundleAnalyzer(
  withPWA(
  {
    trailingSlash: true,

    pwa: {
      dest: 'public',
      disable: !config.pwa || process.env.NODE_ENV === 'development',
    },

    rewrites: async()=>rewrites,

    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {

      config.optimization.minimizer = [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: { evaluate: false }
          },
        }),
      ];

      // config.resolve.alias = {
      //   "react": "preact/compat",
      //   "react-dom/test-utils": "preact/test-utils",
      //   "react-dom": "preact/compat",     // Must be below test-utils
      //   "react/jsx-runtime": "preact/jsx-runtime"
      // }

      return config;
    },
  }
));
