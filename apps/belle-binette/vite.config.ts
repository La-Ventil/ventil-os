import path from 'node:path';
import { defineConfig } from 'vite';

function getAssetDirectory(originalFileName: string): string {
  const normalizedPath = originalFileName.split(path.sep).join('/');

  if (normalizedPath.includes('/src/images/renderer/') || normalizedPath.includes('/images/renderer/')) {
    return 'assets/images/renderer';
  }

  if (normalizedPath.includes('/src/images/editor/previews/') || normalizedPath.includes('/images/editor/previews/')) {
    return 'assets/images/editor/previews';
  }

  if (normalizedPath.includes('/src/images/editor/categories/') || normalizedPath.includes('/images/editor/categories/')) {
    return 'assets/images/editor/categories';
  }

  if (normalizedPath.includes('/font/')) {
    return 'assets/font';
  }

  return 'assets';
}

export default defineConfig({
  build: {
    assetsInlineLimit: 0,
    minify: false,
    cssMinify: false,
    sourcemap: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          const originalFileName = assetInfo.originalFileNames?.[0] ?? assetInfo.names?.[0] ?? assetInfo.name ?? '';
          const assetDirectory = getAssetDirectory(originalFileName);
          return `${assetDirectory}/[name][extname]`;
        }
      }
    }
  }
});
