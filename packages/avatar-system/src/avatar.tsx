import type { HTMLAttributes } from 'react';
import { buildAvatarClassName } from './avatar-classname';
import type { AvatarSelection } from './avatar.types';

type AvatarProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  selection: AvatarSelection;
  noBody?: boolean;
};

export function Avatar({ selection, noBody = false, className, ...props }: AvatarProps) {
  return (
    <div
      {...props}
      className={buildAvatarClassName(selection, { noBody, extraClassName: className })}
    >
      <div className="emo-hands" />
      <div className="emo-acc" />
      <div className="front-hair" />
      <div className="cheeks" />
      <div className="face-details" />
      <div className="nose" />
      <div className="mouth" />
      <div className="facial-hair" />
      <div className="glasses" />
      <div className="eyebrows" />
      <div className="glasses-tiles" />
      <div className="eyes" />
      <div className="emo-face" />
      <div className="emo-effect" />
      <div className="face" />
      <div className="clothes" />
      <div className="body" />
      <div className="earrings" />
      <div className="ears" />
      <div className="back-hair" />
    </div>
  );
}
