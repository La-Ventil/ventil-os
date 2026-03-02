import { expect, test } from '../../fixtures/test';
import { clickQuickAction, openRowQuickActions } from '../../helpers/quick-actions';

const createUniqueOpenBadgeName = (): string => `Playwright open badge ${Date.now()}`;

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

    await page.getByRole('button', { name: /enregistrer|save/i }).click();

    await expect(page).toHaveURL(/\/hub\/admin\/open-badges$/);
    await expect(page.getByRole('row', { name: new RegExp(badgeName, 'i') })).toBeVisible();
  });

  test('admin can edit an open badge from row quick actions', async ({ page, loginAs }) => {
    const updatedName = `Impression 3D Bambu Lab ${Date.now()}`;

    await loginAs('globalAdmin');
    await page.goto('/hub/admin/open-badges');

    const row = page.getByRole('row', { name: /Impression 3D Bambu Lab/i });
    const menu = await openRowQuickActions(page, row, /administration|manage/i);
    await clickQuickAction(menu, /modifier|edit/i);

    await expect(page).toHaveURL(/\/hub\/admin\/open-badges\/[^/]+\/edit$/);

    await page.locator('input[name="name"]').fill(updatedName);
    await page.locator('input[name="description"]').fill('Updated by Playwright for end-to-end coverage.');

    await page.getByRole('button', { name: /enregistrer|save/i }).click();

    await expect(page).toHaveURL(/\/hub\/admin\/open-badges$/);
    await expect(page.getByRole('row', { name: new RegExp(updatedName, 'i') })).toBeVisible();
  });
});
