import { ActivityStatus as PrismaActivityStatus } from '@prisma/client';
import { expect, test } from '../../fixtures/test';
import { getOpenBadgeTestRepository } from '../../helpers/open-badge-test-repository';

const awardedBadgeName = 'Impression 3D Bambu Lab';

test.describe('User open badges journeys', () => {
  test('inactive open badges disappear from the earned badges tab', async ({
    page,
    loginAs,
    seedUsers,
    workerWebRuntime
  }) => {
    await loginAs('globalAdmin');
    await getOpenBadgeTestRepository(workerWebRuntime?.dbSlot).awardBadgeToUserByName(
      seedUsers.globalAdmin.email,
      awardedBadgeName
    );
    await page.goto('/hub/open-badge/mine');

    await expect(page.getByText(awardedBadgeName, { exact: true })).toBeVisible();

    await getOpenBadgeTestRepository(workerWebRuntime?.dbSlot).setStatusByName(
      awardedBadgeName,
      PrismaActivityStatus.inactive
    );

    await page.reload();
    await expect(page.getByText(awardedBadgeName, { exact: true })).toHaveCount(0);
  });
});
