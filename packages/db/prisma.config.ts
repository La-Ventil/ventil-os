import { defineConfig } from 'prisma/config';

// The Prisma CLI no longer loads .env itself. Variables already set in the environment keep precedence.
try {
  process.loadEnvFile();
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts'
  },
  // Left optional so `prisma generate` runs without a database, as type checks do.
  datasource: {
    url: process.env.DATABASE_URL
  }
});
