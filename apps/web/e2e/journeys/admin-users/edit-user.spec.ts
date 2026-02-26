import { test, expect } from '../../fixtures/test';
import { getAdminUsersRowByEmail, openAdminUserEditPage } from '../../helpers/admin-users';

const USER_EMAIL = 'student@ventil.local';

const mutateName = (value: string, fallback: string): string => {
  const trimmed = value.trim();
  const next = `${trimmed} QA`.trim().slice(0, 40);

  if (next && next !== trimmed) {
    return next;
  }

  return fallback;
};

test.describe('Admin users journeys', () => {
  test('admin can edit a user profile from row quick actions', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');

    let originalFirstName = '';
    let originalLastName = '';
    let shouldRestore = false;

    try {
      await openAdminUserEditPage(page, USER_EMAIL);

      const firstNameInput = page.getByRole('textbox', { name: /^(prénom|first name)$/i });
      const lastNameInput = page.getByRole('textbox', { name: /^(nom|last name)$/i });

      await expect(firstNameInput).toBeVisible();
      await expect(lastNameInput).toBeVisible();

      originalFirstName = await firstNameInput.inputValue();
      originalLastName = await lastNameInput.inputValue();

      const updatedFirstName = mutateName(originalFirstName, 'StudentQA');
      const updatedLastName = mutateName(originalLastName, 'VentilQA');

      await firstNameInput.fill(updatedFirstName);
      await lastNameInput.fill(updatedLastName);
      await page.getByRole('button', { name: /modifier|update/i }).click();

      await expect(page.getByRole('alert')).toBeVisible();
      await expect(firstNameInput).toHaveValue(updatedFirstName);
      await expect(lastNameInput).toHaveValue(updatedLastName);

      shouldRestore = true;

      await page.goto('/hub/admin/users');
      const row = getAdminUsersRowByEmail(page, USER_EMAIL);
      await expect(row).toBeVisible();
      await expect(row.getByRole('cell').nth(2)).toHaveText(updatedFirstName);
      await expect(row.getByRole('cell').nth(3)).toHaveText(updatedLastName);
    } finally {
      if (!shouldRestore) {
        return;
      }

      await openAdminUserEditPage(page, USER_EMAIL);
      const firstNameInput = page.getByRole('textbox', { name: /^(prénom|first name)$/i });
      const lastNameInput = page.getByRole('textbox', { name: /^(nom|last name)$/i });

      await firstNameInput.fill(originalFirstName);
      await lastNameInput.fill(originalLastName);
      await page.getByRole('button', { name: /modifier|update/i }).click();
      await expect(page.getByRole('alert')).toBeVisible();
    }
  });
});
