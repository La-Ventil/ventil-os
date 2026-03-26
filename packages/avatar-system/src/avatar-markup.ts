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

const avatarMarkup = `<div class="avatar">${avatarLayerClassNames.map((className) => `<div class="${className}"></div>`).join('')}</div>`;

export function getAvatarMarkup() {
  return avatarMarkup;
}
