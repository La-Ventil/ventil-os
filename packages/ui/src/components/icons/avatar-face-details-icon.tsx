import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon';
import type { SVGProps } from 'react';

function AvatarFaceDetailsIconSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" {...props}>
      <path
        fill="currentColor"
        d="M20 11a1.75 1.75 0 1 0 0 3.5A1.75 1.75 0 0 0 20 11Zm-4 4.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm7.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm-6.5 4a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"
      />
    </svg>
  );
}

export function avatarFaceDetailsIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <AvatarFaceDetailsIconSvg />
    </SvgIcon>
  );
}
