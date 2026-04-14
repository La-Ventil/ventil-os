import { expect, test } from '../fixtures/test';

test.describe('Auth smoke', () => {
  test('student can sign in and load the profile hub', async ({ page, loginAs }) => {
    await loginAs('student');

    await expect(page).toHaveURL(/\/hub\/profile/);
    await expect(page.getByRole('heading', { name: /student/i })).toBeVisible();
    await expect(page.getByText(/open badges earned/i)).toBeVisible();
  });
});
