'use client';

import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

export const TextField = styled(MuiTextField)<MuiTextFieldProps>(
  ({ theme }) => `
  border: 1px solid ${theme.palette.primary.main};

  & label {
    color: ${theme.palette.primary.dark};
  }
`
);
