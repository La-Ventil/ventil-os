import { expect, test } from '../fixtures/test';

test.describe('Health smoke', () => {
  test('health endpoint reports app liveness', async ({ request }) => {
    const response = await request.get('/api/health');
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.service).toBe('web');
    expect(body.checks.app.ok).toBe(true);
  });

  test('smoke endpoint reports app and database readiness', async ({ request }) => {
    const response = await request.get('/api/smoke');
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.service).toBe('web');
    expect(body.checks.app.ok).toBe(true);
    expect(body.checks.database.ok).toBe(true);
    expect(typeof body.checks.database.latencyMs).toBe('number');
  });
});
