import { test, expect } from '../../fixtures/test';
import { openAdminUserEditPage } from '../../helpers/admin-users';

const USER_EMAIL = 'student@ventil.local';
const ORIGINAL_PROFILE = 'member';
const UPDATED_PROFILE = 'contributor';
const ORIGINAL_EDUCATION_LEVEL_LABEL = /bts/i;

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
    let updatedFirstName = '';
    let updatedLastName = '';
    let shouldRestore = false;

    try {
      await openAdminUserEditPage(page, USER_EMAIL);

      const firstNameInput = page.getByRole('textbox', { name: /^(prénom|first name)$/i });
      const lastNameInput = page.getByRole('textbox', { name: /^(nom|last name)$/i });
      const currentProfileInput = page.locator(`input[name="profile"][value="${ORIGINAL_PROFILE}"]`);
      const updatedProfileInput = page.locator(`input[name="profile"][value="${UPDATED_PROFILE}"]`);
      const educationLevelInput = page.getByRole('combobox', { name: /niveau scolaire|education level/i });

      await expect(firstNameInput).toBeVisible();
      await expect(lastNameInput).toBeVisible();
      await expect(currentProfileInput).toBeChecked();
      await expect(educationLevelInput).toBeVisible();

      originalFirstName = await firstNameInput.inputValue();
      originalLastName = await lastNameInput.inputValue();

      updatedFirstName = mutateName(originalFirstName, 'StudentQA');
      updatedLastName = mutateName(originalLastName, 'VentilQA');

      await firstNameInput.fill(updatedFirstName);
      await lastNameInput.fill(updatedLastName);
      await updatedProfileInput.check();
      await page.getByRole('button', { name: /modifier|update/i }).click();

      await expect(page).toHaveURL(/\/hub\/admin\/users\/?$/);

      shouldRestore = true;

      await openAdminUserEditPage(page, USER_EMAIL);
      const reopenedFirstNameInput = page.getByRole('textbox', { name: /^(prénom|first name)$/i });
      const reopenedLastNameInput = page.getByRole('textbox', { name: /^(nom|last name)$/i });

      await expect(reopenedFirstNameInput).toHaveValue(updatedFirstName);
      await expect(reopenedLastNameInput).toHaveValue(updatedLastName);
      await expect(page.locator(`input[name="profile"][value="${UPDATED_PROFILE}"]`)).toBeChecked();
      await expect(page.getByRole('combobox', { name: /niveau scolaire|education level/i })).toHaveCount(0);
    } finally {
      if (!shouldRestore) {
        return;
      }

      await openAdminUserEditPage(page, USER_EMAIL);
      const firstNameInput = page.getByRole('textbox', { name: /^(prénom|first name)$/i });
      const lastNameInput = page.getByRole('textbox', { name: /^(nom|last name)$/i });
      const originalProfileInput = page.locator(`input[name="profile"][value="${ORIGINAL_PROFILE}"]`);
      const educationLevelInput = page.getByRole('combobox', { name: /niveau scolaire|education level/i });

      await firstNameInput.fill(originalFirstName);
      await lastNameInput.fill(originalLastName);
      await originalProfileInput.check();
      await educationLevelInput.click();
      await page.getByRole('option', { name: ORIGINAL_EDUCATION_LEVEL_LABEL }).click();
      await page.getByRole('button', { name: /modifier|update/i }).click();
      await expect(page).toHaveURL(/\/hub\/admin\/users\/?$/);
    }
  });
});
