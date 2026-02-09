#!/usr/bin/env bash
set -euo pipefail

git fetch origin

git checkout main
git merge --ff-only origin/dev

pnpm release

git push origin main

git checkout dev
git merge --ff-only origin/main
git push origin dev
