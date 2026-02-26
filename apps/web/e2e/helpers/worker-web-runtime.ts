import { execSync, spawn, type ChildProcess } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { setTimeout as delay } from 'timers/promises';
import type { WorkerInfo } from '@playwright/test';
import { resolveE2EDatabaseTarget } from './e2e-db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webAppDir = path.resolve(__dirname, '../..');

const HOST = '127.0.0.1';
const DEFAULT_BASE_PORT = 3300;

export type WorkerWebRuntime = {
  baseURL: string;
  dbSlot: string;
  dbSchema: string;
  port: number;
  stop: () => Promise<void>;
};

const isWorkerParallelMode = (): boolean => process.env.PLAYWRIGHT_WORKER_PARALLEL === '1';

const slugify = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const projectPortOffset = (projectName: string): number => {
  if (projectName.includes('journeys')) return 0;
  if (projectName.includes('a11y')) return 100;
  return 200;
};

const execWithEnv = (command: string, env: NodeJS.ProcessEnv): void => {
  execSync(command, { cwd: webAppDir, stdio: 'inherit', env });
};

const waitForHttp = async (url: string, timeoutMs = 120_000): Promise<void> => {
  const deadline = Date.now() + timeoutMs;
  let lastError: unknown = null;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { redirect: 'manual' });
      if (response.status < 500) {
        return;
      }
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await delay(500);
  }

  throw new Error(`Timed out waiting for ${url}. Last error: ${String(lastError)}`);
};

const stopChild = async (child: ChildProcess, label: string): Promise<void> => {
  if (child.exitCode !== null || child.killed) {
    return;
  }

  child.kill('SIGTERM');

  const exited = await Promise.race([
    new Promise<boolean>((resolve) => child.once('exit', () => resolve(true))),
    delay(5_000).then(() => false)
  ]);

  if (!exited) {
    child.kill('SIGKILL');
    await Promise.race([
      new Promise<void>((resolve) => child.once('exit', () => resolve())),
      delay(2_000)
    ]);
  }

  if (child.exitCode && child.exitCode !== 0) {
    console.warn(`[e2e worker] ${label} exited with code ${child.exitCode}`);
  }
};

export const createWorkerWebRuntime = async (workerInfo: WorkerInfo): Promise<WorkerWebRuntime | null> => {
  if (!isWorkerParallelMode()) {
    return null;
  }

  const baseSlot = process.env.PLAYWRIGHT_DB_SLOT?.trim() || 'worker';
  const projectSlug = slugify(workerInfo.project.name);
  const slot = `${baseSlot}-${projectSlug}-w${workerInfo.parallelIndex}`;
  const dbTarget = resolveE2EDatabaseTarget(slot);
  const basePort = Number(process.env.PLAYWRIGHT_WORKER_BASE_PORT ?? DEFAULT_BASE_PORT);
  const port = basePort + projectPortOffset(projectSlug) + workerInfo.parallelIndex;
  const baseURL = `http://${HOST}:${port}`;
  const nextDistDir = `.next-e2e-${slot}`;

  const env = {
    ...process.env,
    HOST,
    PORT: String(port),
    NEXT_DIST_DIR: nextDistDir,
    PLAYWRIGHT_DB_SLOT: slot,
    DATABASE_URL: dbTarget.url
  };

  console.log(
    `[e2e worker] booting ${workerInfo.project.name} worker=${workerInfo.parallelIndex} ` +
      `schema=${dbTarget.schema} port=${port}`
  );

  execWithEnv('pnpm -w db:reset', env);

  const child = spawn('pnpm', ['exec', 'next', 'dev', '--turbopack', '--port', String(port), '--hostname', HOST], {
    cwd: webAppDir,
    env,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let stderrBuffer = '';
  let stdoutBuffer = '';
  child.stderr?.on('data', (chunk) => {
    stderrBuffer += chunk.toString();
    stderrBuffer = stderrBuffer.slice(-8_000);
  });
  child.stdout?.on('data', (chunk) => {
    stdoutBuffer += chunk.toString();
    stdoutBuffer = stdoutBuffer.slice(-8_000);
  });

  try {
    await waitForHttp(`${baseURL}/login`);
  } catch (error) {
    await stopChild(child, `next dev on ${baseURL}`);
    throw new Error(
      `[e2e worker] failed to start Next server for ${workerInfo.project.name} ` +
        `(worker=${workerInfo.parallelIndex}, schema=${dbTarget.schema}, port=${port}).\n` +
        `stdout tail:\n${stdoutBuffer || '<empty>'}\n` +
        `stderr tail:\n${stderrBuffer || '<empty>'}\n` +
        `cause: ${String(error)}`
    );
  }

  const stop = async (): Promise<void> => {
    console.log(
      `[e2e worker] stopping ${workerInfo.project.name} worker=${workerInfo.parallelIndex} ` +
        `schema=${dbTarget.schema} port=${port}`
    );

    await stopChild(child, `next dev on ${baseURL}`);

    try {
      execWithEnv('pnpm --filter @repo/db exec prisma migrate reset --force --skip-seed', env);
    } catch (error) {
      console.warn(
        `[e2e worker] cleanup reset failed for schema=${dbTarget.schema}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  return {
    baseURL,
    dbSlot: dbTarget.slot,
    dbSchema: dbTarget.schema,
    port,
    stop
  };
};
