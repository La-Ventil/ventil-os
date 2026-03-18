import { test, expect } from '../../fixtures/test';
import { openAdminUserOpenBadgesPage } from '../../helpers/admin-users';
import { openRowQuickActions } from '../../helpers/quick-actions';

const USER_EMAIL = 'admin@ventil.local';

test.describe('Admin user open badge journeys', () => {
  test('admin can open the dedicated user open badges page', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    await openAdminUserOpenBadgesPage(page, USER_EMAIL);

    await expect(page.getByRole('button', { name: /assign an open badge/i })).toBeVisible();

    const table = page.getByRole('table');
    await expect(table).toBeVisible();

    const firstDataRow = table.getByRole('row').nth(1);
    await expect(firstDataRow).toBeVisible();

    const menu = await openRowQuickActions(page, firstDataRow, /manage/i);
    await expect(menu.getByRole('menuitem', { name: /upgrade/i })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: /downgrade/i })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: /remove/i })).toBeVisible();
  });
});
