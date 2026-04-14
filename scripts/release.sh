#!/usr/bin/env bash
set -euo pipefail

readonly ORIGINAL_BRANCH="$(git branch --show-current)"
readonly RELEASE_SOURCE_BRANCH="dev"
readonly RELEASE_TARGET_BRANCH="main"

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

require_current_branch() {
  local branch_name=$1

  if [[ "$(git branch --show-current)" != "$branch_name" ]]; then
    echo "Release aborted: current branch must be $branch_name." >&2
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
require_branch "$RELEASE_SOURCE_BRANCH"
require_branch "$RELEASE_TARGET_BRANCH"
require_current_branch "$RELEASE_SOURCE_BRANCH"

git fetch --tags origin
git fetch origin "$RELEASE_SOURCE_BRANCH" "$RELEASE_TARGET_BRANCH"

require_fast_forward "origin/$RELEASE_TARGET_BRANCH" "$RELEASE_SOURCE_BRANCH" "$RELEASE_TARGET_BRANCH from $RELEASE_SOURCE_BRANCH"

pnpm test

git push origin "$RELEASE_SOURCE_BRANCH"
git fetch origin "$RELEASE_SOURCE_BRANCH" "$RELEASE_TARGET_BRANCH"

require_fast_forward "origin/$RELEASE_TARGET_BRANCH" "$RELEASE_SOURCE_BRANCH" "$RELEASE_TARGET_BRANCH from $RELEASE_SOURCE_BRANCH"

git switch "$RELEASE_TARGET_BRANCH"
git merge --ff-only "$RELEASE_SOURCE_BRANCH"

pnpm i18n:report
git add docs/contributor/i18n/translation-coverage.md

pnpm build

pnpm release -- --commit-all

git push origin "$RELEASE_TARGET_BRANCH" --follow-tags

git switch "$RELEASE_SOURCE_BRANCH"
git merge --ff-only "$RELEASE_TARGET_BRANCH"
git push origin "$RELEASE_SOURCE_BRANCH"

trap - EXIT
