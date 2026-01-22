'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { FormControlLabel, FormControlLabelProps } from '@mui/material';
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
}

export default function ProfileRadioGroup({ defaultValue }: ProfileRadioGroupProps) {
  const t = useTranslations('profileSelector');
  const [value, setValue] = useState<string>('');
  const optionKeyMap: Record<string, string> = {
    eleve_lycee: 'eleveLycee'
  };

  useEffect(() => {
    setValue(defaultValue ?? ProfileType.Member);
  }, [defaultValue]);

  return (
    <FormGroup className={styles.profileRadioGroupContainer}>
      <FormLabel className={styles.profileRadioGroupLabel} id="profile-label">
        {t('title')}
      </FormLabel>
      <Typography variant="body1">{t('subtitle')}</Typography>
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
  );
}
