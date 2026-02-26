import { test as teardown } from '@playwright/test';
import { execSync } from 'child_process';

teardown('delete database', async () => {
  console.log('deleting test database...');
  execSync('pnpm -w db:reset', { stdio: 'inherit' });
});
