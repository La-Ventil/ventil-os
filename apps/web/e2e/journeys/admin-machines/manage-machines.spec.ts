import { expect, test } from '../../fixtures/test';
import { clickQuickAction, openRowQuickActions } from '../../helpers/quick-actions';

const createUniqueMachineName = (): string => `Playwright machine ${Date.now()}`;

const tinyPngFile = {
  name: 'machine.png',
  mimeType: 'image/png',
  buffer: Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9WlH0K0AAAAASUVORK5CYII=',
    'base64'
  )
};

test.describe('Admin machine journeys', () => {
  test('admin can create a machine from the create form', async ({ page, loginAs }) => {
    const machineName = createUniqueMachineName();

    await loginAs('globalAdmin');
    await page.goto('/hub/admin/machines/create');

    await page.locator('input[name="name"]').fill(machineName);
    await page.locator('input[name="description"]').fill('Created by Playwright for end-to-end coverage.');
    await page.locator('input[type="file"][name="imageFile"]').setInputFiles(tinyPngFile);

    await page.getByRole('button', { name: /enregistrer|save/i }).click();

    await expect(page).toHaveURL(/\/hub\/admin\/machines$/);
    await expect(page.getByRole('row', { name: new RegExp(machineName, 'i') })).toBeVisible();
  });

  test('admin can edit a machine from row quick actions', async ({ page, loginAs }) => {
    const updatedName = `Laserbox ${Date.now()}`;

    await loginAs('globalAdmin');
    await page.goto('/hub/admin/machines');

    const row = page.getByRole('row', { name: /Laserbox/i });
    const menu = await openRowQuickActions(page, row, /administration|manage/i);
    await clickQuickAction(menu, /modifier|edit/i);

    await expect(page).toHaveURL(/\/hub\/admin\/machines\/[^/]+\/edit$/);

    await page.locator('input[name="name"]').fill(updatedName);
    await page.locator('input[name="description"]').fill('Updated by Playwright for end-to-end coverage.');

    await page.getByRole('button', { name: /enregistrer|save/i }).click();

    await expect(page).toHaveURL(/\/hub\/admin\/machines$/);
    await expect(page.getByRole('row', { name: new RegExp(updatedName, 'i') })).toBeVisible();
  });
});
