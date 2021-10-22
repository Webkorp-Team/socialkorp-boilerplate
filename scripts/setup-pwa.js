const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const root = process.cwd();
const resolve = filename => path.resolve(root,filename);
const config = require(resolve('./src/api/website.config.json'));
const favicons = require('favicons');

if(!config.pwa){
  fs.writeFileSync(
    resolve(`./src/api/pwa-meta.html.json`),
    '"<!-- -->"'
  );
  return;
}

const source = config.pwa.icon;

const checksum = crypto.createHash('sha256').update(
  fs.readFileSync(source)+JSON.stringify(config.pwa)
).digest('hex');

const checksumFile = resolve('./src/api/pwa-settings-checksum.json');

if(
  fs.existsSync(checksumFile)
  && JSON.parse(
    fs.readFileSync(checksumFile)
  ) === checksum
)
  return;

const configuration = {
  path: '/', // Path for overriding default icons path. `string`
  appName: config.pwa.name, // Your application's name. `string`
  appShortName: config.pwa.shortName, // Your application's short_name. `string`. Optional. If not set, appName will be used
  background: config.pwa.backgroundColor, // Background colour for flattened icons. `string`
  theme_color: config.pwa.themeColor, // Theme color user for example in Android's task switcher. `string`

  // appDescription: null, // Your application's description. `string`
  developerName: 'Socialkorp', // Your (or your developer's) name. `string`
  developerURL: 'https://socialkorp.com', // Your (or your developer's) URL. `string`
  dir: "auto", // Primary text direction for name, short_name, and description
  appleStatusBarStyle: "black-translucent", // Style for Apple status bar: "black-translucent", "default", "black". `string`
  display: "standalone", // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
  orientation: "portrait", // Default orientation: "any", "natural", "portrait" or "landscape". `string`
  scope: "/", // set of URLs that the browser considers within your app
  start_url: ".", // Start URL when launching the application from a device. `string`
  version: "1.0", // Your application's version string. `string`
  logging: true, // Print logs to console? `boolean`
  pixel_art: false, // Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
  loadManifestWithCredentials: false, // Browsers don't send cookies when fetching a manifest, enable this to fix that. `boolean`
  icons: {
    // Platform Options:
    // - offset - offset in percentage
    // - background:
    //   * false - use default
    //   * true - force use default, e.g. set background for Android icons
    //   * color - set background for the specified icons
    //   * mask - apply mask in order to create circle icon (applied by default for firefox). `boolean`
    //   * overlayGlow - apply glow effect after mask has been applied (applied by default for firefox). `boolean`
    //   * overlayShadow - apply drop shadow after mask has been applied .`boolean`
    //
    android: {offset:24}, // Create Android homescreen icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
    appleIcon: {offset:24}, // Create Apple touch icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
    appleStartup: {offset:14}, // Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
    coast: false,//true // Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
    favicons: true, // Create regular favicons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
    firefox: false,//{offset:24}, // Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
    windows: {offset:24}, // Create Windows 8 tile icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
    yandex: false,//true // Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
  },
};


console.log('Generating PWA assets');


favicons(source, configuration,(error,response) => {
  if (error) {
    console.log(error); // Error description e.g. "An unknown error has occurred"
    return;
  }
  for(const image of response.images)
    fs.writeFileSync(
      resolve(`./public/${image.name}`),
      image.contents
    );
  for(const file of response.files)
    fs.writeFileSync(
      resolve(`./public/${file.name}`),
      file.contents
    );
  const htmlContents = JSON.stringify(response.html.join("\n"));
  fs.writeFileSync(
    resolve(`./src/api/pwa-meta.html.json`),
    htmlContents
  );

  // todo: remove this section of code and make use of favicons API directly
  // see https://github.com/itgalaxy/favicons/pull/336
  const manifest = JSON.parse(fs.readFileSync(
    resolve(`./public/manifest.json`),
  ));
  manifest.icons = manifest.icons.map(icon => ({
    ...icon,
    purpose: 'any maskable',
  }));
  fs.writeFileSync(
    resolve(`./public/manifest.json`),
    JSON.stringify(manifest)
  );


  fs.writeFileSync(checksumFile,JSON.stringify(checksum));
});
