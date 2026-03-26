import type { AvatarCategoryId, AvatarColorSelectionKey, AvatarSelection } from '@repo/avatar-system';

export type CategoryId = AvatarCategoryId;

export type AvatarOption = {
  id: string;
  previewSelection: AvatarSelection;
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
