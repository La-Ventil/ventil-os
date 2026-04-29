import { mkdirSync } from 'node:fs';
import path from 'node:path';

const MEMORY_PROFILE_HEADER = 'x-memory-profile-token';

const isEnabled = () => process.env.MEMORY_PROFILE_ENABLED === '1';

const getToken = () => process.env.MEMORY_PROFILE_TOKEN?.trim() || '';

export const isMemoryProfileEnabled = (): boolean => isEnabled();

export const assertMemoryProfileAccess = (request: Request): Response | null => {
  if (!isEnabled()) {
    return Response.json({ message: 'Memory profiling is disabled.' }, { status: 404 });
  }

  const token = getToken();
  if (!token) {
    return Response.json({ message: 'Memory profiling token is not configured.' }, { status: 500 });
  }

  if (request.headers.get(MEMORY_PROFILE_HEADER) !== token) {
    return Response.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  return null;
};

export const resolveMemoryProfileOutputDir = (): string => {
  const outputDir = process.env.MEMORY_PROFILE_OUTPUT_DIR?.trim() || '.memory-profiles/runtime';
  const resolved = path.resolve(process.cwd(), outputDir);
  mkdirSync(resolved, { recursive: true });
  return resolved;
};

export const sanitizeMemoryProfileLabel = (value?: string | null): string =>
  (value ?? 'snapshot')
    .trim()
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'snapshot';
