import { test, expect } from '../../fixtures/test';
import { openAutocompleteOptions, selectFirstAutocompleteOption } from '../../helpers/autocomplete';
import { openAdminOpenBadgeAssignModal } from '../../helpers/open-badges';
import { clickQuickAction, openRowQuickActions } from '../../helpers/quick-actions';

test.describe('Admin open badges journeys', () => {
  test('admin can assign an open badge from the assign modal', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    await openAdminOpenBadgeAssignModal(page);

    const dialog = page.getByRole('dialog', { name: /assign an open badge/i });
    await expect(dialog).toBeVisible();

    await expect(dialog.getByRole('combobox', { name: /level/i })).toBeVisible();
    await expect(dialog.getByRole('combobox', { name: /user/i })).toBeVisible();
    await expect(dialog.getByRole('button', { name: /assign/i })).toBeDisabled();

    const userField = dialog.getByRole('combobox', { name: /user/i });
    await selectFirstAutocompleteOption({ page, field: userField });

    await dialog.getByRole('button', { name: /assign/i }).click();

    await expect(dialog.getByRole('alert')).toHaveText(/open badge assigned/i, {
      timeout: 10_000
    });
    await expect(page).toHaveURL(/\/hub\/admin\/open-badges$/, { timeout: 10_000 });
  });

  test('assign modal starts with no selected user and filters users by selected level', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    await openAdminOpenBadgeAssignModal(page, /Impression 3D Bambu Lab/i);

    const dialog = page.getByRole('dialog', { name: /assign an open badge/i });
    const assignButton = dialog.getByRole('button', { name: /assign/i });
    const userField = dialog.getByRole('combobox', { name: /user/i });

    await expect(assignButton).toBeDisabled();
    await expect(userField).toHaveValue('');

    await dialog.getByRole('combobox', { name: /level/i }).click();
    await page.getByRole('option', { name: /^2\s*-/i }).click();

    const listbox = await openAutocompleteOptions(page, userField);
    await expect(listbox.getByRole('option', { name: /Admin Global/i })).toBeVisible();
    await expect(listbox.getByRole('option', { name: /Admin Pédagogique/i })).toBeVisible();
    await expect(listbox.getByRole('option', { name: /Claude Dupont/i })).toHaveCount(0);
  });

  test('blocked users are excluded from assignable users', async ({ page, loginAs, seedUsers }) => {
    await loginAs('globalAdmin');
    await page.goto('/hub/admin/users');

    const usersTable = page.getByRole('table');
    const studentRow = usersTable.getByRole('row').filter({ hasText: seedUsers.student.email }).first();
    await expect(studentRow).toBeVisible();

    const blockMenu = await openRowQuickActions(page, studentRow, /manage/i);
    await clickQuickAction(blockMenu, /block/i);
    await expect(studentRow.getByRole('cell').nth(8)).toHaveText(/blocked/i, { timeout: 10_000 });

    await openAdminOpenBadgeAssignModal(page, /Impression 3D Bambu Lab/i);

    const dialog = page.getByRole('dialog', { name: /assign an open badge/i });
    const userField = dialog.getByRole('combobox', { name: /user/i });
    const listbox = await openAutocompleteOptions(page, userField);
    await expect(listbox.getByRole('option', { name: /Claude Dupont/i })).toHaveCount(0);

    await page.goto('/hub/admin/users');
    const refreshedTable = page.getByRole('table');
    const blockedRow = refreshedTable.getByRole('row').filter({ hasText: seedUsers.student.email }).first();
    const unblockMenu = await openRowQuickActions(page, blockedRow, /manage/i);
    await clickQuickAction(unblockMenu, /unblock/i);
    await expect(blockedRow.getByRole('cell').nth(8)).toHaveText(/active/i, { timeout: 10_000 });
  });

  test('non-admin users cannot open assign modal directly', async ({ page, loginAs }) => {
    await loginAs('student');
    await page.goto('/hub/admin/open-badges/@modal/does-not-exist');
    await expect(page).toHaveURL('/hub/profile');
  });
});
