
# Boilerplate for Socialkorp websites

> Includes frontend boilerplate + backend + dashboard.
> 
> Also includes a Docker based VS Code development container.

## Setup fork

Pick a project name and clone the boilerplate repository:

```sh
$ git clone <boilerplate repository> my-project
```

Setup origin and upstream

```sh
$ git remote remove origin
$ git remote add upstream <boilerplate repository>
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

Install dependencies:

```sh
$ yarn install
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
# To run website + backend
$ yarn dev
```

```sh
# To run dashboard + backend
$ yarn dashboard
```

To deploy:

```sh
# To deploy website frontend
$ yarn deploy

# To deploy website + backend + dashboard (only needed if website.config.yaml has changed)
$ yarn deploy-all
```

## Update boilerplate from upstream

```sh
# Note: stash or commit any changes before continuing.

# To merge upstream changes
$ git pull upstream main

# Rerun install script
$ yarn install
```
