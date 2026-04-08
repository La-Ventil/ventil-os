import rawAvatarConfig from './avatar.json';
import type {
  AvatarCategoryConfig,
  AvatarCategoryId,
  AvatarColorGroupConfig,
  AvatarColorSelectionKey,
  AvatarConfig,
  AvatarSelectionDraft,
  AvatarSelection
} from './avatar.types';

export const avatarConfig = rawAvatarConfig satisfies AvatarConfig;

export async function loadAvatarConfig(url: string): Promise<AvatarConfig> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unable to load avatar config from ${url}: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<AvatarConfig>;
}

export function getAvatarCategories() {
  return avatarConfig.categories;
}

export function getAvatarEditorCategories() {
  return avatarConfig.categories as Array<(typeof avatarConfig.categories)[number] & { id: AvatarCategoryId }>;
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
): AvatarColorSelectionKey {
  if (colorGroupId === categoryId) {
    return `${colorGroupId}-color` as AvatarColorSelectionKey;
  }

  return `${categoryId}-${colorGroupId}-color` as AvatarColorSelectionKey;
}

export function getAvatarCatalogColorSelectionKey(
  category: AvatarCategoryConfig,
  colorGroup: AvatarColorGroupConfig
): AvatarColorSelectionKey {
  return getAvatarColorSelectionKey(category.id as AvatarCategoryId, colorGroup.id);
}

function getLegacyAvatarColorSelectionKey(
  categoryId: AvatarCategoryId,
  colorGroupId: string,
  colorGroupIndex: number
): string {
  if (colorGroupIndex === 0) {
    return `${categoryId}-color`;
  }

  if (colorGroupId === categoryId) {
    return `${colorGroupId}-color`;
  }

  return `${categoryId}-${colorGroupId}-color`;
}

export function createInitialAvatarSelection(): AvatarSelection {
  return createInitialAvatarSelectionFromConfig(avatarConfig) as AvatarSelection;
}

export function createInitialAvatarSelectionFromConfig(config: AvatarConfig): AvatarSelectionDraft {
  const selection: AvatarSelectionDraft = {};

  for (const rawCategory of config.categories) {
    const categoryId = rawCategory.id as AvatarCategoryId;

    if (!rawCategory.optional && rawCategory.elements[0]) {
      selection[categoryId] = rawCategory.elements[0].id as AvatarSelection[typeof categoryId];
    }

    for (const colorGroup of rawCategory.colorGroups ?? []) {
      const firstColor = colorGroup.colors[0];
      if (!firstColor) {
        continue;
      }

      const selectionKey = getAvatarColorSelectionKey(categoryId, colorGroup.id);
      selection[selectionKey] = firstColor.id as AvatarSelection[typeof selectionKey];
    }
  }

  return selection;
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
      const selectionKey = getAvatarColorSelectionKey(categoryId, colorGroup.id);
      const allowedColorIds = new Set(colorGroup.colors.map((color) => color.id));
      const legacySelectionKey = getLegacyAvatarColorSelectionKey(categoryId, colorGroup.id, index);
      const rawColorValue = candidate[selectionKey] ?? candidate[legacySelectionKey];

      if (typeof rawColorValue === 'string' && allowedColorIds.has(rawColorValue)) {
        selection[selectionKey] = rawColorValue;
      }
    }
  }

  return selection as AvatarSelection;
}
