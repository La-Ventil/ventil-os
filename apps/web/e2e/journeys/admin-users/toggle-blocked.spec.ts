import { test, expect } from '../../fixtures/test';
import { clickQuickAction, expectQuickActionDisabled, openRowQuickActions } from '../../helpers/quick-actions';

test.describe('Admin users journeys', () => {
  test('admin can block and unblock a user from row quick actions', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    await page.goto('/hub/admin/users');

    const table = page.getByRole('table');
    await expect(table).toBeVisible();

    const row = table.getByRole('row').filter({ hasText: 'student@ventil.local' }).first();
    const statusCell = row.getByRole('cell').nth(8);

    await expect(row).toBeVisible();
    await expect(statusCell).toHaveText(/active/i);

    const menu = await openRowQuickActions(page, row, /manage/i);
    await clickQuickAction(menu, /block/i);
    await expect(statusCell).toHaveText(/blocked/i, { timeout: 10_000 });

    const menuAfterBlock = await openRowQuickActions(page, row, /manage/i);
    await clickQuickAction(menuAfterBlock, /unblock/i);
    await expect(statusCell).toHaveText(/active/i, { timeout: 10_000 });
  });

  test('admin cannot block another admin from row quick actions', async ({ page, loginAs, seedUsers }) => {
    await loginAs('globalAdmin');
    await page.goto('/hub/admin/users');

    const table = page.getByRole('table');
    await expect(table).toBeVisible();

    const row = table.getByRole('row').filter({ hasText: seedUsers.pedagogicalAdmin.email }).first();
    await expect(row).toBeVisible();

    const menu = await openRowQuickActions(page, row, /manage/i);
    await expectQuickActionDisabled(menu, /block/i);
  });

  test('admin cannot block themself from row quick actions', async ({ page, loginAs, seedUsers }) => {
    await loginAs('globalAdmin');
    await page.goto('/hub/admin/users');

    const table = page.getByRole('table');
    await expect(table).toBeVisible();

    const row = table.getByRole('row').filter({ hasText: seedUsers.globalAdmin.email }).first();
    await expect(row).toBeVisible();

    const menu = await openRowQuickActions(page, row, /manage/i);
    await expectQuickActionDisabled(menu, /block/i);
  });
});
