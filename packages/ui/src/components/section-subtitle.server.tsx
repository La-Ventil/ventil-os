import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import styles from './section-subtitle.module.css';

export type SectionSubtitleServerProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export default function SectionSubtitleServer({ children, className, id }: SectionSubtitleServerProps) {
  return (
    <Typography variant="h3" color="secondary" className={clsx(styles.root, className)} id={id}>
      {children}
    </Typography>
  );
}
