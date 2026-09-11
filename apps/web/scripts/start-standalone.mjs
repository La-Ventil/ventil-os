// Production entry point for the standalone build.
// Next's server.js binds process.env.HOSTNAME, which containers set to their own hostname: bind HOST instead.
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const serverPath = path.join(webRoot, process.env.NEXT_DIST_DIR || '.next', 'standalone/apps/web/server.js');

if (!existsSync(serverPath)) {
  console.error(`No standalone server at ${serverPath}: run the web build first.`);
  process.exit(1);
}

// eslint-disable-next-line turbo/no-undeclared-env-vars -- runtime input of server.js, not a build input
process.env.HOSTNAME = process.env.HOST || '0.0.0.0';
await import(pathToFileURL(serverPath).href);
