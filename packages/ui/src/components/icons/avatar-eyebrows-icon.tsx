import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon';
import type { SVGProps } from 'react';

function AvatarEyebrowsIconSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" {...props}>
      <path
        fill="currentColor"
        d="M11.41 17.29c1.73-1.42 3.96-2.15 6.2-2.03.55.03.98.5.95 1.06a1 1 0 0 1-1.05.95c-1.75-.09-3.51.48-4.87 1.6a1 1 0 1 1-1.23-1.55Zm11.08 0c1.36-1.12 3.12-1.69 4.87-1.6.56.03 1.03-.4 1.05-.95a1 1 0 0 0-.95-1.06c-2.24-.12-4.47.61-6.2 2.03a1 1 0 1 0 1.23 1.55Z"
      />
    </svg>
  );
}

export function avatarEyebrowsIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <AvatarEyebrowsIconSvg />
    </SvgIcon>
  );
}
