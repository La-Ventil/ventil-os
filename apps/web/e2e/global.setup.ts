import { test as setup } from '@playwright/test';
import { execSync } from 'child_process';

setup('reset and seed database', async () => {
  console.log('resetting and seeding test database...');
  execSync('pnpm db:reset', { stdio: 'inherit' });
});
