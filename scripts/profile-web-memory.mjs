import { execSync, spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const webAppDir = path.join(repoRoot, 'apps/web');
const currentNodeBinDir = path.dirname(process.execPath);
const dbPackageDir = path.join(repoRoot, 'packages/db');
const dbPrismaBin = path.join(dbPackageDir, 'node_modules/.bin/prisma');
const dbTsxBin = path.join(dbPackageDir, 'node_modules/.bin/tsx');

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 3301;
const DEFAULT_SLOT = 'memprof';
const DEFAULT_LOCALE = 'en';
const DEFAULT_DIST_DIR = '.next-memory-profile';

const STORY_PRESETS = {
  'fab-lab-machine-reserve': {
    description: 'Reservation journeys from the machine modal',
    specs: ['e2e/journeys/machine-reservations/reserve-machine.spec.ts']
  },
  'fab-lab-machine-update': {
    description: 'Update journeys for existing machine reservations',
    specs: ['e2e/journeys/machine-reservations/update-reservation.spec.ts']
  },
  'fab-lab-machine-all': {
    description: 'Reserve + update machine reservation journeys',
    specs: [
      'e2e/journeys/machine-reservations/reserve-machine.spec.ts',
      'e2e/journeys/machine-reservations/update-reservation.spec.ts'
    ]
  }
};

const loadEnvFile = (filename) => {
  if (!existsSync(filename)) {
    return;
  }

  const content = readFileSync(filename, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    if (!key || process.env[key] !== undefined) {
      continue;
    }

    let value = trimmed.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
};

const printHelp = () => {
  console.log(`Usage: node scripts/profile-web-memory.mjs [options]

Options:
  --story <name>         Run a built-in user story preset
  --spec <path>          Run a Playwright spec directly (repeatable)
  --label <name>         Label for a custom Playwright scenario
  --grep <pattern>       Forward a Playwright grep pattern
  --repeat <number>      Replay each scenario N times in the same server process (default: 1)
  --reset-between-iterations
                         Reseed the profiled DB between repeated iterations without restarting Node
  --port <number>        Port for the profiled Next server (default: ${DEFAULT_PORT})
  --host <host>          Host for the profiled Next server (default: ${DEFAULT_HOST})
  --slot <name>          DB slot/schema suffix (default: ${DEFAULT_SLOT})
  --locale <locale>      APP_LOCALE / Playwright locale (default: ${DEFAULT_LOCALE})
  --snapshots <mode>     none | after | before-after (default: after)
  --output-dir <path>    Output directory for reports and snapshots
  --skip-build           Reuse the existing production build

Built-in stories:
${Object.entries(STORY_PRESETS)
  .map(([name, preset]) => `  - ${name}: ${preset.description}`)
  .join('\n')}
`);
};

const parseArgs = (argv) => {
  const parsed = {
    stories: [],
    specs: [],
    label: null,
    grep: null,
    repeat: 1,
    resetBetweenIterations: false,
    port: DEFAULT_PORT,
    host: DEFAULT_HOST,
    slot: DEFAULT_SLOT,
    locale: DEFAULT_LOCALE,
    skipBuild: false,
    snapshots: 'after',
    outputDir: null
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === '--') {
      continue;
    }

    if (arg === '--story' && next) {
      parsed.stories.push(next);
      index += 1;
      continue;
    }

    if (arg === '--spec' && next) {
      parsed.specs.push(next);
      index += 1;
      continue;
    }

    if (arg === '--label' && next) {
      parsed.label = next;
      index += 1;
      continue;
    }

    if (arg === '--grep' && next) {
      parsed.grep = next;
      index += 1;
      continue;
    }

    if (arg === '--repeat' && next) {
      parsed.repeat = Number(next);
      index += 1;
      continue;
    }

    if (arg === '--reset-between-iterations') {
      parsed.resetBetweenIterations = true;
      continue;
    }

    if (arg === '--port' && next) {
      parsed.port = Number(next);
      index += 1;
      continue;
    }

    if (arg === '--host' && next) {
      parsed.host = next;
      index += 1;
      continue;
    }

    if (arg === '--slot' && next) {
      parsed.slot = next;
      index += 1;
      continue;
    }

    if (arg === '--locale' && next) {
      parsed.locale = next;
      index += 1;
      continue;
    }

    if (arg === '--output-dir' && next) {
      parsed.outputDir = next;
      index += 1;
      continue;
    }

    if (arg === '--snapshots' && next) {
      parsed.snapshots = next;
      index += 1;
      continue;
    }

    if (arg === '--skip-build') {
      parsed.skipBuild = true;
      continue;
    }

    if (arg === '--help') {
      printHelp();
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return parsed;
};

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const bytesToMb = (value) => Number((value / (1024 * 1024)).toFixed(2));

const summarizeStats = (stats) => ({
  rssMb: bytesToMb(stats.memory.rss),
  heapUsedMb: bytesToMb(stats.memory.heapUsed),
  heapTotalMb: bytesToMb(stats.memory.heapTotal),
  externalMb: bytesToMb(stats.memory.external),
  arrayBuffersMb: bytesToMb(stats.memory.arrayBuffers)
});

const diffStats = (before, after) => ({
  rssMb: Number((after.rssMb - before.rssMb).toFixed(2)),
  heapUsedMb: Number((after.heapUsedMb - before.heapUsedMb).toFixed(2)),
  heapTotalMb: Number((after.heapTotalMb - before.heapTotalMb).toFixed(2)),
  externalMb: Number((after.externalMb - before.externalMb).toFixed(2)),
  arrayBuffersMb: Number((after.arrayBuffersMb - before.arrayBuffersMb).toFixed(2))
});

const resolveDatabaseTarget = (slot) => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required.');
  }

  const schema = `e2e_${slot.replace(/[^a-zA-Z0-9_]/g, '_')}`;
  const url = new URL(databaseUrl);
  url.searchParams.set('schema', schema);
  url.searchParams.set('statement_cache_size', '0');
  return { slot, schema, url: url.toString() };
};

const execWithEnv = (command, env, cwd = repoRoot) => {
  execSync(command, {
    cwd,
    stdio: 'inherit',
    env
  });
};

const execSqlWithEnv = (sql, env) => {
  execSync(`${dbPrismaBin} db execute --stdin --schema prisma/schema.prisma`, {
    cwd: dbPackageDir,
    env,
    input: sql,
    stdio: ['pipe', 'inherit', 'inherit']
  });
};

const withCurrentNodePath = (env) => ({
  ...env,
  PATH: [currentNodeBinDir, env.PATH, process.env.PATH].filter(Boolean).join(path.delimiter)
});

const resetSchema = (env) => {
  execWithEnv(`${dbPrismaBin} migrate reset --force --skip-generate --skip-seed --schema prisma/schema.prisma`, env, dbPackageDir);
  execWithEnv(`${dbTsxBin} prisma/seed.ts`, env, dbPackageDir);
};

const clearSeededSchema = (env) => {
  execSqlWithEnv(
    `
DO $$
DECLARE
  truncate_sql text;
BEGIN
  SELECT
    'TRUNCATE TABLE ' ||
    string_agg(format('%I.%I', schemaname, tablename), ', ') ||
    ' RESTART IDENTITY CASCADE'
  INTO truncate_sql
  FROM pg_tables
  WHERE schemaname = current_schema()
    AND tablename <> '_prisma_migrations';

  IF truncate_sql IS NOT NULL THEN
    EXECUTE truncate_sql;
  END IF;
END $$;
    `,
    env
  );
  execWithEnv(`${dbTsxBin} prisma/seed.ts`, env, dbPackageDir);
};

const dropSchema = (env, schema) => {
  execSqlWithEnv(`DROP SCHEMA IF EXISTS "${schema}" CASCADE;`, env);
};

const waitForHttp = async (url, timeoutMs = 120_000) => {
  const deadline = Date.now() + timeoutMs;
  let lastError = null;

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

const stopChild = async (child) => {
  if (child.exitCode !== null || child.killed) {
    return;
  }

  child.kill('SIGTERM');

  const exited = await Promise.race([
    new Promise((resolve) => child.once('exit', () => resolve(true))),
    delay(5_000).then(() => false)
  ]);

  if (!exited) {
    child.kill('SIGKILL');
    await Promise.race([new Promise((resolve) => child.once('exit', () => resolve())), delay(2_000)]);
  }
};

const fetchProfile = async (baseURL, token, pathname, options = {}) => {
  const response = await fetch(`${baseURL}${pathname}`, {
    ...options,
    headers: {
      'x-memory-profile-token': token,
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...(options.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Error(`Profiling request failed for ${pathname}: HTTP ${response.status}`);
  }

  return response.json();
};

const buildScenarios = (args) => {
  const scenarios = [];

  for (const story of args.stories) {
    const preset = STORY_PRESETS[story];
    if (!preset) {
      throw new Error(`Unknown story preset: ${story}`);
    }

    scenarios.push({
      name: story,
      description: preset.description,
      specs: preset.specs
    });
  }

  if (args.specs.length > 0) {
    scenarios.push({
      name:
        args.label ||
        (args.specs.length === 1 ? slugify(path.basename(args.specs[0], path.extname(args.specs[0]))) : 'custom-run'),
      description: 'Custom Playwright run',
      specs: args.specs
    });
  }

  return scenarios.length > 0 ? scenarios : [{ name: 'fab-lab-machine-all', ...STORY_PRESETS['fab-lab-machine-all'] }];
};

const moveHeapProfiles = (directory, outputDir, startedAtMs) => {
  const moved = [];

  for (const entry of readdirSync(directory)) {
    if (!entry.endsWith('.heapprofile')) {
      continue;
    }

    const source = path.join(directory, entry);
    const stats = statSync(source);
    if (stats.mtimeMs < startedAtMs) {
      continue;
    }

    const target = path.join(outputDir, entry);
    renameSync(source, target);
    moved.push(target);
  }

  return moved;
};

const renderMarkdownReport = (report) => {
  const lines = [
    '# Web Memory Profile',
    '',
    `- Captured at: ${report.capturedAt}`,
    `- Base URL: ${report.baseURL}`,
    `- DB schema: ${report.db.schema}`,
    `- Dist dir: ${report.distDir}`,
    `- Stories: ${report.scenarios.map((scenario) => scenario.name).join(', ')}`,
    ''
  ];

  for (const scenario of report.results) {
    lines.push(`## ${scenario.name}`);
    lines.push('');
    lines.push(`- Description: ${scenario.description}`);
    lines.push(`- Specs: ${scenario.specs.join(', ')}`);
    if (scenario.grep) {
      lines.push(`- Grep: ${scenario.grep}`);
    }
    lines.push(`- RSS delta: ${scenario.delta.rssMb} MB`);
    lines.push(`- Heap used delta: ${scenario.delta.heapUsedMb} MB`);
    lines.push(`- Heap total delta: ${scenario.delta.heapTotalMb} MB`);
    lines.push(`- External delta: ${scenario.delta.externalMb} MB`);
    lines.push(`- Array buffers delta: ${scenario.delta.arrayBuffersMb} MB`);
    if (scenario.iterations?.length > 0) {
      lines.push(`- Repeats: ${scenario.iterations.length}`);
      lines.push(`- Max heap after GC: ${Math.max(...scenario.iterations.map((iteration) => iteration.after.heapUsedMb))} MB`);
      lines.push(`- Heap slope (first -> last after GC): ${scenario.repeatSummary.heapUsedSlopeMb} MB`);
      lines.push(`- RSS slope (first -> last after GC): ${scenario.repeatSummary.rssSlopeMb} MB`);
    }
    if (scenario.snapshots.length > 0) {
      lines.push(`- Snapshots: ${scenario.snapshots.join(', ')}`);
    }
    lines.push('');
  }

  const rankedByHeap = [...report.results].sort((left, right) => right.delta.heapUsedMb - left.delta.heapUsedMb);
  lines.push('## Ranking by Heap Delta');
  lines.push('');
  rankedByHeap.forEach((scenario, index) => {
    lines.push(`${index + 1}. ${scenario.name}: ${scenario.delta.heapUsedMb} MB heap, ${scenario.delta.rssMb} MB rss`);
  });

  if (report.heapProfiles.length > 0) {
    lines.push('');
    lines.push('## Heap Profiles');
    lines.push('');
    report.heapProfiles.forEach((file) => lines.push(`- ${file}`));
  }

  lines.push('');
  return `${lines.join('\n')}\n`;
};

const buildIterationName = (scenarioName, iterationIndex, repeatCount) => {
  if (repeatCount <= 1) {
    return scenarioName;
  }

  return `${scenarioName}#${iterationIndex + 1}`;
};

const summarizeIterations = (iterations) => {
  if (iterations.length === 0) {
    return {
      count: 0,
      heapUsedSlopeMb: 0,
      rssSlopeMb: 0,
      maxHeapUsedMb: 0,
      maxRssMb: 0
    };
  }

  const first = iterations[0];
  const last = iterations[iterations.length - 1];

  return {
    count: iterations.length,
    heapUsedSlopeMb: Number((last.after.heapUsedMb - first.after.heapUsedMb).toFixed(2)),
    rssSlopeMb: Number((last.after.rssMb - first.after.rssMb).toFixed(2)),
    maxHeapUsedMb: Math.max(...iterations.map((iteration) => iteration.after.heapUsedMb)),
    maxRssMb: Math.max(...iterations.map((iteration) => iteration.after.rssMb))
  };
};

const main = async () => {
  loadEnvFile(path.join(webAppDir, '.env'));
  loadEnvFile(path.join(webAppDir, '.env.local'));

  const args = parseArgs(process.argv.slice(2));
  if (!Number.isInteger(args.repeat) || args.repeat < 1) {
    throw new Error('--repeat must be a positive integer.');
  }
  if (args.resetBetweenIterations && args.repeat < 2) {
    throw new Error('--reset-between-iterations requires --repeat >= 2.');
  }
  const scenarios = buildScenarios(args);
  const target = resolveDatabaseTarget(args.slot);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputDir = path.resolve(
    repoRoot,
    args.outputDir || path.join('.memory-profiles', `${timestamp}-${slugify(target.slot)}`)
  );
  const distDir = `${DEFAULT_DIST_DIR}-${slugify(target.slot)}`;
  const baseURL = `http://${args.host}:${args.port}`;
  const token = crypto.randomBytes(24).toString('hex');
  const startedAtMs = Date.now();

  mkdirSync(outputDir, { recursive: true });

  const baseEnv = {
    ...process.env,
    DATABASE_URL: target.url,
    NEXTAUTH_URL: baseURL,
    HOST: args.host,
    PORT: String(args.port),
    APP_LOCALE: args.locale,
    NEXT_DIST_DIR: distDir
  };
  const normalizedBaseEnv = withCurrentNodePath(baseEnv);

  console.log(`profiling web memory on ${baseURL} (schema=${target.schema}, output=${outputDir})`);
  let server = null;

  try {
    resetSchema(normalizedBaseEnv);

    if (!args.skipBuild) {
      execWithEnv('pnpm --filter web build', normalizedBaseEnv);
    }

    const existingNodeOptions = process.env.NODE_OPTIONS?.trim();
    const profileNodeOptions = ['--expose-gc', '--heap-prof'];
    const serverEnv = {
      ...normalizedBaseEnv,
      NODE_ENV: 'production',
      NODE_OPTIONS: [existingNodeOptions, ...profileNodeOptions].filter(Boolean).join(' '),
      MEMORY_PROFILE_ENABLED: '1',
      MEMORY_PROFILE_TOKEN: token,
      MEMORY_PROFILE_OUTPUT_DIR: outputDir
    };

    server = spawn('pnpm', ['exec', 'next', 'start', '-p', String(args.port), '--hostname', args.host], {
      cwd: webAppDir,
      env: serverEnv,
      stdio: 'inherit'
    });

    await waitForHttp(`${baseURL}/login`);

    const results = [];
    for (const scenario of scenarios) {
      console.log(`\n=== profiling story: ${scenario.name} ===`);
      const snapshots = [];
      const iterations = [];

      for (let iterationIndex = 0; iterationIndex < args.repeat; iterationIndex += 1) {
        if (iterationIndex > 0 && args.resetBetweenIterations) {
          console.log(`\n--- resetting DB before iteration ${iterationIndex + 1}/${args.repeat} ---`);
          clearSeededSchema(normalizedBaseEnv);
        }

        const iterationName = buildIterationName(scenario.name, iterationIndex, args.repeat);
        console.log(`\n--- iteration ${iterationIndex + 1}/${args.repeat}: ${iterationName} ---`);
        await fetchProfile(baseURL, token, '/api/memory-profile/gc', { method: 'POST' }).catch(() => null);
        await delay(250);
        const beforeRaw = await fetchProfile(baseURL, token, '/api/memory-profile/stats');
        const before = summarizeStats(beforeRaw);

        if (args.snapshots === 'before-after') {
          const snapshot = await fetchProfile(baseURL, token, '/api/memory-profile/heap-snapshot', {
            method: 'POST',
            body: JSON.stringify({ label: `${iterationName}-before` })
          });
          snapshots.push(snapshot.file);
        }

        const playwrightArgs = ['--filter', 'web', 'exec', 'playwright', 'test', ...scenario.specs, '--project=journeys-chromium'];

        if (args.grep) {
          playwrightArgs.push(`--grep=${args.grep}`);
        }

        const playwrightRun = spawnSync('pnpm', playwrightArgs, {
          cwd: repoRoot,
          stdio: 'inherit',
          env: {
            ...serverEnv,
            PLAYWRIGHT_BASE_URL: baseURL,
            PLAYWRIGHT_DISABLE_DB_PROJECTS: '1',
            PLAYWRIGHT_DB_SLOT: target.slot,
            PLAYWRIGHT_APP_LOCALE: args.locale
          }
        });

        if (playwrightRun.status !== 0) {
          throw new Error(`Playwright run failed for scenario ${iterationName} with exit code ${playwrightRun.status}`);
        }

        await fetchProfile(baseURL, token, '/api/memory-profile/gc', { method: 'POST' }).catch(() => null);
        await delay(250);

        if (args.snapshots === 'after' || args.snapshots === 'before-after') {
          const snapshot = await fetchProfile(baseURL, token, '/api/memory-profile/heap-snapshot', {
            method: 'POST',
            body: JSON.stringify({ label: `${iterationName}-after` })
          });
          snapshots.push(snapshot.file);
        }

        const afterRaw = await fetchProfile(baseURL, token, '/api/memory-profile/stats');
        const after = summarizeStats(afterRaw);

        iterations.push({
          index: iterationIndex + 1,
          name: iterationName,
          before,
          after,
          delta: diffStats(before, after)
        });
      }

      const before = iterations[0].before;
      const after = iterations[iterations.length - 1].after;

      results.push({
        name: scenario.name,
        description: scenario.description,
        specs: scenario.specs,
        grep: args.grep,
        before,
        after,
        delta: diffStats(before, after),
        iterations,
        repeatSummary: summarizeIterations(iterations),
        snapshots
      });
    }

    await stopChild(server);
    const heapProfiles = moveHeapProfiles(webAppDir, outputDir, startedAtMs);

    const report = {
      capturedAt: new Date().toISOString(),
      baseURL,
      distDir,
      db: target,
      scenarios,
      results,
      heapProfiles
    };

    writeFileSync(path.join(outputDir, 'report.json'), JSON.stringify(report, null, 2));
    writeFileSync(path.join(outputDir, 'report.md'), renderMarkdownReport(report));

    console.log(`\nreport written to ${outputDir}`);
    report.results
      .slice()
      .sort((left, right) => right.delta.heapUsedMb - left.delta.heapUsedMb)
      .forEach((scenario) => {
        console.log(
          `${scenario.name}: heap Δ ${scenario.delta.heapUsedMb} MB, rss Δ ${scenario.delta.rssMb} MB, repeats=${scenario.iterations.length}, heap slope=${scenario.repeatSummary.heapUsedSlopeMb} MB, rss slope=${scenario.repeatSummary.rssSlopeMb} MB, snapshots=${scenario.snapshots.length}`
        );
      });
  } finally {
    if (server) {
      await stopChild(server).catch(() => undefined);
    }
    dropSchema(normalizedBaseEnv, target.schema);
  }
};

await main();
