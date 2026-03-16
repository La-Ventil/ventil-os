import { expect, test } from '../../fixtures/test';

const createUniqueSignupEmail = (): string => `playwright.signup.${Date.now()}@ventil.local`;
const overlongNameWithEmoji = 'PlaywrightNameThatIsMuchTooLongForTheFieldLimit🙂';

test.describe('Signup journey', () => {
  test('visitor can register and is redirected to home with a success notice', async ({ page }) => {
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

    await expect(page).toHaveURL(/\/\?notice=signup-success$/, { timeout: 15_000 });
    await expect(
      page
        .getByRole('alert')
        .filter({ hasText: /inscription réussie|signup successful|vérifiez votre email/i })
        .first()
    ).toContainText(/inscription réussie|signup successful|vérifiez votre email/i);
  });

  test('privacy policy dialog preserves entered values when opened and closed', async ({ page }) => {
    await page.goto('/signup');

    await page.locator('input[name="firstName"]').fill('Alice');
    await page.locator('input[name="lastName"]').fill('Martin');
    await page.locator('input[name="email"]').fill(createUniqueSignupEmail());
    await page.locator('input[name="password"]').fill('Valid123');
    await page.locator('input[name="passwordConfirmation"]').fill('Valid123');

    await page.getByRole('button', { name: /politique de confidentialité|privacy policy/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: /retour|back/i }).click();
    await expect(dialog).toHaveCount(0);

    await expect(page.locator('input[name="firstName"]')).toHaveValue('Alice');
    await expect(page.locator('input[name="lastName"]')).toHaveValue('Martin');
    await expect(page.locator('input[name="email"]')).toHaveValue(/playwright\.signup\./);
    await expect(page.locator('input[name="password"]')).toHaveValue('Valid123');
    await expect(page.locator('input[name="passwordConfirmation"]')).toHaveValue('Valid123');
  });

  test('member profile auto-selects Premiere when education level becomes required', async ({ page }) => {
    await page.goto('/signup');

    await page.locator('input[name="profile"][value="member"]').check();

    const educationLevelInput = page.locator('input[name="educationLevel"]');
    await expect(educationLevelInput).toHaveValue('premiere');
    await expect(page.getByRole('combobox', { name: /niveau scolaire/i })).toContainText(/première/i);
  });

  test('first name live validation can expose both max-length and emoji errors together', async ({ page }) => {
    await page.goto('/signup');

    const firstName = page.locator('input[name="firstName"]');
    await firstName.fill(overlongNameWithEmoji);
    await firstName.blur();

    await expect(page.getByText(/prénom ou le nom ne doit pas dépasser 40 caractères/i)).toBeVisible();
    await expect(
      page.getByText(/prénom ou le nom ne doit pas contenir d’emoji|prénom ou le nom ne doit pas contenir d'emoji/i)
    ).toBeVisible();
  });
});
