import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon';
import { avatarEyesIcon } from '../icons/avatar-eyes-icon';
import { avatarHairIcon } from '../icons/avatar-hair-icon';
import { avatarMouthIcon } from '../icons/avatar-mouth-icon';
import { avatarNoseIcon } from '../icons/avatar-nose-icon';
import { avatarShirtIcon } from '../icons/avatar-shirt-icon';
import { ProfileSmallIcon } from '../icons/profile-small-icon';
import type { CategoryId } from './avatar-editor.types';

function EyebrowsIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 40 40">
      <path
        fill="currentColor"
        d="M11.41 17.29c1.73-1.42 3.96-2.15 6.2-2.03.55.03.98.5.95 1.06a1 1 0 0 1-1.05.95c-1.75-.09-3.51.48-4.87 1.6a1 1 0 1 1-1.23-1.55Zm11.08 0c1.36-1.12 3.12-1.69 4.87-1.6.56.03 1.03-.4 1.05-.95a1 1 0 0 0-.95-1.06c-2.24-.12-4.47.61-6.2 2.03a1 1 0 1 0 1.23 1.55Z"
      />
    </SvgIcon>
  );
}

function GlassesIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 40 40">
      <path
        fill="currentColor"
        d="M13 14a5 5 0 1 0 3.54 8.54A4.97 4.97 0 0 0 18 19h4a5 5 0 1 0 1.46-3.54A4.97 4.97 0 0 0 22 18h-4a4.97 4.97 0 0 0-1.46-2.54A4.98 4.98 0 0 0 13 14Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm14 0a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"
      />
    </SvgIcon>
  );
}

function FacialHairIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 40 40">
      <path
        fill="currentColor"
        d="M12.5 23c.83 0 1.5.67 1.5 1.5 0 1.93 1.57 3.5 3.5 3.5.54 0 1.08-.12 1.56-.37l.94-.46.94.46c.48.25 1.02.37 1.56.37 1.93 0 3.5-1.57 3.5-3.5 0-.83.67-1.5 1.5-1.5S29 23.67 29 24.5c0 3.58-2.92 6.5-6.5 6.5-.87 0-1.73-.18-2.5-.53-.77.35-1.63.53-2.5.53-3.58 0-6.5-2.92-6.5-6.5 0-.83.67-1.5 1.5-1.5Z"
      />
    </SvgIcon>
  );
}

function FaceDetailsIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 40 40">
      <path
        fill="currentColor"
        d="M20 11a1.75 1.75 0 1 0 0 3.5A1.75 1.75 0 0 0 20 11Zm-4 4.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm7.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm-6.5 4a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"
      />
    </SvgIcon>
  );
}

function CheeksIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 40 40">
      <circle fill="currentColor" cx="13" cy="21.5" r="2.25" />
      <circle fill="currentColor" cx="27" cy="21.5" r="2.25" />
    </SvgIcon>
  );
}

export function getCategoryIcon(categoryId: CategoryId): (props: SvgIconProps) => React.JSX.Element {
  switch (categoryId) {
    case 'face':
      return ProfileSmallIcon;
    case 'hair':
      return avatarHairIcon;
    case 'nose':
      return avatarNoseIcon;
    case 'mouth':
      return avatarMouthIcon;
    case 'eyes':
      return avatarEyesIcon;
    case 'eyebrows':
      return EyebrowsIcon;
    case 'glasses':
      return GlassesIcon;
    case 'facial-hair':
      return FacialHairIcon;
    case 'face-details':
      return FaceDetailsIcon;
    case 'cheeks':
      return CheeksIcon;
    case 'clothes':
      return avatarShirtIcon;
  }
}
