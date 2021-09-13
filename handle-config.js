const fs = require('fs');
const YAML = require('js-yaml');

const config = YAML.load(
  fs.readFileSync('website.config.yaml')
);

fs.writeFileSync('src/api/website.config.json',
  JSON.stringify(
    config
  )
);

fs.copyFileSync('src/api/website.config.json','dashboard/website.config.json');


const firebaserc = {
  projects: {
    default: config.deploy.firebase.mainProject
  }
};
const firebasercDashboard = {
  projects: firebaserc.projects,
  targets: {
    [firebaserc.projects.default]: {
      hosting: {
        admin: [
          config.deploy.firebase.dashboardHosting
        ]
      }
    }
  }
}

fs.writeFileSync('.firebaserc',
  JSON.stringify(
    firebaserc
  )
);
fs.writeFileSync('dashboard/.firebaserc',
  JSON.stringify(
    firebasercDashboard
  )
);

