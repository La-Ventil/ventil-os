'use client';

import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import type { AvatarSelection } from '@repo/avatar-system';
import { avatarConfig } from '@repo/avatar-system';
import { Avatar } from '@repo/avatar-system/react';
import Link from '@repo/ui/link';
import { avatarEyesIcon } from '@repo/ui/icons/avatar-eyes-icon';
import { avatarHairIcon } from '@repo/ui/icons/avatar-hair-icon';
import { avatarMouthIcon } from '@repo/ui/icons/avatar-mouth-icon';
import { avatarNoseIcon } from '@repo/ui/icons/avatar-nose-icon';
import { avatarShirtIcon } from '@repo/ui/icons/avatar-shirt-icon';
import { ProfileSmallIcon } from '@repo/ui/icons/profile-small-icon';
import { useTranslations } from 'next-intl';
import styles from './avatar-editor-draft.module.css';

type CategoryId =
  | 'face'
  | 'hair'
  | 'nose'
  | 'mouth'
  | 'eyes'
  | 'eyebrows'
  | 'glasses'
  | 'facial-hair'
  | 'face-details'
  | 'cheeks'
  | 'clothes';

type SelectionKeyByCategory = {
  face: 'face';
  hair: 'hair';
  nose: 'nose';
  mouth: 'mouth';
  eyes: 'eyes';
  eyebrows: 'eyebrows';
  glasses: 'glasses';
  'facial-hair': 'facialHair';
  'face-details': 'faceDetails';
  cheeks: 'cheeks';
  clothes: 'clothes';
};

type ColorKeyByCategory = Partial<Record<CategoryId, keyof AvatarSelection>>;

type AvatarOption = {
  id: string;
  previewSelection: AvatarSelection;
  selected: boolean;
};

type AvatarColorOption = {
  id: string;
  selected: boolean;
};

const DISPLAYED_CATEGORY_IDS: CategoryId[] = [
  'face',
  'hair',
  'nose',
  'mouth',
  'eyes',
  'eyebrows',
  'glasses',
  'facial-hair',
  'face-details',
  'cheeks',
  'clothes'
];

const OPTIONAL_CATEGORY_IDS = new Set<CategoryId>(['glasses', 'facial-hair', 'face-details', 'cheeks']);

const COLOR_KEY_BY_CATEGORY: ColorKeyByCategory = {
  face: 'skinColor',
  hair: 'hairColor',
  glasses: 'glassesColor',
  cheeks: 'cheeksColor'
};

const SELECTION_KEY_BY_CATEGORY: SelectionKeyByCategory = {
  face: 'face',
  hair: 'hair',
  nose: 'nose',
  mouth: 'mouth',
  eyes: 'eyes',
  eyebrows: 'eyebrows',
  glasses: 'glasses',
  'facial-hair': 'facialHair',
  'face-details': 'faceDetails',
  cheeks: 'cheeks',
  clothes: 'clothes'
};

const INITIAL_SELECTION: AvatarSelection = {
  face: 'face-shape-1',
  hair: 'hair-204',
  nose: 'nose-1',
  mouth: 'mouth-5',
  eyes: 'eyes-1',
  eyebrows: 'eyebrows-1',
  clothes: 'clothes-1',
  skinColor: 'skin-color-4',
  hairColor: 'hair-color-32',
  glassesColor: 'glasses-color-1',
  glassesTilesColor: 'glasses-tiles-color-1',
  cheeksColor: 'cheeks-color-1',
  earringsColor: 'earrings-color-1'
};

function EyebrowsIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 40 40">
      <path
        fill="currentColor"
        d="M11.41 17.29c1.73-1.42 3.96-2.15 6.2-2.03.55.03.98.5.95 1.06a1 1 0 0 1-1.05.95c-1.75-.09-3.51.48-4.87 1.6a1 1 0 1 1-1.23-1.55Zm11.08 0c1.36-1.12 3.12-1.69 4.87-1.6.56.03 1.03-.4 1.05-.95a1 1 0 0 0-.95-1.06c-2.24-.12-4.47.61-6.2 2.03a1 1 0 1 0 1.23 1.55Z"
      />
    </SvgIcon>
  );
}

function GlassesIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 40 40">
      <path
        fill="currentColor"
        d="M13 14a5 5 0 1 0 3.54 8.54A4.97 4.97 0 0 0 18 19h4a5 5 0 1 0 1.46-3.54A4.97 4.97 0 0 0 22 18h-4a4.97 4.97 0 0 0-1.46-2.54A4.98 4.98 0 0 0 13 14Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm14 0a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"
      />
    </SvgIcon>
  );
}

function FacialHairIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 40 40">
      <path
        fill="currentColor"
        d="M12.5 23c.83 0 1.5.67 1.5 1.5 0 1.93 1.57 3.5 3.5 3.5.54 0 1.08-.12 1.56-.37l.94-.46.94.46c.48.25 1.02.37 1.56.37 1.93 0 3.5-1.57 3.5-3.5 0-.83.67-1.5 1.5-1.5S29 23.67 29 24.5c0 3.58-2.92 6.5-6.5 6.5-.87 0-1.73-.18-2.5-.53-.77.35-1.63.53-2.5.53-3.58 0-6.5-2.92-6.5-6.5 0-.83.67-1.5 1.5-1.5Z"
      />
    </SvgIcon>
  );
}

function FaceDetailsIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 40 40">
      <path
        fill="currentColor"
        d="M20 11a1.75 1.75 0 1 0 0 3.5A1.75 1.75 0 0 0 20 11Zm-4 4.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm7.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm-6.5 4a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"
      />
    </SvgIcon>
  );
}

function CheeksIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 40 40">
      <circle fill="currentColor" cx="13" cy="21.5" r="2.25" />
      <circle fill="currentColor" cx="27" cy="21.5" r="2.25" />
    </SvgIcon>
  );
}

function getCategoryIcon(categoryId: CategoryId): (props: SvgIconProps) => React.JSX.Element {
  switch (categoryId) {
    case 'face':
      return ProfileSmallIcon;
    case 'hair':
      return avatarHairIcon;
    case 'nose':
      return avatarNoseIcon;
    case 'mouth':
      return avatarMouthIcon;
    case 'eyes':
      return avatarEyesIcon;
    case 'eyebrows':
      return EyebrowsIcon;
    case 'glasses':
      return GlassesIcon;
    case 'facial-hair':
      return FacialHairIcon;
    case 'face-details':
      return FaceDetailsIcon;
    case 'cheeks':
      return CheeksIcon;
    case 'clothes':
      return avatarShirtIcon;
  }
}

function getConfigElements(categoryId: CategoryId) {
  return Object.keys(avatarConfig.choices[categoryId].elements);
}

function getConfigColors(categoryId: CategoryId): string[] {
  const choice = avatarConfig.choices[categoryId];
  if (!('colors' in choice) || !choice.colors) {
    return [];
  }

  const colorGroups = Object.values(choice.colors);
  const firstColorGroup = colorGroups[0];

  return firstColorGroup ? Object.keys(firstColorGroup) : [];
}

export default function AvatarEditorDraft() {
  const t = useTranslations('pages.hub.avatarSettings.editor');
  const [selection, setSelection] = useState<AvatarSelection>(INITIAL_SELECTION);
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>('face');

  const options = useMemo<AvatarOption[]>(() => {
    const selectionKey = SELECTION_KEY_BY_CATEGORY[activeCategoryId];
    const configOptionIds = getConfigElements(activeCategoryId);
    const nextOptions = configOptionIds.map((optionId) => ({
      id: optionId,
      selected: selection[selectionKey] === optionId,
      previewSelection: { ...selection, [selectionKey]: optionId }
    }));

    if (!OPTIONAL_CATEGORY_IDS.has(activeCategoryId)) {
      return nextOptions;
    }

    return [
      {
        id: 'none',
        selected: !selection[selectionKey],
        previewSelection: { ...selection, [selectionKey]: undefined }
      },
      ...nextOptions
    ];
  }, [activeCategoryId, selection]);

  const colorKey = COLOR_KEY_BY_CATEGORY[activeCategoryId];
  const colorOptions = useMemo<AvatarColorOption[]>(() => {
    if (!colorKey) {
      return [];
    }

    return getConfigColors(activeCategoryId).map((colorId) => ({
      id: colorId,
      selected: selection[colorKey] === colorId
    }));
  }, [activeCategoryId, colorKey, selection]);

  const optionSectionTitle = t(`categories.${activeCategoryId}.options`);
  const colorSectionTitle = colorOptions.length > 0 ? t(`categories.${activeCategoryId}.colors`) : null;

  return (
    <section className={styles.shell}>
      <div className={styles.editorCard}>
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <ProfileSmallIcon fontSize="small" />
          </div>
          <div>
            <Typography variant="h5" component="h2">
              {t('title')}
            </Typography>
            <Typography className={styles.helperText} variant="body2">
              {t('helper')}
            </Typography>
          </div>
        </header>

        <div className={styles.previewStage}>
          <div className={styles.previewAvatar}>
            <Avatar selection={selection} />
          </div>
        </div>

        <nav className={styles.categoryRail} aria-label={t('categoryNavLabel')}>
          {DISPLAYED_CATEGORY_IDS.map((categoryId) => {
            const Icon = getCategoryIcon(categoryId);
            const isActive = categoryId === activeCategoryId;

            return (
              <button
                key={categoryId}
                type="button"
                className={styles.categoryButton}
                data-active={isActive ? 'true' : 'false'}
                aria-pressed={isActive}
                aria-label={t(`categories.${categoryId}.label`)}
                onClick={() => setActiveCategoryId(categoryId)}
              >
                <Icon fontSize="small" />
              </button>
            );
          })}
        </nav>

        <div className={styles.panel}>
          {colorSectionTitle ? (
            <section className={styles.sectionBlock}>
              <Typography className={styles.sectionTitle} variant="overline" component="h3">
                {colorSectionTitle}
              </Typography>
              <div className={styles.colorGrid}>
                {colorOptions.map((colorOption) => (
                  <button
                    key={colorOption.id}
                    type="button"
                    className={styles.colorButton}
                    data-active={colorOption.selected ? 'true' : 'false'}
                    aria-pressed={colorOption.selected}
                    aria-label={t('selectColor', { color: colorOption.id })}
                    onClick={() => {
                      if (!colorKey) {
                        return;
                      }

                      setSelection((currentSelection) => ({
                        ...currentSelection,
                        [colorKey]: colorOption.id
                      }));
                    }}
                  >
                    <span className={styles.colorSwatch} style={{ backgroundColor: `var(--${colorOption.id})` }} />
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          <section className={styles.sectionBlock}>
            <Typography className={styles.sectionTitle} variant="overline" component="h3">
              {optionSectionTitle}
            </Typography>
            <div className={styles.optionGrid}>
              {options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={styles.optionButton}
                  data-active={option.selected ? 'true' : 'false'}
                  aria-pressed={option.selected}
                  aria-label={
                    option.id === 'none'
                      ? t('noneOption')
                      : t('selectOption', { category: t(`categories.${activeCategoryId}.label`), option: option.id })
                  }
                  onClick={() => {
                    const selectionKey = SELECTION_KEY_BY_CATEGORY[activeCategoryId];
                    setSelection((currentSelection) => ({
                      ...currentSelection,
                      [selectionKey]: option.id === 'none' ? undefined : option.id
                    }));
                  }}
                >
                  <span className={styles.optionPreview}>
                    <Avatar selection={option.previewSelection} id="s1" />
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <footer className={styles.actions}>
          <Stack direction="row" spacing={2}>
            <Button component={Link} href="/hub/settings" variant="outlined" size="large" fullWidth>
              {t('back')}
            </Button>
            <Button variant="contained" size="large" fullWidth disabled>
              {t('save')}
            </Button>
          </Stack>
          <Typography className={styles.pendingText} variant="caption">
            {t('savePending')}
          </Typography>
        </footer>
      </div>
    </section>
  );
}
