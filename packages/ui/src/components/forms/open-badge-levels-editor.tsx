'use client';

import { useId, useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import AdminButton from '../admin/admin-button';
import LevelChip from '../level-chip';
import styles from './open-badge-levels-editor.module.css';

export type OpenBadgeLevelDraft = {
  title: string;
  description: string;
};

export type OpenBadgeLevelsEditorProps = {
  initialLevels?: OpenBadgeLevelDraft[];
  maxLevels?: number;
  error?: string | undefined;
  labels: {
    add: string;
    title: string;
    description: string;
    remove: string;
    chipPrefix: string;
  };
};

export default function OpenBadgeLevelsEditor({
  initialLevels = [],
  maxLevels = 5,
  error,
  labels
}: OpenBadgeLevelsEditorProps) {
  const fieldPrefix = useId();
  const [levels, setLevels] = useState<OpenBadgeLevelDraft[]>(
    initialLevels.length ? initialLevels : [{ title: '', description: '' }]
  );

  const addLevel = () => {
    if (levels.length >= maxLevels) return;
    setLevels((prev) => [...prev, { title: '', description: '' }]);
  };

  const removeLevel = (index: number) => {
    setLevels((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLevel = (index: number, patch: Partial<OpenBadgeLevelDraft>) => {
    setLevels((prev) => prev.map((lvl, i) => (i === index ? { ...lvl, ...patch } : lvl)));
  };

  return (
    <Stack spacing={2}>
      {levels.map((level, index) => {
        const levelNumber = index + 1;
        return (
          <Stack key={`${fieldPrefix}-${index}`} spacing={1} className={styles.levelBlock}>
            <Stack direction="row" spacing={1} alignItems="center">
              <LevelChip level={levelNumber} isActive size="medium" label={`${labels.chipPrefix} ${levelNumber}`} />
              {levels.length > 1 && (
                <IconButton aria-label={labels.remove} onClick={() => removeLevel(index)} size="small">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
            <Stack spacing={1}>
              <TextField
                name={`levels[${index}].title`}
                label={labels.title}
                required
                fullWidth
                defaultValue={level.title}
              />
              <TextField
                name={`levels[${index}].description`}
                label={labels.description}
                required
                fullWidth
                multiline
                minRows={3}
                defaultValue={level.description}
              />
            </Stack>
            {index < levels.length - 1 && <Divider />}
          </Stack>
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
      {error ? (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      ) : null}
    </Stack>
  );
}
