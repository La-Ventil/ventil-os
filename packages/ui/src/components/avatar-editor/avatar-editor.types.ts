import type { AvatarCategoryId, AvatarColorSelectionKey } from '@repo/avatar-system';

export type CategoryId = AvatarCategoryId;

export type AvatarOption = {
  id: string;
  selected: boolean;
};

export type AvatarColorOption = {
  id: string;
  selected: boolean;
};

export type AvatarColorSection = {
  groupId: string;
  title: string;
  selectionKey: AvatarColorSelectionKey;
  options: AvatarColorOption[];
};

export type AvatarOptionPreviewResolver = (categoryId: AvatarCategoryId, optionId: string) => string | null;
