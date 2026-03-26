import type { AvatarSelection } from './avatar.types';

export function buildAvatarClassName(
  selection: AvatarSelection,
  options?: { noBody?: boolean; className?: string }
) {
  return ['avatar', options?.noBody ? 'no-body' : null, ...Object.values(selection), options?.className]
    .filter(Boolean)
    .join(' ');
}
