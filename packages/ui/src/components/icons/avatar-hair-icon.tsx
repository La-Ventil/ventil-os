import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import type { SVGProps } from 'react';

function AvatarHairIconSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 40 40" {...props}>   
  <path fill="currentColor" d="M21.5,5h-2c-9,0-12,7.6-12,12v3c0,1.59.48,3.07,1.29,4.31,1.07,4.4,5.04,7.69,9.76,7.69h2.88c4.73,0,8.69-3.28,9.76-7.69.81-1.25,1.29-2.72,1.29-4.31v-3c0-4.4-3-12-11-12ZM29.5,21.94c0,4.44-3.61,8.06-8.06,8.06h-2.88c-4.44,0-8.06-3.61-8.06-8.06v-2.88c0-1.67.51-3.23,1.39-4.52.46-.54.97-1.02,1.53-1.45,1.78-.03,4.32-.38,5.47-2.03.79,1.63,3.18,4.6,10,4.9.4.95.62,2,.62,3.1v2.88Z"/>
</svg>
  );
}

export function avatarHairIcon(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 40 40" {...props}>
      <AvatarHairIconSvg />
    </SvgIcon>
  );
}
