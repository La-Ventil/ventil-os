import type { CSSProperties } from 'react';
import LabMap from './lab-map';

export type MapProps = {
  height?: number;
  ariaLabel?: string;
};

export default function Map({ height = 180, ariaLabel = 'Lab map' }: MapProps) {
  const style: CSSProperties = {
    height,
    width: '100%',
    display: 'block',
    objectFit: 'cover'
  };

  return <LabMap aria-label={ariaLabel} style={style} />;
}
