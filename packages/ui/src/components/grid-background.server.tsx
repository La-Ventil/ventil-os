import clsx from 'clsx';
import { Stack, type StackProps } from '@mui/material';
import styles from './grid-background.module.css';

export type GridBackgroundServerProps = StackProps;

export default function GridBackgroundServer({
  className,
  component = 'section',
  ...props
}: GridBackgroundServerProps) {
  return <Stack className={clsx(styles.root, className)} component={component} {...props} />;
}
