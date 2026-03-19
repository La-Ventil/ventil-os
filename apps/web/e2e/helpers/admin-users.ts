import { expect, type Locator, type Page } from '@playwright/test';
import { openRouteModalFromTrigger } from './dialogs';
import { clickQuickAction, openRowQuickActions } from './quick-actions';

export const getAdminUsersRowByEmail = (page: Page, email: string): Locator =>
  page.getByRole('table').getByRole('row').filter({ hasText: email }).first();

export async function openAdminUserEditPage(page: Page, email: string): Promise<void> {
  await page.goto('/hub/admin/users');

  const table = page.getByRole('table');
  await expect(table).toBeVisible();

  const row = getAdminUsersRowByEmail(page, email);
  await expect(row).toBeVisible();

  const menu = await openRowQuickActions(page, row, /manage/i);
  await clickQuickAction(menu, /edit/i);

  await page.waitForURL(/\/hub\/admin\/users\/[^/]+\/edit$/);
  await expect(page.locator('form')).toBeVisible();
}

export async function openAdminUserOpenBadgesPage(page: Page, email: string): Promise<void> {
  await page.goto('/hub/admin/users');

  const table = page.getByRole('table');
  await expect(table).toBeVisible();

  const row = getAdminUsersRowByEmail(page, email);
  await expect(row).toBeVisible();

  const menu = await openRowQuickActions(page, row, /manage/i);
  await clickQuickAction(menu, /open badges?/i);

  await page.waitForURL(/\/hub\/admin\/users\/[^/]+\/open-badges$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
}

export async function openAdminUserBadgeAssignModal(page: Page): Promise<void> {
  const trigger = page.getByRole('link', { name: /assign an open badge/i });
  const href = await trigger.getAttribute('href');
  if (!href) {
    throw new Error('Assign open badge link href is missing on the user open badges page.');
  }

  await openRouteModalFromTrigger({
    page,
    trigger,
    expectedUrl: new RegExp(`${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`),
    dialogName: /assign an open badge/i
  });
}
