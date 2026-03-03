import { test, expect } from '../../fixtures/test';
import { openAdminUserOpenBadgesPage } from '../../helpers/admin-users';
import { openRowQuickActions } from '../../helpers/quick-actions';

const USER_EMAIL = 'admin@ventil.local';

test.describe('Admin user open badge journeys', () => {
  test('admin can open the dedicated user open badges page', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    await openAdminUserOpenBadgesPage(page, USER_EMAIL);

    await expect(page.getByRole('button', { name: /assigner un open badge|assign an open badge/i })).toBeVisible();

    const table = page.getByRole('table');
    await expect(table).toBeVisible();

    const firstDataRow = table.getByRole('row').nth(1);
    await expect(firstDataRow).toBeVisible();

    const menu = await openRowQuickActions(page, firstDataRow, /gérer|manage/i);
    await expect(menu.getByRole('menuitem', { name: /monter de niveau|upgrade/i })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: /descendre de niveau|downgrade/i })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: /supprimer|remove/i })).toBeVisible();
  });
});
