import { test, expect } from '../fixtures/test';
import { expectDialog, closeDialogWithEscape } from '../helpers/dialogs';
import { expectNoSeriousA11yViolations } from '../helpers/a11y';

test.describe('Auth accessibility', () => {
  test('login page exposes labeled controls and no serious axe violations', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { level: 2 })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByLabel(/mot de passe|password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /se connecter|sign in/i })).toBeVisible();

    await expectNoSeriousA11yViolations(page);
  });

  test('signup privacy policy dialog is keyboard-dismissible and labelled', async ({ page }) => {
    await page.goto('/signup');

    await page.getByRole('button', { name: /politique de confidentialité|privacy policy/i }).click();

    const dialog = await expectDialog(page, /politique de confidentialité|privacy policy/i);
    await expect(dialog).toHaveAttribute('aria-labelledby', /.+/);
    await expect(dialog).toHaveAttribute('aria-describedby', /.+/);

    await expectNoSeriousA11yViolations(page, { include: ['[role="dialog"]'] });
    await closeDialogWithEscape(page, /politique de confidentialité|privacy policy/i);
  });
});
