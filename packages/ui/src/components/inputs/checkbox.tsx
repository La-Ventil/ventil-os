'use client';

import * as React from 'react';
import MuiCheckbox, { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';
import styles from './checkbox.module.css';

export function Checkbox({ className, ...props }: MuiCheckboxProps) {
  return <MuiCheckbox className={[styles.root, className].filter(Boolean).join(' ')} {...props} />;
}
