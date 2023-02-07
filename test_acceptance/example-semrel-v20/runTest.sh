#!/bin/bash

# Install
pnpm i

# Prepare Git data
git init
git config user.email "git-noreply@saitho.me"
git config user.name "Backmerge Test"
(echo 'test' > a.txt)
git add .
git commit -m "Initial commit"
git checkout -b develop
git checkout master

# Simulate release
(echo 'test2' > a.txt)
git add .
git commit -m 'feat: Test'
./node_modules/.bin/semantic-release --dry-run

# Cleanup
rm -rf .git node_modules a.txt