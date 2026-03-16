import { test, expect } from '../../fixtures/test';
import { clickQuickAction, openRowQuickActions } from '../../helpers/quick-actions';

test.describe('Auth journey', () => {
  test('student can sign in and reach profile hub', async ({ page, loginAs }) => {
    await loginAs('student');

    await expect(page).toHaveURL(/\/hub\/profile/);
    await expect(page.getByRole('heading', { name: /student/i })).toBeVisible();
    await expect(page.getByText(/open badges (obtenus|earned)/i)).toBeVisible();
  });

  test('blocked user sees a specific sign-in error message', async ({ page, loginAs, seedUsers }) => {
    await loginAs('globalAdmin');
    await page.goto('/hub/admin/users');

    const table = page.getByRole('table');
    const row = table.getByRole('row').filter({ hasText: seedUsers.student.email }).first();
    const statusCell = row.getByRole('cell').nth(8);
    await expect(row).toBeVisible();

    const blockMenu = await openRowQuickActions(page, row, /gérer|manage/i);
    await clickQuickAction(blockMenu, /bloquer|block/i);
    await expect(statusCell).toHaveText(/bloqué|blocked/i, { timeout: 10_000 });

    await page.context().clearCookies();
    await page.goto('/login');
    await page.locator('input[name="email"]').fill(seedUsers.student.email);
    await page.locator('input[name="password"]').fill(seedUsers.student.password);
    await page.locator('form button[type="submit"]').click();

    await expect(page).toHaveURL(/\/login/);
    await expect(
      page.getByRole('alert').filter({ hasText: /compte a été bloqué|account has been blocked/i })
    ).toHaveText(/compte a été bloqué|account has been blocked/i);

    await loginAs('globalAdmin');
    await page.goto('/hub/admin/users');

    const tableAfterBlockedAttempt = page.getByRole('table');
    const rowAfterBlockedAttempt = tableAfterBlockedAttempt
      .getByRole('row')
      .filter({ hasText: seedUsers.student.email })
      .first();
    const unblockMenu = await openRowQuickActions(page, rowAfterBlockedAttempt, /gérer|manage/i);
    await clickQuickAction(unblockMenu, /débloquer|unblock/i);
    await expect(rowAfterBlockedAttempt.getByRole('cell').nth(8)).toHaveText(/actif|active/i, { timeout: 10_000 });
  });

  test('already signed-in user is redirected to login once blocked', async ({ page, browser, loginAs, seedUsers }) => {
    await loginAs('student');
    await expect(page).toHaveURL(/\/hub\/profile/);

    const origin = new URL(page.url()).origin;
    const adminContext = await browser.newContext({ baseURL: origin });
    const adminPage = await adminContext.newPage();

    try {
      await adminPage.goto('/login');
      await adminPage.locator('input[name="email"]').fill(seedUsers.globalAdmin.email);
      await adminPage.locator('input[name="password"]').fill(seedUsers.globalAdmin.password);
      await adminPage.locator('form button[type="submit"]').click();
      await adminPage.waitForURL(/\/hub\/profile/, { timeout: 15_000 });

      await adminPage.goto('/hub/admin/users');
      const table = adminPage.getByRole('table');
      const row = table.getByRole('row').filter({ hasText: seedUsers.student.email }).first();
      const statusCell = row.getByRole('cell').nth(8);

      const blockMenu = await openRowQuickActions(adminPage, row, /gérer|manage/i);
      await clickQuickAction(blockMenu, /bloquer|block/i);
      await expect(statusCell).toHaveText(/bloqué|blocked/i, { timeout: 10_000 });
    } finally {
      await adminContext.close();
    }

    await page.reload();
    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
  });
});
