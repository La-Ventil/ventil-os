import { expect, type Locator, type Page } from '@playwright/test';

export async function openRowQuickActions(
  page: Page,
  row: Locator,
  buttonLabel = /administration|actions|options/i
): Promise<Locator> {
  const button = row.getByRole('button', { name: buttonLabel });
  await expect(button).toBeVisible();

  const buttonId = await button.getAttribute('id');
  if (!buttonId) {
    throw new Error('Quick actions button did not expose an id attribute.');
  }

  await button.click();

  const stableButton = page.locator(`[id="${buttonId}"]`);
  await expect(stableButton).toHaveAttribute('aria-expanded', 'true');

  const menuId = await stableButton.getAttribute('aria-controls');
  if (!menuId) {
    throw new Error('Quick actions button did not expose aria-controls after opening.');
  }

  const menuRoot = page.locator(`[id="${menuId}"]`);
  await expect(menuRoot).toBeVisible();

  const menu = menuRoot.getByRole('menu');
  await expect(menu).toBeVisible();
  return menu;
}

export async function clickQuickAction(menu: Locator, actionLabel: string | RegExp): Promise<void> {
  await menu.getByRole('menuitem', { name: actionLabel }).click();
}
