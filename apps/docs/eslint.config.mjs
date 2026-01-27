import { nextJsConfig } from '@repo/eslint-config/next-js';

export default [
  {
    ignores: ['**/.next/**', 'next-env.d.ts']
  },
  ...nextJsConfig
];
