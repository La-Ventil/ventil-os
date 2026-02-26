import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

type A11yScanOptions = {
  include?: string[];
  exclude?: string[];
  ignoreViolationIds?: string[];
};

type A11yViolation = {
  id: string;
  impact?: string | null;
  description: string;
  help: string;
};

export async function scanA11y(page: Page, options: A11yScanOptions = {}): Promise<A11yViolation[]> {
  let builder = new AxeBuilder({ page });

  for (const selector of options.include ?? []) {
    builder = builder.include(selector);
  }

  for (const selector of options.exclude ?? []) {
    builder = builder.exclude(selector);
  }

  const results = await builder.analyze();

  return results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    description: violation.description,
    help: violation.help
  }));
}

export async function expectNoSeriousA11yViolations(page: Page, options: A11yScanOptions = {}): Promise<void> {
  const violations = await scanA11y(page, options);
  const ignoredIds = new Set(options.ignoreViolationIds ?? []);
  const blocking = violations.filter(
    (violation) =>
      (violation.impact === 'critical' || violation.impact === 'serious') && !ignoredIds.has(violation.id)
  );

  expect(
    blocking,
    `Serious/critical a11y violations:\n${blocking
      .map((violation) => `- [${violation.impact}] ${violation.id}: ${violation.help}`)
      .join('\n')}`
  ).toEqual([]);
}
