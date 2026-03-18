import { test, expect } from '../../fixtures/test';
import { openMachineDetails, openMachineReservationModalFromSchedule } from '../../helpers/fab-lab';
import {
  getReservationCard,
  openMyReservationsTab,
  submitReservationAndReturnToMachineDetails
} from '../../helpers/machine-reservations';

test.describe('Machine reservation journey', () => {
  test('admin can reserve a machine from the reservation modal route', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    const machineId = await submitReservationAndReturnToMachineDetails(page, /Bambu Lab X1C/i);

    await openMyReservationsTab(page);
    await expect(page).toHaveURL(/\/hub\/fab-lab$/);
    await expect(getReservationCard(page)).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/hub/fab-lab$`));
    expect(machineId).toMatch(/\w+/);
  });

  test('participant search narrows matches in the reservation modal', async ({ page, loginAs }) => {
    await loginAs('globalAdmin');
    await openMachineReservationModalFromSchedule(page, /Bambu Lab X1C/i);

    const reservationDialog = page.getByRole('dialog', { name: /Bambu Lab X1C/i }).filter({
      has: page.locator('input[name="machineId"]')
    });
    await expect(reservationDialog).toBeVisible();

    const participantsField = reservationDialog.getByRole('combobox', { name: /participants/i });

    await participantsField.fill('claude');
    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible();
    await expect(listbox.getByRole('option', { name: /Claude Dupont/i })).toBeVisible();
    await expect(listbox.getByRole('option', { name: /Admin Global/i })).toHaveCount(0);
    await expect(listbox.getByRole('option', { name: /Admin Pédagogique/i })).toHaveCount(0);

    await participantsField.fill('admin');
    await expect(listbox.getByRole('option', { name: /Admin Pédagogique/i })).toBeVisible();
    await expect(listbox.getByRole('option', { name: /Claude Dupont/i })).toHaveCount(0);
  });

  test('clicking an already started slot rounds the reservation start to the next minute', async ({
    page,
    loginAs
  }) => {
    const fixedNow = new Date();
    fixedNow.setHours(10, 7, 30, 0);
    const fixedNowIso = fixedNow.toISOString();

    await page.addInitScript(
      ({ nowIso }) => {
        const fixedTime = new Date(nowIso).getTime();
        const OriginalDate = Date;

        class MockDate extends OriginalDate {
          constructor(...args: unknown[]) {
            if (args.length === 0) {
              super(fixedTime);
              return;
            }

            if (args.length === 1) {
              super(args[0] as string | number | Date);
              return;
            }

            if (args.length === 2) {
              super(args[0] as number, args[1] as number);
              return;
            }

            if (args.length === 3) {
              super(args[0] as number, args[1] as number, args[2] as number);
              return;
            }

            if (args.length === 4) {
              super(args[0] as number, args[1] as number, args[2] as number, args[3] as number);
              return;
            }

            if (args.length === 5) {
              super(args[0] as number, args[1] as number, args[2] as number, args[3] as number, args[4] as number);
              return;
            }

            if (args.length === 6) {
              super(
                args[0] as number,
                args[1] as number,
                args[2] as number,
                args[3] as number,
                args[4] as number,
                args[5] as number
              );
              return;
            }

            super(
              args[0] as number,
              args[1] as number,
              args[2] as number,
              args[3] as number,
              args[4] as number,
              args[5] as number,
              args[6] as number
            );
          }

          static now(): number {
            return fixedTime;
          }
        }

        globalThis.Date = MockDate as DateConstructor;
      },
      { nowIso: fixedNowIso }
    );

    await loginAs('globalAdmin');
    const machineId = await openMachineDetails(page, /Bambu Lab X1C/i);

    const machineDialog = page.getByRole('dialog', { name: /Bambu Lab X1C/i }).first();
    await machineDialog.locator('button[aria-label="Réserver à 10:00"], button[aria-label="Reserve at 10:00"]').click();

    await expect(page).toHaveURL(new RegExp(`/hub/fab-lab/${machineId}/reservation\\?start=`), { timeout: 15_000 });

    const roundedNow = new Date(fixedNow);
    roundedNow.setSeconds(0, 0);
    roundedNow.setMinutes(roundedNow.getMinutes() + 1);

    const url = new URL(page.url());
    expect(url.searchParams.get('start')).toBe(roundedNow.toISOString());
  });

  test('student cannot open a reservation slot when badge level requirement is not met', async ({ page, loginAs }) => {
    const fixedNow = new Date();
    fixedNow.setHours(9, 0, 0, 0);

    await loginAs('student');

    await page.addInitScript(
      ({ nowIso }) => {
        const fixedTime = new Date(nowIso).getTime();
        const OriginalDate = Date;

        class MockDate extends OriginalDate {
          constructor(...args: unknown[]) {
            if (args.length === 0) {
              super(fixedTime);
              return;
            }

            super(...(args as ConstructorParameters<DateConstructor>));
          }

          static now(): number {
            return fixedTime;
          }
        }

        globalThis.Date = MockDate as DateConstructor;
      },
      { nowIso: fixedNow.toISOString() }
    );

    await openMachineDetails(page, /Bambu Lab X1C/i);
    const machineDialog = page.getByRole('dialog', { name: /Bambu Lab X1C/i }).first();
    await expect(machineDialog).toBeVisible();
    await expect(
      machineDialog.locator('button[aria-label="Réserver à 10:00"], button[aria-label="Reserve at 10:00"]').first()
    ).toBeDisabled();
  });
});
