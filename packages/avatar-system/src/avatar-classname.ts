import type { AvatarSelection } from './avatar.types';

export function buildAvatarClassName(
  selection: AvatarSelection,
  options?: { noBody?: boolean; extraClassName?: string },
) {
  const tokens = [
    options?.noBody ? 'no-body' : null,
    selection.earrings,
    selection.face,
    selection.eyes,
    selection.eyebrows,
    selection.glasses,
    selection.glasses,
    selection.facialHair,
    selection.mouth,
    selection.nose,
    selection.faceDetails,
    selection.cheeks,
    selection.hair,
    selection.skinColor,
    selection.hairColor,
    selection.glassesColor,
    selection.glassesTilesColor,
    selection.cheeksColor,
    selection.earringsColor,
    options?.extraClassName,
  ];

  return ['avatar', ...tokens.filter(Boolean)].join(' ');
}
