import * as React from 'react';
import { useTranslations } from 'next-intl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { NiveauScolaire } from '@repo/domain/niveau-scolaire';
import Box, { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const NiveauScolaireSelectContainer = styled(Box)<BoxProps>(
  ({ theme }) => `
  border: 1px solid Coral;
`
);

export default function NiveauScolaireSelect() {
  const t = useTranslations('niveau_scolaire');
  const [value, setValue] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string);
  };

  return (
    <NiveauScolaireSelectContainer sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="niveau-scolaire-select-label">Niveau scolaire</InputLabel>
        <Select
          name="niveauScolaire"
          labelId="niveau-scolaire-select-label"
          id="niveau-scolaire-select"
          value={value}
          label="Niveau scolaire"
          onChange={handleChange}
        >
          <MenuItem value={''}>(Niveau scolaire)</MenuItem>
          {Object.values(NiveauScolaire).map((value) => {
            const label = t(`option.${value}.label`);

            return (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </NiveauScolaireSelectContainer>
  );
}
