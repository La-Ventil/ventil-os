import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import type { SVGProps } from 'react';

function AdminStatIconSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55 55" {...props}>
  <rect fill="currentColor" x="26" y="36.5" width="2" height="4" rx="1" ry="1"/>
  <rect fill="currentColor" x="29" y="30.5" width="2" height="10" rx="1" ry="1"/>
  <rect fill="currentColor" x="32" y="33.5" width="2" height="7" rx="1" ry="1"/>
  <rect fill="currentColor" x="35" y="28.5" width="2" height="12" rx="1" ry="1"/>
  <rect fill="currentColor" x="38" y="30" width="2" height="10.5" rx="1" ry="1"/>
  <path fill="currentColor" d="M24,25v4h-4v-4h4M24,24h-4c-.55,0-1,.45-1,1v4c0,.55.45,1,1,1h4c.55,0,1-.45,1-1v-4c0-.55-.45-1-1-1h0Z"/>
  <path fill="currentColor" d="M23,38.5h-6v-16l10.5-6,10.5,6v4.5c0,.55.45,1,1,1h0c.55,0,1-.45,1-1v-4.5c0-.72-.38-1.38-1.01-1.74l-10.5-6c-.31-.18-.65-.26-.99-.26s-.68.09-.99.26l-10.5,6c-.62.36-1.01,1.02-1.01,1.74v16c0,1.1.9,2,2,2h6c.55,0,1-.45,1-1h0c0-.55-.45-1-1-1Z"/>
</svg>
  );
}

export function adminStatIcon(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 55 55" {...props}>
      <AdminStatIconSvg />
    </SvgIcon>
  );
}
