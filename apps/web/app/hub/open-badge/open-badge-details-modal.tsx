'use client';

import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { OpenBadgeIcon } from '@repo/ui/icons/open-badge-icon';
import { OpenBadgeCardData } from '@repo/ui/open-badge-card';
import styles from './page.module.css';

type OpenBadgeDetailsModalProps = {
  badge: OpenBadgeCardData | null;
  open: boolean;
  onClose: () => void;
};

const levelContent = [
  {
    level: 1,
    title: 'Niveau decouverte',
    body: "Decouvrez les bases de l'outil et les regles de securite essentielles."
  },
  {
    level: 2,
    title: 'Niveau intermediaire',
    body: 'Rendez-vous autonome sur les usages courants et les bons reglages.'
  },
  {
    level: 3,
    title: 'Niveau avance',
    body:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  }
];

export default function OpenBadgeDetailsModal({ badge, open, onClose }: OpenBadgeDetailsModalProps) {
  if (!badge) {
    return null;
  }

  const levels = badge.levels.map((level) => {
    const content = levelContent.find((entry) => entry.level === level);
    return {
      level,
      title: content?.title ?? `Niveau ${level}`,
      body: content?.body ?? ''
    };
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ className: styles.modal }}>
      <DialogContent className={styles.modalContent}>
        <Stack spacing={2.5}>
          <Box className={styles.modalHeader}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <OpenBadgeIcon />
              <Typography variant="h6" className={styles.modalTitle}>
                {badge.title}
              </Typography>
            </Stack>
            <IconButton aria-label="Fermer" onClick={onClose} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <div className={styles.modalIllustration}>Illustration en cours</div>

          <div>
            <Typography className={styles.sectionLabel}>Description</Typography>
            <Typography variant="body2" color="text.secondary">
              {badge.description}
            </Typography>
          </div>

          <Stack spacing={1.5} className={styles.modalActions}>
            <Button variant="contained" size="large" fullWidth>
              Attribuer l&apos;open badge
            </Button>
            <Button variant="contained" size="large" fullWidth>
              Telecharger mon open badge
            </Button>
          </Stack>

          <Stack spacing={1.5} className={styles.levelList}>
            {levels.map((level) => (
              <Accordion key={`${badge.id}-detail-${level.level}`} defaultExpanded={level.level === badge.activeLevel}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <div
                    className={
                      level.level === badge.activeLevel ? styles.levelDotActive : styles.levelDotInactive
                    }
                  >
                    {level.level}
                  </div>
                  <Typography variant="subtitle2" className={styles.levelTitle}>
                    {level.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">
                    {level.body}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
