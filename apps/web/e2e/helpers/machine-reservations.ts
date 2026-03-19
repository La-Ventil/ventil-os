import { expect, type Locator, type Page } from '@playwright/test';
import { openMachineReservationModalFromSchedule } from './fab-lab';
import { getMachineReservationTestRepository } from './machine-reservation-test-repository';
import { replaceAutocompleteQuery } from './autocomplete';

const getMachineDialogs = (page: Page, machineName: RegExp): Locator => page.getByRole('dialog', { name: machineName });

export const getCreateReservationDialog = (page: Page, machineName: RegExp = /Bambu Lab X1C/i): Locator =>
  getMachineDialogs(page, machineName).filter({
    has: page.locator('input[name="machineId"]')
  });

export const getUpdateReservationDialog = (page: Page, machineName: RegExp): Locator =>
  getMachineDialogs(page, machineName).filter({
    has: page.getByRole('button', { name: /update/i })
  });

export async function submitReservationFromModalRoute(
  page: Page,
  machineName: RegExp = /Bambu Lab X1C/i
): Promise<string> {
  const machineId = await openMachineReservationModalFromSchedule(page, machineName);

  const reservationDialog = getCreateReservationDialog(page, machineName);
  await expect(reservationDialog).toHaveCount(1);
  await expect(reservationDialog).toBeVisible();
  await reservationDialog.getByRole('button', { name: /reserve/i }).click();

  const deadline = Date.now() + 30_000;
  let submissionState = 'pending';

  while (Date.now() < deadline) {
    if ((await reservationDialog.count()) === 0) {
      submissionState = 'closed';
      break;
    }

    const alert = reservationDialog.getByRole('alert').last();
    if (await alert.isVisible().catch(() => false)) {
      submissionState = `alert:${(await alert.textContent())?.trim() ?? ''}`;
      break;
    }

    const debugState = page.getByTestId('machine-reservation-state');
    if ((await debugState.count()) > 0) {
      const success = await debugState.getAttribute('data-success');
      const valid = await debugState.getAttribute('data-valid');
      const message = await debugState.getAttribute('data-message');
      if (success === 'true') {
        submissionState = `success:${message ?? ''}`;
        break;
      }
      if (valid === 'false') {
        submissionState = `invalid:${message ?? ''}`;
        break;
      }
    }

    const url = new URL(page.url());
    if (
      url.pathname === `/hub/fab-lab/${machineId}` &&
      !url.searchParams.get('start') &&
      !url.searchParams.get('reservationId')
    ) {
      submissionState = 'returned-to-machine';
      break;
    }

    await page.waitForTimeout(250);
  }

  if (submissionState === 'pending') {
    throw new Error('Reservation submission timed out');
  }

  if (submissionState.startsWith('alert:') || submissionState.startsWith('invalid:') || submissionState === 'closed') {
    throw new Error(`Reservation submission failed: ${submissionState}`);
  }

  return machineId;
}

export async function submitReservationAndReturnToMachineDetails(
  page: Page,
  machineName: RegExp = /Bambu Lab X1C/i
): Promise<string> {
  const machineId = await submitReservationFromModalRoute(page, machineName);

  await expect
    .poll(
      () => {
        const url = new URL(page.url());
        return {
          pathname: url.pathname,
          tab: url.searchParams.get('tab'),
          reservationId: url.searchParams.get('reservationId')
        };
      },
      { timeout: 15_000 }
    )
    .toEqual({
      pathname: `/hub/fab-lab/${machineId}`,
      tab: 'reservations',
      reservationId: null
    });
  await expect(page.getByRole('dialog', { name: machineName })).toBeVisible();

  return machineId;
}

export async function openMyReservationsTab(page: Page): Promise<void> {
  await page.goto('/hub/fab-lab');
  await page.getByRole('tab', { name: /my reservations/i }).click();
}

export async function openEditableReservation(args: {
  machineId: string;
  reservationId: string;
  page: Page;
}): Promise<void> {
  const { machineId, reservationId, page } = args;
  await page.goto(`/hub/fab-lab/${machineId}?tab=reservations&reservationId=${reservationId}`);

  await expect(page).toHaveURL(
    new RegExp(`/hub/fab-lab/${machineId}\\?tab=reservations&reservationId=${reservationId}$`),
    {
      timeout: 15_000
    }
  );
}

export async function updateReservationDuration(args: {
  page: Page;
  machineName: RegExp;
  optionName: RegExp;
}): Promise<void> {
  const { machineName, optionName, page } = args;
  const reservationDialog = getUpdateReservationDialog(page, machineName);
  await expect(reservationDialog).toBeVisible();
  await reservationDialog.getByRole('combobox', { name: /duration/i }).click();
  await page.getByRole('option', { name: optionName }).click();
}

export async function submitReservationUpdate(page: Page, machineName: RegExp): Promise<void> {
  const reservationDialog = getUpdateReservationDialog(page, machineName);
  await expect(reservationDialog).toBeVisible();
  await reservationDialog.getByRole('button', { name: /update/i }).click();
}

export async function searchReservationParticipants(args: {
  page: Page;
  machineName?: RegExp;
  query: string;
}): Promise<Locator> {
  const reservationDialog = getCreateReservationDialog(args.page, args.machineName ?? /Bambu Lab X1C/i);
  await expect(reservationDialog).toBeVisible();

  return replaceAutocompleteQuery({
    page: args.page,
    field: reservationDialog.getByRole('combobox', { name: /participants/i }),
    query: args.query
  });
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
