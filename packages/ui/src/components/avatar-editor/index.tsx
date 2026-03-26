'use client';

import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import {
  createInitialAvatarSelection,
  getAvatarCategory,
  getAvatarColorSelectionKey,
  getAvatarEditorCategories
} from '@repo/avatar-system';
import { Avatar } from '@repo/avatar-system/react';
import type { AvatarSelection } from '@repo/avatar-system';
import { useTranslations } from 'next-intl';
import Link from '../link';
import Section from '../section';
import AvatarColorOptionButton from './avatar-color-option-button';
import { getCategoryIcon } from './avatar-editor-icons';
import styles from './avatar-editor.module.css';
import type { AvatarColorSection, AvatarOption, CategoryId } from './avatar-editor.types';
import AvatarVariantOptionButton from './avatar-variant-option-button';

const EDITOR_CATEGORIES = getAvatarEditorCategories();
const INITIAL_CATEGORY_ID = (EDITOR_CATEGORIES[0]?.id ?? 'face') as CategoryId;

type AvatarEditorProps = {
  onBack?: () => void;
};

export default function AvatarEditor({ onBack }: AvatarEditorProps) {
  const t = useTranslations('pages.hub.avatarSettings.editor');
  const [selection, setSelection] = useState<AvatarSelection>(() => createInitialAvatarSelection());
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>(INITIAL_CATEGORY_ID);

  const activeCategory = useMemo(() => getAvatarCategory(activeCategoryId), [activeCategoryId]);

  const options = useMemo<AvatarOption[]>(() => {
    const nextOptions = activeCategory.elements.map((option) => ({
      id: option.id,
      selected: selection[activeCategoryId] === option.id,
      previewSelection: { ...selection, [activeCategoryId]: option.id }
    }));

    if (!activeCategory.optional) {
      return nextOptions;
    }

    return [
      {
        id: 'none',
        selected: !selection[activeCategoryId],
        previewSelection: { ...selection, [activeCategoryId]: undefined }
      },
      ...nextOptions
    ];
  }, [activeCategory, activeCategoryId, selection]);

  const colorSections = useMemo<AvatarColorSection[]>(() => {
    return (activeCategory.colorGroups ?? [])
      .map((group, index) => {
        const selectionKey = getAvatarColorSelectionKey(activeCategory.id, group.id, index);
        const options = group.colors.map((color) => ({
          id: color.id,
          selected: selection[selectionKey] === color.id
        }));

        if (options.length === 0) {
          return null;
        }

        const title =
          activeCategory.colorGroups && activeCategory.colorGroups.length > 1
            ? t(`categories.${activeCategoryId}.colorGroups.${group.id}`)
            : t(`categories.${activeCategoryId}.colors`);

        return {
          groupId: group.id,
          selectionKey,
          title,
          options
        } satisfies AvatarColorSection;
      })
      .filter((section): section is AvatarColorSection => section !== null);
  }, [activeCategory, activeCategoryId, selection, t]);

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
          {EDITOR_CATEGORIES.map((category) => {
            const Icon = getCategoryIcon(category.id);

            return (
              <Tab
                key={category.id}
                value={category.id}
                aria-label={t(`categories.${category.id}.label`)}
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
                  setSelection((currentSelection) => ({
                    ...currentSelection,
                    [activeCategoryId]: option.id === 'none' ? undefined : option.id
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
