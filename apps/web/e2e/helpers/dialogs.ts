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

type OpenRouteModalArgs = {
  page: Page;
  trigger: Locator;
  dialogName?: string | RegExp;
  expectedUrl: RegExp;
};

export async function openRouteModalFromTrigger({
  page,
  trigger,
  dialogName,
  expectedUrl
}: OpenRouteModalArgs): Promise<Locator> {
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(page).toHaveURL(expectedUrl, { timeout: 15_000 });
  return expectDialog(page, dialogName);
}

export async function closeDialogWithEscape(page: Page, _name?: string | RegExp): Promise<void> {
  void _name;
  const initialVisibleDialogCount = await getVisibleDialogCount(page);
  if (initialVisibleDialogCount === 0) {
    throw new Error('No visible dialog found before attempting Escape.');
  }

  const expectedVisibleDialogCount = initialVisibleDialogCount - 1;

  for (let attempt = 1; attempt <= DIALOG_CLOSE_ATTEMPTS; attempt += 1) {
    await pressEscape(page);

    try {
      await expect
        .poll(() => getVisibleDialogCount(page), { timeout: DIALOG_CLOSE_TIMEOUT_MS })
        .toBe(expectedVisibleDialogCount);
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
