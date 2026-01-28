import Stack, { type StackProps } from '@mui/material/Stack';
import styles from './form-actions.module.css';

export type FormActionsProps = StackProps;

export default function FormActions({
  component = 'div',
  direction = 'row',
  spacing = 2,
  justifyContent = 'center',
  ...props
}: FormActionsProps) {
  return (
    <Stack
      component={component}
      direction={direction}
      spacing={spacing}
      justifyContent={justifyContent}
      className={styles.root}
      {...props}
    />
  );
}
