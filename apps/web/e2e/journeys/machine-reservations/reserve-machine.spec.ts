import { test, expect } from '../../fixtures/test';
import { openMachineReservationModalFromSchedule } from '../../helpers/fab-lab';

test.describe('Machine reservation journey', () => {
  test('admin can reserve a machine from the reservation modal route', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    const machineId = await openMachineReservationModalFromSchedule(page);

    const reservationDialog = page.getByRole('dialog', { name: /Bambu Lab X1C/i });
    await expect(reservationDialog).toBeVisible();

    await reservationDialog.getByRole('button', { name: /réserver|reserve/i }).click();

    await expect(page).toHaveURL(new RegExp(`/hub/fab-lab/${machineId}$`), { timeout: 15_000 });
    await expect(page.getByRole('dialog', { name: /Bambu Lab X1C/i })).toBeVisible();

    await page.goto('/hub/fab-lab');
    await page.getByRole('tab', { name: /mes réservations|my reservations/i }).click();

    await expect(page.getByText(/Bambu Lab X1C/i).first()).toBeVisible();
  });
});
