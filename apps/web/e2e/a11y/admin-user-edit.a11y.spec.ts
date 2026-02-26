import { test, expect } from '../fixtures/test';
import { expectNoSeriousA11yViolations } from '../helpers/a11y';
import { openAdminUserEditPage } from '../helpers/admin-users';

test.describe('Admin user edit accessibility', () => {
  test('edit form exposes labelled fields and no serious axe violations', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    await openAdminUserEditPage(page, 'student@ventil.local');

    await expect(page.getByRole('textbox', { name: /^(prénom|first name)$/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /^(nom|last name)$/i })).toBeVisible();
    await expect(page.getByRole('combobox', { name: /niveau scolaire|school level/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /retour|back/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /modifier|update/i })).toBeVisible();

    await expectNoSeriousA11yViolations(page, {
      include: ['form'],
      contextLabel: 'Admin user edit form',
      ignoreViolationIds: ['color-contrast']
    });
  });
});
