import { expect, type Locator, type Page } from '@playwright/test';
import { pressEscape } from './keyboard';

const DIALOG_CLOSE_ATTEMPTS = 3;
const DIALOG_CLOSE_TIMEOUT_MS = 1_000;

const getNamedDialogLocator = (page: Page, name?: string | RegExp): Locator =>
  (name ? page.getByRole('dialog', { name }) : page.getByRole('dialog')).last();

const getVisibleDialogs = (page: Page): Locator => page.locator('[role="dialog"]:visible');

const getVisibleDialogCount = async (page: Page): Promise<number> => getVisibleDialogs(page).count();

export async function expectDialog(page: Page, name?: string | RegExp): Promise<Locator> {
  const dialog = getNamedDialogLocator(page, name);
  await expect(dialog).toBeVisible();
  return dialog;
}

export async function closeDialogWithEscape(page: Page, name?: string | RegExp): Promise<void> {
  const initialVisibleDialogCount = await getVisibleDialogCount(page);
  if (initialVisibleDialogCount === 0) {
    throw new Error('No visible dialog found before attempting Escape.');
  }

  const expectedVisibleDialogCount = initialVisibleDialogCount - 1;

  for (let attempt = 1; attempt <= DIALOG_CLOSE_ATTEMPTS; attempt += 1) {
    await expectDialog(page, name);
    await pressEscape(page);

    try {
      await expect.poll(() => getVisibleDialogCount(page), { timeout: DIALOG_CLOSE_TIMEOUT_MS }).toBe(
        expectedVisibleDialogCount
      );
      return;
    } catch (error) {
      const currentVisibleDialogCount = await getVisibleDialogCount(page);
      if (currentVisibleDialogCount < expectedVisibleDialogCount) {
        throw new Error(
          `Escape closed more than one dialog (expected ${expectedVisibleDialogCount}, got ${currentVisibleDialogCount}).`
        );
      }

      if (attempt === DIALOG_CLOSE_ATTEMPTS) {
        throw error;
      }
    }
  }
}
