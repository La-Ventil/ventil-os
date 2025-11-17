'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import Radio from '@mui/material/Radio';
import { styled } from '@mui/material/styles';
import { FormControlLabel, FormControlLabelProps } from '@mui/material';
import FormGroup, { FormGroupProps as MuiFormGroupProps } from '@mui/material/FormGroup';
import { ProfilType } from '@repo/domain/profil-type';
import { FormLabel } from '../form-label';
import { Typography } from '../typography';
import { RadioGroup } from '../radio-group';

const ProfilRadioContainer = styled(FormControlLabel)<FormControlLabelProps>(
  ({ theme }) => `
  color: DarkGoldenRod;
  
  ${Typography} {
    &.MuiTypography-body1 {
      color: DarkCyan;
    }
    &.MuiTypography-caption {
      color: DarkGreen;
    }
  }
`
);

export interface ProfilRadioProps extends Omit<FormControlLabelProps, 'control'> {
  label: string;
  caption: string;
}

export function ProfilRadio({ label, caption, value, ...props }: ProfilRadioProps) {
  return (
    <ProfilRadioContainer
      {...props}
      value={value}
      control={<Radio />}
      label={
        <div>
          <Typography variant="body1">{label}</Typography>
          <Typography variant="caption">{caption}</Typography>
        </div>
      }
      disableTypography
    />
  );
}

const ProfilRadioGroupContainer = styled(FormGroup)<MuiFormGroupProps>(
  ({ theme }) => `
  color: Chartreuse;

  ${FormLabel} {
    border: 1px solid Coral;
    color: Coral;
  }
  
  ${Typography} {
    border: 1px solid Crimson;
    color: Crimson;
  }
  
  ${RadioGroup} {
    border: 1px solid DarkGoldenRod;
    color: DarkGoldenRod;
  }
`
);

export default function ProfilRadioGroup() {
  const [value, setValue] = React.useState(ProfilType.Ventilacteur);
  const t = useTranslations('profil');

  return (
    <ProfilRadioGroupContainer>
      <FormLabel id="profil-label">Profil d’utilisation</FormLabel>
      <Typography variant="body1">Sélectionnez le profil correspondant à votre usage du lieu</Typography>
      <RadioGroup aria-labelledby="profil-label" defaultValue={ProfilType.Ventilacteur} name="profil">
        {Object.values(ProfilType).map((key) => {
          const label = t(`option.${key}.label`);
          const description = t(`option.${key}.description`);

          return <ProfilRadio key={key} label={label} value={key} caption={description} />;
        })}
      </RadioGroup>
    </ProfilRadioGroupContainer>
  );
}
