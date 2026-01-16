'use client';

import { useTranslations } from 'next-intl';
import { FormControlLabel, FormControlLabelProps } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import Radio from '@mui/material/Radio';
import { ProfilType } from '@repo/domain/profil-type';
import { FormLabel } from '../form-label';
import { RadioGroup } from '../radio-group';
import Typography from '@mui/material/Typography';
import styles from './profil-radio-group.module.css';

export interface ProfilRadioProps extends Omit<FormControlLabelProps, 'control'> {
  label: string;
  caption: string;
}

function ProfilRadioLabel({ label, caption }: { label: string; caption: string }) {
  return (
    <div className={styles.profilRadioLabel}>
      <Typography variant="body1">{label}</Typography>
      <Typography variant="caption">{caption}</Typography>
    </div>
  );
}

export function ProfilRadio({ label, caption, value, ...props }: ProfilRadioProps) {
  return (
    <FormControlLabel
      {...props}
      value={value}
      control={<Radio />}
      label={<ProfilRadioLabel label={label} caption={caption} />}
      className={styles.profilRadioContainer}
      disableTypography
    />
  );
}

export interface ProfilRadioGroupProps {
  defaultValue?: string;
}

export default function ProfilRadioGroup({ defaultValue }: ProfilRadioGroupProps) {
  const t = useTranslations('profil_selector');
  const optionKeyMap: Record<string, string> = {
    eleve_lycee: 'eleveLycee'
  };

  return (
    <FormGroup className={styles.profilRadioGroupContainer}>
      <FormLabel className={styles.profilRadioGroupLabel} id="profil-label">
        {t('title')}
      </FormLabel>
      <Typography variant="body1">{t('subtitle')}</Typography>
      <RadioGroup aria-labelledby="profil-label" defaultValue={defaultValue ?? ProfilType.Ventilacteur} name="profil">
        {Object.values(ProfilType).map((key) => {
          const optionKey = optionKeyMap[key] ?? key;
          const label = t(`option.${optionKey}.label`);
          const description = t(`option.${optionKey}.description`);

          return <ProfilRadio key={key} label={label} value={key} caption={description} />;
        })}
      </RadioGroup>
    </FormGroup>
  );
}
