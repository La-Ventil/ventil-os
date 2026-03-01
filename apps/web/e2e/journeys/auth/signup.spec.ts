import { expect, test } from '../../fixtures/test';

const createUniqueSignupEmail = (): string => `playwright.signup.${Date.now()}@ventil.local`;

test.describe('Signup journey', () => {
  test('visitor can register, see success feedback, and return to login', async ({ page }) => {
    const email = createUniqueSignupEmail();

    await page.goto('/signup');

    await page.locator('input[name="firstName"]').fill('Playwright');
    await page.locator('input[name="lastName"]').fill('Signup');
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill('Valid123');
    await page.locator('input[name="passwordConfirmation"]').fill('Valid123');
    await page.locator('input[name="profile"][value="teacher"]').check();
    await page.locator('input[name="terms"]').check();

    await page.locator('form button[type="submit"]').click();

    await expect(page.getByRole('alert')).toBeVisible();

    const loginButton = page.getByRole('link', { name: /se connecter|sign in/i });
    await expect(loginButton).toBeVisible();
    await loginButton.click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible();
  });
});
