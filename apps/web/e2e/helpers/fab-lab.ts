import { expect, type Page } from '@playwright/test';

type MachineDialogArgs = {
  machineName?: RegExp;
  page: Page;
};

export function getMachineDialog({ machineName = /Bambu Lab X1C/i, page }: MachineDialogArgs) {
  return page.getByRole('dialog', { name: machineName }).first();
}

export async function openMachineDetails(page: Page, machineName: RegExp = /Bambu Lab X1C/i): Promise<string> {
  await page.goto('/hub/fab-lab', { waitUntil: 'domcontentloaded' });

  const machineCard = page.locator('a[href^="/hub/fab-lab/"]').filter({ hasText: machineName }).first();
  await expect(machineCard).toBeVisible();
  const href = await machineCard.getAttribute('href');
  if (!href) {
    throw new Error(`Unable to resolve machine href for ${machineName}`);
  }

  await page.goto(href, { waitUntil: 'domcontentloaded' });
  await expect(getMachineDialog({ page, machineName })).toBeVisible({ timeout: 15_000 });

  const url = new URL(href, page.url());
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
  await openReservationComposerForMachine({ page, machineName });

  return machineId;
}

export async function openReservationComposerForMachine(args: MachineDialogArgs): Promise<void> {
  const { machineName = /Bambu Lab X1C/i, page } = args;
  const machineDialog = getMachineDialog({ page, machineName });
  const targetSlotLabel = getDeterministicFutureSlotLabel();
  const slotButtonByLabel = machineDialog
    .getByText(new RegExp(`^${escapeRegExp(targetSlotLabel)}$`))
    .locator('..')
    .getByRole('button')
    .first();
  const slotButton = (await slotButtonByLabel.count())
    ? slotButtonByLabel.first()
    : machineDialog
        .locator('button[aria-label*="Réserver à"]:not([disabled]), button[aria-label*="Reserve at"]:not([disabled])')
        .first();

  await expect(slotButton).toBeVisible();
  await slotButton.click();

  await expect(page).toHaveURL(/\/hub\/fab-lab\/[^/?]+\?(.+&)?tab=reservations(&.+)?/, { timeout: 15_000 });
  await expect(getMachineDialog({ page, machineName })).toBeVisible({ timeout: 15_000 });
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getDeterministicFutureSlotLabel = (): string => {
  const slot = new Date();
  slot.setSeconds(0, 0);
  slot.setMinutes(slot.getMinutes() + 60);
  const minutes = slot.getMinutes();
  slot.setMinutes(minutes <= 30 ? 30 : 60, 0, 0);

  if (slot.getHours() >= 20) {
    slot.setHours(19, 30, 0, 0);
  }

  return new Intl.DateTimeFormat('en-US', {
    timeStyle: 'short',
    timeZone: 'Europe/Paris'
  }).format(slot);
};
