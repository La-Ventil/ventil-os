export type E2EDatabaseTarget = {
  slot: string;
  schema: string;
  url: string;
};

const DEFAULT_SLOT = 'default';

export const resolveE2EDatabaseTarget = (): E2EDatabaseTarget => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to run Playwright E2E tests.');
  }

  const slot = process.env.PLAYWRIGHT_DB_SLOT?.trim() || DEFAULT_SLOT;
  const schema = `e2e_${slot.replace(/[^a-zA-Z0-9_]/g, '_')}`;
  const url = new URL(databaseUrl);
  url.searchParams.set('schema', schema);

  return { slot, schema, url: url.toString() };
};
