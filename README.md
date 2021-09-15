
# Boilerplate for Socialkorp websites

> Includes frontend boilerplate + backend + dashboard.

## Setup fork

Pick a project name and clone this repository:

```sh
$ git clone <this repository> my-project
```

Setup origin and upstream

```sh
$ git remote remove origin
$ git remote add upstream <this repository>
$ git remote add origin <your project repository>
```

Update project name in `package.json`.
Preserve version number as it will track this project's version number.

```diff
{
- "name": "socialkorp-boilerplate",
+ "name": "my-project",
  "version": "0.2.0",
  "private": true,
  "scripts": {
```

## Getting Started

Pull dashboard submodule + install dependencies for website, dashboard and backend:

```sh
$ npm run init
```

Set Firebase project and dashboard hosting in `website.config.yaml` @ `deploy.firebase`:

```yaml
deploy: 
  firebase:
    mainProject: example-website
    dashboardHosting: example-admin
```

Start development:

```sh
# Run website + backend
$ npm run dev
```

```sh
# or run dashboard + backend
$ npm run dashboard
```

To deploy:

```sh
# Deploy website frontend
$ npm run deploy

# Deploy website + backend + dashboard (needed only once)
$ npm run deploy-all
```

## Update boilerplate from upstream

```sh
# Stash or commit changes before continuing.

# Merge upstream changes
$ git pull upstream main

# Rerun init script
$ npm run init
```
