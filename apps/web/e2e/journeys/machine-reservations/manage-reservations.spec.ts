import { test, expect } from '../../fixtures/test';
import {
  createReservationFromSchedule,
  getReservationCard,
  openMyReservationsTab,
  setLatestReservationActive,
  setLatestReservationUpcoming
} from '../../helpers/machine-reservations';

test.describe('Machine reservation management journeys', () => {
  test('admin can cancel an upcoming reservation from the reservations list card', async ({
    page,
    loginAs,
    workerWebRuntime
  }) => {
    await loginAs('globalAdmin');
    await createReservationFromSchedule(page);

    await openMyReservationsTab(page);
    await expect(getReservationCard(page)).toBeVisible();
    await setLatestReservationUpcoming({ dbSlot: workerWebRuntime?.dbSlot });
    await page.reload();
    await page.getByRole('tab', { name: /mes réservations|my reservations/i }).click();

    const reservationCard = getReservationCard(page);
    await expect(reservationCard).toBeVisible();

    const cancelButton = reservationCard.getByRole('button', { name: /annuler|cancel/i });
    await expect(cancelButton).toBeVisible();

    await cancelButton.click();

    await expect(reservationCard.getByRole('button', { name: /annuler|cancel/i })).toHaveCount(0);
    await expect(reservationCard).toContainText(/Bambu Lab X1C/i);
  });

  test('admin can release an active reservation from the reservations list card', async ({
    page,
    loginAs,
    workerWebRuntime
  }) => {
    await loginAs('globalAdmin');
    await createReservationFromSchedule(page);

    await openMyReservationsTab(page);
    await expect(getReservationCard(page)).toBeVisible();
    await setLatestReservationActive({ dbSlot: workerWebRuntime?.dbSlot });
    await page.reload();
    await page.getByRole('tab', { name: /mes réservations|my reservations/i }).click();

    const reservationCard = getReservationCard(page);
    await expect(reservationCard).toBeVisible();
    await expect(reservationCard).toContainText(/en cours|in progress/i);

    const releaseButton = reservationCard.getByRole('button', { name: /libérer|release/i });
    await expect(releaseButton).toBeVisible();
    await releaseButton.click();

    await expect(reservationCard).not.toContainText(/en cours|in progress/i);
    await expect(reservationCard.getByRole('button', { name: /libérer|release/i })).toHaveCount(0);
  });
});
