import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import type { SVGProps } from 'react';

function LogoIconSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 75" {...props}>
      <polygon fill="#317bf4" className="cls-1" points="0 0 0 75 10.1 75 10 49 25 64 40 49 39.9 75 50 75 50 0 0 0" />
    </svg>
  );
}

export function LogoIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <LogoIconSvg />
    </SvgIcon>
  );
}
