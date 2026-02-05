/* eslint-env node */
/* global module */
module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'pnpm exec eslint --fix --config eslint.config.mjs',
    'pnpm exec prettier --write'
  ],
  '*.{css,md,json}': ['pnpm exec prettier --write']
};
