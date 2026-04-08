export type AvatarCategoryId =
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
  | 'earrings';

export type AvatarColorSelectionKey =
  | 'face-skin-color'
  | 'hair-color'
  | 'glasses-frame-color'
  | 'glasses-tiles-color'
  | 'cheeks-color'
  | 'earrings-color';

export type AvatarSelection = {
  face: string;
  eyes: string;
  eyebrows: string;
  mouth: string;
  nose: string;
  hair: string;
  earrings?: string;
  glasses?: string;
  'facial-hair'?: string;
  'face-details'?: string;
  cheeks?: string;
  'face-skin-color': string;
  'hair-color': string;
  'glasses-frame-color'?: string;
  'glasses-tiles-color'?: string;
  'cheeks-color'?: string;
  'earrings-color'?: string;
};

export type AvatarSelectionDraft = Partial<AvatarSelection> & Record<string, string | undefined>;

export type AvatarConfig = typeof import('./avatar.json');

export type AvatarCategoryConfig = AvatarConfig['categories'][number];

export type AvatarElementConfig = AvatarCategoryConfig['elements'][number];

export type AvatarColorGroupConfig = NonNullable<AvatarCategoryConfig['colorGroups']>[number];

export type AvatarColorConfig = AvatarColorGroupConfig['colors'][number];
