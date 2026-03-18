import { test, expect } from '../../fixtures/test';
import { clickQuickAction, openRowQuickActions } from '../../helpers/quick-actions';

test.describe('Admin machines journeys', () => {
  test('admin can toggle a machine status from row quick actions', async ({ page, loginAs }) => {
    const machineName = 'Bambu Lab X1C n°1';

    await loginAs('globalAdmin');
    await page.goto('/hub/admin/machines');

    const table = page.getByRole('table');
    await expect(table).toBeVisible();

    const row = table.getByRole('row').filter({ hasText: machineName }).first();
    const statusCell = row.getByRole('cell').nth(6);
    await expect(row).toBeVisible();
    await expect(statusCell).toHaveText(/yes/i);

    const menu = await openRowQuickActions(page, row, /administration/i);
    await clickQuickAction(menu, /deactivate/i);
    await expect(statusCell).toHaveText(/no/i, { timeout: 10_000 });

    await page.goto('/hub/fab-lab');
    await expect(page.getByRole('button', { name: new RegExp(machineName, 'i') })).toHaveCount(0);

    await page.goto('/hub/admin/machines');
    const refreshedTable = page.getByRole('table');
    const rowAfterDeactivate = refreshedTable.getByRole('row').filter({ hasText: machineName }).first();
    const menuAfterDeactivate = await openRowQuickActions(page, rowAfterDeactivate, /administration/i);
    await clickQuickAction(menuAfterDeactivate, /activate/i);
    await expect(rowAfterDeactivate.getByRole('cell').nth(6)).toHaveText(/yes/i, { timeout: 10_000 });

    await page.goto('/hub/fab-lab');
    await expect(page.getByRole('button', { name: new RegExp(machineName, 'i') }).first()).toBeVisible();
  });
});
