import { expect, type Locator, type Page } from '@playwright/test';
import { pressEscape } from './keyboard';

export async function expectDialog(page: Page, name?: string | RegExp): Promise<Locator> {
  const dialog = name ? page.getByRole('dialog', { name }) : page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  return dialog;
}

export async function closeDialogWithEscape(page: Page, name?: string | RegExp): Promise<void> {
  const dialog = await expectDialog(page, name);
  await pressEscape(page);
  await expect(dialog).not.toBeVisible();
}
