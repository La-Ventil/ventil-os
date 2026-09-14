import type { Page } from '@playwright/test';
import { expect, test } from '../../fixtures/test';

const LEVEL_TITLE_TOO_LONG = /level title must be at most 35 characters/i;
const LEVEL_TITLE = 'input[name="levels[0].title"]';

/**
 * Before hydration the form still submits natively, and the server answers with a re-rendered page:
 * errors show up, but no client code runs. `noValidate` is set by the client, so it marks hydration.
 */
const waitForHydratedForm = async (page: Page): Promise<void> => {
  await expect(page.locator('form')).toHaveAttribute('novalidate', '');
};

test.describe('Open badge level validation', () => {
  test('a level the admin never filled stays silent until submit', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    await page.goto('/hub/admin/open-badges/create');
    await waitForHydratedForm(page);

    const levelTitle = page.locator(LEVEL_TITLE);
    await levelTitle.click();
    await levelTitle.blur();

    await expect(levelTitle).toHaveAttribute('aria-invalid', 'false');
  });

  test('the level title reports its own length as the admin types', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    await page.goto('/hub/admin/open-badges/create');
    await waitForHydratedForm(page);

    const levelTitle = page.locator(LEVEL_TITLE);
    await levelTitle.fill('x'.repeat(36));

    await expect(page.getByText(LEVEL_TITLE_TOO_LONG)).toBeVisible();
    await expect(levelTitle).toHaveAttribute('aria-invalid', 'true');

    await levelTitle.fill('A reasonable level title');

    await expect(levelTitle).toHaveAttribute('aria-invalid', 'false');
  });

  test('submitting an empty form focuses the first rejected field and clears its error once fixed', async ({
    page,
    loginAs
  }) => {
    await loginAs('globalAdmin');
    await page.goto('/hub/admin/open-badges/create');
    await waitForHydratedForm(page);

    await page.getByRole('button', { name: /save/i }).click();

    // The summary sits at the top of a long form: focus is what actually points at the problem.
    await expect(page.locator('input[name="name"]')).toBeFocused();

    const levelTitle = page.locator(LEVEL_TITLE);
    await expect(levelTitle).toHaveAttribute('aria-invalid', 'true');

    await levelTitle.fill('Level 1');

    // The submit error described the value that was submitted: editing the field must clear it.
    await expect(levelTitle).toHaveAttribute('aria-invalid', 'false');
  });
});
