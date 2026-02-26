import { test, expect } from '../fixtures/test';
import { expectNoSeriousA11yViolations } from '../helpers/a11y';
import { closeDialogWithEscape, expectDialog } from '../helpers/dialogs';
import { openAdminOpenBadgeAssignModal } from '../helpers/open-badges';

test.describe('Admin open badge assign modal accessibility', () => {
  test('assign modal is labelled, fields are named, and closes with Escape', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    await openAdminOpenBadgeAssignModal(page);

    const dialog = await expectDialog(page, /attribution d.?un open badge|assign an open badge/i);
    await expect(dialog).toHaveAttribute('aria-labelledby', /.+/);
    await expect(dialog).toHaveAttribute('aria-describedby', /.+/);

    await expect(dialog.getByRole('combobox', { name: /niveau|level/i })).toBeVisible();
    await expect(dialog.getByRole('combobox', { name: /utilisateur|user/i })).toBeVisible();
    await expect(dialog.getByRole('button', { name: /retour|back/i }).last()).toBeVisible();
    await expect(dialog.getByRole('button', { name: /attribuer|assign/i })).toBeVisible();

    await expectNoSeriousA11yViolations(page, {
      include: ['[role="dialog"]'],
      contextLabel: 'Admin open badge assign modal',
      ignoreViolationIds: ['color-contrast']
    });

    await closeDialogWithEscape(page, /attribution d.?un open badge|assign an open badge/i);
    await expect(page).toHaveURL(/\/hub\/admin\/open-badges$/);
  });
});
