import { nextJsConfig } from '@repo/eslint-config/next-js';

export default [
  {
    ignores: [
      '**/.next/**',
      '**/.next-e2e-*/**',
      'next-env.d.ts',
      '**/playwright-report/**',
      '**/test-results/**'
    ]
  },
  ...nextJsConfig
];
