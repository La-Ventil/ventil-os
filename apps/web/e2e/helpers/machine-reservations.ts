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

  // Must stay under the 30 s test budget: with the full budget the loop never reaches its own deadline,
  // so the timeout below is unreachable and the test dies on whatever call is in flight instead.
  const SUBMISSION_TIMEOUT_MS = 15_000;
  // Each probe must be bounded too: Playwright has no default action timeout here, so a single auto-waiting
  // call could outlive the deadline check above and let the test budget expire inside the loop.
  const PROBE_TIMEOUT_MS = 1_000;
  const deadline = Date.now() + SUBMISSION_TIMEOUT_MS;
  let submissionState = 'pending';

  while (Date.now() < deadline) {
    const url = new URL(page.url());
    if (
      url.pathname === `/hub/fab-lab/machines/${machineId}` &&
      url.searchParams.get('step') === 'schedule' &&
      !url.searchParams.get('reservationId')
    ) {
      submissionState = 'returned-to-machine';
      break;
    }

    if ((await reservationDialog.count()) === 0) {
      const machineDialog = page.getByRole('dialog', { name: machineName }).first();
      if (await machineDialog.isVisible().catch(() => false)) {
        submissionState = 'returned-to-machine';
        break;
      }

      submissionState = 'closed';
      break;
    }

    const alert = reservationDialog.getByRole('alert').last();
    if (await alert.isVisible().catch(() => false)) {
      const text = await alert.textContent({ timeout: PROBE_TIMEOUT_MS }).catch(() => '');
      submissionState = `alert:${text?.trim() ?? ''}`;
      break;
    }

    // The state element is unmounted by the re-render that follows the action, so read the three attributes in
    // one evaluation: reading them one by one raced the unmount and threw mid-loop. A disappearance just means
    // there is nothing to report yet, hence the guard.
    const debugState = page.getByTestId('machine-reservation-state');
    const state = await debugState
      .evaluate(
        (node) => ({
          success: node.getAttribute('data-success'),
          valid: node.getAttribute('data-valid'),
          message: node.getAttribute('data-message')
        }),
        undefined,
        { timeout: PROBE_TIMEOUT_MS }
      )
      .catch(() => null);

    if (state) {
      if (state.success === 'true') {
        submissionState = `success:${state.message ?? ''}`;
        break;
      }
      if (state.valid === 'false') {
        submissionState = `invalid:${state.message ?? ''}`;
        break;
      }
    }

    await page.waitForTimeout(250);
  }

  if (submissionState === 'pending') {
    // Report what the loop was still seeing, otherwise the next timeout is as opaque as this one was.
    // Same guarded single read as in the loop: at this point the state element has usually just unmounted.
    const debugAttributes = await page
      .getByTestId('machine-reservation-state')
      .evaluate(
        (node) => ({
          success: node.getAttribute('data-success'),
          valid: node.getAttribute('data-valid'),
          message: node.getAttribute('data-message')
        }),
        undefined,
        { timeout: PROBE_TIMEOUT_MS }
      )
      .catch(() => null);

    throw new Error(
      `Reservation submission timed out after ${SUBMISSION_TIMEOUT_MS} ms ` +
        `(url=${page.url()}, reservationDialogs=${await reservationDialog.count()}, ` +
        `debugState=${JSON.stringify(debugAttributes)})`
    );
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
          step: url.searchParams.get('step'),
          reservationId: url.searchParams.get('reservationId')
        };
      },
      { timeout: 15_000 }
    )
    .toEqual({
      pathname: `/hub/fab-lab/machines/${machineId}`,
      tab: 'reservations',
      step: 'schedule',
      reservationId: null
    });
  await expect(page.getByRole('dialog', { name: machineName })).toBeVisible();

  return machineId;
}

export async function openMyReservationsTab(page: Page): Promise<void> {
  await page.goto('/hub/fab-lab/machines');
  await page.getByRole('tab', { name: /my reservations/i }).click();
}

export async function openEditableReservation(args: {
  machineId: string;
  reservationId: string;
  page: Page;
}): Promise<void> {
  const { machineId, reservationId, page } = args;
  await page.goto(`/hub/fab-lab/machines/${machineId}?tab=reservations&step=edit&reservationId=${reservationId}`);

  await expect(page).toHaveURL(
    new RegExp(`/hub/fab-lab/machines/${machineId}\\?tab=reservations&step=edit&reservationId=${reservationId}$`),
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
