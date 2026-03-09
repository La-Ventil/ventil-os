'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { EducationLevel } from '@repo/domain/user/education-level';
import styles from './education-level-select.module.css';

export interface EducationLevelSelectProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  error?: boolean;
  helperText?: string;
}

export default function EducationLevelSelect({
  value,
  defaultValue,
  error,
  helperText,
  onChange
}: EducationLevelSelectProps) {
  const t = useTranslations('educationLevel');
  const [internalValue, setInternalValue] = useState<string>(defaultValue ?? '');
  const resolvedValue = value ?? internalValue;

  useEffect(() => {
    if (value === undefined) {
      setInternalValue(defaultValue ?? '');
    }
  }, [value, defaultValue]);

  return (
    <Box className={styles.root}>
      <FormControl fullWidth error={error}>
        <InputLabel id="education-level-select-label">{t('label')}</InputLabel>
        <Select
          name="educationLevel"
          labelId="education-level-select-label"
          id="education-level-select"
          value={resolvedValue}
          onChange={(event) => {
            const nextValue = String(event.target.value);
            if (value === undefined) {
              setInternalValue(nextValue);
            }
            onChange?.(nextValue);
          }}
          label={t('label')}
        >
          <MenuItem value="">{t('placeholder')}</MenuItem>
          {Object.values(EducationLevel).map((value) => {
            const label = t(`option.${value}.label`);

            return (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            );
          })}
        </Select>
        {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
      </FormControl>
    </Box>
  );
}
