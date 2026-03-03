import { expect, test as base, type BrowserContext } from '@playwright/test';
import { loginWithCredentials, type LoginCredentials } from '../helpers/auth';
import { createWorkerWebRuntime, type WorkerWebRuntime } from '../helpers/worker-web-runtime';

export type SeedUserRole = 'globalAdmin' | 'pedagogicalAdmin' | 'student' | 'studentVisitor' | 'external';

export type SeedUsers = Record<SeedUserRole, LoginCredentials>;

const defaultPassword = process.env.SEED_PASSWORD ?? 'ChangeMe123!';

const seedUsers: SeedUsers = {
  globalAdmin: { email: 'admin@ventil.local', password: defaultPassword },
  pedagogicalAdmin: { email: 'pedago@ventil.local', password: defaultPassword },
  student: { email: 'student@ventil.local', password: defaultPassword },
  studentVisitor: { email: 'student.visitor@ventil.local', password: defaultPassword },
  external: { email: 'external@ventil.local', password: defaultPassword }
};

type E2EFixtures = {
  seedUsers: SeedUsers;
  loginAs: (role: SeedUserRole) => Promise<void>;
};

type E2EWorkerFixtures = {
  workerWebRuntime: WorkerWebRuntime | null;
};

export const test = base.extend<E2EFixtures, E2EWorkerFixtures>({
  workerWebRuntime: [
    async (_workerArgs, runFixture, workerInfo) => {
      const runtime = await createWorkerWebRuntime(workerInfo);
      try {
        await runFixture(runtime);
      } finally {
        await runtime?.stop();
      }
    },
    { scope: 'worker', auto: true }
  ],
  context: async ({ browser, contextOptions, baseURL, workerWebRuntime }, runFixture) => {
    const context = await browser.newContext({
      ...(contextOptions ?? {}),
      baseURL: workerWebRuntime?.baseURL ?? baseURL
    });

    try {
      await runFixture(context as BrowserContext);
    } finally {
      await context.close();
    }
  },
  page: async ({ context }, runFixture) => {
    const page = await context.newPage();
    try {
      await runFixture(page);
    } finally {
      await page.close();
    }
  },
  seedUsers: async (_testArgs, runFixture) => {
    await runFixture(seedUsers);
  },
  loginAs: async ({ page }, runFixture) => {
    await runFixture(async (role) => {
      await loginWithCredentials(page, seedUsers[role]);
    });
  }
});

export { expect };
