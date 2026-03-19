import { expect, type Page } from '@playwright/test';
import { openRouteModalFromTrigger } from './dialogs';

export async function openAdminOpenBadgeAssignModalById(page: Page, badgeId: string): Promise<void> {
  const href = `/hub/admin/open-badges/${badgeId}`;
  await page.goto(href);
  await expect(page).toHaveURL(new RegExp(`${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), {
    timeout: 30_000
  });
  await expect(page.getByRole('dialog').last()).toBeVisible({ timeout: 30_000 });
}

export async function openAdminOpenBadgeAssignModal(
  page: Page,
  badgeName: RegExp = /Impression 3D Bambu Lab/i
): Promise<void> {
  await page.goto('/hub/admin/open-badges');

  const table = page.getByRole('table');
  await expect(table).toBeVisible();

  const row = table.getByRole('row').filter({ hasText: badgeName }).first();
  await expect(row).toBeVisible();

  const assignLink = row.getByRole('link', { name: /assign/i });
  const href = await assignLink.getAttribute('href');
  if (!href) {
    throw new Error('Assign link href is missing for open badge row.');
  }

  await openRouteModalFromTrigger({
    page,
    trigger: assignLink,
    expectedUrl: new RegExp(`${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`),
    dialogName: /assign an open badge/i
  });
}
