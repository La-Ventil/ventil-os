import Image from 'next/image';
import clsx from 'clsx';
import type { AvatarSelection } from '@repo/avatar-system';
import { Avatar } from '@repo/avatar-system/react';

export type UserAvatarServerProps = {
  user?: {
    image?: string | null;
    avatar?: AvatarSelection | null;
  } | null;
  alt: string;
  size?: number;
  fill?: boolean;
  className?: string;
  objectFit?: 'contain' | 'cover';
  avatarNoBody?: boolean;
};

export default function UserAvatarServer({
  user = null,
  alt,
  size = 24,
  fill = false,
  className,
  objectFit = 'contain',
  avatarNoBody = false
}: UserAvatarServerProps) {
  if (user?.avatar) {
    const avatarSizeClass = fill || size >= 75 ? 's1' : size >= 40 ? 's2' : 's3';
    const avatarBaseSize = fill || size >= 75 ? 100 : size >= 40 ? 50 : 30;
    const wrapperStyle = fill ? undefined : ({ width: size, height: size } as const);
    const innerStyle = fill
      ? undefined
      : ({ transform: `scale(${size / avatarBaseSize})`, transformOrigin: 'center center', flexShrink: 0 } as const);

    return (
      <div
        aria-label={alt}
        className={clsx('user-avatar', className)}
        style={{
          ...(fill ? { width: '100%', height: '100%' } : wrapperStyle),
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Avatar
          selection={user.avatar}
          noBody={avatarNoBody}
          className={avatarSizeClass}
          style={fill ? undefined : innerStyle}
        />
      </div>
    );
  }

  const src = user?.image || '/avatar.svg';

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
