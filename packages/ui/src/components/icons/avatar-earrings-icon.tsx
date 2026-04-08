import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon';
import type { SVGProps } from 'react';

function AvatarEarringsIconSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" {...props}>
      <circle fill="currentColor" cx="14" cy="16" r="2.5" />
      <circle fill="currentColor" cx="26" cy="16" r="2.5" />
      <path
        fill="currentColor"
        d="M14 18.5a1 1 0 0 1 1 1V23a2 2 0 1 1-2 0v-3.5a1 1 0 0 1 1-1Zm12 0a1 1 0 0 1 1 1V23a2 2 0 1 1-2 0v-3.5a1 1 0 0 1 1-1Z"
      />
    </svg>
  );
}

export function avatarEarringsIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <AvatarEarringsIconSvg />
    </SvgIcon>
  );
}
