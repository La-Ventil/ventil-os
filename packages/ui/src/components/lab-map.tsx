import type { SVGProps } from 'react';

export default function LabMap(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 320 180" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="320" height="180" fill="#1f2433" />
      <rect x="10" y="10" width="300" height="160" fill="#242a3b" stroke="#2f3650" strokeWidth="2" />
      <rect x="20" y="20" width="90" height="40" fill="#2b3147" />
      <rect x="120" y="20" width="80" height="40" fill="#2b3147" />
      <rect x="210" y="20" width="90" height="40" fill="#2b3147" />
      <rect x="20" y="70" width="60" height="40" fill="#2b3147" />
      <rect x="90" y="70" width="60" height="40" fill="#2b3147" />
      <rect x="160" y="70" width="60" height="40" fill="#2b3147" />
      <rect x="230" y="70" width="70" height="40" fill="#2b3147" />
      <rect x="20" y="120" width="70" height="40" fill="#2b3147" />
      <rect x="100" y="120" width="60" height="40" fill="#2b3147" />
      <rect x="170" y="120" width="60" height="40" fill="#2b3147" />
      <rect x="240" y="120" width="60" height="40" fill="#2b3147" />
      <rect x="135" y="105" width="50" height="10" fill="#3c4563" />
      <rect x="150" y="115" width="20" height="10" fill="#3c4563" />
    </svg>
  );
}
