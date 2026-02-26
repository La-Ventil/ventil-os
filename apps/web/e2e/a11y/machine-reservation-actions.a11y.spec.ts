import { test, expect } from '../fixtures/test';
import { expectNoSeriousA11yViolations } from '../helpers/a11y';
import {
  createReservationFromSchedule,
  getReservationCard,
  openMyReservationsTab,
  setLatestReservationActive,
  setLatestReservationUpcoming
} from '../helpers/machine-reservations';

const CARD_SCOPE_ATTR = 'data-e2e-a11y-scope';
const CARD_SCOPE_VALUE = 'machine-reservation-card';

test.describe('Machine reservation list card accessibility', () => {
  test('upcoming reservation card exposes cancel action accessibly', async ({
    page,
    loginAs,
    workerWebRuntime
  }) => {
    await loginAs('globalAdmin');
    await createReservationFromSchedule(page);
    await openMyReservationsTab(page);
    await expect(getReservationCard(page)).toBeVisible();
    await setLatestReservationUpcoming({ dbSlot: workerWebRuntime?.dbSlot });
    await page.reload();
    await page.getByRole('tab', { name: /mes réservations|my reservations/i }).click();

    const reservationCard = getReservationCard(page);
    await expect(reservationCard).toBeVisible();
    await expect(reservationCard.getByRole('button', { name: /annuler|cancel/i })).toBeVisible();

    await reservationCard.evaluate(
      (node, args) => node.setAttribute(args.attr, args.value),
      { attr: CARD_SCOPE_ATTR, value: CARD_SCOPE_VALUE }
    );
    await expectNoSeriousA11yViolations(page, {
      include: [`[${CARD_SCOPE_ATTR}="${CARD_SCOPE_VALUE}"]`],
      contextLabel: 'Machine reservation list card (upcoming)',
      ignoreViolationIds: ['color-contrast']
    });
  });

  test('active reservation card exposes release action and in-progress status accessibly', async ({
    page,
    loginAs,
    workerWebRuntime
  }) => {
    await loginAs('globalAdmin');
    await createReservationFromSchedule(page);
    await openMyReservationsTab(page);
    await expect(getReservationCard(page)).toBeVisible();
    await setLatestReservationActive({ dbSlot: workerWebRuntime?.dbSlot });
    await page.reload();
    await page.getByRole('tab', { name: /mes réservations|my reservations/i }).click();

    const reservationCard = getReservationCard(page);
    await expect(reservationCard).toBeVisible();
    await expect(reservationCard).toContainText(/en cours|in progress/i);
    await expect(reservationCard.getByRole('button', { name: /libérer|release/i })).toBeVisible();

    await reservationCard.evaluate(
      (node, args) => node.setAttribute(args.attr, args.value),
      { attr: CARD_SCOPE_ATTR, value: CARD_SCOPE_VALUE }
    );
    await expectNoSeriousA11yViolations(page, {
      include: [`[${CARD_SCOPE_ATTR}="${CARD_SCOPE_VALUE}"]`],
      contextLabel: 'Machine reservation list card (active)',
      ignoreViolationIds: ['color-contrast']
    });
  });
});
