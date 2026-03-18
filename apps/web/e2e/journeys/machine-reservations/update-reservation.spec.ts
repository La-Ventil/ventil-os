import { test, expect } from '../../fixtures/test';
import { openMachineDetails } from '../../helpers/fab-lab';
import { getMachineReservationTestRepository } from '../../helpers/machine-reservation-test-repository';
import {
  getUpdateReservationDialog,
  openEditableReservation,
  submitReservationUpdate,
  updateReservationDuration
} from '../../helpers/machine-reservations';
import { getOpenBadgeTestRepository } from '../../helpers/open-badge-test-repository';

const THIRTY_MINUTES_MS = 30 * 60_000;
const NINETY_MINUTES_MS = 90 * 60_000;
const SECOND_BAMBU_MACHINE_NAME = 'Bambu Lab X1C n°2';
const SECOND_BAMBU_MACHINE = /Bambu Lab X1C n°2/i;

const roundUpToNextHalfHour = (date: Date): Date => {
  const rounded = new Date(date);
  rounded.setSeconds(0, 0);

  const minutes = rounded.getMinutes();
  const offsetMinutes = minutes === 0 || minutes === 30 ? 0 : 30 - (minutes % 30);

  if (offsetMinutes > 0) {
    rounded.setMinutes(minutes + offsetMinutes);
  }

  return rounded;
};

const createEditableReservationStart = (offsetMinutes: number = 0, now: Date = new Date()): Date => {
  const sameDayCandidate = roundUpToNextHalfHour(new Date(now.getTime() + NINETY_MINUTES_MS + offsetMinutes * 60_000));
  const latestSameDayStart = new Date(sameDayCandidate);
  latestSameDayStart.setHours(21, 30, 0, 0);

  if (sameDayCandidate.getTime() <= latestSameDayStart.getTime()) {
    return sameDayCandidate;
  }

  const tomorrowMorning = new Date(now);
  tomorrowMorning.setDate(tomorrowMorning.getDate() + 1);
  tomorrowMorning.setHours(10, 0, 0, 0);
  return tomorrowMorning;
};

test.describe('Machine reservation update journey', () => {
  test('changing reservation minutes in the date picker keeps a valid start date without client errors', async ({
    page,
    loginAs,
    seedUsers,
    workerWebRuntime
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    const startsAt = createEditableReservationStart();
    const fixedNow = new Date(startsAt);
    fixedNow.setHours(Math.max(8, startsAt.getHours() - 2), 0, 0, 0);

    await page.addInitScript(
      ({ nowIso }) => {
        const fixedTime = new Date(nowIso).getTime();
        const OriginalDate = Date;

        class MockDate extends OriginalDate {
          constructor(...args: unknown[]) {
            if (args.length === 0) {
              super(fixedTime);
              return;
            }

            if (args.length === 1) {
              super(args[0] as string | number | Date);
              return;
            }

            if (args.length === 2) {
              super(args[0] as number, args[1] as number);
              return;
            }

            if (args.length === 3) {
              super(args[0] as number, args[1] as number, args[2] as number);
              return;
            }

            if (args.length === 4) {
              super(args[0] as number, args[1] as number, args[2] as number, args[3] as number);
              return;
            }

            if (args.length === 5) {
              super(args[0] as number, args[1] as number, args[2] as number, args[3] as number, args[4] as number);
              return;
            }

            if (args.length === 6) {
              super(
                args[0] as number,
                args[1] as number,
                args[2] as number,
                args[3] as number,
                args[4] as number,
                args[5] as number
              );
              return;
            }

            super(
              args[0] as number,
              args[1] as number,
              args[2] as number,
              args[3] as number,
              args[4] as number,
              args[5] as number,
              args[6] as number
            );
          }

          static now(): number {
            return fixedTime;
          }
        }

        globalThis.Date = MockDate as DateConstructor;
      },
      { nowIso: fixedNow.toISOString() }
    );

    await loginAs('globalAdmin');

    const reservations = getMachineReservationTestRepository(workerWebRuntime?.dbSlot);
    const reservationId = await reservations.createConfirmedReservation({
      machineName: SECOND_BAMBU_MACHINE_NAME,
      creatorEmail: seedUsers.globalAdmin.email,
      startsAt,
      durationMinutes: 15
    });

    const machineId = await openMachineDetails(page, SECOND_BAMBU_MACHINE);
    await openEditableReservation({
      machineId,
      reservationId,
      page
    });

    const reservationDialog = getUpdateReservationDialog(page, SECOND_BAMBU_MACHINE);

    await expect(reservationDialog).toBeVisible();

    const startsAtInput = reservationDialog.locator('input[name="startsAt"]');
    const minutesField = reservationDialog.getByRole('spinbutton', { name: 'Minutes' });
    await minutesField.click();
    await minutesField.press('ArrowUp');
    await minutesField.press('Tab');

    await expect(startsAtInput).not.toHaveValue('');

    await reservationDialog.getByRole('button', { name: /mettre à jour|update/i }).click();

    await expect(page).toHaveURL(new RegExp(`/hub/fab-lab/${machineId}$`), { timeout: 15_000 });
    await expect(pageErrors).toEqual([]);
  });

  test('admin can update an existing reservation from the reservation modal route', async ({
    page,
    loginAs,
    seedUsers,
    workerWebRuntime
  }) => {
    const startsAt = createEditableReservationStart(60);

    await loginAs('globalAdmin');

    const reservations = getMachineReservationTestRepository(workerWebRuntime?.dbSlot);
    const reservationId = await reservations.createConfirmedReservation({
      machineName: SECOND_BAMBU_MACHINE_NAME,
      creatorEmail: seedUsers.globalAdmin.email,
      startsAt,
      durationMinutes: 15
    });

    const machineId = await openMachineDetails(page, SECOND_BAMBU_MACHINE);
    await openEditableReservation({
      machineId,
      reservationId,
      page
    });

    const reservationDialog = getUpdateReservationDialog(page, SECOND_BAMBU_MACHINE);

    await expect(reservationDialog).toHaveCount(1);
    await expect(reservationDialog).toBeVisible();

    await updateReservationDuration({ page, machineName: SECOND_BAMBU_MACHINE, optionName: /30 min/i });
    await submitReservationUpdate(page, SECOND_BAMBU_MACHINE);

    await expect(page).toHaveURL(new RegExp(`/hub/fab-lab/${machineId}$`), { timeout: 15_000 });
    await expect(reservationDialog).toHaveCount(0, { timeout: 15_000 });

    const updatedWindow = await reservations.getReservationWindow(reservationId);
    expect(updatedWindow.end.getTime() - updatedWindow.start.getTime()).toBe(THIRTY_MINUTES_MS);
  });

  test('reservation update is rejected when the owner no longer meets the machine badge requirement', async ({
    page,
    loginAs,
    seedUsers,
    workerWebRuntime
  }) => {
    const startsAt = createEditableReservationStart(180);

    await loginAs('globalAdmin');

    const reservations = getMachineReservationTestRepository(workerWebRuntime?.dbSlot);
    const badgeRepository = getOpenBadgeTestRepository(workerWebRuntime?.dbSlot);
    const reservationId = await reservations.createConfirmedReservation({
      machineName: SECOND_BAMBU_MACHINE_NAME,
      creatorEmail: seedUsers.globalAdmin.email,
      startsAt,
      durationMinutes: 15
    });

    const machineId = await openMachineDetails(page, SECOND_BAMBU_MACHINE);
    await openEditableReservation({
      machineId,
      reservationId,
      page
    });

    const reservationDialog = getUpdateReservationDialog(page, SECOND_BAMBU_MACHINE);

    await expect(reservationDialog).toBeVisible();

    await badgeRepository.removeProgressForUserByBadgeName(seedUsers.globalAdmin.email, 'Impression 3D Bambu Lab');

    await updateReservationDuration({ page, machineName: SECOND_BAMBU_MACHINE, optionName: /30 min/i });
    await submitReservationUpdate(page, SECOND_BAMBU_MACHINE);

    await expect(
      reservationDialog.getByRole('alert').filter({ hasText: /badge requis|required open badge/i })
    ).toBeVisible({
      timeout: 10_000
    });
    await expect(page).toHaveURL(new RegExp(`/hub/fab-lab/${machineId}/reservation\\?reservationId=${reservationId}$`));
  });
});
