'use client';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { openBadgeLevelDescriptionSchema, openBadgeLevelTitleSchema } from '@repo/application/forms';
import { useFieldLiveValidation } from '@repo/form/use-field-live-validation';
import LevelChip from '../level-chip';
import styles from './open-badge-levels-editor.module.css';

export type OpenBadgeLevelDraft = {
  title: string;
  description: string;
};

export type OpenBadgeLevelRowProps = {
  index: number;
  level: OpenBadgeLevelDraft;
  titleLabel: string;
  descriptionLabel: string;
  removeLabel: string;
  canRemove: boolean;
  onRemove: () => void;
  showDivider: boolean;
  titleServerError?: string;
  descriptionServerError?: string;
  translateError?: (key: string) => string;
};

/**
 * One level of the open badge editor.
 * Levels are a dynamic list, so each row owns its live validation: a hook cannot run inside a map.
 */
export default function OpenBadgeLevelRow({
  index,
  level,
  titleLabel,
  descriptionLabel,
  removeLabel,
  canRemove,
  onRemove,
  showDivider,
  titleServerError,
  descriptionServerError,
  translateError = (key) => key
}: OpenBadgeLevelRowProps) {
  const levelNumber = index + 1;
  const title = useFieldLiveValidation({
    schema: openBadgeLevelTitleSchema,
    value: level.title,
    serverError: titleServerError,
    t: translateError
  });
  const description = useFieldLiveValidation({
    schema: openBadgeLevelDescriptionSchema,
    value: level.description,
    serverError: descriptionServerError,
    t: translateError
  });

  return (
    <Stack spacing={1} className={styles.levelBlock}>
      <Stack direction="row" spacing={1} alignItems="center">
        <LevelChip level={levelNumber} isActive size="medium" className={styles.levelChip} />
        {canRemove && (
          <IconButton aria-label={removeLabel} onClick={onRemove} size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>
      <Stack spacing={1}>
        <TextField name={`levels[${index}].title`} label={titleLabel} required fullWidth {...title.fieldProps()} />
        <TextField
          name={`levels[${index}].description`}
          label={descriptionLabel}
          required
          fullWidth
          multiline
          minRows={3}
          {...description.fieldProps()}
        />
      </Stack>
      {showDivider && <Divider />}
    </Stack>
  );
}
