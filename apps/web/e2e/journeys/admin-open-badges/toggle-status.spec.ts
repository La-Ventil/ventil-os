import { test, expect } from '../../fixtures/test';
import { clickQuickAction, openRowQuickActions } from '../../helpers/quick-actions';

test.describe('Admin open badges journeys', () => {
  test('admin can toggle an open badge status from row quick actions', async ({ page, loginAs }) => {
    const badgeName = 'organisation du Repair Café';

    await loginAs('globalAdmin');
    await page.goto('/hub/admin/open-badges');

    const table = page.getByRole('table');
    await expect(table).toBeVisible();

    const row = table.getByRole('row').filter({ hasText: badgeName }).first();
    const statusCell = row.getByRole('cell').nth(5);
    await expect(row).toBeVisible();
    await expect(statusCell).toHaveText(/yes/i);

    const menu = await openRowQuickActions(page, row, /administration/i);
    await clickQuickAction(menu, /deactivate/i);
    await expect(statusCell).toHaveText(/no/i, { timeout: 10_000 });

    await page.goto('/hub/open-badge/all');
    await expect(page.getByText(badgeName, { exact: true })).toHaveCount(0);

    await page.goto('/hub/admin/open-badges');
    const adminTableAfterDeactivate = page.getByRole('table');
    const rowAfterDeactivate = adminTableAfterDeactivate.getByRole('row').filter({ hasText: badgeName }).first();

    const menuAfterDeactivate = await openRowQuickActions(page, rowAfterDeactivate, /administration/i);
    await clickQuickAction(menuAfterDeactivate, /activate/i);
    await expect(rowAfterDeactivate.getByRole('cell').nth(5)).toHaveText(/yes/i, { timeout: 10_000 });

    await page.goto('/hub/open-badge/all');
    await expect(page.getByText(badgeName, { exact: true })).toBeVisible();
  });
});
