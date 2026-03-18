import { expect, type Page } from '@playwright/test';

export async function openAdminOpenBadgeAssignModal(
  page: Page,
  badgeName: RegExp = /Impression 3D Bambu Lab/i
): Promise<void> {
  await page.goto('/hub/admin/open-badges');

  const table = page.getByRole('table');
  await expect(table).toBeVisible();

  const row = table.getByRole('row').filter({ hasText: badgeName }).first();
  await expect(row).toBeVisible();

  await row.getByRole('button', { name: /assign/i }).click();
  const dialog = page.getByRole('dialog', { name: /assign an open badge/i });
  await expect(dialog).toBeVisible();
}
