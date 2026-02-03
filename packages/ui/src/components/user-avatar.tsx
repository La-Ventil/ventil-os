'use client';

import Image from 'next/image';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

export type UserAvatarProps = {
  user?: {
    email?: string | null;
    image?: string | null;
  } | null;
  size?: number;
  fill?: boolean;
  className?: string;
  objectFit?: 'contain' | 'cover';
};

export default function UserAvatar({
  user = null,
  size = 24,
  fill = false,
  className,
  objectFit = 'contain'
}: UserAvatarProps) {
  const t = useTranslations('pages.hub.navigation');
  const src = user?.image || '/avatar.svg';
  const alt = t('profileAvatarAlt', { email: user?.email ?? '' });

  if (fill) {
    return <Image src={src} alt={alt} fill className={clsx('user-avatar', className)} style={{ objectFit }} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={clsx('user-avatar', className)}
      style={{ objectFit }}
    />
  );
}
