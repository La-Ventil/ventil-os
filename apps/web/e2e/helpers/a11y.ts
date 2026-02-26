import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

type A11yScanOptions = {
  include?: string[];
  exclude?: string[];
  ignoreViolationIds?: string[];
  contextLabel?: string;
  maxNodesPerViolation?: number;
};

type A11yViolation = {
  id: string;
  impact?: string | null;
  description: string;
  help: string;
  nodes: Array<{
    target: string;
    html?: string;
  }>;
};

const truncate = (value: string, max = 140): string => (value.length > max ? `${value.slice(0, max - 1)}…` : value);
const formatAxeTarget = (target: unknown): string => {
  if (Array.isArray(target)) {
    return target.map((part) => formatAxeTarget(part)).join(' ');
  }

  if (typeof target === 'string') {
    return target;
  }

  try {
    return JSON.stringify(target);
  } catch {
    return String(target);
  }
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
    help: violation.help,
    nodes: violation.nodes.map((node) => ({
      target: formatAxeTarget(node.target),
      html: typeof node.html === 'string' ? node.html : undefined
    }))
  }));
}

export async function expectNoSeriousA11yViolations(page: Page, options: A11yScanOptions = {}): Promise<void> {
  const violations = await scanA11y(page, options);
  const ignoredIds = new Set(options.ignoreViolationIds ?? []);
  const maxNodesPerViolation = options.maxNodesPerViolation ?? 3;
  const blocking = violations.filter(
    (violation) =>
      (violation.impact === 'critical' || violation.impact === 'serious') && !ignoredIds.has(violation.id)
  );

  const scopeLabel =
    options.contextLabel ??
    (options.include?.length ? `scope ${options.include.join(', ')}` : 'current page');
  const message = blocking
    .map((violation) => {
      const nodeLines = violation.nodes.slice(0, maxNodesPerViolation).map((node) => {
        const html = node.html ? ` | html: ${truncate(node.html)}` : '';
        return `    - target: ${node.target}${html}`;
      });
      return [`- [${violation.impact}] ${violation.id}: ${violation.help}`, ...nodeLines].join('\n');
    })
    .join('\n');

  expect(
    blocking,
    `Serious/critical a11y violations in ${scopeLabel}:\n${message}`
  ).toEqual([]);
}
