import { test, expect } from '../../fixtures/test';
import { getMachineReservationTestRepository } from '../../helpers/machine-reservation-test-repository';
import { submitReservationAndReturnToMachineDetails } from '../../helpers/machine-reservations';

const THIRTY_MINUTES_MS = 30 * 60_000;

test.describe('Machine reservation update journey', () => {
  test('admin can update an existing reservation from the reservation modal route', async ({
    page,
    loginAs,
    seedUsers,
    workerWebRuntime
  }) => {
    await loginAs('globalAdmin');

    const machineId = await submitReservationAndReturnToMachineDetails(page, /Bambu Lab X1C/i);
    const reservations = getMachineReservationTestRepository(workerWebRuntime?.dbSlot);
    const reservationId = await reservations.getLatestConfirmedReservationId({
      creatorEmail: seedUsers.globalAdmin.email
    });
    const machineDialog = page.getByRole('dialog', { name: /Bambu Lab X1C/i }).first();
    const reservationScheduleCard = machineDialog.locator('[role="button"]').filter({ hasText: /→/ }).first();

    await expect(reservationScheduleCard).toBeVisible();
    await reservationScheduleCard.focus();
    await reservationScheduleCard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`/hub/fab-lab/${machineId}/reservation\\?reservationId=${reservationId}$`), {
      timeout: 15_000
    });

    const reservationDialog = page.getByRole('dialog', { name: /Bambu Lab X1C/i }).filter({
      has: page.getByRole('button', { name: /mettre à jour|update/i })
    });

    await expect(reservationDialog).toHaveCount(1);
    await expect(reservationDialog).toBeVisible();

    await reservationDialog.getByRole('combobox', { name: /durée|duration/i }).click();
    await page.getByRole('option', { name: /30 min/i }).click();
    await reservationDialog.getByRole('button', { name: /mettre à jour|update/i }).click();

    await expect(page).toHaveURL(new RegExp(`/hub/fab-lab/${machineId}$`), { timeout: 15_000 });
    await expect(reservationDialog).toHaveCount(0, { timeout: 15_000 });

    const updatedWindow = await reservations.getReservationWindow(reservationId);
    expect(updatedWindow.end.getTime() - updatedWindow.start.getTime()).toBe(THIRTY_MINUTES_MS);
  });
});
