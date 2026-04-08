import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { defineConfig } from 'vite';

const assetDirectories = [
  { match: '/images/renderer/', directory: 'images/renderer' },
  { match: '/images/editor/previews/', directory: 'images/editor/previews' },
  { match: '/images/editor/categories/', directory: 'images/editor/categories' },
  { match: '/font/', directory: 'font' }
];

function resolveAssetDirectory(originalFileName: string): string {
  const normalizedPath = originalFileName.split(path.sep).join('/');
  return assetDirectories.find(({ match }) => normalizedPath.includes(match))?.directory ?? '';
}

export default defineConfig({
  plugins: [
    {
      name: 'copy-avatar-catalog',
      async closeBundle() {
        const source = path.resolve(import.meta.dirname, '../../packages/avatar-system/dist/avatar.json');
        const destinationDirectory = path.resolve(import.meta.dirname, 'dist');
        const destination = path.join(destinationDirectory, 'avatar.json');

        await mkdir(destinationDirectory, { recursive: true });
        await copyFile(source, destination);
      }
    }
  ],
  build: {
    assetsInlineLimit: 0,
    minify: false,
    cssMinify: false,
    modulePreload: false,
    sourcemap: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        entryFileNames: 'script.js',
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          const originalFileName = assetInfo.originalFileNames?.[0] ?? assetInfo.names?.[0] ?? assetInfo.name ?? '';
          const assetDirectory = resolveAssetDirectory(originalFileName);
          return assetDirectory ? `${assetDirectory}/[name][extname]` : '[name][extname]';
        }
      }
    }
  }
});
