import { Stack, type StackProps } from '@mui/material';

export type CardListProps = StackProps;

export default function CardList({ children, component = 'section', p = 2, spacing = 2, ...props }: CardListProps) {
  return (
    <Stack component={component} p={p} spacing={spacing} {...props}>
      {children}
    </Stack>
  );
}
