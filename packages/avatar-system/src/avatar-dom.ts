import { buildAvatarClassName } from './avatar-classname';
import { getAvatarMarkup } from './avatar-markup';
import type { AvatarSelection } from './avatar.types';

type AvatarDomOptions = {
  noBody?: boolean;
  className?: string;
};

export function createAvatarElement(
  selection: AvatarSelection,
  options?: AvatarDomOptions,
) {
  const template = document.createElement('template');
  template.innerHTML = getAvatarMarkup();

  const element = template.content.firstElementChild;
  if (!(element instanceof HTMLDivElement)) {
    throw new Error('Failed to create avatar element.');
  }

  element.className = buildAvatarClassName(selection, {
    noBody: options?.noBody,
    className: options?.className,
  });

  return element;
}
