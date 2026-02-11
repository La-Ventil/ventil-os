'use client';

import type { JSX } from 'react';
import Stack from '@mui/material/Stack';
import type { StackProps } from '@mui/material/Stack';
import { useJsEnabled } from '@repo/form/use-js-enabled';

export type FormProps = Omit<StackProps<'form'>, 'component' | 'noValidate'> & {
  noValidate?: boolean;
};

const Form = ({ noValidate, spacing = 2, ...props }: FormProps): JSX.Element => {
  const jsEnabled = useJsEnabled();
  return <Stack component="form" spacing={spacing} {...props} noValidate={noValidate ?? jsEnabled} />;
};

export default Form;
