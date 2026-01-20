'use client';

import MuiCardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import styles from './card-header.module.css';

export type CardHeaderProps = {
  icon?: React.ReactNode;
  overline?: React.ReactNode;
  title: React.ReactNode;
  className?: string;
  overlineClassName?: string;
};

export default function CardHeader({ icon, overline, title, className, overlineClassName }: CardHeaderProps) {
  return (
    <MuiCardHeader
      avatar={icon}
      title={
        <div>
          {overline ? (
            <Typography variant="caption" color="primary" className={overlineClassName}>
              {overline}
            </Typography>
          ) : null}
          <Typography variant="subtitle1">{title}</Typography>
        </div>
      }
      className={clsx(styles.root, className)}
    />
  );
}
