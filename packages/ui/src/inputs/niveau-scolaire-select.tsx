import { useTranslations } from 'next-intl';
import Box, { BoxProps } from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import { NiveauScolaire } from '@repo/domain/niveau-scolaire';

const NiveauScolaireSelectContainer = styled(Box)<BoxProps>(
  ({ theme }) => `
  min-width: 120px;
  border: 1px solid ${theme.palette.divider};
`
);

export interface NiveauScolaireSelectProps {
  defaultValue?: string;
}

export default function NiveauScolaireSelect({ defaultValue }: NiveauScolaireSelectProps) {
  const t = useTranslations('niveauScolaire');

  return (
    <NiveauScolaireSelectContainer>
      <FormControl fullWidth>
        <InputLabel id="niveau-scolaire-select-label">{t('label')}</InputLabel>
        <Select
          name="niveauScolaire"
          labelId="niveau-scolaire-select-label"
          id="niveau-scolaire-select"
          defaultValue={defaultValue ?? ''}
          label={t('label')}
        >
          <MenuItem value={''}>{t('placeholder')}</MenuItem>
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
