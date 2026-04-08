import '@repo/avatar-system/avatar.css';
import '@repo/avatar-system/editor-controls.css';
import './style.less';

import avatarCatalogUrl from '@repo/avatar-system/avatar.json?url';
import { buildAvatarClassName, createInitialAvatarSelectionFromConfig, loadAvatarConfig } from '@repo/avatar-system';
import type { AvatarSelection, AvatarSelectionDraft } from '@repo/avatar-system';

(async () => {
  const avatarConfig = await loadAvatarConfig(avatarCatalogUrl);

  const selection: AvatarSelectionDraft = createInitialAvatarSelectionFromConfig(avatarConfig);

  function setSelection(key: string, value: string | undefined) {
    selection[key] = value;
  }

  const selectionContainers = document.querySelectorAll('[data-selection-key]');
  const avatarElements = Array.from(document.querySelectorAll('.avatar'), (element) => ({
    element,
    sizeVariant: element.getAttribute('data-size-variant')
  }));

  const classNamePreview = document.getElementById('key');

  function renderAvatars() {
    const className = buildAvatarClassName(selection as AvatarSelection, { noBody: true });

    for (const { element, sizeVariant } of avatarElements) {
      element.className = sizeVariant ? `${className} ${sizeVariant}` : className;
    }

    if (classNamePreview) classNamePreview.textContent = className;

    syncActiveButtons();
  }

  function syncActiveButtons() {
    selectionContainers.forEach((container) => {
      const selectionKey = container.getAttribute('data-selection-key');
      if (!selectionKey) return;

      const active = selection[selectionKey] ?? '';
      container.querySelectorAll('button').forEach((button) => {
        button.classList.toggle('active', (button.dataset.value ?? button.id) === active);
      });
    });
  }

  function selectButton(e: Event) {
    const button = e.currentTarget;
    if (!(button instanceof HTMLButtonElement)) return;

    const container = button.closest('[data-selection-key]');
    const key = container?.getAttribute('data-selection-key');
    const value = button.dataset.value ?? button.id;
    if (key) {
      setSelection(key, value || undefined);
      renderAvatars();
    }
  }

  function randomize() {
    for (const container of document.querySelectorAll('[data-randomizable="true"]')) {
      const selectionKey = container.getAttribute('data-selection-key');
      if (!selectionKey) continue;
      const buttons = container.querySelectorAll<HTMLButtonElement>('button[id]');
      if (!buttons.length) continue;
      const picked = buttons[Math.floor(Math.random() * buttons.length)];
      if (!picked) continue;
      setSelection(selectionKey, picked.dataset.value ?? picked.id);
    }
    renderAvatars();
  }

  selectionContainers.forEach((container) => {
    container.querySelectorAll('button').forEach((button) => button.addEventListener('click', selectButton));
  });
  document.getElementById('random')?.addEventListener('click', randomize);

  renderAvatars();
})();
