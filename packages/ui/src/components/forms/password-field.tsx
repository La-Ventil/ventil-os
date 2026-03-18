'use client';

import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export type PasswordFieldProps = Omit<TextFieldProps, 'type'> & {
  autoShowPassword?: boolean;
  showPasswordLabel: string;
  hidePasswordLabel: string;
  showToggle?: boolean;
};

export default function PasswordField({
  autoShowPassword = false,
  showPasswordLabel,
  hidePasswordLabel,
  showToggle = true,
  InputProps,
  ...props
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(autoShowPassword);

  const trailingAdornment = showToggle ? (
    <InputAdornment position="end">
      {InputProps?.endAdornment}
      <IconButton
        type="button"
        onClick={() => setShowPassword((current) => !current)}
        onMouseDown={(event) => event.preventDefault()}
        edge="end"
        aria-label={showPassword ? hidePasswordLabel : showPasswordLabel}
      >
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  ) : (
    InputProps?.endAdornment
  );

  return (
    <TextField
      {...props}
      type={showPassword ? 'text' : 'password'}
      InputProps={{ ...InputProps, endAdornment: trailingAdornment }}
    />
  );
}
