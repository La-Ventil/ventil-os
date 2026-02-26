import { test as teardown } from '@playwright/test';
import { execSync } from 'child_process';
import { resolveE2EDatabaseTarget } from './helpers/e2e-db';

teardown('delete database', async () => {
  const target = resolveE2EDatabaseTarget();
  console.log(`deleting test database (slot=${target.slot}, schema=${target.schema})...`);
  execSync('pnpm -w db:reset', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: target.url
    }
  });
});
