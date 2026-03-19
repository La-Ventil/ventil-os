import type { Locator } from '@playwright/test';
import { test, expect } from '../../fixtures/test';
import { getAuthTestRepository } from '../../helpers/auth-test-repository';
import { openMachineDetails, openMachineReservationModalFromSchedule } from '../../helpers/fab-lab';
import {
  getCreateReservationDialog,
  getReservationCard,
  openMyReservationsTab,
  searchReservationParticipants,
  submitReservationAndReturnToMachineDetails
} from '../../helpers/machine-reservations';
import { freezeBrowserTime } from '../../helpers/time';

const getScheduleSlotButton = (machineDialog: Locator, timeLabel: RegExp): Locator =>
  machineDialog.getByText(timeLabel).locator('..').getByRole('button');

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

  test('participant search narrows matches in the reservation modal', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    await openMachineReservationModalFromSchedule(page, /Bambu Lab X1C/i);

    const reservationDialog = getCreateReservationDialog(page, /Bambu Lab X1C/i);
    await expect(reservationDialog).toBeVisible();

    const claudeOptions = await searchReservationParticipants({
      page,
      machineName: /Bambu Lab X1C/i,
      query: 'claude'
    });
    const claudeOption = claudeOptions.getByRole('option', { name: /Claude Dupont/i });
    await expect(claudeOption).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('option', { name: /Admin Global/i })).toHaveCount(0);
    await expect(page.getByRole('option', { name: /Admin Pédagogique/i })).toHaveCount(0);

    const adminOptions = await searchReservationParticipants({
      page,
      machineName: /Bambu Lab X1C/i,
      query: 'admin'
    });
    await expect(adminOptions.getByRole('option', { name: /Admin Pédagogique/i })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('option', { name: /Claude Dupont/i })).toHaveCount(0);
  });

  test('clicking an already started slot rounds the reservation start to the next minute', async ({
    page,
    loginAs
  }) => {
    const fixedNow = new Date();
    fixedNow.setHours(10, 7, 30, 0);
    await freezeBrowserTime(page, fixedNow);

    await loginAs('globalAdmin');
    const machineId = await openMachineDetails(page, /Bambu Lab X1C/i);

    const machineDialog = page.getByRole('dialog', { name: /Bambu Lab X1C/i }).first();
    await getScheduleSlotButton(machineDialog, /^10:00 AM$/).click();

    await expect(page).toHaveURL(new RegExp(`/hub/fab-lab/${machineId}/reservation\\?start=`), { timeout: 15_000 });

    const roundedNow = new Date(fixedNow);
    roundedNow.setSeconds(0, 0);
    roundedNow.setMinutes(roundedNow.getMinutes() + 1);

    const url = new URL(page.url());
    expect(url.searchParams.get('start')).toBe(roundedNow.toISOString());
  });

  test('student cannot open a reservation slot when badge level requirement is not met', async ({
    page,
    loginAs,
    seedUsers,
    workerWebRuntime
  }) => {
    const fixedNow = new Date();
    fixedNow.setHours(9, 0, 0, 0);

    await getAuthTestRepository(workerWebRuntime?.dbSlot).setBlockedByEmail(seedUsers.student.email, false);

    await loginAs('student');

    await freezeBrowserTime(page, fixedNow);

    await openMachineDetails(page, /Bambu Lab X1C/i);
    const machineDialog = page.getByRole('dialog', { name: /Bambu Lab X1C/i }).first();
    await expect(machineDialog).toBeVisible();
    await expect(getScheduleSlotButton(machineDialog, /^10:00 AM$/)).toBeDisabled();
  });
});
