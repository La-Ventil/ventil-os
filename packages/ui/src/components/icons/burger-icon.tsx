import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import type { SVGProps } from 'react';

function BurgerIconSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55 55" {...props}>
      <rect x="20" y="20" width="20" height="2" rx="1" fill="currentColor" />
      <rect x="20" y="27" width="20" height="2" rx="1" fill="currentColor" />
      <rect x="20" y="34" width="20" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

export function BurgerIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <BurgerIconSvg />
    </SvgIcon>
  );
}
