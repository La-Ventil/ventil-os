import { nextJsConfig } from '@repo/eslint-config/next-js';

export default [
  {
    ignores: [
      '**/.next/**',
      '**/.next-e2e-*/**',
      '**/.next-memory-profile-*/**',
      'next-env.d.ts',
      '**/playwright-report/**',
      '**/test-results/**'
    ]
  },
  ...nextJsConfig,
  {
    // Next bundles this file for the edge runtime too: no `node:process` import here, just the global.
    files: ['instrumentation.js'],
    languageOptions: { globals: { process: 'readonly' } }
  }
];
