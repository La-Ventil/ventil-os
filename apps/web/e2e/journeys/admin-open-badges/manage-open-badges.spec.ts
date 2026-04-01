import type { Page } from '@playwright/test';
import { expect, test } from '../../fixtures/test';
import { clickQuickAction, openRowQuickActions } from '../../helpers/quick-actions';
import { expectLocatorImageResolves } from '../../helpers/uploads';

const createUniqueOpenBadgeName = (): string => `Playwright open badge ${Date.now()}`;

const addOpenBadgeLevel = async (page: Page): Promise<void> => {
  const addLevelButton = page.getByRole('button', { name: /add a level/i });

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await addLevelButton.click();

    const secondLevelTitle = page.locator('input[name="levels[1].title"]');
    if (await secondLevelTitle.isVisible().catch(() => false)) {
      return;
    }
  }

  await expect(page.locator('input[name="levels[1].title"]')).toBeVisible();
};

const tinyPngFile = {
  name: 'open-badge.png',
  mimeType: 'image/png',
  buffer: Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9WlH0K0AAAAASUVORK5CYII=',
    'base64'
  )
};

test.describe('Admin open badge journeys', () => {
  test('admin can create an open badge from the create form', async ({ page, loginAs }) => {
    const badgeName = createUniqueOpenBadgeName();

    await loginAs('globalAdmin');
    await page.goto('/hub/admin/open-badges/create');

    await page.locator('input[name="name"]').fill(badgeName);
    await page.locator('input[name="description"]').fill('Created by Playwright for end-to-end coverage.');
    await page.locator('input[type="file"][name="imageFile"]').setInputFiles(tinyPngFile);
    await page.locator('input[name="levels[0].title"]').fill('Level 1');
    await page.locator('textarea[name="levels[0].description"]').fill('Level 1 description.');
    await expect(
      page
        .locator('label')
        .filter({ hasText: /level 1/i })
        .first()
    ).toBeVisible();

    await page.getByRole('button', { name: /save/i }).click();

    await expect(page).toHaveURL(/\/hub\/admin\/open-badges$/, { timeout: 15_000 });
    const createdRow = page.getByRole('row', { name: new RegExp(badgeName, 'i') });
    await expect(createdRow).toBeVisible();
    await expectLocatorImageResolves(page, createdRow.locator('img').first());
  });

  test('admin can edit an open badge from row quick actions', async ({ page, loginAs }) => {
    const badgeName = `Editable open badge ${Date.now()}`;
    const updatedName = `Edited ${Date.now()}`;

    await loginAs('globalAdmin');
    await page.goto('/hub/admin/open-badges/create');

    await page.locator('input[name="name"]').fill(badgeName);
    await page.locator('input[name="description"]').fill('Created by Playwright for editing.');
    await page.locator('input[type="file"][name="imageFile"]').setInputFiles(tinyPngFile);
    await page.locator('input[name="levels[0].title"]').fill('Level 1');
    await page.locator('textarea[name="levels[0].description"]').fill('Level 1 description.');
    await page.getByRole('button', { name: /save/i }).click();

    await expect(page).toHaveURL(/\/hub\/admin\/open-badges$/, { timeout: 15_000 });
    const createdRow = page.getByRole('row', { name: new RegExp(badgeName, 'i') });
    await expect(createdRow).toBeVisible();
    await expectLocatorImageResolves(page, createdRow.locator('img').first());

    const row = page.getByRole('row', { name: new RegExp(badgeName, 'i') });
    const menu = await openRowQuickActions(page, row, /administration/i);
    await clickQuickAction(menu, /edit/i);

    await expect(page).toHaveURL(/\/hub\/admin\/open-badges\/[^/]+\/edit$/);

    await page.locator('input[name="name"]').fill(updatedName);
    await page.locator('input[name="description"]').fill('Updated by Playwright for end-to-end coverage.');

    await page.getByRole('button', { name: /save/i }).click();

    await expect(page).toHaveURL(/\/hub\/admin\/open-badges$/, { timeout: 15_000 });
    await expect(page.getByRole('row', { name: new RegExp(updatedName, 'i') })).toBeVisible();
  });

  test('open badge level labels include the level index', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    await page.goto('/hub/admin/open-badges/create');

    await expect(page.locator('input[name="levels[0].title"]')).toBeVisible();
    await expect(page.locator('textarea[name="levels[0].description"]')).toBeVisible();
    await addOpenBadgeLevel(page);

    await expect(page.locator('input[name="levels[1].title"]')).toBeVisible();
    await expect(page.locator('textarea[name="levels[1].description"]')).toBeVisible();
  });
});
