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
      contextLabel: 'Machine reservation modal',
      ignoreViolationIds: ['color-contrast']
    });
    await closeDialogWithEscape(page, /Bambu Lab X1C/i);

    const pathname = new URL(page.url()).pathname;
    // Closing the reservation modal should land on machine details (`/hub/fab-lab/:machineId`).
    // If the parent machine modal is also closed in the same escape chain, the fallback route is the list (`/hub/fab-lab`).
    expect(
      pathname,
      `Expected reservation modal close destination to be /hub/fab-lab/${machineId} or /hub/fab-lab, got ${pathname}`
    ).toMatch(new RegExp(`^/hub/fab-lab(?:/${machineId})?$`));
  });
});
