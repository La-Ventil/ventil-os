import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = resolve(rootDir, 'dist');

rmSync(resolve(distDir, 'images'), { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });
cpSync(resolve(rootDir, 'src/avatar.json'), resolve(distDir, 'avatar.json'));
cpSync(resolve(rootDir, 'src/images'), resolve(distDir, 'images'), { recursive: true });
