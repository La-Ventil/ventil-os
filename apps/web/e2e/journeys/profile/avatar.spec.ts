import { expect, test } from '../../fixtures/test';
import { closeDialogWithEscape, expectDialog, openRouteModalFromTrigger } from '../../helpers/dialogs';

// The avatar editor is the only modal reached through an intercepting route, so its deep link is what
// distinguishes it: /hub/profile/avatar must render the profile behind the dialog, not replace it.
const AVATAR_DIALOG = /change avatar/i;
const AVATAR_URL = /\/hub\/profile\/avatar$/;
const PROFILE_URL = /\/hub\/profile$/;

const getAvatarLink = (page: import('@playwright/test').Page) => page.getByRole('link', { name: /edit avatar/i });

test.describe('Profile avatar journeys', () => {
  test('opening the editor from the profile keeps the profile behind the dialog', async ({ page, loginAs }) => {
    await loginAs('student');
    await page.goto('/hub/profile');

    const dialog = await openRouteModalFromTrigger({
      page,
      trigger: getAvatarLink(page),
      dialogName: AVATAR_DIALOG,
      expectedUrl: AVATAR_URL
    });

    await expect(dialog.getByRole('button', { name: /save/i })).toBeVisible();
    // The open dialog hides the rest of the app from the accessibility tree, so check the DOM directly.
    await expect(page.locator('a[href="/hub/profile/avatar"]')).toHaveCount(1);
  });

  test('the avatar URL opens the editor on a direct visit', async ({ page, loginAs }) => {
    await loginAs('student');
    await page.goto('/hub/profile/avatar');

    await expectDialog(page, AVATAR_DIALOG);
    // The open dialog hides the rest of the app from the accessibility tree, so check the DOM directly.
    await expect(page.locator('a[href="/hub/profile/avatar"]')).toHaveCount(1);
  });

  test('closing the editor returns to the profile and it can be reopened', async ({ page, loginAs }) => {
    await loginAs('student');
    await page.goto('/hub/profile');

    await openRouteModalFromTrigger({
      page,
      trigger: getAvatarLink(page),
      dialogName: AVATAR_DIALOG,
      expectedUrl: AVATAR_URL
    });
    await closeDialogWithEscape(page);
    await expect(page).toHaveURL(PROFILE_URL);

    await openRouteModalFromTrigger({
      page,
      trigger: getAvatarLink(page),
      dialogName: AVATAR_DIALOG,
      expectedUrl: AVATAR_URL
    });
  });
});
