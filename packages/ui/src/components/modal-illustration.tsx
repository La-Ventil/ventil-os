'use client';

import type { JSX, ReactNode } from 'react';

export type ModalIllustrationProps = {
  src?: string | null;
  alt: string;
  fallback: ReactNode;
  className?: string;
  imageClassName?: string;
};

export default function ModalIllustration({
  src,
  alt,
  fallback,
  className,
  imageClassName
}: ModalIllustrationProps): JSX.Element {
  return <div className={className}>{src ? <img src={src} alt={alt} className={imageClassName} /> : fallback}</div>;
}
