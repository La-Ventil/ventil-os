#!/usr/bin/env bash
set -euo pipefail

readonly ORIGINAL_BRANCH="$(git branch --show-current)"

cleanup() {
  local exit_code=$?

  if [[ $exit_code -ne 0 ]]; then
    git switch "$ORIGINAL_BRANCH" >/dev/null 2>&1 || true
    echo "Release failed. Restored branch $ORIGINAL_BRANCH." >&2
  fi
}

require_clean_worktree() {
  if [[ -n "$(git status --porcelain)" ]]; then
    echo "Release aborted: working tree is not clean." >&2
    exit 1
  fi
}

require_branch() {
  local branch_name=$1

  if ! git rev-parse --verify "$branch_name" >/dev/null 2>&1; then
    echo "Release aborted: local branch $branch_name does not exist." >&2
    exit 1
  fi
}

require_fast_forward() {
  local base_ref=$1
  local head_ref=$2
  local merge_label=$3

  if git merge-base --is-ancestor "$base_ref" "$head_ref"; then
    return
  fi

  local behind ahead
  read -r behind ahead < <(git rev-list --left-right --count "$base_ref...$head_ref")

  echo "Release aborted: cannot fast-forward $merge_label." >&2
  echo "Expected $base_ref to be an ancestor of $head_ref." >&2
  echo "Divergence: $base_ref is ahead by $behind commit(s), $head_ref is ahead by $ahead commit(s)." >&2
  echo "Rebase or merge the branches explicitly before running release." >&2
  exit 1
}

trap cleanup EXIT

require_clean_worktree
require_branch dev
require_branch main

git fetch --tags origin
git fetch origin dev main

git push origin dev main
git fetch origin dev main

require_fast_forward origin/main origin/dev "main from origin/dev"

git switch main
git merge --ff-only origin/dev

pnpm release

git push origin main --follow-tags

git switch dev
git merge --ff-only origin/main
git push origin dev

trap - EXIT
