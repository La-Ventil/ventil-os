import { test, expect } from '../fixtures/test';
import { clickQuickAction, openRowQuickActions } from '../helpers/quick-actions';
import { pressEscape } from '../helpers/keyboard';
import { expectNoSeriousA11yViolations } from '../helpers/a11y';

test.describe('Admin open badges accessibility', () => {
  test('create form exposes labeled controls and no serious axe violations', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    await page.goto('/hub/admin/open-badges/create');

    await expect(page.getByRole('textbox', { name: /nom|name/i })).toBeVisible();
    await expect(page.locator('input[name="description"]')).toBeVisible();
    await expect(page.locator('input[name="deliveryEnabled"]')).toHaveAttribute('aria-label', /délivrance|delivery/i);
    await expect(page.locator('input[name="activationEnabled"]')).toHaveAttribute('aria-label', /activation/i);
    await expect(page.locator('input[name="deliveryLevel"]')).toBeVisible();
    await expect(page.getByRole('link', { name: /retour|back/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /enregistrer|save/i })).toBeVisible();

    await expectNoSeriousA11yViolations(page, {
      include: ['form'],
      ignoreViolationIds: ['color-contrast'],
      contextLabel: 'Admin open badge create form'
    });
  });

  test('edit form exposes labeled controls and no serious axe violations', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    await page.goto('/hub/admin/open-badges');

    const firstDataRow = page.getByRole('table').getByRole('row').nth(1);
    const menu = await openRowQuickActions(page, firstDataRow, /administration|manage/i);
    await clickQuickAction(menu, /modifier|edit/i);

    await expect(page).toHaveURL(/\/hub\/admin\/open-badges\/[^/]+\/edit$/);
    await expect(page.getByRole('textbox', { name: /nom|name/i })).toBeVisible();
    await expect(page.locator('input[name="description"]')).toBeVisible();
    await expect(page.locator('input[name="deliveryEnabled"]')).toHaveAttribute('aria-label', /délivrance|delivery/i);
    await expect(page.locator('input[name="activationEnabled"]')).toHaveAttribute('aria-label', /activation/i);
    await expect(page.locator('input[name="deliveryLevel"]')).toBeVisible();
    await expect(page.getByRole('link', { name: /retour|back/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /enregistrer|save/i })).toBeVisible();

    await expectNoSeriousA11yViolations(page, {
      include: ['form'],
      ignoreViolationIds: ['color-contrast'],
      contextLabel: 'Admin open badge edit form'
    });
  });

  test('row quick actions menu is keyboard accessible and linked to its trigger', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    await page.goto('/hub/admin/open-badges');

    await expect(page.getByRole('table')).toBeVisible();
    const firstDataRow = page.getByRole('table').getByRole('row').nth(1);
    const trigger = firstDataRow.getByRole('button', { name: /administration|manage/i });
    const triggerId = await trigger.getAttribute('id');
    expect(triggerId).toBeTruthy();

    const menu = await openRowQuickActions(page, firstDataRow, /administration|manage/i);
    const labelledBy = await menu.getAttribute('aria-labelledby');
    const triggerById = page.locator(`[id="${triggerId ?? ''}"]`);
    const controls = await triggerById.getAttribute('aria-controls');
    const controlledElement = page.locator(`[id="${controls ?? ''}"]`);

    expect(labelledBy).toBeTruthy();
    expect(controls).toBeTruthy();
    await expect(menu).toHaveAttribute('aria-labelledby', triggerId ?? '');
    await expect(controlledElement).toBeVisible();

    await expect(menu.getByRole('menuitem').first()).toBeVisible();
    await expectNoSeriousA11yViolations(page, {
      include: ['[role="menu"]'],
      contextLabel: 'Admin open badges row quick actions menu'
    });

    await pressEscape(page);
    await expect(menu).not.toBeVisible();
  });
});
