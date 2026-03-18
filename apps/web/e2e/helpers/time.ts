import type { Page } from '@playwright/test';

export async function freezeBrowserTime(page: Page, now: Date): Promise<void> {
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
    { nowIso: now.toISOString() }
  );
}
