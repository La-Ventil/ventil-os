import { test as setup } from '@playwright/test';
import { resetSharedE2EDatabase } from './helpers/shared-e2e-db';

setup('reset and seed database', async () => {
  resetSharedE2EDatabase();
});
