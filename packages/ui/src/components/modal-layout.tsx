'use client';

import type { ReactNode } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import clsx from 'clsx';
import { getThemeSectionClassName, ThemeSection } from '../theme';
import styles from './modal-layout.module.css';

type ModalLayoutProps = {
  open: boolean;
  onClose: () => void;
  closeLabel: string;
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
  themeSection?: ThemeSection;
  paperClassName?: string;
  contentClassName?: string;
  closeClassName?: string;
};

export default function ModalLayout({
  open,
  onClose,
  closeLabel,
  children,
  maxWidth = 'sm',
  fullWidth = false,
  themeSection,
  paperClassName,
  contentClassName,
  closeClassName
}: ModalLayoutProps) {
  const themeClassName = themeSection ? getThemeSectionClassName(themeSection) : '';
  const paperClasses = clsx(styles.modal, themeClassName, paperClassName);
  const contentClasses = clsx(styles.modalContent, contentClassName);
  const closeClasses = clsx(styles.cross, closeClassName);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      slotProps={{
        paper: {
          className: paperClasses
        }
      }}
    >
      <DialogContent className={contentClasses}>
        <IconButton aria-label={closeLabel} onClick={onClose} size="small" className={closeClasses} color="primary">
          <CloseIcon fontSize="small" />
        </IconButton>
        {children}
      </DialogContent>
    </Dialog>
  );
}
