module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'pnpm exec eslint --fix --config eslint.config.mjs --resolve-plugins-relative-to .',
    'pnpm exec prettier --write'
  ],
  '*.{css,md,json}': ['pnpm exec prettier --write']
};
