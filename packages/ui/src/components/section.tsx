import Stack, { StackProps } from '@mui/material/Stack';

export type SectionProps = StackProps;

export default function Section({ component = 'section', py = 2, spacing = 2.5, ...props }: SectionProps) {
  return <Stack component={component} py={py} spacing={spacing} {...props} />;
}
