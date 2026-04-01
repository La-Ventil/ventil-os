import { expect, test } from '../../fixtures/test';
import { clickQuickAction, openRowQuickActions } from '../../helpers/quick-actions';
import { expectLocatorImageResolves } from '../../helpers/uploads';

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
  test('admin can create a machine without an image', async ({ page, loginAs }) => {
    const machineName = `PW machine ${Date.now()}`;

    await loginAs('globalAdmin');
    await page.goto('/hub/admin/machines/create');

    await page.locator('input[name="name"]').fill(machineName);
    await page.locator('input[name="description"]').fill('Created without an image for end-to-end coverage.');

    await page.getByRole('button', { name: /save/i }).click();

    await expect(page).toHaveURL(/\/hub\/admin\/machines$/, { timeout: 15_000 });
    await expect(page.getByRole('row', { name: new RegExp(machineName, 'i') })).toBeVisible();
  });

  test('admin can create a machine from the create form', async ({ page, loginAs }) => {
    const machineName = createUniqueMachineName();

    await loginAs('globalAdmin');
    await page.goto('/hub/admin/machines/create');

    await page.locator('input[name="name"]').fill(machineName);
    await page.locator('input[name="description"]').fill('Created by Playwright for end-to-end coverage.');
    await page.locator('input[type="file"][name="imageFile"]').setInputFiles(tinyPngFile);

    await page.getByRole('button', { name: /save/i }).click();

    await expect(page).toHaveURL(/\/hub\/admin\/machines$/);
    const createdRow = page.getByRole('row', { name: new RegExp(machineName, 'i') });
    await expect(createdRow).toBeVisible();
    await expectLocatorImageResolves(page, createdRow.locator('img').first());
  });

  test('admin can create a machine with an open badge requirement', async ({ page, loginAs }) => {
    const machineName = createUniqueMachineName();

    await loginAs('globalAdmin');
    await page.goto('/hub/admin/machines/create');

    await page.locator('input[name="name"]').fill(machineName);
    await page.locator('input[name="description"]').fill('Created with an open badge requirement.');

    await page.getByRole('checkbox', { name: /require an open badge/i }).click();

    const badgeAutocomplete = page.getByRole('combobox', { name: /^open badge$/i });
    await badgeAutocomplete.fill('Impression 3D');
    await page.getByRole('option', { name: /Impression 3D Bambu Lab/i }).click();

    await page.getByRole('combobox', { name: /minimum level/i }).click();
    await page.getByRole('option', { name: /^1\s*-/i }).click();

    await page.getByRole('button', { name: /save/i }).click();

    await expect(page).toHaveURL(/\/hub\/admin\/machines$/);

    const row = page.getByRole('row', { name: new RegExp(machineName, 'i') });
    await expect(row).toBeVisible();

    const menu = await openRowQuickActions(page, row, /administration/i);
    await clickQuickAction(menu, /edit/i);

    await expect(page).toHaveURL(/\/hub\/admin\/machines\/[^/]+\/edit$/);
    await expect(page.getByRole('combobox', { name: /^open badge$/i })).toHaveValue(/Impression 3D Bambu Lab/i);
    await expect(page.getByRole('combobox', { name: /minimum level/i })).toContainText(/1\s*-/i);
  });

  test('admin can edit a machine from row quick actions', async ({ page, loginAs }) => {
    const updatedName = `Laserbox ${Date.now()}`;

    await loginAs('globalAdmin');
    await page.goto('/hub/admin/machines');

    const row = page.getByRole('row', { name: /Laserbox/i });
    const menu = await openRowQuickActions(page, row, /administration/i);
    await clickQuickAction(menu, /edit/i);

    await expect(page).toHaveURL(/\/hub\/admin\/machines\/[^/]+\/edit$/);

    await page.locator('input[name="name"]').fill(updatedName);
    await page.locator('input[name="description"]').fill('Updated by Playwright for end-to-end coverage.');

    await page.getByRole('button', { name: /save/i }).click();

    await expect(page).toHaveURL(/\/hub\/admin\/machines$/);
    await expect(page.getByRole('row', { name: new RegExp(updatedName, 'i') })).toBeVisible();
  });
});
