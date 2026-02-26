import { test, expect } from '../fixtures/test';
import { expectNoSeriousA11yViolations } from '../helpers/a11y';
import { openMachineReservationModalFromSchedule } from '../helpers/fab-lab';
import { closeDialogWithEscape, expectDialog } from '../helpers/dialogs';

test.describe('Machine reservation accessibility', () => {
  test('reservation modal is labelled, form fields are named, and dialog closes with Escape', async ({
    page,
    loginAs
  }) => {
    await loginAs('globalAdmin');
    const machineId = await openMachineReservationModalFromSchedule(page);

    const dialog = await expectDialog(page, /Bambu Lab X1C/i);
    await expect(dialog).toHaveAttribute('aria-labelledby', /.+/);
    await expect(dialog).toHaveAttribute('aria-describedby', /.+/);

    await expect(dialog.getByRole('group', { name: /date de début|start time/i })).toBeVisible();
    await expect(dialog.getByRole('combobox', { name: /durée|duration/i })).toBeVisible();
    await expect(dialog.getByRole('combobox', { name: /participants/i })).toBeVisible();
    await expect(dialog.getByRole('button', { name: /réserver|reserve/i })).toBeVisible();

    await expectNoSeriousA11yViolations(page, {
      include: ['[role="dialog"]'],
      ignoreViolationIds: ['color-contrast']
    });
    await closeDialogWithEscape(page, /Bambu Lab X1C/i);
    await expect(page).toHaveURL(new RegExp(`/hub/fab-lab/${machineId}$`));
  });
});
