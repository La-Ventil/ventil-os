import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const editorImagesDir = resolve(packageRootDir, 'src/images/editor');

export function resolveAvatarEditorAssetPath(...segments: string[]): string {
  return resolve(editorImagesDir, ...segments);
}

export function resolveAvatarEditorPreviewPath(filename: string): string {
  return resolveAvatarEditorAssetPath('previews', filename);
}

export function resolveAvatarEditorCategoryIconPath(filename: string): string {
  return resolveAvatarEditorAssetPath('categories', filename);
}
