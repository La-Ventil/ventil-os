'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import type { FormControlLabelProps } from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormGroup from '@mui/material/FormGroup';
import Radio from '@mui/material/Radio';
import { ProfileType } from '@repo/domain/profile-type';
import { FormLabel } from '../form-label';
import { RadioGroup } from '../radio-group';
import Typography from '@mui/material/Typography';
import styles from './profile-radio-group.module.css';

export interface ProfileRadioProps extends Omit<FormControlLabelProps, 'control'> {
  label: string;
  caption: string;
}

function ProfileRadioLabel({ label, caption }: { label: string; caption: string }) {
  return (
    <div className={styles.profileRadioLabel}>
      <Typography variant="body1">{label}</Typography>
      <Typography variant="caption">{caption}</Typography>
    </div>
  );
}

export function ProfileRadio({ label, caption, value, ...props }: ProfileRadioProps) {
  return (
    <FormControlLabel
      {...props}
      value={value}
      control={<Radio />}
      label={<ProfileRadioLabel label={label} caption={caption} />}
      className={styles.profileRadioContainer}
      disableTypography
    />
  );
}

export interface ProfileRadioGroupProps {
  defaultValue?: string;
  error?: boolean;
  helperText?: string;
}

export default function ProfileRadioGroup({ defaultValue, error = false, helperText }: ProfileRadioGroupProps) {
  const t = useTranslations('profileSelector');
  const [value, setValue] = useState<string>(defaultValue ?? ProfileType.Member);
  const optionKeyMap: Record<string, string> = {
    eleve_lycee: 'eleveLycee'
  };

  useEffect(() => {
    setValue(defaultValue ?? ProfileType.Member);
  }, [defaultValue]);

  return (
    <FormControl className={styles.profileRadioGroupContainer} error={error}>
      <FormLabel className={styles.profileRadioGroupLabel} id="profile-label">
        {t('title')}
      </FormLabel>
      <Typography variant="body1">{t('subtitle')}</Typography>
      <FormGroup>
        <RadioGroup
          aria-labelledby="profile-label"
          value={value}
          onChange={(event) => setValue(String(event.target.value))}
          name="profile"
        >
          {Object.values(ProfileType).map((key) => {
            const optionKey = optionKeyMap[key] ?? key;
            const label = t(`option.${optionKey}.label`);
            const description = t(`option.${optionKey}.description`);

            return <ProfileRadio key={key} label={label} value={key} caption={description} />;
          })}
        </RadioGroup>
      </FormGroup>
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
}
