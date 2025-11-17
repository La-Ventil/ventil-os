'use client';

import * as React from 'react';
import MuiCheckbox, { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';

export const Checkbox = styled(MuiCheckbox)<MuiCheckboxProps>(
  ({ theme }) => `
  color: purple;
`
);
