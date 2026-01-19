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
import { useTranslations } from 'next-intl';
import { OpenBadgeIcon } from '@repo/ui/icons/open-badge-icon';
import LevelChip from '@repo/ui/level-chip';
import type { OpenBadge } from '@repo/domain/open-badge';
import Section from '@repo/ui/section';
import SectionSubtitle from '@repo/ui/section-subtitle';
import SectionTitle from '@repo/ui/section-title';
import styles from './page.module.css';

type OpenBadgeDetailsModalProps = {
  openBadge: OpenBadge | null;
  open: boolean;
  onClose: () => void;
};

export default function OpenBadgeDetailsModal({
  openBadge,
  open,
  onClose
}: OpenBadgeDetailsModalProps) {
  if (!openBadge) {
    return null;
  }
  const t = useTranslations('pages.hub.openBadges');
  const levels = openBadge.levels.map((levelEntry) => ({
    level: levelEntry.level,
    title: levelEntry.title ?? `Niveau ${levelEntry.level}`,
    body: levelEntry.body ?? ''
  }));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ className: styles.modal }}>
      <DialogContent className={styles.modalContent}>
        <IconButton aria-label={t('detailsModal.closeLabel')} onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
        <Section>
            <SectionTitle icon={<OpenBadgeIcon />}>{openBadge.title}</SectionTitle>
            <div className={styles.modalIllustration}>{t('detailsModal.illustrationPlaceholder')}</div>
                        <SectionSubtitle className={styles.sectionSubtitle}>
                {t('detailsModal.sectionSubtitle')}
              </SectionSubtitle>

              <Typography variant="body1">
                {openBadge.description}
              </Typography>
        </Section>

        <Section className={styles.modalActions}>
            <Button variant="contained" size="large" fullWidth>
              {t('detailsModal.actions.assign')}
            </Button>
            <Button variant="contained" size="large" fullWidth>
              {t('detailsModal.actions.download')}
            </Button>
        </Section>

        <Section className={styles.levelList}>
            {levels.map((level) => (
              <Accordion
                key={`${openBadge.id}-detail-${level.level}`}
                defaultExpanded={level.level === openBadge.activeLevel}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <LevelChip
                    level={level.level}
                    isActive={level.level === openBadge.activeLevel}
                    className={styles.levelChip}
                  />
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
        </Section>
      </DialogContent>
    </Dialog>
  );
}
