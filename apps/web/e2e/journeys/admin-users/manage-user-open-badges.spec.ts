import { test, expect } from '../../fixtures/test';
import { openAdminUserOpenBadgesPage } from '../../helpers/admin-users';
import { closeDialogWithEscape } from '../../helpers/dialogs';
import { openRowQuickActions } from '../../helpers/quick-actions';

const USER_EMAIL = 'admin@ventil.local';

test.describe('Admin user open badge journeys', () => {
  test('admin can open the dedicated user open badges page', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    await openAdminUserOpenBadgesPage(page, USER_EMAIL);

    await expect(page.getByRole('link', { name: /assign an open badge/i })).toBeVisible();

    const table = page.getByRole('table');
    await expect(table).toBeVisible();

    const firstDataRow = table.getByRole('row').nth(1);
    await expect(firstDataRow).toBeVisible();

    const menu = await openRowQuickActions(page, firstDataRow, /manage/i);
    await expect(menu.getByRole('menuitem', { name: /upgrade/i })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: /downgrade/i })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: /remove/i })).toBeVisible();
  });

  test('admin can open, close, and reopen the user badge assign modal', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    await openAdminUserOpenBadgesPage(page, USER_EMAIL);

    await page.getByRole('link', { name: /assign an open badge/i }).click();
    await expect(page.getByRole('dialog', { name: /assign an open badge/i })).toBeVisible();

    await closeDialogWithEscape(page, /assign an open badge/i);
    await expect(page).toHaveURL(/\/hub\/admin\/users\/[^/]+\/open-badges$/);

    await page.getByRole('link', { name: /assign an open badge/i }).click();
    await expect(page.getByRole('dialog', { name: /assign an open badge/i })).toBeVisible();
  });
});
