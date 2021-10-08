const fs = require('fs');
const TerserPlugin = require('terser-webpack-plugin');
const withPWA = require('next-pwa');

const firebaseConfig = JSON.parse(
  fs.readFileSync('./firebase.json')
);

const rewrites = (firebaseConfig.hosting.rewrites || []).filter(
  rw => rw.destination && rw.source !== '**'
).map(rw => ({
  source: rw.source.replace(/\*\*/g,':path*').replace(/(?<!:path*)\*/g,(_,idx)=>`:argAt${idx}`),
  destination: rw.destination.replace(/(?<=\/)index.html$/,''),
}));

module.exports = withPWA({
  trailingSlash: true,

  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
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

    return config;
  },
});
