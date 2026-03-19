import { ActivityStatus as PrismaActivityStatus } from '@prisma/client';
import { test, expect } from '../fixtures/test';
import { expectNoSeriousA11yViolations } from '../helpers/a11y';
import { closeDialogWithEscape, expectDialog } from '../helpers/dialogs';
import { openAdminOpenBadgeAssignModalById } from '../helpers/open-badges';
import { getOpenBadgeTestRepository } from '../helpers/open-badge-test-repository';

test.describe('Admin open badge assign modal accessibility', () => {
  test('assign modal is labelled, fields are named, and closes with Escape', async ({
    page,
    loginAs,
    seedUsers,
    workerWebRuntime
  }) => {
    await loginAs('globalAdmin');
    const repository = getOpenBadgeTestRepository(workerWebRuntime?.dbSlot);
    const badgeId = await repository.findIdByName('Impression 3D Bambu Lab');
    await repository.setStatusByName('Impression 3D Bambu Lab', PrismaActivityStatus.active);
    await repository.removeProgressForUserByBadgeName(seedUsers.student.email, 'Impression 3D Bambu Lab');
    await openAdminOpenBadgeAssignModalById(page, badgeId);

    const dialog = await expectDialog(page, /assign (an|the) open badge/i);
    await expect(dialog).toHaveAttribute('aria-labelledby', /.+/);
    await expect(dialog).toHaveAttribute('aria-describedby', /.+/);

    await expect(dialog.getByRole('combobox', { name: /level/i })).toBeVisible();
    await expect(dialog.getByRole('combobox', { name: /user/i })).toBeVisible();
    await expect(dialog.getByRole('button', { name: /back/i }).last()).toBeVisible();
    await expect(dialog.getByRole('button', { name: /assign/i })).toBeVisible();

    await expectNoSeriousA11yViolations(page, {
      include: ['[role="dialog"]'],
      contextLabel: 'Admin open badge assign modal',
      ignoreViolationIds: ['color-contrast']
    });

    await closeDialogWithEscape(page, /assign (an|the) open badge/i);
    await expect(page).toHaveURL(/\/hub\/admin\/open-badges$/);
  });
});
