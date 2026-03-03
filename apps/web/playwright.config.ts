import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

/* Keep E2E on a dedicated port so it does not collide with a local dev server on :3000. */
const PORT = process.env.PLAYWRIGHT_PORT || 3001;
const HOST = process.env.HOST || '127.0.0.1';
const workerParallelMode = process.env.PLAYWRIGHT_WORKER_PARALLEL === '1';
const configuredWorkers = Number(process.env.PLAYWRIGHT_WORKERS || (process.env.CI ? 2 : 2));
const headedMode = process.env.PLAYWRIGHT_HEADED === '1';
const sharedDbSlot = process.env.PLAYWRIGHT_DB_SLOT?.trim() || 'default';
const sharedDbSchema = `e2e_${sharedDbSlot.replace(/[^a-zA-Z0-9_]/g, '_')}`;
const sharedDistDir = process.env.NEXT_DIST_DIR || `.next-e2e-${sharedDbSlot}`;
const webServerDatabaseUrl = (() => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return undefined;
  }

  const url = new URL(databaseUrl);
  url.searchParams.set('schema', sharedDbSchema);
  return url.toString();
})();

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
const baseURL = `http://${HOST}:${PORT}`;

const sharedProjects = [
  {
    name: 'journeys-chromium',
    use: { ...devices['Desktop Chrome'] },
    testIgnore: [/\/a11y\//]
  },
  {
    name: 'a11y-chromium',
    use: { ...devices['Desktop Chrome'] },
    testMatch: /a11y\/.*\.spec\.ts/
  }
];

const projects = workerParallelMode
  ? sharedProjects
  : [
      {
        name: 'setup db',
        testMatch: /global\.setup\.ts/,
        teardown: 'cleanup db'
      },
      {
        name: 'cleanup db',
        testMatch: /global\.teardown\.ts/
      },
      {
        ...sharedProjects[0],
        dependencies: ['setup db']
      },
      {
        ...sharedProjects[1],
        dependencies: ['setup db']
      }
    ];

// Reference: https://playwright.dev/docs/test-configuration
export default defineConfig({
  // Timeout per test
  timeout: 30 * 1000,
  // Test directory
  testDir: path.join(__dirname, 'e2e'),
  // If a test fails, retry it additional 2 times
  retries: process.env.CI ? 2 : 0,
  // Artifacts folder where screenshots, videos, and traces are stored.
  outputDir: 'test-results/',
  /* Shared DB mode stays serial. Worker-isolated mode can use parallel workers. */
  fullyParallel: workerParallelMode,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  /* Keep shared-DB mode serial; worker-isolated mode is opt-in via env. */
  workers: workerParallelMode ? configuredWorkers : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html', { open: 'never' }]],

  // Run your local dev server before starting the tests:
  // https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests
  webServer: workerParallelMode
    ? undefined
    : {
        command: `pnpm exec next dev --turbopack --port ${PORT} --hostname ${HOST}`,
        url: baseURL,
        timeout: 120 * 1000,
        /* E2E relies on schema-scoped DATABASE_URL, so reusing an arbitrary local dev server is unsafe. */
        reuseExistingServer: false,
        env: {
          ...process.env,
          ...(webServerDatabaseUrl ? { DATABASE_URL: webServerDatabaseUrl } : {}),
          NEXT_DIST_DIR: sharedDistDir,
          NEXTAUTH_URL: baseURL,
          PLAYWRIGHT_DB_SLOT: sharedDbSlot
        }
      },

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,
    headless: !headedMode,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry'
  },

  /* Configure projects for major browsers */
  projects: [
    ...projects
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    //
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // Test against mobile viewports.
    // {
    //   name: "Mobile Chrome",
    //   use: {
    //     ...devices["Pixel 5"],
    //   },
    //   dependencies: ['setup db'],
    // },
    // {
    //   name: "Mobile Safari",
    //   use: devices["iPhone 12"],
    //   dependencies: ['setup db'],
    // },
  ]
});
