import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon';
import type { SVGProps } from 'react';

function AvatarGlassesIconSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" {...props}>
      <path
        fill="currentColor"
        d="M13 14a5 5 0 1 0 3.54 8.54A4.97 4.97 0 0 0 18 19h4a5 5 0 1 0 1.46-3.54A4.97 4.97 0 0 0 22 18h-4a4.97 4.97 0 0 0-1.46-2.54A4.98 4.98 0 0 0 13 14Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm14 0a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"
      />
    </svg>
  );
}

export function avatarGlassesIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <AvatarGlassesIconSvg />
    </SvgIcon>
  );
}
