import { expect, type Locator, type Page } from '@playwright/test';

export async function expectImageUrlResolves(page: Page, imageUrl: string): Promise<void> {
  const response = await page.request.get(imageUrl);
  expect(response.ok(), `Expected uploaded image to resolve successfully: ${imageUrl}`).toBeTruthy();
  expect(response.status(), `Expected uploaded image to return 200: ${imageUrl}`).toBe(200);
  const contentType = response.headers()['content-type'] ?? '';
  expect(contentType, `Expected uploaded image content-type for ${imageUrl}`).toMatch(/^image\//i);
}

export async function expectLocatorImageResolves(page: Page, locator: Locator): Promise<string> {
  await expect(locator).toBeVisible();
  const imageUrl = await locator.getAttribute('src');

  if (!imageUrl) {
    throw new Error('Expected image element to expose a src attribute.');
  }

  await expectImageUrlResolves(page, imageUrl);
  return imageUrl;
}
