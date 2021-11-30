#!/bin/bash

dirty=$([[ $(git status --porcelain) ]] && echo -n dirty)
dirty=$([[ $dirty ]] && echo -n -$dirty-$(git diff | sha256sum | grep -Eo '^.{8}'))
commit=$(git rev-list HEAD^1..HEAD | grep -Eo '^.{8}')

echo -n \"$commit$dirty\"
