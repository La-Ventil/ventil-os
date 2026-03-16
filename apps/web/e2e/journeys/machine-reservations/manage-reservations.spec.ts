import { test, expect } from '../../fixtures/test';
import {
  cancelLatestReservation,
  getReservationCard,
  openMyReservationsTab,
  setLatestReservationPast,
  submitReservationFromModalRoute,
  setLatestReservationActive,
  setLatestReservationUpcoming
} from '../../helpers/machine-reservations';
import { getMachineReservationTestRepository } from '../../helpers/machine-reservation-test-repository';
import { openMachineDetails } from '../../helpers/fab-lab';

const reservationTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Paris'
});

test.describe('Machine reservation management journeys', () => {
  test('admin can cancel an upcoming reservation from the reservations list card', async ({
    page,
    loginAs,
    workerWebRuntime
  }) => {
    await loginAs('globalAdmin');
    await submitReservationFromModalRoute(page, /Bambu Lab X1C/i);

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

    await expect(reservationCard).toHaveCount(0);
  });

  test('pedagogical admin can release an active reservation from the reservations list card', async ({
    page,
    loginAs,
    seedUsers,
    workerWebRuntime
  }) => {
    await loginAs('pedagogicalAdmin');
    await submitReservationFromModalRoute(page, /Bambu Lab X1C/i);

    await openMyReservationsTab(page);
    await expect(getReservationCard(page)).toBeVisible();
    await setLatestReservationActive({
      creatorEmail: seedUsers.pedagogicalAdmin.email,
      dbSlot: workerWebRuntime?.dbSlot
    });
    await page.reload();
    await page.getByRole('tab', { name: /mes réservations|my reservations/i }).click();

    const reservationCard = getReservationCard(page);
    await expect(reservationCard).toBeVisible();
    await expect(reservationCard).toContainText(/en cours|in progress/i);

    const releaseButton = reservationCard.getByRole('button', { name: /libérer|release/i });
    await expect(releaseButton).toBeVisible();
    await releaseButton.click();

    await expect(reservationCard).toHaveCount(0);
  });

  test('past reservations are hidden from the user reservations list', async ({ page, loginAs, workerWebRuntime }) => {
    await loginAs('globalAdmin');
    await submitReservationFromModalRoute(page, /Bambu Lab X1C/i);

    await setLatestReservationPast({ dbSlot: workerWebRuntime?.dbSlot });
    await openMyReservationsTab(page);

    await expect(getReservationCard(page)).toHaveCount(0);
  });

  test('cancelled reservations are removed from the machine schedule', async ({
    page,
    loginAs,
    seedUsers,
    workerWebRuntime
  }) => {
    await loginAs('globalAdmin');
    await submitReservationFromModalRoute(page, /Bambu Lab X1C/i);
    const reservations = getMachineReservationTestRepository(workerWebRuntime?.dbSlot);
    const reservationId = await reservations.getLatestConfirmedReservationId({
      creatorEmail: seedUsers.globalAdmin.email
    });
    const reservationWindow = await reservations.getReservationWindow(reservationId);
    const reservationTimeLabel = `${reservationTimeFormatter.format(reservationWindow.start)} → ${reservationTimeFormatter.format(
      reservationWindow.end
    )}`;

    await cancelLatestReservation({
      creatorEmail: seedUsers.globalAdmin.email,
      dbSlot: workerWebRuntime?.dbSlot
    });

    await openMachineDetails(page, /Bambu Lab X1C/i);
    const machineDialog = page.getByRole('dialog', { name: /Bambu Lab X1C/i }).first();
    await expect(machineDialog).toBeVisible();
    await expect(machineDialog.getByText(reservationTimeLabel, { exact: true })).toHaveCount(0);
  });
});
