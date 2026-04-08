import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon';
import type { SVGProps } from 'react';

function AvatarFacialHairIconSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" {...props}>
      <path
        fill="currentColor"
        d="M12.5 23c.83 0 1.5.67 1.5 1.5 0 1.93 1.57 3.5 3.5 3.5.54 0 1.08-.12 1.56-.37l.94-.46.94.46c.48.25 1.02.37 1.56.37 1.93 0 3.5-1.57 3.5-3.5 0-.83.67-1.5 1.5-1.5S29 23.67 29 24.5c0 3.58-2.92 6.5-6.5 6.5-.87 0-1.73-.18-2.5-.53-.77.35-1.63.53-2.5.53-3.58 0-6.5-2.92-6.5-6.5 0-.83.67-1.5 1.5-1.5Z"
      />
    </svg>
  );
}

export function avatarFacialHairIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <AvatarFacialHairIconSvg />
    </SvgIcon>
  );
}
