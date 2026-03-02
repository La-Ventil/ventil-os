import { test, expect } from '../../fixtures/test';
import { clickQuickAction, openRowQuickActions } from '../../helpers/quick-actions';

test.describe('Admin open badges journeys', () => {
  test('admin can toggle an open badge status from row quick actions', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    await page.goto('/hub/admin/open-badges');

    const table = page.getByRole('table');
    await expect(table).toBeVisible();

    const row = table.getByRole('row').filter({ hasText: 'organisation du Repair Café' }).first();
    const statusCell = row.getByRole('cell').nth(5);
    await expect(row).toBeVisible();
    await expect(statusCell).toHaveText(/oui|yes/i);

    const menu = await openRowQuickActions(page, row, /administration|manage/i);
    await clickQuickAction(menu, /désactiver|deactivate/i);
    await expect(statusCell).toHaveText(/non|no/i, { timeout: 10_000 });

    const menuAfterDeactivate = await openRowQuickActions(page, row, /administration|manage/i);
    await clickQuickAction(menuAfterDeactivate, /activer|activate/i);
    await expect(statusCell).toHaveText(/oui|yes/i, { timeout: 10_000 });
  });
});
