import { expect, type Locator, type Page } from '@playwright/test';

export async function openRowQuickActions(
  page: Page,
  row: Locator,
  buttonLabel = /administration|actions|options/i
): Promise<Locator> {
  const button = row.getByRole('button', { name: buttonLabel });
  await button.click();

  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  return menu;
}

export async function clickQuickAction(menu: Locator, actionLabel: string | RegExp): Promise<void> {
  await menu.getByRole('menuitem', { name: actionLabel }).click();
}
