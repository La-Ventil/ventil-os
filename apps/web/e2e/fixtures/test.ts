import { expect, test as base } from '@playwright/test';
import { loginWithCredentials, type LoginCredentials } from '../helpers/auth';

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

export const test = base.extend<E2EFixtures>({
  seedUsers: async ({}, use) => {
    await use(seedUsers);
  },
  loginAs: async ({ page }, use) => {
    await use(async (role) => {
      await loginWithCredentials(page, seedUsers[role]);
    });
  }
});

export { expect };
