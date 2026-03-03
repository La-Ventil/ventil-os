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

const getUserLabel = (user: UserSummaryViewModel) => user.fullName || user.username;

const normalizeSearchValue = (value?: string): string =>
  (value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

const scoreUserSearchMatch = (user: UserSummaryViewModel, query: string): number | null => {
  if (!query) {
    return 0;
  }

  const fullName = normalizeSearchValue(user.fullName);
  const username = normalizeSearchValue(user.username);
  const email = normalizeSearchValue(user.email ?? '');
  const primaryFields = [fullName, username].filter(Boolean);
  const primaryTokens = primaryFields.flatMap((value) => value.split(/\s+/).filter(Boolean));

  if (primaryFields.some((value) => value === query)) return 0;
  if (primaryFields.some((value) => value.startsWith(query))) return 1;
  if (primaryTokens.some((value) => value.startsWith(query))) return 2;
  if (primaryFields.some((value) => value.includes(query))) return 3;
  if (email === query) return 4;
  if (email.startsWith(query)) return 5;
  if (email.includes(query)) return 6;

  return null;
};

const filterUserOptions = (options: UserSummaryViewModel[], inputValue: string): UserSummaryViewModel[] => {
  const query = normalizeSearchValue(inputValue);

  if (!query) {
    return options;
  }

  return options
    .map((user, index) => ({
      user,
      index,
      score: scoreUserSearchMatch(user, query)
    }))
    .filter((entry): entry is { user: UserSummaryViewModel; index: number; score: number } => entry.score !== null)
    .sort((left, right) => {
      if (left.score !== right.score) {
        return left.score - right.score;
      }

      return left.index - right.index;
    })
    .map((entry) => entry.user);
};

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
      filterOptions={(availableOptions, state) => filterUserOptions(availableOptions, state.inputValue)}
      filterSelectedOptions={isMultiple}
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
