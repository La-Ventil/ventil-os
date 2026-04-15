import type { StackProps } from '@mui/material';
import GridBackground from './grid-background.server';

export type CardListServerProps = StackProps;

export default function CardListServer({
  children,
  component = 'section',
  p = 2,
  spacing = 2,
  ...props
}: CardListServerProps) {
  return (
    <GridBackground component={component} p={p} spacing={spacing} {...props}>
      {children}
    </GridBackground>
  );
}
