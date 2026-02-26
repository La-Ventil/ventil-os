import { expect, type Locator, type Page } from '@playwright/test';

export async function pressEscape(page: Page): Promise<void> {
  await page.keyboard.press('Escape');
}

export async function expectFocused(locator: Locator): Promise<void> {
  await expect(locator).toBeFocused();
}

export async function tabTo(page: Page, target: Locator, maxTabs = 30): Promise<void> {
  for (let index = 0; index < maxTabs; index += 1) {
    if (await target.evaluate((node) => node === document.activeElement)) {
      return;
    }
    await page.keyboard.press('Tab');
  }

  throw new Error(`Unable to focus target within ${maxTabs} Tab presses.`);
}
