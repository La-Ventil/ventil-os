import { avatarCheeksIcon } from '../icons/avatar-cheeks-icon';
import { avatarEarringsIcon } from '../icons/avatar-earrings-icon';
import { avatarEyebrowsIcon } from '../icons/avatar-eyebrows-icon';
import { avatarEyesIcon } from '../icons/avatar-eyes-icon';
import { avatarFaceDetailsIcon } from '../icons/avatar-face-details-icon';
import { avatarFacialHairIcon } from '../icons/avatar-facial-hair-icon';
import { avatarGlassesIcon } from '../icons/avatar-glasses-icon';
import { avatarHairIcon } from '../icons/avatar-hair-icon';
import { avatarMouthIcon } from '../icons/avatar-mouth-icon';
import { avatarNoseIcon } from '../icons/avatar-nose-icon';
import { ProfileSmallIcon } from '../icons/profile-small-icon';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import type { CategoryId } from './avatar-editor.types';

const categoryIcons: Record<CategoryId, (props: SvgIconProps) => React.JSX.Element> = {
  face: ProfileSmallIcon,
  hair: avatarHairIcon,
  nose: avatarNoseIcon,
  mouth: avatarMouthIcon,
  eyes: avatarEyesIcon,
  eyebrows: avatarEyebrowsIcon,
  glasses: avatarGlassesIcon,
  'facial-hair': avatarFacialHairIcon,
  'face-details': avatarFaceDetailsIcon,
  cheeks: avatarCheeksIcon,
  earrings: avatarEarringsIcon
};

export function getCategoryIcon(categoryId: CategoryId): (props: SvgIconProps) => React.JSX.Element {
  return categoryIcons[categoryId];
}
