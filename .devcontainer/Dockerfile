# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.202.5/containers/javascript-node/.devcontainer/base.Dockerfile

# Node.js version (use -bullseye variants on local arm64/Apple Silicon): 16, 14, 12, 16-bullseye, 14-bullseye, 12-bullseye, 16-buster, 14-buster, 12-buster
ARG VARIANT="14-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

# Install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends netcat

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

RUN su node -c "yarn global add firebase-tools@9.20.0"
RUN su node -c "mkdir -p ~/.ssh"
RUN su node -c "mkdir -p ~/.config/configstore"
RUN su node -c "git config --global pull.rebase false"
