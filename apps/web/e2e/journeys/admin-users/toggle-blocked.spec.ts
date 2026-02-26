import { test, expect } from '../../fixtures/test';
import { clickQuickAction, openRowQuickActions } from '../../helpers/quick-actions';

test.describe('Admin users journeys', () => {
  test('admin can block and unblock a user from row quick actions', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    await page.goto('/hub/admin/users');

    const table = page.getByRole('table');
    await expect(table).toBeVisible();

    const row = table.getByRole('row').filter({ hasText: 'student@ventil.local' }).first();
    const statusCell = row.getByRole('cell').nth(8);

    await expect(row).toBeVisible();
    await expect(statusCell).toHaveText(/actif|active/i);

    const menu = await openRowQuickActions(page, row, /gérer|manage/i);
    await clickQuickAction(menu, /bloquer|block/i);
    await expect(statusCell).toHaveText(/bloqué|blocked/i, { timeout: 10_000 });

    const menuAfterBlock = await openRowQuickActions(page, row, /gérer|manage/i);
    await clickQuickAction(menuAfterBlock, /débloquer|unblock/i);
    await expect(statusCell).toHaveText(/actif|active/i, { timeout: 10_000 });
  });
});
