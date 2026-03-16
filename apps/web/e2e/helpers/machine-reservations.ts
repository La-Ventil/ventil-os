import { expect, type Locator, type Page } from '@playwright/test';
import { openMachineReservationModalFromSchedule } from './fab-lab';
import { getMachineReservationTestRepository } from './machine-reservation-test-repository';

const getMachineDialogs = (page: Page, machineName: RegExp): Locator => page.getByRole('dialog', { name: machineName });

const getReservationDialog = (page: Page, machineName: RegExp): Locator =>
  getMachineDialogs(page, machineName).filter({
    has: page.locator('input[name="machineId"]')
  });

export async function submitReservationFromModalRoute(
  page: Page,
  machineName: RegExp = /Bambu Lab X1C/i
): Promise<string> {
  const machineId = await openMachineReservationModalFromSchedule(page, machineName);

  const reservationDialog = getReservationDialog(page, machineName);
  await expect(reservationDialog).toHaveCount(1);
  await expect(reservationDialog).toBeVisible();
  await reservationDialog.getByRole('button', { name: /réserver|reserve/i }).click();

  await expect
    .poll(
      async () => {
        if ((await reservationDialog.count()) === 0) {
          return 'closed';
        }

        const pathname = new URL(page.url()).pathname;
        if (pathname === `/hub/fab-lab/${machineId}`) {
          return 'returned-to-machine';
        }

        return 'pending';
      },
      { timeout: 30_000 }
    )
    .not.toBe('pending');

  return machineId;
}

export async function submitReservationAndReturnToMachineDetails(
  page: Page,
  machineName: RegExp = /Bambu Lab X1C/i
): Promise<string> {
  const machineId = await submitReservationFromModalRoute(page, machineName);

  await expect(page).toHaveURL(new RegExp(`/hub/fab-lab/${machineId}$`), { timeout: 15_000 });
  await expect(page.getByRole('dialog', { name: machineName })).toBeVisible();

  return machineId;
}

export async function openMyReservationsTab(page: Page): Promise<void> {
  await page.goto('/hub/fab-lab');
  await page.getByRole('tab', { name: /mes réservations|my reservations/i }).click();
}

export const getReservationCard = (page: Page, machineName: RegExp = /Bambu Lab X1C/i): Locator =>
  page.locator('.MuiCard-root[class*="machine-reservation-list-card"]').filter({ hasText: machineName }).first();

export function setLatestReservationActive(args: { creatorEmail?: string; dbSlot?: string }): Promise<void> {
  return getMachineReservationTestRepository(args.dbSlot).setLatestConfirmedReservationActiveNow({
    creatorEmail: args.creatorEmail
  });
}

export function setLatestReservationUpcoming(args: { creatorEmail?: string; dbSlot?: string }): Promise<void> {
  return getMachineReservationTestRepository(args.dbSlot).setLatestConfirmedReservationUpcomingSoon({
    creatorEmail: args.creatorEmail
  });
}

export function setLatestReservationPast(args: { creatorEmail?: string; dbSlot?: string }): Promise<void> {
  return getMachineReservationTestRepository(args.dbSlot).setLatestConfirmedReservationPast({
    creatorEmail: args.creatorEmail
  });
}

export function cancelLatestReservation(args: { creatorEmail?: string; dbSlot?: string }): Promise<string> {
  return getMachineReservationTestRepository(args.dbSlot).cancelLatestConfirmedReservation({
    creatorEmail: args.creatorEmail
  });
}
