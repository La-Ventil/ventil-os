import { test, expect } from '../fixtures/test';
import { expectNoSeriousA11yViolations } from '../helpers/a11y';
import { givenActiveReservation, givenUpcomingReservation } from '../helpers/machine-reservation-fixtures';
import { getReservationCard, openMyReservationsTab } from '../helpers/machine-reservations';

const CARD_SCOPE_ATTR = 'data-e2e-a11y-scope';
const CARD_SCOPE_VALUE = 'machine-reservation-card';

test.describe('Machine reservation list card accessibility', () => {
  test('reservation card exposes upcoming and active actions accessibly', async ({
    page,
    loginAs,
    seedUsers,
    workerWebRuntime
  }) => {
    await loginAs('globalAdmin');
    await givenUpcomingReservation({
      creatorEmail: seedUsers.globalAdmin.email,
      dbSlot: workerWebRuntime?.dbSlot
    });
    await openMyReservationsTab(page);

    const reservationCard = getReservationCard(page);
    await expect(reservationCard).toBeVisible();
    await expect(reservationCard.getByRole('button', { name: /annuler|cancel/i })).toBeVisible();

    await reservationCard.evaluate((node, args) => node.setAttribute(args.attr, args.value), {
      attr: CARD_SCOPE_ATTR,
      value: CARD_SCOPE_VALUE
    });
    await expectNoSeriousA11yViolations(page, {
      include: [`[${CARD_SCOPE_ATTR}="${CARD_SCOPE_VALUE}"]`],
      contextLabel: 'Machine reservation list card (upcoming)',
      ignoreViolationIds: ['color-contrast']
    });

    await givenActiveReservation({
      creatorEmail: seedUsers.globalAdmin.email,
      dbSlot: workerWebRuntime?.dbSlot
    });
    await openMyReservationsTab(page);

    const activeReservationCard = getReservationCard(page).filter({ hasText: /en cours|in progress/i });
    await expect(activeReservationCard).toBeVisible();
    await expect(activeReservationCard).toContainText(/en cours|in progress/i);
    await expect(activeReservationCard.getByRole('button', { name: /libérer|release/i })).toBeVisible();

    await activeReservationCard.evaluate((node, args) => node.setAttribute(args.attr, args.value), {
      attr: CARD_SCOPE_ATTR,
      value: CARD_SCOPE_VALUE
    });
    await expectNoSeriousA11yViolations(page, {
      include: [`[${CARD_SCOPE_ATTR}="${CARD_SCOPE_VALUE}"]`],
      contextLabel: 'Machine reservation list card (active)',
      ignoreViolationIds: ['color-contrast']
    });
  });
});
