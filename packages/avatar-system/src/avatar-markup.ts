export const avatarLayerClassNames = [
  'emo-hands',
  'emo-acc',
  'front-hair',
  'cheeks',
  'face-details',
  'nose',
  'mouth',
  'facial-hair',
  'glasses',
  'eyebrows',
  'glasses-tiles',
  'eyes',
  'emo-face',
  'emo-effect',
  'face',
  'clothes',
  'body',
  'earrings',
  'ears',
  'back-hair',
] as const;

export function getAvatarMarkup() {
  const layers = avatarLayerClassNames
    .map((className) => `<div class="${className}"></div>`)
    .join('');

  return `<div class="avatar">${layers}</div>`;
}
