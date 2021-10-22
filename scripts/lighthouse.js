const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const {URL} = require('url');
const path = require('path');
const root = process.cwd();
const resolve = filename => path.resolve(root,filename);
const config = require(resolve('./src/api/website.config.json'));
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

(async() => {

const url = config.deploy.url;

console.log(`Running Lighthouse on ${url}`)

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  // defaultViewport: null,
});

const {lhr,report} = await lighthouse(url, {
  port: (new URL(browser.wsEndpoint())).port,
  output: 'html',
  logLevel: 'silent',
});

const reportPath = '/lighthouse'

fs.mkdirSync(`build${reportPath}`,{recursive:true});
fs.writeFileSync(`build${reportPath}/index.html`, report);

const deploy = !process.argv.includes('--no-deploy');

var err = null;
if(deploy)
  try {
    console.log('Deploying report...');
    await exec('yarn run deploy-only');
  } catch (e) {
    err = e;
  } 

console.log(
  `\nLighthouse scores:\n\n${Object.values(lhr.categories).map(c => (
    `\t${c.title}: ${c.score*100}`
  )).join("\n")}\n`
);

if(err)
    console.error(err);
else if(deploy)
    console.log(`Full report: ${url}${reportPath}\n`);

await browser.close();
})();
