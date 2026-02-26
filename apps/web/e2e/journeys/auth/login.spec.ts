import { test, expect } from '../../fixtures/test';

test.describe('Auth journey', () => {
  test('student can sign in and reach profile hub', async ({ page, loginAs }) => {
    await loginAs('student');

    await expect(page).toHaveURL(/\/hub\/profile/);
    await expect(page.getByRole('heading', { name: /student/i })).toBeVisible();
    await expect(page.getByText(/open badges (obtenus|earned)/i)).toBeVisible();
  });
});
