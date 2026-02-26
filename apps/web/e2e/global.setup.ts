import { test as setup } from '@playwright/test';
import { execSync } from 'child_process';
import { resolveE2EDatabaseTarget } from './helpers/e2e-db';

setup('reset and seed database', async () => {
  const target = resolveE2EDatabaseTarget();
  console.log(`resetting and seeding test database (slot=${target.slot}, schema=${target.schema})...`);
  execSync('pnpm -w db:reset', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: target.url
    }
  });
});
