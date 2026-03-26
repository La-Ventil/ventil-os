import type { HTMLAttributes } from 'react';
import { buildAvatarClassName } from './avatar-classname';
import { avatarLayerClassNames } from './avatar-markup';
import type { AvatarSelection } from './avatar.types';

type AvatarProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  selection: AvatarSelection;
  noBody?: boolean;
};

export function Avatar({ selection, noBody = false, className, ...props }: AvatarProps) {
  return (
    <div
      {...props}
      className={buildAvatarClassName(selection, { noBody, className })}
    >
      {avatarLayerClassNames.map((layerClassName) => (
        <div key={layerClassName} className={layerClassName} />
      ))}
    </div>
  );
}
