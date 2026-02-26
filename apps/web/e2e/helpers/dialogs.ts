import { expect, type Locator, type Page } from '@playwright/test';
import { pressEscape } from './keyboard';

const DIALOG_CLOSE_ATTEMPTS = 3;

const getNamedDialogLocator = (page: Page, name?: string | RegExp): Locator =>
  (name ? page.getByRole('dialog', { name }) : page.getByRole('dialog')).last();

export async function expectDialog(page: Page, name?: string | RegExp): Promise<Locator> {
  const dialog = getNamedDialogLocator(page, name);
  await expect(dialog).toBeVisible();
  return dialog;
}

export async function closeDialogWithEscape(page: Page, name?: string | RegExp): Promise<void> {
  for (let attempt = 1; attempt <= DIALOG_CLOSE_ATTEMPTS; attempt += 1) {
    const dialog = await expectDialog(page, name);
    await pressEscape(page);

    try {
      await expect(dialog).not.toBeVisible({ timeout: 1_000 });
      return;
    } catch (error) {
      if (attempt === DIALOG_CLOSE_ATTEMPTS) {
        throw error;
      }
    }
  }
}
