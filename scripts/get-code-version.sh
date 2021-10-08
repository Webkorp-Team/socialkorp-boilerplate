#!/bin/bash

dirty=$([[ $(git status --porcelain) ]] && echo -n dirty)
dirty=$([[ $dirty ]] && echo -n -$dirty)
commit=$(git rev-list HEAD^1..HEAD)

echo -n \"$commit$dirty\"
