import { test, expect } from '../../fixtures/test';
import { getReservationCard, openMyReservationsTab } from '../../helpers/machine-reservations';
import {
  givenActiveReservation,
  givenCancelledReservation,
  givenPastReservation,
  givenUpcomingReservation
} from '../../helpers/machine-reservation-fixtures';
import { openMachineDetails } from '../../helpers/fab-lab';

const reservationTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Paris'
});

const MACHINE_NAME = 'Bambu Lab X1C n°1';

test.describe('Machine reservation management journeys', () => {
  test('admin can cancel an upcoming reservation from the reservations list card', async ({
    page,
    loginAs,
    seedUsers,
    workerWebRuntime
  }) => {
    await loginAs('globalAdmin');
    await givenUpcomingReservation({
      machineName: MACHINE_NAME,
      creatorEmail: seedUsers.globalAdmin.email,
      dbSlot: workerWebRuntime?.dbSlot
    });

    await openMyReservationsTab(page);

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
    await givenActiveReservation({
      machineName: MACHINE_NAME,
      creatorEmail: seedUsers.pedagogicalAdmin.email,
      dbSlot: workerWebRuntime?.dbSlot
    });

    await openMyReservationsTab(page);

    const reservationCard = getReservationCard(page);
    await expect(reservationCard).toBeVisible();
    await expect(reservationCard).toContainText(/en cours|in progress/i);

    const releaseButton = reservationCard.getByRole('button', { name: /libérer|release/i });
    await expect(releaseButton).toBeVisible();
    await releaseButton.click();

    await expect(reservationCard).toHaveCount(0);
  });

  test('past reservations are hidden from the user reservations list', async ({
    page,
    loginAs,
    seedUsers,
    workerWebRuntime
  }) => {
    await loginAs('globalAdmin');
    await givenPastReservation({
      machineName: MACHINE_NAME,
      creatorEmail: seedUsers.globalAdmin.email,
      dbSlot: workerWebRuntime?.dbSlot
    });

    await openMyReservationsTab(page);

    await expect(getReservationCard(page)).toHaveCount(0);
  });

  test('cancelled reservations are hidden from the user reservations list', async ({
    page,
    loginAs,
    seedUsers,
    workerWebRuntime
  }) => {
    await loginAs('globalAdmin');
    await givenCancelledReservation({
      machineName: MACHINE_NAME,
      creatorEmail: seedUsers.globalAdmin.email,
      dbSlot: workerWebRuntime?.dbSlot
    });

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
    const { reservationId, window } = await givenCancelledReservation({
      machineName: MACHINE_NAME,
      creatorEmail: seedUsers.globalAdmin.email,
      dbSlot: workerWebRuntime?.dbSlot
    });
    expect(reservationId).toMatch(/\w+/);
    const reservationTimeLabel = `${reservationTimeFormatter.format(window.start)} → ${reservationTimeFormatter.format(
      window.end
    )}`;

    await openMachineDetails(page, /Bambu Lab X1C/i);
    const machineDialog = page.getByRole('dialog', { name: /Bambu Lab X1C/i }).first();
    await expect(machineDialog).toBeVisible();
    await expect(machineDialog.getByText(reservationTimeLabel, { exact: true })).toHaveCount(0);
  });
});
