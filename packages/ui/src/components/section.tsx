import Stack, { StackProps } from '@mui/material/Stack';

export type SectionProps = StackProps;

export default function Section({ component = 'section', p = 2, spacing = 0, ...props }: SectionProps) {
  return <Stack component={component} p={p} spacing={spacing} {...props} />;
}
