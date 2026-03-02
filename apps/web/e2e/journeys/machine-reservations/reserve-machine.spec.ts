import { test, expect } from '../../fixtures/test';
import {
  getReservationCard,
  openMyReservationsTab,
  submitReservationAndReturnToMachineDetails
} from '../../helpers/machine-reservations';

test.describe('Machine reservation journey', () => {
  test('admin can reserve a machine from the reservation modal route', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    const machineId = await submitReservationAndReturnToMachineDetails(page, /Bambu Lab X1C/i);

    await openMyReservationsTab(page);
    await expect(page).toHaveURL(/\/hub\/fab-lab$/);
    await expect(getReservationCard(page)).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/hub/fab-lab$`));
    expect(machineId).toMatch(/\w+/);
  });
});
