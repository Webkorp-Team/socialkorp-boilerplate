const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');

const config = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(),'./src/api/website.config.json'))
);

const url = `${config.deploy.url}/api/v1/website/page`;

console.log(`Testing ${url}`);

fetch(url).then(result => {
  if(result.ok){
    console.log('Ok');
    process.exit(0);
  }else
    process.exit(1);
}).catch(()=>{
  process.exit(1);
});



