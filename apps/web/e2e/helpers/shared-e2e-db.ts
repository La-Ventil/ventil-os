import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveE2EDatabaseTarget } from './e2e-db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../..');

const execWithEnv = (command: string, env: NodeJS.ProcessEnv): void => {
  execSync(command, {
    cwd: repoRoot,
    stdio: 'inherit',
    env
  });
};

const execSqlWithEnv = (sql: string, env: NodeJS.ProcessEnv): void => {
  execSync('pnpm --filter @repo/db exec prisma db execute --stdin', {
    cwd: repoRoot,
    env,
    input: sql,
    stdio: ['pipe', 'inherit', 'inherit']
  });
};

export const resetSharedE2EDatabase = (): void => {
  const target = resolveE2EDatabaseTarget();
  console.log(`resetting and seeding test database (slot=${target.slot}, schema=${target.schema})...`);

  const env = {
    ...process.env,
    DATABASE_URL: target.url
  };

  execWithEnv('pnpm --filter @repo/db exec prisma migrate reset --force --skip-generate --skip-seed', env);
  execWithEnv('pnpm --filter @repo/db exec prisma db seed', env);
};

export const cleanupSharedE2EDatabase = (): void => {
  const target = resolveE2EDatabaseTarget();
  console.log(`deleting test database (slot=${target.slot}, schema=${target.schema})...`);

  execSqlWithEnv(`DROP SCHEMA IF EXISTS "${target.schema}" CASCADE;`, {
    ...process.env,
    DATABASE_URL: target.url
  });
};
