import { test as teardown } from '@playwright/test';
import { cleanupSharedE2EDatabase } from './helpers/shared-e2e-db';

teardown('delete database', async () => {
  cleanupSharedE2EDatabase();
});
