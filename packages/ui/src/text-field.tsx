'use client';

import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

export const TextField = styled(MuiTextField)<MuiTextFieldProps>(
  ({ theme }) => `
  & label {
    color: ${theme.palette.primary.dark};
  }
`
);
