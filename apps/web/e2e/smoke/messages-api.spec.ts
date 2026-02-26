import { test, expect } from '@playwright/test';

test('creates a message via /api/messages', async ({ request }) => {
  const response = await request.post('/api/messages', {
    data: {
      contenu: '[Bug] report 1'
    }
  });

  expect(response.ok()).toBeTruthy();
});
