#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const messagesDir = path.join(repoRoot, 'apps', 'web', 'messages');
const reportPath = path.join(repoRoot, 'docs', 'contributor', 'i18n', 'translation-coverage.md');
const referenceLocale = 'en';

const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const flattenMessages = (value, prefix = '') => {
  if (!isObject(value)) {
    return prefix ? [prefix] : [];
  }

  return Object.entries(value).flatMap(([key, nestedValue]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    if (isObject(nestedValue)) {
      return flattenMessages(nestedValue, nextPrefix);
    }

    return [nextPrefix];
  });
};

const toPercent = (value) => `${(value * 100).toFixed(1)}%`;

const formatKeyList = (keys) => (keys.length === 0 ? '- None' : keys.map((key) => `- \`${key}\``).join('\n'));

const collectLocaleCatalogs = async () => {
  const entries = await fs.readdir(messagesDir, { withFileTypes: true });
  const localeFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => entry.name)
    .sort();

  const catalogs = new Map();

  for (const fileName of localeFiles) {
    const locale = fileName.replace(/\.json$/u, '');
    const filePath = path.join(messagesDir, fileName);
    const raw = await fs.readFile(filePath, 'utf8');
    catalogs.set(locale, JSON.parse(raw));
  }

  return catalogs;
};

const buildReport = ({ locales, referenceKeys }) => {
  const lines = [
    '# Translation Coverage',
    '',
    `Reference locale: \`${referenceLocale}\``,
    '',
    'This report compares each locale catalog against the reference locale without runtime fallback merging.',
    ''
  ];

  lines.push('| Locale | Coverage | Missing keys | Extra keys |');
  lines.push('| --- | ---: | ---: | ---: |');

  for (const locale of locales) {
    lines.push(
      `| \`${locale.locale}\` | ${toPercent(locale.coverage)} | ${locale.missingKeys.length} | ${locale.extraKeys.length} |`
    );
  }

  for (const locale of locales) {
    lines.push('');
    lines.push(`## ${locale.locale}`);
    lines.push('');
    lines.push(`Coverage: ${toPercent(locale.coverage)} (${referenceKeys.length - locale.missingKeys.length}/${referenceKeys.length})`);
    lines.push('');
    lines.push('### Missing keys');
    lines.push('');
    lines.push(formatKeyList(locale.missingKeys));
    lines.push('');
    lines.push('### Extra keys');
    lines.push('');
    lines.push(formatKeyList(locale.extraKeys));
  }

  lines.push('');
  return `${lines.join('\n')}`;
};

const main = async () => {
  const catalogs = await collectLocaleCatalogs();
  const referenceCatalog = catalogs.get(referenceLocale);

  if (!referenceCatalog) {
    throw new Error(`Missing reference locale catalog: ${referenceLocale}.json`);
  }

  const referenceKeys = flattenMessages(referenceCatalog).sort();
  const referenceKeySet = new Set(referenceKeys);

  const locales = [...catalogs.entries()]
    .map(([locale, catalog]) => {
      const localeKeys = flattenMessages(catalog).sort();
      const localeKeySet = new Set(localeKeys);
      const missingKeys = referenceKeys.filter((key) => !localeKeySet.has(key));
      const extraKeys = localeKeys.filter((key) => !referenceKeySet.has(key));
      const coverage = referenceKeys.length === 0 ? 1 : (referenceKeys.length - missingKeys.length) / referenceKeys.length;

      return {
        locale,
        coverage,
        missingKeys,
        extraKeys
      };
    })
    .sort((left, right) => left.locale.localeCompare(right.locale));

  await fs.mkdir(path.dirname(reportPath), { recursive: true });

  const report = buildReport({
    locales,
    referenceKeys
  });

  await fs.writeFile(reportPath, report, 'utf8');
  process.stdout.write(`Wrote ${path.relative(repoRoot, reportPath)}\n`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
