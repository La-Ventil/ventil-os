import '@repo/avatar-system/styles.css';
import type { AvatarSelection } from '@repo/avatar-system';
import { avatarConfig, buildAvatarClassName, createAvatarElement } from '@repo/avatar-system';
import '../style.less';

const selection: AvatarSelection = {
  face: 'face-shape-1',
  eyes: 'eyes-1',
  eyebrows: 'eyebrows-1',
  mouth: 'mouth-5',
  nose: 'nose-1',
  hair: 'hair-100',
  clothes: 'clothes-1',
  'face-skin-color': 'skin-color-4',
  'hair-color': 'hair-color-13',
  'glasses-frame-color': 'glasses-color-1',
  'glasses-tiles-color': 'glasses-tiles-color-1',
  'cheeks-color': 'cheeks-color-1',
  'earrings-color': 'earrings-color-1'
};

const avatarNodes = Array.from(document.querySelectorAll<HTMLDivElement>('.avatar')).map((legacyNode) => {
  const avatarNode = createAvatarElement(selection, { noBody: true });
  if (legacyNode.id) {
    avatarNode.id = legacyNode.id;
  }
  legacyNode.replaceWith(avatarNode);
  return avatarNode;
});

function updateGroupActiveState(groupId: string, activeValue: string | undefined) {
  const group = document.getElementById(groupId);
  if (!group) {
    return;
  }

  const buttons = Array.from(group.querySelectorAll<HTMLButtonElement>('button'));
  for (const button of buttons) {
    const buttonValue = button.dataset.value ?? button.id;
    button.classList.toggle('active', buttonValue === (activeValue ?? ''));
  }
}

function syncButtonStates() {
  updateGroupActiveState('face', selection.face);
  updateGroupActiveState('skin', selection['face-skin-color']);
  updateGroupActiveState('hair', selection.hair);
  updateGroupActiveState('hair-color', selection['hair-color']);
  updateGroupActiveState('mouth', selection.mouth);
  updateGroupActiveState('nose', selection.nose);
  updateGroupActiveState('eyes', selection.eyes);
  updateGroupActiveState('eyebrows', selection.eyebrows);
  updateGroupActiveState('glasses', selection.glasses);
  updateGroupActiveState('glasses-color', selection['glasses-frame-color']);
  updateGroupActiveState('glasses-tiles-color', selection['glasses-tiles-color']);
  updateGroupActiveState('facial-hair', selection['facial-hair']);
  updateGroupActiveState('face-details', selection['face-details']);
  updateGroupActiveState('cheeks', selection.cheeks);
  updateGroupActiveState('cheeks-color', selection['cheeks-color']);
  updateGroupActiveState('earrings', selection.earrings);
  updateGroupActiveState('earrings-color', selection['earrings-color']);
}

function render() {
  const className = buildAvatarClassName(selection, { noBody: true });
  for (const avatarNode of avatarNodes) {
    avatarNode.className = className;
  }

  const keyNode = document.getElementById('key');
  if (keyNode) {
    keyNode.textContent = className;
  }

  syncButtonStates();
}

function pickRandomButton(groupId: string) {
  const group = document.getElementById(groupId);
  if (!group) {
    return null;
  }

  const buttons = Array.from(group.querySelectorAll<HTMLButtonElement>('button'));
  if (buttons.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * buttons.length);
  return buttons[randomIndex] ?? null;
}

function applyOptionSelection(type: string, value: string) {
  switch (type) {
    case 'face':
      selection.face = value;
      break;
    case 'face-details':
      selection['face-details'] = value || undefined;
      break;
    case 'cheeks':
      selection.cheeks = value || undefined;
      break;
    case 'eyes':
      selection.eyes = value;
      break;
    case 'mouth':
      selection.mouth = value;
      break;
    case 'nose':
      selection.nose = value;
      break;
    case 'earrings':
      selection.earrings = value || undefined;
      break;
    case 'glasses':
      selection.glasses = value || undefined;
      break;
    case 'eyebrows':
      selection.eyebrows = value;
      break;
    case 'hair':
      selection.hair = value;
      break;
    case 'facial-hair':
      selection['facial-hair'] = value || undefined;
      break;
    default:
      return;
  }

  render();
}

function applyColorSelection(groupId: string, value: string) {
  switch (groupId) {
    case 'skin':
      selection['face-skin-color'] = value;
      break;
    case 'hair-color':
      selection['hair-color'] = value;
      break;
    case 'glasses-color':
      selection['glasses-frame-color'] = value;
      break;
    case 'glasses-tiles-color':
      selection['glasses-tiles-color'] = value;
      break;
    case 'cheeks-color':
      selection['cheeks-color'] = value;
      break;
    case 'earrings-color':
      selection['earrings-color'] = value;
      break;
    default:
      return;
  }

  render();
}

const randomButton = document.getElementById('random');
randomButton?.addEventListener('click', () => {
  const randomGroups = ['face', 'skin', 'hair', 'hair-color', 'mouth', 'nose', 'eyes', 'eyebrows'];

  for (const groupId of randomGroups) {
    const button = pickRandomButton(groupId);
    if (!button) {
      continue;
    }

    if (groupId === 'skin' || groupId.endsWith('-color')) {
      applyColorSelection(groupId, button.id);
    } else {
      applyOptionSelection(button.dataset.type ?? groupId, button.dataset.value ?? button.id);
    }
  }
});

for (const button of document.querySelectorAll<HTMLButtonElement>('.option-buttons button')) {
  button.addEventListener('click', (event) => {
    const currentButton = event.currentTarget as HTMLButtonElement | null;
    if (!currentButton) {
      return;
    }

    applyOptionSelection(currentButton.dataset.type ?? '', currentButton.dataset.value ?? currentButton.id);
  });
}

for (const groupId of ['skin', 'hair-color', 'glasses-color', 'glasses-tiles-color', 'cheeks-color', 'earrings-color']) {
  const group = document.getElementById(groupId);
  if (!group) {
    continue;
  }

  for (const button of group.querySelectorAll<HTMLButtonElement>('button')) {
    button.addEventListener('click', (event) => {
      const currentButton = event.currentTarget as HTMLButtonElement | null;
      if (!currentButton) {
        return;
      }

      applyColorSelection(groupId, currentButton.id);
    });
  }
}

void avatarConfig;
render();
