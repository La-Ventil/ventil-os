import { expect, type Page } from '@playwright/test';

export async function openMachineDetails(page: Page, machineName: RegExp = /Bambu Lab X1C/i): Promise<string> {
  await page.goto('/hub/fab-lab');

  const machineCard = page.getByRole('button', { name: machineName }).first();
  await expect(machineCard).toBeVisible();
  await machineCard.click();

  await expect(page).toHaveURL(/\/hub\/fab-lab\/[^/?]+/, { timeout: 15_000 });
  await expect(page.getByRole('dialog', { name: machineName })).toBeVisible({ timeout: 15_000 });

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
  const machineDialog = page.getByRole('dialog', { name: machineName });

  const slotButton = machineDialog
    .locator('button[aria-label*="Réserver à"]:not([disabled]), button[aria-label*="Reserve at"]:not([disabled])')
    .first();

  await expect(slotButton).toBeVisible();
  await slotButton.click();

  await expect(page).toHaveURL(/\/hub\/fab-lab\/[^/]+\/reservation/, { timeout: 15_000 });
  await expect(page.getByRole('dialog', { name: machineName })).toBeVisible({ timeout: 15_000 });

  return machineId;
}
