'use client';

import type { JSX, Key } from 'react';
import type { HTMLAttributes } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import type { UserSummaryViewModel } from '@repo/view-models/user-summary';
import UserAvatar from '../user-avatar';
import styles from './user-autocomplete.module.css';

export type UserAutocompleteProps<Multiple extends boolean = true> = {
  label: string;
  placeholder?: string;
  options: UserSummaryViewModel[];
  value: Multiple extends true ? UserSummaryViewModel[] : UserSummaryViewModel | null;
  onChange: (value: Multiple extends true ? UserSummaryViewModel[] : UserSummaryViewModel | null) => void;
  multiple?: Multiple;
  disabled?: boolean;
  helperText?: string;
};

const getUserLabel = (user: UserSummaryViewModel) =>
  `${user.firstName} ${user.lastName ?? ''}`.trim() || user.username;

export default function UserAutocomplete<Multiple extends boolean = true>({
  label,
  placeholder,
  options,
  value,
  onChange,
  multiple,
  disabled = false,
  helperText
}: UserAutocompleteProps<Multiple>): JSX.Element {
  const isMultiple = multiple ?? true;

  return (
    <Autocomplete<UserSummaryViewModel, Multiple, false, false>
      multiple={isMultiple as Multiple}
      options={options}
      value={value}
      onChange={(_, nextValue) => onChange(nextValue)}
      getOptionLabel={getUserLabel}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      filterSelectedOptions
      disabled={disabled}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} helperText={helperText} />
      )}
      renderOption={(props: HTMLAttributes<HTMLLIElement>, option) => {
        const { key, ...optionProps } = props as HTMLAttributes<HTMLLIElement> & { key: Key };
        return (
          <li key={key} {...optionProps} className={clsx(styles.option, optionProps.className)}>
          <UserAvatar user={option} size={28} className={styles.optionAvatar} />
          <div className={styles.optionText}>
            <Typography variant="body2" className={styles.optionName}>
              {getUserLabel(option)}
            </Typography>
            <Typography variant="caption" className={styles.optionMeta}>
              {option.username}
            </Typography>
          </div>
          </li>
        );
      }}
    />
  );
}
