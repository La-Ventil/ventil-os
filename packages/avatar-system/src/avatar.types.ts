export type AvatarSelection = {
  face: string;
  eyes: string;
  eyebrows: string;
  mouth: string;
  nose: string;
  hair: string;
  skinColor: string;
  hairColor: string;
  earrings?: string;
  glasses?: string;
  glassesColor?: string;
  glassesTilesColor?: string;
  facialHair?: string;
  faceDetails?: string;
  cheeks?: string;
  cheeksColor?: string;
  earringsColor?: string;
};

export type AvatarConfig = typeof import('./avatar.json');
