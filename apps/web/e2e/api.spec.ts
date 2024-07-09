import { test, expect } from '@playwright/test';

test('should create a bug report', async ({ request }) => {
  const receivedMessageResponse = await request.post(`/api/messages`, {
    data: {
      contenu: '[Bug] report 1',
    }
  });
  console.log(receivedMessageResponse.body());
  expect(receivedMessageResponse.ok()).toBeTruthy();
});