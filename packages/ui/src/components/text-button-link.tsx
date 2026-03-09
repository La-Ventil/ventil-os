import MuiLink, { LinkProps } from '@mui/material/Link';
import styles from './text-button-link.module.css';

type TextButtonLinkProps = Omit<LinkProps<'button', object>, 'component' | 'type' | 'underline'>;

export default function TextButtonLink(props: TextButtonLinkProps) {
  const { className, ...rest } = props;
  return (
    <MuiLink
      component="button"
      type="button"
      underline="always"
      className={[styles.root, className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
}
