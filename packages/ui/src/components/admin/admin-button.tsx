import Button, { type ButtonProps } from '@mui/material/Button';
import styles from './admin-button.module.css';

export type AdminButtonProps = ButtonProps;

export default function AdminButton({ className, ...props }: AdminButtonProps) {
  return (
    <Button className={`${styles.button}${className ? ` ${className}` : ''}`} {...props} />
  );
}
