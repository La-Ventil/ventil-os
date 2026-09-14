'use client';

import { useEffect, useId, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AdminButton from '../admin/admin-button';
import OpenBadgeLevelRow from './open-badge-level-row';
import type { OpenBadgeLevelDraft } from './open-badge-level-row';

export type { OpenBadgeLevelDraft };

export type OpenBadgeLevelsEditorProps = {
  initialLevels?: OpenBadgeLevelDraft[];
  maxLevels?: number;
  minLevels?: number;
  error?: string | undefined;
  fieldErrorFor?: (fieldPath: string) => string | undefined;
  onLevelsChange?: (levels: OpenBadgeLevelDraft[]) => void;
  translateError?: (key: string) => string;
  labels: {
    add: string;
    title: (levelNumber: number) => string;
    description: (levelNumber: number) => string;
    remove: string;
    minLevels?: string;
  };
};

export default function OpenBadgeLevelsEditor({
  initialLevels = [],
  maxLevels = 5,
  minLevels = 1,
  error,
  fieldErrorFor,
  onLevelsChange,
  translateError,
  labels
}: OpenBadgeLevelsEditorProps) {
  const fieldPrefix = useId();
  const [levels, setLevels] = useState<OpenBadgeLevelDraft[]>(
    initialLevels.length ? initialLevels : [{ title: '', description: '' }]
  );
  const collectionError = error ?? (levels.length < minLevels ? labels.minLevels : undefined);

  useEffect(() => {
    onLevelsChange?.(levels);
  }, [levels, onLevelsChange]);

  const addLevel = () => {
    if (levels.length >= maxLevels) return;
    setLevels((prev) => [...prev, { title: '', description: '' }]);
  };

  const removeLevel = (index: number) => {
    if (levels.length <= minLevels) return;
    setLevels((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Stack spacing={2}>
      {collectionError ? (
        <Typography variant="caption" color="error">
          {collectionError}
        </Typography>
      ) : null}

      {levels.map((level, index) => {
        const levelNumber = index + 1;
        return (
          <OpenBadgeLevelRow
            key={`${fieldPrefix}-${index}`}
            index={index}
            level={level}
            titleLabel={labels.title(levelNumber)}
            descriptionLabel={labels.description(levelNumber)}
            removeLabel={labels.remove}
            canRemove={levels.length > minLevels && index === levels.length - 1}
            onRemove={() => removeLevel(index)}
            showDivider={index < levels.length - 1}
            titleServerError={fieldErrorFor?.(`levels.${index}.title`)}
            descriptionServerError={fieldErrorFor?.(`levels.${index}.description`)}
            translateError={translateError}
          />
        );
      })}

      <AdminButton
        variant="contained"
        color="secondary"
        type="button"
        onClick={addLevel}
        disabled={levels.length >= maxLevels}
      >
        {labels.add}
      </AdminButton>
    </Stack>
  );
}
