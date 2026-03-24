import type { AvatarSelection } from '@repo/avatar-system';

export type CategoryId =
  | 'face'
  | 'hair'
  | 'nose'
  | 'mouth'
  | 'eyes'
  | 'eyebrows'
  | 'glasses'
  | 'facial-hair'
  | 'face-details'
  | 'cheeks'
  | 'clothes';

export type SelectionKeyByCategory = {
  face: 'face';
  hair: 'hair';
  nose: 'nose';
  mouth: 'mouth';
  eyes: 'eyes';
  eyebrows: 'eyebrows';
  glasses: 'glasses';
  'facial-hair': 'facialHair';
  'face-details': 'faceDetails';
  cheeks: 'cheeks';
  clothes: 'clothes';
};

export type ColorGroupConfig = {
  groupId: string;
  selectionKey: keyof AvatarSelection;
  titleKey?: string;
};

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
  selectionKey: keyof AvatarSelection;
  options: AvatarColorOption[];
};

export const DISPLAYED_CATEGORY_IDS: CategoryId[] = [
  'face',
  'hair',
  'nose',
  'mouth',
  'eyes',
  'eyebrows',
  'glasses',
  'facial-hair',
  'face-details',
  'cheeks',
  'clothes'
];

export const OPTIONAL_CATEGORY_IDS = new Set<CategoryId>(['glasses', 'facial-hair', 'face-details', 'cheeks']);

export const COLOR_GROUPS_BY_CATEGORY: Partial<Record<CategoryId, ColorGroupConfig[]>> = {
  face: [{ groupId: 'skin', selectionKey: 'skinColor' }],
  hair: [{ groupId: 'hair', selectionKey: 'hairColor' }],
  glasses: [
    { groupId: 'frame', selectionKey: 'glassesColor', titleKey: 'categories.glasses.colorGroups.frame' },
    { groupId: 'tiles', selectionKey: 'glassesTilesColor', titleKey: 'categories.glasses.colorGroups.tiles' }
  ],
  cheeks: [{ groupId: 'cheeks', selectionKey: 'cheeksColor' }]
};

export const SELECTION_KEY_BY_CATEGORY: SelectionKeyByCategory = {
  face: 'face',
  hair: 'hair',
  nose: 'nose',
  mouth: 'mouth',
  eyes: 'eyes',
  eyebrows: 'eyebrows',
  glasses: 'glasses',
  'facial-hair': 'facialHair',
  'face-details': 'faceDetails',
  cheeks: 'cheeks',
  clothes: 'clothes'
};

export const INITIAL_SELECTION: AvatarSelection = {
  face: 'face-shape-1',
  hair: 'hair-204',
  nose: 'nose-1',
  mouth: 'mouth-5',
  eyes: 'eyes-1',
  eyebrows: 'eyebrows-1',
  clothes: 'clothes-1',
  skinColor: 'skin-color-4',
  hairColor: 'hair-color-32',
  glassesColor: 'glasses-color-1',
  glassesTilesColor: 'glasses-tiles-color-1',
  cheeksColor: 'cheeks-color-1',
  earringsColor: 'earrings-color-1'
};
