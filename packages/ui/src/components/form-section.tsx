import Stack, { type StackProps } from '@mui/material/Stack';

export type FormSectionProps = StackProps;

export default function FormSection({
  component = 'section',
  spacing = 2,
  ...props
}: FormSectionProps) {
  return <Stack component={component} spacing={spacing} {...props} />;
}
