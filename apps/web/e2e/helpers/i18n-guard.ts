import type { BrowserContext, ConsoleMessage, Page, TestInfo } from '@playwright/test';

const missingMessageMarker = 'MISSING_MESSAGE';

const formatLocation = (page: Page) => {
  const url = page.url();
  return url ? ` on ${url}` : '';
};

const formatConsoleIssue = (message: ConsoleMessage, page: Page) =>
  `Console ${message.type()}${formatLocation(page)}: ${message.text()}`;

const formatPageErrorIssue = (error: Error, page: Page) => `Page error${formatLocation(page)}: ${error.message}`;

const isMissingMessageIssue = (message: string) => message.includes(missingMessageMarker);

export const attachI18nMissingMessageGuard = (context: BrowserContext, testInfo: TestInfo) => {
  const issues = new Set<string>();

  const recordIssue = (issue: string) => {
    if (isMissingMessageIssue(issue)) {
      issues.add(issue);
    }
  };

  const attachPageListeners = (page: Page) => {
    page.on('console', (message) => {
      recordIssue(formatConsoleIssue(message, page));
    });

    page.on('pageerror', (error) => {
      recordIssue(formatPageErrorIssue(error, page));
    });
  };

  context.on('page', attachPageListeners);

  return async () => {
    if (issues.size === 0) {
      return;
    }

    await testInfo.attach('missing-i18n-messages', {
      body: [...issues].join('\n\n'),
      contentType: 'text/plain'
    });

    throw new Error(
      [
        'Found unresolved i18n messages during the test.',
        'Every MISSING_MESSAGE now indicates a missing fallback entry in the runtime catalogs or a wrong translation key.',
        [...issues].join('\n')
      ].join('\n\n')
    );
  };
};
