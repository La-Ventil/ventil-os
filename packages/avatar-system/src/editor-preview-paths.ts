import type { AvatarCategoryId } from './avatar.types';

export function getAvatarOptionPreviewPublicPath(
  categoryId: AvatarCategoryId,
  optionId: string,
  basePath: string
): string | null {
  if (optionId === 'none') {
    return null;
  }

  if (categoryId === 'clothes') {
    return `${basePath}/b-${optionId}.svg`;
  }

  if (categoryId === 'face') {
    const suffix = optionId.match(/^face-shape-(\d+)$/)?.[1];
    return suffix ? `${basePath}/b-face-${suffix}.svg` : null;
  }

  if (categoryId === 'earrings') {
    return `${basePath}/b-${optionId.replace(/^earrings-/, 'earring-')}.svg`;
  }

  return `${basePath}/b-${optionId}.svg`;
}
