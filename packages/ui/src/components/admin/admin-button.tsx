import Button, { type ButtonProps } from '@mui/material/Button';
import styles from './admin-button.module.css';

export type AdminButtonProps = ButtonProps;

export default function AdminButton({
  className,
  variant = 'contained',
  color = 'secondary',
  ...props
}: AdminButtonProps) {
  return (
    <Button
      className={`${styles.button}${className ? ` ${className}` : ''}`}
      variant={variant}
      color={color}
      {...props}
    />
  );
}
