#!/usr/bin/env bash
set -euo pipefail

git fetch --tags origin

git push origin dev main

git checkout main
git merge --ff-only origin/dev

pnpm release

git push origin main --follow-tags

git checkout dev
git merge --ff-only origin/main
git push origin dev
