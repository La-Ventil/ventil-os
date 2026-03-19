import { expect, type Page } from '@playwright/test';
import { openRouteModalFromTrigger } from './dialogs';

type MachineDialogArgs = {
  machineName?: RegExp;
  page: Page;
};

export function getMachineDialog({ machineName = /Bambu Lab X1C/i, page }: MachineDialogArgs) {
  return page.getByRole('dialog', { name: machineName }).first();
}

export async function openMachineDetails(page: Page, machineName: RegExp = /Bambu Lab X1C/i): Promise<string> {
  await page.goto('/hub/fab-lab', { waitUntil: 'domcontentloaded' });

  const machineCard = page
    .locator('a[href^="/hub/fab-lab/"], [role="button"]')
    .filter({ hasText: machineName })
    .first();
  await expect(machineCard).toBeVisible();
  const href = await machineCard.getAttribute('href');

  await openRouteModalFromTrigger({
    page,
    trigger: machineCard,
    dialogName: machineName,
    expectedUrl: href
      ? new RegExp(`${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\?.*)?$`)
      : /\/hub\/fab-lab\/[^/?]+(\?.*)?$/
  });

  const url = new URL(page.url());
  const segments = url.pathname.split('/').filter(Boolean);
  const machineId = segments.at(-1);

  if (!machineId) {
    throw new Error(`Unable to resolve machine id from URL: ${url.pathname}`);
  }

  return machineId;
}

export async function openMachineReservationModalFromSchedule(
  page: Page,
  machineName: RegExp = /Bambu Lab X1C/i
): Promise<string> {
  const machineId = await openMachineDetails(page, machineName);
  await openReservationComposerForMachine({ page, machineName, machineId });

  return machineId;
}

export async function openReservationComposerForMachine(
  args: MachineDialogArgs & { machineId?: string }
): Promise<void> {
  const { machineName = /Bambu Lab X1C/i, page } = args;
  const machineId = args.machineId ?? (await openMachineDetails(page, machineName));
  const start = getFutureReservationStart();
  const dayKey = start.toISOString().slice(0, 10);

  await page.goto(
    `/hub/fab-lab/${machineId}?day=${dayKey}&tab=reservations&start=${encodeURIComponent(start.toISOString())}`
  );
  await expect(page).toHaveURL(new RegExp(`/hub/fab-lab/${machineId}\\?(.+&)?tab=reservations(&.+)?`), {
    timeout: 15_000
  });
  await expect(getMachineDialog({ page, machineName })).toBeVisible({ timeout: 15_000 });
}

const getFutureReservationStart = (): Date => {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(10, 0, 0, 0);
  return start;
};
