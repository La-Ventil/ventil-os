'use client';

import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { avatarConfig } from '@repo/avatar-system';
import { Avatar } from '@repo/avatar-system/react';
import type { AvatarSelection } from '@repo/avatar-system';
import { useTranslations } from 'next-intl';
import Link from '../link';
import Section from '../section';
import AvatarColorOptionButton from './avatar-color-option-button';
import { getCategoryIcon } from './avatar-editor-icons';
import styles from './avatar-editor.module.css';
import type { AvatarColorSection, AvatarOption, CategoryId } from './avatar-editor.types';
import {
  COLOR_GROUPS_BY_CATEGORY,
  DISPLAYED_CATEGORY_IDS,
  INITIAL_SELECTION,
  OPTIONAL_CATEGORY_IDS,
  SELECTION_KEY_BY_CATEGORY
} from './avatar-editor.types';
import AvatarVariantOptionButton from './avatar-variant-option-button';

function getConfigElements(categoryId: CategoryId) {
  return Object.keys(avatarConfig.choices[categoryId].elements);
}

function getConfigColors(categoryId: CategoryId, groupId: string): string[] {
  const choice = avatarConfig.choices[categoryId];
  if (!('colors' in choice) || !choice.colors) {
    return [];
  }

  const colorGroup = choice.colors[groupId as keyof typeof choice.colors];
  return colorGroup ? Object.keys(colorGroup) : [];
}

type AvatarEditorProps = {
  onBack?: () => void;
};

export default function AvatarEditor({ onBack }: AvatarEditorProps) {
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

  const colorSections = useMemo<AvatarColorSection[]>(() => {
    const colorGroups = COLOR_GROUPS_BY_CATEGORY[activeCategoryId] ?? [];

    return colorGroups
      .map((group) => {
        const options = getConfigColors(activeCategoryId, group.groupId).map((colorId) => ({
          id: colorId,
          selected: selection[group.selectionKey] === colorId
        }));

        if (options.length === 0) {
          return null;
        }

        return {
          groupId: group.groupId,
          selectionKey: group.selectionKey,
          title: group.titleKey ? t(group.titleKey) : t(`categories.${activeCategoryId}.colors`),
          options
        } satisfies AvatarColorSection;
      })
      .filter((section): section is AvatarColorSection => section !== null);
  }, [activeCategoryId, selection, t]);

  const optionSectionTitle = t(`categories.${activeCategoryId}.options`);

  return (
    <section className={styles.root}>
      <div className={styles.previewStage}>
        <div className={styles.previewAvatar}>
          <Avatar selection={selection} />
        </div>

        <Tabs
          value={activeCategoryId}
          onChange={(_event, nextCategoryId: CategoryId) => setActiveCategoryId(nextCategoryId)}
          aria-label={t('categoryNavLabel')}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          className={styles.categoryTabs}
          slotProps={{
            indicator: {
              className: styles.categoryIndicator
            }
          }}
        >
          {DISPLAYED_CATEGORY_IDS.map((categoryId) => {
            const Icon = getCategoryIcon(categoryId);

            return (
              <Tab
                key={categoryId}
                value={categoryId}
                aria-label={t(`categories.${categoryId}.label`)}
                icon={<Icon fontSize="small" />}
                className={styles.categoryTab}
              />
            );
          })}
        </Tabs>
      </div>

      <Stack className={styles.panel} spacing={3}>
        {colorSections.map((colorSection) => (
          <Section key={colorSection.groupId} spacing={1}>
            <Typography variant="overline" component="h3">
              {colorSection.title}
            </Typography>
            <div className={styles.colorGrid}>
              {colorSection.options.map((colorOption) => (
                <AvatarColorOptionButton
                  key={colorOption.id}
                  colorId={colorOption.id}
                  selected={colorOption.selected}
                  ariaLabel={t('selectColor', { color: colorOption.id })}
                  onClick={() => {
                    setSelection((currentSelection) => ({
                      ...currentSelection,
                      [colorSection.selectionKey]: colorOption.id
                    }));
                  }}
                />
              ))}
            </div>
          </Section>
        ))}

        <Section spacing={1}>
          <Typography variant="overline" component="h3">
            {optionSectionTitle}
          </Typography>
          <div className={styles.optionGrid}>
            {options.map((option) => (
              <AvatarVariantOptionButton
                key={option.id}
                previewSelection={option.previewSelection}
                selected={option.selected}
                ariaLabel={
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
              />
            ))}
          </div>
        </Section>
      </Stack>

      <footer className={styles.actions}>
        <Stack direction="row" spacing={2}>
          {onBack ? (
            <Button onClick={onBack} variant="outlined" size="large" fullWidth>
              {t('back')}
            </Button>
          ) : (
            <Button component={Link} href="/hub/settings" variant="outlined" size="large" fullWidth>
              {t('back')}
            </Button>
          )}
          <Button variant="contained" size="large" fullWidth disabled>
            {t('save')}
          </Button>
        </Stack>
      </footer>
    </section>
  );
}
