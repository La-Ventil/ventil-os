import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styles from './section-title.module.css';

export type SectionTitleServerProps = {
  icon?: React.ReactNode;
  children: React.ReactNode;
  id?: string;
};

export default function SectionTitleServer({ icon, children, id }: SectionTitleServerProps) {
  return (
    <Box className={styles.root}>
      {icon}
      <Typography variant="h1" id={id}>
        {children}
      </Typography>
    </Box>
  );
}
