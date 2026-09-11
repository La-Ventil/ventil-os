import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';

export type { Prisma } from './generated/prisma/client';
export * from './generated/prisma/enums';
export { PrismaClient };

// Prisma 5's query engine read these URL parameters. pg ignores or reinterprets them,
// so they are applied to the pool here and stripped from the connection string.
const ENGINE_URL_PARAMETERS = ['schema', 'sslmode', 'connection_limit', 'statement_cache_size'];

// Prisma 5's pool size on a 1 vCPU instance (2 × CPUs + 1), where pg would open up to 10.
const DEFAULT_CONNECTION_LIMIT = 3;

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

// Without sslmode, remote hosts get TLS as they did with Prisma 5. Certificates are verified only on request:
// the Clever Cloud PostgreSQL add-on serves a self-signed one.
function resolveSsl(sslmode: string | null, hostname: string) {
  switch (sslmode) {
    case 'disable':
      return false;
    case 'verify-ca':
    case 'verify-full':
      return true;
    case null:
      return LOOPBACK_HOSTS.has(hostname) ? false : { rejectUnauthorized: false };
    default:
      return { rejectUnauthorized: false };
  }
}

export function createPrismaClient(databaseUrl = process.env.DATABASE_URL): PrismaClient {
  // Importing @repo/db must not throw without a database (builds, unit tests): the first query reports it instead.
  if (!databaseUrl) {
    return new PrismaClient({ adapter: new PrismaPg({ max: DEFAULT_CONNECTION_LIMIT }) });
  }

  const url = new URL(databaseUrl);
  const schema = url.searchParams.get('schema') ?? undefined;
  const max = Number(url.searchParams.get('connection_limit')) || DEFAULT_CONNECTION_LIMIT;
  const ssl = resolveSsl(url.searchParams.get('sslmode'), url.hostname);
  ENGINE_URL_PARAMETERS.forEach((name) => url.searchParams.delete(name));

  const adapter = new PrismaPg(
    {
      connectionString: url.toString(),
      max,
      ssl,
      // Raw SQL names tables without a schema, so the session search_path must follow the adapter's schema.
      options: schema ? `-c search_path="${schema}"` : undefined
    },
    { schema }
  );

  return new PrismaClient({ adapter });
}
