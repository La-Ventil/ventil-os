import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon';
import type { SVGProps } from 'react';

function AvatarCheeksIconSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" {...props}>
      <circle fill="currentColor" cx="13" cy="21.5" r="2.25" />
      <circle fill="currentColor" cx="27" cy="21.5" r="2.25" />
    </svg>
  );
}

export function avatarCheeksIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <AvatarCheeksIconSvg />
    </SvgIcon>
  );
}
