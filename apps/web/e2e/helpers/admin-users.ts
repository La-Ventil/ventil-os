import { expect, type Locator, type Page } from '@playwright/test';
import { clickQuickAction, openRowQuickActions } from './quick-actions';

export const getAdminUsersRowByEmail = (page: Page, email: string): Locator =>
  page.getByRole('table').getByRole('row').filter({ hasText: email }).first();

export async function openAdminUserEditPage(page: Page, email: string): Promise<void> {
  await page.goto('/hub/admin/users');

  const table = page.getByRole('table');
  await expect(table).toBeVisible();

  const row = getAdminUsersRowByEmail(page, email);
  await expect(row).toBeVisible();

  const menu = await openRowQuickActions(page, row, /gérer|manage/i);
  await clickQuickAction(menu, /modifier|edit/i);

  await page.waitForURL(/\/hub\/admin\/users\/[^/]+\/edit$/);
  await expect(page.locator('form')).toBeVisible();
}
