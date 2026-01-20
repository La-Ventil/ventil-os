import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { EducationLevel } from '@repo/domain/education-level';
import styles from './education-level-select.module.css';

export interface EducationLevelSelectProps {
  defaultValue?: string;
}

export default function EducationLevelSelect({ defaultValue }: EducationLevelSelectProps) {
  const t = useTranslations('educationLevel');

  return (
    <Box className={styles.root}>
      <FormControl fullWidth>
        <InputLabel id="education-level-select-label">{t('label')}</InputLabel>
        <Select
          name="educationLevel"
          labelId="education-level-select-label"
          id="education-level-select"
          defaultValue={defaultValue ?? ''}
          label={t('label')}
        >
          <MenuItem value={''}>{t('placeholder')}</MenuItem>
          {Object.values(EducationLevel).map((value) => {
            const label = t(`option.${value}.label`);

            return (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
