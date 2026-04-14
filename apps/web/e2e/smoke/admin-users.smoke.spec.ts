import { expect, test } from '../fixtures/test';

test.describe('Admin users smoke', () => {
  test('global admin can open the users administration page', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    await page.goto('/hub/admin/users');

    const table = page.getByRole('table');
    await expect(page).toHaveURL(/\/hub\/admin\/users/);
    await expect(table).toBeVisible();
    await expect(
      table
        .getByRole('row')
        .filter({ hasText: /student@ventil\.local/i })
        .first()
    ).toBeVisible();
  });
});
