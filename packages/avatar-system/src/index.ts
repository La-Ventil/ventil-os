export {
  avatarConfig,
  createInitialAvatarSelection,
  createInitialAvatarSelectionFromConfig,
  getAvatarCategories,
  getAvatarCategory,
  getAvatarCatalogColorSelectionKey,
  getAvatarColorSelectionKey,
  getAvatarEditorCategories,
  loadAvatarConfig,
  resolveAvatarSelection
} from './avatar-config';
export { buildAvatarClassName } from './avatar-classname';
export { createAvatarElement } from './avatar-dom';
export { getAvatarMarkup } from './avatar-markup';
export { getAvatarOptionPreviewPublicPath } from './editor-preview-paths';
export type {
  AvatarCategoryConfig,
  AvatarCategoryId,
  AvatarColorConfig,
  AvatarColorGroupConfig,
  AvatarColorSelectionKey,
  AvatarConfig,
  AvatarElementConfig,
  AvatarSelectionDraft,
  AvatarSelection
} from './avatar.types';
