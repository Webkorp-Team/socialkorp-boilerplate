const fs = require('fs');
const fetch = require('node-fetch');

const config = JSON.parse(
  fs.readFileSync('src/api/website.config.json')
);

const path = `${config.deploy.url}/api/v1/website/page`;

console.log(`Testing ${path}`);

fetch(path).then(result => {
  if(result.ok){
    console.log('Ok');
    process.exit(0);
  }else
    process.exit(1);
}).catch(()=>{
  process.exit(1);
});



