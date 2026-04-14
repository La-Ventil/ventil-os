import { execFileSync, execSync } from 'node:child_process';

const parseArgs = (argv) => {
  const values = new Map();

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;

    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      values.set(key, 'true');
      continue;
    }

    values.set(key, next);
    index += 1;
  }

  return values;
};

const args = parseArgs(process.argv.slice(2));
const baseRef = args.get('base') ?? process.env.TARGETED_TESTS_BASE ?? 'origin/main';
const headRef = args.get('head') ?? process.env.TARGETED_TESTS_HEAD ?? 'HEAD';

const diffOutput = execFileSync('git', ['diff', '--name-only', '--diff-filter=ACMR', `${baseRef}...${headRef}`], {
  encoding: 'utf8'
});

const changedFiles = diffOutput
  .split('\n')
  .map((entry) => entry.trim())
  .filter(Boolean);

const matchesPrefix = (value, prefix) => value === prefix || value.startsWith(`${prefix}/`);
const changed = (...prefixes) => changedFiles.some((file) => prefixes.some((prefix) => matchesPrefix(file, prefix)));

const workspaceConfigChanged = changedFiles.some((file) =>
  ['package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'turbo.json'].includes(file)
);

const webRelatedChanged = changed(
  'apps/web',
  'packages/application',
  'packages/avatar-system',
  'packages/crypto',
  'packages/db',
  'packages/domain',
  'packages/form',
  'packages/storage',
  'packages/ui'
);

const tasks = [];
const taskIds = new Set();

const addTask = (id, command, reason) => {
  if (taskIds.has(id)) {
    return;
  }

  taskIds.add(id);
  tasks.push({ id, command, reason });
};

if (workspaceConfigChanged) {
  addTask('workspace-test', 'pnpm test', 'workspace config changed');
} else {
  if (changed('packages/domain')) {
    addTask('domain-test', 'pnpm --filter @repo/domain test:unit', 'domain package changed');
  }

  if (changed('packages/application')) {
    addTask('application-test', 'pnpm --filter @repo/application test:unit', 'application package changed');
  }

  if (changed('packages/form')) {
    addTask('form-test', 'pnpm --filter @repo/form test', 'form package changed');
  }

  if (changed('packages/db')) {
    addTask('db-test', 'pnpm --filter @repo/db test', 'db package changed');
  }

  if (changed('packages/logger')) {
    addTask('logger-test', 'pnpm --filter @repo/logger test', 'logger package changed');
  }

  if (changed('apps/sms')) {
    addTask('sms-test', 'pnpm --filter sms test', 'sms app changed');
  }
}

if (webRelatedChanged) {
  addTask('web-smoke', 'pnpm --filter web test:e2e:smoke', 'web or shared runtime surface changed');
}

if (changedFiles.length === 0) {
  console.log(`No changed files between ${baseRef} and ${headRef}.`);
  process.exit(0);
}

console.log(`Changed files between ${baseRef} and ${headRef}:`);
for (const file of changedFiles) {
  console.log(`- ${file}`);
}

if (tasks.length === 0) {
  console.log('No targeted tests required for this diff.');
  process.exit(0);
}

console.log('Planned targeted test commands:');
for (const task of tasks) {
  console.log(`- ${task.command} (${task.reason})`);
}

for (const task of tasks) {
  console.log(`\n> ${task.command}`);
  execSync(task.command, { stdio: 'inherit' });
}
