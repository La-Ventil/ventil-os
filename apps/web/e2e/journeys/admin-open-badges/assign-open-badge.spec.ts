import { test, expect } from '../../fixtures/test';
import { openAdminOpenBadgeAssignModal } from '../../helpers/open-badges';

test.describe('Admin open badges journeys', () => {
  test('admin can assign an open badge from the assign modal', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    await openAdminOpenBadgeAssignModal(page);

    const dialog = page.getByRole('dialog', { name: /attribution d.?un open badge|assign an open badge/i });
    await expect(dialog).toBeVisible();

    await expect(dialog.getByRole('combobox', { name: /niveau|level/i })).toBeVisible();
    await expect(dialog.getByRole('combobox', { name: /utilisateur|user/i })).toBeVisible();
    await expect(dialog.getByRole('button', { name: /attribuer|assign/i })).toBeDisabled();

    const userField = dialog.getByRole('combobox', { name: /utilisateur|user/i });
    await userField.click();
    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible();
    await listbox.getByRole('option').first().click();

    await dialog.getByRole('button', { name: /attribuer|assign/i }).click();

    await expect(dialog.getByRole('alert')).toHaveText(/open badge attribué|open badge assigned/i, {
      timeout: 10_000
    });
    await expect(page).toHaveURL(/\/hub\/admin\/open-badges$/, { timeout: 10_000 });
  });

  test('non-admin users cannot open assign modal directly', async ({ page, loginAs }) => {
    await loginAs('student');
    await page.goto('/hub/admin/open-badges/@modal/does-not-exist');
    await expect(page).toHaveURL('/hub/profile');
  });
});
