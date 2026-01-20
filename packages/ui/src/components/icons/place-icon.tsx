import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import type { SVGProps } from 'react';

function PlaceIconSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55 55" {...props}>
      <path
        fill="currentColor"
        d="M24,25v4h-4v-4h4M24,24h-4c-.55,0-1,.45-1,1v4c0,.55.45,1,1,1h4c.55,0,1-.45,1-1v-4c0-.55-.45-1-1-1h0Z"
      />
      <path
        fill="currentColor"
        d="M33,31c1.1,0,2,.9,2,2s-.9,2-2,2-2-.9-2-2,.9-2,2-2M33,30c-1.65,0-3,1.35-3,3s1.35,3,3,3,3-1.35,3-3-1.35-3-3-3h0Z"
      />
      <path
        fill="currentColor"
        d="M27.5,16.5l10.5,6v16h-21v-16l10.5-6M27.5,14.5c-.34,0-.68.09-.99.26l-10.5,6c-.62.36-1.01,1.02-1.01,1.74v16c0,1.1.9,2,2,2h21c1.1,0,2-.9,2-2v-16c0-.72-.38-1.38-1.01-1.74l-10.5-6c-.31-.18-.65-.26-.99-.26h0Z"
      />
    </svg>
  );
}

export function placeIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <PlaceIconSvg />
    </SvgIcon>
  );
}
