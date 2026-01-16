'use client';

import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import styles from './button.module.css';

export function Button({ className, ...props }: MuiButtonProps) {
  return <MuiButton className={[styles.root, className].filter(Boolean).join(' ')} {...props} />;
}
