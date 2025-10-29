import { test, expect } from "@playwright/test";

test.beforeAll(async () => {
  console.log("Before tests");
});

test.afterAll(async () => {
  console.log("After tests");
});

test("my test", async ({ page }) => {
  // ...
});

test("should create a bug report", async ({ request }) => {
  const receivedMessageResponse = await request.post(`/api/messages`, {
    data: {
      contenu: "[Bug] report 1",
    },
  });
  console.log(receivedMessageResponse.body());
  expect(receivedMessageResponse.ok()).toBeTruthy();
});
