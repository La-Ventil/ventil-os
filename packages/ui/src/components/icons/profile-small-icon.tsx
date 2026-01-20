import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import type { SVGProps } from 'react';

function ProfileSmallIconSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" {...props}>
      <path
        fill="currentColor"
        d="M21.44,9h-2.88c-5.55,0-10.06,4.51-10.06,10.06v2.88c0,5.55,4.51,10.06,10.06,10.06h2.88c5.55,0,10.06-4.51,10.06-10.06v-2.88c0-5.55-4.51-10.06-10.06-10.06ZM29.5,21.94c0,4.44-3.61,8.06-8.06,8.06h-2.88c-4.44,0-8.06-3.61-8.06-8.06v-2.88c0-4.44,3.61-8.06,8.06-8.06h2.88c4.44,0,8.06,3.61,8.06,8.06v2.88Z"
      />
      <path
        fill="currentColor"
        d="M22.34,23.53c-1.51.52-3.24.52-4.76,0-.26-.09-.54.05-.63.31-.09.26.05.55.31.63.86.29,1.78.44,2.7.44s1.84-.15,2.7-.44c.26-.09.4-.37.31-.63-.09-.26-.37-.4-.63-.31Z"
      />
      <circle fill="currentColor" cx="14.75" cy="19.75" r="1.75" />
      <circle fill="currentColor" cx="25.25" cy="19.75" r="1.75" />
    </svg>
  );
}

export function ProfileSmallIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <ProfileSmallIconSvg />
    </SvgIcon>
  );
}
