// `output: 'standalone'` leaves static assets out of the server bundle: copy them next to server.js.
import { cpSync, existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = process.env.NEXT_DIST_DIR || '.next';
const standaloneWebRoot = path.join(webRoot, distDir, 'standalone/apps/web');

if (!existsSync(path.join(standaloneWebRoot, 'server.js'))) {
  console.error(`No server.js in ${standaloneWebRoot}: the standalone output layout changed.`);
  process.exit(1);
}

cpSync(path.join(webRoot, distDir, 'static'), path.join(standaloneWebRoot, distDir, 'static'), { recursive: true });
cpSync(path.join(webRoot, 'public'), path.join(standaloneWebRoot, 'public'), { recursive: true });
