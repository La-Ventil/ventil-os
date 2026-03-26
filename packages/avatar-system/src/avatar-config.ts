import rawAvatarConfig from './avatar.json';
import type { AvatarCategoryId, AvatarColorSelectionKey, AvatarConfig, AvatarSelection } from './avatar.types';

export const avatarConfig = rawAvatarConfig satisfies AvatarConfig;

export function getAvatarCategories() {
  return avatarConfig.categories;
}

export function getAvatarEditorCategories() {
  return avatarConfig.categories.filter((category) => category.visible !== false) as Array<
    (typeof avatarConfig.categories)[number] & { id: AvatarCategoryId }
  >;
}

export function getAvatarCategory(categoryId: AvatarCategoryId) {
  const category = avatarConfig.categories.find(
    (candidate) => candidate.id === categoryId
  ) as ((typeof avatarConfig.categories)[number] & { id: AvatarCategoryId }) | undefined;

  if (!category) {
    throw new Error(`Unknown avatar category: ${categoryId}`);
  }

  return category;
}

export function getAvatarColorSelectionKey(
  categoryId: AvatarCategoryId,
  colorGroupId: string,
  colorGroupIndex: number
): AvatarColorSelectionKey {
  if (colorGroupIndex === 0) {
    return `${categoryId}-color` as AvatarColorSelectionKey;
  }

  return `${categoryId}-${colorGroupId}-color` as AvatarColorSelectionKey;
}

export function createInitialAvatarSelection(): AvatarSelection {
  const selection: Partial<AvatarSelection> = {};

  for (const rawCategory of avatarConfig.categories) {
    const categoryId = rawCategory.id as AvatarCategoryId;

    if (!rawCategory.optional && rawCategory.elements[0]) {
      selection[categoryId] = rawCategory.elements[0].id as AvatarSelection[typeof categoryId];
    }

    for (const [index, colorGroup] of (rawCategory.colorGroups ?? []).entries()) {
      const firstColor = colorGroup.colors[0];
      if (!firstColor) {
        continue;
      }

      const selectionKey = getAvatarColorSelectionKey(categoryId, colorGroup.id, index);
      selection[selectionKey] = firstColor.id as AvatarSelection[typeof selectionKey];
    }
  }

  return selection as AvatarSelection;
}

export function resolveAvatarSelection(input?: unknown): AvatarSelection {
  const defaults = createInitialAvatarSelection();

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return defaults;
  }

  const candidate = input as Record<string, unknown>;
  const selection = { ...defaults } as Record<string, string | undefined>;

  for (const rawCategory of avatarConfig.categories) {
    const categoryId = rawCategory.id as AvatarCategoryId;
    const allowedElementIds = new Set(rawCategory.elements.map((element) => element.id));
    const rawValue = candidate[categoryId];

    if (typeof rawValue === 'string' && allowedElementIds.has(rawValue)) {
      selection[categoryId] = rawValue;
    } else if (rawCategory.optional) {
      selection[categoryId] = undefined;
    }

    for (const [index, colorGroup] of (rawCategory.colorGroups ?? []).entries()) {
      const selectionKey = getAvatarColorSelectionKey(categoryId, colorGroup.id, index);
      const allowedColorIds = new Set(colorGroup.colors.map((color) => color.id));
      const rawColorValue = candidate[selectionKey];

      if (typeof rawColorValue === 'string' && allowedColorIds.has(rawColorValue)) {
        selection[selectionKey] = rawColorValue;
      }
    }
  }

  return selection as AvatarSelection;
}
